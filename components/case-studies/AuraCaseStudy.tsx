import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import AnimatedBreak from '@/components/AnimatedBreak';
import Breadcrumb from '@/components/Breadcrumb';
import CompanyMark from '@/components/CompanyMark';
import FadeUp from '@/components/FadeUp';
import Footer from '@/components/Footer';
import Icosahedron from '@/components/Icosahedron';
import CaseImage from '@/components/case-studies/CaseImage';
import ClientLogos, { type ClientLogo } from '@/components/case-studies/ClientLogos';
import ProcessFlow, { type FlowPhase } from '@/components/case-studies/ProcessFlow';

/**
 * Who the page is addressed to. Omit it for the standalone case study at
 * /case-studies/strangeworks — the page then opens on the title, leads with an
 * At a Glance card, and closes on a plain sign-off. Pass one (see
 * /case-studies/for-slalom) and the page gains a greeting, a "made for" mark in
 * the corner, a closing note to that team, and the "built this for you today"
 * framing: the How This Page Came Together card and the link to the PR behind
 * it. That framing is deliberately addressed-only — on the standalone page the
 * subject is Aura, not the page itself.
 */
export type CaseStudyAudience = {
  /** Named in the opening and closing headings, e.g. "Lucy and the Slalom Team". */
  name: string;
  /** Their mark, shown top-right beside the date it was built. */
  mark: React.ReactNode;
  /** The day it was made for them, e.g. "August 11, 2026". */
  date: string;
};

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

