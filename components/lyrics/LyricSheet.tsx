'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { SETLISTS, DEFAULT_SETLIST_ID, songBySlug, type Song } from '@/data/lyrics';
import { useSetlistOrder } from './setlistOrder';

const PINK = '#e4416f';

const setlist = SETLISTS.find((s) => s.id === DEFAULT_SETLIST_ID)!;

// Auto-scroll control cluster, ported from the original sheet HTML: rAF
// scrolling at an adjustable px/s, wheel stops it, a touch-drag pauses it and
// lifting the finger resumes, and it stops itself at the bottom of the page.
const AutoScroll = () => {
  const [running, setRunning] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const runningRef = useRef(false);
  const speedRef = useRef(8);
  const rafRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const scrollPosRef = useRef(0);
  const pausedByTouchRef = useRef(false);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const MIN_SPEED = 2;
  const MAX_SPEED = 40;
  const STEP = 2;

  const stop = () => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    lastTimeRef.current = null;
    setRunning(false);
  };

  const step = (timestamp: number) => {
    if (!runningRef.current) return;
    if (lastTimeRef.current !== null) {
      const delta = timestamp - lastTimeRef.current;
      scrollPosRef.current += (speedRef.current * delta) / 1000;
      window.scrollTo(0, scrollPosRef.current);
    } else {
      scrollPosRef.current = window.scrollY;
    }
    lastTimeRef.current = timestamp;
    const atBottom =
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    if (atBottom) {
      stop();
      return;
    }
    rafRef.current = requestAnimationFrame(step);
  };

  const start = () => {
    runningRef.current = true;
    lastTimeRef.current = null;
    scrollPosRef.current = window.scrollY;
    rafRef.current = requestAnimationFrame(step);
    setRunning(true);
  };

  const flashSpeed = () => {
    setFlash(`${speedRef.current} px/s`);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    flashTimerRef.current = setTimeout(() => setFlash(null), 1200);
  };

  useEffect(() => {
    const onWheel = () => {
      if (runningRef.current) {
        stop();
        pausedByTouchRef.current = false;
      }
    };
    const onTouchMove = () => {
      if (runningRef.current) {
        stop();
        pausedByTouchRef.current = true;
      }
    };
    const onTouchEnd = () => {
      if (pausedByTouchRef.current) {
        pausedByTouchRef.current = false;
        start();
      }
    };
    const onTouchCancel = () => {
      pausedByTouchRef.current = false;
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchCancel, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchCancel);
      cancelAnimationFrame(rafRef.current);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed top-1/2 right-2 z-50 flex -translate-y-1/2 flex-col items-center gap-1 opacity-60 transition-opacity hover:opacity-100 sm:right-5">
      <span
        className={`h-3 font-(family-name:--font-jetbrains) text-[9px] font-bold tracking-wide transition-opacity ${flash ? 'opacity-100' : 'opacity-0'}`}
        style={{ color: PINK }}
      >
        {flash}
      </span>
      <button
        aria-label="Scroll faster"
        onClick={() => {
          speedRef.current = Math.min(MAX_SPEED, speedRef.current + STEP);
          flashSpeed();
        }}
        className="flex h-7 w-8 items-center justify-center text-lg text-white/50 transition-colors hover:text-white"
      >
        +
      </button>
      <button
        aria-label={running ? 'Pause auto-scroll' : 'Start auto-scroll'}
        onClick={() => (runningRef.current ? stop() : start())}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-black/50 shadow-lg shadow-black/40 backdrop-blur-md transition-colors hover:border-white/30"
        style={{ color: PINK }}
      >
        {running ? (
          <svg width="17" height="17" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
            <rect x="1.5" y="1" width="4" height="12" rx="1" />
            <rect x="8.5" y="1" width="4" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
            <polygon points="4,1 13,7 4,13" />
          </svg>
        )}
      </button>
      <button
        aria-label="Scroll slower"
        onClick={() => {
          speedRef.current = Math.max(MIN_SPEED, speedRef.current - STEP);
          flashSpeed();
        }}
        className="flex h-7 w-8 items-center justify-center text-lg text-white/50 transition-colors hover:text-white"
      >
        −
      </button>
    </div>
  );
};

