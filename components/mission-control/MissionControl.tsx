'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { destinations } from './destinations';
import ModalStarfield from './ModalStarfield';
import Orrery from './Orrery';
import PlanetCard from './PlanetCard';

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

  const isHere = (href: string) =>
    href === '/' ? pathname === '/' : Boolean(pathname?.startsWith(href));

  const currentLabel = useMemo(() => {
    const match = destinations.find((d) => isHere(d.href));
    return match ? match.title.toLowerCase() : 'deep space';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Esc closes, body scroll locks, close button takes focus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (pathname?.startsWith('/resume')) return null;

  return (
    <>
      <div className="fixed top-6 right-6 z-40 print:hidden">
        <button
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

            {/* The overlay's own stars, sharp above the blur. */}
            <ModalStarfield className="pointer-events-none fixed inset-0" />

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

            <div
              role="dialog"
              aria-modal="true"
              aria-label="Mission Control"
              onClick={(e) => e.stopPropagation()}
              className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-5 py-10 sm:px-8 sm:py-14"
            >
              <motion.header
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                className="mb-7 text-center sm:mb-10"
              >
                {/* Sized against viewport height so a short laptop doesn't push
                    the second row off-screen. */}
                <Orrery className="mx-auto h-[clamp(104px,19vh,215px)] w-full max-w-[340px]" />

                <p className="accent-text text-xs font-bold uppercase tracking-[0.22em]">
                  kid astro // all systems nominal
                </p>
                <h2 className="mt-2 text-3xl font-bold sm:text-5xl">Mission Control</h2>
                <p className="mt-3 text-sm text-white/55 sm:text-base">
                  six destinations. pick a heading.
                </p>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/30">
                  <span className="accent-text">◉</span> current: {currentLabel}
                  <span className="mx-2 text-white/15">·</span>
                  {destinations.length} bodies in system
                  <span className="mx-2 text-white/15">·</span>
                  esc to disengage
                </p>
              </motion.header>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
                {destinations.map((d, i) => (
                  <PlanetCard
                    key={d.id}
                    destination={d}
                    index={i}
                    isHere={isHere(d.href)}
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MissionControl;
