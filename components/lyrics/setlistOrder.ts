// Custom running order stored per setlist in localStorage, layered over the
// default order in data/lyrics/setlists.ts. Unknown slugs are dropped; songs
// added to the setlist later are appended at the end. Exposed as an external
// store so SSR renders the default order and the client syncs after hydration.

import { useCallback, useSyncExternalStore } from 'react';

const orderKey = (setlistId: string) => `pf-setlist-order:${setlistId}`;

export function mergeOrder(stored: string[] | null, defaults: string[]): string[] {
  if (!stored) return defaults;
  const merged = stored.filter((slug) => defaults.includes(slug));
  for (const slug of defaults) if (!merged.includes(slug)) merged.push(slug);
  return merged;
}

// localStorage 'storage' events only fire in *other* tabs, so writes here
// notify local subscribers themselves.
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener('storage', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', cb);
  };
};

// getSnapshot must be referentially stable while the underlying raw value is
// unchanged, so cache the merged array per setlist keyed by the raw string.
const cache = new Map<string, { raw: string | null; defaults: string[]; value: string[] }>();

function readOrder(setlistId: string, defaults: string[]): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(orderKey(setlistId));
  } catch {
    return defaults;
  }
  const hit = cache.get(setlistId);
  if (hit && hit.raw === raw && hit.defaults === defaults) return hit.value;
  let value = defaults;
  if (raw) {
    try {
      value = mergeOrder(JSON.parse(raw) as string[], defaults);
    } catch {
      value = defaults;
    }
  }
  cache.set(setlistId, { raw, defaults, value });
  return value;
}

export function useSetlistOrder(setlistId: string, defaults: string[]) {
  const order = useSyncExternalStore(
    subscribe,
    () => readOrder(setlistId, defaults),
    () => defaults,
  );

  const setOrder = useCallback(
    (slugs: string[]) => {
      try {
        window.localStorage.setItem(orderKey(setlistId), JSON.stringify(slugs));
      } catch {
        /* private mode etc. — order just won't persist */
      }
      emit();
    },
    [setlistId],
  );

  const resetOrder = useCallback(() => {
    try {
      window.localStorage.removeItem(orderKey(setlistId));
    } catch {
      /* ignore */
    }
    emit();
  }, [setlistId]);

  return { order, setOrder, resetOrder };
}

/** Case- and diacritic-insensitive text for search ("abscond" matches "abscønd"). */
export const searchable = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/ø/gi, 'o')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .toLowerCase();
