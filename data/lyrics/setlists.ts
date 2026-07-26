import type { Setlist } from './types';

// Running orders. The list page lets Dave drag-reorder on top of these; the
// custom order is stored in localStorage, so editing here only changes the
// default.
export const SETLISTS: Setlist[] = [
  {
    id: 'aug-2026',
    name: 'August 2026',
    slugs: [
      'im-a-ghost-now',
      'such-terrible-things',
      'blood-moon',
      'enjoy-the-silence',
      'bleed-your-mind',
      'abscond',
      'drink-gasoline',
      'go-dark', // extra / encore
    ],
  },
];

export const DEFAULT_SETLIST_ID = 'aug-2026';
