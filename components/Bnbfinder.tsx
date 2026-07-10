import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

const BnbFinder = () => {
  return (
    <AnimatedSection className="bnb grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 items-start">
      <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
        {/* Description */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-lg">
          <h2 className="text-4xl font-bold mb-2">BnbFinder</h2>
          <h4 className="text-white/50 text-balance text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">A niche travel-listings platform (now Savvy.com)</h4>
          <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
            Designed and coded this travel platform end to end — consumer, owner, and admin apps — on my own design system and custom Tailwind framework.
          </p>
          <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
            Whiteboards to 8K subscribers, 4K+ paid, in under a year on a team of 3.
          </p>
        </div>

        {/* Highlights */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-lg flex flex-col items-start">
          <h3 className="text-2xl font-bold my-2 text-balance">Product UX/UI Design Lead + Front-End Developer</h3>
          <h4 className="text-xl font-semibold text-white/50 mb-4 tracking-wider">Highlights:</h4>
          <div className="w-full border-b-2 border-white/10 mb-6"></div>
          <ul className="list-none space-y-4 w-full">
             <li className="pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty">Coded fully responsive front-ends for all three apps in Elixir and React/Next.js</li>
             <li className="pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty">Iterated from launch through a 2.0 release</li>
             <li className="pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty">Demoed every two weeks to leadership, sales, and marketing</li>
          </ul>
        </div>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-5 relative">
         <Image src="/imgs/bnb/bnb1.png" alt="BnbFinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-3 relative lg:rounded-r-md overflow-hidden">
          <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/40 backdrop-blur-sm px-4 py-2 rounded-lg shadow-xl z-10 text-center">
            <h5 className="text-black font-bold text-xl">bnbfinder design system</h5>
          </div>
         <Image src="/imgs/bnb/bnb3.jpg" alt="BnbFinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative lg:rounded-l-md overflow-hidden">
           <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/40 backdrop-blur-sm px-4 py-2 rounded-lg shadow-xl z-10 text-center">
            <h5 className="text-black font-bold text-xl">pitch decks</h5>
          </div>
         <Image src="/imgs/bnb/bnb5.jpg" alt="BnbFinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

    </AnimatedSection>
  );
};

export default BnbFinder;
