'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

// The Paper Fang mark: a snarling wireframe wolf head — cross-section ribs
// with longitudinal seams (the same line language as the homepage icosahedron
// and the arcade helmet), pricked ears, angry eye slits, an open jaw with
// bared fangs, and a torn-paper ruff at the neck. One line weight, no fills,
// palette cross-fade leading with the pink end of the cycle.

const PALETTE = ['#e4416f', '#fcd34d', '#39d5cb', '#f4fd7b', '#6ee7b7'];

const D = Math.PI / 180;

// Fixed "random" offsets for the torn-paper ruff, so the tear is stable.
const TEAR = [1.0, 0.62, 0.88, 0.5, 1.0, 0.58, 0.8, 0.46, 0.94, 0.6, 0.86, 0.52, 0.98, 0.64];

// Elliptical cross-section ribs along the head axis (+z = nose, toward the
// camera at rest). Full ribs wrap the skull; the muzzle ribs leave the bottom
// open where the mouth is.
type Rib = { z: number; w: number; h: number; cy: number; a0: number; a1: number };
const SKULL: Rib[] = [
  { z: -1.55, w: 1.3, h: 1.1, cy: 0.5, a0: 0, a1: 360 },
  { z: -0.85, w: 1.48, h: 1.22, cy: 0.52, a0: 0, a1: 360 },
  { z: -0.15, w: 1.22, h: 1.02, cy: 0.42, a0: 0, a1: 360 },
  { z: 0.45, w: 0.8, h: 0.66, cy: 0.18, a0: -35, a1: 215 },
  { z: 1.05, w: 0.58, h: 0.46, cy: 0.02, a0: -35, a1: 215 },
  { z: 1.6, w: 0.44, h: 0.36, cy: -0.1, a0: -35, a1: 215 },
  { z: 2.0, w: 0.3, h: 0.24, cy: -0.16, a0: -35, a1: 215 },
];
// Lower jaw: bottom-half troughs dropping open toward the chin.
const JAW: Rib[] = [
  { z: 0.45, w: 0.52, h: 0.38, cy: -0.5, a0: 180, a1: 360 },
  { z: 0.95, w: 0.44, h: 0.34, cy: -0.72, a0: 180, a1: 360 },
  { z: 1.4, w: 0.34, h: 0.28, cy: -0.88, a0: 180, a1: 360 },
];
const CHIN = new THREE.Vector3(0, -1.02, 1.62);

const ribPoint = (rib: Rib, aDeg: number) =>
  new THREE.Vector3(rib.w * Math.cos(aDeg * D), rib.cy + rib.h * Math.sin(aDeg * D), rib.z);

