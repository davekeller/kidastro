'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { SONGS, SETLISTS, DEFAULT_SETLIST_ID, songBySlug, type Song } from '@/data/lyrics';
import WolfMark from './WolfMark';
import { searchable, useSetlistOrder } from './setlistOrder';

const PINK = '#e4416f';
const INSTAGRAM_URL = 'https://instagram.com/paper.fang';
const SPOTIFY_URL = 'https://open.spotify.com/search/Paper%20Fang';

const setlist = SETLISTS.find((s) => s.id === DEFAULT_SETLIST_ID)!;

const firstLine = (song: Song) => {
  for (const section of song.sections) {
    const line = section.lines.find(Boolean);
    if (line) return line;
  }
  return null;
};

const matches = (song: Song, q: string) => {
  const needle = searchable(q);
  if (searchable(song.title).includes(needle)) return true;
  return song.sections.some((sec) => sec.lines.some((l) => searchable(l).includes(needle)));
};

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-sm border border-white/20 px-1.5 py-0.5 font-(family-name:--font-jetbrains) text-[10px] uppercase tracking-[0.18em] text-white/50">
    {children}
  </span>
);

const CardInner = ({
  song,
  position,
  tilt,
}: {
  song: Song;
  position: number | null;
  tilt: number;
}) => (
  <Link
    href={`/lyrics/${song.slug}`}
    className="group flex items-center gap-4 rounded-xl border border-white/15 bg-black/30 px-5 py-4 backdrop-blur-md transition-all duration-200 hover:border-(--pf-pink) hover:bg-black/50 sm:gap-6 sm:px-7 sm:py-5"
    style={{ ['--pf-pink' as string]: PINK, rotate: `${tilt}deg` }}
  >
    {position !== null && (
      <span
        aria-hidden
        className="w-12 shrink-0 font-(family-name:--font-jetbrains) text-4xl font-bold text-transparent sm:w-16 sm:text-5xl"
        style={{ WebkitTextStroke: `1.5px ${PINK}` }}
      >
        {String(position).padStart(2, '0')}
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-xl font-semibold text-white sm:text-2xl">{song.title}</span>
        {song.cover && <Badge>cover · {song.cover.artist}</Badge>}
        {song.status === 'in-progress' && <Badge>in progress</Badge>}
      </span>
      <span className="mt-1 block truncate font-(family-name:--font-jetbrains) text-xs text-white/35">
        {firstLine(song) ?? 'no lyrics yet'}
      </span>
    </span>
    <span
      aria-hidden
      className="text-white/25 transition-all duration-200 group-hover:translate-x-1 group-hover:text-(--pf-pink)"
    >
      →
    </span>
  </Link>
);

const SetlistCard = ({ song, position, tilt }: { song: Song; position: number; tilt: number }) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={song.slug}
      dragListener={false}
      dragControls={controls}
      className="relative mb-3 flex items-stretch gap-2"
    >
      <div className="min-w-0 flex-1">
        <CardInner song={song} position={position} tilt={tilt} />
      </div>
      <button
        aria-label={`Reorder ${song.title}`}
        onPointerDown={(e) => {
          e.preventDefault();
          controls.start(e);
        }}
        className="flex w-9 shrink-0 cursor-grab touch-none items-center justify-center rounded-xl border border-white/10 text-lg leading-none text-white/30 transition-colors hover:border-white/25 hover:text-white/70 active:cursor-grabbing"
      >
        ⠿
      </button>
    </Reorder.Item>
  );
};

