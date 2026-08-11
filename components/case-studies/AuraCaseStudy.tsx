import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import AnimatedBreak from '@/components/AnimatedBreak';
import Breadcrumb from '@/components/Breadcrumb';
import CompanyMark from '@/components/CompanyMark';
import FadeUp from '@/components/FadeUp';
import Footer from '@/components/Footer';
import CaseImage from '@/components/case-studies/CaseImage';
import SlalomMark from '@/components/case-studies/SlalomMark';
import ClientLogos, { type ClientLogo } from '@/components/case-studies/ClientLogos';
import ProcessFlow, { type FlowPhase } from '@/components/case-studies/ProcessFlow';

/* Client marks, recolored from the strangeworks.com customer set for the dark
   background. RTX is Collins Aerospace's parent company mark. */
const clients: ClientLogo[] = [
  { name: 'Johnson & Johnson', src: '/imgs/aura/clients/johnson-johnson.svg' },
  { name: 'Deloitte', src: '/imgs/aura/clients/deloitte.svg' },
  { name: 'Accenture', src: '/imgs/aura/clients/accenture.svg' },
  { name: 'BP', src: '/imgs/aura/clients/Bp.svg' },
  { name: 'RTX (Collins Aerospace)', src: '/imgs/aura/clients/rtx.svg' },
];

