#!/usr/bin/env node
/* Generate public/dave-keller-resume.docx — a Word twin of the resume PDF.
 *
 * The content below mirrors scripts/make-resume-pdf.py (which mirrors
 * components/resume/resumeData.ts + Header.tsx) — update together, then rerun:
 *
 *     npm install --no-save docx        # or NODE_PATH to any install of `docx`
 *     node scripts/make-resume-docx.js
 *
 * Needs python3 + Pillow for the circular avatar (same as the PDF script).
 * The .docx is for application portals that require Word format; it is not
 * linked anywhere on the site.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const {
  AlignmentType, BorderStyle, Document, ExternalHyperlink, ImageRun,
  LevelFormat, LineRuleType, Packer, Paragraph, Table, TableBorders,
  TableCell, TableRow, TextRun, VerticalAlign, WidthType,
} = require("docx");

const REPO = path.resolve(__dirname, "..");
const AVATAR_SRC = path.join(REPO, "public", "imgs", "dave.jpg");
const OUT = path.join(REPO, "public", "dave-keller-resume.docx");

// ---- Style rules (matches make-resume-pdf.py) ------------------------------

const FONT = "Arial";   // set on every run: some importers (Pages) drop style-level fonts
const INK = "1A1A1A";   // body text
const GRAY = "555555";  // secondary text (roles, contact)
const LIGHT = "999999"; // section titles
const RULE = "DDDDDD";  // horizontal rules

const BODY = 19;        // 9.5pt in half-points
const SMALL = 18;       // 9pt — contact, dates, section titles
const LEADING = 260;    // 13pt line height in twips
const GAP = 80;         // 4pt space after a body paragraph
const TOP_GAP = 140;    // 7pt space after highlights/skills bullets
const JOB_GAP = 320;    // 16pt space before each job entry
const SECTION_GAP = 320;// 16pt space before each section title

const MARGIN = 1080;            // 0.75in left/right
const MARGIN_V = 936;           // 0.65in top/bottom
const CONTENT_W = 12240 - 2 * MARGIN; // 10080 DXA
const DATES_W = 3456;           // 2.4in
const AVATAR_COL = 1440;        // 1.0in
const AVATAR_PX = 69;           // 0.72in at 96dpi

const spacing = (extra = {}) => ({ line: LEADING, lineRule: LineRuleType.AT_LEAST, ...extra });

// ---- Building blocks -------------------------------------------------------

// Circle-cropped grayscale avatar, rendered by Pillow exactly like the PDF's.
function circleAvatar() {
  const out = path.join(os.tmpdir(), "resume-avatar-circle.png");
  const py = `
from PIL import Image, ImageDraw, ImageOps
size = 216
src = ImageOps.fit(Image.open(${JSON.stringify(AVATAR_SRC)}).convert("L"), (size, size), Image.LANCZOS)
mask = Image.new("L", (size*4, size*4), 0)
ImageDraw.Draw(mask).ellipse((0, 0, size*4, size*4), fill=255)
canvas = Image.new("LA", (size, size), (255, 0))
canvas.paste(src.convert("LA"), (0, 0), mask.resize((size, size), Image.LANCZOS))
canvas.save(${JSON.stringify(out)})
`;
  execFileSync("python3", ["-c", py]);
  return fs.readFileSync(out);
}

function sectionTitle(text) {
  return new Paragraph({
    spacing: spacing({ before: SECTION_GAP, after: 120 }),
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 4 } },
    children: [new TextRun({ font: FONT,
      text: text.toUpperCase(),
      bold: true, size: SMALL, color: LIGHT,
      characterSpacing: 36, // 1.8pt = 0.2em at 9pt, like the site
    })],
  });
}

function bullet(text, { after = GAP, keepNext = false } = {}) {
  return new Paragraph({
    numbering: { reference: "plus", level: 0 },
    spacing: spacing({ after }),
    keepLines: true, keepNext,
    children: [new TextRun({ font: FONT, text })],
  });
}

function link(text, url, opts = {}) {
  return new ExternalHyperlink({
    link: url,
    children: [new TextRun({ font: FONT, text, size: SMALL, color: GRAY, ...opts })],
  });
}

function job([company, dates, location, role, summary, jobBullets], { first = false } = {}) {
  // Company/dates as a 2-col table (like the PDF): a right tab stop would be
  // simpler, but Pages' .docx importer drops tab stops while tables survive
  // every renderer. Tables can't carry spacing-before, hence the fixed-height
  // spacer paragraph between jobs.
  return [
    ...(first ? [] : [new Paragraph({
      spacing: { before: 0, after: 0, line: JOB_GAP, lineRule: LineRuleType.EXACT },
      keepNext: true,
      children: [],
    })]),
    new Table({
      borders: TableBorders.NONE,
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: [CONTENT_W - DATES_W, DATES_W],
      rows: [new TableRow({
        children: [
          cell([new Paragraph({
            spacing: spacing(),
            keepLines: true, keepNext: true,
            children: [new TextRun({ font: FONT, text: company, bold: true, size: 21 })], // 10.5pt
          })], CONTENT_W - DATES_W, VerticalAlign.BOTTOM),
          cell([new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: spacing(),
            keepLines: true, keepNext: true,
            children: [new TextRun({ font: FONT, text: dates, size: SMALL, color: GRAY })],
          })], DATES_W, VerticalAlign.BOTTOM),
        ],
      })],
    }),
    new Paragraph({
      spacing: spacing({ after: 40 }),
      keepLines: true, keepNext: true,
      children: [new TextRun({ font: FONT, text: `${role} · ${location}`, italics: true, color: GRAY })],
    }),
    new Paragraph({
      spacing: spacing({ after: GAP }),
      keepLines: true, keepNext: true,
      children: [new TextRun({ font: FONT, text: summary })],
    }),
    ...jobBullets.map((b, i) => bullet(b, { keepNext: i < jobBullets.length - 1 })),
  ];
}

// ---- Content (mirrors make-resume-pdf.py) ----------------------------------

const TITLE = "design engineer / lead product designer";

const highlights = [
  "15+ years leading design on dev/product teams at early-seed startups, often 0 to 1, with experience across industries — AI, data science, entertainment, messaging, ecommerce, fintech and more",
  "Strategic product thinker, Figma expert, and front-end dev (HTML/CSS, Tailwind, Claude Code). Experienced in validating ideas with design sprints, prototyping end-to-end flows, and refining production UIs in code",
  "Fluent in agile/sprint workflows and in building process for product teams. Helped create a 'Shape Up' process that organized a ~45-developer company into four product teams, building cross-functionally and shipping consistently on a staggered cadence",
  "Shipped 40+ products across web, iOS, and Android — including a #1 Paid iPhone app and a platform that grossed $33M in year one. Co-founded a 20-person agency and a messaging app that raised $3M",
];

const skills = [
  "Expert in Figma & design systems — multi-platform component libraries, prototyping, hand-off",
  "Designing in front-end (prototypes to production) with Claude Code, Cursor and Tailwind",
  "Comfortable writing HTML / CSS / JS and working in React / Next.js / Tailwind CSS / TypeScript",
  "Fluent in GitHub — push/pull, branches, and PRs; Linear, Trello and Notion for sprint planning and docs",
];

// Keyword-dense tech line — exact tokens for ATS/keyword scans. Mirrors the
// `tools` array in components/resume/resumeData.ts (update together).
const tools =
  "Figma · Photoshop · React · Next.js · HTML · CSS · Tailwind CSS · JavaScript · TypeScript · " +
  "Claude Code · Codex · Cursor · Git · GitHub · data visualization · Recharts · D3 · OpenMaps · " +
  "React Flow · Framer Motion · Framer · Webflow · marketing sites · design systems · " +
  "component libraries · prototyping · wireframing · responsive design · interaction design · " +
  "motion design · front-end development · product design · UI/UX design · Linear · Notion · " +
  "iOS · Android · VR · Agile · Shape Up · design sprints";

const jobs = [
  ["Strangeworks", "Oct 2023 – Present", "Remote / Austin, TX",
    "Design Engineer / Director of Product · promoted from Senior Product Designer (Apr 2024)",
    "Lead product strategy and design at this data-science consulting company, building a suite of tools, apps, and optimization interfaces for Fortune 500 science teams running AI and quantum/HPC compute.",
    [
      "Promoted to Director of Product in 6 months. Researched internal processes and designed the vision for our workflow app Aura — hands-on from business strategy to production code",
      "Embedded with engineering, leadership, and the science team to prototype and ship across our compute platform, the Aura workflow app, docs, and multiple marketing sites",
      "Designed an AI-assisted app for data-science problem formulation and computation on HPC/quantum, plus dozens of client apps for optimization problems like staff scheduling and fleet vehicle routing",
    ]],
  ["QuotaPath", "Jan 2022 – Oct 2023", "Hybrid / Austin, TX",
    "Senior Product UX/UI Designer",
    "Led design across multiple product teams at this Series B SaaS platform for sales commission planning and tracking.",
    [
      "Shipped platform features monthly, from comp modeling and onboarding to sandbox and payout workflows",
      "Designed and launched the Compensation Hub, a commission library and modeling tool that drove $1.5M+ in new pipeline in a year",
      "Co-created the Shape Up process across 4 cross-functional teams and mentored the designers running it",
    ]],
  ["OneAssembly", "Feb 2021 – Jan 2022", "Austin, TX",
    "Product UX/UI Design Lead · Front-End Developer",
    "Designed and built this B2B device auction platform from idea to launch in a year, grossing $3M+ in the first beta month and $33M+ in year one.",
    [
      "Took the product from whiteboard to production launch on a 3-person dev team",
      "Designed most of it directly in code (React, Tailwind), plus the brand, marketing site, and go-to-market",
    ]],
  ["BnbFinder (now Savvy.com)", "May 2019 – Feb 2021", "Austin, TX",
    "Product UX/UI Design Lead · Front-End Developer",
    "Designed and built this travel listings platform to 8K subscribers (4K+ paid) in under a year on a 3-person team.",
    [
      "Built the consumer, owner, and admin apps in Elixir and React/Next.js on a custom Tailwind framework",
      "Shipped responsive front-ends across all three surfaces, demoing to stakeholders every two weeks",
    ]],
  ["Phobio : Rodio", "Jan 2018 – May 2019", "Austin, TX",
    "Product UX/UI Design Lead",
    "Designed Rodio, a retail workforce communication platform. Partnered with Fortune-100 Kronos and signed MarketSource (Target/Best Buy), reaching millions of daily interactions.",
    [
      "Built Rodio's multi-platform design system (master, web, iOS, Android) and led a team of 20 to 20K+ paid users",
      "Designed and pitched the demo that closed the Kronos and Form.com contracts and led to acquisition",
    ]],
  ["Timebomb", "Sep 2015 – Dec 2017", "Austin, TX",
    "Co-Founder · Product UX/UI Design Lead",
    "Co-founded and designed this conditional messaging app (iOS and Android). Raised $3M from angels including Katy Perry and Warner Bros., with a marketing partnership from Ellen.",
    [
      "Led a product team of 10 from concept to launch and 20K+ users",
      "Designed the pitch decks behind the $3M raise",
    ]],
  ["Made by Rocket", "Aug 2009 – Nov 2017", "Austin, TX",
    "Co-Founder · Product Designer · Front-End Developer",
    "Co-founded and grew this agency to 20 people across 30+ projects, including a #1 Paid iPhone app and work for Ellen, Need for Speed, DreamWorks, and The Economist. Became an ideation and prototyping lab for Warner Bros.",
    [
      "Designed and shipped A Beautiful Mess, a photo editing app that hit #1 Paid on the App Store and held top-100 for over a year",
      "Designed and prototyped apps for 30+ clients, from Ellen and DreamWorks to early-stage startups",
    ]],
];

const interests =
  "Guitar and vocals in a rock/metal band · Recording and mixing in Logic Pro · " +
  "Indoor soccer and racquetball · Mountain biking and endurance sports · " +
  "International travel (fluent in Spanish) · Adventures with my kids";

// ---- Build -----------------------------------------------------------------

const cell = (children, width, verticalAlign = VerticalAlign.CENTER) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    verticalAlign,
    children,
  });

const header = new Table({
  borders: TableBorders.NONE,
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: [AVATAR_COL, CONTENT_W - AVATAR_COL - DATES_W, DATES_W],
  rows: [new TableRow({
    children: [
      cell([new Paragraph({
        children: [new ImageRun({
          type: "png",
          data: circleAvatar(),
          transformation: { width: AVATAR_PX, height: AVATAR_PX },
          altText: { title: "Dave Keller", description: "Portrait of Dave Keller", name: "avatar" },
        })],
      })], AVATAR_COL),
      cell([
        new Paragraph({
          spacing: { line: 520, lineRule: LineRuleType.AT_LEAST },
          children: [new TextRun({ font: FONT, text: "Dave Keller", bold: true, size: 44 })], // 22pt
        }),
        new Paragraph({
          spacing: { before: 60, line: 280, lineRule: LineRuleType.AT_LEAST },
          children: [new TextRun({ font: FONT, text: TITLE, size: 21, color: GRAY })], // 10.5pt
        }),
      ], CONTENT_W - AVATAR_COL - DATES_W),
      cell([new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: spacing(),
        children: [
          new TextRun({ font: FONT, text: "512.595.6213  |  ", size: SMALL, color: GRAY }),
          link("linkedin/dkells", "https://www.linkedin.com/in/dkells/"),
          new TextRun({ font: FONT, text: "", break: 1 }),
          link("davekeller@me.com", "mailto:davekeller@me.com"),
          new TextRun({ font: FONT, text: "", break: 1 }),
          link("kidastro.com", "https://kidastro.com", { bold: true }),
        ],
      })], DATES_W),
    ],
  })],
});

const doc = new Document({
  title: "Dave Keller — Resume",
  creator: "Dave Keller",
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: BODY, color: INK },
        paragraph: { spacing: spacing() },
      },
    },
    // Repeated on the Normal style: some importers (Pages) skip docDefaults
    // and fall back to Times without this.
    paragraphStyles: [{
      id: "Normal", name: "Normal", quickFormat: true,
      run: { font: "Arial", size: BODY, color: INK },
      paragraph: { spacing: spacing() },
    }],
  },
  numbering: {
    config: [{
      reference: "plus",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "+", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 240, hanging: 240 } } },
      }],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 }, // US Letter
        margin: { top: MARGIN_V, bottom: MARGIN_V, left: MARGIN, right: MARGIN },
      },
    },
    children: [
      header,
      sectionTitle("Highlights"),
      ...highlights.map(h => bullet(h, { after: TOP_GAP })),
      sectionTitle("Skills"),
      ...skills.map(s => bullet(s, { after: TOP_GAP })),
      sectionTitle("Experience"),
      ...jobs.flatMap((j, i) => job(j, { first: i === 0 })),
      sectionTitle("Interests"),
      new Paragraph({ spacing: spacing(), children: [new TextRun({ font: FONT, text: interests })] }),
      sectionTitle("Tools & Technologies"),
      new Paragraph({ spacing: spacing(), children: [new TextRun({ font: FONT, text: tools })] }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUT, buffer);
  console.log("wrote", path.relative(REPO, OUT));
});
