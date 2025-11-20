'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';

const OctahedronShape = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  const points = useMemo(() => {
    const geom = new THREE.OctahedronGeometry(3.5, 0);
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
          color="#5eb3d6"
          lineWidth={3} // Thick lines
          segments // Render as segments (pairs of points)
          transparent
          opacity={0.8}
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
