import React from 'react';
import Image from 'next/image';

const Intro = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-transparent px-4 py-20 text-center">
      <div className="intro flex flex-col items-center">
        <Image
          src="/imgs/logo.svg"
          alt="logo"
          width={100}
          height={100}
          className="logo mb-8"
        />
        <h1 className="mb-4 font-serif text-4xl text-white drop-shadow-md md:text-6xl">
          so nice to meet you
        </h1>
        <p className="mb-4 max-w-2xl text-lg leading-8 text-white/90">
          Hi, I&apos;m Dave, and I&apos;ve been leading design at startups for 15+ years — from early iPhone apps to SaaS platforms with millions of daily interactions.
        </p>
        <p className="mb-12 max-w-2xl text-lg leading-8 text-white/90">
          I love prototyping in code, collaborating with smart people, learning new tools, and trying to keep things simple. Thanks for checking out my work!
        </p>
        <Image
          src="/imgs/down.svg"
          alt="down arrow"
          width={30}
          height={30}
          className="downarrow animate-bounce"
        />
      </div>
    </div>
  );
};

export default Intro;
