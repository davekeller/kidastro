# Hidden /skills Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A hidden, unlinked grid page at kidastro.com/skills mixing Dave's Instagram-style personal photos with his 13 Claude skills (best practices distilled per skill), plus a downloadable zip bundle of the full skill files.

**Architecture:** Next.js 16 static export (GitHub Pages). The skill files are copied into `skills-library/` in the repo as the canonical source; a zero-dependency node script zips them into `public/downloads/dave-claude-skills.zip` (wired as `prebuild` so the bundle regenerates on every deploy, and committed so it works without a build). The `/skills` route is a normal app-router page that nothing links to, with `robots: noindex` metadata. Photos reuse personal images already in `public/imgs/` (no duplication).

**Tech Stack:** Next.js 16 (app router, `output: 'export'`), Tailwind CSS 4, framer-motion, system `zip` binary (present on macOS and ubuntu-latest CI).

**Testing reality:** This repo has no unit test runner — per the project's own conventions (Dave's `/test` skill), the frontend test gate is `npx tsc --noEmit` + `npm run build`, plus visual verification in the browser. Each phase ends with those gates, a commit, and a push.

---

## Phase 1 — Skills library content + downloadable bundle

### Task 1: Copy the 13 skills into the repo

**Files:**
- Create: `skills-library/<name>/SKILL.md` for all 13 skills (build, commit, css-dark-light-mode, deps, dev, fix, implement, main, phase, pr, review, sync-branch, test)
- Create: `skills-library/README.md`

- [ ] **Step 1: Copy skill folders**

```bash
mkdir -p skills-library
cp -R "/Users/dk/Git/Cowork/Skills Library/"* skills-library/
find skills-library -name .DS_Store -delete
```

- [ ] **Step 2: Add install README**

`skills-library/README.md`:

```markdown
# Dave Keller — Claude Skills

13 personal Claude Code skills: build, commit, css-dark-light-mode, deps, dev,
fix, implement, main, phase, pr, review, sync-branch, test.

## Install

Unzip into your personal Claude skills folder:

​```bash
unzip dave-claude-skills.zip -d ~/.claude/skills
​```

Each skill is a folder containing a `SKILL.md`. Claude Code picks them up
automatically as `/build`, `/commit`, `/pr`, etc.

Browse them rendered at [kidastro.com/skills](https://kidastro.com/skills).
```

- [ ] **Step 3: Verify 13 folders + README present**

Run: `ls skills-library` — expect 13 dirs + README.md.

### Task 2: Bundle script + prebuild wiring

**Files:**
- Create: `scripts/build-skills-bundle.mjs`
- Modify: `package.json` (scripts)
- Create (generated): `public/downloads/dave-claude-skills.zip`

- [ ] **Step 1: Write the bundle script**

`scripts/build-skills-bundle.mjs`:

```js
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(repo, 'skills-library');
const outDir = path.join(repo, 'public', 'downloads');
const outZip = path.join(outDir, 'dave-claude-skills.zip');

if (!existsSync(src)) {
  console.error('skills-library/ not found — nothing to bundle');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
rmSync(outZip, { force: true });
execSync(`zip -r -X "${outZip}" . -x "*.DS_Store"`, { cwd: src, stdio: 'inherit' });
console.log(`Skills bundle written to ${path.relative(repo, outZip)}`);
```

- [ ] **Step 2: Wire npm scripts**

In `package.json` scripts:

```json
"scripts": {
  "dev": "next dev",
  "prebuild": "node scripts/build-skills-bundle.mjs",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "bundle:skills": "node scripts/build-skills-bundle.mjs"
}
```

- [ ] **Step 3: Generate the bundle**

Run: `npm run bundle:skills`
Expected: zip listing of 13 skill folders, `Skills bundle written to public/downloads/dave-claude-skills.zip`

- [ ] **Step 4: Verify zip contents**

Run: `unzip -l public/downloads/dave-claude-skills.zip`
Expected: `README.md` + 13 `<skill>/SKILL.md` entries, no `.DS_Store`.

- [ ] **Step 5: Phase 1 gates — type check + build**

Run: `npx tsc --noEmit` → no errors. Run: `npm run build` → static export succeeds, `out/downloads/dave-claude-skills.zip` exists.

