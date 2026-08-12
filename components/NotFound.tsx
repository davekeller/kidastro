'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import GameStage from '@/components/games/GameStage';
import { games, type GameId } from '@/components/games/gamesData';

// The tumbling wireframe "404" is the whole visual — client-only (three.js),
// with its height reserved so the headline doesn't jump when the chunk lands.
const NUMERALS_BOX = 'mx-auto h-[300px] w-full sm:h-[380px]';
const Lost404 = dynamic(() => import('@/components/Lost404'), {
  ssr: false,
  loading: () => <div className={NUMERALS_BOX} />,
});

/**
 * The 404. A drifting helmet, a soft apology, a way home — and, for anyone
 * curious enough to keep reading, the arcade playable right here on the page.
 */
const NotFound = () => {
  const [selected, setSelected] = useState<GameId | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-24 pb-24 text-white">
      <div className="fixed top-6 left-6 z-40">
        <Breadcrumb label="lost" />
      </div>

      <div className="text-center">
        <Lost404 className={NUMERALS_BOX} />

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance [text-shadow:0_0_32px_rgba(255,255,255,0.25)]">
          it seems you&rsquo;re lost in space
        </h1>
        <p className="text-white/50 text-lg font-normal italic text-balance">
          That page isn&rsquo;t in this orbit. Could&rsquo;ve moved, could&rsquo;ve never existed.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-bold border border-white/20 rounded-lg px-5 py-2.5 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-colors"
        >
          ← back to the portfolio
        </Link>
      </div>

      <div className="relative mt-20 border border-white/15 rounded-xl bg-white/[0.04] backdrop-blur-md p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <span aria-hidden className="color-bar absolute top-0 inset-x-6 h-[2px] rounded-full" />

        <h2 className="text-2xl font-bold mb-2">since you&rsquo;re already out here</h2>
        <p className="text-white/50 text-sm font-normal italic mb-8">
          Three tiny space games, coded from scratch in canvas. Nobody has to know.
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {games.map((g) => (
            <li key={g.id}>
              <button
                onClick={() => setSelected(g.id)}
                aria-label={`Play ${g.name}`}
                className={`group flex h-full w-full flex-col items-center gap-3 text-center border border-white/15 rounded-lg bg-white/[0.03] px-4 py-6 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 cursor-pointer ${g.glowClasses}`}
              >
                <span
                  aria-hidden
                  className="opacity-90 transition-opacity duration-300 group-hover:opacity-100 [&>svg]:h-11 [&>svg]:w-11"
                  style={{ filter: `drop-shadow(0 0 6px ${g.accent})` }}
                >
                  {g.icon}
                </span>
                <span className="block text-sm font-bold">{g.name}</span>
                <span className="block text-white/40 text-[11px] font-bold uppercase tracking-wider text-balance">
                  {g.controls}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="text-white/40 text-sm mt-8">
          Or see all three at{' '}
          <Link href="/games" className="text-white/70 underline underline-offset-4 hover:text-(--color-2) transition-colors">
            the arcade
          </Link>
          .
        </p>
      </div>

      <GameStage selected={selected} onExit={() => setSelected(null)} exitLabel="← Back" />
    </div>
  );
};

export default NotFound;
