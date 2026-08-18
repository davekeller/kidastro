'use client';

import React, { useState, type CSSProperties } from 'react';
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
    <div className="arcade-page w-full text-white">
      <div aria-hidden className="arcade-page-grid" />
      <div aria-hidden className="arcade-page-glow arcade-page-glow-one" />
      <div aria-hidden className="arcade-page-glow arcade-page-glow-two" />

      <div className="fixed top-6 left-6 z-40">
        <Breadcrumb label="games" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 pb-20 pt-28 sm:px-8 lg:px-12">
        <header className="arcade-hero">
          <div className="arcade-hero-copy">
            <div className="arcade-kicker">
              <span className="arcade-live-dot" />
              independent games division
              <span aria-hidden>·</span>
              build 03
            </div>

            <h1 className="arcade-title">
              <span>Kid Astro</span>
              <span className="arcade-title-outline">Arcade</span>
            </h1>

            <p className="arcade-intro">
              Three tiny space games, drawn and coded from scratch. No engines. No sprites.
              Just canvas, strange creatures, and one kid with a helmet.
            </p>

            <div className="arcade-specs" aria-label="Arcade details">
              <span>03 games online</span>
              <span>100% handmade</span>
              <span>keyboard ready</span>
            </div>
          </div>

          <div className="arcade-helmet-wrap">
            <div aria-hidden className="arcade-orbit arcade-orbit-one" />
            <div aria-hidden className="arcade-orbit arcade-orbit-two" />
            <div aria-hidden className="arcade-crosshair arcade-crosshair-x" />
            <div aria-hidden className="arcade-crosshair arcade-crosshair-y" />
            <AstroHelmet />
            <span className="arcade-helmet-label">drag to inspect</span>
          </div>
        </header>

        <section className="arcade-lineup" aria-labelledby="arcade-lineup-title">
          <div className="arcade-section-heading">
            <div>
              <span className="arcade-section-number">01 / Game library</span>
              <h2 id="arcade-lineup-title">Select a transmission</h2>
            </div>
            <span className="arcade-online"><i /> all systems online</span>
          </div>

          <div className="arcade-card-grid">
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelected(g.id)}
                className="arcade-game-card group"
                style={{ '--game-accent': g.accentHex } as CSSProperties}
                aria-label={`Play ${g.name}`}
              >
                <span className="arcade-card-topline">
                  <span>KA—{g.number}</span>
                  <span className="arcade-card-status"><i /> ready</span>
                </span>

                <span className="arcade-card-visual" aria-hidden>
                  <span className="arcade-card-radar" />
                  <span className="arcade-card-icon">{g.icon}</span>
                  <span className="arcade-card-coordinates">34° 12&apos; N<br />118° 14&apos; W</span>
                </span>

                <span className="arcade-card-body">
                  <span className="arcade-card-genre">{g.genre}</span>
                  <span className="arcade-card-name">{g.name}</span>
                  <span className="arcade-card-inspired">{g.inspiredBy}</span>
                  <span className="arcade-card-tagline">{g.tagline}</span>
                </span>

                <span className="arcade-card-footer">
                  <span className="arcade-controls">{g.controls}</span>
                  <span className="arcade-launch">
                    launch <b aria-hidden>↗</b>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="arcade-ticker" aria-hidden>
          <span>no engines</span><i />
          <span>no sprites</span><i />
          <span>all canvas</span><i />
          <span>made in austin, tx</span>
        </div>
      </div>

      <GameStage selected={selected} onExit={() => setSelected(null)} />
    </div>
  );
};

export default Arcade;
