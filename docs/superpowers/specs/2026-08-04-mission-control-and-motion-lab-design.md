# Mission Control Orrery + Motion Lab — Design

**Date:** 2026-08-04
**Scope:** Two repos.
- **`kidastro`** (this repo) — Mission Control redesign: `components/mission-control/*`, `app/globals.css`, `docs/copy-voice-guide.md`. No new dependencies.
- **`davekeller/kidastro-themes`** (separate repo, served at `kidastro.com/themes`) — a third wave of themes, plus a new **motion axis** and easing lab. No new dependencies.

> **Heads up — this is three sub-projects, not one.** They live in two repos and ship
> independently. This document designs all three so the direction can be reviewed in
> one pass; the phased plan in
> [`../plans/2026-08-04-mission-control-and-motion-lab.md`](../plans/2026-08-04-mission-control-and-motion-lab.md)
> sequences them into shippable PRs.
>
> **Written while Dave was away**, so the open taste calls were decided rather than
> asked. Every one of them is flagged **[DECISION]** with its reasoning and the
> alternative, so they're cheap to overturn in review. Proposed copy is marked
> **[COPY — redline me]**.

## Architecture (settled 2026-08-05, supersedes anything below that conflicts)

kidastro.com is **the portfolio**, and its job right now is job applications. `/`
and `/resume` are the surfaces that matter and stay polished.

Everything else is a **satellite**: a separate little app, its own repo, its own
stack, free to be experimented with independently. `kidastro-themes` is the first;
there will be more. Satellites are stitched into the domain at deploy time
(`deploy.yml` checks each one out, builds it, and copies the output into
`out/<path>`), so they share the domain without sharing a codebase.

Three consequences that override earlier assumptions:

1. **Nothing gets merged into one repo.** Not the themes app, not future ones.
2. **Mission Control is the launcher for the constellation**, not just a nav for
   this app's pages. That's a change in what the component *is*, and it means it
   has to scale past a fixed six.
3. **It stays secret.** No home-page section, no footer link, no sitemap entry —
   the ghost pill is the only way in. Adding a satellite means editing
   `destinations.ts` and `deploy.yml` by hand, which is the accepted cost.

---

## Part A — Mission Control (repo: `kidastro`)

### Problem

`components/mission-control/MissionControl.tsx` is a `max-w-3xl` glass panel holding a
flat 3-column grid of six rounded-rectangle cards. It works, and it's the least
interesting surface on a site whose home page opens with a draggable wireframe
icosahedron trailing particles. Specifically:

- The **panel is the frame** — the cards are parked inside a box, so nothing floats.
- Every card is identical: same border, same fill, same `accent-text` icon tint on the
  same shared 100s clock, so all six pulse in unison and read as one object.
- The only motion is a single 7s `float-drift` on the panel and a `-translate-y-0.5`
  hover. Nothing has mass.
- The header is two lines of text. There's no graphic.

Goal: a bigger, full-bleed modal where the background falls away and six bodies float
in space around a line-art mission-control instrument — with the tactile,
momentum-driven feel of the home page icosahedron.

### Design

#### A1. The overlay — three layers, no panel

The `glass-panel float-drift gradient-ring` wrapper is **removed**. That single change
is what turns a box of cards into a field of bodies. Back to front:

1. **Backdrop.** Full-viewport `bg-[#04060f]/72` + `backdrop-blur-2xl`, plus a radial
   vignette (transparent center → `rgba(0,0,0,0.5)` corners). Because the site's
   `Starfield` and `NorthernLights` are `fixed z-0` behind everything, the blur takes
   them too — the page and its ambient chrome all defocus together, which reads as
   depth of field rather than a scrim.
2. **Local star layer** (`ModalStarfield.tsx`, new). ~40 absolutely-positioned dots,
   1–2px, tinted from `--color-1..5`, each with its own twinkle duration and a parallax
   depth multiplier. Sharp, sitting *above* the blur, so the modal has its own space
   rather than a blurred photo of someone else's. **Deliberately not a canvas** — 40
   divs with CSS keyframes cost nothing and avoid a third rAF loop on top of the
   existing Starfield and NorthernLights canvases.
