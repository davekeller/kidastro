'use client';

import { useEffect, useRef } from 'react';

/* The Mission Control header instrument: three nested rings on tilted axes
   orbiting a tumbling octahedron core, each ring carrying a satellite with a
   short trail, over the faint ecliptic graticule of a tracking display.

   Line art, drawn on a 2D canvas with hand-rolled projection rather than
   react-three-fiber. MissionControl is mounted in app/layout.tsx, so a static
   r3f import would hoist three.js out of the per-route chunks it lives in
   today (/, /games, /lyrics) and into the shared bundle every page loads.
   Same approach as kidastro-themes' AstroHedron, which this follows closely.

   Drag physics are ported from components/Icosahedron.tsx — that's the feel
   the design brief asked to echo, down to the 5-sample velocity averaging and
   0.96 friction. */

type Vec3 = [number, number, number];

const rotX = ([x, y, z]: Vec3, a: number): Vec3 => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
};

const rotY = ([x, y, z]: Vec3, a: number): Vec3 => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [x * c + z * s, y, -x * s + z * c];
};

interface Ring {
  radius: number;
  /** Fixed orientation of the ring's own plane. */
  tiltX: number;
  tiltY: number;
  /** Satellite angular speed (rad/s) and starting angle. */
  spin: number;
  phase: number;
}

/* Different radii, different plane orientations, different satellite rates —
   matched values would read as concentric circles rather than a system. */
const RINGS: Ring[] = [
  { radius: 1.0, tiltX: 1.15, tiltY: 0.25, spin: 0.5, phase: 0 },
  { radius: 0.72, tiltX: 0.55, tiltY: -0.7, spin: -0.78, phase: 2.1 },
  { radius: 0.46, tiltX: 1.48, tiltY: 0.9, spin: 1.1, phase: 4.0 },
];

const RING_SEGMENTS = 72;
const TRAIL = 12;

/* Octahedron core — 6 vertices, 12 edges. */
const CORE_V: Vec3[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];
const CORE_E: [number, number][] = [
  [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 2], [1, 3], [1, 4], [1, 5],
  [2, 4], [2, 5], [3, 4], [3, 5],
];
const CORE_SCALE = 0.27;

const ECLIPTIC_R = 1.12;

const FALLBACK = [
  { r: 244, g: 253, b: 123 },
  { r: 57, g: 213, b: 203 },
  { r: 228, g: 65, b: 111 },
  { r: 252, g: 211, b: 77 },
  { r: 110, g: 231, b: 183 },
];

