'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

const R = 3.2; // dome radius
const NECK_Y = -1.1; // dome is kept above this plane, flattening the bottom

// Palette — same cycle as the homepage icosahedron.
const PALETTE = ['#f4fd7b', '#39d5cb', '#e4416f', '#fcd34d', '#6ee7b7'];

// A rounded-rectangle outline in 2D, returned as an ordered loop of [x, y].
function roundedRect(hw: number, hh: number, r: number, seg: number): [number, number][] {
  const corners = [
    { cx: hw - r, cy: hh - r, a0: 0 },
    { cx: -(hw - r), cy: hh - r, a0: Math.PI / 2 },
    { cx: -(hw - r), cy: -(hh - r), a0: Math.PI },
    { cx: hw - r, cy: -(hh - r), a0: (3 * Math.PI) / 2 },
  ];
  const pts: [number, number][] = [];
  for (const c of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = c.a0 + (i / seg) * (Math.PI / 2);
      pts.push([c.cx + Math.cos(a) * r, c.cy + Math.sin(a) * r]);
    }
  }
  return pts;
}

const HelmetShape = ({
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
  const tipMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Mouse-follow lerp state
  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  // Drag rotation + momentum (same feel as the icosahedron)
  const dragRotation = useRef({ x: 0, y: 0 });
  const autoYOffset = useRef(0);
  const momentumVelocity = useRef({ x: 0, y: 0 });

  const colors = useMemo(() => PALETTE.map((c) => new THREE.Color(c)), []);

  // Visor outline shared between the wireframe and the glass fill.
  const visor = useMemo(() => roundedRect(1.9, 1.15, 0.55, 6), []);
  const visorY = 0.2;

  // The whole wireframe (dome edges + neck collar + visor + antenna stalk) as
  // one segment-pair list, so a single material drives the color cycle.
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];

    // Dome: icosphere edges, keeping only segments above the neck plane.
    const geom = new THREE.IcosahedronGeometry(R, 1);
    const edges = new THREE.EdgesGeometry(geom);
    const pos = edges.attributes.position.array as ArrayLike<number>;
    for (let i = 0; i < pos.length; i += 6) {
      const a = new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]);
      const b = new THREE.Vector3(pos[i + 3], pos[i + 4], pos[i + 5]);
      if (a.y > NECK_Y && b.y > NECK_Y) pts.push(a, b);
    }

    // Neck collar: two rings below the dome opening + short vertical struts.
    const rTop = Math.sqrt(R * R - NECK_Y * NECK_Y); // dome cross-section here
    const rings = [
      { y: NECK_Y, r: rTop },
      { y: NECK_Y - 0.6, r: rTop - 0.35 },
    ];
    const N = 32;
    for (const ring of rings) {
      for (let i = 0; i < N; i++) {
        const a0 = (i / N) * Math.PI * 2;
        const a1 = ((i + 1) / N) * Math.PI * 2;
        pts.push(
          new THREE.Vector3(Math.cos(a0) * ring.r, ring.y, Math.sin(a0) * ring.r),
          new THREE.Vector3(Math.cos(a1) * ring.r, ring.y, Math.sin(a1) * ring.r),
        );
      }
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(Math.cos(a) * rings[0].r, rings[0].y, Math.sin(a) * rings[0].r),
        new THREE.Vector3(Math.cos(a) * rings[1].r, rings[1].y, Math.sin(a) * rings[1].r),
      );
    }

    // Visor: rounded rect projected onto a sphere slightly proud of the dome,
    // so it curves with the surface and reads as raised glass.
    const RV = R * 1.005;
    const project = ([x, y]: [number, number]) => {
      const yy = y + visorY;
      const z = Math.sqrt(Math.max(0.01, RV * RV - x * x - yy * yy));
      return new THREE.Vector3(x, yy, z);
    };
    for (let i = 0; i < visor.length; i++) {
      pts.push(project(visor[i]), project(visor[(i + 1) % visor.length]));
    }

    // Antenna: a short stalk off the upper-right of the dome.
    const base = new THREE.Vector3(0.55, 0.8, 0.35).normalize().multiplyScalar(R);
    const tip = base.clone().add(new THREE.Vector3(0.1, 1.15, 0));
    pts.push(base, tip);

    return pts;
  }, [visor]);

  // Antenna tip position (kept in sync with the stalk above).
  const tipPos = useMemo(() => {
    const base = new THREE.Vector3(0.55, 0.8, 0.35).normalize().multiplyScalar(R);
    return base.add(new THREE.Vector3(0.1, 1.15, 0));
  }, []);

  // Flat glass fill behind the visor outline.
  const glassGeom = useMemo(() => {
    const shape = new THREE.Shape();
    visor.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y + visorY) : shape.lineTo(x, y + visorY)));
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [visor]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      if (isDragging) {
        dragRotation.current.x += dragDelta.y * 0.01;
        dragRotation.current.y += dragDelta.x * 0.01;
        autoYOffset.current = t * 0.25; // freeze the steady spin while grabbed
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
      // Steady y-spin + gentle x wobble (keeps the helmet upright, unlike the
      // homepage shape's full tumble). Drag still spins both axes freely.
      const autoY = t * 0.25 - autoYOffset.current;
      const autoX = Math.sin(t * 0.5) * 0.15;
      groupRef.current.rotation.x = autoX + dragRotation.current.x;
      groupRef.current.rotation.y = autoY + dragRotation.current.y;
    }

    // Subtle whole-helmet drift toward the cursor.
    if (floatGroupRef.current) {
      mouseTarget.current.x = state.mouse.x * 3;
      mouseTarget.current.y = state.mouse.y * 2;
      currentMouse.current.x += (mouseTarget.current.x - currentMouse.current.x) * 0.05;
      currentMouse.current.y += (mouseTarget.current.y - currentMouse.current.y) * 0.05;
      floatGroupRef.current.position.x = currentMouse.current.x;
      floatGroupRef.current.position.y = currentMouse.current.y;
    }

    // Palette cross-fade — same clock/speed as the icosahedron.
    const time = t * 0.2;
    const index = Math.floor(time) % colors.length;
    const nextIndex = (index + 1) % colors.length;
    const alpha = time % 1;
    const newColor = new THREE.Color().lerpColors(colors[index], colors[nextIndex], alpha);
    if (lineRef.current?.material?.color) lineRef.current.material.color.copy(newColor);
    if (tipMatRef.current) tipMatRef.current.color.copy(newColor);
  });

  return (
    <group ref={floatGroupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2} floatingRange={[-0.5, 0.5]}>
        <group ref={groupRef}>
          <Line points={points} color={PALETTE[0]} lineWidth={3} segments transparent opacity={0.85} ref={lineRef} />
          {/* Visor glass — barely-there fill, never occludes the wireframe. */}
          <mesh geometry={glassGeom} position={[0, 0, R * 0.9]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Antenna tip. */}
          <mesh position={tipPos}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshBasicMaterial ref={tipMatRef} color={PALETTE[0]} />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

const AstroHelmet = () => {
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
      className="mx-auto h-[300px] w-full max-w-[420px] overflow-hidden select-none touch-none"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <Canvas camera={{ position: [0, 0, 10] }}>
        <HelmetShape isDragging={isDragging} dragDelta={dragDelta} velocity={velocity} />
      </Canvas>
    </div>
  );
};

export default AstroHelmet;