3. **Content.** Header, then the planet field. Column capped at `max-w-6xl`
   (up from `max-w-3xl`), vertically centered, `min-h-dvh`, scrolls on short viewports.

#### A2. The header

```
             ╭─────────────────────────╮
             │   [ orrery, ~200px ]    │      ← A3
             ╰─────────────────────────╯
              kid astro // all systems nominal
                    Mission Control
              six destinations. pick a heading.
        ◉ current: portfolio · 6 bodies in system · esc to disengage
```

**[COPY — redline me]** The eyebrow, subtitle, and telemetry line above are proposals.
Checked against `docs/copy-voice-guide.md`: lowercase, short, concrete, a little wry,
no buzzwords, one em-dash budget respected. "all systems nominal" and "disengage" are
real flight-ops words, not marketing adjectives. The existing footer line
("shhh — you found the map. esc to close.") is folded into the telemetry strip; keep it
instead if you'd rather.

The close button moves out of the panel and onto the **overlay's** top-right corner as
a `size-10` circle — bigger target, and it no longer competes with the title block.

#### A3. The orrery — the line graphic

An **orrery / armillary sphere**: three nested wireframe rings on different tilted
axes, each rotating at its own rate, around a small tumbling octahedron core. One
satellite dot rides each ring trailing a short fade. A faint ecliptic hairline with
four tick marks sits behind it — the graticule of a tracking display.

**[DECISION] Why an orrery.** It's the one object that means both "solar system" (the
brief) and "mission control" (the brief), and as pure line art it rhymes with the
icosahedron without repeating it. Rejected: a wireframe radar dish (reads as ground
station, not system) and a globe-with-orbits (too close to a hundred SaaS hero
graphics).

**[DECISION] 2D canvas with hand-rolled 3D projection — not react-three-fiber.**
three.js is currently paid for **per route**: `/` (`Icosahedron` via `Intro`), `/games`
(`AstroHelmet`), `/lyrics` (`WolfMark`). `MissionControl` is mounted in
`app/layout.tsx`, so a static r3f import there would hoist three.js out of those route
chunks and into the **shared layout bundle every page loads** — newly taxing `/skills`,
and `/resume`, which doesn't even render the overlay (`MissionControl` returns `null`
there). `next/dynamic` would dodge the bundle but adds a loading state and a second
WebGL context stacked on the home page's live canvas. A 2D canvas is a few KB, has no
context contention, and — decisively — **Dave already proved this exact pattern**:
`kidastro-themes/src/components/AstroHedron.tsx` is a dependency-free wireframe
icosahedron with drag, momentum, and palette cycling. Same approach, same feel, no new
dependency. Alternative if the projection math disappoints in practice: lazy r3f via
`next/dynamic`, which stays a drop-in swap behind the same component boundary.

**Physics — the part the brief actually asked for.** Lifted from `Icosahedron.tsx`
because that's the feel being echoed: pointer capture on drag, velocity averaged over
the trailing 5 samples, released into momentum with `0.96`-per-frame friction, zeroed
under `1e-4`. Idle: slow auto-rotation on two axes plus a `sin` float bob. Colors lerp
through `--color-1..5` on the shared 100s clock, read from CSS custom properties so the
graphic stays inside the site's ambient system.

Reduced motion: one static frame, no rAF, no drag.

#### A4. The cards as planets

Six bodies. Each expresses "planet" through **lighting and satellites**, not silhouette.

**[DECISION] Rounded cards with planet treatment, not literal circles.** Circles are
the obvious read of "like a planet," but a circle can't hold a title *and* a blurb at
6-up, and it shrinks the tap target badly on mobile. Instead each card keeps its shape
and gains:

