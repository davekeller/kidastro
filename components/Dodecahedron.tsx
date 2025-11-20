'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

const OctahedronShape = () => {
  const groupRef = useRef<THREE.Group>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null);

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
      // Slow rotation
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }

    if (materialRef.current) {
      // Color transition
      const time = state.clock.getElapsedTime() * 0.5; // Speed of transition
      const index = Math.floor(time) % colors.length;
      const nextIndex = (index + 1) % colors.length;
      const alpha = time % 1;
      
      // The Line component from drei uses 'color' prop but internally it might be a uniform or property
      // We need to check if it has a color property we can animate
      if (materialRef.current.color) {
         materialRef.current.color.lerpColors(colors[index], colors[nextIndex], alpha);
      }
    }
  });

  const points = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(3.15, 0); // Reduced size by 10% (3.5 * 0.9 = 3.15)
    const edges = new THREE.EdgesGeometry(geom);
    const positions = edges.attributes.position.array;
    const pts = [];
    for (let i = 0; i < positions.length; i += 3) {
      pts.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
    }
    return pts;
  }, []);

  return (
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
  );
};

const Dodecahedron = () => {
  return (
    <div className="w-[240px] h-[240px] mb-4">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <OctahedronShape />
      </Canvas>
    </div>
  );
};

export default Dodecahedron;
