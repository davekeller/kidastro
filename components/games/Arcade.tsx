'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const loading = () => (
  <div className="absolute inset-0 flex items-center justify-center text-white/50 font-bold">
    warming up the launch pad…
  </div>
);

const MoonGarden = dynamic(() => import('@/components/games/MoonGarden'), { ssr: false, loading });
const StarSwarm = dynamic(() => import('@/components/games/StarSwarm'), { ssr: false, loading });
const RocketClimb = dynamic(() => import('@/components/games/RocketClimb'), { ssr: false, loading });

type GameId = 'moon-garden' | 'star-swarm' | 'rocket-climb';

const games: {
  id: GameId;
  name: string;
  tagline: string;
  inspiredBy: string;
  controls: string;
  icon: React.ReactNode;
  /** Static Tailwind classes for this game's accent glow (JIT needs literals). */
  glowClasses: string;
  /** Accent color for the icon's phosphor drop-shadow. */
  accent: string;
}[] = [
  {
    id: 'moon-garden',
    glowClasses: 'hover:border-[#39d5cb]/40 hover:shadow-[0_0_60px_rgba(57,213,203,0.16)]',
    accent: 'rgba(57,213,203,0.55)',
    name: 'Moon Garden',
    tagline: 'Aliens are coming for the greenhouse. Plant starflowers, zap sprouts, and hold every lane.',
    inspiredBy: 'a tiny homage to Plants vs. Zombies',
    controls: 'mouse only',
    icon: (
      // Starflower in a dome
      <svg viewBox="0 0 48 48" fill="none" stroke="#39d5cb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-16 h-16">
        <path d="M8 34 C8 22 15 14 24 14 C33 14 40 22 40 34" />
        <path d="M4.5 34 H43.5" />
        <path d="M24 30 V22" stroke="#F4FD7B" />
        <circle cx="24" cy="19" r="3" fill="#F4FD7B" stroke="none" />
        <circle cx="19.5" cy="17.5" r="2" fill="#F4FD7B" stroke="none" opacity="0.7" />
        <circle cx="28.5" cy="17.5" r="2" fill="#F4FD7B" stroke="none" opacity="0.7" />
        <circle cx="24" cy="13.5" r="2" fill="#F4FD7B" stroke="none" opacity="0.7" />
        <path d="M24 30 C21 28.5 19.5 27 19 25" stroke="#39d5cb" />
        <path d="M14 40 H34" opacity="0.5" />
        <circle cx="40" cy="8" r="1.2" fill="#E4416F" stroke="none" />
        <circle cx="7" cy="10" r="1" fill="#fff" stroke="none" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: 'star-swarm',
    glowClasses: 'hover:border-[#E4416F]/40 hover:shadow-[0_0_60px_rgba(228,65,111,0.16)]',
    accent: 'rgba(228,65,111,0.55)',
    name: 'Star Swarm',
    tagline: 'A wiggling fleet of alien blobs descends. You, a kid, a rocket, and two bolts at a time.',
    inspiredBy: 'a tiny homage to Space Invaders',
    controls: '← → move · space shoots',
    icon: (
      // Alien blob invader
      <svg viewBox="0 0 48 48" fill="none" stroke="#E4416F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-16 h-16">
        <path d="M14 30 C12 20 17 12 24 12 C31 12 36 20 34 30 C36 31 37 33 36.5 35 L32 33.5 L28.5 36 L24 34 L19.5 36 L16 33.5 L11.5 35 C11 33 12 31 14 30 Z" />
        <circle cx="19.5" cy="22" r="1.8" fill="#E4416F" stroke="none" />
        <circle cx="28.5" cy="22" r="1.8" fill="#E4416F" stroke="none" />
        <path d="M17 9 L19.5 13" />
        <path d="M31 9 L28.5 13" />
        <circle cx="17" cy="8" r="1.3" fill="#E4416F" stroke="none" />
        <circle cx="31" cy="8" r="1.3" fill="#E4416F" stroke="none" />
        <path d="M22 41 H26" stroke="#39d5cb" />
        <path d="M24 43 V39" stroke="#39d5cb" />
        <circle cx="8" cy="14" r="1" fill="#fff" stroke="none" opacity="0.7" />
        <circle cx="41" cy="18" r="1.2" fill="#F4FD7B" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'rocket-climb',
    glowClasses: 'hover:border-[#F4FD7B]/40 hover:shadow-[0_0_60px_rgba(244,253,123,0.14)]',
    accent: 'rgba(244,253,123,0.55)',
    name: 'Rocket Climb',
    tagline: 'A grumpy alien is rolling moon rocks down the launch tower. Climb, jump, and reach your ride.',
    inspiredBy: 'a tiny homage to Donkey Kong',
    controls: '← → move · ↑ ↓ climb · space jumps',
    icon: (
      // Girder + ladder + rock
      <svg viewBox="0 0 48 48" fill="none" stroke="#F4FD7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-16 h-16">
        <path d="M4 14 H30" stroke="#39d5cb" />
        <path d="M18 34 H44" stroke="#39d5cb" />
        <path d="M36 14 V6.5" stroke="#fff" />
        <path d="M36 6.5 L33 10 M36 6.5 L39 10" stroke="#fff" />
        <path d="M10 14 V34" />
        <path d="M16 14 V34" />
        <path d="M10 19 H16 M10 24 H16 M10 29 H16" />
        <circle cx="27" cy="9.5" r="4.5" stroke="#E4416F" />
        <path d="M25 8.5 L26.5 10.5 M28.5 8 L29 10" stroke="#E4416F" strokeWidth="1.6" />
        <circle cx="42" cy="42" r="1" fill="#fff" stroke="none" opacity="0.7" />
      </svg>
    ),
  },
];

const Arcade = () => {
  const [selected, setSelected] = useState<GameId | null>(null);

  // Lock page scroll while a game is fullscreen.
  useEffect(() => {
    if (selected) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selected]);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16 text-white">
      <div className="mb-12 text-center">
        <Link href="/" className="inline-block text-white/50 hover:text-white text-sm font-bold mb-8 transition-colors">
          ← kidastro.com
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 [text-shadow:0_0_32px_rgba(255,255,255,0.25)]">The Kid Astro Arcade</h1>
        <p className="text-white/50 text-lg font-bold italic text-balance">
          Three tiny space games, drawn and coded from scratch — no engines, no sprites, just canvas.
          Best played with a keyboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelected(g.id)}
            className={`group relative text-left border border-white/15 rounded-xl bg-white/[0.04] backdrop-blur-md p-8 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${g.glowClasses}`}
          >
            <span aria-hidden className="color-bar absolute top-0 inset-x-6 h-[2px] rounded-full" />
            <span
              className="block mb-6 opacity-90 group-hover:opacity-100 transition-all duration-300"
              style={{ filter: `drop-shadow(0 0 6px ${g.accent})` }}
            >
              {g.icon}
            </span>
            <span className="block text-2xl font-bold mb-2">{g.name}</span>
            <span className="block text-white/50 text-sm font-bold italic mb-3">{g.inspiredBy}</span>
            <span className="block text-white/90 leading-7 text-pretty mb-6">{g.tagline}</span>
            <span className="inline-flex items-center gap-2 text-sm font-bold border border-white/20 rounded-lg px-4 py-2 bg-white/5 group-hover:bg-white/10 group-hover:border-white/40 transition-colors">
              ▶ Play
            </span>
            <span className="block text-white/40 text-xs font-bold mt-4 uppercase tracking-wider">{g.controls}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-[#05070f]">
          {selected === 'moon-garden' && <MoonGarden onExit={() => setSelected(null)} />}
          {selected === 'star-swarm' && <StarSwarm onExit={() => setSelected(null)} />}
          {selected === 'rocket-climb' && <RocketClimb onExit={() => setSelected(null)} />}
        </div>
      )}
    </div>
  );
};

export default Arcade;
