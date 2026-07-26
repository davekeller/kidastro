# Paper Fang lyrics data

Song data behind the hidden `/lyrics` page. One file per song in `songs/`,
typed by [types.ts](types.ts), re-exported from the generated
[index.ts](index.ts).

## Adding a song

**From a lyric-sheet HTML file** (the Dropbox template format):

```bash
node scripts/import-lyric-sheet.mjs "~/Dropbox/paper fang/lyrics/All Songs/New Song.html"
```

This writes `songs/<slug>.ts` and regenerates `index.ts`. Passing a directory
imports every `.html` inside it (safe to re-run — files are overwritten from
source).

**From pasted lyrics:** create `songs/<slug>.ts` by hand following any
existing song file, then re-run the script with no new sheets — or just add
the import to `index.ts` yourself. Rules:

- `slug` — lowercase, hyphenated, no apostrophes or diacritics (`abscønd` → `abscond`).
- `sections` — one entry per `[Verse 1]` / `[Chorus]` / etc.; `label` without brackets.
- `lines` — one string per sung line; `''` marks a stanza gap; an empty array
  renders as an instrumental/placeholder (`· · ·`) and, if no section has
  lines, the song is badged **in progress** (`status: 'in-progress'`).
- Covers get `cover: { artist: 'Original Artist' }` and show a badge.

## Editing on the page

Every sheet has an **edit** button (top bar): title, section labels, and a
one-line-per-row textarea per section (blank line = stanza gap). **Save**
stores the edit in localStorage (`pf-song-edit:<slug>`) on that device and
the whole page — sheet, list, search, badges — reads the merged result.
**Revert to original** clears it.

A device edit doesn't reach this repo or other devices. To make an edit
canonical, tap **copy song data** in edit mode and paste the JSON to Claude
(or apply it to `songs/<slug>.ts` by hand), then remove the device override
with revert.

## Setlists

Running orders live in [setlists.ts](setlists.ts) as ordered slug arrays.
The `/lyrics` page uses `DEFAULT_SETLIST_ID`; drag-reordering on the page is
stored per-setlist in localStorage (`pf-setlist-order:<id>`) on top of the
default, so editing the data only changes the starting order. Songs missing
from a stored order are appended; unknown slugs are dropped.
