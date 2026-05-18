# /resume page — design spec

**Date:** 2026-05-18
**Author:** Dave Keller (with Claude)
**Status:** Approved for planning

## Goal

Add a new `/resume` page to kidastro.com that presents Dave's current resume in a site-native style — sitting over the existing aurora/starfield background rather than reading as a pasted document. Content mirrors the latest PDF (with older roles condensed). A matching static PDF download is offered for emailing.

## Non-goals

- Generating the PDF from the page (e.g., print-to-PDF or @page CSS). The PDF is a separately authored static asset.
- Adding a homepage link or top navigation to `/resume`. Footer entry only for now.
- Animating the resume content. The background chrome (aurora, starfield, color bar) is already animated; the resume itself is static.
- Restructuring the existing `Footer` component beyond adding a single icon.

## Content

### Header

- Name: **Dave Keller**
- Tagline: *Director of Product · Product UX/UI Designer · Front-End Developer*
- Contact (right side, stacked on desktop, below name on mobile):
  - `512.595.6213`
  - `davekeller@me.com` (mailto link)
  - `kidastro.com` (link to `/`)
  - `linkedin.com/in/dkells` (link to LinkedIn)
- Headshot: circular, ~120px diameter, top-left of the header. Expected asset path: `public/imgs/dave.jpg`. User supplies this image — if absent at build time, the page should render with a placeholder so the route doesn't break.

### Experience — full-detail entries

Render with company name (bold), role line, dates+location (right-aligned, muted), one-line summary, and the bullet list shown.

**Strangeworks** — Oct 2023 – Present · Austin, TX
*Director of Product · promoted from Senior Product Designer (Apr 2024)*

> Leading product strategy and design for a platform at the frontier of AI and quantum computing — helping teams access, run, and understand hybrid quantum-classical workloads.

- Promoted from Senior Product Designer to Director of Product within 6 months, taking on full ownership of product roadmap, design direction, and cross-functional execution
- Designing and prototyping web application experiences for strangeworks.com, translating complex quantum and AI concepts into clean, intuitive interfaces
- Partnering closely with engineering and leadership to shape the product vision for a platform used by researchers, enterprises, and developers worldwide

**QuotaPath** — Jan 2022 – Oct 2023 · Austin, TX
*Senior Product UX/UI Designer*

> Led design across multiple product teams at this Series B SaaS platform for sales commission modeling, tracking, and analysis.

- Shaped, validated, and shipped 10+ platform features — from comp modeling to onboarding flows, sandbox environments, and payout workflows
- Designed and launched the Compensation Hub (comp.quotapath.com) — a top-of-funnel plan library and modeling tool that became a key acquisition driver
- Co-created and rolled out the Shape Up product process across 4 product/engineering teams, improving planning clarity and shipping cadence

**Assembly (OneAssembly)** — Feb 2021 – Jan 2022 · Austin, TX
*Product UX/UI Design Lead · Front-End Developer*

> R&D'd this B2B device auction platform from idea to $3M+ in the first month of beta ($33M+ in the first year) with a dev team of 3.

- Architected, designed and developed the full product from whiteboard through a highly successful launch — conception through production on a lean 3-person team
- Built the majority of the front-end in code: React + Tailwind CSS (HTML/CSS/JS), and also designed the branding, marketing site, and go-to-market materials

**bnbfinder (now Savvy.com)** — May 2019 – Feb 2021 · Austin, TX
*Product UX/UI Design Lead · Front-End Developer*

> Built this niche travel listings platform from ideas to 8K subscribers (4K+ paid) in under a year with a dev team of 3.

- Conceived, designed and coded the full platform — consumer, owner, and admin apps — from scratch using Elixir, React/Next.js, and a custom Tailwind CSS framework
- Developed fully responsive front-end apps across all three product surfaces; drove agile process using Jira and Trello with bi-weekly stakeholder demos

### Experience — condensed entries

Render with company name (bold), role line, dates+location (right-aligned, muted), and a single-sentence summary. No bullets.

**Phobio : Rodio** — Jan 2018 – May 2019 · Austin, TX
*Product UX/UI Design Lead*
Led design for Rodio — a workforce communication platform for large retail. Within two years, partnered with a Fortune-100 (Kronos) and signed MarketSource (Target/Best Buy), reaching millions of daily interactions.

**Timebomb** — Sep 2015 – Dec 2017 · Austin, TX
*Co-Founder · Product UX/UI Design Lead*
Co-founded and led design for this conditional messaging app (iOS and Android). Raised $3M from angel investors including Katy Perry and Warner Bros., and landed marketing partnerships with Ellen DeGeneres and Warner Bros.

**Made by Rocket** — Aug 2009 – Nov 2017 · Austin, TX
*Co-Founder · Product Designer · Front-End Developer*
Co-founded and grew this agency from 2 to 20 employees on 30+ projects — including a #1 Paid iPhone App for A Beautiful Mess and apps for Ellen, Need for Speed, Dreamworks, and The Economist.

### Skills & Tools

