import React from 'react';
import Intro from '@/components/Intro';
import OpenCourt from '@/components/Opencourt';
import Strangeworks from '@/components/Strangeworks';
import Rodio from '@/components/Rodio';
import QuotaPath from '@/components/Quotapath';
import BnbFinder from '@/components/Bnbfinder';
import Rocket from '@/components/Rocket';
import Timebomb from '@/components/Timebomb';
import Dancefight from '@/components/Dancefight';
import AnimatedBreak from '@/components/AnimatedBreak';
import Accomplishments from '@/components/Accomplishments';
import AboutPhotos from '@/components/AboutPhotos';
import FadeUp from '@/components/FadeUp';
import Footer from '@/components/Footer';

export const metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-x-hidden z-10">
      <Intro />

      {/* STRANGEWORKS */}
      <Strangeworks />

      <AnimatedBreak mark={1} />

      {/* QUOTAPATH */}
      <QuotaPath />

      <AnimatedBreak mark={2} />

      {/* OPENCOURT */}
      <OpenCourt />

      <AnimatedBreak mark={3} />

      {/* RODIO */}
      <Rodio />

      <AnimatedBreak mark={4} />

      {/* BNB */}
      <BnbFinder />

      <AnimatedBreak mark={5} />

      <FadeUp>
        <Accomplishments />
      </FadeUp>

      <AnimatedBreak mark={6} />

      {/* ROCKET */}
      <Rocket />

      <AnimatedBreak mark={7} />

      {/* DANCEFIGHT */}
      <Dancefight />

      <AnimatedBreak mark={8} />

      {/* TIMEBOMB */}
      <Timebomb />

      <AnimatedBreak mark={9} />

      {/* A little personality */}
      <FadeUp className="w-full">
        <AboutPhotos />
      </FadeUp>

      <Footer />
    </main>
  );
}
