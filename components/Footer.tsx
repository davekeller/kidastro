'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';

const Footer = ({ minimal = false }: { minimal?: boolean }) => {
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
    <footer className="footer text-center text-white py-16 pb-32 max-w-[90%] mx-auto mt-12">
      {!minimal && (
        <>
          <h1 className="mb-4 font-serif text-4xl text-white md:text-6xl">thanks for stopping by</h1>
          <p className="mb-12 text-lg text-white/90">
            And if you&apos;re looking for design help, please{' '}
            <a href="mailto:davekeller@me.com?subject=Hey Dave!" className="font-bold text-[#39d5cb] hover:text-[#e4416f] transition-colors">
              hit me up!
            </a>
          </p>
        </>
      )}
      <ul
        ref={containerRef}
        className="contact mt-12 grid grid-cols-4 sm:flex sm:flex-wrap sm:justify-center border-t-2 border-white/10 py-8"
        style={{
          transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
        }}
      >
        {minimal && (
          <li className="px-1 py-4 sm:p-4 animate-float">
            <Link href="/" className="group flex flex-col items-center transition-transform duration-200 will-change-transform hover:-translate-y-1.5">
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="accent-text mb-2 transition-transform duration-200 group-hover:scale-110 group-hover:[animation:none] group-hover:!text-white">
                <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M16.5 12H8m0 0 3.5-3.5M8 12l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="accent-text font-semibold transition-colors group-hover:[animation:none] group-hover:!text-white group-hover:underline underline-offset-4 decoration-2">portfolio</p>
            </Link>
          </li>
        )}
        <li className="px-1 py-4 sm:p-4 animate-float">
          <a href="https://www.linkedin.com/in/dkells/" className="group flex flex-col items-center transition-transform duration-200 will-change-transform hover:-translate-y-1.5">
            <span aria-hidden className="accent-bg mb-2 h-10 w-10 transition-transform duration-200 group-hover:scale-110 group-hover:[animation:none] group-hover:!bg-white [mask:url(/imgs/contact/linkedin.svg)_center/contain_no-repeat]" />
            <p className="accent-text font-semibold transition-colors group-hover:[animation:none] group-hover:!text-white group-hover:underline underline-offset-4 decoration-2">dkells</p>
          </a>
        </li>
        <li className="px-1 py-4 sm:p-4 animate-float-delayed" style={{ animationDelay: '0.15s' }}>
          <a href="https://dribbble.com/kidastro" className="group flex flex-col items-center transition-transform duration-200 will-change-transform hover:-translate-y-1.5">
            <span aria-hidden className="accent-bg mb-2 h-10 w-10 transition-transform duration-200 group-hover:scale-110 group-hover:[animation:none] group-hover:!bg-white [mask:url(/imgs/contact/dribbble.svg)_center/contain_no-repeat]" />
            <p className="accent-text font-semibold transition-colors group-hover:[animation:none] group-hover:!text-white group-hover:underline underline-offset-4 decoration-2">dribbble</p>
          </a>
        </li>
        <li className="px-1 py-4 sm:p-4 animate-float" style={{ animationDelay: '0.3s' }}>
          <a href="mailto:davekeller@me.com?subject=Hey Dave!" className="group flex flex-col items-center transition-transform duration-200 will-change-transform hover:-translate-y-1.5">
            <span aria-hidden className="accent-bg mb-2 h-10 w-10 transition-transform duration-200 group-hover:scale-110 group-hover:[animation:none] group-hover:!bg-white [mask:url(/imgs/contact/email.svg)_center/contain_no-repeat]" />
            <p className="accent-text font-semibold transition-colors group-hover:[animation:none] group-hover:!text-white group-hover:underline underline-offset-4 decoration-2">email</p>
          </a>
        </li>
        {!minimal && (
          <li className="px-1 py-4 sm:p-4 animate-float-delayed" style={{ animationDelay: '0.45s' }}>
            <Link href="/resume" className="group flex flex-col items-center transition-transform duration-200 will-change-transform hover:-translate-y-1.5">
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="accent-text mb-2 transition-transform duration-200 group-hover:scale-110 group-hover:[animation:none] group-hover:!text-white">
                <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M7.5 12H16m0 0-3.5-3.5M16 12l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="accent-text font-semibold transition-colors group-hover:[animation:none] group-hover:!text-white group-hover:underline underline-offset-4 decoration-2">resume</p>
            </Link>
          </li>
        )}
      </ul>
      <h4 className="text-xs text-white/20 mt-8">© 2026 Dave Keller</h4>
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
