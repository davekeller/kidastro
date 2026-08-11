import React from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import AnimatedBreak from '@/components/AnimatedBreak';
import Breadcrumb from '@/components/Breadcrumb';
import CompanyMark from '@/components/CompanyMark';
import FadeUp from '@/components/FadeUp';
import Footer from '@/components/Footer';
import CaseImage from '@/components/case-studies/CaseImage';
import ClientLogos, { type ClientLogo } from '@/components/case-studies/ClientLogos';
import ProcessSteps, { type ProcessStep } from '@/components/case-studies/ProcessSteps';

/* Clients whose science teams the work was built for. Drop logo SVGs into
   /public/imgs/aura/clients/ and add `src` to swap a wordmark for real art. */
const clients: ClientLogo[] = [
  { name: 'Johnson & Johnson' },
  { name: 'Deloitte' },
  { name: 'Accenture' },
  { name: 'BP' },
  { name: 'Collins Aerospace' },
];

/* Workflows v1 — the manual process, before the agents collapsed it. */
const workflowSteps: ProcessStep[] = [
  { title: 'Research & discovery', detail: 'Understand the business problem and what solving it is worth.' },
  { title: 'Problem definition', detail: 'Write the problem down precisely enough to model it.' },
  {
    title: 'Problem analysis',
    detail: 'Pressure-test the definition, find the gaps, redefine, analyze again.',
    loops: true,
  },
  {
    title: 'Abstract model',
    detail: 'Get the variables, constraints, and weights right against abstract data.',
  },
  { title: 'Toy data', detail: 'Skeleton datasets to instantiate the model and see if it holds up.' },
  { title: 'Toy instance', detail: 'Build a concrete instance on toy data and make it actually run.' },
  { title: 'Dataset build-out', detail: 'Assemble the real data, then the long work of cleaning it.' },
  { title: 'Concrete instances', detail: 'Apply the real data to the model to produce runnable instances.' },
  {
    title: 'Solver selection',
    detail: 'Match the formulation to the solver — QUBOs and BQMs for quantum, HPC for the rest.',
  },
  { title: 'Compute & run', detail: 'Run the instances on the selected hardware solvers and read the results.' },
];

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
            How we turned optimization modeling — a slow, PhD-only craft — into an AI-assisted
            workflow, and what I designed and built along the way.
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
                  made for Slalom — August 11, 2026
                </h4>
              </div>
            </div>
            <div className="w-full border-b-2 border-white/20 mb-4"></div>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Hi, I&apos;m Dave. Lucy — this morning you passed along that the Slalom team wanted
              a case study or a code repository, something that shows my process. Here&apos;s
              both. This page walks the Aura story the way I&apos;d tell it in the room, and
              it&apos;s a work sample itself: designed and shipped in production code, same day.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              The{' '}
              <a
                href="https://github.com/davekeller/kidastro/pull/51"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-(--color-2)"
              >
                pull request that built it
              </a>{' '}
              is open — commits, diffs, and all.
            </p>
          </InfoCard>

          <InfoCard className="flex flex-col items-start">
            <h3 className="text-xl font-bold mt-2 mb-4 text-balance">how this page came together</h3>
            <div className="w-full border-b-2 border-white/20 mb-6"></div>
            <ul className="list-none space-y-4 w-full">
              <li className={bullet}>Sketched the narrative first — the same seven beats I&apos;d walk through in an interview</li>
              <li className={bullet}>Spun up a git worktree off my portfolio repo and opened a draft PR to work in</li>
              <li className={bullet}>Built it in Next.js, Tailwind, and Framer Motion, designing in Claude Code against a live dev server</li>
              <li className={bullet}>Art-directed the visuals from the original Figma boards and the product repos themselves</li>
              <li className={bullet}>Wrote every word, reviewed the diff, and shipped it to kidastro.com the same day</li>
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
          kicker="interviewing our own PhD consultants to map how an optimization model actually gets made"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Strangeworks is a data science consulting company. We take on hard optimization
              problems and formulate them to run on quantum, quantum-inspired, and HPC solvers,
              and we built the platform that connects a science team to the right solver for
              their formulation type.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              So discovery meant interviewing our own consultants: PhD physicists, a quantum
              machine learning scientist, people writing production data science code against
              quantum hardware. Every engagement ran the same five beats: research, problem
              definition, formulation, testing, then compute and run. Every one was hand-built
              from scratch.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Two things came out of that. The process repeated across clients, which meant it
              could be refined and productized. And the make-or-break step was problem
              definition — define it well and everything downstream gets dramatically easier.
              That second insight ended up steering the whole product.
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
          kicker="finding the line between a digital science binder and a full data science IDE"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              The central design question was where to land on a spectrum. At one end, a digital
              science binder: a structured, legible record of a science project that anyone on
              the engagement could follow. At the other, a full notebook IDE where a data
              scientist writes real code. Too far toward the binder and the scientists
              can&apos;t actually work. Too far toward the notebook and it&apos;s Jupyter with
              extra steps.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              I built templates and wireframes across that whole range in Figma. Zoomed out, the
              boards show the churn: dead ends, variations, and the handful of ideas that
              survived.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              None of it was a solo exercise. It ran through months of meetings and then a
              full-day workshop at our quarterly offsite in Austin, with the whole company flown
              in. I presented the product vision there and walked the room through the insights
              I&apos;d pulled out of discovery: every point in the process where we could build a
              tool. Having the science team argue with it in person is what made the direction
              stick.
            </p>
          </InfoCard>
        </div>
        <CaseImage
          className="col-span-full lg:col-span-6"
          alt="The insights screen — every point in the process where a tool could be built"
          label="the insights"
          note="figma pull — the insights screen presented at the Austin offsite"
        />
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
          kicker="designing an agent-run workflow in Figma, before the models could actually run it"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              The workshop landed, and that vision carried the team for a good stretch after. We
              moved into Figma and designed the thing end-to-end: research → problem definition
              → formulation → testing → compute and run, with an AI agent working the flow
              alongside the scientist.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              This was two years ago, well before the models could actually do it. Designing an
              agent-driven workflow then meant prototyping behavior that didn&apos;t exist yet
              and betting on where it was heading. All of it pressure-tested in Figma, long
              before a line of production code.
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
          kicker="into the repo with the dev team, as the tooling changed underneath us"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              While the Figma work was still warm, the dev team jumped straight into the app and
              started building agentic reasoning, with the front-end going up alongside it. I
              jumped into the code with them. We called them workflows back then.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              That ran for about a year, and the way we built changed underneath us. Early on it
              was mostly hand-written code — I was writing front-end HTML and Tailwind, reaching
              for Cursor in small doses. As Claude got better and Claude Code shipped, I moved
              into the terminal, and so did the rest of the team.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              We&apos;re about ten developers: AI specialists, backend, full-stack, and one other
              full-stack developer focused on the front-end. I was the design engineer on that
              team and led the product vision — designing where it was going, building the UIs in
              code, structuring the navigation and the user experience, and working with our
              brand designer to bring the Strangeworks look and feel into the product and evolve
              it as we went.
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
          kicker="our own consultants first, then our clients' science teams"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              It started as an internal app. Our own consulting team — about ten scientists who
              run these engagements for client science teams — used it first, testing whether it
              actually helped in the gaps between steps.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Then it went outside. Science teams at Deloitte, Accenture, and Johnson &amp;
              Johnson started building and testing their own models in it. That was the real
              proof: people we hadn&apos;t trained, on problems we hadn&apos;t scoped.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Version one was called Workflows, and it was a long linear march. Watching it get
              used showed us exactly where the march broke down.
            </p>
          </InfoCard>
        </div>

        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <ProcessSteps steps={workflowSteps} />
        </div>

        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <p className="mb-2 text-center font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            science teams building models in it
          </p>
          <ClientLogos clients={clients} />
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
          kicker="one agent to get the problem definition right; trained agents do the rest"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <InfoCard>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              While we were building Workflows, the models kept getting better, and we ended up
              moving faster than our own roadmap. What exists today is Aura 2.0, and it collapses
              that whole linear march.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Our first instinct had been an agent for each step. 2.0 flips it. There&apos;s one
              agent at the front, and its only job is the problem definition. You start with the
              problem in plain language. It refines that into something sharper, then asks
              questions until every critical gap is closed.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Once the definition is genuinely robust, the hard part is done. We trained the
              agents to take it from there: formulation, solver selection, data cleaning,
              compute, run. Every step past understanding the problem.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Which is what the consultants told me in discovery two years earlier. The whole
              product is that one insight, built.
            </p>
          </InfoCard>
        </div>
        <CaseImage
          className="col-span-1 lg:col-span-3"
          alt="Aura 2.0 — refining a natural-language problem into a robust definition"
          note="screenshot — the problem-definition agent: natural language in, gaps closed"
        />
        <CaseImage
          className="col-span-1 lg:col-span-3"
          alt="Aura 2.0 — agents building formulation, model, and solver selection"
          note="screenshot — agents running formulation / solver selection / compute"
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
