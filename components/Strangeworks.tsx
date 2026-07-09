import React from 'react';
import AnimatedSection from '@/components/AnimatedSection';

const Strangeworks = () => {
  return (
    <AnimatedSection className="strangeworks grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 items-center">
      <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
        {/* Description */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-4xl font-bold">Strangeworks</h2>
          </div>
          <h4 className="text-(--color-2) text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">An advanced-compute platform putting AI, quantum, and HPC to work for Fortune 500 science teams</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            Advanced compute is powerful but hostile — real science problems show up as whiteboard sketches, not code. I lead product strategy and design across the platform, and designed Aura, our AI-assisted workflow app that takes a science team from problem formulation to results on quantum and HPC hardware — hands-on from business strategy to production code.
          </p>
        </div>

        {/* Highlights */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl flex flex-col items-start">
          <h3 className="text-2xl font-bold my-2">Design Engineer / Director of Product</h3>
          <h4 className="text-xl font-semibold text-(--color-2) mb-4 tracking-wider">Highlights:</h4>
          <div className="w-full border-b-2 border-white/10 mb-6"></div>
          <ul className="list-none space-y-4 w-full">
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Promoted from Senior Product Designer to Director of Product in 6 months</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Researched internal process and designed the vision for Aura, our workflow app — then helped build it in production code</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Embedded with engineering, leadership, and the science team to ship across the compute platform, docs, and marketing sites</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Designed an AI-assisted problem-formulation app, plus dozens of client optimization apps — staff scheduling, fleet routing, and more</li>
          </ul>
        </div>
      </div>

      {/* TODO: image grid — two rows, spans chosen once screenshots land in
          public/imgs/strangeworks/ (6-col system, e.g. full-width hero then
          halves/thirds, like the other sections) */}

    </AnimatedSection>
  );
};

export default Strangeworks;
