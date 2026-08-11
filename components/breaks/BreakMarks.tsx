import type { ComponentProps } from 'react';

/* Wireframe marks for the homepage section breaks — the flat cousins of the
   header icosahedron. Same drawing conventions as the Mission Control glyphs
   in components/mission-control/icons.tsx: 48-unit box, no fills, every line
   strokes currentColor so the parent can tint them on the ambient clock.

   Every mark reads downward, and every one is drawn as a solid seen in
   perspective — back-facing edges sit at 0.6 or lower so the eye resolves
   near from far. That's what carries the 3D read once the mark starts
   swaying; a flat outline just looks like a skewing sticker. */

type MarkProps = ComponentProps<'svg'>;

const base = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

/* 0 — Tetrahedron balanced on its point. The plainest statement of "down". */
function TetraDrop(props: MarkProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 13 L24 22 L38 13" />
      <path d="M10 13 L24 42 L38 13" />
      <path d="M24 22 V42" />
      <path d="M10 13 H38" opacity="0.45" />
      <circle cx="24" cy="42" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* 1 — Three octahedra falling away down the axis, each smaller and fainter
   than the last. The equator of each is split into a near arc and a far one
   so the body reads as round rather than as a stacked diamond. */
function OctaDescent(props: MarkProps) {
  const bodies = [
    { cy: 12, w: 9, h: 7, o: 1 },
    { cy: 26, w: 6, h: 4.7, o: 0.7 },
    { cy: 37, w: 3.6, h: 2.9, o: 0.4 },
  ];
  return (
    <svg {...base} {...props}>
      {bodies.map(({ cy, w, h, o }) => (
        <g key={cy} opacity={o}>
          <path d={`M24 ${cy - h} L${24 + w} ${cy} L24 ${cy + h} L${24 - w} ${cy} Z`} />
          <path d={`M${24 - w} ${cy} Q24 ${cy + h * 0.42} ${24 + w} ${cy}`} opacity="0.75" />
          <path d={`M${24 - w} ${cy} Q24 ${cy - h * 0.42} ${24 + w} ${cy}`} opacity="0.35" />
        </g>
      ))}
    </svg>
  );
}

/* 2 — A flat plane hinged along a crease and folded down to a point: an
   arrow built out of geometry instead of drawn as one. The upper panel is
   near edge-on, the lower one dives at the viewer. */
function FoldedPlane(props: MarkProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 13 L16 21 H32 L36 13" />
      <path d="M16 21 L24 40 L32 21" />
      <path d="M12 13 H36" opacity="0.45" />
      <path d="M24 21 V40" opacity="0.5" />
      <path d="M14 17 H34" opacity="0.3" />
    </svg>
  );
}

/* 3 — A body on a tilted ring, dropping a plumb line to a satellite below.
   The only mark whose "down" is implied by a path rather than by a face. */
function OrbitalDrop(props: MarkProps) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="24" cy="15" rx="15" ry="5.4" transform="rotate(-14 24 15)" opacity="0.5" />
      <circle cx="24" cy="15" r="4.6" />
      <circle cx="24" cy="15" r="1.3" fill="currentColor" stroke="none" />
      <path d="M24 20 V38" strokeDasharray="1.5 3.5" opacity="0.6" />
      <path d="M20.5 38 H27.5" opacity="0.7" />
      <circle cx="24" cy="42" r="1.8" fill="currentColor" stroke="none" opacity="0.85" />
      <circle cx="38.2" cy="11.6" r="1.5" fill="currentColor" stroke="none" opacity="0.8" />
    </svg>
  );
}

/* 4 — A scanning cone narrowing to a point, crossed by two range rings that
   shrink with it. Reads as a beam sweeping the ground below. */
function ScanCone(props: MarkProps) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="24" cy="10" rx="15" ry="4.4" opacity="0.55" />
      <path d="M9 10 L24 41 L39 10" />
      <ellipse cx="24" cy="24" rx="8.2" ry="2.4" opacity="0.55" />
      <ellipse cx="24" cy="33" rx="3.9" ry="1.2" opacity="0.35" />
      <path d="M24 14 V41" opacity="0.3" />
      <circle cx="24" cy="41" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Sway parameters live next to the marks so a mark and its motion stay one
   idea. Each pairing gets its own arc and period — the page shows ten breaks
   from five marks, and matched timings would give the repeats away. */
export interface BreakMark {
  Mark: (props: MarkProps) => React.JSX.Element;
  /** Sway keyframe variant in globals.css (.break-sway-N). */
  sway: number;
  /** How far this mark drifts against the pointer, 1 = the base rate. */
  depth: number;
}

export const BREAK_MARKS: BreakMark[] = [
  { Mark: TetraDrop, sway: 0, depth: 1 },
  { Mark: OctaDescent, sway: 1, depth: 0.72 },
  { Mark: FoldedPlane, sway: 2, depth: 1.18 },
  { Mark: OrbitalDrop, sway: 3, depth: 0.85 },
  { Mark: ScanCone, sway: 4, depth: 1.05 },
];
