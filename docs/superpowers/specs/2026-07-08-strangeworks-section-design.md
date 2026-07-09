# Strangeworks work section — design

**Date:** 2026-07-08 · **Branch:** `strangeworks-section`

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
- Image grid: intentionally deferred. A `TODO` comment in the component marks
  where the 6-col grid rows go. Dave will drop screenshots into
  `public/imgs/strangeworks/`; spans get chosen to fit their aspect ratios
  (target: two rows).

## Copy (approved draft)

- **Tagline:** "An advanced-compute platform putting AI, quantum, and HPC to
  work for Fortune 500 science teams"
- **Paragraph:** "Advanced compute is powerful but hostile — real science
  problems show up as whiteboard sketches, not code. I lead product strategy
  and design across the platform, and designed Aura, our AI-assisted workflow
  app that takes a science team from problem formulation to results on quantum
  and HPC hardware — hands-on from business strategy to production code."
- **Role heading:** "Design Engineer / Director of Product"
- **Highlights:**
  1. Promoted from Senior Product Designer to Director of Product in 6 months
  2. Researched internal process and designed the vision for Aura, our workflow
     app — then helped build it in production code
  3. Embedded with engineering, leadership, and the science team to ship across
     the compute platform, docs, and marketing sites
  4. Designed an AI-assisted problem-formulation app, plus dozens of client
     optimization apps — staff scheduling, fleet routing, and more

## Out of scope

- Resume page/PDF/docx (already list Strangeworks)
- Any change to other sections' order or content
