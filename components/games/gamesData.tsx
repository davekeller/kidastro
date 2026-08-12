import React from 'react';

export type GameId = 'moon-garden' | 'star-swarm' | 'rocket-climb';

export interface Game {
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
}

/** The arcade lineup. Shared by the arcade page and the 404 easter egg. */
export const games: Game[] = [
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
