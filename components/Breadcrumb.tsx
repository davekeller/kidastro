import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Crumb {
  href: string;
  label: string;
}

/**
 * Fixed top-left back/breadcrumb cluster shared across every sub-page: the site
 * icon links home, followed by a `portfolio / <label>` trail. Pass `parents` for
 * pages nested deeper than one level (e.g. a lyric sheet under the lyric book).
 * Carries no positioning of its own — the caller supplies `fixed top-6 left-6`.
 */
const Breadcrumb = ({ label, parents = [] }: { label: string; parents?: Crumb[] }) => {
  const trail: Crumb[] = [{ href: '/', label: 'portfolio' }, ...parents];

  return (
    <div className="inline-flex items-center gap-3 text-sm font-medium">
      <Link href="/" aria-label="Back to portfolio" className="opacity-80 transition-opacity hover:opacity-100">
        <Image src="/imgs/icon.svg" alt="" width={40} height={40} />
      </Link>
      <nav aria-label="Breadcrumb" className="hidden sm:block">
        <ol className="flex items-center gap-2">
          {trail.map((crumb) => (
            <React.Fragment key={crumb.href}>
              <li>
                <Link
                  href={crumb.href}
                  className="text-white/80 transition-colors hover:text-(--color-2)"
                >
                  {crumb.label}
                </Link>
              </li>
              <li aria-hidden="true" className="text-white/30">
                /
              </li>
            </React.Fragment>
          ))}
          <li aria-current="page" className="max-w-[40vw] truncate text-white">
            {label}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
