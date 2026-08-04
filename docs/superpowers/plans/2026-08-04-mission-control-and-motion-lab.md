# Mission Control Orrery + Motion Lab — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Design doc:** [`../specs/2026-08-04-mission-control-and-motion-lab-design.md`](../specs/2026-08-04-mission-control-and-motion-lab-design.md) — read it first; every **[DECISION]** and **[COPY]** marker there is a review hook.

**Goal:** Three things. (1) Rebuild Mission Control as a full-bleed space scene — six cards floating as bodies around a line-art orrery, with icosahedron-grade drag/momentum physics. (2) Add a third wave of themes to `kidastro-themes`, weighted toward layouts the library lacks. (3) Build the missing **motion axis** — `data-motion` tokens beside `data-theme`, plus an easing lab — so a new project can be started by picking a theme *and* an animation style.

**Architecture:** Two repos, shipping independently.

- **`kidastro`** (Phases 1–3) — Next.js 16 static export. Mission Control is mounted in `app/layout.tsx`, so it loads on every page: **no new dependencies, and no three.js.** The orrery is a 2D canvas with hand-rolled projection, following the proven pattern in `kidastro-themes/src/components/AstroHedron.tsx`. Motion uses the framer-motion already installed.
- **`kidastro-themes`** (Phases 4–9) — Vite + React 19 + Tailwind v4 + React Router 7, zero runtime dependencies beyond React. Motion is CSS-variable-first for portability; the only JS is a ~40-line local spring integrator. Served at `kidastro.com/themes`, stitched into `out/themes/` by `kidastro`'s `deploy.yml`.

**Tech stack:** No new dependencies in either repo. That's a constraint, not an accident — see the two **[DECISION]** blocks in the design doc (§A3, §C1).

**Testing reality:** Neither repo has a unit test runner. Per Dave's `/test` convention the gate is types + build + visual check. Every phase ends with:

```bash
export PATH="/Users/dk/.nvm/versions/node/v22.14.0/bin:$PATH"
npx tsc --noEmit && npm run build
```

…then a commit and a push. **The in-app Browser pane throttles `requestAnimationFrame` to zero**, so it cannot verify any animation, spring, or canvas in this project — it renders framer-motion entrances frozen at `opacity: 0` and canvases blank. Static layout screenshots there are fine (force `opacity: 1` inline after hydration); **every motion claim must be confirmed in real Chrome.** Steps that need a real browser are marked **🌐**.

**Sequencing note:** Phases follow Dave's stated order (themes before motion). Open question #3 in the design doc offers the swap — Phase 6 first would mean the four new showcases in Phase 5 are authored motion-aware rather than retrofitted. The axes are independent; either order builds.

---

# REPO 1 — `kidastro` (Phases 1–3)

Branch: `claude/kidastro-mission-control-redesign-90c6bd` (already cut from `origin/main` at `25196be`).

## Phase 1 — The space scene

Structure and styling only. No physics yet, no orrery — a static, legible, correct scene first, so the motion work in Phase 3 lands on something already shipped.

### Task 1: Destination metadata

**Files:** modify `components/mission-control/destinations.ts`

- [ ] **Step 1: Extend the `Destination` interface**

Add two fields, both documented inline in the file's existing comment style:

```ts
/** Depth tier, 0.6 (far) – 1.0 (near). Drives scale, opacity, blur, parallax. */
depth: number;
/** Index into the site palette (--color-1..5); sets this body's accent phase. */
tone: number;
```

- [ ] **Step 2: Assign values across the six destinations**

Spread depth across three tiers so the field has front-to-back structure — do not
assign them in a monotonic run (`1.0, 0.75, 0.85, 0.6, 0.95, 0.7` reads as scatter;
`1.0, 0.9, 0.8, …` reads as a ramp). `tone` is `0–5` in registry order.

- [ ] **Step 3: Verify** — `npx tsc --noEmit` passes.

