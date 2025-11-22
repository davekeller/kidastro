import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

const Timebomb = () => {
  return (
    <AnimatedSection className="tmb grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
      <div className="info col-span-1 md:col-span-3 text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl max-w-3xl mx-auto mb-12">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-4xl font-bold">Timebomb</h2>
          <span className="text-sm text-white/50 mt-2">Lead Product Designer</span>
        </div>
        <h4 className="text-(--color-1) text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">A conditional messaging app</h4>
        <p className="mb-4 text-lg leading-8 text-white/90">
          I Co-Founded and led design for this conditional messaging app (native iOS and Android) from whiteboard sketches through a 2.0 release with a team of 10.
        </p>
        <p className="mb-4 text-lg leading-8 text-white/90">
          The hip and user-friendly experience helped us raise two investment rounds with some big name investors and marketing partners.
        </p>
      </div>
       <div className="col-span-1 relative">
          <Image src="/imgs/tmb/tmb1.jpg" alt="tmb website" width={800} height={600} className="w-full rounded shadow-2xl" />
       </div>
      <div className="col-span-1 relative">
          <Image src="/imgs/tmb/tmb2.jpg" alt="timebomb website" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
    </AnimatedSection>
  );
};

export default Timebomb;
