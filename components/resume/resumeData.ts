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
  bullets?: string[];
};

export const fullJobs: FullJob[] = [
  {
    company: 'Strangeworks',
    dates: 'Oct 2023 – Present',
    location: 'Remote / Austin, TX',
    role: 'Principal Product Designer / Design Engineer',
    summary:
      'Lead product strategy and design at this data-science consulting company, building a suite of tools, apps, and optimization interfaces for Fortune 500 science teams running AI and quantum/HPC compute.',
    bullets: [
      'Promoted to Principal Product Designer in 6 months. Researched internal processes and designed the vision for our workflow app Aura — hands-on from business strategy to production code',
      'Embedded with engineering, leadership, and the science team to prototype and ship across our compute platform, the Aura workflow app, docs, and multiple marketing sites',
      'Designed an AI-assisted app for data-science problem formulation and computation on HPC/quantum, plus dozens of client apps for optimization problems like staff scheduling and fleet vehicle routing',
    ],
  },
  {
    company: 'QuotaPath',
    dates: 'Jan 2022 – Oct 2023',
    location: 'Hybrid / Austin, TX',
    role: 'Senior Product UX/UI Designer',
    summary:
      'Led design across multiple product teams at this Series B SaaS platform for sales commission planning and tracking.',
    bullets: [
      'Shipped platform features monthly, from comp modeling and onboarding to sandbox and payout workflows',
      'Designed and launched the Compensation Hub, a commission library and modeling tool that drove $1.5M+ in new pipeline in a year',
      'Co-created a product-development process across 4 cross-functional teams and mentored its designers',
    ],
  },
  {
    company: 'OneAssembly',
    dates: 'Feb 2021 – Jan 2022',
    location: 'Austin, TX',
    role: 'Product UX/UI Design Lead · Front-End Developer',
    summary:
      'Designed and built this B2B device auction platform from idea to launch in a year, grossing $3M+ in the first beta month and $33M+ in year one.',
    bullets: [
      'Took the product from whiteboard to production launch on a 3-person dev team',
      'Designed most of it directly in code (React, Tailwind), plus the brand, marketing site, and go-to-market',
    ],
  },
  {
    company: 'BnbFinder (now Savvy.com)',
    dates: 'May 2019 – Feb 2021',
    location: 'Austin, TX',
    role: 'Product UX/UI Design Lead · Front-End Developer',
    summary:
      'Designed and built this travel listings platform to 8K subscribers (4K+ paid) in under a year on a 3-person team.',
    bullets: [
      'Built the consumer, owner, and admin apps in Elixir and React/Next.js on a custom Tailwind framework',
      'Shipped responsive front-ends across all three surfaces, demoing to stakeholders every two weeks',
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
      'Designed Rodio, a retail workforce communication platform. Partnered with Fortune 100 Kronos and signed MarketSource (Target/Best Buy), reaching millions of daily interactions.',
    bullets: [
      'Built Rodio\'s multi-platform design systems (master, web, iOS, Android) and led a team of 20 to 20K+ paid users',
      'Designed and pitched the demo that closed the Kronos and Form.com contracts and led to acquisition',
    ],
  },
  {
    company: 'Timebomb',
    dates: 'Sep 2015 – Dec 2017',
    location: 'Austin, TX',
    role: 'Co-Founder · Product UX/UI Design Lead',
    summary:
      'Co-founded and designed this conditional messaging app (iOS and Android). Raised $3M from angels including Katy Perry and Warner Bros., with a marketing partnership from Ellen.',
    bullets: [
      'Led a product team of 10 from concept to launch and 20K+ users',
      'Designed the pitch decks behind the $3M raise',
    ],
  },
  {
    company: 'Made by Rocket',
    dates: 'Aug 2009 – Nov 2017',
    location: 'Austin, TX',
    role: 'Co-Founder · Product Designer · Front-End Developer',
    summary:
      'Co-founded and grew this agency to 20 people across 30+ projects, including a #1 Paid iPhone app and work for Ellen, Need for Speed, DreamWorks, and The Economist. Became an ideation and prototyping lab for Warner Bros.',
    bullets: [
      'Designed and shipped A Beautiful Mess, a photo editing app that hit #1 Paid on the App Store and held top-100 for over a year',
      'Designed and prototyped apps for 30+ clients, from Ellen and DreamWorks to early-stage startups',
    ],
  },
];

export const summary: string =
  'Strategic product thinker, Figma expert, and front-end/design engineer. Now designing primarily in Claude Code, Codex, and Tailwind — validating functional prototypes and shipping production code in days, not weeks.';

export const highlights: string[] = [
  '15+ years leading design at early-stage startups. From 0 → 1 through 2.0 and GTM, across AI, data science, entertainment, messaging, ecommerce, and fintech.',
  'A pixel-perfect designer who ships in code. Sweating the visual details — prototyping end-to-end flows and refining high-fidelity production UIs directly in the front-end.',
  'Design system architect and process builder. Architected multi-platform design systems. Built a process that organized a ~45-developer company into 4 cross-functional teams shipping on a steady cadence.',
  'Track record. 40+ products across web, iOS, and Android — including a #1 Paid iPhone app and a 0 → 1 platform that grossed $33M in year one.',
  'Founder & client services. Co-founded a 20-person design/dev agency and a $3M-funded messaging app. The agency became a concepting and prototyping shop for Warner Bros. — with work for Ellen, DreamWorks, and The Economist along the way.',
];

export const skills: string[] = [
  'Expert in Figma & design systems — multi-platform component libraries, prototyping, hand-off',
  'Experienced designing in the front-end (prototypes to production) with Claude Code, Cursor, and Tailwind',
  'Comfortable writing HTML / CSS / JS and working in React / Next.js / Tailwind CSS / TypeScript',
  'Fluent in GitHub — push/pull, branches, and PRs; Linear, Trello, and Notion for sprint planning and docs',
];

// Tools & Technologies — a 3×5 grid read column-by-column, so each column reads
// as a loose category. Canonical source; mirrored in scripts/make-resume-pdf.py
// and scripts/make-resume-docx.js (which render the same 3-column layout).
export const toolGroups: string[] = [
  // column 1 — design & code
  'Figma / Photoshop',
  'Claude Code / Codex / Cursor',
  'React / Next.js',
  'HTML / CSS / Tailwind CSS',
  'JavaScript / TypeScript',
  // column 2 — libraries & builders
  'Git / GitHub',
  'Data Viz / Animation libraries',
  'Recharts / D3 / OpenMaps',
  'React Flow / Framer Motion',
  'Marketing sites',
  // column 3 — systems, platforms & process
  'Design systems / component libraries',
  'Linear / Notion',
  'iOS / Android / VR',
  'Framer / Webflow',
  'Agile / design sprints',
];

export const interests: string[] = [
  'Guitar and vocals in a rock/metal band',
  'Recording and mixing in Logic Pro',
  'Mountain biking and dirt bike racing',
  'Video editing in Final Cut Pro',
  'Indoor soccer and racquetball',
  'International travel (fluent in Spanish)',
];
