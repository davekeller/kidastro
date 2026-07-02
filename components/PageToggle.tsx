'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PageToggle = () => {
  const pathname = usePathname();

  // Folio/Docs nav intentionally hidden for now — pages stay reachable by
  // direct URL. Flip to false to restore the toggle.
  const hidden = true;
  if (hidden) return null;

  return (
    <div className="flex justify-center w-full sticky top-4 z-40 pointer-events-none">
      <nav className="inline-flex gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm pointer-events-auto">
        <Link
          href="/"
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            pathname === '/'
              ? 'bg-white/15 text-white'
              : 'text-white/70 hover:text-white/80'
          }`}
        >
          Folio
        </Link>
        <Link
          href="/dk-docs"
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            pathname === '/dk-docs'
              ? 'bg-white/15 text-white'
              : 'text-white/70 hover:text-white/80'
          }`}
        >
          Docs
        </Link>
      </nav>
    </div>
  );
};

export default PageToggle;
