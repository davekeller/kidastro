// Device-local song edits, layered over the checked-in data in data/lyrics —
// the same localStorage-overlay model as the setlist order. An edit made on
// the sheet is stored per slug and merged into every reader (sheet, list,
// search). "Copy song data" in the editor is the path back to the repo when
// an edit should become canonical for all devices.

import { useSyncExternalStore } from 'react';
import type { Song, SongSection } from '@/data/lyrics';

export type SongOverride = {
  title: string;
  sections: SongSection[];
  editedAt: string;
};

const overrideKey = (slug: string) => `pf-song-edit:${slug}`;

// localStorage 'storage' events only fire in other tabs; local writes bump a
// version counter so subscribed components re-merge.
let version = 0;
const listeners = new Set<() => void>();
const emit = () => {
  version++;
  listeners.forEach((l) => l());
};

const subscribe = (cb: () => void) => {
  const onStorage = () => {
    version++;
    cb();
  };
  listeners.add(cb);
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
};

/** Bumps whenever any song override changes; use as a useMemo dependency. */
export const useOverrideVersion = () =>
  useSyncExternalStore(
    subscribe,
    () => version,
    () => 0,
  );

export function readOverride(slug: string): SongOverride | null {
  try {
    const raw = window.localStorage.getItem(overrideKey(slug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SongOverride;
    if (!Array.isArray(parsed.sections)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveOverride(slug: string, override: Omit<SongOverride, 'editedAt'>) {
  try {
    window.localStorage.setItem(
      overrideKey(slug),
      JSON.stringify({ ...override, editedAt: new Date().toISOString() }),
    );
  } catch {
    /* quota/private mode — the edit just won't persist */
  }
  emit();
}

export function clearOverride(slug: string) {
  try {
    window.localStorage.removeItem(overrideKey(slug));
  } catch {
    /* ignore */
  }
  emit();
}

/** Base song with any device-local edit applied; status recomputed. */
export function mergeSong(base: Song): Song & { edited: boolean } {
  const o = typeof window === 'undefined' ? null : readOverride(base.slug);
  if (!o) return { ...base, edited: false };
  const hasLyrics = o.sections.some((s) => s.lines.some(Boolean));
  return {
    ...base,
    title: o.title || base.title,
    sections: o.sections,
    status: hasLyrics ? 'ready' : 'in-progress',
    edited: true,
  };
}

// ── textarea serialization ──────────────────────────────────────────────
// One lyric line per row; a blank line is a stanza gap. Parsing collapses
// doubled gaps and trims leading/trailing ones (same rules as the importer).

export const linesToText = (lines: string[]) => lines.join('\n');

export function textToLines(text: string): string[] {
  const lines = text
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim().replace(/\s+/g, ' '));
  return lines
    .filter((l, i) => !(l === '' && (lines[i - 1] ?? '') === ''))
    .filter((l, i, a) => !(l === '' && (i === 0 || i === a.length - 1)));
}
