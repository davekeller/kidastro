import React from 'react';
import NotFound from '@/components/NotFound';

// Static export writes this to out/404.html, which is what GitHub Pages serves
// for any unmatched path. (not-found.tsx can't export metadata — the title
// falls back to the root layout's default.)
export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden z-10">
      <NotFound />
    </main>
  );
}
