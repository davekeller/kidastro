# /resume page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/resume` route to kidastro.com that renders Dave's resume site-natively over the existing aurora chrome, plus a footer link and a downloadable static PDF asset.

**Architecture:** Pure presentational React/Next.js page. Server component (no client interactivity required). Reuses the global chrome (NorthernLights, Starfield, ColorBar) rendered in `app/layout.tsx`. Composed of small subcomponents under `components/resume/` so each file has one responsibility.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript. No new dependencies.

**Testing note:** This project has no automated test framework. Per the approved spec, no test files are added. Verification is: `npm run lint`, `npm run build`, and visual check in `npm run dev` at desktop and mobile widths.

**Spec reference:** `docs/superpowers/specs/2026-05-18-resume-page-design.md`

---

## File Structure

**New files:**
- `app/resume/page.tsx` — the route; exports `metadata` and renders `<Resume />`.
- `components/Resume.tsx` — top-level resume composition; owns container width, vertical rhythm, and section ordering.
- `components/resume/Header.tsx` — headshot + name + tagline + contact stack.
- `components/resume/DownloadButton.tsx` — pill link to `/Dave_Keller_Resume.pdf`.
- `components/resume/SectionLabel.tsx` — shared small-caps section heading ("EXPERIENCE", "SKILLS & TOOLS", "INTERESTS").
- `components/resume/JobEntry.tsx` — full-detail role entry (company, role, dates, summary, bullets).
- `components/resume/JobEntryCondensed.tsx` — condensed role entry (company, role, dates, single sentence).
- `components/resume/resumeData.ts` — typed data for roles + skills + interests; pure data, no JSX.

**Modified files:**
- `components/Footer.tsx` — add a 4th icon (resume) using existing `/imgs/contact/resume.svg`.

**New static assets (user-supplied, NOT created by the plan):**
- `public/imgs/dave.jpg` — headshot.
- `public/Dave_Keller_Resume.pdf` — emailable PDF.

The plan does not create these binary assets. Tasks accommodate their absence with placeholder handling so the route still renders.

---

## Task 1: Scaffold the route and verify it renders

**Files:**
- Create: `app/resume/page.tsx`
- Create: `components/Resume.tsx`

- [ ] **Step 1: Create the Resume component as a minimal placeholder**

Create `components/Resume.tsx`:

```tsx
import React from 'react';

const Resume = () => {
  return (
    <main className="relative z-10 mx-auto max-w-[820px] px-6 pt-32 pb-24 text-white">
      <h1 className="text-4xl font-bold">Resume</h1>
      <p className="mt-4 text-white/60">Coming together…</p>
    </main>
  );
};

export default Resume;
```

- [ ] **Step 2: Create the route file**

Create `app/resume/page.tsx`:

```tsx
import type { Metadata } from 'next';
import Resume from '@/components/Resume';

export const metadata: Metadata = {
  title: 'Resume — Dave Keller',
  description: 'Resume of Dave Keller — Director of Product, Product UX/UI Designer, Front-End Developer.',
};

export default function ResumePage() {
  return <Resume />;
}
```

- [ ] **Step 3: Verify the route renders**

Run: `npm run dev`
Open: `http://localhost:3000/resume`
Expected: page loads, aurora/starfield visible behind, "Resume" heading and placeholder copy show centered.

- [ ] **Step 4: Lint check**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/resume/page.tsx components/Resume.tsx
git commit -m "Scaffold /resume route with placeholder content"
```

---

## Task 2: Create the typed resume data file

**Files:**
- Create: `components/resume/resumeData.ts`

- [ ] **Step 1: Create the data file**

Create `components/resume/resumeData.ts`:

```ts
export type FullJob = {
  company: string;
  dates: string;
  location: string;
  role: string;
  summary: string;
  bullets: string[];
};

export type CondensedJob = {
  company: string;
  dates: string;
  location: string;
  role: string;
  summary: string;
};

