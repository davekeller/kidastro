import React from 'react';
import Intro from '@/components/Intro';
import Rodio from '@/components/Rodio';
import QuotaPath from '@/components/Quotapath';
import BnbFinder from '@/components/Bnbfinder';
import Rocket from '@/components/Rocket';
import Timebomb from '@/components/Timebomb';
import Dancefight from '@/components/Dancefight';
import AnimatedBreak from '@/components/AnimatedBreak';
import Accomplishments from '@/components/Accomplishments';
import Footer from '@/components/Footer';
import PageToggle from '@/components/PageToggle';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-x-hidden z-10">
      <div className="w-full pt-8 pb-4 sticky top-0 z-40">
        <PageToggle />
      </div>
      <Intro />

      {/* QUOTAPATH */}
      <QuotaPath />

      <AnimatedBreak />

      {/* RODIO */}
      <Rodio />

      <AnimatedBreak />

      {/* BNB */}
      <BnbFinder />

      <AnimatedBreak />

      <Accomplishments />

      <AnimatedBreak />

      {/* ROCKET */}
      <Rocket />

      <AnimatedBreak />

      {/* TIMEBOMB */}
      <Timebomb />

      <AnimatedBreak />

      {/* DANCEFIGHT */}
      <Dancefight />

      <Footer />
    </main>
  );
}