### Task 2: The orbit halo on the icons

**Files:** modify `components/mission-control/icons.tsx`

- [ ] **Step 1: Add an `OrbitHalo` wrapper**

A component taking `{ tilt, radius, period, children }` that renders a thin tilted
`<ellipse>` with a small `<circle>` riding it, `children` (the destination glyph)
centered inside. All strokes `currentColor` so the parent tint still drives it, matching
the file's existing `base` convention.

- [ ] **Step 2: Give each destination distinct halo params**

Different `tilt`, `radius`, and `period` per card — matched values would undo the whole
point. The orbiting dot animates via CSS (`offset-path` where supported, else a
`rotate` on a wrapper group); static under reduced motion.

- [ ] **Step 3: Verify** — types pass; halos render at 6-up without clipping the glyph.

### Task 3: The local star layer

**Files:** create `components/mission-control/ModalStarfield.tsx`

- [ ] **Step 1: Build it as ~40 positioned divs, not a canvas**

Deterministic positions (a seeded loop, not `Math.random()` at render — this is a client
component but stable output keeps it diff-friendly and avoids hydration churn). Each dot
gets a size (1–2px), a palette tint, a twinkle duration, and a `data-depth` for Phase 3
parallax.

- [ ] **Step 2: Add the twinkle keyframes to `app/globals.css`**

Follow the file's existing conventions: a named `@keyframes`, a class, and a
`prefers-reduced-motion` guard immediately after — the pattern used by `.color-bar`,
`.accent-text`, `.float-drift`.

- [ ] **Step 3: Verify** — types pass; dots visible above the backdrop blur.

### Task 4: The overlay rebuild

**Files:** modify `components/mission-control/MissionControl.tsx`

- [ ] **Step 1: Remove the panel**

Delete the `glass-panel float-drift gradient-ring` wrapper. This is the change that
makes the rest work — cards must stop living inside a box.

- [ ] **Step 2: Build the three layers**

Backdrop (`bg-[#04060f]/72` + `backdrop-blur-2xl` + radial vignette) → `ModalStarfield`
→ content column at `max-w-6xl`, `min-h-dvh`, centered, scrolling on short viewports.

- [ ] **Step 3: Move the close button to the overlay corner**

`size-10` circle, top-right of the overlay rather than the old panel header.

- [ ] **Step 4: Build the header block**

Orrery slot (empty placeholder this phase), eyebrow, title, subtitle, telemetry strip.
Use the proposed copy from design §A2 — it's marked **[COPY — redline me]**, so expect
Dave to redline it in review rather than treating it as final.

- [ ] **Step 5: Verify** — 🌐 layout correct at 375 / 768 / 1280 / 1440; page behind
      visibly defocused; local stars sharp.

### Task 5: The planet cards

**Files:** create `components/mission-control/PlanetCard.tsx`; modify `MissionControl.tsx`, `app/globals.css`

- [ ] **Step 1: Extract the card into `PlanetCard.tsx`**

Props: `destination`, `index`, `isHere`. It owns its own lighting, halo, and (Phase 3)
springs. `MissionControl.tsx` keeps layout and orchestration only — the current file
does both, which is why it's getting hard to read.

- [ ] **Step 2: Add the planet treatment**

Limb-light radial gradient (bright upper-left → transparent lower-right), inner top
highlight, hairline border, low-alpha outer atmosphere glow in the card's accent,
`rounded-3xl`. **Pair with a Tailwind `backdrop-blur-*` utility in the JSX** — raw
`backdrop-filter` in CSS is silently stripped by the pipeline.

- [ ] **Step 3: Apply the depth tier**

`depth` drives scale, opacity, and a hair of blur on the farthest tier only.

- [ ] **Step 4: Desync the accent clock**