- **An orbit halo on the icon.** The existing wireframe icons (icosahedron, resume,
  helmet, wolf, vault, themes) get a thin tilted ellipse ring drawn around them with a
  single small dot riding it. Per-card ring tilt, radius, and orbit period all differ.
  Each icon becomes *a body with a satellite* — line art, on-brand, zero legibility
  cost. This is what sells "solar system" at a glance.
- **Limb lighting.** A radial-gradient overlay bright at the upper-left falling to
  transparent at the lower-right, so the face reads as a lit sphere. On hover the
  gradient's center **shifts with the tilt** (A5.4) — that's the detail that makes it a
  sphere rather than a tilting rectangle.
- **Atmosphere.** A low-alpha outer glow in the card's current accent color, an inner
  top highlight, and a hairline border. `rounded-3xl`. Paired with a Tailwind
  `backdrop-blur-*` utility in the JSX, **never raw `backdrop-filter` in CSS** — the
  pipeline silently strips it (same family as `color-mix` inside `@keyframes`).
- **Depth tier.** Each destination gets a `depth` of 0.6–1.0 driving scale, opacity, a
  hair of blur on the farthest tier, and its parallax multiplier. Three tiers is plenty.

**Arrangement.** A staggered arc, not a grid: 3-up × 2 rows on desktop with per-card
`translateY` offsets (`-18, +14, -8, +20, -14, +6` px) so no two cards share a baseline.
2-up with gentler offsets on mobile. **DOM order stays left-to-right, top-to-bottom**,
so tab order matches reading order despite the scatter.

**[DECISION] Desync the existing accent clock; don't give cards fixed colors.** Six
bodies need to be distinguishable, and today all six pulse together. The tempting fix
is a fixed palette color per card — but the site's ambient system is a *shared* 100s
clock, and cards elsewhere deliberately stay white. So instead: keep `accent-text` and
give each card a negative `animation-delay` of `calc(var(--i) * -16.6s)`. Six cards
across a 100s cycle means each sits on a different palette color at any instant, the
whole field still drifts on the house clock, and the convention survives intact. The
fixed-color version is a one-line change if you prefer it louder.

#### A5. Motion and physics

Framer Motion is already a dependency. **Springs, not tweens**, throughout.

1. **Entrance** — per card `{ opacity: 0, scale: 0.82, y: 40 }` → spring
   `{ stiffness: 220, damping: 22, mass: 0.9 }`, staggered `0.04s * i`. Bodies settling
   into orbit.
2. **Idle drift** — per-card CSS keyframes with unique durations (6.5–10.5s), negative
   delays, and a ±0.6° rotate. **Different periods on every card is the single most
   important detail in this whole design** — matched periods are what make the current
   panel read as furniture.
3. **Pointer parallax** — overlay-level pointer tracking; each card translates by
   `depth * -12px` per axis through a `useSpring` (stiffness ~90, damping ~20) so it
   *lags* the cursor. The lag is what implies mass.
4. **Hover** — spring to `scale 1.045`, `y -6px`, and a 3D tilt of up to ±7° derived
   from pointer position *within* the card (`transformPerspective: 900`), with the limb
   gradient tracking the tilt.
5. **Proximity nudge** — cards within ~160px of the cursor are pushed along the
   cursor→card vector, magnitude falling off with distance, capped ~10px, spring-
   returned. Subtle. This is the closest analogue to the icosahedron's tactility: the
   field reacts to you *before* you touch it.
6. **Press** — spring compress to `0.975`.
7. **Exit** — reverse stagger, scale down and drift outward.

Reduced motion drops 3, 5, and the drift in 2, and keeps a plain opacity fade. Cards get
`will-change: transform`; all pointer math is skipped when closed (the subtree unmounts
inside `AnimatePresence` anyway).

#### A6. Accessibility — upgraded, because the modal is now the main event

Already correct and kept: `Escape` to close, body scroll lock, `role="dialog"`,
`aria-modal="true"`, `aria-label`, initial focus on the close button.

