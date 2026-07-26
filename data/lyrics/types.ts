export type SongSection = {
  label: string;
  /** Lyric lines in order; an empty string is a stanza gap. Empty array = instrumental/placeholder section. */
  lines: string[];
};

export type Song = {
  slug: string;
  title: string;
  /** Set when the song is a cover; original artist name. */
  cover?: { artist: string };
  status: 'ready' | 'in-progress';
  sections: SongSection[];
};

export type Setlist = {
  id: string;
  name: string;
  slugs: string[];
};
