import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HomeLink = () => {
  return (
    <Link
      href="/"
      aria-label="View portfolio"
      className="group fixed top-6 left-6 z-20 inline-flex items-center gap-3"
    >
      <Image
        src="/imgs/icon.svg"
        alt=""
        width={40}
        height={40}
        className="opacity-80 transition-opacity group-hover:opacity-100"
      />
      <span className="hidden items-center rounded-full border border-white/15 bg-black/30 px-5 py-2 text-sm font-medium text-white/70 backdrop-blur-md transition-colors group-hover:border-(--color-2) group-hover:text-(--color-2) sm:inline-flex">
        View Portfolio
      </span>
    </Link>
  );
};

export default HomeLink;