Added:
- **Focus trap.** Tab currently escapes into the page behind the dialog. Cycle it.
- **Return focus** to the trigger pill on close.
- **Arrow-key navigation** between cards (←/→/↑/↓). Fitting for a mission-control panel
  and good keyboard UX for a six-item grid.
- `aria-current="page"` on the active destination, alongside the visual "you are here".
- Orrery canvas gets `aria-hidden`.
- Re-check blurb contrast — `text-white/50` over the new lit surfaces may need `/60`.

#### A6b. The solar system (added 2026-08-05 — supersedes the arc grid in A1/A4)

The staggered arc of cards is gone. The layout is now literal: **the star at the
center, planets on a ring around it.**

- **The star** is the whole header block — orrery, eyebrow, title, subtitle,
  telemetry — absolutely centered in a square field. The orrery is the body at its
  core.
- **The planets** are the destinations, one ring, evenly spaced. No cards: a
  bordered rectangle was the thing making the old version read as furniture. Each
  planet is the haloed glyph (sized up from 56px to 88px) with an atmospheric glow
  behind it, the title under that, the blurb under that — and the whole stack is
  one link.
- **Mechanics.** `.mc-arm` is a zero-size point pinned at the field center that
  rotates; `.mc-orbit-offset` pushes its child out to the ring radius;
  `.mc-upright` counter-rotates by the same amount so labels stay level instead of
  tumbling. Arm and counter share a duration and delay, so they cancel exactly.
- **One shared period (240s).** Real bodies on one ring keep their spacing, and
  varying the speed would let planets drift into each other and collide labels.
  Per-body life comes from the existing `.mc-drift-*` instead. At this radius the
  motion is a few px/second — present when you watch it, calm when you don't.
- **Hover and focus pause the whole system.** Steadier than trying to make a
  moving target clickable, and it's four lines of CSS.
- **Mobile drops the orbit.** Below `sm` the field is a plain two-column grid of
  the same planets — an orbit needs room a phone doesn't have. Mobile-first, so the
  orbit engages inside one `min-width: 640px` block rather than being undone.
- **Reduced motion** keeps the ring arrangement. The static `rotate(angle)` inline
  on each arm is the fallback: with the animation off, that inline transform is
  what spreads the planets instead of stacking all six at twelve o'clock.

Two things this retired: `.mc-limb` (no card face to light) and the hover tilt (a
round body wants a scale, not a plane rotation). Arrow-key navigation also stopped
probing `gridTemplateColumns` — a ring has no rows or columns, so all four arrows
walk the ring order and wrap. That removes the fragile grid-column reading noted
in A6 entirely.

#### A7. Scaling past six (added 2026-08-05)

Mission Control is the constellation launcher, so the destination list grows every
time a satellite ships. Three things were hardcoded to exactly six bodies and are
now derived:

- **The accent desync divisor.** `-100 / 6` became `-ACCENT_CYCLE_S / total`. A
  fixed divisor stops distributing evenly across the 100s cycle the moment a
  seventh card appears — two bodies would drift onto the same color, which is the
  one thing A4's decision existed to prevent.
- **The subtitle.** "six destinations" is now "pages and satellites" — count-free,
  and it names the two kinds.
- **The telemetry strip.** "6 bodies in system" is now "5 pages, 1 satellite",
  pluralized, derived.

`HALOS`, `ARC_OFFSETS`, and `DRIFT_DURATIONS` are indexed modulo their length, so
they already wrap safely at any count. Verified, not assumed.

**`external?: boolean` → `kind: 'page' | 'satellite'`.** The old flag described a
routing consequence; the new field describes what the thing *is*, and routing
follows from it. Satellite cards carry a small "satellite ↗" marker, because
following one is a real page load out of this deployment and that's worth
signalling. Per-card marker rather than grouped clusters: grouping is the right
answer at three or more satellites, and building it for one would look lopsided.

