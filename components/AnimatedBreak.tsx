'use client';

import React from 'react';

import { BREAK_MARKS } from './breaks/BreakMarks';
import { useBreakParallax } from './breaks/useBreakParallax';

interface AnimatedBreakProps {
  /** Which mark to draw. Indexes into BREAK_MARKS and wraps, so callers can
      just number the breaks down the page and let the set repeat. */
  mark?: number;
}

/* The rule between sections: one wireframe body pointing down, swaying in
   perspective, flanked by two small satellites that keep the airy horizontal
   rhythm the old row of glyphs had.

   Color comes from .accent-text — the site's shared 100s palette clock, the
   same one driving the top bar and the footer — and every stroke in the mark
   is currentColor, so tinting the row tints the geometry. */
const AnimatedBreak = ({ mark = 0 }: AnimatedBreakProps) => {
  useBreakParallax();

  const { Mark, sway, depth } = BREAK_MARKS[mark % BREAK_MARKS.length];

  return (
    <div className="flex w-full items-center justify-center py-32 md:py-48">
      <div
        className="accent-text flex items-center gap-8 md:gap-12 break-parallax"
        style={{ '--parallax-depth': depth } as React.CSSProperties}
      >
        <span className="break-satellite break-satellite-a" aria-hidden>
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 md:h-3 md:w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M6 1.5 V10.5 M1.5 6 H10.5" />
          </svg>
        </span>

        <span className="break-mark" style={{ opacity: 0.85 }}>
          <span className="break-mark-inner" data-sway={sway}>
            <Mark className="h-14 w-14 md:h-[72px] md:w-[72px]" />
          </span>
        </span>

        <span className="break-satellite break-satellite-b" aria-hidden>
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 md:h-3 md:w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M6 1.5 L10.5 6 L6 10.5 L1.5 6 Z" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default AnimatedBreak;
