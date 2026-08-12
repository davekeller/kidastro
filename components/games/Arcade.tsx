'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Breadcrumb from '@/components/Breadcrumb';
import GameStage from '@/components/games/GameStage';
import { games, type GameId } from '@/components/games/gamesData';

// Floating wireframe helmet mascot. Client-only (three.js); reserve its height
// while the chunk loads so the header doesn't jump.
const AstroHelmet = dynamic(() => import('@/components/games/AstroHelmet'), {
  ssr: false,
  loading: () => <div className="mx-auto h-[300px] w-full max-w-[420px]" />,
});

const Arcade = () => {
  const [selected, setSelected] = useState<GameId | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16 text-white">
      <div className="fixed top-6 left-6 z-40">
        <Breadcrumb label="games" />
      </div>

      <div className="mb-12 text-center">
        <AstroHelmet />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 [text-shadow:0_0_32px_rgba(255,255,255,0.25)]">The Kid Astro Arcade</h1>
        <p className="text-white/50 text-lg font-normal italic text-balance">
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
            <span className="block text-white/50 text-sm font-normal italic mb-3">{g.inspiredBy}</span>
            <span className="block text-white/90 leading-7 text-pretty mb-6">{g.tagline}</span>
            <span className="inline-flex items-center gap-2 text-sm font-bold border border-white/20 rounded-lg px-4 py-2 bg-white/5 group-hover:bg-white/10 group-hover:border-white/40 transition-colors">
              ▶ Play
            </span>
            <span className="block text-white/40 text-xs font-bold mt-4 uppercase tracking-wider">{g.controls}</span>
          </button>
        ))}
      </div>

      <GameStage selected={selected} onExit={() => setSelected(null)} />
    </div>
  );
};

export default Arcade;