/** Numbered chapter header — big index, title, one-line kicker. */
const ChapterHeader = ({ index, title, kicker }: { index: string; title: string; kicker: string }) => (
  <div className="col-span-full w-full lg:w-[80%] mx-auto flex items-baseline gap-5 mb-2">
    <span className="font-mono text-xl md:text-2xl font-bold text-white/30 tracking-widest">{index}</span>
    <div>
      <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      <p className="text-white/50 text-base font-normal italic mt-1.5 text-balance">{kicker}</p>
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
  "pl-5 relative before:content-['+'] before:absolute before:left-0 before:top-px before:font-bold before:text-base before:leading-5 before:text-(--color-2)/70 text-[0.9rem] leading-5 text-white/75 text-pretty";

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
        <ul className="list-none space-y-2">
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

const AuraCaseStudy = ({ audience }: { audience?: CaseStudyAudience }) => {
  /* Without an audience the title block is the page's hero, so it carries the
     top padding and a little more air beneath it before the intro cards. */
  const Title = audience ? 'h2' : 'h1';

  return (
    <>
      <div className="fixed top-6 left-6 z-40">
        <Breadcrumb label="aura case study" />
      </div>

      {/* Date + audience mark opposite the breadcrumb — scrolls with the page so
          it never overlaps the case images */}
      {audience && (
        <div className="absolute top-6 right-6 z-40 hidden items-center gap-3 sm:flex">
          <div className="flex flex-col items-end gap-0 text-right font-mono text-[0.7rem] leading-tight uppercase tracking-[0.1em] text-white/55">
            <span>{audience.date}</span>
            <span>Made for</span>
          </div>
          {audience.mark}
        </div>
      )}

      {/* BUILT FOR YOU — the note that frames the case study, when it's addressed */}
      <AnimatedSection
        className={`grid grid-cols-1 gap-8 ${
          audience ? 'pt-38 lg:pt-46' : 'pt-24 lg:pt-28'
        }`}
      >
        {audience && (
          <>
            <div className="col-span-full mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 text-center">
              <Image
                src="/imgs/dave.jpg"
                alt="Dave Keller"
                width={96}
                height={96}
                className="h-20 w-20 shrink-0 rounded-full object-cover md:h-24 md:w-24"
                priority
              />
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance">
                  Hey {audience.name}.{' '}
                  <span className="block">I&apos;m Dave, and I built this for you today.</span>
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-xl leading-8 text-white/75 text-balance">
                  You asked for a case study or a code repository. Here&apos;s both.
                </p>
              </div>
            </div>

            <AnimatedBreak tight />
          </>
        )}

        {/* CASE STUDY TITLE — sits above the intro cards */}
        <div
          className={`col-span-full mx-auto w-[96%] max-w-4xl px-4 text-center ${
            audience ? 'pt-2 pb-8' : 'pb-12'
          }`}
        >
          {/* Standalone: the folio's icosahedron opens the page, bookending the
              one above the sign-off. The addressed copy leads with the photo. */}
          {!audience && (
            <div className="mb-4 flex justify-center">
              <Icosahedron variant="icon" />
            </div>
          )}
          <div className="mb-5 flex items-center justify-center gap-3">
            <CompanyMark company="strangeworks" className="mt-0" />
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/50">
              case study
            </p>
          </div>
          <Title className="text-5xl md:text-7xl font-bold">Strangeworks Aura</Title>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-9 text-white/85 text-balance">
            How we turned optimization modeling — a slow, PhD-only craft — into an AI-assisted
            workflow, and what I designed and built along the way.
          </p>
        </div>

        <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <InfoCard>
            <p className="mt-2 mb-4 text-lg leading-8 text-white/90 text-pretty">
              Aura is Strangeworks&apos; proprietary toolset for solving complex optimization
              challenges: an agentic process science teams work through to take a problem from
              precise definition to production deployment. Around it sit Strange-UI, our design
              system, and the custom client apps it powers. I&apos;ve led design across all of it
              for the last two years — from the first discovery interview to the production code
              shipping today.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              It&apos;s also where I became a design engineer in practice: designing the thing,
              then building it in the front-end myself, and learning to work frontier models into
              how apps actually get made.
            </p>
            {audience ? (
              <>
                <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
                  This page walks that story the way I&apos;d tell it in the room, and it&apos;s a
                  work sample itself — designed and shipped in production code, same day.
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
                  is public — commits, diffs, and all.
                </p>
              </>
            ) : (
              <p className="text-lg leading-8 text-white/90 text-pretty">
                What follows is that story the way I&apos;d tell it in the room: the research it
                started from, the vision it turned into, and the product shipping today.
              </p>
            )}
          </InfoCard>

          {audience ? (
            <InfoCard className="flex flex-col items-start">
              <h3 className="text-xl font-bold mt-2 text-balance">How This Page Came Together</h3>
              <p className="mt-1.5 mb-4 text-base text-white/60 text-pretty">
                I read your message this morning. Everything below happened today.
              </p>
              <div className="w-full border-b-2 border-white/20 mb-6"></div>
              <ul className="list-none space-y-4 w-full">
                <li className={bullet}>Sketched the narrative first — the same five beats I&apos;d walk through in an interview</li>
                <li className={bullet}>Spun up a git worktree off my portfolio repo and opened a draft PR to work in</li>
                <li className={bullet}>Built it in Next.js, Tailwind, and Framer Motion, designing in Claude Code against a live dev server</li>
                <li className={bullet}>Designed and built every visual in Figma, from the original product boards and the repos themselves</li>
                <li className={bullet}>Orchestrated the whole process, reviewed the diff, and shipped it to kidastro.com the same day</li>
              </ul>
            </InfoCard>
          ) : (
            <InfoCard className="flex flex-col items-start">
              <h3 className="text-xl font-bold mt-2 text-balance">At a Glance</h3>
              <p className="mt-1.5 mb-4 text-base text-white/60 text-pretty">
                Role, team, and where Aura stands today.
              </p>
              <div className="w-full border-b-2 border-white/20 mb-6"></div>
              <ul className="list-none space-y-4 w-full">
                <li className={bullet}>Principal Product Designer &amp; Design Engineer, leading design across Aura, Strange-UI, and the client apps</li>
                <li className={bullet}>Two years in — from the first discovery interview to the 2.0 shipping today</li>
                <li className={bullet}>Embedded with about ten developers and our own science team of PhD consultants</li>
                <li className={bullet}>Designed in Figma, then built in the repo with Tailwind, Cursor, and Claude Code</li>
                <li className={bullet}>In production with science teams at Deloitte, Accenture, and Johnson &amp; Johnson</li>
              </ul>
            </InfoCard>
          )}
        </div>
      </AnimatedSection>

      <AnimatedBreak tight />

      {/* 01 RESEARCH & DISCOVERY */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="01"
          title="Research &amp; Discovery"
          kicker="Interviewing our own PhD consultants to map how an optimization model actually gets made"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <ChapterCard
            asideTitle="what happened"
            items={[
              'Sat with every internal consultant on the science team',
              'Mapped the process every engagement repeated by hand',
              'Wrote the project brief and vision in Notion',
              'Synthesized it into the Problem → Analysis board',
              'Landed on problem definition as the make-or-break step',
            ]}
          >
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Strangeworks formulates hard optimization problems for quantum, quantum-inspired,
              and HPC solvers. Discovery meant interviewing our own consultants: PhD physicists,
              a quantum ML scientist, people writing data science code against quantum hardware.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Two findings. The process repeated across clients, so it could be productized. And
              the make-or-break step was problem definition — that one steered the whole product.
            </p>
          </ChapterCard>
        </div>
        <CaseImage
          className="col-span-1 lg:col-span-3"
          src="/imgs/aura/research1-v3.webp"
          alt="Notion research hub — discovery workshop docs, consultant interviews, and insights"
        />
        <CaseImage
          className="col-span-1 lg:col-span-3"
          src="/imgs/aura/research2-v5.webp"
          alt="Problem → Analysis — phased flows and standardized formulation components in Figma"
        />
      </AnimatedSection>

      <AnimatedBreak />

      {/* 02 WIREFRAMES & BRAINSTORMING */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="02"
          title="Workshops &amp; Wireframes"
          kicker="Finding the line between a digital science binder and a full data science IDE"
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
              The design question was where to land on a spectrum: a digital science binder at
              one end, a notebook IDE at the other. Too far toward the binder and scientists
              can&apos;t work. Too far toward the notebook and it&apos;s Jupyter with extra steps.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              I wireframed across that whole range, then presented the vision at our quarterly
              offsite in Austin. Having the science team argue with it in person is what made
              the direction stick.
            </p>
          </ChapterCard>
        </div>
        <CaseImage
          className="col-span-1 lg:col-span-3"
          src="/imgs/aura/wireframes-painpoints-v3.webp"
          alt="Sci Workflow board — pain points and opportunities across every phase, and the offsite deck"
        />
        <CaseImage
          className="col-span-1 lg:col-span-3"
          src="/imgs/aura/wireframes-flow-v3.webp"
          alt="Prototype flow board — projects, research and methods, formulation, and solvers"
        />
      </AnimatedSection>

      <AnimatedBreak />

      {/* 03 BUILDING IT IN THE FRONT-END (with beta testing folded in) */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="03"
          title="Building It in the Front-End"
          kicker="Straight into the repo, so our scientists could use it while we iterated"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <ChapterCard
            asideTitle="my role"
            items={[
              'Design engineer on a team of about ten developers',
              'Led the product vision alongside the build',
              'Built the production UIs in code, not handoffs',
              'Structured the navigation and user experience',
              'Moved from hand-written Tailwind and Cursor into Claude Code',
              'Shipped to our own scientists first, then client science teams',
              'Turned their feedback around in the same repo, same week',
            ]}
          >
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              The dev team jumped into the app building agentic reasoning, and I jumped into the
              code with them. The app was called Workflows back then — it became Aura later.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Going straight to the front-end is what made the loop fast. Our own ten-scientist
              consulting team used it while we built, then science teams at Deloitte, Accenture,
              and Johnson &amp; Johnson built their own models in it — people we hadn&apos;t
              trained, on problems we hadn&apos;t scoped. Their feedback landed back in the repo
              the same week.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              Version one, Workflows, was a long linear march. Watching it get used showed us
              exactly where it broke down.
            </p>
          </ChapterCard>
        </div>

        <CaseImage
          className="col-span-full lg:col-span-6"
          src="/imgs/aura/frontend-v3.webp"
          alt="Workflows running in the front-end — the app the science team used"
        />

        <div className="col-span-full w-full lg:w-[80%] mx-auto mt-12">
          <ProcessFlow phases={workflowPhases} />
        </div>
      </AnimatedSection>

      <AnimatedBreak />

      {/* 04 AURA 2.0 */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="04"
          title="Aura 2.0 — Agentic Advancements"
          kicker="Working the problem back and forth with an agent until the definition holds"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <ChapterCard
            asideTitle="what changed"
            items={[
              'Simplified as the agents improved, rather than adding surface',
              'Dropped agent-per-step for one problem analysis agent',
              'User and agent work back and forth until the definition holds',
              'Everything after that runs and reports itself',
              'Shipping today — it builds the optimization models',
            ]}
          >
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              A year of beta testing showed us where users got stuck, and as the agents got
              better we jumped ahead of our own roadmap. 2.0 simplifies the whole thing, problem
              definition through to run.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Our first instinct was an agent per step. 2.0 flips it: the user works back and
              forth with a problem analysis agent until the definition genuinely holds.
              That&apos;s where the effort goes now. After that, the interface is mostly showing
              what&apos;s happening — formulation, solver selection, data cleaning, compute, run.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              This is the end product, building optimization models today. And it&apos;s what the
              consultants told me in discovery two years earlier: the whole thing is that one
              insight, built.
            </p>
          </ChapterCard>
        </div>
        <CaseImage
          className="col-span-full lg:col-span-6"
          src="/imgs/strangeworks/strange1.webp"
          alt="Aura 2.0 — the problem-definition agent and AI-assisted results analysis"
        />

        {/* Sits under 2.0 rather than under v1 — these are the teams building in
            the product as it ships today. */}
        <div className="col-span-full w-full lg:w-[80%] mx-auto mt-10 border-t-2 border-white/15 pt-10">
          <p className="mb-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            client science teams building their own models
          </p>
          <ClientLogos clients={clients} />
        </div>
      </AnimatedSection>

      <AnimatedBreak />

      {/* 05 SHIPPED — CLIENT INTERFACES */}
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-6 gap-12 items-center">
        <ChapterHeader
          index="05"
          title="Custom Client Apps Powered by a Design System"
          kicker="Strange-UI, our own system for standing a client's app up fast"
        />
        <div className="col-span-full w-full lg:w-[80%] mx-auto">
          <ChapterCard
            asideTitle="what we build"
            items={[
              'Custom client apps that operationalize each model',
              'Staff scheduling, vehicle routing, cargo, freight, and logistics',
              'Strange-UI, our internal design system for optimization interfaces',
              'Shared components: schedules, constraints, scenario builders, solver runs',
              'Interactive visuals and layered navigation over hard data',
              'Built for operators with no optimization background',
            ]}
          >
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              Aura 2.0 builds the model — then the model has to run a business: staff
              scheduling, vehicle routing, cargo and freight, logistics.
            </p>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              So the last step is design work again. We&apos;re a consultancy, so every
              engagement ends in its own custom web app, built for that client&apos;s operation.
              Powering them is Strange-UI, a separate design system we built for exactly this:
              each operation differs, but the pieces repeat — schedules, constraints, scenario
              builders, solver runs. Strange-UI carries those components and the rules for
              assembling them, so a new client app starts production-ready instead of from a
              blank file.
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

        <CaseImage
          className="col-span-full lg:col-span-6"
          src="/imgs/aura/strangeui-v2.webp"
          alt="Strange-UI — the component library behind the client optimization apps"
        />

      </AnimatedSection>

      <AnimatedBreak />

      {/* CLOSING — bookends the built-for-you block */}
      <AnimatedSection className="grid grid-cols-1 gap-12">
        <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <InfoCard>
            <h2 className="text-3xl md:text-4xl font-bold">What It Added Up To</h2>
            <h4 className="text-white/50 text-balance text-base font-normal! italic mt-1.5 mb-4">
              An internal process, turned into a product, turned back into client work
            </h4>
            <div className="w-full border-b-2 border-white/20 mb-4"></div>
            <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
              We built an app that builds optimization models, and a design system for the
              interfaces that run them. Then we sit with each client and design the real thing,
              so somebody on the ground in operations can run their day with it.
            </p>
            <p className="text-lg leading-8 text-white/90 text-pretty">
              A process we learned from our own consultants, turned into a product, turned back
              into how we serve clients. Full circle.
            </p>
          </InfoCard>

          <InfoCard className="flex flex-col items-start">
            <h3 className="text-xl font-bold mt-2 mb-4 text-balance">What I Did on It</h3>
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

      {/* SIGN-OFF — only on the addressed copy, mirroring its intro header:
          centered mark on top, same type scale, direct contact details. The
          public page ends on the folio footer instead, and its icosahedron
          opens the page rather than closing it. */}
      {audience && (
        <FadeUp className="w-full">
          <div className="mx-auto flex w-[96%] max-w-4xl flex-col items-center gap-6 px-4 pt-20 text-center">
            <Icosahedron variant="icon" />
            <div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight text-balance">
                Thanks, {audience.name}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-xl leading-8 text-white/75 text-balance">
                That&apos;s the story. Would love to talk.
              </p>
            </div>

            <div className="w-16 border-b-2 border-white/20" aria-hidden="true" />

            <ul className="flex flex-col items-center gap-1.5 text-base text-white/80 sm:flex-row sm:justify-center sm:gap-7">
              <li>
                <a
                  href="mailto:davekeller@me.com?subject=Hey Dave!"
                  className="transition-colors hover:text-(--color-2)"
                >
                  davekeller@me.com
                </a>
              </li>
              <li>512.595.6213</li>
              <li>
                <a
                  href="https://www.linkedin.com/in/dkells/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-(--color-2)"
                >
                  linkedin/dkells
                </a>
              </li>
            </ul>
          </div>
        </FadeUp>
      )}

      {/* The addressed copy keeps the minimal footer — it ends on the note to
          them, not on the folio's sign-off. Both copies carry both arrows:
          back to the portfolio on the left, on to the resume on the right. */}
      <Footer minimal={!!audience} portfolio resume />
    </>
  );
};

export default AuraCaseStudy;
