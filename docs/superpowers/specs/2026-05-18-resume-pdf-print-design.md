# Resume PDF / print version — design spec

**Date:** 2026-05-18
**Author:** Dave Keller (with Claude)
**Status:** Approved for planning

## Goal

Make the `/resume` page the single source of truth for the resume content, and add a "Download PDF" button at the top-right that opens the browser's print dialog. A print stylesheet flips the page to a light, ink-friendly layout that fits cleanly on letter-size pages with smart page breaks. The user (or recruiter) saves to PDF or prints directly — no static `.pdf` asset and no PDF-generation library.

## Non-goals

- Generating a `.pdf` file via JS (no html2pdf, no react-pdf).
- Maintaining a separately-authored `public/Dave_Keller_Resume.pdf` asset (this replaces that approach).
- Restructuring or trimming the resume content for print — print uses the **same content**, restyled only.
- Optimizing print output for non-letter paper sizes (A4 etc.).
- Mobile-specific print styling — print from a phone is rare; desktop browsers are the target.

## Mechanism

Clicking the button calls `window.print()`. The browser's native print dialog opens, where the user can either print to paper or "Save as PDF". This is universally supported, free, requires no dependencies, and guarantees the printed/saved output reflects the current page content.

## Components

### `DownloadButton.tsx` (modified)

Currently an `<a href="/Dave_Keller_Resume.pdf">` stub. Converted to a `<button>` that triggers `window.print()` on click. Because of the click handler, it becomes a Client Component (`'use client'` at the top of the file).

- Element: `<button type="button" onClick={() => window.print()}>`
- Accessibility: `aria-label="Print or save resume as PDF"`
- Styling cues: keep the existing pill shape and muted-to-accent hover pattern. Mirrors `HomeLink`'s `text-sm font-medium` weight and color values so the two fixed elements feel like a paired set.
- Hidden in print: outer wrapper carries `print:hidden`.

### `Resume.tsx` (modified)

Renders the existing `<HomeLink />` fixed at top-left and adds a `<DownloadButton />` fixed at top-right. The two fixed wrappers sit as siblings of the `<main>` content.

```tsx
<div className="fixed top-6 left-6 z-20 print:hidden"><HomeLink /></div>
<div className="fixed top-6 right-6 z-20 print:hidden"><DownloadButton /></div>
<main className="relative z-10 mx-auto max-w-[1100px] px-6 pt-32 pb-24 print:max-w-full print:px-0 print:pt-0 print:pb-0">…</main>
```

The existing `HomeLink` wrapper in `Resume.tsx` already exists at `fixed top-6 left-6 z-20`; we add `print:hidden` to it as part of this change.

### `app/layout.tsx` (modified)

Wrap the three global chrome components in a single parent `<div className="site-chrome">` so the print stylesheet can hide all three with one selector:

```tsx
<div className="site-chrome">
  <NorthernLights />
  <Starfield />
  <ColorBar />
</div>
```

### `globals.css` (modified)

Add a single `@media print` block at the bottom of the file containing only what Tailwind utilities can't express (or that span multiple components):

```css
@media print {
  @page {
    size: letter;
    margin: 0.5in;
  }

  html, body {
    background: white !important;
    color: black !important;
  }

  body {
    font-size: 11pt;
  }

  .site-chrome {
    display: none !important;
  }

  /* Avoid orphaned headings and split job entries */
  h2, h3 {
    break-after: avoid;
  }
}
```

The `break-inside: avoid` rule for job entries is applied per-component via Tailwind's `print:break-inside-avoid` utility (cleaner than a global selector).

## Per-component print overrides (Tailwind `print:` variants)

- **`Resume.tsx`** root `<main>`: `print:max-w-full print:px-0 print:pt-0 print:pb-0`.
- **`Header.tsx`** outer header: `print:flex-row print:items-center print:justify-between` (force the row layout regardless of viewport). Headshot image: `print:h-[72px] print:w-[72px] print:border-gray-300`. Name `<h1>` and contact `<ul>` get `print:text-black`; links lose hover and get `print:text-black`.
- **`SectionLabel.tsx`**: `print:text-gray-600 print:border-gray-300`.
- **`JobEntry.tsx`** root `<article>`: `print:mb-6 print:break-inside-avoid`. Role line: `print:text-black`. Summary: `print:text-gray-800`. Bullet `<li>` text: `print:text-gray-800`. Bullet `before` marker (currently `text-(--color-2)`): `print:before:text-gray-700`.
- **`JobEntryCondensed.tsx`** root: `print:mb-4 print:break-inside-avoid`. Role: `print:text-black`. Summary: `print:text-gray-800`.
- **`JobHeaderRow.tsx`** company `<h3>`: `print:text-black`. Dates/location `<p>`: `print:text-gray-700`.
- **`Resume.tsx`** Highlights/Skills/Interests `<li>` items: `print:text-gray-800` and bullet `+` marker: `print:before:text-gray-700`.

## Layout & page fit