/* Workflows v1 as a phased flow — the manual march the agents later collapsed. */
const workflowPhases: FlowPhase[] = [
  {
    label: 'Define',
    loop: 'redefine ↔ reanalyze',
    steps: [
      { title: 'Research & discovery', detail: 'Understand the business problem and what solving it is worth.' },
      { title: 'Problem definition', detail: 'Write the problem down precisely enough to model it.' },
      { title: 'Problem analysis', detail: 'Pressure-test the definition, find the gaps, go again.' },
    ],
  },
  {
    label: 'Model',
    steps: [
      { title: 'Abstract model', detail: 'Get the variables, constraints, and weights right.' },
      { title: 'Toy data', detail: 'Skeleton datasets to instantiate the model.' },
      { title: 'Toy instance', detail: 'A concrete instance on toy data that actually runs.' },
    ],
  },
  {
    label: 'Data',
    steps: [
      { title: 'Dataset build-out', detail: 'Assemble the real data, then the long work of cleaning it.' },
      { title: 'Concrete instances', detail: 'Apply the real data to produce runnable instances.' },
    ],
  },
  {
    label: 'Run',
    steps: [
      { title: 'Solver selection', detail: 'Match the formulation to the solver — QUBOs and BQMs for quantum, HPC for the rest.' },
      { title: 'Compute & run', detail: 'Run on the hardware solvers and read the results.' },
    ],
  },
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
  "pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-(--color-2)/70 text-lg leading-snug text-white/90 text-pretty";

/** Tighter bullet for the sidebar list inside a chapter card. */
const sideBullet =
  "pl-5 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-xl before:leading-none before:text-(--color-2)/70 text-base leading-6 text-white/75 text-pretty";

/**
 * A chapter card: the narrative in the left two-thirds, and what concretely
 * happened in a bordered sidebar on the right third.
 */
const ChapterCard = ({
  children,
  asideTitle,
  items,
}: {
  children: React.ReactNode;
  asideTitle: string;
  items: string[];
}) => (
  <InfoCard>
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">{children}</div>
      <aside className="lg:col-span-1 lg:border-l-2 lg:border-white/15 lg:pl-8">
        <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
          {asideTitle}
        </h4>
        <ul className="list-none space-y-3">
          {items.map((item) => (
            <li key={item} className={sideBullet}>
              {item}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  </InfoCard>
);

const AuraCaseStudy = () => {
  return (
    <>
      <div className="fixed top-6 left-6 z-40">
        <Breadcrumb label="aura case study" />
      </div>

      {/* BUILT FOR YOU — the note that frames the case study */}
      <AnimatedSection className="grid grid-cols-1 gap-8 pt-28">
        <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <InfoCard>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src="/imgs/dave.jpg"
                  alt="Dave Keller"
                  width={96}
                  height={96}
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                  priority
                />
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
                    built for
                  </p>
                  <h2 className="mt-1 text-xl md:text-2xl font-bold text-white text-balance">
                    Lucy and the Slalom team
                  </h2>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/35">
                  August 11, 2026
                </p>
                <SlalomMark className="h-9 w-auto text-white md:h-11" />
              </div>
            </div>
            <div className="w-full border-b-2 border-white/20 mb-4"></div>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Hey Lucy, and the Slalom team: I&apos;m Dave, and I built this for you today. You
              asked for a case study or a code repository. Here&apos;s both.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              It walks the Aura story the way I&apos;d tell it in the room, and it&apos;s a work
              sample itself — designed and shipped in production code, same day.
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
            <h3 className="text-xl font-bold mt-2 text-balance">how this page came together</h3>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-(--color-2)/80">
              11:08 AM — Lucy&apos;s message lands
            </p>
            <p className="mt-1.5 mb-4 text-base text-white/60 text-pretty">
              I read it this morning. Everything below happened today.
            </p>
            <div className="w-full border-b-2 border-white/20 mb-6"></div>
            <ul className="list-none space-y-4 w-full">
              <li className={bullet}>Sketched the narrative first — the same eight beats I&apos;d walk through in an interview</li>
              <li className={bullet}>Spun up a git worktree off my portfolio repo and opened a draft PR to work in</li>
              <li className={bullet}>Built it in Next.js, Tailwind, and Framer Motion, designing in Claude Code against a live dev server</li>
              <li className={bullet}>Art-directed the visuals from the original Figma boards and the product repos themselves</li>
              <li className={bullet}>Orchestrated the whole process, reviewed the diff, and shipped it to kidastro.com the same day</li>
            </ul>
          </InfoCard>
        </div>
      </AnimatedSection>

      {/* HERO — the case study proper starts here, tight under the note */}
      <header className="mx-auto w-[96%] max-w-4xl px-4 pt-24 pb-2 text-center">
        <FadeUp>
          <div className="mb-5 flex items-center justify-center gap-3">
            <CompanyMark company="strangeworks" className="mt-0" />
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/50">
              case study
            </p>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold lowercase">strangeworks aura</h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-9 text-white/85 text-balance">
            How we turned optimization modeling — a slow, PhD-only craft — into an AI-assisted
            workflow, and what I designed and built along the way.
          </p>
        </FadeUp>
      </header>

      <AnimatedBreak />

      {/* 01 RESEARCH & DISCOVERY */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="01"
          title="research &amp; discovery"
          kicker="interviewing our own PhD consultants to map how an optimization model actually gets made"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <ChapterCard
            asideTitle="what happened"
            items={[
              'Interviewed every internal consultant — PhD physicists and a quantum ML scientist',
              'Mapped the five beats every engagement repeated by hand',
              'Wrote the project brief and vision in Notion',
              'Synthesized it into the Problem → Analysis board',
              'Landed on problem definition as the make-or-break step',
            ]}
          >
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Strangeworks is a data science consulting company. We formulate hard optimization
              problems to run on quantum, quantum-inspired, and HPC solvers, and we built the
              platform that connects a science team to the right solver.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              So discovery meant interviewing our own consultants: PhD physicists, a quantum
              machine learning scientist, people writing data science code against quantum
              hardware. Every engagement ran the same five beats, and every one was hand-built
              from scratch.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Two findings. The process repeated across clients, so it could be productized. And
              the make-or-break step was problem definition — define it well and everything
              downstream gets easier. That second one steered the whole product.
            </p>
          </ChapterCard>
        </div>
        <CaseImage
          className="col-span-1 lg:col-span-3"
          src="/imgs/aura/research1.webp"
          alt="Notion research hub — discovery workshop docs, consultant interviews, and insights"
          label="research &amp; discovery"
        />
        <CaseImage
          className="col-span-1 lg:col-span-3"
          src="/imgs/aura/research2.webp"
          alt="Problem → Analysis — phased flows and standardized formulation components in Figma"
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
          <ChapterCard
            asideTitle="what happened"
            items={[
              'Wireframed templates across the binder-to-IDE spectrum in Figma',
              'Built the artboard wall — dead ends, variations, and survivors',
              'Ran a full-day workshop at the Austin quarterly offsite',
              'Presented the product vision to the whole company',
              'Pressure-tested it live with the science team',
            ]}
          >
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              The design question was where to land on a spectrum. At one end, a digital science
              binder: a legible record of a science project anyone on the engagement could
              follow. At the other, a notebook IDE where a scientist writes real code. Too far
              toward the binder and they can&apos;t work. Too far toward the notebook and
              it&apos;s Jupyter with extra steps.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              I built templates and wireframes across that whole range in Figma. Zoomed out, the
              boards show the churn: dead ends, variations, and what survived.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Then a full-day workshop at our quarterly offsite in Austin, whole company flown
              in. I presented the vision and walked the room through the insights from
              discovery: every point in the process where we could build a tool. Having the
              science team argue with it in person is what made the direction stick.
            </p>
          </ChapterCard>
        </div>
        <CaseImage
          className="col-span-full lg:col-span-6"
          src="/imgs/aura/wireframes2.webp"
          alt="Quarterly offsite workshop board — agenda, discovery insights, and the projects UX"
          label="the offsite"
        />
        <CaseImage
          className="col-span-full lg:col-span-6"
          src="/imgs/strangeworks/strange2.webp"
          alt="Figma wireframe and flow template library, zoomed out"
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
          <ChapterCard
            asideTitle="what happened"
            items={[
              'Designed the full flow: research → definition → formulation → testing → run',
              'Placed an AI agent alongside the scientist at every step',
              'Prototyped agent behavior the models could not yet perform',
              'Pressure-tested the whole journey in Figma before any production code',
            ]}
          >
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              That vision carried the team for a good stretch. We moved into Figma and designed
              it end-to-end: research → problem definition → formulation → testing → compute and
              run, with an AI agent working the flow alongside the scientist.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              This was two years ago, well before the models could do it. Designing an
              agent-driven workflow then meant prototyping behavior that didn&apos;t exist yet
              and betting on where it was heading.
            </p>
          </ChapterCard>
        </div>
        <CaseImage
          className="col-span-full lg:col-span-6"
          src="/imgs/aura/wireframes1.webp"
          alt="End-to-end flow board — projects, research and methods, formulation, and solvers"
          label="end-to-end flow"
        />
        <CaseImage
          className="col-span-full lg:col-span-6"
          src="/imgs/strangeworks/strange3.webp"
          alt="Figma flow map of the Aura app — projects, research, and formulation flows"
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
          <ChapterCard
            asideTitle="my role"
            items={[
              'Design engineer on a team of about ten developers',
              'Led the product vision alongside the build',
              'Built the production UIs in code, not handoffs',
              'Structured the navigation and user experience',
              'Evolved the Strangeworks look and feel with our brand designer',
              'Moved from hand-written Tailwind and Cursor into Claude Code',
            ]}
          >
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              While the Figma was still warm, the dev team jumped into the app and started
              building agentic reasoning. I jumped into the code with them. We called them
              workflows back then.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Over that year, the way we built changed underneath us. Early on I was
              hand-writing HTML and Tailwind, reaching for Cursor in small doses. As Claude Code
              shipped, I moved into the terminal — and so did the rest of the team.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              We&apos;re about ten developers: AI specialists, backend, full-stack. I was the
              design engineer and led the product vision — building the UIs in code, structuring
              the navigation and UX, and evolving the Strangeworks look and feel with our brand
              designer.
            </p>
          </ChapterCard>
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
          <ChapterCard
            asideTitle="what happened"
            items={[
              'Shipped internally to our own ten-scientist consulting team',
              'Opened it to client science teams at Deloitte, Accenture, and J&J',
              'Watched untrained users work problems we had not scoped',
              'Iterated on their feedback between every step',
              'Found exactly where the linear march broke down',
            ]}
          >
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              It started internal: our own ten-scientist consulting team used it first. Then
              science teams at Deloitte, Accenture, and Johnson &amp; Johnson started building
              their own models in it — people we hadn&apos;t trained, on problems we hadn&apos;t
              scoped.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Version one, Workflows, was a long linear march. Watching it get used showed us
              exactly where the march broke down.
            </p>
          </ChapterCard>
        </div>

        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <ProcessFlow phases={workflowPhases} />
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
          <ChapterCard
            asideTitle="what changed"
            items={[
              'Dropped the agent-per-step model for a single front-loaded agent',
              'Natural-language problem in, robust definition out',
              'Agent interrogates the user until every critical gap closes',
              'Trained agents handle formulation, solvers, data, and compute',
              'Ten manual steps collapse to one that matters',
            ]}
          >
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              AI kept getting better while we built, and we ended up moving faster than our own
              roadmap. Aura 2.0 collapses the whole march. Our first instinct was an agent for
              each step — 2.0 flips it: one agent at the front, and its only job is the problem
              definition. You start in plain language; it sharpens the problem and asks
              questions until every critical gap is closed.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Once the definition is robust, the hard part is done. Trained agents take it from
              there: formulation, solver selection, data cleaning, compute, run.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Which is what the consultants told me in discovery two years earlier. The whole
              product is that one insight, built.
            </p>
          </ChapterCard>
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
          kicker="the models have to run a business, so someone has to be able to drive them"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <ChapterCard
            asideTitle="what we build"
            items={[
              'Custom operator interfaces on top of each client model',
              'Staff scheduling, vehicle routing, cargo, freight, and logistics',
              'Interactive visuals and layered navigation over hard data',
              'Built for operators with no optimization background',
            ]}
          >
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Aura 2.0 builds the model — then the model has to run a business. Staff
              scheduling, vehicle routing, cargo and freight, logistics at the scale where a
              spreadsheet stopped working years ago.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              So the last step is design work again: custom interfaces on top of the models, so
              an operator with no optimization background can drive one on a Tuesday morning. I
              designed and built a lot of these.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Aura is live today behind the Strangeworks optimization practice —{' '}
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
          </ChapterCard>
        </div>

        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <CaseImage
            src="/imgs/strangeworks/strange4.webp"
            alt="Client optimization apps — nurse scheduling and last-mile dispatch dashboards"
            label="client apps"
          />
        </div>

        {/* Lufthansa */}
        <div className="col-span-1 lg:col-span-3 self-stretch">
          <InfoCard className="h-full">
            <h3 className="text-xl font-bold mb-1">Lufthansa — gate scheduling</h3>
            <p className="text-white/50 text-sm font-bold italic mb-4">100x faster gate reallocation</p>
            <div className="w-full border-b-2 border-white/20 mb-4"></div>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              A gate agent knows things the model doesn&apos;t: a delayed flight, an aircraft
              that needs passport control, a connection about to break. They describe the
              situation to the AI, build scenarios, and re-solve the whole gate schedule.
            </p>
          </InfoCard>
        </div>
        <CaseImage
          className="col-span-1 lg:col-span-3"
          alt="Lufthansa gate scheduling interface"
          note="screenshot — Lufthansa gate scheduling: scenario chat and re-solved schedule"
        />

        {/* Deloitte / TSA */}
        <div className="col-span-1 lg:col-span-3 self-stretch">
          <InfoCard className="h-full">
            <h3 className="text-xl font-bold mb-1">Deloitte — TSA staff scheduling</h3>
            <p className="text-white/50 text-sm font-bold italic mb-4">certifications, lanes, and terminals</p>
            <div className="w-full border-b-2 border-white/20 mb-4"></div>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              We consulted for Deloitte, who were consulting for the TSA. Six terminals, multiple
              lanes each, and every lane needs the right people: general staff, an X-ray cert, a
              K9 handler. The interface schedules against all of it at once.
            </p>
          </InfoCard>
        </div>
        <CaseImage
          className="col-span-1 lg:col-span-3"
          alt="TSA staff scheduling interface"
          note="screenshot — TSA staff scheduling: terminals, lanes, and certification coverage"
        />
      </AnimatedSection>

      <AnimatedBreak />

      {/* 08 STRANGE-UI */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="08"
          title="strange-ui — the design system"
          kicker="building one client interface is a project; building dozens is a system"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <ChapterCard
            asideTitle="what it gives us"
            items={[
              'Shared components for schedules, constraints, and scenario builders',
              'Solver runs and results readable at a glance',
              'New client apps start from real components, not a blank file',
              'On brand and production-ready from the first commit',
            ]}
          >
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Every client operation is different, but the pieces repeat: schedules, constraints,
              scenario builders, solver runs, results readable at a glance.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              So we built Strange-UI, our design system for optimization interfaces. A new client
              app starts from real components, on brand and production-ready from the first
              commit. It&apos;s why the last step of this process is fast.
            </p>
          </ChapterCard>
        </div>
        <CaseImage
          className="col-span-1 lg:col-span-3"
          alt="Strange-UI component library"
          note="screenshot — Strange-UI components / library overview"
        />
        <CaseImage
          className="col-span-1 lg:col-span-3"
          alt="Strange-UI patterns in use across client apps"
          note="screenshot — Strange-UI patterns composed into a client interface"
        />
      </AnimatedSection>

      <AnimatedBreak />

      {/* CLOSING — bookends the built-for-you block */}
      <AnimatedSection className="grid grid-cols-1 gap-12">
        <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <InfoCard>
            <h2 className="text-3xl md:text-4xl font-bold lowercase">what it added up to</h2>
            <h4 className="text-white/50 text-balance text-base font-bold italic mt-1.5 mb-4">
              an internal process, turned into a product, turned back into client work
            </h4>
            <div className="w-full border-b-2 border-white/20 mb-4"></div>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              We built an app that builds optimization models, and a design system for the
              client interfaces that run them. Then we sit with each client and design the real
              thing — interactive visuals, layered navigation, data laid out to be read — so
              somebody on the ground in operations can run their day with it.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              A process we learned from our own consultants, turned into a product, turned back
              into how we serve clients. Full circle.
            </p>
          </InfoCard>

          <InfoCard className="flex flex-col items-start">
            <h3 className="text-xl font-bold mt-2 mb-4 text-balance">what I did on it</h3>
            <div className="w-full border-b-2 border-white/20 mb-6"></div>
            <ul className="list-none space-y-4 w-full">
              <li className={bullet}>Ran the discovery that surfaced the insight the whole product is built on</li>
              <li className={bullet}>Presented the product vision to the company and got the science team behind it</li>
              <li className={bullet}>Designed the end-to-end agent flow two years before the models could run it</li>
              <li className={bullet}>Built the UIs in production code alongside a ten-person dev team</li>
              <li className={bullet}>Led the product vision from research through the 2.0 the company ships today</li>
              <li className={bullet}>Helped build Strange-UI, the design system behind every client interface</li>
            </ul>
          </InfoCard>
        </div>
      </AnimatedSection>

      {/* SIGN-OFF */}
      <FadeUp className="w-full">
        <div className="mx-auto w-[96%] max-w-2xl px-4 pt-20 pb-8 text-center">
          <p className="text-2xl md:text-3xl font-bold lowercase text-balance">
            that&apos;s the story. I&apos;d love to tell you the parts that didn&apos;t fit —
          </p>
          <p className="mt-3 text-xl text-white/70">you&apos;ve got my number.</p>
        </div>
      </FadeUp>

      <Footer />
    </>
  );
};

export default AuraCaseStudy;
