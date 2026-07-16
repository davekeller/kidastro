# Arcade CRT Polish — Design

**Date:** 2026-07-13
**Scope:** `/games` only — `Arcade.tsx`, `StarSwarm.tsx`, `RocketClimb.tsx`, `MoonGarden.tsx`, plus shared CSS in `globals.css`. No new dependencies.

## Problem

The three arcade games are drawn with flat solid fills only — zero glow, gradients, or
bloom. Next to the rest of the site (neon line-art icosahedron, glowing shooting stars,
ambient palette cycling on a 100s clock), they read as flat. Goal: one more level of
visual polish — modern, but keeping the site's dark/minimal/punk background character.

**Direction (user-picked):** Retro CRT arcade, primary; with a touch of material depth.
Refined, not kitschy — texture you feel more than see.

## Design

### A. Shared CRT screen treatment (CSS in `globals.css` + tiny JSX per game)

- `.crt-overlay` — pointer-events-none layer over each game canvas:
  scanlines (repeating-linear-gradient, ~7% opacity), radial vignette
  (transparent → ~0.32 black at the corners), and a whisper of RGB edge fringe
  (inset box-shadows: pink left, teal right, low alpha).
- `.crt-bezel` — box-shadow glow on the canvas itself. The glow color cycles
  through the site palette on the same 100s ambient clock as the color bar /
  accent text (`@keyframes bezel-glow-cycle`, rgba literals — **no `color-mix`
  inside keyframes**, it silently fails to compile).
- A 2px `.color-bar` accent line across the top of each game frame — reuses the
  existing site class, so it drifts on the shared clock.
- `.glass-panel` — frosted panel style (blurred dark glass, hairline border,
  inner top highlight) replacing the flat `bg-black/70` intro/pause/gameover
  boxes.
- All animation respects `prefers-reduced-motion` (the reused site classes
  already do; the bezel cycle gets its own guard).

### B. Phosphor bloom (canvas, per game)

A tiny helper in each game's draw scope:

```ts
const glow = (color: string, blur: number) => { ctx.shadowColor = color; ctx.shadowBlur = blur * dpr; };
const noGlow = () => { ctx.shadowBlur = 0; };
```

(`* dpr` because shadowBlur ignores the canvas transform — without it, glow is
half-strength on retina.)

Applied to primary entity shapes in their own palette color: aliens/enemies,
bolts/projectiles, player characters, goal objects, explosion rings (strongest),
score popups, banners, in-canvas HUD (softest). Detail strokes (eyes, limbs)
drawn after `noGlow()` where convenient. Blur radii ~6–16; restraint for
readability and perf.

### C. A little material depth

- Canvas background: subtle vertical gradient (deep navy → darker) instead of
  flat `#0b1020`, cached — not rebuilt per frame.
- Select "solid object" fills get gentle vertical gradients: player rocket
  body, bunkers, platforms/girders, plant cards.
- Entities stay flat + glow (line-art character preserved).

### D. Landing cards (`Arcade.tsx`)

Glassy cards (hairline border, faint blur), per-game palette accent
(teal/pink/yellow): icon drop-shadow glow, hover box-shadow glow in the game's
accent color, thin `color-bar` line across the card top.

## Verification

Static first frames render in the built-in preview (rAF is paused there, so
motion is verified via code review + user's own browser). Screenshot each game
+ landing before/after; console + server logs clean; `next build` passes.

## Out of scope

Gameplay changes, sound, mobile/touch controls, screen-curvature warping
(distortion filters), heavy chromatic aberration, new libraries.