const LyricsView = () => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'set' | 'all'>('set');
  const { order, setOrder, resetOrder } = useSetlistOrder(setlist.id, setlist.slugs);

  const isCustomOrder = useMemo(
    () => order.join('|') !== setlist.slugs.join('|'),
    [order],
  );

  const searching = query.trim().length > 0;
  const setSongs = order.map((slug) => songBySlug(slug)).filter(Boolean) as Song[];
  const allSongs = useMemo(
    () => [...SONGS].sort((a, b) => a.title.localeCompare(b.title)),
    [],
  );
  // A search always sweeps every song, not just the current view.
  const results = searching ? allSongs.filter((s) => matches(s, query.trim())) : null;

  const tiltFor = (i: number) => (i % 2 ? 0.35 : -0.35);

  return (
    <div className="mx-auto w-[94%] max-w-2xl pb-24">
      <header className="pt-10 text-center sm:pt-14">
        <WolfMark />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.35em]"
          style={{ color: PINK }}
        >
          the lyric book
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mt-3 text-6xl tracking-tight text-white uppercase sm:text-7xl"
        >
          Paper Fang
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="mx-auto mt-3 max-w-md text-base text-white/70"
        >
          punk · grunge · metal — a heavy three-piece out of{' '}
          <span className="whitespace-nowrap">Austin, TX</span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mt-4 flex items-center justify-center gap-5 font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.2em]"
        >
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-(--pf-pink)" style={{ ['--pf-pink' as string]: PINK }}>
            instagram
          </a>
          <span aria-hidden className="text-white/20">/</span>
          <a href={SPOTIFY_URL} target="_blank" rel="noopener noreferrer" className="text-white/50 transition-colors hover:text-(--pf-pink)" style={{ ['--pf-pink' as string]: PINK }}>
            spotify
          </a>
        </motion.p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search titles + lines…"
          aria-label="Search songs"
          className="h-11 min-w-0 flex-1 rounded-full border border-white/15 bg-black/30 px-5 font-(family-name:--font-jetbrains) text-sm text-white placeholder:text-white/30 backdrop-blur-md outline-none transition-colors focus:border-(--pf-pink)"
          style={{ ['--pf-pink' as string]: PINK }}
        />
        <div className="flex shrink-0 gap-2" role="tablist" aria-label="View">
          {(
            [
              ['set', setlist.name],
              ['all', 'all songs'],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`h-11 rounded-full border px-5 font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.15em] transition-colors ${
                mode === m
                  ? 'border-transparent bg-(--pf-pink) text-black'
                  : 'border-white/15 bg-black/30 text-white/60 backdrop-blur-md hover:border-white/35'
              }`}
              style={{ ['--pf-pink' as string]: PINK }}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.38 }}
        className="mt-8"
      >
        {results ? (
          <>
            <p className="mb-4 font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.2em] text-white/40">
              {results.length} match{results.length === 1 ? '' : 'es'} across all songs
            </p>
            {results.map((song, i) => {
              const pos = order.indexOf(song.slug);
              return (
                <div key={song.slug} className="mb-3">
                  <CardInner song={song} position={pos >= 0 ? pos + 1 : null} tilt={tiltFor(i)} />
                </div>
              );
            })}
            {results.length === 0 && (
              <p className="py-10 text-center text-white/50">nothing in the book matches that.</p>
            )}
          </>
        ) : mode === 'set' ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.2em] text-white/40">
                drag ⠿ to set the running order
              </p>
              {isCustomOrder && (
                <button
                  onClick={resetOrder}
                  className="font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.15em] text-white/40 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white/80"
                >
                  reset order
                </button>
              )}
            </div>
            <Reorder.Group axis="y" values={order} onReorder={setOrder} className="list-none">
              {setSongs.map((song, i) => (
                <SetlistCard key={song.slug} song={song} position={i + 1} tilt={tiltFor(i)} />
              ))}
            </Reorder.Group>
          </>
        ) : (
          allSongs.map((song, i) => {
            const pos = order.indexOf(song.slug);
            return (
              <div key={song.slug} className="mb-3">
                <CardInner song={song} position={pos >= 0 ? pos + 1 : null} tilt={tiltFor(i)} />
              </div>
            );
          })
        )}
      </motion.div>

      <footer className="mt-16 text-center">
        <Link href="/" className="text-sm text-white/60 transition-colors hover:text-[#39d5cb]">
          ← back to kidastro.com
        </Link>
        <p className="mt-3 font-(family-name:--font-jetbrains) text-xs text-white/20">
          shhh — band eyes only
        </p>
      </footer>
    </div>
  );
};

export default LyricsView;
