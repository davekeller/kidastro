import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import CompanyMark from '@/components/CompanyMark';

// Compact section: a consulting engagement, so one card and two images
// instead of the full description + highlights treatment.
const OpenCourt = () => {
  return (
    <AnimatedSection className="opencourt grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 items-start">
      <div className="info col-span-full w-full text-left text-white px-8 py-8 border-2 border-white/20 rounded-lg max-w-3xl mx-auto mb-12">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">OpenCourt</h2>
            <p className="text-lg font-bold mt-1">Product Design Consultant</p>
            <h4 className="text-white/50 text-balance text-base font-bold italic mt-1.5">A multi-platform app for booking courts, events, and open play at pickleball clubs</h4>
          </div>
          <CompanyMark company="opencourt" />
        </div>
        <div className="w-full border-b-2 border-white/20 mb-4"></div>
        <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
          A six-month consulting engagement focused on the iOS app, delivered through Figma, Loom walkthroughs, and Zoom design reviews. I designed flows for booking courts, creating events and inviting players, checkout with add-ons, player profiles, and more.
        </p>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
         <Image src="/imgs/opencourt/opencourt1.webp" alt="OpenCourt court booking and player profile screens" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
         <Image src="/imgs/opencourt/opencourt2.webp" alt="OpenCourt event invites, add-on extras, and checkout screens" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

    </AnimatedSection>
  );
};

export default OpenCourt;
