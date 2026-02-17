export type CardSize = 'small' | 'medium' | 'tall' | 'wide' | 'featured';

export interface SkillDoc {
  type: 'skill';
  slug: string;
  title: string;
  subtitle: string;
  previewImage?: string;
  accentColor: string;
  size: CardSize;
  markdown: string;
}

export interface InstagramPost {
  type: 'instagram';
  id: string;
  postUrl: string;
  size: CardSize;
}

export type DocCard = SkillDoc | InstagramPost;

export const skillDocs: SkillDoc[] = [
  {
    type: 'skill',
    slug: 'openclaw-bot',
    title: 'OpenClaw Bot',
    subtitle: 'Discord bot for claw machine automation',
    accentColor: 'var(--color-2)',
    size: 'featured',
    markdown: `# OpenClaw Bot

## Overview
A Discord bot that connects to IoT-enabled claw machines, allowing users to play remotely through chat commands.

## How It Works
The bot bridges Discord's API with a custom hardware controller attached to arcade claw machines. Players queue up, take turns, and watch via a live camera feed.

### Key Features
- **Queue Management** — Fair turn-based system with timeout handling
- **Camera Integration** — Live RTSP stream embedded in Discord
- **Movement Controls** — Reaction-based d-pad for claw positioning
- **Win Detection** — Sensor-triggered prize confirmation
- **Leaderboard** — Tracks wins per user with seasonal resets

## Tech Stack
- \`discord.js\` for bot framework
- \`MQTT\` for hardware communication
- \`FFmpeg\` for stream transcoding
- \`SQLite\` for persistent leaderboard data

## Architecture
\`\`\`
Discord ←→ Bot Server ←→ MQTT Broker ←→ Arduino Controller
                ↕
          Camera Feed (RTSP → HLS)
\`\`\`

The bot runs on a Raspberry Pi co-located with the claw machine, keeping latency under 100ms for responsive controls.

## Lessons Learned
Building for physical hardware introduces failure modes you don't get in pure software — motor stalls, sensor drift, network drops mid-game. Defensive programming becomes essential.
`,
  },
  {
    type: 'skill',
    slug: 'design-system-audit',
    title: 'Design System Audit',
    subtitle: 'Automated component consistency checker',
    accentColor: 'var(--color-3)',
    size: 'tall',
    markdown: `# Design System Audit

## Overview
A Claude-powered tool that audits React component libraries for design system consistency — checking spacing, color tokens, typography scales, and naming conventions.

## The Problem
Design systems drift. Engineers use \`padding: 14px\` instead of the \`space-3.5\` token. Colors get hardcoded. Component APIs diverge from the spec. Manual audits don't scale.

## Solution
Feed your component source files to the auditor and get a structured report:

### What It Checks
- **Token Usage** — Flags hardcoded values that should use design tokens
- **Naming Conventions** — Validates component/prop naming against your schema
- **Spacing Scale** — Detects off-scale spacing values
- **Color Compliance** — Ensures colors map to your palette
- **Typography** — Verifies font sizes, weights, and line heights match the type scale

### Sample Output
\`\`\`json
{
  "component": "Button",
  "violations": [
    {
      "type": "hardcoded-color",
      "line": 23,
      "found": "#3b82f6",
      "suggestion": "var(--color-primary)"
    }
  ],
  "score": 87
}
\`\`\`

## Usage
Works as a CI step — run it on every PR to catch drift before it merges.

## Impact
Reduced design system violations by 60% in the first month across a 200+ component library.
`,
  },
  {
    type: 'skill',
    slug: 'portfolio-generator',
    title: 'Portfolio Generator',
    subtitle: 'From Figma frames to deployed site',
    accentColor: 'var(--color-1)',
    size: 'medium',
    markdown: `# Portfolio Generator

## Overview
A workflow that takes Figma design frames and generates a deployable Next.js portfolio site — complete with animations, responsive layout, and static export.

## Workflow

1. **Export** — Pull frames from Figma via the API
2. **Analyze** — Claude interprets layout, spacing, typography, and color
3. **Generate** — Produces Next.js pages with Tailwind CSS
4. **Animate** — Adds Framer Motion scroll animations
5. **Deploy** — Static export to GitHub Pages

### What Gets Generated
- Responsive grid layouts matching Figma auto-layout
- Image optimization with Next.js Image component
- Scroll-triggered animations (fade, slide, scale)
- Dark mode support via CSS custom properties
- SEO metadata from Figma page names

## Configuration
\`\`\`yaml
figma:
  file_key: "abc123"
  pages: ["Portfolio", "About"]
output:
  framework: "nextjs"
  styling: "tailwind"
  animations: true
deploy:
  target: "github-pages"
  domain: "portfolio.dev"
\`\`\`

## Limitations
- Complex overlapping layouts may need manual adjustment
- Custom interactions (hover states, modals) require hand-coding
- Works best with clean, well-organized Figma files
`,
  },
];

export const instagramPosts: InstagramPost[] = [
  {
    type: 'instagram',
    id: 'ig-1',
    postUrl: 'https://www.instagram.com/p/DGFYRQWxS1Y/',
    size: 'medium',
  },
  {
    type: 'instagram',
    id: 'ig-2',
    postUrl: 'https://www.instagram.com/p/DFy4f3pRgwj/',
    size: 'small',
  },
  {
    type: 'instagram',
    id: 'ig-3',
    postUrl: 'https://www.instagram.com/p/DFWqhVmxBjT/',
    size: 'wide',
  },
];

export const allCards: DocCard[] = [
  skillDocs[0],
  instagramPosts[0],
  skillDocs[1],
  instagramPosts[1],
  skillDocs[2],
  instagramPosts[2],
];
