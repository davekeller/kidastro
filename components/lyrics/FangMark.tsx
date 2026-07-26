'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

// The Paper Fang mark: a curved wireframe canine fang punching through a
// torn-paper collar. Same line-art language as the homepage icosahedron and
// the arcade helmet — one line weight, no fills, palette cross-fade — but it
// leads with the pink end of the cycle.

const PALETTE = ['#e4416f', '#fcd34d', '#39d5cb', '#f4fd7b', '#6ee7b7'];

// Spine of the fang: starts at the root, bows forward as it drops to the tip.
const spinePoint = (t: number) =>
  new THREE.Vector3(0.25 * t + 1.35 * t * t, 2.1 - 4.6 * t, 0);

// Cross-section radius along the spine — slightly convex taper.
const radiusAt = (t: number) => 1.15 * Math.pow(1 - t, 0.8);

// Fixed "random" offsets for the torn paper edge, so the tear is stable.
const TEAR = [1.0, 0.62, 0.88, 0.5, 1.0, 0.58, 0.8, 0.46, 0.94, 0.6, 0.86, 0.52, 0.98, 0.64, 0.9, 0.48];

const FangShape = ({
  isDragging,
  dragDelta,
  velocity,
}: {
  isDragging: boolean;
  dragDelta: { x: number; y: number };
  velocity: { x: number; y: number };
}) => {
  const floatGroupRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null);

  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const dragRotation = useRef({ x: 0, y: 0 });
  const autoYOffset = useRef(0);
  const momentumVelocity = useRef({ x: 0, y: 0 });

  const colors = useMemo(() => PALETTE.map((c) => new THREE.Color(c)), []);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const SEG = 36;
    const MER = 10;

    // Sample the fang surface: elliptical rings around the spine (flatter
    // side-to-side, like a real canine), denser near the root.
    const tSteps = [0, 0.08, 0.18, 0.3, 0.44, 0.58, 0.72, 0.85, 0.94];
    const ringAt = (t: number) => {
      const c = spinePoint(t);
      const r = radiusAt(t);
      const samples: THREE.Vector3[] = [];
      for (let i = 0; i <= SEG; i++) {
        const a = (i / SEG) * Math.PI * 2;
        samples.push(new THREE.Vector3(c.x + Math.cos(a) * r, c.y, c.z + Math.sin(a) * r * 0.72));
      }
      return samples;
    };

    const rings = tSteps.map(ringAt);
    // Ring segments.
    for (const ring of rings) {
      for (let i = 0; i < SEG; i++) pts.push(ring[i], ring[i + 1]);
    }
    // Meridians: connect rings, then converge on the tip.
    const tip = spinePoint(1);
    for (let m = 0; m < MER; m++) {
      const idx = Math.round((m / MER) * SEG);
      for (let k = 0; k < rings.length - 1; k++) pts.push(rings[k][idx], rings[k + 1][idx]);
      pts.push(rings[rings.length - 1][idx], tip);
    }

    // Enamel glint: a short arc down the front face of the fang.
    for (let i = 0; i < 6; i++) {
      const t0 = 0.2 + (i / 6) * 0.45;
      const t1 = 0.2 + ((i + 1) / 6) * 0.45;
      const p0 = spinePoint(t0);
      const p1 = spinePoint(t1);
      pts.push(
        new THREE.Vector3(p0.x + radiusAt(t0) * 0.82, p0.y, radiusAt(t0) * 0.28),
        new THREE.Vector3(p1.x + radiusAt(t1) * 0.82, p1.y, radiusAt(t1) * 0.28),
      );
    }

    // Torn-paper collar: two jagged rings (top + underside) around the root,
    // joined by fold lines at each tear vertex.
    const COLLAR_Y = 1.55;
    const collarRing = (y: number, scale: number) => {
      const verts: THREE.Vector3[] = [];
      const n = TEAR.length;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const r = (1.55 + TEAR[i] * 1.15) * scale;
        verts.push(new THREE.Vector3(Math.cos(a) * r, y + (i % 2 ? 0.06 : -0.04), Math.sin(a) * r));
      }
      for (let i = 0; i < n; i++) pts.push(verts[i], verts[(i + 1) % n]);
      return verts;
    };
    const top = collarRing(COLLAR_Y, 1);
    const bottom = collarRing(COLLAR_Y - 0.16, 0.97);
    for (let i = 0; i < TEAR.length; i += 2) pts.push(top[i], bottom[i]);
    // Fold creases: a few lines from the fang root out to tear points.
    const rootR = radiusAt((2.1 - COLLAR_Y) / 4.6);
    for (const i of [1, 4, 7, 10, 13]) {
      const a = (i / TEAR.length) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * rootR, COLLAR_Y, Math.sin(a) * rootR * 0.72), top[i]);
    }

    return pts;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      if (isDragging) {
        dragRotation.current.x += dragDelta.y * 0.01;
        dragRotation.current.y += dragDelta.x * 0.01;
        autoYOffset.current = t * 0.3;
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
      // Steady spin, slight forward lean so the curve of the tooth reads.
      const autoY = t * 0.3 - autoYOffset.current;
      groupRef.current.rotation.x = 0.16 + Math.sin(t * 0.5) * 0.1 + dragRotation.current.x;
      groupRef.current.rotation.y = autoY + dragRotation.current.y;
    }

    if (floatGroupRef.current) {
      mouseTarget.current.x = state.mouse.x * 2.4;
      mouseTarget.current.y = state.mouse.y * 1.6;
      currentMouse.current.x += (mouseTarget.current.x - currentMouse.current.x) * 0.05;
      currentMouse.current.y += (mouseTarget.current.y - currentMouse.current.y) * 0.05;
      floatGroupRef.current.position.x = currentMouse.current.x;
      floatGroupRef.current.position.y = currentMouse.current.y;
    }

    // Palette cross-fade — same clock/speed as the rest of the site.
    const time = t * 0.2;
    const index = Math.floor(time) % colors.length;
    const nextIndex = (index + 1) % colors.length;
    const alpha = time % 1;
    const newColor = new THREE.Color().lerpColors(colors[index], colors[nextIndex], alpha);
    if (lineRef.current?.material?.color) lineRef.current.material.color.copy(newColor);
  });

  return (
    <group ref={floatGroupRef}>
      <Float speed={2} rotationIntensity={1.2} floatIntensity={2} floatingRange={[-0.4, 0.4]}>
        <group ref={groupRef} position={[0, 0.35, 0]}>
          <Line points={points} color={PALETTE[0]} lineWidth={2.5} segments transparent opacity={0.85} ref={lineRef} />
        </group>
      </Float>
    </group>
  );
};

const FangMark = () => {
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
      /* pointer already released */
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
      className="mx-auto h-[240px] w-full max-w-[360px] overflow-hidden select-none touch-none"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <Canvas camera={{ position: [0, 0, 10] }}>
        <FangShape isDragging={isDragging} dragDelta={dragDelta} velocity={velocity} />
      </Canvas>
    </div>
  );
};

export default FangMark;