export const fullJobs: FullJob[] = [
  {
    company: 'Strangeworks',
    dates: 'Oct 2023 – Present',
    location: 'Austin, TX',
    role: 'Director of Product · promoted from Senior Product Designer (Apr 2024)',
    summary:
      'Leading product strategy and design for a platform at the frontier of AI and quantum computing — helping teams access, run, and understand hybrid quantum-classical workloads.',
    bullets: [
      'Promoted from Senior Product Designer to Director of Product within 6 months, taking on full ownership of product roadmap, design direction, and cross-functional execution',
      'Designing and prototyping web application experiences for strangeworks.com, translating complex quantum and AI concepts into clean, intuitive interfaces',
      'Partnering closely with engineering and leadership to shape the product vision for a platform used by researchers, enterprises, and developers worldwide',
    ],
  },
  {
    company: 'QuotaPath',
    dates: 'Jan 2022 – Oct 2023',
    location: 'Austin, TX',
    role: 'Senior Product UX/UI Designer',
    summary:
      'Led design across multiple product teams at this Series B SaaS platform for sales commission modeling, tracking, and analysis.',
    bullets: [
      'Shaped, validated, and shipped 10+ platform features — from comp modeling to onboarding flows, sandbox environments, and payout workflows',
      'Designed and launched the Compensation Hub (comp.quotapath.com) — a top-of-funnel plan library and modeling tool that became a key acquisition driver',
      'Co-created and rolled out the Shape Up product process across 4 product/engineering teams, improving planning clarity and shipping cadence',
    ],
  },
  {
    company: 'Assembly (OneAssembly)',
    dates: 'Feb 2021 – Jan 2022',
    location: 'Austin, TX',
    role: 'Product UX/UI Design Lead · Front-End Developer',
    summary:
      "R&D'd this B2B device auction platform from idea to $3M+ in the first month of beta ($33M+ in the first year) with a dev team of 3.",
    bullets: [
      'Architected, designed and developed the full product from whiteboard through a highly successful launch — conception through production on a lean 3-person team',
      'Built the majority of the front-end in code: React + Tailwind CSS (HTML/CSS/JS), and also designed the branding, marketing site, and go-to-market materials',
    ],
  },
  {
    company: 'bnbfinder (now Savvy.com)',
    dates: 'May 2019 – Feb 2021',
    location: 'Austin, TX',
    role: 'Product UX/UI Design Lead · Front-End Developer',
    summary:
      'Built this niche travel listings platform from ideas to 8K subscribers (4K+ paid) in under a year with a dev team of 3.',
    bullets: [
      'Conceived, designed and coded the full platform — consumer, owner, and admin apps — from scratch using Elixir, React/Next.js, and a custom Tailwind CSS framework',
      'Developed fully responsive front-end apps across all three product surfaces; drove agile process using Jira and Trello with bi-weekly stakeholder demos',
    ],
  },
];

export const condensedJobs: CondensedJob[] = [
  {
    company: 'Phobio : Rodio',
    dates: 'Jan 2018 – May 2019',
    location: 'Austin, TX',
    role: 'Product UX/UI Design Lead',
    summary:
      'Led design for Rodio — a workforce communication platform for large retail. Within two years, partnered with a Fortune-100 (Kronos) and signed MarketSource (Target/Best Buy), reaching millions of daily interactions.',
  },
  {
    company: 'Timebomb',
    dates: 'Sep 2015 – Dec 2017',
    location: 'Austin, TX',
    role: 'Co-Founder · Product UX/UI Design Lead',
    summary:
      'Co-founded and led design for this conditional messaging app (iOS and Android). Raised $3M from angel investors including Katy Perry and Warner Bros., and landed marketing partnerships with Ellen DeGeneres and Warner Bros.',
  },
  {
    company: 'Made by Rocket',
    dates: 'Aug 2009 – Nov 2017',
    location: 'Austin, TX',
    role: 'Co-Founder · Product Designer · Front-End Developer',
    summary:
      'Co-founded and grew this agency from 2 to 20 employees on 30+ projects — including a #1 Paid iPhone App for A Beautiful Mess and apps for Ellen, Need for Speed, Dreamworks, and The Economist.',
  },
];

