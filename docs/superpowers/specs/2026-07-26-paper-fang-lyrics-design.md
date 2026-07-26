# Paper Fang Lyrics — `/lyrics` hidden page

**Date:** 2026-07-26
**Status:** Approved direction (user pre-approved recommendations; flagged items below)

## Purpose

A hidden, unlisted page at `kidastro.com/lyrics` where Dave can pull up Paper
Fang lyric sheets on stage. Primary device: iPad in portrait. Secondary:
iPhone. The list view is a searchable set of song cards that can be arranged
in set-list order; each song opens a clean, big-type lyric sheet with
auto-scroll.

Source material: the existing HTML lyric sheets in
`~/Dropbox/paper fang/lyrics/All Songs/` (9 songs) and the Aug 2026 setlist
running order in `~/Dropbox/paper fang/lyrics/Paper Fang — Aug 2026 Show/SETLIST.md`.
Per the LYRICS workspace memory: sheets are lyrics-only (no chord column),
full-width, big legible type.

## Architecture

### Data (`data/lyrics/`)

Songs live as typed data checked into the repo — not raw HTML — so the list,
search, theming, and next-song navigation all come from one source.

```ts
type Song = {
  slug: string;          // 'such-terrible-things'
  title: string;
  cover?: { artist: string };  // e.g. Enjoy the Silence → Depeche Mode
  status: 'ready' | 'in-progress';
  sections: { label: string; lines: string[] }[]; // '' line = stanza gap
};

type Setlist = { id: string; name: string; slugs: string[] };
```

- One file per song in `data/lyrics/songs/`, re-exported from
  `data/lyrics/index.ts`.
- `data/lyrics/setlists.ts` holds named setlists (initially `aug-2026`).
- `data/lyrics/README.md` documents the format for adding future songs.
- `scripts/import-lyric-sheet.mjs` converts a sheet HTML file (the existing
  template format) into a song data file, so lyric text never has to be
  retyped. Run manually; not part of the build.

### Routes

- `app/lyrics/page.tsx` — list view. `robots: { index: false, follow: false }`,
  absent from `app/sitemap.ts`, linked from nowhere (same treatment as
  `/skills`).
- `app/lyrics/[slug]/page.tsx` — lyric sheet, statically generated via
  `generateStaticParams`, same robots.

### List view (`components/lyrics/LyricsView.tsx`, client)

- Global space background (Starfield/NorthernLights from the root layout)
  shows through; page content is `z-10` like other pages.
- Header: floating wireframe **fang** (`components/lyrics/FangMark.tsx`) —
  react-three-fiber line art in the same language as the arcade helmet:
  draggable with momentum, gentle float, palette color cross-fade. Below it
  "PAPER FANG" in Bricolage caps, a one-line descriptor, and small
  Instagram (`instagram.com/paper.fang`) / Spotify links.
- Search input filters songs by title **and** lyric-line text, case- and
  diacritic-insensitive (finds "abscond" in "abscønd").
- Two view modes, toggle pills:
  - **Setlist** (default): cards in `aug-2026` running order, numbered.
    Drag to reorder (framer-motion `Reorder`); custom order persists to
    `localStorage` (`pf-setlist-order:aug-2026`), with a reset control.
    Drag is disabled while a search filter is active.
  - **All songs**: alphabetical.
- Cards: dark glass (`bg-black/30`, `border-white/15`, backdrop blur),
  pink `#e4416f` accent (site palette color-3, fits the grunge register).
  Card shows set position (setlist mode), title, first lyric line as a
  muted snippet, and badges: `cover` and `in progress` where applicable.
  Whole card links to the sheet.

### Sheet view (`components/lyrics/LyricSheet.tsx`, client)

- Near-black full-bleed reading surface over the site background — high
  contrast for dark venues.
- Type: Bricolage; lyric lines ~`clamp(1.35rem, 2.6vw, 1.75rem)` so iPad
  portrait is comfortably big and iPhone still fits; `line-height ~1.55`;
  one line per row (stanza style — no slash-joining), long lines wrap with a
  hanging indent. Stanza gaps within sections preserved. Section labels
  small, uppercase, letter-spaced, muted.
- Sticky minimal top bar: back-to-list, song position (`3 / 8`) when arrived
  from a setlist, title on scroll.
- Auto-scroll control ported from the existing sheets, same behavior:
  fixed right-center vertical cluster — speed flash readout, `+` / `−`
  (2–40 px/s, step 2, default 8), round play/pause; rAF scrolling;
  wheel stops; touchmove pauses and touchend resumes only if touch paused
  it; auto-stops at bottom.
- Bottom: large "Next → <title>" button following the active order
  (custom localStorage order if present, else the setlist), so moving
  through a set is one tap per song.

## Error handling

- Unknown slug → `notFound()`.
- `localStorage` order entries referencing deleted songs are dropped; new
  songs not in a stored order are appended at the end.
- Songs with empty/placeholder sections render the `· · ·` placeholder line
  and carry the `in progress` badge in the list.

## Testing / verification

- Import script run against all 9 sheets; output spot-checked for section
  counts and line integrity (diffed against source HTML text content).
- `npm run lint` and `npm run build` clean.
- Browser verification at 768×1024 (iPad portrait) and 390×844 (iPhone):
  search, view toggle, drag reorder + persistence, sheet legibility,
  auto-scroll play/pause/speed, next-song flow.

## Flagged for Dave

- **Enjoy the Silence** is a Depeche Mode cover; its lyrics on a public
  (even unlisted, noindex) URL is his call. Imported by default since it is
  part of the existing sheet workflow; easy to remove.

## Out of scope (YAGNI)

- Auth/password gating (hidden URL is the agreed model, like `/skills`).
- Multiple setlist management UI — setlists are edited in data.
- Chord rendering (explicitly dropped by Dave).
- Offline/PWA support.
