import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import CompanyMark from '@/components/CompanyMark';

const Dancefight = () => {
  return (
    <AnimatedSection className="dance grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
      <div className="info col-span-1 md:col-span-3 text-left text-white px-8 py-8 border-2 border-white/20 rounded-lg max-w-3xl mx-auto mb-12">
        <div className="flex items-start gap-4 mb-4">
          <CompanyMark company="dancefight" />
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Dancefight</h2>
            <p className="text-lg font-bold mt-1">Product Design Consultant</p>
            <h4 className="text-white/50 text-balance text-base font-bold italic mt-1.5">A social voting app</h4>
          </div>
        </div>
        <div className="w-full border-b-2 border-white/20 mb-4"></div>
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