export const skills =
  'Figma · React / Next.js · Tailwind CSS · HTML / CSS / JS · iOS Design · Prototyping · Design Systems · Shape Up · Linear · Notion · GitHub';

export const interests =
  'Guitar & drums · Soccer · Dirt & mountain biking · Traveling South America (fluent in Spanish) · Adventuring with my kids';
```

- [ ] **Step 2: Lint check**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/resume/resumeData.ts
git commit -m "Add typed resume data (full + condensed jobs, skills, interests)"
```

---

## Task 3: Build the SectionLabel component

**Files:**
- Create: `components/resume/SectionLabel.tsx`

- [ ] **Step 1: Create the component**

Create `components/resume/SectionLabel.tsx`:

```tsx
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const SectionLabel = ({ children }: Props) => {
  return (
    <h2 className="mb-6 border-b border-white/10 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
      {children}
    </h2>
  );
};

export default SectionLabel;
```

- [ ] **Step 2: Lint check**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/resume/SectionLabel.tsx
git commit -m "Add SectionLabel component for resume section headings"
```

---

## Task 4: Build the Header component

**Files:**
- Create: `components/resume/Header.tsx`

The headshot uses Next's `<Image>` pointing at `/imgs/dave.jpg`. The user supplies that file; if it's missing, Next will 404 the image but the page still renders. No placeholder fallback in code — keeping it simple. The user knows to drop in the asset before deploying.

- [ ] **Step 1: Create the component**

Create `components/resume/Header.tsx`:

```tsx
import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="mb-16 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Image
          src="/imgs/dave.jpg"
          alt="Dave Keller"
          width={120}
          height={120}
          className="h-[120px] w-[120px] rounded-full border-2 border-white/10 object-cover"
          priority
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Dave Keller</h1>
          <p className="mt-2 text-base text-white/60">
            Director of Product · Product UX/UI Designer · Front-End Developer
          </p>
        </div>
      </div>

      <ul className="text-sm text-white/60 sm:text-right">
        <li>512.595.6213</li>
        <li>
          <a
            href="mailto:davekeller@me.com?subject=Hey Dave!"
            className="transition-colors hover:text-(--color-3)"
          >
            davekeller@me.com
          </a>
        </li>
        <li>
          <a href="/" className="transition-colors hover:text-(--color-3)">
            kidastro.com
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/dkells/"
            className="transition-colors hover:text-(--color-3)"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin.com/in/dkells
          </a>
        </li>
      </ul>
    </header>
  );
};

export default Header;
```

- [ ] **Step 2: Lint check**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/resume/Header.tsx
git commit -m "Add resume Header component (headshot, name, tagline, contact)"
```

---

## Task 5: Build the DownloadButton component

**Files:**
- Create: `components/resume/DownloadButton.tsx`

- [ ] **Step 1: Create the component**

Create `components/resume/DownloadButton.tsx`:

```tsx
import React from 'react';

const DownloadButton = () => {
  return (
    <div className="mb-12 flex justify-start sm:justify-end">
      <a
        href="/Dave_Keller_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/70 transition-colors hover:border-(--color-2) hover:text-(--color-2)"
      >
        Download PDF
      </a>
    </div>
  );
};

export default DownloadButton;
```

- [ ] **Step 2: Lint check**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/resume/DownloadButton.tsx
git commit -m "Add DownloadButton component linking to static resume PDF"
```

---

## Task 6: Build the JobEntry (full-detail) component

**Files:**
- Create: `components/resume/JobEntry.tsx`

Bullet styling mirrors the existing `Quotapath.tsx` pattern (pseudo-element bullet using `--color-2`), but uses a `+` glyph instead of a dot to match the resume's icon-bullet feel.

- [ ] **Step 1: Create the component**

Create `components/resume/JobEntry.tsx`:

```tsx
import React from 'react';
import type { FullJob } from './resumeData';

type Props = {
  job: FullJob;
};

