export type Category =
  | 'Workflow'
  | 'Shipping'
  | 'Build & Test'
  | 'Environment'
  | 'Quality'
  | 'Design';

export interface Skill {
  command: string;
  category: Category;
  description: string;
  practices: string[];
}

export interface Photo {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export const CATEGORY_ACCENTS: Record<Category, string> = {
  Workflow: '#39d5cb',
  Shipping: '#e4416f',
  'Build & Test': '#f4fd7b',
  Environment: '#6ee7b7',
  Quality: '#fcd34d',
  Design: '#e4416f',
};

export const INSTAGRAM_URL = 'https://instagram.com/kid4stro';
export const BUNDLE_PATH = '/downloads/dave-claude-skills.zip';

export const SKILLS: Skill[] = [
  {
    command: '/commit',
    category: 'Workflow',
    description: 'Format, stage, and commit with a well-structured message.',
    practices: [
      'refuse to commit on main — branch first',
      'auto-fix lint + format before staging anything',
      'stage specific files, never a blanket git add -A',
      'conventional first line: feat / fix / refactor — then verify',
    ],
  },
  {
    command: '/pr',
    category: 'Workflow',
    description: 'Pull requests with screenshots and a real summary.',
    practices: [
      'commit and push everything before drafting',
      'screenshot the actual UI for the description',
      'summarize the whole branch diff, not just the last commit',
    ],
  },
  {
    command: '/implement',
    category: 'Shipping',
    description: 'Phased commits → PR → honest self-review → fix loop.',
    practices: [
      'never implement an unconfirmed plan — get sign-off first',
      'one commit per phase, never bundled',
      'self-review the PR and fix the real issues found',
    ],
  },
  {
    command: '/phase',
    category: 'Shipping',
    description: 'Big tasks in small, independently-testable phases.',
    practices: [
      'break work into phases that build and test on their own',
      'present the plan for approval before touching code',
      'every phase ends green: implement → test → fix → commit',
    ],
  },
  {
    command: '/build',
    category: 'Build & Test',
    description: 'Run the project build and report errors, grouped and prioritized.',
    practices: [
      'type-check with tsc --noEmit before the full production build',
      'group errors by type instead of dumping a wall of text',
      'read the failing file for context before suggesting a fix',
    ],
  },
  {
    command: '/test',
    category: 'Build & Test',
    description: 'Run the suite and report results clearly.',
    practices: [
      'report pass/fail counts with file and line numbers',
      'read the failing test to understand intent before fixing',
      'offer fixes only when the cause is obvious',
    ],
  },
  {
    command: '/fix',
    category: 'Build & Test',
    description: 'Auto-fix lint and formatting issues, then prove it.',
    practices: [
      "auto-fix first, then type-check what lint can't see",
      'review the diff the tools produced — never trust blindly',
      "don't commit the cleanup unless asked",
    ],
  },
  {
    command: '/main',
    category: 'Workflow',
    description: 'Sync with main and leave everything green.',
    practices: [
      'commit local work before any merge',
      'reinstall deps after merging — lockfiles shift underneath you',
      'build, then test, fixing failures one at a time',
    ],
  },
  {
    command: '/sync-branch',
    category: 'Workflow',
    description: 'Fetch and merge another branch, safely.',
    practices: [
      'warn about uncommitted changes before merging',
      'always fetch before merge — never trust a stale ref',
      'surface conflicts and let a human decide',
    ],
  },
  {
    command: '/review',
    category: 'Quality',
    description: 'Code review with specifics, not vibes.',
    practices: [
      'check bugs, security, performance, readability — in that order',
      'give exact line references, not vague gestures',
      "note what's good, not just what's broken",
    ],
  },
  {
    command: '/dev',
    category: 'Environment',
    description: 'Start the full development stack, preflight checks included.',
    practices: [
      'preflight first: Docker up, env keys set, ports free',
      'wait for services healthy before reporting the URL',
      'keep single-service modes handy for debugging',
    ],
  },
  {
    command: '/deps',
    category: 'Environment',
    description: 'Check and manage dependencies across the stack.',
    practices: [
      'audit outdated packages by severity: major / minor / patch',
      'warn on breaking changes before major bumps',
      'respect existing version constraints before adding anything',
    ],
  },
  {
    command: '/css-dark-light-mode',
    category: 'Design',
    description: 'Modern dark/light theming with pure CSS.',
    practices: [
      'use light-dark() for every color — never hardcode one mode',
      'declare color-scheme: light dark at the root',
      'flip whole sections with a data-theme="inverted" style query',
      'no JavaScript theme switching unless polyfilling',
    ],
  },
];

export const PHOTOS: Photo[] = [
  {
    src: '/imgs/ig/show.jpg',
    alt: 'Dave playing guitar on stage with paper.fang',
    caption: 'paper.fang live',
    width: 1080,
    height: 1080,
  },
  {
    src: '/imgs/ig/cdmx.jpg',
    alt: 'Selfie at a street market in Mexico City',
    caption: 'mercado run, cdmx',
    width: 1080,
    height: 1080,
  },
  {
    src: '/imgs/about/about1@2x.jpg',
    alt: 'Dave at the start line of a bike race',
    caption: 'race day',
    width: 660,
    height: 480,
  },
  {
    src: '/imgs/ig/moto.jpg',
    alt: 'Riding a dirt bike up a hill country trail',
    caption: 'i like to ride my motor bicycle',
    width: 1080,
    height: 1080,
  },
  {
    src: '/imgs/ig/thanksgiving.jpg',
    alt: 'Thanksgiving with 21 family members in the kitchen',
    caption: 'thanksgiving, all 21 of us',
    width: 1080,
    height: 1080,
  },
  {
    src: '/imgs/about/about3@2x.jpg',
    alt: 'Selfie at a family dinner around the table',
    caption: 'dinner with the fam',
    width: 660,
    height: 480,
  },
  {
    src: '/imgs/ig/rally.jpg',
    alt: 'Helmet selfie at the Hill Country 500 adventure rally',
    caption: 'hill country 500',
    width: 1080,
    height: 1080,
  },
  {
    src: '/imgs/ig/summer.jpg',
    alt: 'Dave with his kids at graduation',
    caption: 'summer dump pt. 1',
    width: 1080,
    height: 1080,
  },
  {
    src: '/imgs/ig/grinduro.jpg',
    alt: 'Dirt bikes and campers at sunset at Grinduro',
    caption: 'grinduro sunset',
    width: 1080,
    height: 1080,
  },
  {
    src: '/imgs/dave.jpg',
    alt: 'Dave Keller',
    caption: "hey, it's me",
    width: 390,
    height: 390,
  },
];
