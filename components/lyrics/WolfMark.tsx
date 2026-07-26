'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

// The Paper Fang mark: a low-poly wolf head in the same faceted line language
// as the homepage icosahedron — named vertices, straight edges, no fills —
// with pricked ears, eye notches, bared fangs, and a jagged torn-paper sheet
// behind it. Palette cross-fade leads with the pink end of the cycle.

const PALETTE = ['#e4416f', '#fcd34d', '#39d5cb', '#f4fd7b', '#6ee7b7'];

// Fixed "random" offsets for the torn-paper sheet, so the tear is stable.
const TEAR = [1.0, 0.62, 0.88, 0.5, 1.0, 0.58, 0.8, 0.46, 0.94, 0.6, 0.86, 0.52, 0.98, 0.64];

// Head vertices (+z = nose, toward the camera at rest; x mirrored for the
// left side): N nose, NB nose bridge, MT muzzle top, LP lip corner, CH chin,
// JW jaw, JS jowl spike, BR brow, FC forehead, CK cheek, SK skull side,
// CR crown, EB ear base inner, ET ear tip.
const HEAD: Record<string, [number, number, number]> = {
  N: [0, -0.05, 1.75],
  NB: [0, 0.34, 1.08],
  MT: [0.3, 0.1, 1.02],
  LP: [0.36, -0.24, 0.92],
  CH: [0, -0.52, 1.02],
  JW: [0.62, -0.66, 0.28],
  JS: [1.35, -0.3, -0.15],
  BR: [0.54, 0.7, 0.46],
  FC: [0, 1.02, 0.18],
  CK: [1.08, 0.16, -0.08],
  SK: [1.02, 1.02, -0.68],
  CR: [0, 1.38, -0.72],
  EB: [0.44, 1.18, -0.38],
  ET: [1.15, 2.1, -0.55],
};
const CENTER_EDGES: [string, string][] = [
  ['CR', 'FC'],
  ['FC', 'NB'],
  ['NB', 'N'],
];
const SIDE_EDGES: [string, string][] = [
  ['FC', 'BR'], ['BR', 'CK'], ['BR', 'MT'], ['CK', 'MT'], ['MT', 'NB'], ['MT', 'N'],
  ['MT', 'LP'], ['LP', 'N'], ['LP', 'JW'], ['CK', 'JW'], ['JW', 'CH'],
  ['CK', 'JS'], ['JS', 'JW'],
  ['CK', 'SK'], ['SK', 'CR'], ['EB', 'FC'], ['EB', 'CR'],
  ['EB', 'SK'], ['EB', 'ET'], ['SK', 'ET'],
];

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

    const vec = (p: [number, number, number], s = 1) => new THREE.Vector3(s * p[0], p[1], p[2]);

    // Faceted head: center-line edges once, side edges mirrored.
    for (const [a, b] of CENTER_EDGES) seg(vec(HEAD[a]), vec(HEAD[b]));
    for (const s of [1, -1]) {
      for (const [a, b] of SIDE_EDGES) seg(vec(HEAD[a], s), vec(HEAD[b], s));
    }

    // Ear ribs: a fold line up the middle of each ear.
    for (const s of [1, -1]) {
      const mid = vec(HEAD.EB, s).lerp(vec(HEAD.SK, s), 0.5);
      seg(mid, vec(HEAD.ET, s));
    }

    // Eyes: small triangular notches.
    for (const s of [1, -1]) {
      const eye = [
        new THREE.Vector3(s * 0.66, 0.5, 0.28),
        new THREE.Vector3(s * 0.4, 0.38, 0.5),
        new THREE.Vector3(s * 0.56, 0.32, 0.38),
      ];
      for (let i = 0; i < 3; i++) seg(eye[i], eye[(i + 1) % 3]);
    }

    // Fangs: flat triangles hanging from the lip line.
    for (const s of [1, -1]) {
      const tip = new THREE.Vector3(s * 0.25, -0.66, 1.2);
      seg(new THREE.Vector3(s * 0.14, -0.21, 1.1), tip);
      seg(new THREE.Vector3(s * 0.3, -0.24, 1.0), tip);
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
        <group ref={groupRef} position={[0, -0.35, 0]} scale={1.5}>
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
      className="mx-auto h-[170px] w-full max-w-[300px] overflow-hidden select-none touch-none"
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
