# Strangeworks work section — design

**Date:** 2026-07-08 · **Branch:** `strangeworks-section`
**Status:** Shipped. Copy below reflects the component as it stands; see
[Changes since ship](#changes-since-ship) for what moved after the original spec.

## Goal

Add a Strangeworks work section at the top of the portfolio page (first section
after the intro), since it's the current and most senior role. Cards ship now;
the image grid ships once real screenshots exist.

## Structure

- New `components/Strangeworks.tsx`, modeled directly on `Quotapath.tsx`:
  `AnimatedSection` wrapper with the standard two-card row — description card
  (title, italic tagline, paragraph) and highlights card (role + bulleted list).
- Wired into `app/page.tsx` immediately after `<Intro />`, followed by an
  `<AnimatedBreak />` before QuotaPath.
- Image grid: **shipped.** Four screenshots from `public/imgs/strangeworks/`
  (`strange1`–`strange4.webp`) across the 6-col grid, with `research & discovery`
  and `wireframes & flows` overlay labels on the middle pair. A `<GithubActivity />`
  block closes the section.

## Copy (as shipped)

- **Tagline:** "A data-science consulting company for Fortune 500 teams running
  AI, quantum, and HPC compute"
- **Paragraph 1:** "I lead product design across the platform — designing Aura,
  our AI-assisted workflow app that takes a science team from problem
  formulation to results on quantum and HPC hardware, plus custom web apps we
  build for clients."
- **Paragraph 2:** "I design primarily in Claude Code, Codex, and Tailwind —
  validating functional prototypes, then shipping the production code myself."
- **Role heading:** "Principal Product Designer / Design Engineer"
- **Highlights:**
  1. Promoted from Senior Product Designer to Principal Product Designer in 6 months
  2. Researched internal process and designed the vision for Aura, our workflow
     app — then helped build it in production code
  3. Embedded with engineering, leadership, and the science team to ship across
     the compute platform, docs, and marketing sites
  4. Designed dozens of client optimization apps — staff scheduling, fleet
     routing, and more

## Changes since ship

- **2026-08-10 — role retitled.** "Design Engineer / Director of Product" →
  "Principal Product Designer / Design Engineer", and highlight 1's promotion
  target changed from Director of Product to Principal Product Designer.
  Director of Product remains the title of record with the company; the change
  is a positioning move toward IC principal/staff design roles. Applied across
  the resume, PDF/DOCX generators, and LinkedIn at the same time. Note that
  site-wide metadata deliberately keeps "Lead Product Designer & Design
  Engineer" — see the level-word rule in `docs/copy-voice-guide.md`.
- **Undated — copy and grid revisions.** The tagline moved from
  "advanced-compute platform" to "data-science consulting company"; the single
  problem-framing paragraph became two paragraphs (role, then tools/method);
  highlight 4 dropped its problem-formulation clause. The deferred image grid
  shipped.

## Out of scope

- Resume page/PDF/docx (already list Strangeworks)
- Any change to other sections' order or content
