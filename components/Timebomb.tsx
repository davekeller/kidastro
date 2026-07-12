import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import CompanyMark from '@/components/CompanyMark';

const Timebomb = () => {
  return (
    <AnimatedSection className="tmb grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
      <div className="info col-span-1 md:col-span-3 text-left text-white px-8 py-8 border-2 border-white/20 rounded-lg max-w-3xl mx-auto mb-12">
        <div className="flex items-start gap-4 mb-4">
          <CompanyMark company="timebomb" />
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Timebomb</h2>
            <p className="text-lg font-bold mt-1">Co-Founder + Lead Product Designer</p>
            <h4 className="text-white/50 text-balance text-base font-bold italic mt-1.5">A conditional messaging app</h4>
          </div>
        </div>
        <div className="w-full border-b-2 border-white/20 mb-4"></div>
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