Set `--i` per card and add `animation-delay: calc(var(--i) * -16.6s)` to its
`accent-text`. Six cards over the 100s cycle → each sits on a different palette color
while the field still drifts on the house clock. (Design §A4 **[DECISION]**.)

- [ ] **Step 5: Lay out the staggered arc**

3-up × 2 rows desktop with per-card `translateY` (`-18, +14, -8, +20, -14, +6` px); 2-up
with gentler offsets on mobile. **Keep DOM order left-to-right, top-to-bottom** so tab
order matches reading order.

- [ ] **Step 6: Verify** — 🌐 six distinguishable bodies, no two on a shared baseline,
      each on a different palette color; blurb text still legible over the lit surfaces
      (bump `text-white/50` → `/60` if not).

### Task 6: Phase 1 gate

- [ ] `npx tsc --noEmit && npm run build`
- [ ] 🌐 Real-Chrome pass at all four widths, plus reduced-motion on
- [ ] Commit, push, open PR

---

## Phase 2 — The orrery

### Task 1: Geometry and projection

**Files:** create `components/mission-control/Orrery.tsx`

- [ ] **Step 1: Read `AstroHedron.tsx` first**

`gh api repos/davekeller/kidastro-themes/contents/src/components/AstroHedron.tsx` — it
already solves dependency-free wireframe 3D with drag and momentum in this exact house
style. Follow its structure rather than inventing a second approach.

- [ ] **Step 2: Build the geometry**

Three rings (radii ~1.0 / 0.72 / 0.46) as 64-segment polylines on different tilted axes;
a 12-edge octahedron core; a faint ecliptic hairline with four ticks.

- [ ] **Step 3: Project and depth-sort**

Perspective divide, then paint back-half segments at lower alpha so the nesting reads.
Without the depth alpha it looks like flat overlapping circles.

- [ ] **Step 4: Add the satellites**

One dot per ring travelling at its own rate, each with a ~12-frame fading trail. This is
what makes it read as *tracking* something rather than decoration.

- [ ] **Step 5: Verify** — types pass; a static first frame renders recognizably.

### Task 2: Color and motion

**Files:** modify `components/mission-control/Orrery.tsx`

- [ ] **Step 1: Read the palette from CSS**

`getComputedStyle` on `--color-1..5`, lerped on the shared 100s clock — the same
approach `NorthernLights.tsx` uses to stay in sync with `.color-bar`. Do not hardcode
hexes; the site's ambient system is the point.

- [ ] **Step 2: Idle motion**

Slow auto-rotation on two axes at different rates, plus a `sin` float bob.

- [ ] **Step 3: Drag physics**

Port the model from `components/Icosahedron.tsx`: pointer capture, velocity averaged
over the trailing 5 samples, release into momentum with `0.96`-per-frame friction, zero
under `1e-4`. This is the feel the brief asked to echo — match it, don't approximate it.

- [ ] **Step 4: Reduced motion**

One static frame, no rAF, no drag handlers.

- [ ] **Step 5: Verify** — 🌐 grab and fling it. It should coast and settle, not stop
      dead. If it feels wrong, the fix is in the velocity averaging, not the friction.

### Task 3: Mount and gate

**Files:** modify `components/mission-control/MissionControl.tsx`

- [ ] **Step 1: Drop it into the header slot** — ~200px desktop, ~150px mobile,
      `aria-hidden`.
- [ ] **Step 2: Confirm no bundle regression** — `npm run build`, then check that
      `/skills` did **not** gain three.js and the shared layout chunk didn't grow.
      three.js legitimately lives in the `/`, `/games`, and `/lyrics` route chunks
      already; the failure mode is it appearing in the *shared* bundle, which means
      something imported r3f into the root-layout tree.
- [ ] **Step 3:** `npx tsc --noEmit && npm run build`; 🌐 verify; commit, push, PR.

---

## Phase 3 — Physics, motion, accessibility

### Task 1: Card motion

**Files:** modify `components/mission-control/PlanetCard.tsx`, `app/globals.css`

