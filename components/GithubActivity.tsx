'use client';

import React, { useEffect, useState } from 'react';
import ContributionGraph from './ContributionGraph';
import { GITHUB_URL, githubStats, type GithubStatIcon } from '@/data/githubStats';

// GitHub activity cluster: the contribution graph up top, three stat cards
// under it, and a link out to the live profile. One color clock up here
// drives the graph headline, the card values, and the octocat so the whole
// cluster shifts hue together (same 5s cycle as AnimatedBreak).
const COLORS = [
  '#f4fd7b', // Yellow
  '#39d5cb', // Teal
  '#e4416f', // Pink
  '#fcd34d', // Gold
  '#6ee7b7', // Mint
];

// Wireframe line icons in the same family as the Mission Control and company
// marks (36 viewBox, 2.2 stroke, round caps): a git merge for the PRs, tree
// rings for the years, and a constellation for the repos.
const svgProps = {
  viewBox: '0 0 36 36',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  className: 'h-8 w-8',
} as const;

const STAT_ICONS: Record<GithubStatIcon, React.ReactNode> = {
  merge: (
    <svg {...svgProps}>
      <circle cx="9" cy="7.5" r="3" />
      <circle cx="9" cy="28.5" r="3" />
      <circle cx="28" cy="18" r="3" />
      <path d="M9 10.5 V25.5" />
      <path d="M9 13 C9 18, 16 18, 25 18" />
    </svg>
  ),
  rings: (
    <svg {...svgProps}>
      <circle cx="18" cy="18" r="4.5" />
      <path d="M27.5 18 A9.5 9.5 0 1 1 18 8.5" />
      <path d="M18 3.5 A14.5 14.5 0 1 1 3.5 18" />
      <circle cx="18" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  constellation: (
    <svg {...svgProps}>
      <path d="M8.5 26.5 L14 18 L17 8.5" />
      <path d="M14 18 L26 13.5 M14 18 L23.5 27.5" />
      <circle cx="17" cy="8.5" r="2.4" />
      <circle cx="26" cy="13.5" r="2.4" />
      <circle cx="8.5" cy="26.5" r="2.4" />
      <circle cx="23.5" cy="27.5" r="2.4" />
      <circle cx="14" cy="18" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const GithubActivity = () => {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLORS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const accent = COLORS[colorIndex];

  return (
    <div className="w-full">
      <ContributionGraph accent={accent} />

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {githubStats.map((stat) => (
          <div key={stat.label} className="relative border-2 border-white/10 rounded-lg px-5 py-4 text-left text-white">
            <span className="absolute top-4 right-4 text-white/25">{STAT_ICONS[stat.icon]}</span>
            <p className="text-3xl font-bold transition-colors duration-[2000ms]" style={{ color: accent }}>
              {stat.value}
            </p>
            <p className="mt-1 text-white/90 font-bold">{stat.label}</p>
            <p className="mt-1.5 text-sm leading-snug text-white/40 text-pretty">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/30 px-5 py-2 text-sm font-medium text-white/70 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-(--color-2) hover:text-(--color-2) hover:-translate-y-0.5 hover:shadow-[0_6px_24px_-6px_rgba(57,213,203,0.35)]"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
          github.com/davekeller
          <span aria-hidden className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5">↗</span>
        </a>
      </div>
    </div>
  );
};

export default GithubActivity;
