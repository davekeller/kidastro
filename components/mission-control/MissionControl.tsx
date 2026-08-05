'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { destinations } from './destinations';
import NorthernLights from '../NorthernLights';
import ModalStarfield from './ModalStarfield';
import Orrery from './Orrery';
import Planet from './Planet';

/* Ring geometry, sized to fill most of the viewport.

   The radius is derived rather than picked: a planet is ~190px tall, so the ring
   plus one planet has to fit the viewport height, which gives
   `50vmin - (planet half-height + padding)`. Height is the binding constraint on
   every normal desktop aspect ratio, and there vmin *is* the height. The clamp
   bounds only catch the extremes — very short windows and very large displays.

   The floor of 200px is where the labels start crowding the telemetry text at
   the center. */
const ORBIT_R = 'clamp(210px, calc(50vmin - 138px), 410px)';

/* Derived from the radius rather than clamped separately, so the two can't drift
   out of agreement — the field is the ring plus one planet's height. */
const FIELD_SIZE = 'calc(var(--orbit-r) * 2 + 190px)';

/* One slow revolution. At this radius that's a handful of pixels per second —
   present when you watch it, calm when you don't. Hovering pauses it. */
const ORBIT_PERIOD_S = 240;

/* Secret site-wide navigation. A ghost pill in the top-right corner (invisible
   until hovered or keyboard-focused) opens the orrery view: the page falls
   away behind a blur and every destination floats as a body in its own patch
   of space. Mounted once in the root layout; hides itself on /resume, where
   the Download PDF button owns that corner.

   There is deliberately no panel around the cards — a containing box is what
   made the old version read as furniture rather than a system. */
