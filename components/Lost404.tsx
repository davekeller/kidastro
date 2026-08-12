'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

// A wireframe "404" built the same way as the helmet: lines only, one weight.
// Each digit is a set of flat outlines (outer contour plus any counter) that
// gets extruded — a front copy, a back copy, and struts between them — so the
// numerals read as solid objects while staying pure line work.

const PALETTE = ['#f4fd7b', '#39d5cb', '#e4416f', '#fcd34d', '#6ee7b7'];

const H = 1.4; // cap height, in glyph units
const DEPTH = 0.19; // half-depth of the extrusion
const ADVANCE = 0.96; // pen travel per glyph
const STRUT_EVERY = 4; // one front→back strut per N outline points

type Pt = [number, number];

// Digit 4: outer contour (stem, crossbar, diagonal) plus the triangular
// counter. Stem and crossbar are both 0.22 thick so the weight reads even.
const FOUR: Pt[][] = [
  [
    [0.6, 1.4],
    [0.82, 1.4],
    [0.82, 0.0],
    [0.6, 0.0],
    [0.6, 0.36],
    [0.06, 0.36],
    [0.06, 0.58],
  ],
  [
    [0.6, 0.58],
    [0.6, 1.16],
    [0.24, 0.58],
  ],
];

/** Ellipse sampled as a closed ring of `seg` points. */
function ellipse(cx: number, cy: number, rx: number, ry: number, seg: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return out;
}

// Digit 0: an outer ring and its counter, sampled at the same resolution so
// struts on both contours land in step.
const ZERO: Pt[][] = [ellipse(0.44, 0.7, 0.4, 0.7, 44), ellipse(0.44, 0.7, 0.19, 0.4, 44)];

const GLYPHS: Pt[][][] = [FOUR, ZERO, FOUR];

// Ink extents of the run, used to center it and to fit it to the viewport.
const MIN_X = 0.06; // the first 4's crossbar tip
const MAX_X = (GLYPHS.length - 1) * ADVANCE + 0.82; // the last 4's stem
const GLYPH_W = MAX_X - MIN_X;

/** Line-segment pairs for the whole "404", centered on the origin at unit size. */
function build(): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];

  const midX = (MIN_X + MAX_X) / 2;
  const midY = H / 2;

  const v = (x: number, y: number, z: number) => new THREE.Vector3(x - midX, y - midY, z);

  GLYPHS.forEach((contours, g) => {
    const dx = g * ADVANCE;
    for (const contour of contours) {
      const n = contour.length;
      for (let i = 0; i < n; i++) {
        const [x0, y0] = contour[i];
        const [x1, y1] = contour[(i + 1) % n];
        // Front and back copies of the outline.
        pts.push(v(x0 + dx, y0, DEPTH), v(x1 + dx, y1, DEPTH));
        pts.push(v(x0 + dx, y0, -DEPTH), v(x1 + dx, y1, -DEPTH));
        // Struts tying the two faces together.
        if (i % STRUT_EVERY === 0) pts.push(v(x0 + dx, y0, DEPTH), v(x0 + dx, y0, -DEPTH));
      }
    }
  });

  return pts;
}

