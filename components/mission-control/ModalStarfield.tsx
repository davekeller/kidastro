/* The Mission Control overlay's own stars — sharp, sitting above the backdrop
   blur, so the modal reads as its own patch of space instead of a blurred
   photograph of the page behind it.

   Deliberately ~40 divs and CSS keyframes rather than a canvas: the site
   already runs two rAF loops (Starfield, NorthernLights) plus the orrery, and
   a third would buy nothing here. Positions come from a cheap deterministic
   hash rather than Math.random() so server and client agree and the diff stays
   stable between renders. */

const STAR_COUNT = 44;

// Fract(sin(n) * large) — the standard shader-style hash. Stable, no seeding
// ceremony, and good enough scatter for decoration.
const hash = (n: number) => {
  const x = Math.sin(n) * 43758.5453;
  return x - Math.floor(x);
};

interface Star {
  left: number;
  top: number;
  size: number;
  tone: number;
  duration: number;
  delay: number;
  depth: number;
}

const stars: Star[] = Array.from({ length: STAR_COUNT }, (_, i) => ({
  left: hash(i * 3.1) * 100,
  top: hash(i * 7.7 + 1) * 100,
  size: 1 + hash(i * 2.3 + 2) * 1.4,
  tone: Math.floor(hash(i * 5.9 + 3) * 5) + 1,
  duration: 2.6 + hash(i * 4.1 + 4) * 4.2,
  delay: hash(i * 6.3 + 5) * -6,
  depth: 0.3 + hash(i * 8.9 + 6) * 0.7,
}));

const ModalStarfield = ({ className }: { className?: string }) => (
  <div aria-hidden className={className}>
    {stars.map((s, i) => (
      <span
        key={i}
        className="mc-star"
        data-depth={s.depth.toFixed(2)}
        style={{
          left: `${s.left}%`,
          top: `${s.top}%`,
          width: `${s.size}px`,
          height: `${s.size}px`,
          background: `var(--color-${s.tone})`,
          animationDuration: `${s.duration}s`,
          animationDelay: `${s.delay}s`,
        }}
      />
    ))}
  </div>
);

export default ModalStarfield;
