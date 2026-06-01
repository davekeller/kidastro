# Resume PDF download + print stylesheet — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Download PDF" button at the top-right of `/resume` that triggers `window.print()`, plus a print stylesheet that flips the page to a light, ink-friendly layout fitting cleanly on letter-size pages.

**Architecture:** Hybrid CSS approach — `globals.css` `@media print` block for `@page` rules and global chrome hiding; Tailwind `print:` variants on components for per-element color and spacing overrides. The page becomes the single source of truth; no static PDF asset.

**Tech Stack:** Next.js 14+ App Router, React, Tailwind CSS v4, TypeScript. No new dependencies.

**Verification:** This project has no test framework. Verification is manual print preview in browsers. Per-phase verification runs `npm run dev` and uses Playwright (via MCP) to emulate print media and take screenshots of `/resume`.

**Reference spec:** `docs/superpowers/specs/2026-05-18-resume-pdf-print-design.md`

---

## Phase 1: Foundation — chrome wrapper, print stylesheet, button wiring

### Task 1: Wrap global chrome components in a single parent

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add a wrapping `<div className="site-chrome">` around the three chrome components**

Replace lines 32–34 of `app/layout.tsx`:

```tsx
        <div className="site-chrome">
          <NorthernLights />
          <Starfield />
          <ColorBar />
        </div>
```

The `site-chrome` class is targeted by the `@media print` block (added in Task 2) to hide all three chrome elements with one selector.

### Task 2: Add `@media print` block to globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Append the print block to the end of `globals.css`**

Add to the bottom of the file (after line 58):

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

  h2, h3 {
    break-after: avoid;
  }
}
```

The `@page` rule sets letter size with 0.5" margins. The `html, body` reset overrides the dark gradient. The `.site-chrome` selector hides the wrapper added in Task 1. The `break-after: avoid` prevents section headings from being orphaned at the bottom of a page.

### Task 3: Convert DownloadButton to a client-side print trigger

**Files:**
- Modify: `components/resume/DownloadButton.tsx`

- [ ] **Step 1: Rewrite the file to use a button + `window.print()`**

Replace the entire contents of `components/resume/DownloadButton.tsx`:

```tsx
'use client';

import React from 'react';

const DownloadButton = () => {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label="Print or save resume as PDF"
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-5 py-2 text-sm font-medium text-white/70 backdrop-blur-md transition-colors hover:border-(--color-2) hover:text-(--color-2)"
    >
      Download PDF
    </button>
  );
};

export default DownloadButton;
```

Notes:
- `'use client'` is required because of the `onClick` handler.
- Styling matches the previous `<a>` element; only the element type and behavior change.
- `aria-label` clarifies the action for screen readers since the visible text says "Download PDF" but the action is "open print dialog".

### Task 4: Add DownloadButton to Resume.tsx and apply `print:` to main + HomeLink wrapper

**Files:**
- Modify: `components/Resume.tsx`

- [ ] **Step 1: Import `DownloadButton`**

After line 5 (`import JobEntryCondensed from './resume/JobEntryCondensed';`), add:

```tsx
import DownloadButton from './resume/DownloadButton';
```

- [ ] **Step 2: Update the main element and HomeLink wrapper, add DownloadButton wrapper**

Replace lines 11–14 (the existing `<main>` and `<HomeLink>` wrapper):

```tsx
    <main className="relative z-10 mx-auto max-w-[1100px] px-6 pt-32 pb-24 print:max-w-full print:px-0 print:pt-0 print:pb-0">
      <div className="fixed top-6 left-6 z-20 print:hidden">
        <HomeLink />
      </div>
      <div className="fixed top-6 right-6 z-20 print:hidden">
        <DownloadButton />
      </div>
```

The `<main>` gets `print:max-w-full print:px-0 print:pt-0 print:pb-0` so the print version uses the full content area defined by `@page` margins instead of inheriting the screen-mode max-width and padding. The two fixed wrappers (`HomeLink` left, `DownloadButton` right) both get `print:hidden`.

### Task 5: Verify Phase 1 — dev server compiles and page renders

- [ ] **Step 1: Start dev server in the background**

```bash
npm run dev
```

Wait for "Ready" output. Expected: server listening on `http://localhost:3000` with no compile errors.

- [ ] **Step 2: Verify `/resume` renders on screen**

Use the Playwright MCP `browser_navigate` tool to load `http://localhost:3000/resume`. Confirm the page renders without console errors. Expected: resume page visible, HomeLink at top-left, DownloadButton at top-right.

- [ ] **Step 3: Verify print preview**

Use Playwright `browser_evaluate` to emulate print media, then take a screenshot:

```js
() => {
  const sheet = document.styleSheets[0];
  // print media emulation handled via DevTools protocol — use browser_take_screenshot with print emulation
}
```

If `browser_take_screenshot` does not support print emulation directly, use `browser_evaluate` to inspect computed styles on key elements (e.g., `document.querySelector('main').style` after toggling media), or call `window.print()` and observe via console. Acceptable fallback: confirm the `@media print` rules are present in the stylesheet via `document.styleSheets`.

If print emulation is not available, skip to the next step.

