import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Fixed top-left back/breadcrumb cluster shared across sub-pages (resume, games):
 * the site icon links home, followed by a `portfolio / <label>` trail.
 */
const Breadcrumb = ({ label }: { label: string }) => {
  return (
    <div className="inline-flex items-center gap-3 text-sm font-medium">
      <Link href="/" aria-label="Back to portfolio" className="opacity-80 transition-opacity hover:opacity-100">
        <Image src="/imgs/icon.svg" alt="" width={40} height={40} />
      </Link>
      <nav aria-label="Breadcrumb" className="hidden sm:block">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/"
              className="text-white/80 transition-colors hover:text-(--color-2)"
            >
              portfolio
            </Link>
          </li>
          <li aria-hidden="true" className="text-white/30">
            /
          </li>
          <li aria-current="page" className="text-white">
            {label}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
