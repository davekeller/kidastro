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

      <AnimatedBreak />

      {/* QUOTAPATH */}
      <QuotaPath />

      <AnimatedBreak />

      {/* OPENCOURT */}
      <OpenCourt />

      <AnimatedBreak />

      {/* RODIO */}
      <Rodio />

      <AnimatedBreak />

      {/* BNB */}
      <BnbFinder />

      <AnimatedBreak />

      <FadeUp>
        <Accomplishments />
      </FadeUp>

      <AnimatedBreak />

      {/* ROCKET */}
      <Rocket />

      <AnimatedBreak />

      {/* DANCEFIGHT */}
      <Dancefight />

      <AnimatedBreak />

      {/* TIMEBOMB */}
      <Timebomb />

      <AnimatedBreak />

      {/* A little personality */}
      <FadeUp className="w-full">
        <AboutPhotos />
      </FadeUp>

      <Footer />
    </main>
  );
}