const Numerals = ({
  isDragging,
  dragDelta,
  velocity,
}: {
  isDragging: boolean;
  dragDelta: { x: number; y: number };
  velocity: { x: number; y: number };
}) => {
  const { viewport } = useThree();
  const floatGroupRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null);

  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  const dragRotation = useRef({ x: 0, y: 0 });
  const momentumVelocity = useRef({ x: 0, y: 0 });

  const colors = useMemo(() => PALETTE.map((c) => new THREE.Color(c)), []);
  const points = useMemo(() => build(), []);

  // Fit the numerals to whatever box the page gave us — they're wide, so a
  // fixed scale would overflow a phone and look lost on a desktop. Leaving
  // headroom on both axes keeps the sway and mouse drift from clipping.
  const fit = useMemo(
    () => Math.min((viewport.width * 0.78) / GLYPH_W, (viewport.height * 0.55) / H),
    [viewport.width, viewport.height],
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      if (isDragging) {
        dragRotation.current.x += dragDelta.y * 0.01;
        dragRotation.current.y += dragDelta.x * 0.01;
        momentumVelocity.current.x = velocity.y * 0.01;
        momentumVelocity.current.y = velocity.x * 0.01;
      } else {
        dragRotation.current.x += momentumVelocity.current.x;
        dragRotation.current.y += momentumVelocity.current.y;
        momentumVelocity.current.x *= 0.96;
        momentumVelocity.current.y *= 0.96;
        if (Math.abs(momentumVelocity.current.x) < 0.0001) momentumVelocity.current.x = 0;
        if (Math.abs(momentumVelocity.current.y) < 0.0001) momentumVelocity.current.y = 0;
      }

      // Idle motion is a slow sway rather than the homepage shape's full
      // tumble — the numerals have a front, and they should mostly face it.
      // Dragging still spins them freely.
      groupRef.current.rotation.y = Math.sin(t * 0.32) * 0.6 + dragRotation.current.y;
      groupRef.current.rotation.x = Math.sin(t * 0.47) * 0.13 + dragRotation.current.x;
    }

    if (floatGroupRef.current) {
      // Drift as a fraction of the frame so it stays proportional at any size.
      mouseTarget.current.x = state.mouse.x * viewport.width * 0.05;
      mouseTarget.current.y = state.mouse.y * viewport.height * 0.06;
      currentMouse.current.x += (mouseTarget.current.x - currentMouse.current.x) * 0.05;
      currentMouse.current.y += (mouseTarget.current.y - currentMouse.current.y) * 0.05;
      floatGroupRef.current.position.x = currentMouse.current.x;
      floatGroupRef.current.position.y = currentMouse.current.y;
    }

    // Palette cross-fade — same clock/speed as the icosahedron and helmet.
    const time = t * 0.2;
    const index = Math.floor(time) % colors.length;
    const nextIndex = (index + 1) % colors.length;
    const alpha = time % 1;
    const newColor = new THREE.Color().lerpColors(colors[index], colors[nextIndex], alpha);
    if (lineRef.current?.material?.color) lineRef.current.material.color.copy(newColor);
  });

  return (
    <group ref={floatGroupRef}>
      <Float speed={2} rotationIntensity={0.35} floatIntensity={1.6} floatingRange={[-0.4, 0.4]}>
        <group ref={groupRef}>
          <group scale={fit}>
            <Line points={points} color={PALETTE[0]} lineWidth={2.5} segments transparent opacity={0.85} ref={lineRef} />
          </group>
        </group>
      </Float>
    </group>
  );
};

/**
 * The floating 3D "404". Drag to spin it; it carries momentum and coasts back
 * to its sway, same feel as the homepage icosahedron.
 */
const Lost404 = ({ className = 'mx-auto h-[340px] w-full' }: { className?: string }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragDelta, setDragDelta] = React.useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = React.useState({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const velocityHistory = useRef<{ x: number; y: number }[]>([]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    lastTime.current = e.timeStamp;
    velocityHistory.current = [];
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (velocityHistory.current.length > 0) {
      const avg = velocityHistory.current.reduce((acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }), { x: 0, y: 0 });
      setVelocity({ x: avg.x / velocityHistory.current.length, y: avg.y / velocityHistory.current.length });
    }
    setIsDragging(false);
    setDragDelta({ x: 0, y: 0 });
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* pointer already released (e.g. leave) */
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dt = Math.max(e.timeStamp - lastTime.current, 1);
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    const velX = (deltaX / dt) * 16;
    const velY = (deltaY / dt) * 16;
    velocityHistory.current.push({ x: velX, y: velY });
    if (velocityHistory.current.length > 5) velocityHistory.current.shift();
    setDragDelta({ x: deltaX, y: deltaY });
    setVelocity({ x: velX, y: velY });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    lastTime.current = e.timeStamp;
  };

  return (
    <div
      className={`${className} overflow-hidden select-none touch-none`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <Canvas camera={{ position: [0, 0, 10] }}>
        <Numerals isDragging={isDragging} dragDelta={dragDelta} velocity={velocity} />
      </Canvas>
    </div>
  );
};

export default Lost404;
