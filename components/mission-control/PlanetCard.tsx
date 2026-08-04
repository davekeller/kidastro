'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { Destination } from './destinations';
import { HALOS, OrbitHalo } from './icons';

/* One destination, rendered as a body floating in the Mission Control scene.
   "Planet" comes from lighting and a satellite, not silhouette — a literal
   circle can't hold a title and a blurb at six-up, and it wrecks the tap
   target on mobile.

   Phase 1 ships the surface treatment with CSS hover; Phase 3 replaces the
   hover and drift with framer-motion springs, pointer parallax, and the
   proximity nudge. */

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

interface Props {
  destination: Destination;
  index: number;
  isHere: boolean;
  onNavigate: () => void;
}

const PlanetCard = ({ destination: d, index, isHere, onNavigate }: Props) => {
  const Icon = d.icon;
  const halo = HALOS[index % HALOS.length];
  const drift = DRIFTS[index % DRIFTS.length];
  const accentDelay = `${(index * ACCENT_STEP).toFixed(1)}s`;

  // Depth tier → scale, opacity, and a hair of blur on the farthest bodies.
  const scale = 0.94 + d.depth * 0.06;
  const opacity = 0.74 + d.depth * 0.26;
  const far = d.depth < 0.7;

  const surface = [
    'group relative flex h-full flex-col overflow-hidden rounded-3xl p-5 sm:p-6',
    'mc-limb border backdrop-blur-md',
    'transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
    isHere
      ? 'border-white/30 bg-white/[0.07]'
      : 'border-white/10 bg-white/[0.04] hover:-translate-y-1.5 hover:border-white/30',
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

  const style: CSSProperties = {
    transform: `scale(${scale})`,
    opacity,
    filter: far ? 'blur(0.4px)' : undefined,
  };

  return (
    <div
      className={`${drift} h-full`}
      style={{
        animationDuration: `${DRIFT_DURATIONS[index % DRIFT_DURATIONS.length]}s`,
        animationDelay: `${index * -1.7}s`,
        marginTop: `${ARC_OFFSETS[index % ARC_OFFSETS.length]}px`,
      }}
    >
      <div style={style} className="h-full">
        {d.external ? (
          <a href={d.href} className={surface} onClick={onNavigate} aria-current={isHere ? 'page' : undefined}>
            {inner}
          </a>
        ) : (
          <Link href={d.href} className={surface} onClick={onNavigate} aria-current={isHere ? 'page' : undefined}>
            {inner}
          </Link>
        )}
      </div>
    </div>
  );
};

export default PlanetCard;
