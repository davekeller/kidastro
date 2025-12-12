'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

const AnimatedBreak = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  const colors = [
    '#f4fd7b', // Yellow
    '#39d5cb', // Teal
    '#e4416f', // Pink
    '#fcd34d', // Gold
    '#6ee7b7', // Mint
  ];

  // Animation loop for smooth lerping
  const animate = useCallback(() => {
    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.05;
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.05;

    setMouseOffset({ x: currentRef.current.x, y: currentRef.current.y });
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate offset from center, normalized to -1 to 1
      const normalizedX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normalizedY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Set target with movement range (horizontal only)
      targetRef.current.x = normalizedX * 30; // 30px max horizontal
      targetRef.current.y = 0; // No vertical movement to avoid overlapping content
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 5000); // Change color every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[200px] flex items-center justify-center py-32 md:py-48">
      <div
        className="flex items-center gap-4 md:gap-6"
        style={{
          transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
        }}
      >
        <span 
          className="text-2xl md:text-3xl animate-float opacity-80 transition-colors duration-[2000ms]"
          style={{ color: colors[colorIndex] }}
        >
          +
        </span>
        <span 
          className="text-2xl md:text-3xl animate-float-delayed opacity-80 transition-colors duration-[2000ms]" 
          style={{ animationDelay: '0.2s', color: colors[colorIndex] }}
        >
          /
        </span>
        <span
          className="text-2xl md:text-3xl animate-float-triangle opacity-80 transition-colors duration-[2000ms]"
          style={{ animationDelay: '0.4s', color: colors[colorIndex] }}
        >
          ▵
        </span>
        <span 
          className="text-2xl md:text-3xl animate-float-delayed opacity-80 transition-colors duration-[2000ms]" 
          style={{ animationDelay: '0.6s', color: colors[colorIndex] }}
        >
          \
        </span>
        <span 
          className="text-2xl md:text-3xl animate-float opacity-80 transition-colors duration-[2000ms]" 
          style={{ animationDelay: '0.8s', color: colors[colorIndex] }}
        >
          +
        </span>
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-5deg);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
        }

        .animate-float-triangle {
          animation: float-triangle 3s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes float-triangle {
          0%, 100% {
            transform: translateY(0px) rotate(180deg);
          }
          50% {
            transform: translateY(-20px) rotate(185deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBreak;