const WolfShape = ({
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
    const seg = (a: THREE.Vector3, b: THREE.Vector3) => {
      pts.push(a, b);
    };

    // Rib arcs.
    const arc = (rib: Rib, steps = 28) => {
      for (let i = 0; i < steps; i++) {
        const a0 = rib.a0 + ((rib.a1 - rib.a0) * i) / steps;
        const a1 = rib.a0 + ((rib.a1 - rib.a0) * (i + 1)) / steps;
        seg(ribPoint(rib, a0), ribPoint(rib, a1));
      }
    };
    SKULL.forEach((r) => arc(r));
    JAW.forEach((r) => arc(r, 18));

    // Longitudinal seams over the skull and muzzle. The lip lines (±35° below
    // horizontal) run the full muzzle; bottom seams only exist on full ribs.
    const AZ = [-35, 0, 35, 75, 105, 145, 180, 215];
    for (const az of AZ) {
      for (let k = 0; k < SKULL.length - 1; k++) seg(ribPoint(SKULL[k], az), ribPoint(SKULL[k + 1], az));
    }
    for (const az of [255, 285]) {
      for (let k = 0; k < 2; k++) seg(ribPoint(SKULL[k], az), ribPoint(SKULL[k + 1], az));
    }

    // Nose leather: a small diamond proud of the muzzle face.
    {
      const zN = 2.06;
      const nose = [
        new THREE.Vector3(0.13, -0.15, zN),
        new THREE.Vector3(0, -0.04, zN),
        new THREE.Vector3(-0.13, -0.15, zN),
        new THREE.Vector3(0, -0.27, zN),
      ];
      for (let i = 0; i < 4; i++) seg(nose[i], nose[(i + 1) % 4]);
    }

    // Lower jaw seams: side rims and center line running out to the chin.
    for (const az of [180, 270, 360]) {
      for (let k = 0; k < JAW.length - 1; k++) seg(ribPoint(JAW[k], az), ribPoint(JAW[k + 1], az));
      seg(ribPoint(JAW[JAW.length - 1], az), CHIN);
    }
    // Hinge struts: skull lip line down to the jaw rim.
    for (const s of [1, -1]) {
      const lip = ribPoint(SKULL[3], -35);
      seg(new THREE.Vector3(s * lip.x, lip.y, lip.z), new THREE.Vector3(s * 0.52, -0.5, 0.45));
    }

    // Bared teeth: a zigzag under the upper lip between the fangs.
    {
      const N = 6;
      let prev: THREE.Vector3 | null = null;
      for (let i = 0; i <= N; i++) {
        const x = -0.28 + (0.56 * i) / N;
        const p = new THREE.Vector3(x, i % 2 ? -0.44 : -0.31, 1.56);
        if (prev) seg(prev, p);
        prev = p;
      }
    }

    // Fangs: little ring-and-meridian cones, two up top, two below.
    const fang = (base: THREE.Vector3, tip: THREE.Vector3, r: number) => {
      const axis = tip.clone().sub(base).normalize();
      const u = new THREE.Vector3(1, 0, 0);
      if (Math.abs(axis.x) > 0.9) u.set(0, 1, 0);
      const a = new THREE.Vector3().crossVectors(axis, u).normalize();
      const b = new THREE.Vector3().crossVectors(axis, a).normalize();
      const N = 6;
      const ring: THREE.Vector3[] = [];
      for (let i = 0; i < N; i++) {
        const t = (i / N) * Math.PI * 2;
        ring.push(base.clone().addScaledVector(a, Math.cos(t) * r).addScaledVector(b, Math.sin(t) * r));
      }
      for (let i = 0; i < N; i++) {
        seg(ring[i], ring[(i + 1) % N]);
        seg(ring[i], tip);
      }
    };
    for (const s of [1, -1]) {
      fang(new THREE.Vector3(s * 0.34, -0.3, 1.5), new THREE.Vector3(s * 0.42, -0.85, 1.58), 0.09);
      fang(new THREE.Vector3(s * 0.26, -0.86, 1.32), new THREE.Vector3(s * 0.3, -0.45, 1.42), 0.06);
    }

    // Ears: outer + inner triangles, pricked up and slightly splayed.
    for (const s of [1, -1]) {
      const tri = [
        new THREE.Vector3(s * 0.5, 1.3, -0.25),
        new THREE.Vector3(s * 0.95, 1.35, -1.15),
        new THREE.Vector3(s * 1.05, 2.3, -0.75),
      ];
      for (let i = 0; i < 3; i++) seg(tri[i], tri[(i + 1) % 3]);
      const c = tri[0].clone().add(tri[1]).add(tri[2]).multiplyScalar(1 / 3);
      const inner = tri.map((p) => p.clone().lerp(c, 0.45));
      for (let i = 0; i < 3; i++) seg(inner[i], inner[(i + 1) % 3]);
    }

    // Eyes: tilted slit rhombi (outer corner high — the snarl), plus brows.
    for (const s of [1, -1]) {
      const eye = [
        new THREE.Vector3(s * 0.66, 0.55, 0.52),
        new THREE.Vector3(s * 0.5, 0.6, 0.66),
        new THREE.Vector3(s * 0.34, 0.44, 0.78),
        new THREE.Vector3(s * 0.5, 0.4, 0.66),
      ];
      for (let i = 0; i < 4; i++) seg(eye[i], eye[(i + 1) % 4]);
      seg(eye[0].clone().lerp(eye[2], 0.35), eye[0].clone().lerp(eye[2], 0.65));
      seg(new THREE.Vector3(s * 0.78, 0.78, 0.1), new THREE.Vector3(s * 0.34, 0.64, 0.66));
    }

    // Torn-paper sheet behind the head — a jagged ring the wolf bursts through.
    {
      const n = TEAR.length;
      const verts: THREE.Vector3[] = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + 0.22;
        const r = 1.7 + TEAR[i] * 1.05;
        verts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * 0.95 + 0.15, -1.35 + (i % 2 ? 0.14 : -0.08)));
      }
      for (let i = 0; i < n; i++) seg(verts[i], verts[(i + 1) % n]);
    }

    return pts;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      if (isDragging) {
        dragRotation.current.x += dragDelta.y * 0.01;
        dragRotation.current.y += dragDelta.x * 0.01;
        autoYOffset.current = t;
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
      // Slow sway rather than a full spin — the head keeps facing forward,
      // turning toward profile and back. Drag still spins it freely.
      const autoY = Math.sin((t - autoYOffset.current) * 0.3) * 0.55;
      groupRef.current.rotation.x = 0.1 + Math.sin(t * 0.5) * 0.08 + dragRotation.current.x;
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
      <Float speed={2} rotationIntensity={0.7} floatIntensity={2} floatingRange={[-0.4, 0.4]}>
        <group ref={groupRef} position={[0, -0.35, 0]} scale={1.35}>
          <Line points={points} color={PALETTE[0]} lineWidth={2.5} segments transparent opacity={0.85} ref={lineRef} />
        </group>
      </Float>
    </group>
  );
};

const WolfMark = () => {
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
        <WolfShape isDragging={isDragging} dragDelta={dragDelta} velocity={velocity} />
      </Canvas>
    </div>
  );
};

export default WolfMark;