#### A8. Files

| File | Change |
|---|---|
| `components/mission-control/MissionControl.tsx` | Rewrite — overlay layers, header, a11y, motion orchestration |
| `components/mission-control/PlanetCard.tsx` | **New** — one body: lighting, halo, hover/nudge springs |
| `components/mission-control/Orrery.tsx` | **New** — canvas line graphic + drag physics |
| `components/mission-control/ModalStarfield.tsx` | **New** — sharp local star layer |
| `components/mission-control/destinations.ts` | Add `depth`; replace `external` with `kind`; document the add-a-satellite procedure |
| `components/mission-control/icons.tsx` | Add the orbit-halo wrapper |
| `app/globals.css` | Drift variants, twinkle, limb-light helper, reduced-motion guards |
| `docs/copy-voice-guide.md` | Add Mission Control to "Where copy lives" — it's missing today |

That last row is a real gap found in passing: the voice guide's copy inventory doesn't
list Mission Control, and this work rewrites its copy.

---

## Part B — Themes, wave three (repo: `kidastro-themes`)

### Problem

The registry already holds **23 themes**, and `docs/style-candidates.md` shows all
twelve curated layout-signature candidates are built and checked off. "Extend the
themes" therefore needs a *direction*, not another token block — and every one of the
23 is a **marketing one-pager**. That's the actual gap.

### Design

**[DECISION] Four new themes, each a layout signature the library doesn't have yet —
weighted toward reuse rather than novelty.** The repo's stated purpose is bootstrapping
prototypes and case studies, and the two things you actually start building most often
(an app shell and a docs site) aren't in the set at all.

| # | Theme | Layout signature | Why |
|---|---|---|---|
| 1 | **Console / Dashboard** | Fixed sidebar nav, top bar with search + avatar, KPI stat row, chart cards, data table, filter chips | Not one of the 23 is an app shell. Highest reuse of anything on this list. |
| 2 | **Docs / Knowledge base** | Three columns: nav sidebar, prose with anchor headings, right-hand "on this page" TOC; code blocks with tabs, callouts, version pill | Second-highest reuse. Every tool project needs docs chrome. |
| 3 | **Liquid / Chrome-spatial** | Specular-edged translucent panels, heavy blur, refractive borders, concentric radii, slow caustics | The current 2026 look. Distinct from `glass`: that one is flat visionOS frost, this one is wet and specular. |
| 4 | **Native / Mobile shell** | Device viewport frame, collapsing large-title header, list rows with chevrons, segmented control, bottom tab bar, sheet | Mobile case studies, and it stress-tests every primitive at small scale. |

Alternates if you'd rather swap any: scrollytelling/narrative, cyberpunk HUD, System-7
pixel OS, zine/risograph, keynote-deck.

**New shared sections these need** (~14, all token-only per the repo's golden rule, all
reusable by existing themes): `Sidebar`, `AppTopBar`, `StatTile`, `ChartCard` (SVG
sparkline/bars, token-colored), `FilterChips`, `DocsNav`, `TOC`, `CodeBlock`, `Callout`,
`DeviceFrame`, `ListRow`, `SegmentedControl`, `TabBar`, `Sheet`. Existing `Table`,
`Tabs`, `Modal`, `Dropdown`, `Progress`, `Breadcrumb`, `Pagination` are reused as-is.

**Gallery filtering.** At 27 cards a flat grid stops being browsable. Add tag filter
chips and a text filter to `Gallery.tsx`, driven off the `tags` already in the registry.

---

## Part C — The motion axis and easing lab (repo: `kidastro-themes`)

### Problem

The brief: *"a page that is nice animations and easing, like a little easing library …
if I wanted to create a new website and pick a theme, an animation style, or an
interaction style, I could do that."*

