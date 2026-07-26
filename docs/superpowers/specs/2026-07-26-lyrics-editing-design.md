# Lyric sheet editing — design

**Date:** 2026-07-26
**Branch:** `claude/lyrics-sheet-editing` (stacks on `claude/paper-fang-lyrics-page-a49375` / PR #24)
**Status:** Approved direction (Dave pre-approves recommendations)

## Purpose

Let Dave edit a lyric sheet directly on the page (mainly on the iPad),
save, and have the edit stick. The site is static with no auth and the
page is hidden-but-public, so a public write API is off the table for v1.

## Approach: device-local overrides + export path

Same model as the drag-reordered setlist: edits are stored in
`localStorage` and layered over the checked-in song data.

- **Persistence:** `pf-song-edit:<slug>` holds
  `{ title, sections: {label, lines[]}[], editedAt }`. Edits survive
  reloads and work offline on the device that made them.
- **Limitation (accepted):** an edit lives only on the device that made
  it. The escape hatch is **copy song data** — copies the edited song as
  JSON to paste back to Claude / into `data/lyrics/songs/<slug>.ts`,
  making it canonical for every device. Documented in `data/lyrics/README.md`.
- **Future upgrade (out of scope):** passcode-protected API route that
  commits the song file to GitHub → redeploy = real cross-device sync.

## Components

### `components/lyrics/songOverrides.ts`

- `readOverride(slug)` / `saveOverride(slug, o)` / `clearOverride(slug)`
  with the same emit-to-subscribers pattern as `setlistOrder.ts`.
- `useOverrideVersion()` — `useSyncExternalStore` over a version counter
  (avoids snapshot referential-stability issues); components re-merge via
  `useMemo` keyed on the version.
- `mergeSong(base)` — applies override; recomputes `status`
  (`ready` ↔ `in-progress`) from whether any section has lines.
- Text serialization: textarea holds one lyric line per row; a blank line
  is a stanza gap; leading/trailing/double gaps collapsed on parse
  (same rules as the importer). Empty textarea = instrumental section
  (renders `· · ·`).

### `LyricSheet.tsx` — edit mode

- `edit` button in the sticky top bar (mono, next to the set position).
- Edit mode replaces the reading view with: title input; per-section a
  label input, a lines textarea (auto-sized), and a remove-section button;
  an **add section** button.
- Sticky bottom action bar: **save** (parse → override → exit edit mode,
  content updates instantly), **cancel** (discard draft), **revert to
  original** (only when an override exists; confirms via the button being
  explicit, then clears), **copy song data** (JSON to clipboard).
- Auto-scroll controls hidden while editing. `edited` chip in the header
  when an override is active.

### `LyricsView.tsx`

- Uses merged songs everywhere (search text, snippets, badges), so an
  edit made on the sheet is searchable from the list immediately.
- Edited songs show a small `edited` badge on the card.

## Error handling

- Corrupt/unparseable stored JSON → ignored, base data used.
- Saving with every section deleted is allowed only as one empty
  placeholder section (the form always keeps at least one section).
- localStorage quota/private-mode failures degrade to "edit doesn't
  persist" without crashing (try/catch, same as the order store).

## Verification

- Browser: edit a song → save → text updates → reload → edit persists →
  list shows `edited` badge and finds new text in search → revert →
  original returns everywhere. `tsc`, eslint, `next build` clean.

## Out of scope (YAGNI)

- Creating brand-new songs on-device (still done via data files/Claude).
- Cross-device sync backend.
- Undo history beyond cancel/revert.