- [ ] **Step 4: Confirm button calls window.print()**

In Playwright, click the "Download PDF" button. Expected: the browser print dialog opens (Playwright may auto-dismiss it; what matters is no JS error).

- [ ] **Step 5: Commit and push Phase 1**

```bash
git add app/layout.tsx app/globals.css components/resume/DownloadButton.tsx components/Resume.tsx
git commit -m "Add Download PDF button and print stylesheet foundation"
git push -u origin dave/resume-v2
```

---

## Phase 2: Per-component print overrides

### Task 6: Header.tsx print overrides

**Files:**
- Modify: `components/resume/Header.tsx`

- [ ] **Step 1: Force row layout, shrink headshot, and recolor text for print**

Replace line 6 (`<header className="...">`):

```tsx
    <header className="mb-8 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between print:flex-row print:items-center print:justify-between print:mb-6">
```

Replace lines 7–22 with print-aware versions:

```tsx
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center print:flex-row print:items-center print:gap-4">
        <Image
          src="/imgs/dave.jpg"
          alt="Dave Keller"
          width={96}
          height={96}
          className="h-[96px] w-[96px] rounded-full border-2 border-white/10 object-cover print:h-[72px] print:w-[72px] print:border print:border-gray-300"
          priority
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl print:text-3xl print:text-black">Dave Keller</h1>
          <p className="mt-2 text-base text-white/60 print:text-sm print:text-gray-700">
            Design Engineer + Product UX/UI Designer
          </p>
        </div>
      </div>
```

Replace lines 24–44 (the contact `<ul>`):

```tsx
      <ul className="text-sm text-white/60 sm:text-right print:text-xs print:text-black">
        <li>512.595.6213</li>
        <li>
          <a
            href="mailto:davekeller@me.com?subject=Hey Dave!"
            className="transition-colors hover:text-(--color-3) print:text-black"
          >
            davekeller@me.com
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/dkells/"
            className="transition-colors hover:text-(--color-3) print:text-black"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/dkells
          </a>
        </li>
      </ul>
```

### Task 7: SectionLabel.tsx print overrides

**Files:**
- Modify: `components/resume/SectionLabel.tsx`

- [ ] **Step 1: Add `print:` overrides for color, border, and margin**

Replace line 9 (`<h2 ...>`):

```tsx
    <h2 className="mb-6 border-b border-white/10 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40 print:mb-3 print:pb-2 print:text-gray-600 print:border-gray-300">
```

### Task 8: JobHeaderRow.tsx print overrides

**Files:**
- Modify: `components/resume/JobHeaderRow.tsx`

- [ ] **Step 1: Recolor company name and dates/location for print**

Replace lines 11–16:

```tsx
    <div className="flex flex-col items-baseline gap-1 sm:flex-row sm:flex-wrap sm:gap-4 print:flex-row print:flex-wrap print:gap-3">
      <h3 className="text-2xl font-bold text-white print:text-base print:text-black">{company}</h3>
      <p className="text-sm text-white/40 print:text-xs print:text-gray-700">
        {dates} · {location}
      </p>
    </div>
```

### Task 9: JobEntry.tsx print overrides

**Files:**
- Modify: `components/resume/JobEntry.tsx`

- [ ] **Step 1: Add break-inside-avoid, recolor text and bullets, tighten margins**

Replace lines 11–25:

```tsx
    <article className="mb-12 print:mb-6 print:break-inside-avoid">
      <JobHeaderRow company={job.company} dates={job.dates} location={job.location} />
      <p className="mt-1 text-base font-semibold text-white print:mt-0 print:text-sm print:text-black">{job.role}</p>
      <p className="mt-3 text-base leading-snug text-white/85 print:mt-2 print:text-sm print:leading-snug print:text-gray-800">{job.summary}</p>
      <ul className="mt-4 space-y-4 print:mt-2 print:space-y-1">
        {job.bullets.map((bullet, i) => (
          <li
            key={i}
            className="relative pl-6 text-base leading-snug text-white/80 before:absolute before:left-0 before:top-0 before:font-bold before:text-(--color-2) before:content-['+'] print:pl-4 print:text-sm print:leading-snug print:text-gray-800 print:before:text-gray-700"
          >
            {bullet}
          </li>
        ))}
      </ul>
    </article>
```

### Task 10: JobEntryCondensed.tsx print overrides

**Files:**
- Modify: `components/resume/JobEntryCondensed.tsx`

- [ ] **Step 1: Add break-inside-avoid, recolor text, tighten margins**

Replace lines 11–17:

```tsx
    <article className="mb-8 print:mb-4 print:break-inside-avoid">
      <JobHeaderRow company={job.company} dates={job.dates} location={job.location} />
      <p className="mt-1 text-sm font-semibold text-white print:mt-0 print:text-xs print:text-black">{job.role}</p>
      <p className="mt-2 text-base leading-snug text-white/80 print:mt-1 print:text-sm print:leading-snug print:text-gray-800">{job.summary}</p>
    </article>
```

### Task 11: Resume.tsx — Highlights / Skills / Interests list print overrides

**Files:**
- Modify: `components/Resume.tsx`

