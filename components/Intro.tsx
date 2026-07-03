import React from 'react';

import Icosahedron from './Icosahedron';
import AnimatedBreak from './AnimatedBreak';
import FadeUp from './FadeUp';

const Intro = () => {
  return (
    <div className="relative flex flex-col items-center justify-start bg-transparent text-center -mt-10 pb-0 md:pb-48">
      <Icosahedron />
      <div className="intro flex flex-col items-center max-w-[850px] mx-auto px-6 z-10 -mt-32">
        <FadeUp className="flex flex-col items-center">
        <h1 className="mb-8 text-4xl md:text-7xl text-white tracking-tight font-extrabold">
          so nice to meet you
        </h1>
        <p className="mb-8 max-w-[800px] text-balance leading-loose">
          Hi, I&apos;m Dave — a strategic product thinker, Figma expert, and front-end dev (CSS, Tailwind). In over 10 years of leading design at early-stage startups, I&apos;ve developed a superpower: crafting complex workflows into polished app experiences.
        </p>
        <p className="mb-8 max-w-[800px] text-balance leading-loose">
          I enjoy the creative process, prototyping in code, architecting systems, working with smart people, and celebrating the wins. Thanks for checking out my work.
        </p>
        </FadeUp>
        <div className="-mt-32">
          <AnimatedBreak />
        </div>
      </div>
    </div>
  );
};

export default Intro;
