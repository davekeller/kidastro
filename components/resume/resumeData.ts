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
    location: 'Hybrid / Austin, TX',
    role: 'Director of Product · promoted from Senior Product Designer (Apr 2024)',
    summary:
      'Leading product strategy and design for the core platform and a suite of data-science workflow apps at the frontier of AI and quantum/HPC computing — helping Fortune 500 science teams run complex compute jobs and analyze results.',
    bullets: [
      'Promoted to Director of Product in 6 months — owning the roadmap, design strategy, and cross-functional execution',
      'Embedded design lead partnering with engineering, leadership, and the science team to research, prototype, and ship',
      'Led design across the Strangeworks Portal, an AI-assisted workflow app for HPC/quantum data-science, and dozens of client apps for optimization problems like scheduling and routing',
    ],
  },
  {
    company: 'QuotaPath',
    dates: 'Jan 2022 – Oct 2023',
    location: 'Hybrid / Austin, TX',
    role: 'Senior Product UX/UI Designer',
    summary:
      'Led design across multiple product teams at this Series B SaaS platform for sales commission tracking and analysis.',
    bullets: [
      'Shipped platform features monthly — from comp modeling and onboarding flows to sandbox environments and payout workflows',
      'Designed and launched the Compensation Hub — a top-of-funnel commission library and modeling tool that drove $1.5M+ in new pipeline in a year',
      'Co-created and rolled out the Shape Up process across 4 product and engineering teams, improving planning clarity and shipping cadence',
    ],
  },
  {
    company: 'OneAssembly',
    dates: 'Feb 2021 – Jan 2022',
    location: 'Austin, TX',
    role: 'Product UX/UI Design Lead · Front-End Developer',
    summary:
      'Built this B2B device auction platform from idea to launch in a year — grossing $3M+ in the first beta month and $33M+ in year one.',
    bullets: [
      'Architected, designed, and developed the full product from whiteboard to production launch',
      'Built the front-end in React + Tailwind CSS, and designed the branding, marketing site, and go-to-market materials',
    ],
  },
  {
    company: 'BnbFinder (now Savvy.com)',
    dates: 'May 2019 – Feb 2021',
    location: 'Austin, TX',
    role: 'Product UX/UI Design Lead · Front-End Developer',
    summary:
      'Built this niche travel listings platform from idea to 8K subscribers (4K+ paid) in under a year on a 3-person team.',
    bullets: [
      'Designed and built the full platform — consumer, owner, and admin apps — in Elixir, React/Next.js, and a custom Tailwind CSS framework',
      'Shipped responsive front-ends across all three product surfaces and drove the agile process with bi-weekly stakeholder demos',
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
      'Led design for Rodio — a workforce communication platform for retail. Partnered with a Fortune-100 (Kronos) and signed MarketSource (Target/Best Buy), reaching millions of daily interactions.',
    bullets: [
      'Led a team of 20 to build Rodio (web, iOS and Android) from early ideas through 20K+ paid users',
      'Designed and pitched a demo that solidified partnership contracts with Kronos and Form.com, and ultimately led to acquisition',
    ],
  },
  {
    company: 'Timebomb',
    dates: 'Sep 2015 – Dec 2017',
    location: 'Austin, TX',
    role: 'Co-Founder · Product UX/UI Design Lead',
    summary:
      'Co-founded and led design for this conditional messaging app (iOS and Android) — raised $3M from angel investors including Katy Perry and Warner Bros., and landed marketing partnerships with Ellen and Warner Bros.',
    bullets: [
      'Led a cross-platform product team of 10 from concept through launch — growing to 20K+ users',
      'Crafted pitch decks that helped raise $3M from angel investors, including celebrities and Warner Bros.',
    ],
  },
  {
    company: 'Made by Rocket',
    dates: 'Aug 2009 – Nov 2017',
    location: 'Austin, TX',
    role: 'Co-Founder · Product Designer · Front-End Developer',
    summary:
      'Co-founded and grew this agency to 20 employees across 30+ projects — including a #1 Paid iPhone App and work for Ellen, Need for Speed, Dreamworks, and The Economist.',
    bullets: [
      'Pitched, designed, and shipped apps for 30+ clients — including a photo editor for A Beautiful Mess that hit #1 Paid in the iTunes Store and held top-100 for over a year',
      'Designed concepts and prototypes for Ellen, Need for Speed, Dreamworks, The Economist, and many early-stage startups',
    ],
  },
];

export const highlights: string[] = [
  '15+ years leading design on early-stage product teams — from indie iOS apps to Series B SaaS platforms serving millions',
  'Translating complex user flows into polished, intuitive experiences across SaaS, AI, quantum computing, travel, retail, B2B auctions, and consumer apps',
  'Long-time HTML/CSS/Tailwind dev, now at the forefront of AI-assisted design — shipping production front-ends with Cursor, Claude Code, and Codex',
  'Co-founded an agency and a messaging app, raised $3M, and shipped 40+ products — including a #1 Paid iPhone App and multiple front-to-back platforms',
];

export const skills: string[] = [
  'AI coding — Cursor, Claude Code, Codex',
  'Next.js / React / Tailwind CSS / TypeScript',
  'HTML / CSS / JS — production-ready front-end',
  'Figma & design systems — multi-platform component libraries, prototyping, design hand-off',
  'GitHub / Linear / Notion',
];

export const interests: string[] = [
  'Guitar and vocals in a rock band',
  'Music recording and production',
  'Indoor soccer and racquetball',
  'Mountain biking and endurance sports',
  'International travel (fluent in Spanish)',
  'Adventures with my kids',
];
