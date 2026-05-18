import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HomeLink = () => {
  return (
    <div className="inline-flex items-center gap-3 text-sm font-medium">
      <Image
        src="/imgs/icon.svg"
        alt=""
        width={40}
        height={40}
        className="opacity-80"
      />
      <nav aria-label="Breadcrumb" className="hidden sm:block">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/"
              className="text-white/60 transition-colors hover:text-(--color-2)"
            >
              portfolio
            </Link>
          </li>
          <li aria-hidden="true" className="text-white/30">
            /
          </li>
          <li aria-current="page" className="text-white">
            resume
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default HomeLink;
