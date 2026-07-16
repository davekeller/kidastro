'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'ready' | 'playing' | 'paused' | 'gameover' | 'won';
type PlantType = 'starflower' | 'zap' | 'wall';
type AlienType = 'blob' | 'bucket' | 'skitter';

const W = 800;
const H = 600;
const COLS = 9;
const ROWS = 5;
const GRID_X = 90;
const GRID_Y = 122;
const CELL_W = 76;
const CELL_H = 92;

const PLANTS: { type: PlantType; name: string; cost: number; hp: number }[] = [
  { type: 'starflower', name: 'Starflower', cost: 50, hp: 80 },
  { type: 'zap', name: 'Zap Sprout', cost: 100, hp: 100 },
  { type: 'wall', name: 'Moon Wall', cost: 50, hp: 300 },
];

const ALIENS: Record<AlienType, { hp: number; speed: number }> = {
  blob: { hp: 100, speed: 14 },
  bucket: { hp: 220, speed: 11 },
  skitter: { hp: 60, speed: 26 },
};

interface Plant { type: PlantType; hp: number; maxHp: number; timer: number }
interface Alien { row: number; x: number; hp: number; maxHp: number; type: AlienType; chewing: boolean; flash: number; wob: number }
interface Pellet { row: number; x: number }
interface Star { x: number; y: number; vy: number; age: number; grounded: boolean }
interface Popup { x: number; y: number; text: string; age: number; color: string }

interface Sim {
  t: number;
  stardust: number;
  score: number;
  grid: (Plant | null)[][];
  aliens: Alien[];
  pellets: Pellet[];
  stars: Star[];
  popups: Popup[];
  spawns: { t: number; type: AlienType; row: number }[];
  spawnIdx: number;
  endT: number;
  skyTimer: number;
  selected: number | null;
  dig: boolean;
  cardCd: number[];
  hover: { row: number; col: number } | null;
  banner: { text: string; age: number } | null;
  bgStars: { x: number; y: number; a: number; r: number }[];
  puffs: { x: number; y: number; age: number }[];
}

function buildSpawns(): { t: number; type: AlienType; row: number }[] {
  const s: { t: number; type: AlienType; row: number }[] = [];
  const row = () => Math.floor(Math.random() * ROWS);
  for (let t = 6; t < 60; t += 8 + Math.random() * 2) s.push({ t, type: 'blob', row: row() });
  for (let t = 64; t < 138; t += 5.5 + Math.random() * 2) {
    const r = Math.random();
    s.push({ t, type: r < 0.55 ? 'blob' : r < 0.8 ? 'bucket' : 'skitter', row: row() });
  }
  for (let i = 0; i < 9; i++) {
    const r = Math.random();
    s.push({ t: 146 + i * 2.2, type: r < 0.5 ? 'blob' : r < 0.78 ? 'bucket' : 'skitter', row: row() });
  }
  for (let t = 170; t < 184; t += 5) s.push({ t, type: Math.random() < 0.5 ? 'blob' : 'skitter', row: row() });
  return s.sort((a, b) => a.t - b.t);
}

function newSim(): Sim {
  return {
    t: 0,
    stardust: 150,
    score: 0,
    grid: Array.from({ length: ROWS }, () => Array<Plant | null>(COLS).fill(null)),
    aliens: [],
    pellets: [],
    stars: [],
    popups: [],
    spawns: buildSpawns(),
    spawnIdx: 0,
    endT: 186,
    skyTimer: 5,
    selected: null,
    dig: false,
    cardCd: [0, 0, 0],
    hover: null,
    banner: null,
    bgStars: Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      a: 0.15 + Math.random() * 0.35,
      r: Math.random() < 0.7 ? 1 : 2,
    })),
    puffs: [],
  };
}

