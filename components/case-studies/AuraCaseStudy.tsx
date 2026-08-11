import React from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import AnimatedBreak from '@/components/AnimatedBreak';
import Breadcrumb from '@/components/Breadcrumb';
import CompanyMark from '@/components/CompanyMark';
import FadeUp from '@/components/FadeUp';
import Footer from '@/components/Footer';
import CaseImage from '@/components/case-studies/CaseImage';

/** Numbered chapter header — big index, lowercase title, one-line kicker. */
const ChapterHeader = ({ index, title, kicker }: { index: string; title: string; kicker: string }) => (
  <div className="col-span-full w-full lg:w-[80%] mx-auto flex items-baseline gap-5 mb-2">
    <span className="font-mono text-xl md:text-2xl font-bold text-white/30 tracking-widest">{index}</span>
    <div>
      <h2 className="text-3xl md:text-4xl font-bold lowercase">{title}</h2>
      <p className="text-white/50 text-base font-bold italic mt-1.5 text-balance">{kicker}</p>
    </div>
  </div>
);

/** The standard info card used across the folio. */
const InfoCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`info text-left text-white px-8 py-8 border-2 border-white/20 rounded-lg ${className}`}>
    {children}
  </div>
);

const bullet =
  "pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty";

const AuraCaseStudy = () => {
  return (
    <>
      <div className="fixed top-6 left-6 z-40">
        <Breadcrumb label="aura case study" />
      </div>

      {/* HERO */}
      <header className="mx-auto w-[96%] max-w-4xl px-4 pt-32 pb-16 text-center">
        <FadeUp>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.35em] text-white/50">
            case study — strangeworks
          </p>
          <h1 className="text-5xl md:text-7xl font-bold lowercase">aura</h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-9 text-white/85 text-balance">
            How we turned optimization modeling — a slow, expert-only craft — into an
            AI-assisted workflow, and what I designed and built along the way.
          </p>
        </FadeUp>
      </header>

      {/* BUILT FOR YOU — the meta block */}
      <AnimatedSection className="grid grid-cols-1 gap-12">
        <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <InfoCard>
            <div className="flex items-start gap-4 mb-4">
              <CompanyMark company="strangeworks" />
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">built for you</h2>
                <h4 className="text-white/50 text-balance text-base font-bold italic mt-1.5">
                  a case study, made the way I make product
                </h4>
              </div>
            </div>
            <div className="w-full border-b-2 border-white/20 mb-4"></div>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Hi, I&apos;m Dave. You asked for a case study ahead of the skills interview — so
              instead of a deck, I built you this page. It walks the same story I&apos;d tell in
              the room, with the real artifacts.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              It also doubles as a work sample: designed and shipped in my portfolio codebase,
              in production code.
            </p>
          </InfoCard>

          <InfoCard className="flex flex-col items-start">
            <h3 className="text-xl font-bold mt-2 mb-4 text-balance">how this page came together</h3>
            <div className="w-full border-b-2 border-white/20 mb-6"></div>
            <ul className="list-none space-y-4 w-full">
              <li className={bullet}>Spun up a git worktree off my portfolio repo and opened a draft PR</li>
              <li className={bullet}>Built the page in Next.js, Tailwind, and Framer Motion, designing in Claude Code</li>
              <li className={bullet}>Pulled the visuals straight from the original Figma boards and product repos</li>
              <li className={bullet}>Wrote, art-directed, and shipped it to kidastro.com</li>
            </ul>
          </InfoCard>
        </div>
      </AnimatedSection>

      <AnimatedBreak />

      {/* 01 RESEARCH & DISCOVERY */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="01"
          title="research &amp; discovery"
          kicker="sitting with the science team to map how optimization models actually get made"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Before Aura, building an optimization model was a hand-crafted process. A data
              scientist would research the problem, define it, formulate the math, test, and
              finally run it on compute — step by step, every time.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              The insight from discovery: the make-or-break step is problem definition. When
              the problem is defined well, everything downstream gets dramatically easier.
              That insight ended up steering the whole product.
            </p>
          </InfoCard>
        </div>
        <CaseImage
          className="col-span-1 lg:col-span-3"
          src="/imgs/strangeworks/strange2.webp"
          alt="Figma research and template library, zoomed out"
          label="research &amp; discovery"
        />
        <CaseImage
          className="col-span-1 lg:col-span-3"
          alt="Interview notes and process mapping"
          note="figma pull — zoomed-out boards of the discovery interviews / process mapping"
        />
      </AnimatedSection>

      <AnimatedBreak />

      {/* 02 WIREFRAMES & BRAINSTORMING */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="02"
          title="wireframes &amp; brainstorming"
          kicker="sketching wide before narrowing — the whole wall of ideas"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              I brainstormed the workflow in Figma — wireframing competing structures for how a
              scientist would move from a vague business problem to a running model. Zoomed out,
              the boards show the churn: dead ends, variations, and the ideas that survived.
            </p>
          </InfoCard>
        </div>
        <CaseImage
          className="col-span-full lg:col-span-6"
          alt="Zoomed-out Figma boards of wireframe explorations"
          note="figma pull — big zoomed-out artboard wall of wireframe explorations"
        />
      </AnimatedSection>

      <AnimatedBreak />

      {/* 03 THE END-TO-END FLOW */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="03"
          title="the end-to-end flow"
          kicker="refining the sketches into one connected journey"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              The explorations converged into a single end-to-end flow: research → problem
              definition → formulation → testing → compute &amp; run. Prototyped and pressure-tested
              in Figma before a line of production code.
            </p>
          </InfoCard>
        </div>
        <CaseImage
          className="col-span-full lg:col-span-6"
          src="/imgs/strangeworks/strange3.webp"
          alt="Figma flow map of the Aura app — projects, research, and formulation flows"
          label="end-to-end flow"
        />
      </AnimatedSection>

      <AnimatedBreak />

      {/* 04 BUILDING IT IN THE FRONT-END */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="04"
          title="building it in the front-end"
          kicker="from flows to a running repo — designing in production code"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              With the flow validated, we started the repo and I moved my design work into the
              front-end — building screens in production code and refining them there, where
              real data and real latency live.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Iterating in code meant every design decision shipped as a PR, not a handoff.
            </p>
          </InfoCard>
        </div>
        <CaseImage
          className="col-span-1 lg:col-span-3"
          alt="Aura repo — front-end code"
          note="screenshot — aura repo / early front-end build"
        />
        <CaseImage
          className="col-span-1 lg:col-span-3"
          alt="Early Aura UI in the browser"
          note="screenshot — early product UI, iterating in the front-end"
        />
      </AnimatedSection>

      <AnimatedBreak />

      {/* 05 BETA TESTING & ITERATION */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="05"
          title="beta testing &amp; iteration"
          kicker="our own science team as the first users"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Our science team beta-tested Aura on live client problems while we iterated.
              Their feedback tightened the loop between what the workflow promised and what a
              working scientist actually needed next.
            </p>
          </InfoCard>
        </div>
        <CaseImage
          className="col-span-full lg:col-span-6"
          src="/imgs/strangeworks/strange1.webp"
          alt="Aura — optimization job details with AI-assisted results analysis"
          label="aura in use"
        />
      </AnimatedSection>

      <AnimatedBreak />

      {/* 06 AURA 2.0 */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="06"
          title="aura 2.0 — agents"
          kicker="the leap: nail the problem definition, and agents do the rest"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              We first tried building an agent for each manual step. The real unlock was
              flipping the order: one agent works with the user until the problem definition is
              genuinely robust — then the rest of the agents build the formulation, the
              optimization model, and the tests from it.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              The insight from discovery, shipped as architecture: great problem definition
              first, automation after.
            </p>
          </InfoCard>
        </div>
        <CaseImage
          className="col-span-1 lg:col-span-3"
          alt="Aura 2.0 agent workflow"
          note="screenshot — aura 2.0 agentic problem-definition flow"
        />
        <CaseImage
          className="col-span-1 lg:col-span-3"
          alt="Aura 2.0 formulation and testing agents"
          note="screenshot — formulation / testing agents building the model"
        />
      </AnimatedSection>

      <AnimatedBreak />

      {/* 07 SHIPPED — CLIENT INTERFACES */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="07"
          title="shipped — client interfaces"
          kicker="the models become products: scheduling, routing, and more"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Once the models exist, we design custom optimization interfaces around them for
              clients — staff scheduling, vehicle routing, gate assignment — so an ops team can
              use a hard optimization model without an optimization background.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Aura is live today as the toolset behind Strangeworks&apos; optimization practice —{' '}
              <a
                href="https://strangeworks.com/technology/aura"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-(--color-2)"
              >
                see the shipped product
              </a>
              .
            </p>
          </InfoCard>
        </div>
        <CaseImage
          className="col-span-1 lg:col-span-3"
          src="/imgs/strangeworks/strange4.webp"
          alt="Client optimization apps — nurse scheduling and last-mile dispatch dashboards"
          label="client apps"
        />
        <CaseImage
          className="col-span-1 lg:col-span-3"
          alt="Gate scheduling demo UI"
          note="screenshot — gate-schedule demo / airport security client apps"
        />
      </AnimatedSection>

      <Footer />
    </>
  );
};

export default AuraCaseStudy;