- [ ] **Step 1: Entrance** — spring `{ stiffness: 220, damping: 22, mass: 0.9 }` from
      `{ opacity: 0, scale: 0.82, y: 40 }`, staggered `0.04s * i`.
- [ ] **Step 2: Idle drift** — per-card keyframes, **unique durations 6.5–10.5s**,
      negative delays, ±0.6° rotate. Matched periods are the one thing that would sink
      this; vary every card.
- [ ] **Step 3: Hover** — spring `scale 1.045`, `y -6px`, ±7° tilt from pointer position
      within the card, `transformPerspective: 900`, **limb gradient center tracking the
      tilt** (that's what makes it a sphere, not a tilting rectangle).
- [ ] **Step 4: Press** — spring compress to `0.975`.
- [ ] **Step 5: Exit** — reverse stagger, scale down, drift outward.
- [ ] **Step 6: Verify** — 🌐 all five, plus `will-change: transform` present.

### Task 2: Field physics

**Files:** modify `components/mission-control/MissionControl.tsx`, `PlanetCard.tsx`, `ModalStarfield.tsx`

- [ ] **Step 1: Pointer parallax** — overlay-level tracking; each card and star
      translates by `depth * -12px` per axis through a `useSpring`
      (stiffness ~90, damping ~20). **The lag is the effect** — snapping to the cursor
      reads as jitter, not mass.
- [ ] **Step 2: Proximity nudge** — cards within ~160px are pushed along the
      cursor→card vector, falling off with distance, capped ~10px, spring-returned.
- [ ] **Step 3: Skip all pointer math when closed.**
- [ ] **Step 4: Verify** — 🌐 sweep the cursor across the field without clicking. It
      should feel like disturbing something suspended. Watch a frame graph; if parallax
      and nudge together drop frames, the nudge goes first.

### Task 3: Accessibility

**Files:** modify `components/mission-control/MissionControl.tsx`, `PlanetCard.tsx`

- [ ] **Step 1: Focus trap** — Tab currently escapes into the page behind the dialog.
      Cycle it within the dialog.
- [ ] **Step 2: Return focus** to the trigger pill on close.
- [ ] **Step 3: Arrow-key navigation** — ←/→/↑/↓ move focus between cards.
- [ ] **Step 4:** `aria-current="page"` on the active destination.
- [ ] **Step 5: Reduced motion** — drop parallax, nudge, and drift; keep a plain
      opacity fade. Verify the scene is still *composed*, not just still.
- [ ] **Step 6: Verify** — 🌐 keyboard-only round trip: open, arrow through all six,
      Tab cannot escape, Esc closes, focus lands back on the pill.

### Task 4: Copy and docs

**Files:** modify `components/mission-control/MissionControl.tsx`, `docs/copy-voice-guide.md`

- [ ] **Step 1: Settle the copy** against Dave's redlines from review.
- [ ] **Step 2: Add Mission Control to the voice guide's "Where copy lives"** — it's
      absent today, and this work rewrites that copy. Small gap, worth closing while
      we're here.

### Task 5: Phase 3 gate

- [ ] `npx tsc --noEmit && npm run build`
- [ ] 🌐 Full pass: four widths, reduced motion, keyboard-only, every page's overlay
- [ ] Commit, push, PR; merge Phases 1–3 to `main` (deploys automatically)

---

# REPO 2 — `kidastro-themes` (Phases 4–9)

**Prerequisite, once:**

```bash
git clone https://github.com/davekeller/kidastro-themes.git ~/Git/kidastro-themes
```

Then per the repo's own `CLAUDE.md`: branch, PR, never push `main`. Read that file before
touching anything — its **golden rule** is token-only styling, and it's the constraint
every phase below inherits.

Phases 4–9 are specified to **task** granularity. Steps get written at each phase's
kickoff, against the cloned repo — writing them now, from GitHub API reads of a repo not
yet on disk, would be guessing at line-level detail.

## Phase 4 — Shared sections for wave three

The 14 new components the wave-3 layouts need, built before the themes so each theme is
composition rather than component-authoring. All token-only; all reusable by the
existing 23 themes.

- [ ] **Task 1: App-shell set** — `Sidebar`, `AppTopBar`, `StatTile`, `ChartCard`
      (SVG sparkline/bars, token-colored), `FilterChips`
- [ ] **Task 2: Docs set** — `DocsNav`, `TOC`, `CodeBlock`, `Callout`
- [ ] **Task 3: Mobile set** — `DeviceFrame`, `ListRow`, `SegmentedControl`, `TabBar`,
      `Sheet`
- [ ] **Task 4: Gallery filtering** — tag chips + text filter in `Gallery.tsx`, driven
      off the `tags` already in the registry. At 27 cards a flat grid stops being
      browsable.
- [ ] **Task 5: Gate** — `npm run typecheck && npm run build`; 🌐 spot-check the new
      components under 3–4 existing themes (a token violation only shows up when the
      theme changes); PR

## Phase 5 — The four wave-three themes

Each is a `[data-theme]` block in `index.css`, a registry entry, and a custom
`src/showcases/<Name>Showcase.tsx`. Every showcase includes `TokenPanel` so theme pages
keep doubling as token docs.

- [ ] **Task 1: Console / Dashboard** — sidebar, top bar, KPI row, chart cards, table,
      filter chips
- [ ] **Task 2: Docs / Knowledge base** — three-column, anchor headings, TOC, code
      tabs, callouts, version pill
- [ ] **Task 3: Liquid / Chrome-spatial** — specular edges, heavy blur, refractive
      borders, concentric radii, slow caustics. Must not converge on the existing
      `glass` theme — that one is flat frost, this one is wet.
- [ ] **Task 4: Native / Mobile shell** — device frame, collapsing large title, list
      rows, segmented control, tab bar, sheet
- [ ] **Task 5: Update `docs/style-candidates.md`** with a wave-three section, matching
      the ✅-annotation convention already there
- [ ] **Task 6: Gate** — typecheck, build, 🌐 all four at three widths; PR

## Phase 6 — Motion token foundation

- [ ] **Task 1: Verify the Tailwind mechanism first.** Confirm `--ease-*` in
      `@theme inline` generates the utilities, and settle how durations are consumed
      (`duration-[var(--dur-2)]` vs. `.dur-1`…`.dur-5` helpers). **Do this before
      writing five token blocks** — it's the one unverified assumption in Part C, and
      it dictates the retrofit's shape.
- [ ] **Task 2: Author the five `[data-motion]` blocks** — `precise`, `springy`,
      `floaty`, `mechanical`, `cinematic` (values in design §C1)
- [ ] **Task 3: `src/motion/index.ts` + `types.ts`** — registry mirroring
      `src/themes/`, exporting the same values as JS numbers and spring configs for the
      instruments in Phase 7
- [ ] **Task 4: Retrofit the primitives** — replace hardcoded `duration-200`,
      `ease-out`, `hover:-translate-y-1` with motion tokens across
      `components/primitives` and `components/sections`. Same golden rule as color: no
      literals.
- [ ] **Task 5: Update `CLAUDE.md` and `README.md`** — document the motion axis
      alongside the token layer, and add an "add a motion style" section mirroring
      "add a theme"
- [ ] **Task 6: Gate** — typecheck, build, 🌐 confirm switching `data-motion` visibly
      changes feel with no layout shift; PR

## Phase 7 — The easing lab

`/motion` gallery + `/motion/:slug` detail, both wrapped in the repo's space chrome.

- [ ] **Task 1: Routes and gallery** — `/motion` with live curve previews per card
      (a dot running its lane on loop); `/motion/:slug` shell; register in `App.tsx`
- [ ] **Task 2: Curve atlas** — SVG plot per easing, control points drawn,
      `cubic-bezier()` values copyable, hover scrubs a dot along the curve
- [ ] **Task 3: Race track** — one lane per easing, triggered together; replay, loop,
      0.25× slow-mo, short/long travel; plus a cross-style compare mode
- [ ] **Task 4: Duration ladder** — the five tiers as true-scale bars, labeled with
      what each is for
- [ ] **Task 5: Interaction lab** — Button, Switch, Tabs, Accordion, Dropdown, Modal,
      Toast, Tooltip, Card, staggered list, all under the active tokens. **All ten
      primitives already exist** — this is composition, and it's the highest value per
      line on the page
- [ ] **Task 6: Spring bench** — stiffness/damping/mass sliders, live trace showing
      overshoot and settle, demo object. Needs the ~40-line local integrator (no
      dependency)
- [ ] **Task 7: Reduced-motion preview toggle** — forces the reduced-motion path so
      degradation is checkable without OS settings
- [ ] **Task 8: Motion token panel** — mirrors `TokenPanel`, copies the
      `[data-motion]` block
- [ ] **Task 9: Gate** — typecheck, build, 🌐 **all five styles must feel genuinely
      different in the interaction lab.** If two are hard to tell apart, the token
      values need retuning — that's a real finding, not a nitpick; PR

## Phase 8 — Combination and handoff

The payoff: pick a theme *and* an animation style.

- [ ] **Task 1: `?motion=<slug>` on `/theme/:slug`** — both attributes on one wrapper
      (`data-theme` + `data-motion`), motion selector added to the existing top bar
- [ ] **Task 2: `/start`** — pick theme + motion, get one copyable block: both token
      blocks, the `@theme inline` mapping, and a short instruction paragraph for
      Claude Code / Cursor
- [ ] **Task 3: Cross-check the matrix** — spot-check ~8 theme × motion pairs for
      combinations that fight (e.g. `mechanical` under `clay`). Document any that
      genuinely don't work rather than pretending all 135 are equally good
- [ ] **Task 4: Gate** — typecheck, build, 🌐 verify; PR
- [ ] **Task 5: Publish** — after merge, themes only go live when the portfolio
      redeploys: `gh workflow run deploy.yml --repo davekeller/kidastro`

## Phase 9 — `data-interaction`, third axis (optional)

Deferred by design, not forgotten — it changes *structure* rather than timing, which is
a genuinely different problem from motion. Build only if Dave says theme × motion isn't
the whole idea (design doc open question #5).

- [ ] **Task 1: Define the presets** — disclosure (modal / drawer / inline expand), nav
      (sticky / overlay / sidebar), hover affordance (lift / underline / cursor-follow),
      scroll behavior (reveal / pinned / none), cursor treatment
- [ ] **Task 2: `useInteractionStyle()` hook** — behavioral flags, since these are
      component-structure choices and can't live in CSS variables alone
- [ ] **Task 3: `/interaction` gallery + detail**
- [ ] **Task 4: Extend `/start` to three axes**

---

## Review checklist for Dave

Design doc open questions, in the order they block work:

1. **Copy** (design §A2) — Mission Control eyebrow / subtitle / telemetry line. Blocks
   Phase 1 Task 4, though it's trivially changed later.
2. **Card color** (§A4) — desynced shared clock (recommended) vs. fixed color per card.
   Blocks Phase 1 Task 5.
3. **Phase order** — themes-then-motion (as written, your stated order) vs.
   motion-then-themes (lands the novel piece sooner, avoids a retrofit). Blocks Phase 4.
4. **Wave-3 theme picks** (Part B) — Console, Docs, Liquid, Native, or swap for the
   listed alternates. Blocks Phase 5.
5. **Third axis** (§C1) — is Phase 9 real, or is theme × motion the whole idea?