const hexToRgb = (hex: string) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Orrery = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Palette comes from the site's CSS custom properties so the instrument
    // stays inside the ambient system instead of hardcoding its own hexes.
    const cs = getComputedStyle(canvas);
    const palette = Array.from({ length: 5 }, (_, i) => {
      const raw = cs.getPropertyValue(`--color-${i + 1}`);
      return (raw && hexToRgb(raw)) || FALLBACK[i];
    });

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return false;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return true;
    };

    // Interaction state
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const dragRot = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };
    const history: { x: number; y: number }[] = [];
    const mouse = { x: 0, y: 0 };
    const parallax = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      history.length = 0;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      dragRot.y += dx * 0.008;
      dragRot.x += dy * 0.008;
      // Keep the trailing 5 samples and release on their mean — a single
      // instantaneous reading makes the fling jerky when the pointer stalls
      // for a frame right before lift.
      history.push({ x: dy * 0.004, y: dx * 0.004 });
      if (history.length > 5) history.shift();
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (dragging && history.length) {
        const sum = history.reduce((a, v) => ({ x: a.x + v.x, y: a.y + v.y }), { x: 0, y: 0 });
        velocity.x = sum.x / history.length;
        velocity.y = sum.y / history.length;
      }
      dragging = false;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    const start = performance.now();

    const render = (now: number) => {
      if (!width || !height) return;
      const t = reducedMotion ? 0 : (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      // 20s per color = the site's 100s ambient clock.
      const ct = t / 20;
      const i = Math.floor(ct) % palette.length;
      const j = (i + 1) % palette.length;
      const k = ct % 1;
      const col = (alpha: number) =>
        `rgba(${Math.round(lerp(palette[i].r, palette[j].r, k))}, ${Math.round(
          lerp(palette[i].g, palette[j].g, k)
        )}, ${Math.round(lerp(palette[i].b, palette[j].b, k))}, ${alpha})`;

      if (!dragging) {
        dragRot.x += velocity.x;
        dragRot.y += velocity.y;
        velocity.x *= 0.96;
        velocity.y *= 0.96;
        if (Math.abs(velocity.x) < 1e-4) velocity.x = 0;
        if (Math.abs(velocity.y) < 1e-4) velocity.y = 0;
      }

      parallax.x += (mouse.x * 10 - parallax.x) * 0.05;
      parallax.y += (mouse.y * 7 - parallax.y) * 0.05;

      const rx = t * 0.12 + dragRot.x;
      const ry = t * 0.17 + dragRot.y;
      const bob = Math.sin(t * 0.8) * 5;

      const cx = width / 2 + parallax.x;
      const cy = height / 2 + parallax.y + bob;
      // Ecliptic sits at 1.12 and the perspective divide magnifies near points
      // by up to 1.5x, so keep the base radius inside the box.
      const radius = Math.min(width, height) * 0.36;

      const project = (v: Vec3) => {
        const p = rotY(rotX(v, rx), ry);
        const persp = 3 / (3 - p[2]);
        return [cx + p[0] * radius * persp, cy + p[1] * radius * persp, p[2]] as const;
      };

      const ringPoint = (ring: Ring, theta: number): Vec3 =>
        rotY(
          rotX([Math.cos(theta) * ring.radius, Math.sin(theta) * ring.radius, 0], ring.tiltX),
          ring.tiltY
        );

      ctx.lineCap = 'round';

      // Ecliptic graticule — flat ring plus four ticks.
      const flat = (theta: number, r: number): Vec3 => [Math.cos(theta) * r, 0, Math.sin(theta) * r];
      ctx.lineWidth = 1.3;
      for (let s = 0; s < RING_SEGMENTS; s++) {
        const a = (s / RING_SEGMENTS) * Math.PI * 2;
        const b = ((s + 1) / RING_SEGMENTS) * Math.PI * 2;
        const [x1, y1, z1] = project(flat(a, ECLIPTIC_R));
        const [x2, y2, z2] = project(flat(b, ECLIPTIC_R));
        ctx.strokeStyle = col(0.05 + ((z1 + z2) / 2 + 1) / 2 * 0.07);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      for (let s = 0; s < 4; s++) {
        const a = (s / 4) * Math.PI * 2;
        const [x1, y1] = project(flat(a, ECLIPTIC_R - 0.07));
        const [x2, y2, z2] = project(flat(a, ECLIPTIC_R + 0.07));
        ctx.strokeStyle = col(0.1 + (z2 + 1) / 2 * 0.14);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Rings. Drawn segment by segment so the back half can dim — a single
      // path would paint flat and the nesting would read as overlapping
      // circles rather than depth.
      for (const ring of RINGS) {
        for (let s = 0; s < RING_SEGMENTS; s++) {
          const a = (s / RING_SEGMENTS) * Math.PI * 2;
          const b = ((s + 1) / RING_SEGMENTS) * Math.PI * 2;
          const [x1, y1, z1] = project(ringPoint(ring, a));
          const [x2, y2, z2] = project(ringPoint(ring, b));
          const d = ((z1 + z2) / 2 + 1) / 2;
          ctx.strokeStyle = col(0.2 + d * 0.5);
          ctx.lineWidth = 1.6 + d * 1.3;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // Core
      const coreProjected = CORE_V.map((v) =>
        project([v[0] * CORE_SCALE, v[1] * CORE_SCALE, v[2] * CORE_SCALE])
      );
      for (const [a, b] of CORE_E) {
        const [x1, y1, z1] = coreProjected[a];
        const [x2, y2, z2] = coreProjected[b];
        const d = ((z1 + z2) / 2 + 1) / 2;
        ctx.strokeStyle = col(0.4 + d * 0.5);
        ctx.lineWidth = 1.9 + d * 1.3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Satellites with fading trails — the bit that makes it read as
      // tracking something rather than as decoration.
      for (const ring of RINGS) {
        for (let s = TRAIL; s >= 0; s--) {
          const theta = ring.phase + (t - s * 0.05) * ring.spin;
          const [x, y, z] = project(ringPoint(ring, theta));
          const d = (z + 1) / 2;
          const fade = 1 - s / (TRAIL + 1);
          ctx.fillStyle = col(fade * fade * (0.25 + d * 0.7));
          const size = (1.1 + d * 2.1) * (0.35 + fade * 0.65);
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (now: number) => {
      render(now);
      raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (raf || reducedMotion) return;
      raf = requestAnimationFrame(loop);
    };

    // Paint synchronously first: a hidden tab never fires rAF, which would
    // otherwise leave the canvas blank.
    if (resize()) render(performance.now());
    startLoop();

    const observer = new ResizeObserver(() => {
      if (resize()) render(performance.now());
    });
    observer.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden) startLoop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ touchAction: 'none', cursor: 'grab' }}
    />
  );
};

export default Orrery;
