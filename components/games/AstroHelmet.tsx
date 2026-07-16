'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

// Retro "fishbowl" helmet: a latitude/longitude globe wireframe with a circular
// porthole face ring (double rim + bolt ticks), side comm discs, and a flared
// suit collar. Lines only — one weight, no fills.

const R = 3.2; // sphere radius
const NECK_Y = -2.0; // sphere is cut below this plane (deep bowl)
const PORT_TILT = (6 * Math.PI) / 180; // port axis tilted slightly above equator
const PORT_R = (38 * Math.PI) / 180; // angular radius of the face port
const RIM_GAP = (3.5 * Math.PI) / 180; // outer seal ring sits this far outside
const PROUD = 1.012; // rims/discs drawn just proud of the sphere

// Palette — same cycle as the homepage icosahedron.
const PALETTE = ['#f4fd7b', '#39d5cb', '#e4416f', '#fcd34d', '#6ee7b7'];

const PORT_AXIS = new THREE.Vector3(0, Math.sin(PORT_TILT), Math.cos(PORT_TILT));

// Direction on the unit sphere at azimuth `az` around +y from the front (+z)
// and elevation `el` above the equator.
function dir(az: number, el: number): THREE.Vector3 {
  const ce = Math.cos(el);
  return new THREE.Vector3(ce * Math.sin(az), Math.sin(el), ce * Math.cos(az));
}

