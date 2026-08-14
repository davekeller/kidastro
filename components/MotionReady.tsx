'use client';

import { useEffect } from 'react';

/**
 * Arms the site's entrance animations. Until <html data-motion-ready> is set,
 * globals.css reveals scroll-in content on its own (see "Blank-page guard"), so a
 * pageview that never receives animation frames can't strand every section at
 * opacity:0.
 *
 * We only arm when the page is genuinely being painted: visible, and early enough
 * that the CSS fallback hasn't started revealing anything yet. A tab that loads
 * hidden or prerendered just skips the entrance animation for that pageview and
 * shows its content — the degradation nobody notices, instead of a blank page.
 */
export default function MotionReady() {
  useEffect(() => {
    if (document.visibilityState !== 'visible') return;

    const frame = requestAnimationFrame(() => {
      // Re-check on the frame itself: if we were backgrounded in the meantime this
      // fires late, and arming now would re-hide content the fallback just revealed.
      if (performance.now() > 1000) return;
      document.documentElement.setAttribute('data-motion-ready', '');
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return null;
}