- [ ] **Step 1: Add `print:` overrides to the Highlights/Skills section and `<li>` items**

Replace line 17 (`<section className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-3">`):

```tsx
      <section className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-3 print:mb-8 print:grid-cols-3 print:gap-6">
```

Replace lines 22–27 (the Highlights `<li>`):

```tsx
              <li
                key={i}
                className="relative pl-6 text-base leading-snug text-white/85 before:absolute before:left-0 before:top-0 before:font-bold before:text-(--color-2) before:content-['+'] print:pl-4 print:text-sm print:leading-snug print:text-gray-800 print:before:text-gray-700"
              >
                {item}
              </li>
```

Replace lines 35–40 (the Skills `<li>`):

```tsx
              <li
                key={i}
                className="relative pl-6 text-base leading-snug text-white/85 before:absolute before:left-0 before:top-0 before:font-bold before:text-(--color-2) before:content-['+'] print:pl-4 print:text-sm print:leading-snug print:text-gray-800 print:before:text-gray-700"
              >
                {item}
              </li>
```

Replace line 46 (the Experience `<section>`):

```tsx
      <section className="mb-16 print:mb-8">
```

Replace line 56 (the Interests `<section>`):

```tsx
      <section className="print:mb-0">
```

Replace lines 64–70 (the Interests `<li>`):

```tsx
            <li
              key={i}
              className="relative pl-6 text-base leading-snug text-white/85 before:absolute before:left-0 before:top-0 before:font-bold before:text-(--color-2) before:content-['+'] print:pl-4 print:text-sm print:leading-snug print:text-gray-800 print:before:text-gray-700"
            >
              {item}
            </li>
```

### Task 12: Verify Phase 2 — print preview check

- [ ] **Step 1: Confirm dev server still running (or restart)**

Dev server should still be running from Phase 1. If not:

```bash
npm run dev
```

- [ ] **Step 2: Reload `/resume` and verify on-screen layout unchanged**

Navigate to `http://localhost:3000/resume` via Playwright. Confirm the page looks identical to before — print: utilities should not affect screen rendering.

- [ ] **Step 3: Emulate print media and verify print layout**

Use Playwright's print-emulation capability (e.g., `browser_evaluate` to set `window.matchMedia` or use `Page.emulateMedia` via the Playwright API) to switch to print mode. Take a screenshot. Verify:
- White background.
- Black text.
- HomeLink and DownloadButton not visible.
- Aurora/starfield/color-bar not visible.
- Two-page layout reasonable (content fits in ~2 letter pages).

If Playwright can't directly emulate print, fall back to verifying computed styles on key elements via `browser_evaluate`:

```js
() => ({
  bodyBg: getComputedStyle(document.body).background,
  mainText: getComputedStyle(document.querySelector('main')).color,
  chromeDisplay: getComputedStyle(document.querySelector('.site-chrome')).display,
})
```

This won't reflect `@media print` rules without emulation, but confirms the screen rendering is intact.

- [ ] **Step 4: Commit and push Phase 2**

```bash
git add components/resume/Header.tsx components/resume/SectionLabel.tsx components/resume/JobHeaderRow.tsx components/resume/JobEntry.tsx components/resume/JobEntryCondensed.tsx components/Resume.tsx
git commit -m "Add per-component print styles for resume page"
git push origin dave/resume-v2
```

---

## Phase 3: Final verification

### Task 13: Cross-browser sanity (best-effort, automated only)

- [ ] **Step 1: Capture print preview screenshot via Playwright with `emulateMedia: print`**

If the Playwright MCP supports `browser_evaluate` with the `Emulation.setEmulatedMedia` CDP call, use it. Otherwise call:

```js
() => {
  // Best-effort: set the matchMedia mock by injecting a stylesheet that mirrors @media print rules
  // Then take a regular screenshot
}
```

Manual cross-browser verification (Chrome, Safari, Firefox) is out of scope for autonomous execution and is left for the user to perform after pushing.

- [ ] **Step 2: Confirm no console errors in dev server output**

Inspect the dev server logs from Phase 1's background process. Expected: no errors, no warnings related to the resume page.

- [ ] **Step 3: Stop the dev server**

Stop the background `npm run dev` process.

- [ ] **Step 4: Final status check**

```bash
git status
git log --oneline -5
```

Expected: clean working tree, three commits on `dave/resume-v2` covering BnbFinder/bullets, spec, foundation, and per-component overrides.

---

## Notes for the user (post-execution review)

When you return, perform the manual checks the automated flow can't cover:

1. Open `http://localhost:3000/resume` in Chrome, Safari, and Firefox.
2. Click "Download PDF" or press `Cmd+P` in each.
3. Verify the print preview:
   - White background, black text, no animated chrome.
   - HomeLink and DownloadButton hidden.
   - Content fits ~2 letter pages with no job entries split across pages.
   - Save as PDF produces a clean file.
4. Tune `font-size` in the `@media print` block of `globals.css` from `11pt` to `10.5pt` or `10pt` if the 2-page target overflows.
5. If the headshot border doesn't print, add `print-color-adjust: exact;` to the `img` rule in the `@media print` block.