There's a clean hook for this. The repo's own `docs/plan.md` §4 lists six token
categories, the last being **"Motion — default transition timing/easing."** It was never
built: `index.css`'s `@theme inline` block maps color, shape, and type only. So motion
isn't a new bolt-on — it's the missing axis, and building it makes that sentence
literally true.

### Design

#### C1. Motion tokens — a second `data-` axis

Motion becomes `data-motion` sitting beside `data-theme` on the same wrapper, with
values in `index.css` exactly like theme blocks:

```css
[data-motion="precise"] {
  --ease-out:      cubic-bezier(0.2, 0, 0, 1);
  --ease-in:       cubic-bezier(0.6, 0, 1, 1);
  --ease-in-out:   cubic-bezier(0.5, 0, 0, 1);
  --ease-emphasis: cubic-bezier(0.3, 1.4, 0.4, 1);  /* slight overshoot */

  --dur-1:  90ms;   /* micro    — hover, focus ring */
  --dur-2: 160ms;   /* control  — button, switch */
  --dur-3: 260ms;   /* surface  — dropdown, tooltip */
  --dur-4: 420ms;   /* overlay  — modal, drawer */
  --dur-5: 700ms;   /* scene    — section reveal */

  --travel-sm: 4px;  --travel-md: 12px;  --travel-lg: 28px;
  --lift: -2px;      /* hover lift */
  --press: 0.985;    /* press scale */
  --stagger: 40ms;
}
```

Five styles, each the motion counterpart of an aesthetic already in the library:

| Slug | Character | Rhymes with |
|---|---|---|
| `precise` | Short, tight, minimal overshoot | `linear`, `minimal` |
| `springy` | Overshoot and settle, bouncy | `clay`, `candy`, `neubrutalist` |
| `floaty` | Slow, long travel, soft eases | `glass`, `aurora`, `liquid` |
| `mechanical` | Linear and stepped, zero overshoot, near-instant | `specsheet`, `terminal` |
| `cinematic` | Long, heavy ease-in-out, big travel | `kinetic`, `broadsheet` |

Wired into Tailwind through `@theme inline` — `--ease-*` is a first-class Tailwind v4
namespace, so `ease-out` / `ease-emphasis` become real utilities. Durations aren't a
`@theme` namespace, so those are consumed as `duration-[var(--dur-2)]` (or via thin
`.dur-1`…`.dur-5` helpers). **Flagged as the one implementation detail to verify first**
— confirm the generated utilities before retrofitting components.

**[DECISION] "Animation style" and "interaction style" are one axis, not two.** The
brief names them as near-synonyms, so `data-motion` carries the interaction-level
values too — `--lift`, `--press`, `--stagger` are *behavioral* feel, not just curves.
A full third axis (`data-interaction`: drawer-vs-modal disclosure, sticky-vs-overlay
nav, cursor treatment, scroll-reveal behavior) is a genuinely different thing because
it changes *structure*, not timing. It's specced as an optional final phase rather than
folded in, so theme × motion lands first.

**[DECISION] CSS-first, zero new dependencies.** Not framer-motion. The repo's entire
value proposition is that its output is *portable* — copy a token block and some
components into a fresh project and go. A motion system expressed as CSS variables and
transitions copies anywhere; one expressed as framer-motion springs drags a runtime and
an API along with it. Springs still need JS, so the spring bench gets a ~40-line local
integrator. Cost: no layout animations or gesture physics in the themes repo. Worth it.

#### C2. `/motion` — the gallery

Mirrors the theme `Gallery`: one card per style, each **previewing its own curve live**
(a dot running the lane on loop, so you feel the difference before clicking through).
Same space chrome — `Starfield`, `NorthernLights`, color bar, `AstroHedron` sign-off.

#### C3. `/motion/:slug` — the easing lab

The "little easing library" page. Seven sections:

1. **Curve atlas** — an SVG plot per easing with control points drawn and the
   `cubic-bezier()` values as copyable text. Hover scrubs a dot along the curve.
