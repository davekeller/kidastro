import React from 'react';

import Icosahedron from './Icosahedron';
import AnimatedBreak from './AnimatedBreak';
import FadeUp from './FadeUp';

const Intro = () => {
  return (
    <div className="relative flex flex-col items-center justify-start bg-transparent text-center -mt-10 pb-0 md:pb-48">
      <Icosahedron />
      <div className="intro flex flex-col items-center max-w-[1010px] mx-auto px-6 z-10 -mt-48 md:-mt-[136px]">
        <FadeUp className="flex flex-col items-center">
        <h1 className="mb-8 text-4xl md:text-6xl text-white tracking-tight font-extrabold">
          so nice to meet you
        </h1>
        <p className="mb-8 max-w-[960px] text-balance leading-loose">
          Hi, I&apos;m Dave — a strategic product thinker, Figma expert, and pixel-perfect front-end/design engineer. I&apos;ve been leading design at early-stage startups for over a decade.
        </p>
        <p className="mb-8 max-w-[960px] text-balance leading-loose">
          Riding the front of the agentic coding wave, I now design primarily in Claude Code/Codex and Tailwind — validating functional prototypes and shipping production code in days, not weeks. Now scroll. I&apos;ll wait.
        </p>
        </FadeUp>
        <div className="-mt-14 md:-mt-28">
          <AnimatedBreak />
        </div>
      </div>
    </div>
  );
};

export default Intro;
