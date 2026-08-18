import React from 'react';
import Arcade from '@/components/games/Arcade';

export const metadata = {
  title: 'Games',
  description:
    'The Kid Astro Arcade — three tiny space games built from scratch in canvas: Moon Garden, Star Swarm, and Rocket Climb.',
  alternates: { canonical: '/games' },
  openGraph: {
    title: 'The Kid Astro Arcade',
    description: 'Three hand-built space games. No engines, no sprites — just canvas.',
    url: '/games',
    images: [
      {
        url: '/og-arcade.png',
        width: 1672,
        height: 941,
        alt: 'Kid Astro Arcade — three hand-built space games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Kid Astro Arcade',
    description: 'Three hand-built space games. No engines, no sprites — just canvas.',
    images: ['/og-arcade.png'],
  },
};

export default function GamesPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden z-10">
      <Arcade />
    </main>
  );
}
