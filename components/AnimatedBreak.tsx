'use client';

import React, { useEffect, useState } from 'react';

const AnimatedBreak = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = [
    '#f4fd7b', // Yellow
    '#39d5cb', // Teal
    '#e4416f', // Pink
    '#fcd34d', // Gold
    '#6ee7b7', // Mint
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 5000); // Change color every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[200px] flex items-center justify-center py-32 md:py-48">
      <div className="flex items-center gap-4 md:gap-6">
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
          className="text-2xl md:text-3xl animate-float opacity-80 transition-colors duration-[2000ms]" 
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
      `}</style>
    </div>
  );
};

export default AnimatedBreak;