const LyricSheet = ({ song }: { song: Song }) => {
  // Set position + next song follow the live order (the drag-reordered one in
  // localStorage when present, else the default setlist).
  const { order } = useSetlistOrder(setlist.id, setlist.slugs);

  const index = order.indexOf(song.slug);
  const next = index >= 0 && index < order.length - 1 ? songBySlug(order[index + 1]) : undefined;

  return (
    <>
      {/* Calm the starfield behind the sheet — stage reading wants contrast. */}
      <div aria-hidden className="fixed inset-0 z-0 bg-[#05060a]/85" />

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-3xl px-5 pb-10 sm:px-10">
        <nav className="sticky top-0 z-40 -mx-5 flex items-center justify-between bg-gradient-to-b from-[#05060a] via-[#05060a]/90 to-transparent px-5 pt-4 pb-6 font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.2em] sm:-mx-10 sm:px-10">
          <Link href="/lyrics" className="text-white/50 transition-colors hover:text-white">
            ← set book
          </Link>
          {index >= 0 && (
            <span className="text-white/40">
              <span style={{ color: PINK }}>{String(index + 1).padStart(2, '0')}</span> / {String(order.length).padStart(2, '0')}
            </span>
          )}
        </nav>

        <header className="mt-6 mb-10 border-b border-white/10 pb-6 sm:mt-10">
          <h1 className="text-4xl tracking-tight text-white uppercase sm:text-5xl">{song.title}</h1>
          <p className="mt-2 font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.25em] text-white/40">
            {song.cover ? `${song.cover.artist} — paper fang version` : 'paper fang'}
          </p>
        </header>

        {song.sections.map((section, si) => (
          <section key={si} className="mb-10">
            <h2
              className="mb-3 font-(family-name:--font-jetbrains) text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: PINK }}
            >
              {section.label}
            </h2>
            {section.lines.length === 0 ? (
              <p className="text-2xl text-white/30">· · ·</p>
            ) : (
              section.lines.map((line, li) =>
                line === '' ? (
                  <div key={li} className="h-6" aria-hidden />
                ) : (
                  <p
                    key={li}
                    className="-indent-6 pl-6 text-[1.45rem] leading-[1.55] font-medium text-white/95 md:text-[1.85rem] md:leading-[1.6]"
                  >
                    {line}
                  </p>
                ),
              )
            )}
          </section>
        ))}

        <footer className="mt-16 border-t border-white/10 pt-8 pb-6">
          {next ? (
            <Link
              href={`/lyrics/${next.slug}`}
              className="group flex items-center justify-between rounded-xl border border-white/15 bg-black/40 px-6 py-5 backdrop-blur-md transition-colors hover:border-(--pf-pink)"
              style={{ ['--pf-pink' as string]: PINK }}
            >
              <span>
                <span className="block font-(family-name:--font-jetbrains) text-[10px] uppercase tracking-[0.25em] text-white/40">
                  next up — {String(index + 2).padStart(2, '0')}
                </span>
                <span className="mt-1 block text-2xl font-semibold text-white">{next.title}</span>
              </span>
              <span aria-hidden className="text-2xl text-white/30 transition-all group-hover:translate-x-1 group-hover:text-(--pf-pink)">
                →
              </span>
            </Link>
          ) : (
            <Link
              href="/lyrics"
              className="block rounded-xl border border-white/15 bg-black/40 px-6 py-5 text-center font-(family-name:--font-jetbrains) text-sm uppercase tracking-[0.2em] text-white/60 backdrop-blur-md transition-colors hover:border-white/35 hover:text-white"
            >
              {index >= 0 ? 'end of set — back to the book' : '← back to the book'}
            </Link>
          )}
        </footer>
      </div>

      <AutoScroll />
    </>
  );
};

export default LyricSheet;
