'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';

const Footer = () => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLUListElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  // Animation loop for smooth lerping - horizontal only
  const animate = useCallback(() => {
    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.05;

    setMouseOffset({ x: currentRef.current.x, y: 0 });
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

      // Set target with movement range
      targetRef.current.x = normalizedX * 25; // 25px max horizontal
      targetRef.current.y = normalizedY * 15; // 15px max vertical
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return (
    <footer className="footer text-center text-white py-16 pb-32 max-w-[50%] lg:max-w-[90%] mx-auto mt-12">
      <h1 className="mb-4 font-serif text-4xl text-white md:text-6xl">thanks so much</h1>
      <p className="mb-12 text-lg text-white/90">
        And if you&apos;re in the market for design help, please don&apos;t hesitate to{' '}
        <a href="mailto:davekeller@me.com?subject=Hey Dave!" className="font-bold text-[#39d5cb] hover:text-[#e4416f] transition-colors">
          hit me up!
        </a>
      </p>
      <ul
        ref={containerRef}
        className="contact mt-12 flex flex-wrap justify-center border-t-2 border-white/10 py-8"
        style={{
          transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
        }}
      >
        <li className="p-4 animate-float">
          <a href="https://www.linkedin.com/in/dkells/" className="group flex flex-col items-center">
            <Image src="/imgs/contact/linkedin.svg" alt="linkedin" width={40} height={40} className="mb-2" />
            <p className="text-[#90a4bc] font-semibold group-hover:text-[#e4416f] transition-colors">dkells</p>
          </a>
        </li>
        <li className="p-4 animate-float-delayed" style={{ animationDelay: '0.15s' }}>
          <a href="https://dribbble.com/kidastro" className="group flex flex-col items-center">
            <Image src="/imgs/contact/dribbble.svg" alt="dribbble" width={40} height={40} className="mb-2" />
            <p className="text-[#90a4bc] font-semibold group-hover:text-[#e4416f] transition-colors">kidastro</p>
          </a>
        </li>
        <li className="p-4 animate-float" style={{ animationDelay: '0.3s' }}>
          <a href="mailto:davekeller@me.com?subject=Hey Dave!" className="group flex flex-col items-center">
            <Image src="/imgs/contact/email.svg" alt="email" width={40} height={40} className="mb-2" />
            <p className="text-[#90a4bc] font-semibold group-hover:text-[#e4416f] transition-colors">email</p>
          </a>
        </li>
      </ul>
      <h4 className="text-xs text-white/20 mt-8">© 2024 Dave Keller</h4>
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(-2deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
