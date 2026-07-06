import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="mb-8 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between print:flex-row print:items-center print:justify-between print:mb-6">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center print:flex-row print:items-center print:gap-4">
        <Image
          src="/imgs/dave.jpg"
          alt="Dave Keller"
          width={96}
          height={96}
          className="h-[96px] w-[96px] rounded-full border-2 border-white/10 object-cover print:h-[72px] print:w-[72px] print:border print:border-gray-300"
          priority
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl print:text-3xl print:text-black">Dave Keller</h1>
          <p className="mt-2 text-base text-white/80 print:text-sm print:text-gray-700">
            design engineer / lead product designer
          </p>
        </div>
      </div>

      <ul className="text-sm text-white/80 sm:text-right print:text-xs print:text-black">
        <li>
          512.595.6213
          <span className="mx-1.5 text-white/40 print:text-gray-400">|</span>
          <a
            href="https://www.linkedin.com/in/dkells/"
            className="transition-colors hover:text-(--color-3) print:text-black"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin
          </a>
        </li>
        <li>
          <a
            href="mailto:davekeller@me.com?subject=Hey Dave!"
            className="transition-colors hover:text-(--color-3) print:text-black"
          >
            davekeller@me.com
          </a>
        </li>
        <li>
          <a
            href="/"
            className="font-semibold transition-colors hover:text-(--color-3) print:text-black"
          >
            kidastro.com
          </a>
        </li>
      </ul>
    </header>
  );
};

export default Header;