`Figma · React / Next.js · Tailwind CSS · HTML / CSS / JS · iOS Design · Prototyping · Design Systems · Shape Up · Linear · Notion · GitHub`

### Interests

`Guitar & drums · Soccer · Dirt & mountain biking · Traveling South America (fluent in Spanish) · Adventuring with my kids`

## Layout

Top-to-bottom on desktop:

1. **Header band** — full-width, transparent. Inside: left column has headshot + name + tagline; right column has contact stack right-aligned. Vertical alignment: photo and contact top-aligned, name/tagline beneath the photo.
2. **Download PDF button** — small pill-style link near the top-right of the content column (or just below the header on mobile). Href: `/Dave_Keller_Resume.pdf`. Opens in a new tab.
3. **Experience** — section heading "EXPERIENCE" in small-caps muted style (matching the old resume's section labels). Then full-detail entries in order, then condensed entries. A thin divider may separate full from condensed if it reads cleanly; otherwise rely on whitespace.
4. **Skills & Tools** — section heading "SKILLS & TOOLS", then the single line.
5. **Interests** — section heading "INTERESTS", then the single line.

### Container

- `max-w-[820px]` horizontally centered.
- Generous top/bottom padding so the page breathes against the cosmic background — roughly `pt-32 pb-24` on desktop.
- Mobile: name/tagline/contact stack vertically, headshot centered above the name.

### Job entry layout

Each full entry uses a two-row pattern:

- **Row 1:** Company name (bold, larger) left + dates · location (muted, smaller) right, baseline-aligned via `flex justify-between items-baseline`.
- **Row 2 (below):** Role line in italic or medium-weight, muted slightly less than dates.
- **Summary paragraph** below the rows.
- **Bullets** below the summary using `+` glyphs (or the existing `/imgs/bullet.svg` if it visually fits). Bullet indent ~`pl-6`.

Condensed entries share rows 1 + 2, then a single sentence — no bullets.

## Visual treatment

- **Background:** the existing global chrome from `app/layout.tsx` (NorthernLights, Starfield, ColorBar) renders behind the page unchanged.
- **Heading color:** white (`text-white`).
- **Body color:** matches existing `p` style — `rgba(255,255,255,0.6)`. Already the default from `globals.css`.
- **Section labels** ("EXPERIENCE", "SKILLS & TOOLS", "INTERESTS"): small-caps or `uppercase`, `tracking-wider`, ~`text-xs`, muted to roughly `rgba(255,255,255,0.4)`.
- **Accent color** for the `+` bullet markers and any interactive hover states: site teal `#39d5cb` (CSS var `--color-2`). Hover for company names and external links: site pink `#e4416f` (CSS var `--color-3`), matching the footer pattern.
- **Font:** Bricolage for headings (inherited from layout); Inter or default for body (inherited from layout).
- **Divider lines** (between header and content, between full and condensed sections): `border-white/10`, matching the footer pattern.
- **No card/box wrapping** — content sits directly over the cosmic background.

## File changes

### New files

- `app/resume/page.tsx` — the route. Imports and renders `<Resume />`.
- `components/Resume.tsx` — the resume body. If the file grows past ~250 lines, split subcomponents into `components/resume/Header.tsx`, `components/resume/Experience.tsx`, etc.

### Modified files

- `components/Footer.tsx` — add a 4th `<li>` in the contact `<ul>`, using `/imgs/contact/resume.svg`, label "resume," linking to `/resume`. Apply `animate-float` with a `0.45s` delay to extend the existing rhythm.

### New static assets (supplied by user, not by code)

- `public/imgs/dave.jpg` — headshot for the header.
- `public/Dave_Keller_Resume.pdf` — emailable resume.

## Behavior

- The page is a static server-rendered Next.js page (no `'use client'` needed for content; the global chrome already provides client-side animation).
- The "Download PDF" link uses a standard `<a href="/Dave_Keller_Resume.pdf" target="_blank" rel="noopener">` — no JS download handling required.
- The page is reachable directly at `/resume`. Footer link on every page makes it discoverable.
- Browser tab title: "Resume — Dave Keller" (via `app/resume/page.tsx` route-level `metadata` export).

## Testing

- Manual visual check at desktop (≥1024px), tablet (~768px), and mobile (~390px) widths. Confirm:
  - Header content stacks correctly on mobile.
  - Job entries don't get a horizontal scrollbar when company name and date row are long.
  - Aurora background remains visible and uninterrupted behind the content.
  - The Footer's new resume icon aligns with the others and animates.
- Link checks: phone, email, kidastro.com, LinkedIn, PDF download all resolve.
- Verify the missing-asset case for `public/imgs/dave.jpg` either renders a placeholder or fails gracefully (consider using Next.js `<Image>` with a static fallback or accept that the user must drop the file before deploying).
- No automated tests are present in the project today, so no test file additions are required.

## Open questions to resolve during implementation

- Headshot placeholder strategy: render nothing? render a colored circle? render the existing icosahedron? — pick one when the asset is missing.
- Whether to use `bullet.svg` or a plain `+` text marker — decide visually during implementation.
- Exact spacing between the full-detail block and the condensed block — tune by eye.
