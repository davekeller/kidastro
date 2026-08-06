'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import type { Destination } from './destinations';
import { HALOS, OrbitHalo } from './icons';

/* One destination as a body in the system: the haloed glyph with its satellite,
   the title under it, the blurb under that — and the whole stack is the link.

   No card. A bordered rectangle was the thing making the old version read as
   furniture; a planet is a lit object with a label, not a panel. */

/* Three drift waveforms crossed with six durations. Every planet shares the
   orbit period (see .mc-field in globals.css), so this is where per-body life
   comes from — without it a rigid ring rotation looks mechanical. */
const DRIFTS = ['mc-drift-a', 'mc-drift-b', 'mc-drift-c'];
const DRIFT_DURATIONS = [8.5, 10.2, 7.1, 9.4, 6.7, 11.3];

/* Length of the site's shared accent cycle (.accent-text in globals.css).
   Planets are spread evenly across it, so each sits on a different palette
   color at any instant while the field still drifts on the house clock.

   Derived from the live count rather than hardcoded: the map grows as satellites
   get added, and a fixed divisor would quietly stop distributing evenly. */
const ACCENT_CYCLE_S = 100;

/* Lag is the point: a field that snaps to the cursor reads as jitter, one that
   trails it reads as mass. */
const FIELD_SPRING = { stiffness: 90, damping: 20, mass: 1 };
const HOVER_SPRING = { stiffness: 260, damping: 22, mass: 0.6 };

const NUDGE_RADIUS = 150;
const NUDGE_MAX = 9;

const MotionLink = motion.create(Link);

interface Props {
  destination: Destination;
  index: number;
  /** How many bodies are in the field — sets the accent-cycle spacing. */
  total: number;
  isHere: boolean;
  onNavigate: () => void;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}

const Planet = ({
  destination: d,
  index,
  total,
  isHere,
  onNavigate,
  pointerX,
  pointerY,
}: Props) => {
  const Icon = d.icon;
  const halo = HALOS[index % HALOS.length];
  const drift = DRIFTS[index % DRIFTS.length];
  const accentDelay = `${((index * -ACCENT_CYCLE_S) / Math.max(total, 1)).toFixed(1)}s`;
  const reduced = useReducedMotion();

  const linkRef = useRef<HTMLAnchorElement>(null);
  const rect = useRef<DOMRect | null>(null);

  // Depth tier → scale and opacity, so the ring still reads front-to-back
  // rather than as six identical bodies at one distance.
  const scale = 0.86 + d.depth * 0.14;
  const opacity = 0.76 + d.depth * 0.24;

  const fieldX = useSpring(0, FIELD_SPRING);
  const fieldY = useSpring(0, FIELD_SPRING);

  // The planet is in motion, so its box has to be re-read rather than measured
  // once — a cached rect would put the nudge where the planet used to be.
  const measure = useCallback(() => {
    rect.current = linkRef.current?.getBoundingClientRect() ?? null;
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const applyField = useCallback(() => {
    if (reduced) return;
    measure();
    const r = rect.current;
    if (!r) return;
    const px = pointerX.get();
    const py = pointerY.get();

    // Parallax — the field slides opposite the pointer, scaled by depth.
    const nx = px / window.innerWidth - 0.5;
    const ny = py / window.innerHeight - 0.5;
    let ox = nx * -22 * d.depth;
    let oy = ny * -22 * d.depth;

    // Nudge — bodies near the cursor are pushed along the cursor→body vector.
    const dx = r.left + r.width / 2 - px;
    const dy = r.top + r.height / 2 - py;
    const dist = Math.hypot(dx, dy);
    if (dist < NUDGE_RADIUS && dist > 0.001) {
      const push = (1 - dist / NUDGE_RADIUS) * NUDGE_MAX;
      ox += (dx / dist) * push;
      oy += (dy / dist) * push;
    }

    fieldX.set(ox);
    fieldY.set(oy);
  }, [reduced, measure, pointerX, pointerY, d.depth, fieldX, fieldY]);

  useMotionValueEvent(pointerX, 'change', applyField);
  useMotionValueEvent(pointerY, 'change', applyField);

  const content = (
    <>
      {/* The body: glyph inside its tilted orbit ring, with a satellite riding
          it. Sized up from the old card icon — this is the planet now. */}
      <span
        className="accent-text relative block h-[92px] w-[92px] opacity-90 transition-opacity duration-300 group-hover:opacity-100 sm:h-[108px] sm:w-[108px]"
        style={{ animationDelay: accentDelay }}
      >
        {/* Atmosphere — a soft glow behind the glyph, in the cycling color. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[18%] rounded-full opacity-40 blur-xl"
          style={{ background: 'currentColor' }}
        />
        <OrbitHalo spec={halo} className="absolute inset-0 h-full w-full" />
        <Icon className="absolute left-1/2 top-1/2 h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 sm:h-[64px] sm:w-[64px]" />
      </span>

      <span className="mt-3 block text-center text-sm font-bold leading-tight sm:text-lg">
        {d.title}
      </span>
      <span className="mt-1 block max-w-[17ch] text-center text-[11px] leading-snug text-white/45 transition-colors duration-300 group-hover:text-white/70 sm:text-xs">
        {d.blurb}
      </span>

      {isHere ? (
        <span
          className="accent-text mt-1.5 block text-[10px] font-bold uppercase tracking-widest"
          style={{ animationDelay: accentDelay }}
        >
          you are here
        </span>
      ) : (
        d.kind === 'satellite' && (
          <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-widest text-white/30">
            satellite ↗
          </span>
        )
      )}
    </>
  );

  const linkProps = {
    ref: linkRef,
    className:
      'group flex w-[150px] cursor-pointer flex-col items-center rounded-2xl px-2 py-2 outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:w-[176px]',
    onClick: onNavigate,
    'aria-current': isHere ? ('page' as const) : undefined,
    'data-planet': true,
    whileHover: reduced ? undefined : { scale: 1.09 },
    whileTap: reduced ? undefined : { scale: 0.97 },
    transition: HOVER_SPRING,
  };

  return (
    <motion.div
      className={reduced ? undefined : drift}
      style={{
        animationDuration: `${DRIFT_DURATIONS[index % DRIFT_DURATIONS.length]}s`,
        animationDelay: `${index * -1.7}s`,
      }}
    >
      <motion.div style={{ x: fieldX, y: fieldY, willChange: 'transform' }}>
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: scale * 0.7 }}
          animate={reduced ? { opacity } : { opacity, scale }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: scale * 0.8 }}
          transition={
            reduced
              ? { duration: 0.2 }
              : { type: 'spring', stiffness: 220, damping: 22, mass: 0.9, delay: index * 0.05 }
          }
        >
          {d.kind === 'satellite' ? (
            <motion.a href={d.href} {...linkProps}>
              {content}
            </motion.a>
          ) : (
            <MotionLink href={d.href} {...linkProps}>
              {content}
            </MotionLink>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Planet;
