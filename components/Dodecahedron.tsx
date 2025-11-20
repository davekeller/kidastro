'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DodecahedronMesh = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group position={position}>
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
    </group>
  );
};

const Dodecahedron = () => {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [velocity, setVelocity] = useState<[number, number, number]>([0.03, 0.02, 0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ x: 8, y: 4 });

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Calculate bounds based on viewport size and camera FOV
        const aspect = width / height;
        const vFOV = (75 * Math.PI) / 180; // Default camera FOV
        const distance = 10; // Camera z position
        const vHeight = 2 * Math.tan(vFOV / 2) * distance;
        const vWidth = vHeight * aspect;
        
        setBounds({
          x: vWidth / 2 - 1.5, // Subtract dodecahedron radius
          y: vHeight / 2 - 1.5
        });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  useEffect(() => {
    const animate = () => {
      setPosition((prev) => {
        const newPos: [number, number, number] = [
          prev[0] + velocity[0],
          prev[1] + velocity[1],
          prev[2]
        ];
        
        const newVel: [number, number, number] = [...velocity];
        
        // Bounce off walls using calculated bounds
        if (newPos[0] > bounds.x || newPos[0] < -bounds.x) {
          newVel[0] = -velocity[0];
        }
        if (newPos[1] > bounds.y || newPos[1] < -bounds.y) {
          newVel[1] = -velocity[1];
        }
        
        setVelocity(newVel);
        return newPos;
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [velocity, bounds]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-screen pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <DodecahedronMesh position={position} />
      </Canvas>
    </div>
  );
};

export default Dodecahedron;