const MissionControl = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Pointer position as motion values rather than state: the field re-computes
  // on every move, and state would re-render six cards per mousemove.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const isHere = (href: string) =>
    href === '/' ? pathname === '/' : Boolean(pathname?.startsWith(href));

  const satelliteCount = destinations.filter((d) => d.kind === 'satellite').length;
  const pageCount = destinations.length - satelliteCount;

  const currentLabel = useMemo(() => {
    const match = destinations.find((d) => isHere(d.href));
    return match ? match.title.toLowerCase() : 'deep space';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const planets = useCallback(
    () => Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('[data-planet]') ?? []),
    []
  );

  // Esc closes, body scroll locks, close button takes focus, focus returns to
  // the trigger on the way out.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Captured now rather than read in cleanup: the pill lives outside
    // AnimatePresence so it's stable, and reading refs during cleanup is the
    // kind of thing that quietly breaks when that stops being true.
    const trigger = triggerRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }

      // Focus trap. Without this, Tab walks straight out of the dialog and
      // into the page behind it, which is still rendered and still focusable.
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (!focusable?.length) return;
        const list = Array.from(focusable);
        const first = list[0];
        const last = list[list.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }

      // Arrow-key navigation around the ring. A radial layout has no rows or
      // columns to step through, so all four arrows walk the list order — which
      // is the ring order — and it wraps, because a ring has no ends. This also
      // retires the old grid-column probe: there's no grid left to measure.
      if (e.key.startsWith('Arrow')) {
        const list = planets();
        const i = list.indexOf(document.activeElement as HTMLElement);
        if (i === -1) return;
        const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
        e.preventDefault();
        list[(i + (forward ? 1 : -1) + list.length) % list.length].focus();
      }
    };

    const onMove = (e: PointerEvent) => {
      pointerX.set(e.clientX);
      pointerY.set(e.clientY);
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('pointermove', onMove);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointermove', onMove);
      document.body.style.overflow = prev;
      (trigger ?? previouslyFocused)?.focus();
    };
  }, [open, planets, pointerX, pointerY]);

  if (pathname?.startsWith('/resume')) return null;

  return (
    <>
      <div className="fixed top-6 right-6 z-40 print:hidden">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-black/30 px-5 py-2 text-sm font-medium text-white/70 opacity-0 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-(--color-2) hover:text-(--color-2) hover:opacity-100 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-6px_rgba(57,213,203,0.35)] focus-visible:opacity-100"
        >
          Mission Control
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mission-control"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 overflow-y-auto bg-[#04060f]/72 backdrop-blur-2xl"
          >
            {/* Vignette — pulls the eye to the middle of the field. */}
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.52) 100%)',
              }}
            />

            {/* The site's own aurora, mounted again inside the overlay. The
                site-wide instance sits behind the backdrop-blur and arrives
                defocused, so the modal gets a sharp copy across the top — same
                curtains, same palette clock, same treatment as every other page.

                Rendered with no props and dimmed by a scoped CSS rule instead.
                NorthernLights is in the root layout, so it draws on the home page
                and /resume too; adding props to it — even with identical defaults
                — puts those pages at risk for no benefit. The override lives here
                where only this modal can be affected. */}
            <div aria-hidden className="mc-aurora">
              <NorthernLights />
            </div>

            {/* The overlay's own stars, sharp above the blur. */}
            <ModalStarfield className="pointer-events-none fixed inset-0" />

            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mission Control"
              onClick={(e) => e.stopPropagation()}
              className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col justify-center px-5 py-6 sm:px-8 sm:py-8"
            >
              {/* Inside the dialog so the focus trap includes it; still fixed,
                  so it renders in the viewport corner either way. */}
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="fixed top-6 right-6 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/60 backdrop-blur-md transition-colors hover:border-white/40 hover:text-white"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden
                  className="h-4 w-4"
                >
                  <path d="M3 3 L13 13 M13 3 L3 13" />
                </svg>
              </button>

              {/* The system. On sm and up this is one square field: the star at
                  the center, planets on a ring around it. Below sm the CSS drops
                  the orbit and it becomes a plain two-column grid — an orbit
                  needs room a phone doesn't have. */}
              <div
                className="mc-field mx-auto w-full"
                style={
                  {
                    '--field-size': FIELD_SIZE,
                    '--orbit-r': ORBIT_R,
                    '--orbit-dur': `${ORBIT_PERIOD_S}s`,
                  } as CSSProperties
                }
              >
                <div aria-hidden className="mc-ring hidden sm:block" />

                {/* The star: everything that was the header now sits in the
                    middle, with the orrery as the body at its core. */}
                <motion.header
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                  className="col-span-2 text-center sm:absolute sm:left-1/2 sm:top-1/2 sm:w-[360px] sm:-translate-x-1/2 sm:-translate-y-1/2"
                >
                  <Orrery className="mx-auto h-[clamp(130px,22vh,230px)] w-full max-w-[360px]" />

                  <p className="accent-text text-[11px] font-bold uppercase tracking-[0.22em] sm:text-xs">
                    kid astro // all systems nominal
                  </p>
                  <h2 className="mt-1.5 text-2xl font-bold sm:text-4xl">Mission Control</h2>
                  <p className="mt-2 text-xs text-white/55 sm:text-base">
                    pages and satellites. pick a heading.
                  </p>
                  <p className="mt-3 text-[10px] font-bold uppercase leading-relaxed tracking-[0.16em] text-white/30 sm:text-[11px]">
                    <span className="accent-text">◉</span> current: {currentLabel}
                    <br className="hidden sm:block" />
                    <span className="mx-2 text-white/15 sm:hidden">·</span>
                    {pageCount} {pageCount === 1 ? 'page' : 'pages'}, {satelliteCount}{' '}
                    {satelliteCount === 1 ? 'satellite' : 'satellites'}
                    <span className="mx-2 text-white/15">·</span>
                    esc to disengage
                  </p>
                </motion.header>

                {destinations.map((d, i) => {
                  const angle = (360 / destinations.length) * i;
                  // Negative delay seeds each planet at its own angle without
                  // waiting for the animation to get there. The static rotate is
                  // the reduced-motion fallback: with the animation off, inline
                  // transform is what spreads them around the ring instead of
                  // stacking all six at twelve o'clock.
                  const delay = `${(-ORBIT_PERIOD_S / destinations.length) * i}s`;
                  return (
                    <div
                      key={d.id}
                      className="mc-arm"
                      style={
                        {
                          '--orbit-delay': delay,
                          transform: `rotate(${angle}deg)`,
                        } as CSSProperties
                      }
                    >
                      <div className="mc-orbit-offset">
                        <div
                          className="mc-upright"
                          style={
                            {
                              '--orbit-delay': delay,
                              transform: `rotate(${-angle}deg)`,
                            } as CSSProperties
                          }
                        >
                          <Planet
                            destination={d}
                            index={i}
                            total={destinations.length}
                            isHere={isHere(d.href)}
                            onNavigate={() => setOpen(false)}
                            pointerX={pointerX}
                            pointerY={pointerY}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MissionControl;
