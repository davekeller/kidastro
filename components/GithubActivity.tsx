'use client';

import React, { useEffect, useState } from 'react';
import ContributionGraph from './ContributionGraph';
import { GITHUB_URL, githubStats } from '@/data/githubStats';

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
          <div key={stat.label} className="border-2 border-white/10 rounded-lg px-5 py-4 text-left text-white">
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
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/30 px-5 py-2 text-sm font-medium text-white/70 backdrop-blur-md transition-colors hover:border-(--color-2) hover:text-(--color-2)"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
          github.com/davekeller
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">↗</span>
        </a>
      </div>
    </div>
  );
};

export default GithubActivity;
