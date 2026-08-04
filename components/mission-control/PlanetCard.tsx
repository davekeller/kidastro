'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import type { Destination } from './destinations';
import { HALOS, OrbitHalo } from './icons';

/* One destination, rendered as a body floating in the Mission Control scene.
   "Planet" comes from lighting and a satellite, not silhouette — a literal
   circle can't hold a title and a blurb at six-up, and it wrecks the tap
   target on mobile.

   Four nested transform layers, each with exactly one job, so none of them
   fight: CSS idle drift → field physics (parallax + nudge) → entrance spring
   → hover tilt. */

/* Three drift waveforms crossed with six durations — no two cards share a
   phase, which is what keeps the field from reading as furniture. */
const DRIFTS = ['mc-drift-a', 'mc-drift-b', 'mc-drift-c'];
const DRIFT_DURATIONS = [8.5, 10.2, 7.1, 9.4, 6.7, 11.3];

/* Vertical scatter so no two cards share a baseline. Static layout, not
   motion, so it survives prefers-reduced-motion. */
const ARC_OFFSETS = [-18, 14, -8, 20, -14, 6];

/* Six cards across the shared 100s accent cycle. Each sits on a different
   palette color at any instant while the whole field still drifts on the
   house clock — the ambient system stays intact. */
const ACCENT_STEP = -100 / 6;

/* Lag is the point: a field that snaps to the cursor reads as jitter, one
   that trails it reads as mass. */
const FIELD_SPRING = { stiffness: 90, damping: 20, mass: 1 };
const TILT_SPRING = { stiffness: 260, damping: 24, mass: 0.6 };

const NUDGE_RADIUS = 160;
const NUDGE_MAX = 10;
const TILT_MAX = 7;

/* Defined once at module scope — motion.create() inside the component body
   would mint a new component type every render and remount the card. */
const MotionLink = motion.create(Link);

interface Props {
  destination: Destination;
  index: number;
  isHere: boolean;
  onNavigate: () => void;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}

