import React from 'react';
import Intro from '@/components/Intro';
import Rodio from '@/components/Rodio';
import Quotapath from '@/components/Quotapath';
import Bnbfinder from '@/components/Bnbfinder';
import Rocket from '@/components/Rocket';
import Timebomb from '@/components/Timebomb';
import Puppywise from '@/components/Puppywise';
import Dancefight from '@/components/Dancefight';
import AnimatedBreak from '@/components/AnimatedBreak';
import Accomplishments from '@/components/Accomplishments';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-x-hidden z-10">
      <Intro />

      {/* QUOTAPATH */}
      <Quotapath />

      <AnimatedBreak />

      {/* RODIO */}
      <Rodio />

      <AnimatedBreak />

      {/* BNB */}
      <Bnbfinder />

      <AnimatedBreak />

      <Accomplishments />

      <AnimatedBreak />

      {/* ROCKET */}
      <Rocket />

      <AnimatedBreak />

      {/* TIMEBOMB */}
      <Timebomb />

      <AnimatedBreak />

      {/* PUPPYWISE */}
      <Puppywise />

      <AnimatedBreak />

      {/* DANCEFIGHT */}
      <Dancefight />

      <Footer />
    </main>
  );
}