- [ ] **Step 6: Commit + push**

```bash
git add skills-library scripts/build-skills-bundle.mjs package.json public/downloads
git commit -m "feat: add skills library content and downloadable bundle"
git push -u origin dave/skills
```

---

## Phase 2 — Skills data + hidden /skills page

### Task 3: Skills + photos data module

**Files:**
- Create: `components/skills/skillsData.ts`

- [ ] **Step 1: Write the data module**

All 13 skills with distilled best practices, category accents from the site palette, and the 4 personal photo tiles (reusing existing `public/imgs` paths — band stage shot, bike race, kayaking, headshot). Full content lives in the implementation; shape:

```ts
export interface Skill {
  command: string;        // "/commit"
  title: string;          // "commit"
  category: Category;     // drives accent color
  description: string;    // one-liner from frontmatter
  practices: string[];    // 3-4 distilled best practices
}

export interface Photo {
  src: string;            // "/imgs/about/about1@2x.png"
  alt: string;
  caption: string;
  href: string;           // https://instagram.com/kid4stro
}

export const CATEGORY_ACCENTS: Record<Category, string> = {
  Workflow: '#39d5cb',      // commit, pr, sync-branch, main
  Shipping: '#e4416f',      // implement, phase
  'Build & Test': '#f4fd7b',// build, test, fix
  Environment: '#6ee7b7',   // dev, deps
  Quality: '#fcd34d',       // review
  Design: '#e4416f',        // css-dark-light-mode
};
```

### Task 4: Page + grid components

**Files:**
- Create: `app/skills/page.tsx` (server component: metadata with `robots: { index: false, follow: false }`, title "Skills — Dave Keller")
- Create: `components/skills/SkillsView.tsx` (client: hero with download button, masonry-ish responsive grid interleaving skill cards and photo tiles, framer-motion stagger)
- Create: `components/skills/SkillCard.tsx` (category chip with accent, monospace `/command`, description, practices list)
- Create: `components/skills/PhotoTile.tsx` (next/image, hover overlay with caption + @kid4stro, links to Instagram)

Design constraints:
- Inherits global dark gradient + Starfield/NorthernLights chrome from `app/layout.tsx` — no page-level background
- Bricolage Grotesque headings, palette accents, `rounded`-card style consistent with `DownloadButton.tsx` (border-white/15, bg-black/30, backdrop-blur, hover accent)
- Download CTA: `<a href="/downloads/dave-claude-skills.zip" download>` pill button
- Photos interleaved after roughly every 4 skill cards (insert at grid positions 2, 7, 11, 15)
- No links from anywhere else on the site — the page stays hidden

- [ ] **Step 1: Implement data module + components + page**
- [ ] **Step 2: Phase 2 gates — `npx tsc --noEmit` clean, `npm run lint` clean, `npm run build` exports the `/skills` route into `out/`**
- [ ] **Step 3: Commit + push**

```bash
git add app/skills components/skills
git commit -m "feat: add hidden /skills grid page with photos and skill cards"
git push
```

---

## Phase 3 — Visual verification + polish + PR

- [ ] **Step 1: Run dev server, load http://localhost:3000/skills, screenshot, verify:** grid renders, photos load, hover states work, download link returns the zip, no console errors
- [ ] **Step 2: Fix any visual/layout issues found; re-run gates**
- [ ] **Step 3: Confirm hidden-ness:** no nav/footer links to /skills; page metadata contains noindex
- [ ] **Step 4: Commit + push any fixes**

```bash
git add -u && git commit -m "polish: skills page visual fixes" && git push
```

- [ ] **Step 5: Create PR against main with `gh pr create`** — summary covering: hidden route, grid design, bundle script + prebuild wiring, where to drop future IG photos

## Self-Review Notes

- Spec coverage: hidden URL ✓ (unlinked + noindex), grid with IG photos ✓ (4 personal photos, linked to instagram.com/kid4stro), skills + best practices ✓ (13 cards with distilled practices), downloadable remote bundle ✓ (static zip on GitHub Pages, regenerated each deploy), phased test/commit/push ✓, PR at end ✓
- Photos: `puppy/`, `guarded/`, `dance/` images are project mockups, NOT personal photos — excluded deliberately
- Static export constraint: no API routes; zip must live in `public/` — satisfied
