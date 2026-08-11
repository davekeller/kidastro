'use client';

import { useEffect } from 'react';

/* One pointer listener and one rAF loop for every section break on the page.
   Each break used to run its own pair — ten permanent loops on the homepage,
   all lerping toward the same number, since every break is full-width and
   centered and so shares a center point with the window.

   The eased offset lands on a custom property rather than in React state.
   Ten components setting state every frame is 600 renders a second for what
   is ultimately one CSS transform; --break-parallax lets the compositor take
   it and keeps React out of the loop entirely. */

const PROP = '--break-parallax';
/** Max horizontal travel in px at the edges of the viewport. */
const RANGE = 30;
/** Per-frame approach to the target. Lower is heavier. */
const EASE = 0.05;

let subscribers = 0;
let target = 0;
let current = 0;
let frame: number | null = null;

function handleMove(e: MouseEvent) {
  const half = window.innerWidth / 2;
  target = ((e.clientX - half) / half) * RANGE;
}

function tick() {
  current += (target - current) * EASE;
  document.documentElement.style.setProperty(PROP, `${current.toFixed(2)}px`);
  frame = requestAnimationFrame(tick);
}

/** Subscribe this break to the shared parallax offset. */
export function useBreakParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    subscribers += 1;
    if (frame === null) {
      window.addEventListener('mousemove', handleMove, { passive: true });
      frame = requestAnimationFrame(tick);
    }

    return () => {
      subscribers -= 1;
      if (subscribers > 0 || frame === null) return;
      cancelAnimationFrame(frame);
      frame = null;
      window.removeEventListener('mousemove', handleMove);
      document.documentElement.style.removeProperty(PROP);
    };
  }, []);
}
