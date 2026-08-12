'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { GameId } from '@/components/games/gamesData';

const loading = () => (
  <div className="absolute inset-0 flex items-center justify-center text-white/50 font-bold">
    warming up the launch pad…
  </div>
);

const MoonGarden = dynamic(() => import('@/components/games/MoonGarden'), { ssr: false, loading });
const StarSwarm = dynamic(() => import('@/components/games/StarSwarm'), { ssr: false, loading });
const RocketClimb = dynamic(() => import('@/components/games/RocketClimb'), { ssr: false, loading });

/**
 * Fullscreen host for a running game: locks page scroll while one is up and
 * lazy-loads only the chunk that's actually played. Renders nothing when
 * `selected` is null, so a caller can mount it unconditionally. `exitLabel`
 * names where the exit button goes back to — "all games" is only true on the
 * arcade page.
 */
const GameStage = ({
  selected,
  onExit,
  exitLabel,
}: {
  selected: GameId | null;
  onExit: () => void;
  exitLabel?: string;
}) => {
  useEffect(() => {
    if (!selected) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selected]);

  if (!selected) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#05070f]">
      {selected === 'moon-garden' && <MoonGarden onExit={onExit} exitLabel={exitLabel} />}
      {selected === 'star-swarm' && <StarSwarm onExit={onExit} exitLabel={exitLabel} />}
      {selected === 'rocket-climb' && <RocketClimb onExit={onExit} exitLabel={exitLabel} />}
    </div>
  );
};

export default GameStage;
