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
        <dodecahedronGeometry args={[2.5, 0]} />
        <meshStandardMaterial
          color="#5eb3d6"
          emissive="#5eb3d6"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh ref={meshRef} scale={[0.95, 0.95, 0.95]}>
        <dodecahedronGeometry args={[2.5, 0]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
};

const Dodecahedron = () => {
  return (
    <div className="w-[180px] h-[180px] mb-8">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <DodecahedronMesh />
      </Canvas>
    </div>
  );
};

export default Dodecahedron;
