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
    location: 'Hybrid / Austin, TX',
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

export const highlights: string[] = [
  '20 years (since 2005) leading product design — design lead on every team I\'ve joined, from 2-person indie shops to Series B SaaS platforms',
  'Cross-industry breadth — SaaS, AI / quantum computing, travel, retail, telemedicine, B2B auctions, gaming, entertainment, and consumer apps',
  'Specialty: translating complex user flows into polished, intuitive web, iOS, and Android experiences',
  'At the forefront of AI-assisted product design — prototyping full front-ends in production code with Cursor, Claude Code, and Codex',
  'Design + front-of-front-end hybrid — long-time Tailwind expert, ships production React / Next.js / Tailwind code alongside engineering teams',
  'Co-founded 2 startups, raised $3M from angel investors (Katy Perry, Warner Bros.), shipped a #1 Paid iPhone App that stayed top-100 for over a year',
];

export const skills: string[] = [
  'AI coding — Cursor, Claude Code, Codex',
  'Next.js / React / Tailwind CSS / TypeScript',
  'HTML / CSS / JS — production-ready front-end',
  'Figma (expert) — libraries, prototyping, design hand-off',
  'Design systems — multi-platform component libraries',
  'GitHub / Linear / Notion',
];

export const interests =
  'Guitar & drums · Soccer · Dirt & mountain biking · Traveling South America (fluent in Spanish) · Adventuring with my kids';
