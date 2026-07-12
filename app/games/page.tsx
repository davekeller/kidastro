import React from 'react';
import Arcade from '@/components/games/Arcade';

export const metadata = {
  title: 'Games',
  description:
    'The Kid Astro Arcade — three tiny space games built from scratch in canvas: Moon Garden, Star Swarm, and Rocket Climb.',
  alternates: { canonical: '/games' },
};

export default function GamesPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden z-10">
      <Arcade />
    </main>
  );
}
