import React from 'react';

import Icosahedron from './Icosahedron';
import AnimatedBreak from './AnimatedBreak';
import FadeUp from './FadeUp';

const Intro = () => {
  return (
    <div className="relative flex flex-col items-center justify-start bg-transparent text-center -mt-10 pb-0 md:pb-48">
      <Icosahedron />
      <div className="intro flex flex-col items-center max-w-[850px] mx-auto px-6 z-10 -mt-40 md:-mt-[136px]">
        <FadeUp className="flex flex-col items-center">
        <h1 className="mb-8 text-4xl md:text-6xl text-white tracking-tight font-extrabold">
          so nice to meet you
        </h1>
        <p className="mb-8 max-w-[680px] text-balance leading-loose">
          Hi, I&apos;m Dave — a strategic product thinker, Figma expert, and design engineer. For over a decade, I&apos;ve led design at early-stage startups, turning complex workflows into polished apps.
        </p>
        <p className="mb-8 max-w-[680px] text-balance leading-loose">
          Now I primarily design in the browser, with Claude Code/Codex and Tailwind. I enjoy the creative process, architecting systems, and working with smart people. Thanks for checking out my work.
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