// Ring of segment pairs around `axis` at angular radius `theta`, on a sphere of
// radius r. Appends to pts; optionally returns the sampled points.
function ring(pts: THREE.Vector3[], axis: THREE.Vector3, theta: number, r: number, seg: number): THREE.Vector3[] {
  const u = new THREE.Vector3(0, 1, 0);
  if (Math.abs(axis.y) > 0.9) u.set(1, 0, 0);
  const a = new THREE.Vector3().crossVectors(axis, u).normalize();
  const b = new THREE.Vector3().crossVectors(axis, a).normalize();
  const ct = Math.cos(theta);
  const st = Math.sin(theta);
  const samples: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) {
    const al = (i / seg) * Math.PI * 2;
    samples.push(
      new THREE.Vector3()
        .copy(axis)
        .multiplyScalar(ct)
        .addScaledVector(a, Math.cos(al) * st)
        .addScaledVector(b, Math.sin(al) * st)
        .multiplyScalar(r),
    );
  }
  for (let i = 0; i < seg; i++) pts.push(samples[i], samples[i + 1]);
  return samples;
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

  // Mouse-follow lerp state
  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  // Drag rotation + momentum (same feel as the icosahedron)
  const dragRotation = useRef({ x: 0, y: 0 });
  const autoYOffset = useRef(0);
  const momentumVelocity = useRef({ x: 0, y: 0 });

  const colors = useMemo(() => PALETTE.map((c) => new THREE.Color(c)), []);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];

    // Keep globe lines out of the face port (with a little clearance) and
    // above the neck cut.
    const inPort = (d: THREE.Vector3) => d.angleTo(PORT_AXIS) < PORT_R + 0.03;
    const elMin = Math.asin(NECK_Y / R);

    // Parallels (latitude rings).
    const parallels = [-25, -5, 15, 35, 55, 75].map((d) => (d * Math.PI) / 180);
    const SEG = 72;
    for (const el of parallels) {
      for (let i = 0; i < SEG; i++) {
        const a0 = (i / SEG) * Math.PI * 2;
        const a1 = ((i + 1) / SEG) * Math.PI * 2;
        const d0 = dir(a0, el);
        const d1 = dir(a1, el);
        const mid = dir((a0 + a1) / 2, el);
        if (inPort(mid)) continue;
        pts.push(d0.multiplyScalar(R), d1.multiplyScalar(R));
      }
    }

    // Meridians (longitude arcs), pole to neck cut.
    const MER = 12;
    const ESEG = 36;
    const elTop = (86 * Math.PI) / 180;
    for (let m = 0; m < MER; m++) {
      const az = (m / MER) * Math.PI * 2;
      for (let i = 0; i < ESEG; i++) {
        const e0 = elMin + (i / ESEG) * (elTop - elMin);
        const e1 = elMin + ((i + 1) / ESEG) * (elTop - elMin);
        const mid = dir(az, (e0 + e1) / 2);
        if (inPort(mid)) continue;
        pts.push(dir(az, e0).multiplyScalar(R), dir(az, e1).multiplyScalar(R));
      }
    }

    // Face port: double rim + bolt ticks between the rings, like a hatch seal.
    const rimIn = ring(pts, PORT_AXIS, PORT_R, R * PROUD, 64);
    const rimOut = ring(pts, PORT_AXIS, PORT_R + RIM_GAP, R * PROUD, 64);
    for (let i = 0; i < 8; i++) {
      const idx = Math.round((i / 8) * 64);
      pts.push(rimIn[idx], rimOut[idx]);
    }

    // Visor glint: one diagonal line across the port, upper-right to lower-left,
    // slightly off-center — an arc on the glass surface between two rim points.
    {
      const p1 = rimIn[Math.round((205 / 360) * 64)].clone().normalize();
      const p2 = rimIn[Math.round((45 / 360) * 64)].clone().normalize();
      const GS = 10;
      const q = new THREE.Quaternion();
      const prev = p1.clone();
      for (let i = 1; i <= GS; i++) {
        q.setFromUnitVectors(p1, p2);
        const step = new THREE.Quaternion().slerpQuaternions(new THREE.Quaternion(), q, i / GS);
        const cur = p1.clone().applyQuaternion(step);
        pts.push(prev.clone().multiplyScalar(R * PROUD), cur.clone().multiplyScalar(R * PROUD));
        prev.copy(cur);
      }
    }

    // Brow ridge: a partial seam arc over the top of the port.
    {
      const theta = PORT_R + (7 * Math.PI) / 180;
      const arc: THREE.Vector3[] = [];
      ring(arc, PORT_AXIS, theta, R * PROUD, 64);
      // ring() pushes segment pairs; keep only the top span (α ≈ 200°–340°,
      // where 270° is straight up in the port's basis).
      for (let i = 0; i < 64; i++) {
        const aDeg = (i / 64) * 360;
        if (aDeg >= 200 && aDeg <= 340) pts.push(arc[i * 2], arc[i * 2 + 1]);
      }
    }

    // Ear pods: chunky rounded-rect comm pods with vent slats, one per side.
    for (const side of [1, -1]) {
      const s = new THREE.Vector3(side, 0.06, 0).normalize();
      const t1 = new THREE.Vector3(0, 1, 0).addScaledVector(s, -s.y).normalize(); // up along pod
      const t2 = new THREE.Vector3().crossVectors(s, t1).normalize(); // fore/aft
      const center = s.clone().multiplyScalar(R * 1.05);
      const at = (x: number, y: number) => center.clone().addScaledVector(t2, x).addScaledVector(t1, y);
      // Rounded-rect outline (half-width 0.38, half-height 0.6, corner 0.16).
      const hw = 0.38;
      const hh = 0.6;
      const cr = 0.16;
      const corners = [
        { cx: hw - cr, cy: hh - cr, a0: 0 },
        { cx: -(hw - cr), cy: hh - cr, a0: Math.PI / 2 },
        { cx: -(hw - cr), cy: -(hh - cr), a0: Math.PI },
        { cx: hw - cr, cy: -(hh - cr), a0: (3 * Math.PI) / 2 },
      ];
      const loop: THREE.Vector3[] = [];
      for (const c of corners) {
        for (let i = 0; i <= 4; i++) {
          const a = c.a0 + (i / 4) * (Math.PI / 2);
          loop.push(at(c.cx + Math.cos(a) * cr, c.cy + Math.sin(a) * cr));
        }
      }
      for (let i = 0; i < loop.length; i++) pts.push(loop[i], loop[(i + 1) % loop.length]);
      // Vent slats.
      for (const x of [-0.16, 0, 0.16]) pts.push(at(x, -0.42), at(x, 0.42));
    }

    // Neck stack: the bowl's cut edge, a segmented collar, then a wider locking
    // ring with dense radial ticks — plus angled side tabs off the flange.
    const rBase = Math.sqrt(R * R - NECK_Y * NECK_Y);
    const C_Y = NECK_Y - 0.35;
    const rCollar = rBase * 1.05;
    const FL_Y = NECK_Y - 0.78;
    const rFlange = rBase * 1.18;
    const N = 48;
    const collar = (y: number, r: number) => {
      for (let i = 0; i < N; i++) {
        const a0 = (i / N) * Math.PI * 2;
        const a1 = ((i + 1) / N) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a0) * r, y, Math.sin(a0) * r), new THREE.Vector3(Math.cos(a1) * r, y, Math.sin(a1) * r));
      }
    };
    collar(NECK_Y, rBase);
    collar(C_Y, rCollar);
    collar(FL_Y, rFlange);
    // Sparse struts: bowl edge → collar.
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(Math.cos(a) * rBase, NECK_Y, Math.sin(a) * rBase),
        new THREE.Vector3(Math.cos(a) * rCollar, C_Y, Math.sin(a) * rCollar),
      );
    }
    // Dense locking ticks: collar → flange.
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(Math.cos(a) * rCollar, C_Y, Math.sin(a) * rCollar),
        new THREE.Vector3(Math.cos(a) * rFlange, FL_Y, Math.sin(a) * rFlange),
      );
    }
    // Angled clasp tabs: two short parallel diagonals off each side of the
    // flange, kicking down and outward.
    for (const az of [(28 * Math.PI) / 180, (152 * Math.PI) / 180]) {
      for (const off of [0, (10 * Math.PI) / 180]) {
        const a = az + off;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        pts.push(
          new THREE.Vector3(cos * rFlange, FL_Y, sin * rFlange),
          new THREE.Vector3(cos * (rFlange + 0.34), FL_Y - 0.3, sin * (rFlange + 0.34)),
        );
      }
    }

    return pts;
  }, []);

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
  });

  return (
    <group ref={floatGroupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2} floatingRange={[-0.5, 0.5]}>
        <group ref={groupRef} position={[0, 0.25, 0]}>
          <Line points={points} color={PALETTE[0]} lineWidth={2.5} segments transparent opacity={0.85} ref={lineRef} />
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
