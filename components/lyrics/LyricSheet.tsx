'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { SETLISTS, DEFAULT_SETLIST_ID, songBySlug, type Song } from '@/data/lyrics';
import { useSetlistOrder } from './setlistOrder';
import {
  clearOverride,
  linesToText,
  mergeSong,
  saveOverride,
  textToLines,
  useOverrideVersion,
} from './songOverrides';

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

type DraftSection = { label: string; text: string };
type Draft = { title: string; sections: DraftSection[] };

const parseDraft = (song: Song, draft: Draft) => ({
  title: draft.title.trim() || song.title,
  sections: draft.sections.map((s) => ({
    label: s.label.trim().replace(/^\[|\]$/g, '') || 'Section',
    lines: textToLines(s.text),
  })),
});

const ActionButton = ({
  onClick,
  children,
  accent = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  accent?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`h-10 rounded-full px-4 font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.15em] transition-colors ${
      accent
        ? 'bg-(--pf-pink) text-black hover:opacity-90'
        : 'border border-white/20 text-white/70 hover:border-white/45 hover:text-white'
    }`}
    style={{ ['--pf-pink' as string]: PINK }}
  >
    {children}
  </button>
);

const LyricSheet = ({ song }: { song: Song }) => {
  // Set position + next song follow the live order (the drag-reordered one in
  // localStorage when present, else the default setlist).
  const { order } = useSetlistOrder(setlist.id, setlist.slugs);

  // Device-local edits layered over the checked-in song data.
  const overrideVersion = useOverrideVersion();
  // overrideVersion is the localStorage store's invalidation key, not a value
  // mergeSong reads directly — the linter can't see that.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const merged = useMemo(() => mergeSong(song), [song, overrideVersion]);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const startEdit = () => {
    setDraft({
      title: merged.title,
      sections: merged.sections.map((s) => ({ label: s.label, text: linesToText(s.lines) })),
    });
    setEditing(true);
  };
  const save = () => {
    if (!draft) return;
    saveOverride(song.slug, parseDraft(song, draft));
    setEditing(false);
    setDraft(null);
  };
  const cancel = () => {
    setEditing(false);
    setDraft(null);
  };
  const revert = () => {
    clearOverride(song.slug);
    setEditing(false);
    setDraft(null);
  };
  const copyData = async () => {
    const data = draft ? parseDraft(song, draft) : { title: merged.title, sections: merged.sections };
    const json = JSON.stringify({ slug: song.slug, ...data }, null, 2);
    let ok = false;
    try {
      await navigator.clipboard.writeText(json);
      ok = true;
    } catch {
      // Fallback for contexts where the async clipboard is unavailable.
      const ta = document.createElement('textarea');
      ta.value = json;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      ta.remove();
    }
    setFlash(ok ? 'copied — paste it to claude to make it permanent' : 'copy failed');
    setTimeout(() => setFlash(null), 2500);
  };

  const setSection = (i: number, patch: Partial<DraftSection>) =>
    setDraft((d) =>
      d ? { ...d, sections: d.sections.map((s, j) => (j === i ? { ...s, ...patch } : s)) } : d,
    );

  const index = order.indexOf(song.slug);
  const next = index >= 0 && index < order.length - 1 ? songBySlug(order[index + 1]) : undefined;

  return (
    <>
      {/* Calm the starfield behind the sheet — stage reading wants contrast. */}
      <div aria-hidden className="fixed inset-0 z-0 bg-[#05060a]/85" />

      <div className="relative z-10 mx-auto min-h-screen w-full max-w-3xl px-5 pb-10 sm:px-10">
        <nav className="sticky top-0 z-40 -mx-5 flex items-center justify-between bg-gradient-to-b from-[#05060a] via-[#05060a]/90 to-transparent px-5 pt-4 pb-6 font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.2em] sm:-mx-10 sm:px-10">
          <Link href="/lyrics" className="text-white/50 transition-colors hover:text-white">
            ← lyric book
          </Link>
          <span className="flex items-center gap-5">
            {!editing && (
              <button
                onClick={startEdit}
                className="uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
              >
                edit
              </button>
            )}
            {index >= 0 && (
              <span className="text-white/40">
                <span style={{ color: PINK }}>{String(index + 1).padStart(2, '0')}</span> / {String(order.length).padStart(2, '0')}
              </span>
            )}
          </span>
        </nav>

        <header className="mt-6 mb-10 border-b border-white/10 pb-6 sm:mt-10">
          {editing && draft ? (
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              aria-label="Song title"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-4xl tracking-tight text-white uppercase outline-none focus:border-(--pf-pink) sm:text-5xl"
              style={{ ['--pf-pink' as string]: PINK, fontFamily: 'var(--font-bricolage)', fontWeight: 700 }}
            />
          ) : (
            <h1 className="text-4xl tracking-tight text-white uppercase sm:text-5xl">{merged.title}</h1>
          )}
          <p className="mt-2 flex items-center gap-3 font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.25em] text-white/40">
            {song.cover ? `${song.cover.artist} — paper fang version` : 'paper fang'}
            {merged.edited && !editing && (
              <span className="rounded-sm border border-white/20 px-1.5 py-0.5 text-[10px] tracking-[0.18em] text-white/50">
                edited on this device
              </span>
            )}
          </p>
        </header>

        {editing && draft ? (
          <div className="pb-28">
            {draft.sections.map((section, si) => (
              <section key={si} className="mb-8">
                <div className="mb-2 flex items-center gap-3">
                  <input
                    value={section.label}
                    onChange={(e) => setSection(si, { label: e.target.value })}
                    aria-label={`Section ${si + 1} label`}
                    className="w-44 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 font-(family-name:--font-jetbrains) text-xs font-bold uppercase tracking-[0.3em] outline-none focus:border-(--pf-pink)"
                    style={{ color: PINK, ['--pf-pink' as string]: PINK }}
                  />
                  <button
                    onClick={() =>
                      setDraft({ ...draft, sections: draft.sections.filter((_, j) => j !== si) })
                    }
                    disabled={draft.sections.length === 1}
                    aria-label={`Remove section ${si + 1}`}
                    className="font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.15em] text-white/35 transition-colors hover:text-white disabled:opacity-30"
                  >
                    remove
                  </button>
                </div>
                <textarea
                  value={section.text}
                  onChange={(e) => setSection(si, { text: e.target.value })}
                  rows={Math.max(3, section.text.split('\n').length + 1)}
                  placeholder="one line per row — blank line starts a new stanza"
                  aria-label={`Section ${si + 1} lyrics`}
                  className="w-full resize-y rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-xl leading-[1.6] font-medium text-white/95 outline-none placeholder:text-white/25 focus:border-(--pf-pink)"
                  style={{ ['--pf-pink' as string]: PINK }}
                />
              </section>
            ))}
            <button
              onClick={() =>
                setDraft({ ...draft, sections: [...draft.sections, { label: 'Verse', text: '' }] })
              }
              className="w-full rounded-lg border border-dashed border-white/20 py-3 font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:border-white/45 hover:text-white"
            >
              + add section
            </button>

            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#05060a]/95 px-5 py-3">
              <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-2 sm:px-5">
                <ActionButton accent onClick={save}>
                  save
                </ActionButton>
                <ActionButton onClick={cancel}>cancel</ActionButton>
                {merged.edited && <ActionButton onClick={revert}>revert to original</ActionButton>}
                <ActionButton onClick={copyData}>copy song data</ActionButton>
                {flash && (
                  <span className="font-(family-name:--font-jetbrains) text-xs text-white/50">{flash}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          merged.sections.map((section, si) => (
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
          ))
        )}

        {!editing && (
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
        )}
      </div>

      {!editing && <AutoScroll />}
    </>
  );
};

export default LyricSheet;
