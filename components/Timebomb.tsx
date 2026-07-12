import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import CompanyMark from '@/components/CompanyMark';

const Timebomb = () => {
  return (
    <AnimatedSection className="tmb grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
      <div className="info col-span-1 md:col-span-3 text-left text-white px-8 py-8 border-2 border-white/10 rounded-lg max-w-3xl mx-auto mb-12">
        <div className="flex flex-col items-start gap-4 mb-4 md:flex-row md:justify-between">
          <div className="flex items-start gap-4">
            <CompanyMark company="timebomb" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Timebomb</h2>
              <h4 className="text-white/50 text-balance text-lg font-bold italic">A conditional messaging app</h4>
            </div>
          </div>
          <span className="text-xl font-bold text-balance shrink-0 md:text-right md:mt-2">Co-Founder + Lead Product Designer</span>
        </div>
        <div className="w-full border-b-2 border-white/10 mb-4"></div>
        <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
          I co-founded this messaging app and led design from whiteboard sketches through a 2.0 release. Native iOS and Android, team of 10.
        </p>
        <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
          The product helped us raise $3M from angels including Katy Perry and Warner Bros., and land a marketing partnership with Ellen.
        </p>
      </div>
       <div className="col-span-1 md:col-span-3 lg:w-5/6 lg:ml-auto relative">
          <Image src="/imgs/tmb/tmb1.webp" alt="tmb website" width={800} height={600} className="w-full rounded shadow-2xl" />
       </div>
      <div className="col-span-1 md:col-span-3 relative">
          <Image src="/imgs/tmb/tmb2.webp" alt="timebomb website" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
    </AnimatedSection>
  );
};

export default Timebomb;
