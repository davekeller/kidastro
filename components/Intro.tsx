import React from 'react';

import Icosahedron from './Icosahedron';
import AnimatedBreak from './AnimatedBreak';

const Intro = () => {
  return (
    <div className="relative flex flex-col items-center justify-start bg-transparent text-center -mt-8 pb-0 md:pb-48">
      <Icosahedron />
      <div className="intro flex flex-col items-center max-w-[700px] mx-auto px-6 z-10 -mt-32">
        <h1 className="mb-8 text-4xl md:text-7xl text-white tracking-tight font-extrabold">
          so nice to meet you
        </h1>
        <p className="mb-8 max-w-[700px] leading-loose">
          Hi, I&apos;m Dave — a product designer and design engineer. For 15+ years I&apos;ve made hard, technical things feel simple, most recently AI and quantum platforms for Fortune 500 science teams.
        </p>
        <p className="mb-8 max-w-[700px] leading-loose">
          I don&apos;t just hand off a mockup. I design it and ship the front-end too — React, Next.js, Tailwind — now with Claude Code and Cursor in the loop. Thanks for poking around.
        </p>
        <div className="-mt-32">
          <AnimatedBreak />
        </div>
      </div>
    </div>
  );
};

export default Intro;
