'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

const R = 3.2; // shell radius
const NECK_Y = -1.3; // shell is kept above this plane, flattening the bottom

// Visor: a curved panel on the front (+z), spanning an azimuth/elevation window.
const AZ = (52 * Math.PI) / 180; // half-width around the front
const EL_TOP = (33 * Math.PI) / 180; // brow
const EL_BOT = (-23 * Math.PI) / 180; // chin (stays above the neck cut)
const RV = R * 1.015; // visor grid, just proud of the shell
const RG = R * 0.985; // glass fill, just inside the shell

// Palette — same cycle as the homepage icosahedron.
const PALETTE = ['#f4fd7b', '#39d5cb', '#e4416f', '#fcd34d', '#6ee7b7'];

// Point on a sphere of radius r, at azimuth `az` around +y from the front (+z)
// and elevation `el` above the equator.
function sph(az: number, el: number, r: number): THREE.Vector3 {
  const ce = Math.cos(el);
  return new THREE.Vector3(r * ce * Math.sin(az), r * Math.sin(el), r * ce * Math.cos(az));
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
  const shellRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visorRef = useRef<any>(null);
  const tipMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const glassMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Mouse-follow lerp state
  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  // Drag rotation + momentum (same feel as the icosahedron)
  const dragRotation = useRef({ x: 0, y: 0 });
  const autoYOffset = useRef(0);
  const momentumVelocity = useRef({ x: 0, y: 0 });

  const colors = useMemo(() => PALETTE.map((c) => new THREE.Color(c)), []);

  // Antenna base/tip on the upper-left of the shell (kept in sync below).
  const antenna = useMemo(() => {
    const base = new THREE.Vector3(-0.5, 0.82, 0.32).normalize().multiplyScalar(R);
    const tip = base.clone().add(new THREE.Vector3(-0.06, 1.0, 0));
    return { base, tip };
  }, []);

  // Shell + neck + antenna — the dim structural wireframe. The visor grid is a
  // separate, brighter line (below) so the faceplate reads as the focal point.
  const shellPts = useMemo(() => {
    const pts: THREE.Vector3[] = [];

    // Is a direction inside the visor window? Used to clear shell edges there so
    // the visor reads as an actual opening rather than an overlay.
    const inVisor = (v: THREE.Vector3) => {
      const az = Math.atan2(v.x, v.z);
      const el = Math.asin(THREE.MathUtils.clamp(v.y / v.length(), -1, 1));
      return v.z > 0 && Math.abs(az) < AZ * 1.05 && el > EL_BOT - 0.05 && el < EL_TOP + 0.05;
    };

    // Shell: icosphere edges above the neck plane, minus those under the visor.
    const geom = new THREE.IcosahedronGeometry(R, 1);
    const edges = new THREE.EdgesGeometry(geom);
    const pos = edges.attributes.position.array as ArrayLike<number>;
    const mid = new THREE.Vector3();
    for (let i = 0; i < pos.length; i += 6) {
      const a = new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]);
      const b = new THREE.Vector3(pos[i + 3], pos[i + 4], pos[i + 5]);
      if (a.y <= NECK_Y || b.y <= NECK_Y) continue;
      mid.addVectors(a, b).multiplyScalar(0.5);
      if (inVisor(mid)) continue;
      pts.push(a, b);
    }

    // Neck: a shallow collar band — the shell-base ring plus a slightly inset
    // ring just below, joined by short struts. Reads as a clean suit collar
    // rather than a tapered cage.
    const rBase = Math.sqrt(R * R - NECK_Y * NECK_Y);
    const rings = [
      { y: NECK_Y, r: rBase },
      { y: NECK_Y - 0.4, r: rBase * 0.9 },
    ];
    const N = 40;
    const ringPts = (y: number, r: number) => {
      for (let i = 0; i < N; i++) {
        const a0 = (i / N) * Math.PI * 2;
        const a1 = ((i + 1) / N) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a0) * r, y, Math.sin(a0) * r), new THREE.Vector3(Math.cos(a1) * r, y, Math.sin(a1) * r));
      }
    };
    rings.forEach((ring) => ringPts(ring.y, ring.r));
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      pts.push(new THREE.Vector3(cos * rings[0].r, rings[0].y, sin * rings[0].r), new THREE.Vector3(cos * rings[1].r, rings[1].y, sin * rings[1].r));
    }

    // Antenna stalk.
    pts.push(antenna.base, antenna.tip);

    return pts;
  }, [antenna]);

  // Visor grid: boundary rim + center seam + a mid brow line, all as arcs on a
  // sphere slightly proud of the shell so the faceplate curves with the surface.
  const visorPts = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const AN = 22; // samples per arc
    const longitude = (az: number) => {
      for (let i = 0; i < AN; i++) {
        const e0 = EL_BOT + (i / AN) * (EL_TOP - EL_BOT);
        const e1 = EL_BOT + ((i + 1) / AN) * (EL_TOP - EL_BOT);
        pts.push(sph(az, e0, RV), sph(az, e1, RV));
      }
    };
    const latitude = (el: number) => {
      for (let i = 0; i < AN; i++) {
        const a0 = -AZ + (i / AN) * (2 * AZ);
        const a1 = -AZ + ((i + 1) / AN) * (2 * AZ);
        pts.push(sph(a0, el, RV), sph(a1, el, RV));
      }
    };
    longitude(-AZ);
    longitude(0);
    longitude(AZ);
    latitude(EL_TOP);
    latitude((EL_TOP + EL_BOT) / 2);
    latitude(EL_BOT);
    return pts;
  }, []);

  // Curved glass fill matching the visor window exactly (partial sphere just
  // inside the shell).
  const glassGeom = useMemo(
    () => new THREE.SphereGeometry(RG, 24, 16, Math.PI / 2 - AZ, 2 * AZ, Math.PI / 2 - EL_TOP, EL_TOP - EL_BOT),
    [],
  );

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
    if (shellRef.current?.material?.color) shellRef.current.material.color.copy(newColor);
    if (visorRef.current?.material?.color) visorRef.current.material.color.copy(newColor);
    if (tipMatRef.current) tipMatRef.current.color.copy(newColor);
    if (glassMatRef.current) glassMatRef.current.color.copy(newColor);
  });

  return (
    <group ref={floatGroupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2} floatingRange={[-0.5, 0.5]}>
        <group ref={groupRef}>
          {/* Dim structural shell + neck + antenna. */}
          <Line points={shellPts} color={PALETTE[0]} lineWidth={2} segments transparent opacity={0.5} ref={shellRef} />
          {/* Bright visor faceplate — the focal point. */}
          <Line points={visorPts} color={PALETTE[0]} lineWidth={3.5} segments transparent opacity={1} ref={visorRef} />
          {/* Visor glass — a faint tinted lens that cycles with the wireframe. */}
          <mesh geometry={glassGeom}>
            <meshBasicMaterial ref={glassMatRef} color={PALETTE[0]} transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Antenna tip. */}
          <mesh position={antenna.tip}>
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
