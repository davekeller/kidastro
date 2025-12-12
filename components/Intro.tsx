import React from 'react';

import Icosahedron from './Icosahedron';
import AnimatedBreak from './AnimatedBreak';

const Intro = () => {
  return (
    <div className="relative flex flex-col items-center justify-start bg-transparent text-center -mt-8 pb-48">
      <Icosahedron />
      <div className="intro flex flex-col items-center max-w-[700px] mx-auto px-6 z-10 -mt-32">
        <h1 className="mb-8 text-4xl md:text-7xl text-white tracking-tight font-extrabold">
          so nice to meet you
        </h1>
        <p className="mb-8 max-w-[700px] leading-loose">
          Hi, I&apos;m Dave and I&apos;ve been designing app experiences for 15+ years — from early iPhone apps to SaaS platforms serving millions.
        </p>
        <p className="mb-8 max-w-[700px] leading-loose">
          I love prototyping in code, collaborating with smart people, and making user experiences feel intuitive and simple. Thanks for checking out my work!
        </p>
        <div className="rotate-180 transform -mt-32">
          <AnimatedBreak />
        </div>
      </div>
    </div>
  );
};

export default Intro;