const PlanetCard = ({
  destination: d,
  index,
  isHere,
  onNavigate,
  pointerX,
  pointerY,
}: Props) => {
  const Icon = d.icon;
  const halo = HALOS[index % HALOS.length];
  const drift = DRIFTS[index % DRIFTS.length];
  const accentDelay = `${(index * ACCENT_STEP).toFixed(1)}s`;
  const reduced = useReducedMotion();

  const linkRef = useRef<HTMLAnchorElement>(null);
  const rect = useRef<DOMRect | null>(null);

  // Depth tier → scale, opacity, and a hair of blur on the farthest bodies.
  const scale = 0.94 + d.depth * 0.06;
  const opacity = 0.74 + d.depth * 0.26;
  const far = d.depth < 0.7;

  const fieldX = useSpring(0, FIELD_SPRING);
  const fieldY = useSpring(0, FIELD_SPRING);
  const tiltX = useSpring(0, TILT_SPRING);
  const tiltY = useSpring(0, TILT_SPRING);
  const limbX = useMotionValue(22);
  const limbY = useMotionValue(14);
  const limbXPct = useMotionTemplate`${limbX}%`;
  const limbYPct = useMotionTemplate`${limbY}%`;

  const measure = useCallback(() => {
    rect.current = linkRef.current?.getBoundingClientRect() ?? null;
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  // Parallax and the proximity nudge share one offset so they compose instead
  // of stacking two transforms that would need to be kept in sync.
  const applyField = useCallback(() => {
    if (reduced) return;
    const r = rect.current;
    if (!r) return;
    const px = pointerX.get();
    const py = pointerY.get();

    // Parallax — the whole field slides opposite the pointer, scaled by depth.
    const nx = px / window.innerWidth - 0.5;
    const ny = py / window.innerHeight - 0.5;
    let ox = nx * -24 * d.depth;
    let oy = ny * -24 * d.depth;

    // Nudge — bodies near the cursor are pushed along the cursor→card vector.
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
  }, [reduced, pointerX, pointerY, d.depth, fieldX, fieldY]);

  useMotionValueEvent(pointerX, 'change', applyField);
  useMotionValueEvent(pointerY, 'change', applyField);

  const onCardPointerMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const r = linkRef.current?.getBoundingClientRect();
    if (!r) return;
    const u = (e.clientX - r.left) / r.width;
    const v = (e.clientY - r.top) / r.height;
    tiltY.set((u - 0.5) * 2 * TILT_MAX);
    tiltX.set((0.5 - v) * 2 * TILT_MAX);
    // The lit face tracks the tilt — without this the gradient slides across a
    // flat card and the whole sphere illusion collapses.
    limbX.set(14 + u * 26);
    limbY.set(8 + v * 22);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
    limbX.set(22);
    limbY.set(14);
  };

  const surface = [
    'group relative flex h-full flex-col overflow-hidden rounded-3xl p-5 sm:p-6',
    'mc-limb border backdrop-blur-md',
    isHere ? 'border-white/30 bg-white/[0.07]' : 'border-white/10 bg-white/[0.04]',
  ].join(' ');

  const inner = (
    <>
      {/* Atmosphere. Its own element so the cycling color tints the glow
          without dragging the card's text along with it. */}
      <span
        aria-hidden
        className="accent-text pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          animationDelay: accentDelay,
          boxShadow: '0 0 42px -14px currentColor, inset 0 1px 0 rgba(255,255,255,0.07)',
        }}
      />

      <span
        className="accent-text relative z-10 mb-4 block h-14 w-14 opacity-85 transition-opacity duration-300 group-hover:opacity-100"
        style={{ animationDelay: accentDelay }}
      >
        <OrbitHalo spec={halo} className="absolute inset-0 h-full w-full" />
        <Icon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 sm:h-9 sm:w-9" />
      </span>

      <span className="relative z-10 block font-bold leading-tight">{d.title}</span>
      <span className="relative z-10 mt-1 block text-xs leading-snug text-white/60">
        {d.blurb}
      </span>
      {isHere && (
        <span
          className="accent-text relative z-10 mt-2 block text-[10px] font-bold uppercase tracking-widest"
          style={{ animationDelay: accentDelay }}
        >
          you are here
        </span>
      )}
    </>
  );

  const linkProps = {
    ref: linkRef,
    className: surface,
    onClick: onNavigate,
    'aria-current': isHere ? ('page' as const) : undefined,
    'data-planet': true,
    onPointerMove: onCardPointerMove,
    onPointerLeave: resetTilt,
    onBlur: resetTilt,
    style: {
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 900,
      ['--limb-x' as string]: limbXPct,
      ['--limb-y' as string]: limbYPct,
    },
    whileHover: reduced ? undefined : { scale: 1.045, y: -6 },
    whileTap: reduced ? undefined : { scale: 0.975 },
    transition: TILT_SPRING,
  };

  return (
    <div
      className={reduced ? 'h-full' : `${drift} h-full`}
      style={{
        animationDuration: `${DRIFT_DURATIONS[index % DRIFT_DURATIONS.length]}s`,
        animationDelay: `${index * -1.7}s`,
        marginTop: `${ARC_OFFSETS[index % ARC_OFFSETS.length]}px`,
      }}
    >
      <motion.div className="h-full" style={{ x: fieldX, y: fieldY }}>
        <motion.div
          className="h-full"
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.82, y: 40 }}
          animate={reduced ? { opacity } : { opacity, scale, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 22 }}
          transition={
            reduced
              ? { duration: 0.2 }
              : { type: 'spring', stiffness: 220, damping: 22, mass: 0.9, delay: index * 0.04 }
          }
          style={{ filter: far ? 'blur(0.4px)' : undefined, willChange: 'transform' }}
        >
          {d.external ? (
            <motion.a href={d.href} {...linkProps}>
              {inner}
            </motion.a>
          ) : (
            <MotionLink href={d.href} {...linkProps}>
              {inner}
            </MotionLink>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PlanetCard;
