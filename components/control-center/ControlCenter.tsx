'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { destinations } from './destinations';

/* Secret site-wide navigation. A ghost pill in the top-right corner (invisible
   until hovered or keyboard-focused) opens a floating card grid of every page
   on the site. Mounted once in the root layout; hides itself on /resume,
   where the Download PDF button owns that corner. */
const ControlCenter = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

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
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-black/30 px-5 py-2 text-sm font-medium text-white/70 opacity-0 backdrop-blur-md transition-[opacity,color,border-color] duration-300 hover:border-(--color-2) hover:text-(--color-2) hover:opacity-100 focus-visible:opacity-100"
        >
          Control Center
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="control-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-8"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Control Center"
              initial={{ opacity: 0, scale: 0.94, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl"
            >
              <div className="glass-panel float-drift relative rounded-2xl p-6 backdrop-blur-xl sm:p-8">
                <span aria-hidden className="color-bar absolute top-0 inset-x-8 h-[2px] rounded-full" />

                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="accent-text text-xs font-bold uppercase tracking-[0.2em]">
                      kid astro // secret nav
                    </p>
                    <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Control Center</h2>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="cursor-pointer rounded-full border border-white/15 p-2 text-white/60 transition-colors hover:border-white/40 hover:text-white"
                  >
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden className="h-4 w-4">
                      <path d="M3 3 L13 13 M13 3 L3 13" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {destinations.map((d) => {
                    const Icon = d.icon;
                    const here = d.href === '/' ? pathname === '/' : pathname?.startsWith(d.href);
                    const cardClasses = `group relative flex flex-col rounded-xl border p-4 transition-all duration-300 sm:p-5 ${
                      here
                        ? 'border-white/30 bg-white/[0.08]'
                        : 'border-white/10 bg-white/[0.04] hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.07]'
                    }`;
                    const inner = (
                      <>
                        <span className="accent-text mb-3 block opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                          <Icon className="h-9 w-9 sm:h-10 sm:w-10" />
                        </span>
                        <span className="block font-bold leading-tight">{d.title}</span>
                        <span className="mt-1 block text-xs leading-snug text-white/50">
                          {d.blurb}
                        </span>
                        {here && (
                          <span className="accent-text mt-2 block text-[10px] font-bold uppercase tracking-widest">
                            you are here
                          </span>
                        )}
                      </>
                    );
                    return d.external ? (
                      <a key={d.id} href={d.href} className={cardClasses} onClick={() => setOpen(false)}>
                        {inner}
                      </a>
                    ) : (
                      <Link key={d.id} href={d.href} className={cardClasses} onClick={() => setOpen(false)}>
                        {inner}
                      </Link>
                    );
                  })}
                </div>

                <p className="mt-6 text-center text-xs font-bold text-white/30">
                  shhh — you found the map. esc to close.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ControlCenter;