2. **Race track** — the comparison strip: one lane per easing, all triggered together.
   Controls: replay, loop, 0.25× slow-mo, short/long travel. Also a cross-style compare
   mode (one lane per motion style) — the fastest way to feel why `springy` isn't
   `floaty`.
3. **Duration ladder** — the five tiers as bars at true scale, labeled with what each is
   for. Makes the system legible, not just pretty.
4. **Interaction lab** — real primitives running under the active tokens: Button
   hover/press, Switch, Tabs indicator slide, Accordion expand, Dropdown, Modal, Toast,
   Tooltip, Card lift, and a staggered list. **All ten already exist** — this is
   composition, not new components. Highest value per line of code on the page.
5. **Spring bench** — stiffness / damping / mass sliders, a live trace showing overshoot
   and settle time, and a demo object driven by it. Springs aren't beziers and deserve
   their own instrument.
6. **Reduced-motion preview** — a toggle that forces the reduced-motion path so you can
   check degradation without digging into OS settings.
7. **Motion token panel** — mirrors `TokenPanel`; copies the `[data-motion]` block.

#### C4. The combination surface — the actual payoff

- `?motion=<slug>` on `/theme/:slug`, with a motion selector in the existing top bar.
  Both attributes land on the same wrapper: `data-theme="clay" data-motion="springy"`.
  Nothing re-renders — only variables change, exactly like theme switching.
- **`/start`** — pick a theme, pick a motion style, get **one copyable block**: both
  token blocks, the `@theme inline` mapping, and a short instruction paragraph for
  Claude Code / Cursor. This is the brief's sentence, executed.

---

## Verification

No unit test runner in either repo. Per Dave's `/test` convention the gate is
`npx tsc --noEmit` (or `npm run typecheck`) plus a production build, then visual
confirmation — every phase ends on those.

**Important limitation to plan around:** the in-app Browser pane throttles
`requestAnimationFrame` to zero, so framer-motion entrances freeze at `opacity: 0`,
canvases render blank, and nothing time-based can be verified there. It's good for
static layout screenshots (force `opacity: 1` inline after hydration) and useless for
this project's actual subject matter. **Every motion and physics claim in Parts A and C
has to be confirmed in real Chrome or on device** — mine or Dave's, but not the preview
pane. Phases are written so the motion-heavy checks land where a real browser is
available.

Node: prefix commands with `export PATH="/Users/dk/.nvm/versions/node/v22.14.0/bin:$PATH"`.
The default shell Node is v16 and both repos need ≥20.9.

**Deploy coupling:** `kidastro-themes` merges don't go live on their own. The themes
build is stitched into `out/themes/` by `kidastro`'s `deploy.yml`, so publishing Parts B
and C needs `gh workflow run deploy.yml --repo davekeller/kidastro` after the themes PR
merges.

---

## Open questions for review

**Settled**

- ~~Phase order~~ — themes before motion, as originally stated. Phases 4 and 5 shipped.
- ~~Card color~~ (A4) — desynced shared clock. Built, and now derived from the live
  count rather than a fixed divisor (A7).
- ~~Wave-3 theme picks~~ (B) — Console, Docs, Liquid, Native. All four built.
- ~~The connection to the themes app~~ — fix the Mission Control card and stay
  hidden. No home-page section; the portfolio stays focused on the job search. See
  the Architecture note at the top.

**Still open**

1. **Copy** (A2) — the eyebrow, subtitle, and telemetry line are still mine, not
   yours. The Themes card blurb changed from "ambient color experiments" (which had
   become simply untrue) to "portable ui themes — react / tailwind". Deliberately
   count-free: a theme count in this repo would drift every time the other repo
   gains a theme.
2. **Third axis** (C1) — is `data-interaction` worth building after, or is theme ×
   motion the whole idea?
3. **Where `/start` points** (C4, Phase 8) — with option 1 chosen, the Mission
   Control card goes to the themes gallery front door. Worth deciding later whether
   it should aim at `/start` instead once that exists.
