'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const DodecahedronMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[3.75, 0]} />
        <meshBasicMaterial
          color="#5eb3d6"
          wireframe={true}
          wireframeLinewidth={3}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
};

const Dodecahedron = () => {
  return (
    <div className="w-[240px] h-[240px] mb-4">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <DodecahedronMesh />
      </Canvas>
    </div>
  );
};

export default Dodecahedron;
