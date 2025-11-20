import React from 'react';
import Image from 'next/image';
import Dodecahedron from './Dodecahedron';

const Intro = () => {
  return (
    <div className="relative flex flex-col items-center justify-start bg-transparent text-center pt-16 pb-8">
      <div className="intro flex flex-col items-center max-w-[700px] mx-auto px-6 z-10">
        <Dodecahedron />
        <h1 className="mb-4 text-4xl md:text-6xl text-white tracking-tight font-extrabold">
          so nice to meet you
        </h1>
        <p className="mb-4 max-w-[600px]">
          Hey, I&apos;m Dave — a product designer who&apos;s been building digital experiences for 15+ years. From early iPhone apps to enterprise SaaS platforms serving millions, I&apos;ve helped startups turn big ideas into products people actually love using.
        </p>
        <p className="mb-8 max-w-[600px]">
          I thrive at the intersection of design and code, love collaborating with brilliant teams, and believe the best solutions are often the simplest ones. Let&apos;s build something great together!
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
