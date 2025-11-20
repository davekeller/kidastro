import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

const Puppywise = () => {
  return (
    <AnimatedSection className="puppy grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="info col-span-1 md:col-span-2 text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl max-w-3xl mx-auto mb-8">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-4xl font-bold">Puppywise</h2>
          <span className="text-sm text-white/50 mt-2">Lead Product Designer</span>
        </div>
        <h4 className="text-(--color-2) text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">A web app to find reputable breeders</h4>
        <p className="mb-4 text-lg leading-8 text-white/90">
          I consulted for this puppy breeder client, including: conception and design of their breed and breeder search UX, details views, and admin views.
        </p>
      </div>
      <div className="col-span-1 relative">
           <Image src="/imgs/puppy/puppy1.png" alt="puppy breeder" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
    </AnimatedSection>
  );
};

export default Puppywise;