const JobEntry = ({ job }: Props) => {
  return (
    <article className="mb-12">
      <div className="flex flex-col items-baseline justify-between gap-1 sm:flex-row sm:gap-4">
        <h3 className="text-xl font-bold text-white">{job.company}</h3>
        <p className="text-sm text-white/40">
          {job.dates} · {job.location}
        </p>
      </div>
      <p className="mt-1 text-base font-medium text-(--color-2)">{job.role}</p>
      <p className="mt-3 text-base leading-relaxed text-white/70">{job.summary}</p>
      <ul className="mt-4 space-y-2">
        {job.bullets.map((bullet, i) => (
          <li
            key={i}
            className="relative pl-6 text-base leading-relaxed text-white/60 before:absolute before:left-0 before:top-0 before:font-bold before:text-(--color-2) before:content-['+']"
          >
            {bullet}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default JobEntry;
```

- [ ] **Step 2: Lint check**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/resume/JobEntry.tsx
git commit -m "Add JobEntry component for full-detail resume roles"
```

---

## Task 7: Build the JobEntryCondensed component

**Files:**
- Create: `components/resume/JobEntryCondensed.tsx`

- [ ] **Step 1: Create the component**

Create `components/resume/JobEntryCondensed.tsx`:

```tsx
import React from 'react';
import type { CondensedJob } from './resumeData';

type Props = {
  job: CondensedJob;
};

const JobEntryCondensed = ({ job }: Props) => {
  return (
    <article className="mb-8">
      <div className="flex flex-col items-baseline justify-between gap-1 sm:flex-row sm:gap-4">
        <h3 className="text-lg font-bold text-white">{job.company}</h3>
        <p className="text-sm text-white/40">
          {job.dates} · {job.location}
        </p>
      </div>
      <p className="mt-1 text-sm font-medium text-(--color-2)">{job.role}</p>
      <p className="mt-2 text-base leading-relaxed text-white/60">{job.summary}</p>
    </article>
  );
};

export default JobEntryCondensed;
```

- [ ] **Step 2: Lint check**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/resume/JobEntryCondensed.tsx
git commit -m "Add JobEntryCondensed component for shorter resume roles"
```

---

## Task 8: Compose the full Resume page

**Files:**
- Modify: `components/Resume.tsx`

Replace the placeholder with the real composition: Header → DownloadButton → Experience (full then condensed) → Skills → Interests.

- [ ] **Step 1: Replace the file contents**

Overwrite `components/Resume.tsx`:

```tsx
import React from 'react';
import Header from './resume/Header';
import DownloadButton from './resume/DownloadButton';
import SectionLabel from './resume/SectionLabel';
import JobEntry from './resume/JobEntry';
import JobEntryCondensed from './resume/JobEntryCondensed';
import { fullJobs, condensedJobs, skills, interests } from './resume/resumeData';

const Resume = () => {
  return (
    <main className="relative z-10 mx-auto max-w-[820px] px-6 pt-32 pb-24">
      <Header />
      <DownloadButton />

      <section className="mb-16">
        <SectionLabel>Experience</SectionLabel>
        {fullJobs.map((job) => (
          <JobEntry key={job.company} job={job} />
        ))}
        <div className="my-10 border-t border-white/10" />
        {condensedJobs.map((job) => (
          <JobEntryCondensed key={job.company} job={job} />
        ))}
      </section>

      <section className="mb-16">
        <SectionLabel>Skills &amp; Tools</SectionLabel>
        <p className="text-base leading-relaxed text-white/70">{skills}</p>
      </section>

      <section>
        <SectionLabel>Interests</SectionLabel>
        <p className="text-base leading-relaxed text-white/70">{interests}</p>
      </section>
    </main>
  );
};

export default Resume;
```

- [ ] **Step 2: Verify the page in dev**

Run: `npm run dev`
Open: `http://localhost:3000/resume`
Expected:
- Aurora/starfield visible in background.
- Header shows name, tagline, contact info (right-aligned on desktop). Headshot circle may be a broken-image icon if `public/imgs/dave.jpg` is absent — that's expected until the asset is dropped in.
- "Download PDF" pill renders (link will 404 until `public/Dave_Keller_Resume.pdf` is added).
- All 4 full-detail entries render with `+` bullets in teal.
- Divider then 3 condensed entries.
- Skills & Tools and Interests render as single-line paragraphs.

- [ ] **Step 3: Resize browser to ~390px width**

Expected:
- Header stacks vertically (photo above name, contact below).
- Job entries' company name and dates stack vertically.
- No horizontal scroll.

- [ ] **Step 4: Lint check**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Build check**

Run: `npm run build`
Expected: build succeeds with no TypeScript errors. `/resume` listed in the route output.

- [ ] **Step 6: Commit**

```bash
git add components/Resume.tsx
git commit -m "Compose Resume page with header, experience, skills, interests"
```

---

## Task 9: Add the footer Resume link

**Files:**
- Modify: `components/Footer.tsx`

Add a 4th `<li>` to the contact `<ul>` after the email entry, using the existing `/imgs/contact/resume.svg`.

- [ ] **Step 1: Locate the email `<li>` in `components/Footer.tsx`**

The email `<li>` is the 3rd item in the `<ul ref={containerRef}>` block — currently ends with `</li>` followed by the closing `</ul>`. We will insert the new `<li>` between the email `</li>` and the `</ul>`.

- [ ] **Step 2: Add the resume `<li>`**

In `components/Footer.tsx`, after the email `<li>` (which closes with `</li>`) and before the closing `</ul>`, insert:

```tsx
        <li className="p-4 animate-float-delayed" style={{ animationDelay: '0.45s' }}>
          <a href="/resume" className="group flex flex-col items-center">
            <Image src="/imgs/contact/resume.svg" alt="resume" width={40} height={40} className="mb-2" />
            <p className="text-[#90a4bc] font-semibold group-hover:text-[#e4416f] transition-colors">resume</p>
          </a>
        </li>
```

- [ ] **Step 3: Verify in dev**

Run: `npm run dev` (if not already running)
Open: `http://localhost:3000/`
Scroll to the footer.
Expected:
- Fourth contact icon labeled "resume" appears after email.
- Icon participates in the float animation and the horizontal mouse-follow translate.
- Clicking the resume icon navigates to `/resume`.

- [ ] **Step 4: Lint check**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Build check**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add components/Footer.tsx
git commit -m "Add Resume link to footer contact list"
```

---

## Task 10: Final verification pass

- [ ] **Step 1: Run full build and lint together**

Run: `npm run lint && npm run build`
Expected: both succeed with no warnings or errors.

- [ ] **Step 2: Visual smoke test at three widths**

In `npm run dev`, visit `http://localhost:3000/resume` and resize to:
- ≥1200px (desktop): header is two-column, contact right-aligned.
- ~768px (tablet): header is still two-column or just starting to stack; content readable.
- ~390px (mobile): header fully stacked, no horizontal scroll, bullets readable.

Also visit `http://localhost:3000/` and confirm the footer shows the resume icon and the click navigates correctly.

- [ ] **Step 3: Confirm link targets**

On `/resume`, confirm:
- `mailto:` opens mail client.
- LinkedIn link opens linkedin.com/in/dkells in new tab.
- `kidastro.com` link navigates to `/`.
- "Download PDF" attempts to load `/Dave_Keller_Resume.pdf` (will 404 until the asset is added — that's expected).

- [ ] **Step 4: Note any open items for the user**

Remind the user (in conversation) to drop these two files into the repo before deploy:
- `public/imgs/dave.jpg` (headshot)
- `public/Dave_Keller_Resume.pdf` (downloadable resume)

No commit for this task — it's verification only.

---

## Summary of commits

1. Scaffold /resume route with placeholder content
2. Add typed resume data
3. Add SectionLabel component
4. Add resume Header component
5. Add DownloadButton component
6. Add JobEntry component (full-detail)
7. Add JobEntryCondensed component
8. Compose Resume page
9. Add Resume link to footer
