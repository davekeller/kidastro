import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

// Compact section: a consulting engagement, so one card and two images
// instead of the full description + highlights treatment.
const OpenCourt = () => {
  return (
    <AnimatedSection className="opencourt grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 items-start">
      <div className="info col-span-full w-full text-left text-white px-8 py-8 border-2 border-white/10 rounded-md max-w-3xl mx-auto mb-12">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-4xl font-bold">OpenCourt</h2>
          <span className="text-xl font-bold text-right mt-2">Product Design Consultant</span>
        </div>
        <h4 className="text-(--color-5) text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">A multi-platform app for booking courts, events, and open play at pickleball clubs</h4>
        <p className="mb-4 text-lg leading-8 text-white/90">
          A six-month consulting engagement focused on the iOS app, delivered through Figma, Loom walkthroughs, and Zoom design reviews. I designed flows for booking courts, player profiles, creating and inviting to events, and checkout with add-on extras.
        </p>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
         <Image src="/imgs/opencourt/opencourt1.png" alt="OpenCourt court booking and player profile screens" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
         <Image src="/imgs/opencourt/opencourt2.png" alt="OpenCourt event invites, add-on extras, and checkout screens" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

    </AnimatedSection>
  );
};

export default OpenCourt;
