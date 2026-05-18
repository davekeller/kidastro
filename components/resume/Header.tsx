import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="mb-16 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Image
          src="/imgs/dave.jpg"
          alt="Dave Keller"
          width={120}
          height={120}
          className="h-[120px] w-[120px] rounded-full border-2 border-white/10 object-cover"
          priority
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Dave Keller</h1>
          <p className="mt-2 text-base text-white/60">
            Director of Product · Product UX/UI Designer · Front-End Developer
          </p>
        </div>
      </div>

      <ul className="text-sm text-white/60 sm:text-right">
        <li>512.595.6213</li>
        <li>
          <a
            href="mailto:davekeller@me.com?subject=Hey Dave!"
            className="transition-colors hover:text-(--color-3)"
          >
            davekeller@me.com
          </a>
        </li>
        <li>
          <Link href="/" className="transition-colors hover:text-(--color-3)">
            kidastro.com
          </Link>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/dkells/"
            className="transition-colors hover:text-(--color-3)"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/dkells
          </a>
        </li>
      </ul>
    </header>
  );
};

export default Header;