- **Page setup:** letter (8.5"×11"), 0.5" margins → ~7.5"×10" content area.
- **Target:** 2 pages. Page 1: Header + Highlights/Skills + Strangeworks + QuotaPath. Page 2: OneAssembly + BnbFinder + condensed entries + Interests. Approximate — exact flow is determined by content; we only enforce page-break hints to prevent ugly splits.
- **Header in print:** the existing `flex-col sm:flex-row` Header is forced into row layout regardless of viewport. Headshot shrinks from 96px to 72px to save vertical space. Contact info stays right-aligned.
- **Highlights + Skills grid:** the existing `md:grid-cols-3` two-column layout already prints well at letter width. Force it with `print:grid-cols-3` so it doesn't collapse if print preview uses a narrow viewport.
- **Experience entries:** each `JobEntry` and `JobEntryCondensed` carries `print:break-inside-avoid` so a single job never splits across pages.
- **Margins between entries:** reduced for print via `print:mb-6` (full) and `print:mb-4` (condensed) — current values (`mb-12`/`mb-8`) are too generous on paper.

## Visual treatment in print

- **Background:** white.
- **Body text:** black.
- **Muted text** (dates, location, summary): `text-gray-700` / `text-gray-800` for slight hierarchy without full color.
- **Section labels:** `text-gray-600` — retains the all-caps muted hierarchy in grayscale.
- **Bullet `+` markers:** `text-gray-700` — preserves the structural cue without burning ink on full accent color.
- **Dividers** (`border-white/10`): `border-gray-300`.
- **Headshot:** kept at 72px with a `border-gray-300` border. Humanizes the resume. If browsers strip the image, fall back to dropping it — but the default `print-color-adjust` should let it through.
- **Animated chrome** (NorthernLights, Starfield, ColorBar): hidden via the `.site-chrome` wrapper in `@media print`.
- **Fixed UI** (HomeLink, DownloadButton): hidden via `print:hidden` on their wrappers.

## File changes

### Modified files

- `app/layout.tsx` — wrap the three chrome components in `<div className="site-chrome">`.
- `app/globals.css` — add the `@media print` block at the bottom.
- `components/Resume.tsx` — render `<DownloadButton />` in a `fixed top-6 right-6 z-20 print:hidden` wrapper; add `print:hidden` to the existing HomeLink wrapper; add `print:` overrides to the `<main>` and to the Highlights/Skills/Interests `<li>` items.
- `components/resume/DownloadButton.tsx` — convert from `<a>` to client-side `<button>` calling `window.print()`; add `aria-label`.
- `components/resume/Header.tsx` — add `print:` overrides for layout, colors, and headshot size.
- `components/resume/SectionLabel.tsx` — add `print:` overrides for color and border.
- `components/resume/JobEntry.tsx` — add `print:break-inside-avoid`, margin reduction, and color overrides on text/bullet markers.
- `components/resume/JobEntryCondensed.tsx` — same pattern as `JobEntry`.
- `components/resume/JobHeaderRow.tsx` — `print:` color overrides for company name and dates/location.

### Files NOT changed

- `public/Dave_Keller_Resume.pdf` — not needed; the static asset reference is removed when `DownloadButton` switches to `window.print()`.
- `components/resume/resumeData.ts` — content is unchanged.
- `components/resume/HomeLink.tsx` — its wrapper in `Resume.tsx` gets `print:hidden` but the component itself is untouched.

## Behavior

- Resume page renders normally on screen — unchanged from current behavior.
- Clicking "Download PDF" opens the browser's print dialog.
- In the print dialog, the user sees the resume rendered in print styles: white background, black text, no animated chrome, no fixed UI buttons, content fitting letter-size pages with smart breaks.
- User can hit "Print" (sends to a printer) or "Save as PDF" (downloads a `.pdf`).
- Direct `Cmd+P` / `Ctrl+P` also works and produces the same output.

## Testing

Manual verification in print preview across browsers:

1. **Chrome / macOS** — open `/resume`, click "Download PDF". Verify:
   - Print dialog opens.
   - Layout is light theme (white bg, dark text).
   - Aurora / starfield / color bar are hidden.
   - HomeLink and DownloadButton are hidden.
   - Content fits 2 letter pages (approx) — no job entry split across pages.
   - Save as PDF produces a clean file.

2. **Safari / macOS** — same flow. Verify print preview matches Chrome.

3. **Firefox / macOS** — same flow. Verify print preview matches.

4. **On-screen verification** — on-screen rendering at desktop and mobile widths is unchanged from current behavior. The print button is visible at top-right in both.

5. **Keyboard shortcut** — `Cmd+P` from `/resume` produces the same print preview as the button.

No automated tests are present in the project today, so no test file additions are required. Verification is manual print preview.

## Open items resolved during implementation

- **Final body font-size** — start at 11pt; if 2-page fit is tight, tune down to 10.5pt or 10pt.
- **Headshot** — keep at 72px; drop only if it visibly prevents the 2-page target.
- **kidastro.com URL injection** — not needed. The existing Header doesn't display the site URL on screen, and "same content, restyled only" precludes adding it for print.
- **`print-color-adjust: exact`** — apply only if Chrome/Safari strip the headshot border or other essential color elements. Default behavior should work for an all-grayscale print version.
