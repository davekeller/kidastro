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
    location: 'Hybrid / Austin, TX',
    role: 'Director of Product · promoted from Senior Product Designer (Apr 2024)',
    summary:
      'Leading strategy and design for the core platform and a suite of data-science workflow apps at the frontier of AI and quantum/HPC computing — helping Fortune 500 science teams formulate complex problems, run compute jobs, and analyze results.',
    bullets: [
      'Promoted from Senior Product Designer to Director of Product within 6 months — taking ownership of the product roadmap and design strategy, and driving cross-functional execution',
      'Design lead embedded with the engineering team — leading design through stand-ups, sprints, and planning meetings, while partnering with leadership and the science team to research, prototype, and execute new product ideas',
      'Led design across a range of apps — the Strangeworks Portal for managing compute jobs, an AI-assisted data-science workflow app for formulating, running, and analyzing problems on HPC and quantum hardware, and dozens of client apps focused on large optimization problems (staff scheduling, vehicle routing, etc.)',
    ],
  },
  {
    company: 'QuotaPath',
    dates: 'Jan 2022 – Oct 2023',
    location: 'Hybrid / Austin, TX',
    role: 'Senior Product UX/UI Designer',
    summary:
      'Led design across multiple product teams at this Series B SaaS platform for sales commission modeling, tracking, and analysis.',
    bullets: [
      'Shaped, validated, and shipped platform features monthly — from comp modeling and onboarding flows to sandbox environments and payout workflows',
      'Designed and launched the Compensation Hub — a top-of-funnel commission plan library and modeling tool that became a key acquisition driver and led to 1.5M+ new leads within a year',
      'Co-created and rolled out the Shape Up product process across 4 product and engineering teams, improving planning clarity and shipping cadence',
    ],
  },
  {
    company: 'OneAssembly',
    dates: 'Feb 2021 – Jan 2022',
    location: 'Austin, TX',
    role: 'Product UX/UI Design Lead · Front-End Developer',
    summary:
      'Built this B2B device auction platform from idea to launch in a year on a 3-person dev team — grossing $3M+ in the first month of beta and $33M+ in year one.',
    bullets: [
      'Architected, designed, and developed the full product from whiteboard to production launch',
      'Built the majority of the front-end with React + Tailwind CSS, and designed the branding, marketing site, and go-to-market materials',
    ],
  },
  {
    company: 'bnbfinder (now Savvy.com)',
    dates: 'May 2019 – Feb 2021',
    location: 'Austin, TX',
    role: 'Product UX/UI Design Lead · Front-End Developer',
    summary:
      'Built this niche travel listings platform from idea to 8K subscribers (4K+ paid) in under a year with a 3-person dev team.',
    bullets: [
      'Conceived, designed, and coded the full platform — consumer, owner, and admin apps — using Elixir, React/Next.js, and a custom Tailwind CSS framework',
      'Shipped fully responsive front-end apps across all three product surfaces, and drove the agile process with Jira, Trello, and bi-weekly stakeholder demos',
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
      'Led design for Rodio — a workforce communication platform for big retail. Within two years, partnered with a Fortune-100 (Kronos) and signed MarketSource (Target/Best Buy), reaching millions of daily interactions.',
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

export const highlights: string[] = [
  '15+ years leading design on early stage product and dev teams — from indie iOS apps to Series B SaaS platforms serving millions',
  'Years of experience translating complex user flows into polished, intuitive experiences across SaaS, AI, quantum computing, travel, retail, telemedicine, B2B auctions, gaming, and consumer apps',
  'Long-time HTML/CSS/Tailwind expert, now at the forefront of AI-assisted product design — prototyping full front-ends in production code with Cursor, Claude Code, and Codex',
  'Co-founded an agency and a consumer messaging app, raised $3M from angel investors, and shipped 40+ products — including a #1 Paid iPhone App and multiple front-to-back platforms',
];

export const skills: string[] = [
  'AI coding — Cursor, Claude Code, Codex',
  'Next.js / React / Tailwind CSS / TypeScript',
  'HTML / CSS / JS — production-ready front-end',
  'Figma (expert) — libraries, prototyping, design hand-off',
  'Design systems — multi-platform component libraries',
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
