import React from 'react';
import Image from 'next/image';
import Icosahedron from './Icosahedron';

const Intro = () => {
  return (
    <div className="relative flex flex-col items-center justify-start bg-transparent text-center -mt-8 pb-48">
      <Icosahedron />
      <div className="intro flex flex-col items-center max-w-[700px] mx-auto px-6 z-10 -mt-32">
        <h1 className="mb-8 text-4xl md:text-7xl text-white tracking-tight font-extrabold">
          so nice to meet you
        </h1>
        <p className="mb-8 max-w-[700px] leading-loose">
          Hi, I&apos;m Dave and I&apos;ve been designing app experiences for 15+ years. From early iPhone apps to enterprise SaaS platforms serving millions, I&apos;ve helped many startups turn whiteboard ideas into products people actually love using.
        </p>
        <p className="mb-8 max-w-[700px] leading-loose">
          I love prototyping in code, collaborating with smart people, and stress making things feel intuitive and simple. Thanks for checking out my work!
        </p>
        <Image
          src="/imgs/down.svg"
          alt="down arrow"
          width={30}
          height={30}
          className="downarrow opacity-30 hover:opacity-100 transition-opacity cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Intro;
