import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

const Dancefight = () => {
  return (
    <AnimatedSection className="dance grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
      <div className="info col-span-1 md:col-span-3 text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl max-w-3xl mx-auto mb-12">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-4xl font-bold">Dancefight</h2>
          <span className="text-sm text-white/50 mt-2">Lead Product Designer</span>
        </div>
        <h4 className="text-(--color-3) text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">A social voting app</h4>
        <p className="mb-4 text-lg leading-8 text-white/90">
          I consulted for this seed-round startup and helped with UX flows and final UIs for onboaring/tutorials, the main feed, the voting UX, tournament creation, and tournament brackets.
        </p>
      </div>
       <div className="col-span-1 relative">
          <Image src="/imgs/dance/dance1.jpg" alt="dancefight example" width={800} height={600} className="w-full rounded shadow-2xl" />
       </div>
      <div className="col-span-1 relative">
          <Image src="/imgs/dance/dance2.jpg" alt="dancefight example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
      <div className="col-span-1 md:col-span-3 relative">
          <Image src="/imgs/dance/dance3.jpg" alt="dancefight example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
    </AnimatedSection>
  );
};

export default Dancefight;
