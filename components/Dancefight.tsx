import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import CompanyMark from '@/components/CompanyMark';

const Dancefight = () => {
  return (
    <AnimatedSection className="dance grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
      <div className="info col-span-1 md:col-span-3 text-left text-white px-8 py-8 border-2 border-white/10 rounded-lg max-w-3xl mx-auto mb-12">
        <div className="flex flex-col items-start gap-4 mb-4 md:flex-row md:justify-between">
          <div className="flex items-start gap-4">
            <CompanyMark company="dancefight" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Dancefight</h2>
              <h4 className="text-white/50 text-balance text-lg font-bold italic">A social voting app</h4>
            </div>
          </div>
          <span className="text-xl font-bold text-balance shrink-0 md:text-right md:mt-2">Product Design Consultant</span>
        </div>
        <div className="w-full border-b-2 border-white/10 mb-4"></div>
        <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
          I designed the core UX and final UIs for this seed-stage startup: onboarding, the main feed, the voting flow, and tournament brackets.
        </p>
      </div>
      <div className="col-span-1 md:col-span-3 relative">
          <Image src="/imgs/dance/dance3.webp" alt="dancefight example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
    </AnimatedSection>
  );
};

export default Dancefight;
