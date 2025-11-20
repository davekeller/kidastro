import React from 'react';
import Image from 'next/image';

const Intro = () => {
  return (
    <div className="relative flex flex-col items-center justify-center bg-transparent text-center my-[3vh] md:my-[8vh] sm:my-16">
      <div className="intro flex flex-col items-center max-w-[610px] md:max-w-[80%] sm:max-w-[90%] mx-auto px-4">
        <Image
          src="/imgs/logo.svg"
          alt="logo"
          width={120}
          height={120}
          className="logo mb-4 sm:w-[100px]"
        />
        <h1 className="mb-4 mt-4 text-5xl md:text-6xl text-white">
          so nice to meet you
        </h1>
        <p className="mt-8 mb-4 md:mt-4 text-[1.1rem] leading-relaxed text-white/80">
          Hi, I&apos;m Dave, and I&apos;ve been leading design at startups for 15+ years — from early iPhone apps to SaaS platforms with millions of daily interactions.
        </p>
        <p className="mb-4 text-[1.1rem] leading-relaxed text-white/80">
          I love prototyping in code, collaborating with smart people, learning new tools, and trying to keep things simple. Thanks for checking out my work!
        </p>
        <Image
          src="/imgs/down.svg"
          alt="down arrow"
          width={30}
          height={30}
          className="downarrow mt-16 sm:mt-8 opacity-30"
        />
      </div>
    </div>
  );
};

export default Intro;
