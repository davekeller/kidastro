import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import ContributionGraph from '@/components/ContributionGraph';

const Strangeworks = () => {
  return (
    <AnimatedSection className="strangeworks grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 items-center">
      <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
        {/* Description */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-4xl font-bold">Strangeworks</h2>
          </div>
          <h4 className="text-(--color-2) text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">A data-science consulting company for Fortune 500 teams running AI, quantum, and HPC compute</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            I lead product design across the platform — designing Aura, our AI-assisted workflow app that takes a science team from problem formulation to results on quantum and HPC hardware, plus custom web apps we build for clients. Hands-on from business strategy to production code.
          </p>
        </div>

        {/* Highlights */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-lg flex flex-col items-start">
          <h3 className="text-2xl font-bold my-2">Design Engineer / Director of Product</h3>
          <h4 className="text-xl font-semibold text-(--color-2) mb-4 tracking-wider">Highlights:</h4>
          <div className="w-full border-b-2 border-white/10 mb-6"></div>
          <ul className="list-none space-y-4 w-full">
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90">Promoted from Senior Product Designer to Director of Product in 6 months</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90">Researched internal process and designed the vision for Aura, our workflow app — then helped build it in production code</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90">Embedded with engineering, leadership, and the science team to ship across the compute platform, docs, and marketing sites</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90">Designed dozens of client optimization apps — staff scheduling, fleet routing, and more</li>
          </ul>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-5 relative">
         <Image src="/imgs/strangeworks/strange1.png" alt="Aura app — optimization job details with AI-assisted results analysis" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
          <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/25 backdrop-blur-sm px-4 py-2 rounded-lg shadow-xl z-10 text-center">
            <h5 className="text-black font-bold text-xl">flows &amp; templates</h5>
          </div>
         <Image src="/imgs/strangeworks/strange2.jpg" alt="Figma wireframe and flow template library" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
          <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/25 backdrop-blur-sm px-4 py-2 rounded-lg shadow-xl z-10 text-center">
            <h5 className="text-black font-bold text-xl">prototypes</h5>
          </div>
         <Image src="/imgs/strangeworks/strange3.jpg" alt="Figma flow map of the Aura app — projects, research, and formulation flows" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-5 lg:col-start-2 relative">
         <Image src="/imgs/strangeworks/strange4.png" alt="Client optimization apps — nurse scheduling and last-mile dispatch dashboards" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-full w-full max-w-3xl mx-auto relative">
        <ContributionGraph />
      </div>

    </AnimatedSection>
  );
};

export default Strangeworks;