export default function MoonGarden({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>('ready');
  const [finalScore, setFinalScore] = useState(0);
  const phaseRef = useRef<Phase>('ready');
  const simRef = useRef<Sim>(newSim());

  const go = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // Phosphor glow helpers. shadowBlur ignores the canvas transform, so scale
    // by dpr or the bloom reads half-strength on retina displays.
    const glow = (color: string, blur: number) => {
      ctx.shadowColor = color;
      ctx.shadowBlur = blur * dpr;
    };
    const noGlow = () => {
      ctx.shadowBlur = 0;
    };
    // Cached background: subtle vertical depth instead of a flat fill.
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#0e1428');
    bgGrad.addColorStop(0.55, '#0b1020');
    bgGrad.addColorStop(1, '#070b17');

    const pos = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
    };

    const onMove = (e: MouseEvent) => {
      const { x, y } = pos(e);
      const s = simRef.current;
      const col = Math.floor((x - GRID_X) / CELL_W);
      const row = Math.floor((y - GRID_Y) / CELL_H);
      s.hover = col >= 0 && col < COLS && row >= 0 && row < ROWS ? { row, col } : null;
    };

    const onClick = (e: MouseEvent) => {
      if (phaseRef.current !== 'playing') return;
      const { x, y } = pos(e);
      const s = simRef.current;
      // 1. collect stars
      for (let i = s.stars.length - 1; i >= 0; i--) {
        const st = s.stars[i];
        if (Math.hypot(st.x - x, st.y - y) < 26) {
          s.stardust += 25;
          s.popups.push({ x: st.x, y: st.y, text: '+25', age: 0, color: '#F4FD7B' });
          s.stars.splice(i, 1);
          return;
        }
      }
      // 2. toolbar
      if (y < 100) {
        for (let i = 0; i < 3; i++) {
          const cx = 200 + i * 104;
          if (x > cx && x < cx + 96 && y > 12 && y < 92) {
            s.selected = s.selected === i ? null : i;
            s.dig = false;
            return;
          }
        }
        if (x > 200 + 3 * 104 && x < 200 + 3 * 104 + 60 && y > 12 && y < 92) {
          s.dig = !s.dig;
          s.selected = null;
        }
        return;
      }
      // 3. grid
      const col = Math.floor((x - GRID_X) / CELL_W);
      const row = Math.floor((y - GRID_Y) / CELL_H);
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
      if (s.dig) {
        if (s.grid[row][col]) s.grid[row][col] = null;
        return;
      }
      if (s.selected === null) return;
      const card = PLANTS[s.selected];
      if (s.grid[row][col] || s.stardust < card.cost || s.cardCd[s.selected] > 0) return;
      s.grid[row][col] = { type: card.type, hp: card.hp, maxHp: card.hp, timer: card.type === 'starflower' ? 5 : 0 };
      s.stardust -= card.cost;
      s.cardCd[s.selected] = 4;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (phaseRef.current === 'playing') go('paused');
        else if (phaseRef.current === 'paused') go('playing');
      }
      if (e.key === ' ' && phaseRef.current === 'ready') {
        e.preventDefault();
        go('playing');
      }
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('click', onClick);
    window.addEventListener('keydown', onKey);

    let raf = 0;
    let last = performance.now();

    const update = (dt: number) => {
      const s = simRef.current;
      s.t += dt;
      // spawns
      while (s.spawnIdx < s.spawns.length && s.spawns[s.spawnIdx].t <= s.t) {
        const sp = s.spawns[s.spawnIdx++];
        const def = ALIENS[sp.type];
        s.aliens.push({ row: sp.row, x: W + 20, hp: def.hp, maxHp: def.hp, type: sp.type, chewing: false, flash: 0, wob: Math.random() * 6 });
        if (sp.t >= 146 && !s.banner) s.banner = { text: 'FINAL SWARM!', age: 0 };
      }
      // sky stars
      s.skyTimer -= dt;
      if (s.skyTimer <= 0) {
        s.skyTimer = 6 + Math.random() * 2;
        s.stars.push({ x: GRID_X + 30 + Math.random() * (COLS * CELL_W - 60), y: 108, vy: 40, age: 0, grounded: false });
      }
      // stars fall / age
      for (let i = s.stars.length - 1; i >= 0; i--) {
        const st = s.stars[i];
        if (!st.grounded) {
          st.y += st.vy * dt;
          const gy = GRID_Y + 40 + Math.random() * 0; // settle inside grid area
          if (st.y > gy && st.y > GRID_Y + 40) {
            if (st.y > H - 60 || Math.random() < 0.02) st.grounded = true;
          }
          if (st.y > H - 50) {
            st.y = H - 50;
            st.grounded = true;
          }
        } else {
          st.age += dt;
          if (st.age > 8) s.stars.splice(i, 1);
        }
      }
      // plants
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const p = s.grid[r][c];
          if (!p) continue;
          if (p.hp <= 0) {
            s.grid[r][c] = null;
            continue;
          }
          p.timer -= dt;
          if (p.type === 'starflower' && p.timer <= 0) {
            p.timer = 8;
            s.stars.push({ x: GRID_X + c * CELL_W + CELL_W / 2 + (Math.random() * 30 - 15), y: GRID_Y + r * CELL_H + 20, vy: 0, age: 0, grounded: true });
          }
          if (p.type === 'zap' && p.timer <= 0) {
            const px = GRID_X + c * CELL_W + CELL_W / 2;
            if (s.aliens.some((a) => a.row === r && a.x > px)) {
              p.timer = 1.1;
              s.pellets.push({ row: r, x: px + 14 });
            }
          }
        }
      }
      // card cooldowns
      for (let i = 0; i < 3; i++) s.cardCd[i] = Math.max(0, s.cardCd[i] - dt);
      // pellets
      for (let i = s.pellets.length - 1; i >= 0; i--) {
        const pe = s.pellets[i];
        pe.x += 260 * dt;
        if (pe.x > W + 10) {
          s.pellets.splice(i, 1);
          continue;
        }
        let hit: Alien | null = null;
        for (const a of s.aliens) {
          if (a.row === pe.row && Math.abs(a.x - pe.x) < 18 && (!hit || a.x < hit.x)) hit = a;
        }
        if (hit) {
          hit.hp -= 20;
          hit.flash = 0.12;
          s.pellets.splice(i, 1);
        }
      }
      // aliens
      for (let i = s.aliens.length - 1; i >= 0; i--) {
        const a = s.aliens[i];
        a.flash = Math.max(0, a.flash - dt);
        a.wob += dt * 6;
        if (a.hp <= 0) {
          s.score += 1;
          s.puffs.push({ x: a.x, y: GRID_Y + a.row * CELL_H + CELL_H / 2, age: 0 });
          s.aliens.splice(i, 1);
          continue;
        }
        const front = a.x - 16;
        const cell = Math.floor((front - GRID_X) / CELL_W);
        const plant = cell >= 0 && cell < COLS ? s.grid[a.row][cell] : null;
        if (plant && front - (GRID_X + cell * CELL_W) < 42) {
          a.chewing = true;
          plant.hp -= 20 * dt;
        } else {
          a.chewing = false;
          a.x -= ALIENS[a.type].speed * dt;
        }
        if (a.x < GRID_X - 14) {
          setFinalScore(s.score);
          go('gameover');
          return;
        }
      }
      // puffs & popups
      for (let i = s.puffs.length - 1; i >= 0; i--) if ((s.puffs[i].age += dt) > 0.4) s.puffs.splice(i, 1);
      for (let i = s.popups.length - 1; i >= 0; i--) if ((s.popups[i].age += dt) > 1) s.popups.splice(i, 1);
      if (s.banner && (s.banner.age += dt) > 3) s.banner = null;
      // win
      if (s.t > s.endT && s.spawnIdx >= s.spawns.length && s.aliens.length === 0) {
        setFinalScore(s.score);
        go('won');
      }
    };

    const drawAstronaut = (x: number, y: number, cheer: boolean) => {
      const bob = Math.sin(simRef.current.t * 2.4) * 2;
      ctx.save();
      ctx.translate(x, y + bob);
      glow('rgba(255,255,255,0.75)', 8);
      // backpack
      ctx.fillStyle = '#c9ced9';
      ctx.fillRect(-13, -8, 6, 14);
      // body
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(-8, -10, 16, 20, 5);
      ctx.fill();
      // arms
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (cheer) {
        ctx.moveTo(-7, -6); ctx.lineTo(-13, -16);
        ctx.moveTo(7, -6); ctx.lineTo(13, -16);
      } else {
        ctx.moveTo(-7, -4); ctx.lineTo(-11, 4);
        ctx.moveTo(7, -4); ctx.lineTo(11, 4);
      }
      ctx.stroke();
      // legs
      ctx.beginPath();
      ctx.moveTo(-4, 10); ctx.lineTo(-4, 17);
      ctx.moveTo(4, 10); ctx.lineTo(4, 17);
      ctx.stroke();
      // helmet
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -18, 10, 0, Math.PI * 2);
      ctx.fill();
      noGlow();
      ctx.fillStyle = '#0b1020';
      ctx.beginPath();
      ctx.roundRect(-6, -22, 12, 9, 4);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(-3, -20, 3, 2);
      ctx.restore();
    };

    const drawPlant = (p: Plant, x: number, y: number) => {
      const hurt = p.hp / p.maxHp;
      ctx.save();
      ctx.translate(x, y);
      if (hurt < 0.99) {
        ctx.globalAlpha = 0.55 + 0.45 * hurt;
      }
      if (p.type === 'starflower') {
        ctx.strokeStyle = '#39d5cb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 22); ctx.lineTo(0, 2);
        ctx.stroke();
        glow('#F4FD7B', 9);
        for (let i = 0; i < 6; i++) {
          const ang = (i / 6) * Math.PI * 2 + simRef.current.t;
          ctx.fillStyle = '#F4FD7B';
          ctx.beginPath();
          ctx.arc(Math.cos(ang) * 10, -6 + Math.sin(ang) * 10, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, -6, 5, 0, Math.PI * 2);
        ctx.fill();
        noGlow();
      } else if (p.type === 'zap') {
        glow('#39d5cb', 9);
        ctx.strokeStyle = '#39d5cb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 22); ctx.lineTo(0, -2);
        ctx.stroke();
        ctx.fillStyle = '#39d5cb';
        ctx.beginPath();
        ctx.arc(2, -8, 9, 0, Math.PI * 2);
        ctx.fill();
        noGlow();
        ctx.fillStyle = '#0b1020';
        ctx.fillRect(6, -11, 8, 6);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-1, -10, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = hurt > 0.5 ? '#9aa3b2' : '#6f7683';
        ctx.beginPath();
        ctx.moveTo(-18, 22); ctx.lineTo(-14, -8); ctx.lineTo(0, -16); ctx.lineTo(15, -6); ctx.lineTo(18, 22);
        ctx.closePath();
        ctx.fill();
        if (hurt < 0.5) {
          ctx.strokeStyle = '#3a3f4a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-6, -6); ctx.lineTo(0, 4); ctx.lineTo(-4, 12);
          ctx.stroke();
        }
      }
      ctx.restore();
    };

    const drawAlien = (a: Alien) => {
      const y = GRID_Y + a.row * CELL_H + CELL_H / 2 + 6;
      const chew = a.chewing ? Math.sin(simRef.current.t * 14) * 2 : 0;
      const step = Math.sin(a.wob * 2) * 2;
      ctx.save();
      ctx.translate(a.x, y + step * 0.4);
      const body = a.type === 'skitter' ? '#E4416F' : '#7ede6a';
      glow(a.flash > 0 ? '#ffffff' : body, 10);
      ctx.fillStyle = a.flash > 0 ? '#ffffff' : body;
      const rr = a.type === 'skitter' ? 11 : 15;
      ctx.beginPath();
      ctx.ellipse(0, 0, rr, rr + 3 + chew, 0, 0, Math.PI * 2);
      ctx.fill();
      // feet
      ctx.strokeStyle = a.flash > 0 ? '#fff' : body;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-6, rr + 2); ctx.lineTo(-8, rr + 8 + step);
      ctx.moveTo(6, rr + 2); ctx.lineTo(8, rr + 8 - step);
      ctx.stroke();
      // antennae
      ctx.beginPath();
      ctx.moveTo(-5, -rr); ctx.lineTo(-9, -rr - 8);
      ctx.moveTo(5, -rr); ctx.lineTo(9, -rr - 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-9, -rr - 9, 2, 0, Math.PI * 2);
      ctx.arc(9, -rr - 9, 2, 0, Math.PI * 2);
      ctx.fill();
      // eyes
      noGlow();
      ctx.fillStyle = '#0b1020';
      ctx.beginPath();
      ctx.arc(-5, -3, 2.5, 0, Math.PI * 2);
      ctx.arc(3, -3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // bucket
      if (a.type === 'bucket') {
        ctx.fillStyle = a.flash > 0 ? '#fff' : '#9aa3b2';
        ctx.beginPath();
        ctx.moveTo(-13, -rr + 2); ctx.lineTo(-10, -rr - 14); ctx.lineTo(10, -rr - 14); ctx.lineTo(13, -rr + 2);
        ctx.closePath();
        ctx.fill();
      }
      // hp sliver
      if (a.hp < a.maxHp) {
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(-14, -rr - 20, 28, 3);
        ctx.fillStyle = '#E4416F';
        ctx.fillRect(-14, -rr - 20, 28 * (a.hp / a.maxHp), 3);
      }
      ctx.restore();
    };

    const draw = () => {
      const s = simRef.current;
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);
      for (const st of s.bgStars) {
        ctx.fillStyle = `rgba(255,255,255,${st.a})`;
        ctx.fillRect(st.x, st.y, st.r, st.r);
      }
      // moon rows
      for (let r = 0; r < ROWS; r++) {
        ctx.fillStyle = r % 2 === 0 ? '#1c2233' : '#181d2c';
        ctx.fillRect(GRID_X, GRID_Y + r * CELL_H, COLS * CELL_W, CELL_H);
      }
      // craters
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (let i = 0; i < 12; i++) {
        const cx = GRID_X + ((i * 137) % (COLS * CELL_W));
        const cy = GRID_Y + ((i * 211) % (ROWS * CELL_H));
        ctx.beginPath();
        ctx.arc(cx, cy, 8 + (i % 3) * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      // grid lines — a whisper of phosphor teal
      glow('rgba(57,213,203,0.4)', 4);
      ctx.strokeStyle = 'rgba(57,213,203,0.14)';
      ctx.lineWidth = 1;
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(GRID_X + c * CELL_W, GRID_Y);
        ctx.lineTo(GRID_X + c * CELL_W, GRID_Y + ROWS * CELL_H);
        ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(GRID_X, GRID_Y + r * CELL_H);
        ctx.lineTo(GRID_X + COLS * CELL_W, GRID_Y + r * CELL_H);
        ctx.stroke();
      }
      noGlow();
      // hover
      if (s.hover && s.selected !== null && phaseRef.current === 'playing') {
        ctx.fillStyle = 'rgba(57,213,203,0.12)';
        ctx.fillRect(GRID_X + s.hover.col * CELL_W, GRID_Y + s.hover.row * CELL_H, CELL_W, CELL_H);
      }
      // dome
      glow('#39d5cb', 8);
      ctx.strokeStyle = '#39d5cb';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(20, H - 90, 70, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(57,213,203,0.3)';
      ctx.beginPath();
      ctx.arc(20, H - 90, 54, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      noGlow();
      drawAstronaut(38, H - 60, phaseRef.current === 'won');
      // plants
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
          const p = s.grid[r][c];
          if (p) drawPlant(p, GRID_X + c * CELL_W + CELL_W / 2, GRID_Y + r * CELL_H + CELL_H / 2);
        }
      // pellets — hot little phosphor zaps
      glow('#39d5cb', 12);
      ctx.fillStyle = '#39d5cb';
      for (const pe of s.pellets) {
        ctx.beginPath();
        ctx.arc(pe.x, GRID_Y + pe.row * CELL_H + CELL_H / 2 - 2, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      noGlow();
      // aliens
      for (const a of s.aliens) drawAlien(a);
      // puffs — the juiciest bloom on screen
      glow('rgba(255,255,255,0.8)', 16);
      for (const pf of s.puffs) {
        ctx.strokeStyle = `rgba(255,255,255,${1 - pf.age / 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pf.x, pf.y, 8 + pf.age * 50, 0, Math.PI * 2);
        ctx.stroke();
      }
      noGlow();
      // collectible stars — juicy, like the site's shooting stars
      glow('#F4FD7B', 14);
      for (const st of s.stars) {
        const tw = 1 + Math.sin(s.t * 5 + st.x) * 0.15;
        const fade = st.grounded && st.age > 6 ? 1 - (st.age - 6) / 2 : 1;
        ctx.save();
        ctx.translate(st.x, st.y);
        ctx.scale(tw, tw);
        ctx.globalAlpha = fade;
        ctx.fillStyle = '#F4FD7B';
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const ang = (i / 10) * Math.PI * 2 - Math.PI / 2;
          const rad = i % 2 === 0 ? 12 : 5.5;
          ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      noGlow();
      // popups
      ctx.font = 'bold 15px ui-monospace, monospace';
      glow('rgba(244,253,123,0.8)', 8);
      for (const pp of s.popups) {
        ctx.fillStyle = pp.color;
        ctx.globalAlpha = 1 - pp.age;
        ctx.fillText(pp.text, pp.x - 12, pp.y - 20 - pp.age * 22);
        ctx.globalAlpha = 1;
      }
      noGlow();
      // toolbar
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.roundRect(8, 8, W - 16, 92, 10);
      ctx.fill();
      // stardust counter
      glow('#F4FD7B', 8);
      ctx.fillStyle = '#F4FD7B';
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const rad = i % 2 === 0 ? 12 : 5.5;
        ctx.lineTo(40 + Math.cos(ang) * rad, 42 + Math.sin(ang) * rad);
      }
      ctx.closePath();
      ctx.fill();
      noGlow();
      ctx.font = 'bold 22px ui-monospace, monospace';
      glow('rgba(255,255,255,0.5)', 5);
      ctx.fillStyle = '#fff';
      ctx.fillText(String(s.stardust), 62, 50);
      noGlow();
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillText('STARDUST', 26, 78);
      // cards
      for (let i = 0; i < 3; i++) {
        const cx = 200 + i * 104;
        const card = PLANTS[i];
        const afford = s.stardust >= card.cost && s.cardCd[i] <= 0;
        ctx.fillStyle = s.selected === i ? 'rgba(57,213,203,0.2)' : 'rgba(255,255,255,0.06)';
        ctx.strokeStyle = s.selected === i ? '#39d5cb' : 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cx, 12, 96, 80, 8);
        ctx.fill();
        if (s.selected === i) glow('rgba(57,213,203,0.6)', 8);
        ctx.stroke();
        noGlow();
        ctx.save();
        ctx.globalAlpha = afford ? 1 : 0.35;
        ctx.translate(cx + 48, 46);
        drawPlant({ type: card.type, hp: 1, maxHp: 1, timer: 0 }, 0, 0);
        ctx.restore();
        ctx.font = 'bold 13px ui-monospace, monospace';
        ctx.fillStyle = afford ? '#F4FD7B' : 'rgba(255,255,255,0.35)';
        ctx.fillText('☆' + card.cost, cx + 8, 30);
        if (s.cardCd[i] > 0) {
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(cx, 12, 96, 80 * (s.cardCd[i] / 4));
        }
      }
      // dig button
      const dx = 200 + 3 * 104;
      ctx.fillStyle = s.dig ? 'rgba(228,65,111,0.25)' : 'rgba(255,255,255,0.06)';
      ctx.strokeStyle = s.dig ? '#E4416F' : 'rgba(255,255,255,0.25)';
      ctx.beginPath();
      ctx.roundRect(dx, 12, 60, 80, 8);
      ctx.fill();
      if (s.dig) glow('rgba(228,65,111,0.6)', 8);
      ctx.stroke();
      noGlow();
      ctx.font = 'bold 22px ui-monospace, monospace';
      ctx.fillStyle = s.dig ? '#E4416F' : 'rgba(255,255,255,0.6)';
      ctx.fillText('✕', dx + 22, 50);
      ctx.font = 'bold 10px ui-monospace, monospace';
      ctx.fillText('DIG', dx + 21, 74);
      // score + progress
      ctx.font = 'bold 15px ui-monospace, monospace';
      glow('rgba(255,255,255,0.5)', 5);
      ctx.fillStyle = '#fff';
      ctx.fillText('ZAPPED ' + s.score, W - 150, 34);
      noGlow();
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(W - 150, 48, 120, 6);
      glow('rgba(57,213,203,0.5)', 5);
      ctx.fillStyle = '#39d5cb';
      ctx.fillRect(W - 150, 48, 120 * Math.min(1, s.t / s.endT), 6);
      noGlow();
      ctx.font = 'bold 11px ui-monospace, monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillText('INVASION', W - 150, 72);
      // banner
      if (s.banner) {
        ctx.font = 'bold 40px ui-monospace, monospace';
        glow('rgba(228,65,111,0.9)', 18);
        ctx.fillStyle = '#E4416F';
        ctx.globalAlpha = s.banner.age < 0.3 ? s.banner.age / 0.3 : s.banner.age > 2.4 ? (3 - s.banner.age) / 0.6 : 1;
        ctx.textAlign = 'center';
        ctx.fillText(s.banner.text, W / 2, H / 2 - 60);
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
        noGlow();
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (phaseRef.current === 'playing') update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [go]);

  const restart = () => {
    simRef.current = newSim();
    go('playing');
  };

  const btn =
    'text-white/70 hover:text-white text-sm font-bold border-2 border-white/20 rounded-lg px-3 py-1.5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer';

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <button onClick={onExit} className={`absolute top-4 left-4 z-10 ${btn}`}>
        ← All games
      </button>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="rounded-lg border border-white/15 crt-bezel"
          style={{ width: 'min(92vw, calc(88vh * 800 / 600))', height: 'auto', aspectRatio: '800 / 600' }}
        />
        <div aria-hidden className="crt-overlay rounded-lg" />
        <div aria-hidden className="color-bar absolute top-0 inset-x-4 h-[2px] rounded-full" />
        {phase !== 'playing' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-panel backdrop-blur-md rounded-2xl px-10 py-8 text-center text-white max-w-md">
              {phase === 'ready' && (
                <>
                  <h2 className="font-bold text-3xl mb-3">Moon Garden</h2>
                  <p className="text-white/70 mb-4 leading-6">
                    Aliens are marching on the greenhouse. Click a plant card, then a tile to grow it.
                    Click falling stars to collect stardust. Survive the invasion!
                  </p>
                  <p className="text-white/50 text-sm mb-6">mouse to play · esc pauses</p>
                  <button onClick={() => go('playing')} className={btn}>
                    ▶ Start
                  </button>
                </>
              )}
              {phase === 'paused' && (
                <>
                  <h2 className="font-bold text-3xl mb-4">Paused</h2>
                  <button onClick={() => go('playing')} className={btn}>
                    Resume
                  </button>
                </>
              )}
              {phase === 'gameover' && (
                <>
                  <h2 className="font-bold text-3xl mb-2">The aliens got in!</h2>
                  <p className="text-white/70 mb-6">You zapped {finalScore} aliens.</p>
                  <button onClick={restart} className={btn}>
                    ↻ Try again
                  </button>
                </>
              )}
              {phase === 'won' && (
                <>
                  <h2 className="font-bold text-3xl mb-2">The moon garden is safe! 🌱</h2>
                  <p className="text-white/70 mb-6">You zapped {finalScore} aliens.</p>
                  <button onClick={restart} className={btn}>
                    ↻ Play again
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
