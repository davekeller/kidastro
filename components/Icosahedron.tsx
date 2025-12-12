'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

const Particles = ({ colorRef }: { colorRef: React.MutableRefObject<THREE.Color> }) => {
  const count = 112; // Reduced by 50% from 225
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Use a ref to store particles so we don't re-generate them on render
  const particles = useRef<{ t: number; factor: number; speed: number; xFactor: number; yFactor: number; zFactor: number; mx: number; my: number }[]>([]);

  // Initialize particles once
  React.useEffect(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    particles.current = temp;
  }, [count]); // Re-run if count changes

  useFrame((state) => {
    if (!mesh.current) return;

    particles.current.forEach((particle, i) => {
      // Destructure properties. t is modified, others are constant for this frame
      const { factor, speed, xFactor, yFactor, zFactor } = particle;
      
      // Update time
      particle.t += speed / 2;
      const t = particle.t;

      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      // Update position to trail behind/down more significantly
      // We want a stronger pull towards the mouse/center but trailing downwards
      particle.mx += (state.mouse.x * 100 - particle.mx) * 0.02; // Tighter follow
      particle.my += (state.mouse.y * 100 - 100 - particle.my) * 0.02; // Offset y to make it trail down

      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10 - t * 4, // Move down faster for longer tail
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      
      // Reset if too far down
      if (dummy.position.y < -80) { // Allow them to fall further
          particle.t = Math.random() * 100;
          dummy.position.y = 10;
      }

      const scale = s * (1 - (Math.abs(dummy.position.y) / 100)); // Fade size as it falls
      dummy.scale.set(scale, scale, scale);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
        mesh.current.setColorAt(i, colorRef.current);
      }
    });
    
    if (mesh.current) {
        mesh.current.instanceMatrix.needsUpdate = true;
        if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh key={count} ref={mesh} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[0.05, 0]} /> 
      <meshBasicMaterial transparent opacity={0.8} />
    </instancedMesh>
  );
};

const IcosahedronShape = ({ isDragging, dragDelta }: { isDragging: boolean; dragDelta: { x: number; y: number } }) => {
  const groupRef = useRef<THREE.Group>(null);
  const floatGroupRef = useRef<THREE.Group>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);
  const colorRef = useRef(new THREE.Color('#f4fd7b'));

  // Store target mouse position for smooth lerping
  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  // Store drag rotation offset
  const dragRotation = useRef({ x: 0, y: 0 });
  const autoRotationOffset = useRef({ x: 0, y: 0 });

  // Color palette
  const colors = useMemo(() => [
    new THREE.Color('#f4fd7b'), // Yellow
    new THREE.Color('#39d5cb'), // Teal
    new THREE.Color('#e4416f'), // Pink
    new THREE.Color('#fcd34d'), // Gold
    new THREE.Color('#6ee7b7'), // Mint
  ], []);

  useFrame((state) => {
    if (groupRef.current) {
      if (isDragging) {
        // Apply drag rotation
        dragRotation.current.x += dragDelta.y * 0.01;
        dragRotation.current.y += dragDelta.x * 0.01;
        // Store current auto rotation so we can resume from here
        autoRotationOffset.current.x = state.clock.getElapsedTime() * 0.15;
        autoRotationOffset.current.y = state.clock.getElapsedTime() * 0.2;
      }

      // Combine auto rotation with drag rotation
      const autoX = state.clock.getElapsedTime() * 0.15 - autoRotationOffset.current.x;
      const autoY = state.clock.getElapsedTime() * 0.2 - autoRotationOffset.current.y;
      groupRef.current.rotation.x = autoX + dragRotation.current.x;
      groupRef.current.rotation.y = autoY + dragRotation.current.y;
    }

    // Subtle mouse following for the whole shape
    if (floatGroupRef.current) {
      // Update target based on mouse position
      mouseTarget.current.x = state.mouse.x * 4; // Horizontal movement
      mouseTarget.current.y = state.mouse.y * 3; // Vertical movement

      // Smooth lerp towards target
      currentMouse.current.x += (mouseTarget.current.x - currentMouse.current.x) * 0.05;
      currentMouse.current.y += (mouseTarget.current.y - currentMouse.current.y) * 0.05;

      // Apply position offset
      floatGroupRef.current.position.x = currentMouse.current.x;
      floatGroupRef.current.position.y = currentMouse.current.y;
    }

    if (materialRef.current) {
      // Color transition
      const time = state.clock.getElapsedTime() * 0.2; // Slower transition (was 0.5)
      const index = Math.floor(time) % colors.length;
      const nextIndex = (index + 1) % colors.length;
      const alpha = time % 1;
      
      const newColor = new THREE.Color().lerpColors(colors[index], colors[nextIndex], alpha);
      
      // Line from @react-three/drei uses Line2 which has a material property
      if (materialRef.current.material && materialRef.current.material.color) {
         materialRef.current.material.color.copy(newColor);
      }
      colorRef.current.copy(newColor);
    }
  });

  const points = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(4.532, 0); // Increased size by 10% (4.12 * 1.1 = 4.532)
    const edges = new THREE.EdgesGeometry(geom);
    const positions = edges.attributes.position.array;
    const pts = [];
    for (let i = 0; i < positions.length; i += 3) {
      pts.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
    }
    return pts;
  }, []);

  return (
    <>
      <group ref={floatGroupRef}>
        <Float
          speed={2} // Faster animation speed
          rotationIntensity={1.5} // More rotation
          floatIntensity={2} // Stronger floating effect
          floatingRange={[-0.5, 0.5]} // Wider floating range
        >
          <group ref={groupRef}>
            <Line
              points={points}
              color="#f4fd7b" // Initial color
              lineWidth={3} // Thick lines
              segments // Render as segments (pairs of points)
              transparent
              opacity={0.8}
              ref={materialRef}
            />
          </group>
        </Float>
      </group>
      <Particles colorRef={colorRef} />
    </>
  );
};

const Icosahedron = () => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragDelta, setDragDelta] = React.useState({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    setDragDelta({ x: 0, y: 0 });
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      setDragDelta({ x: deltaX, y: deltaY });
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  return (
    <div
      className="w-full h-[500px] mb-4 overflow-hidden"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <Canvas camera={{ position: [0, 0, 22] }}>
        <IcosahedronShape isDragging={isDragging} dragDelta={dragDelta} />
      </Canvas>
    </div>
  );
};

export default Icosahedron;
