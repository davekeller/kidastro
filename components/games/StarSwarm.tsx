'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'ready' | 'playing' | 'paused' | 'gameover';

const W = 800;
const H = 600;
const ACOLS = 10;
const AROWS = 5;
const ACELL_W = 48;
const ACELL_H = 36;
const PLAYER_Y = 552;
const SHIELD_Y = 470;

interface Bolt { x: number; y: number }
interface Bomb { x: number; y: number; baseX: number }
interface Popup { x: number; y: number; text: string; age: number }
interface Bunker { x: number; blocks: boolean[][] }

interface Sim {
  px: number;
  lives: number;
  score: number;
  best: number;
  wave: number;
  invuln: number;
  bolts: Bolt[];
  bombs: Bomb[];
  alive: boolean[][];
  offX: number;
  offY: number;
  dir: number;
  stepTimer: number;
  frame: number;
  bombTimer: number;
  bunkers: Bunker[];
  ufo: { x: number; dir: number } | null;
  ufoTimer: number;
  popups: Popup[];
  pops: { x: number; y: number; age: number; color: string }[];
  shake: number;
  banner: { text: string; age: number } | null;
  bgStars: { x: number; y: number; a: number; r: number }[];
  keys: Record<string, boolean>;
  flame: number;
}

const BUNKER_COLS = 8;
const BUNKER_ROWS = 5;
const BLOCK = 10;

function newBunkers(): Bunker[] {
  return [150, 380, 610].map((x) => ({
    x,
    blocks: Array.from({ length: BUNKER_ROWS }, (_, r) =>
      Array.from({ length: BUNKER_COLS }, (_, c) => {
        // dome shape: trim top corners, notch bottom center
        if (r === 0 && (c < 2 || c > 5)) return false;
        if (r === 1 && (c < 1 || c > 6)) return false;
        if (r === BUNKER_ROWS - 1 && c > 2 && c < 5) return false;
        return true;
      })
    ),
  }));
}

function newWave(s: Sim, wave: number) {
  s.wave = wave;
  s.alive = Array.from({ length: AROWS }, () => Array(ACOLS).fill(true));
  s.offX = (W - ACOLS * ACELL_W) / 2;
  s.offY = 80 + Math.min(4, wave - 1) * 16;
  s.dir = 1;
  s.stepTimer = 0.7;
  s.frame = 0;
  s.bolts = [];
  s.bombs = [];
  s.bombTimer = 1.5;
  s.bunkers = newBunkers();
  s.ufo = null;
  s.ufoTimer = 15 + Math.random() * 10;
  s.banner = { text: 'WAVE ' + wave, age: 0 };
}

function newSim(best: number): Sim {
  const s: Sim = {
    px: W / 2,
    lives: 3,
    score: 0,
    best,
    wave: 1,
    invuln: 0,
    bolts: [],
    bombs: [],
    alive: [],
    offX: 0,
    offY: 0,
    dir: 1,
    stepTimer: 0.7,
    frame: 0,
    bombTimer: 1.5,
    bunkers: [],
    ufo: null,
    ufoTimer: 20,
    popups: [],
    pops: [],
    shake: 0,
    banner: null,
    bgStars: Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      a: 0.15 + Math.random() * 0.35,
      r: Math.random() < 0.7 ? 1 : 2,
    })),
    keys: {},
    flame: 0,
  };
  newWave(s, 1);
  return s;
}

export default function StarSwarm({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>('ready');
  const [finalScore, setFinalScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const phaseRef = useRef<Phase>('ready');
  const simRef = useRef<Sim>(newSim(0));

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
    // Bunker blocks pick this up from plain fillRect calls.
    const bunkerGrad = ctx.createLinearGradient(0, SHIELD_Y, 0, SHIELD_Y + BUNKER_ROWS * BLOCK);
    bunkerGrad.addColorStop(0, '#4fe3d9');
    bunkerGrad.addColorStop(1, '#249e96');

    const onKeyDown = (e: KeyboardEvent) => {
      const s = simRef.current;
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key) && phaseRef.current === 'playing') e.preventDefault();
      s.keys[e.key] = true;
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (phaseRef.current === 'playing') go('paused');
        else if (phaseRef.current === 'paused') go('playing');
      }
      if (e.key === ' ') {
        if (phaseRef.current === 'ready') {
          e.preventDefault();
          go('playing');
        } else if (phaseRef.current === 'playing' && s.bolts.length < 2) {
          s.bolts.push({ x: s.px, y: PLAYER_Y - 26 });
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      simRef.current.keys[e.key] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const alienRect = (s: Sim, r: number, c: number) => ({
      x: s.offX + c * ACELL_W + 6,
      y: s.offY + r * ACELL_H + 4,
      w: 34,
      h: 24,
    });

    const rowScore = (r: number) => (r === 0 ? 30 : r <= 2 ? 20 : 10);

    const hitBunker = (x: number, y: number): boolean => {
      const s = simRef.current;
      for (const b of s.bunkers) {
        const bx = x - b.x;
        const by = y - SHIELD_Y;
        const c = Math.floor(bx / BLOCK);
        const r = Math.floor(by / BLOCK);
        if (c >= 0 && c < BUNKER_COLS && r >= 0 && r < BUNKER_ROWS && b.blocks[r][c]) {
          b.blocks[r][c] = false;
          return true;
        }
      }
      return false;
    };

    const killPlayer = (s: Sim) => {
      if (s.invuln > 0) return;
      s.lives -= 1;
      s.shake = 0.35;
      s.invuln = 2;
      s.pops.push({ x: s.px, y: PLAYER_Y, age: 0, color: '#E4416F' });
      if (s.lives <= 0) {
        s.best = Math.max(s.best, s.score);
        setFinalScore(s.score);
        setBestScore(s.best);
        go('gameover');
      }
    };

    const update = (dt: number) => {
      const s = simRef.current;
      s.flame += dt;
      s.invuln = Math.max(0, s.invuln - dt);
      s.shake = Math.max(0, s.shake - dt);
      // player move
      const spd = 320;
      if (s.keys['ArrowLeft'] || s.keys['a'] || s.keys['A']) s.px -= spd * dt;
      if (s.keys['ArrowRight'] || s.keys['d'] || s.keys['D']) s.px += spd * dt;
      s.px = Math.max(28, Math.min(W - 28, s.px));
      // march
      s.stepTimer -= dt;
      const aliveCount = s.alive.flat().filter(Boolean).length;
      if (aliveCount === 0) {
        newWave(s, s.wave + 1);
        return;
      }
      const interval = 0.09 + ((aliveCount - 1) / (AROWS * ACOLS - 1)) * 0.61;
      if (s.stepTimer <= 0) {
        s.stepTimer = interval;
        s.frame = s.frame === 0 ? 1 : 0;
        s.offX += 12 * s.dir;
        let minX = Infinity;
        let maxX = -Infinity;
        for (let r = 0; r < AROWS; r++)
          for (let c = 0; c < ACOLS; c++)
            if (s.alive[r][c]) {
              const rect = alienRect(s, r, c);
              minX = Math.min(minX, rect.x);
              maxX = Math.max(maxX, rect.x + rect.w);
            }
        if ((s.dir > 0 && maxX > W - 14) || (s.dir < 0 && minX < 14)) {
          s.dir *= -1;
          s.offY += 18;
        }
      }
      // aliens reached shields → game over
      for (let r = AROWS - 1; r >= 0; r--)
        for (let c = 0; c < ACOLS; c++)
          if (s.alive[r][c] && alienRect(s, r, c).y + 24 > SHIELD_Y - 6) {
            s.best = Math.max(s.best, s.score);
            setFinalScore(s.score);
            setBestScore(s.best);
            go('gameover');
            return;
          }
      // bombs
      s.bombTimer -= dt;
      if (s.bombTimer <= 0) {
        s.bombTimer = (0.7 + Math.random() * 1.5) / (1 + (s.wave - 1) * 0.25);
        const cols: number[] = [];
        for (let c = 0; c < ACOLS; c++) if (s.alive.some((row) => row[c])) cols.push(c);
        if (cols.length) {
          const c = cols[Math.floor(Math.random() * cols.length)];
          let br = -1;
          for (let r = AROWS - 1; r >= 0; r--)
            if (s.alive[r][c]) {
              br = r;
              break;
            }
          if (br >= 0) {
            const rect = alienRect(s, br, c);
            s.bombs.push({ x: rect.x + rect.w / 2, y: rect.y + rect.h, baseX: rect.x + rect.w / 2 });
          }
        }
      }
      const bombSpeed = 150 + s.wave * 15;
      for (let i = s.bombs.length - 1; i >= 0; i--) {
        const b = s.bombs[i];
        b.y += bombSpeed * dt;
        b.x = b.baseX + Math.sin(b.y * 0.06) * 7;
        if (b.y > H) {
          s.bombs.splice(i, 1);
          continue;
        }
        if (hitBunker(b.x, b.y)) {
          s.bombs.splice(i, 1);
          continue;
        }
        if (b.y > PLAYER_Y - 18 && b.y < PLAYER_Y + 16 && Math.abs(b.x - s.px) < 20) {
          s.bombs.splice(i, 1);
          killPlayer(s);
        }
      }
      // player bolts
      for (let i = s.bolts.length - 1; i >= 0; i--) {
        const bo = s.bolts[i];
        bo.y -= 480 * dt;
        if (bo.y < -10) {
          s.bolts.splice(i, 1);
          continue;
        }
        if (hitBunker(bo.x, bo.y)) {
          s.bolts.splice(i, 1);
          continue;
        }
        // ufo
        if (s.ufo && bo.y < 60 && Math.abs(bo.x - s.ufo.x) < 24) {
          const bonus = 50 + Math.floor(Math.random() * 3) * 50;
          s.score += bonus;
          s.popups.push({ x: s.ufo.x, y: 46, text: '+' + bonus, age: 0 });
          s.pops.push({ x: s.ufo.x, y: 46, age: 0, color: '#F4FD7B' });
          s.ufo = null;
          s.bolts.splice(i, 1);
          continue;
        }
        let hit = false;
        for (let r = AROWS - 1; r >= 0 && !hit; r--)
          for (let c = 0; c < ACOLS && !hit; c++) {
            if (!s.alive[r][c]) continue;
            const rect = alienRect(s, r, c);
            if (bo.x > rect.x && bo.x < rect.x + rect.w && bo.y > rect.y && bo.y < rect.y + rect.h) {
              s.alive[r][c] = false;
              s.score += rowScore(r);
              s.pops.push({ x: rect.x + rect.w / 2, y: rect.y + rect.h / 2, age: 0, color: '#7ede6a' });
              s.bolts.splice(i, 1);
              hit = true;
            }
          }
      }
      // ufo
      if (s.ufo) {
        s.ufo.x += s.ufo.dir * 120 * dt;
        if (s.ufo.x < -50 || s.ufo.x > W + 50) s.ufo = null;
      } else {
        s.ufoTimer -= dt;
        if (s.ufoTimer <= 0) {
          s.ufoTimer = 15 + Math.random() * 10;
          const dir = Math.random() < 0.5 ? 1 : -1;
          s.ufo = { x: dir > 0 ? -40 : W + 40, dir };
        }
      }
      // fx
      for (let i = s.pops.length - 1; i >= 0; i--) if ((s.pops[i].age += dt) > 0.35) s.pops.splice(i, 1);
      for (let i = s.popups.length - 1; i >= 0; i--) if ((s.popups[i].age += dt) > 1) s.popups.splice(i, 1);
      if (s.banner && (s.banner.age += dt) > 2) s.banner = null;
    };

    const drawAlien = (r: number, x: number, y: number, frame: number) => {
      const cx = x + 17;
      const cy = y + 12;
      ctx.save();
      ctx.translate(cx, cy);
      if (r === 0) {
        // pink squid
        glow('#E4416F', 9);
        ctx.fillStyle = '#E4416F';
        ctx.beginPath();
        ctx.ellipse(0, -2, 13, 10, 0, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(-13, -2, 26, 6);
        for (let i = 0; i < 4; i++) {
          const lx = -10 + i * 6.5;
          ctx.fillRect(lx, 4, 3, frame === 0 ? 7 : 5);
        }
        noGlow();
        ctx.fillStyle = '#0b1020';
        ctx.fillRect(-7, -4, 4, 4);
        ctx.fillRect(3, -4, 4, 4);
      } else if (r <= 2) {
        // green blob
        glow('#7ede6a', 9);
        ctx.fillStyle = '#7ede6a';
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 11 + (frame === 0 ? 0 : 1.5), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#7ede6a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-6, -10); ctx.lineTo(-9, -15);
        ctx.moveTo(6, -10); ctx.lineTo(9, -15);
        ctx.stroke();
        noGlow();
        ctx.fillStyle = '#0b1020';
        ctx.beginPath();
        ctx.arc(-5, -2, 2.4, 0, Math.PI * 2);
        ctx.arc(5, -2, 2.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // teal crab
        glow('#39d5cb', 9);
        ctx.fillStyle = '#39d5cb';
        ctx.beginPath();
        ctx.roundRect(-13, -8, 26, 16, 6);
        ctx.fill();
        ctx.strokeStyle = '#39d5cb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (frame === 0) {
          ctx.moveTo(-13, 0); ctx.lineTo(-18, -6);
          ctx.moveTo(13, 0); ctx.lineTo(18, -6);
        } else {
          ctx.moveTo(-13, 0); ctx.lineTo(-18, 6);
          ctx.moveTo(13, 0); ctx.lineTo(18, 6);
        }
        ctx.stroke();
        noGlow();
        ctx.fillStyle = '#0b1020';
        ctx.fillRect(-7, -3, 4, 5);
        ctx.fillRect(3, -3, 4, 5);
      }
      ctx.restore();
    };

    const drawPlayer = (s: Sim) => {
      if (s.invuln > 0 && Math.floor(s.invuln * 10) % 2 === 0) return;
      ctx.save();
      ctx.translate(s.px, PLAYER_Y);
      // flame
      const f = 4 + Math.sin(s.flame * 30) * 2.5;
      glow('#F4FD7B', 14);
      ctx.fillStyle = '#F4FD7B';
      ctx.beginPath();
      ctx.moveTo(-5, 16);
      ctx.lineTo(0, 16 + f + 6);
      ctx.lineTo(5, 16);
      ctx.closePath();
      ctx.fill();
      // rocket body — soft vertical shading for a hint of dimension
      glow('rgba(255,255,255,0.75)', 8);
      const bodyGrad = ctx.createLinearGradient(0, -8, 0, 16);
      bodyGrad.addColorStop(0, '#ffffff');
      bodyGrad.addColorStop(1, '#c7cfdd');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(-9, -8, 18, 24, 6);
      ctx.fill();
      // fins
      glow('#39d5cb', 8);
      ctx.fillStyle = '#39d5cb';
      ctx.beginPath();
      ctx.moveTo(-9, 6); ctx.lineTo(-17, 16); ctx.lineTo(-9, 16);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(9, 6); ctx.lineTo(17, 16); ctx.lineTo(9, 16);
      ctx.closePath();
      ctx.fill();
      // astronaut on top
      glow('rgba(255,255,255,0.75)', 8);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -16, 8, 0, Math.PI * 2);
      ctx.fill();
      noGlow();
      ctx.fillStyle = '#0b1020';
      ctx.beginPath();
      ctx.roundRect(-5, -19, 10, 7, 3.5);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(-2.5, -17.5, 2.5, 1.8);
      ctx.restore();
    };

    const draw = () => {
      const s = simRef.current;
      ctx.save();
      if (s.shake > 0) ctx.translate((Math.random() - 0.5) * 8 * s.shake, (Math.random() - 0.5) * 8 * s.shake);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(-10, -10, W + 20, H + 20);
      for (const st of s.bgStars) {
        ctx.fillStyle = `rgba(255,255,255,${st.a})`;
        ctx.fillRect(st.x, st.y, st.r, st.r);
      }
      // ground line
      glow('rgba(57,213,203,0.6)', 6);
      ctx.strokeStyle = 'rgba(57,213,203,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, H - 12);
      ctx.lineTo(W, H - 12);
      ctx.stroke();
      noGlow();
      // bunkers — shaded fill + faint phosphor haze
      glow('rgba(57,213,203,0.55)', 7);
      ctx.fillStyle = bunkerGrad;
      for (const b of s.bunkers)
        for (let r = 0; r < BUNKER_ROWS; r++)
          for (let c = 0; c < BUNKER_COLS; c++)
            if (b.blocks[r][c]) ctx.fillRect(b.x + c * BLOCK, SHIELD_Y + r * BLOCK, BLOCK - 1, BLOCK - 1);
      noGlow();
      // aliens
      for (let r = 0; r < AROWS; r++)
        for (let c = 0; c < ACOLS; c++)
          if (s.alive[r][c]) {
            const rect = { x: s.offX + c * ACELL_W + 6, y: s.offY + r * ACELL_H + 4 };
            drawAlien(r, rect.x, rect.y, s.frame);
          }
      // ufo
      if (s.ufo) {
        ctx.save();
        ctx.translate(s.ufo.x, 44);
        glow('#F4FD7B', 14);
        ctx.fillStyle = '#F4FD7B';
        ctx.beginPath();
        ctx.ellipse(0, 0, 22, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        glow('rgba(255,255,255,0.7)', 8);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.ellipse(0, -6, 9, 6, 0, Math.PI, 0);
        ctx.fill();
        ctx.restore();
      }
      // bolts & bombs — hot little phosphor streaks
      glow('#39d5cb', 12);
      ctx.fillStyle = '#39d5cb';
      for (const bo of s.bolts) ctx.fillRect(bo.x - 2, bo.y - 8, 4, 12);
      glow('#E4416F', 12);
      ctx.fillStyle = '#E4416F';
      for (const b of s.bombs) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      noGlow();
      // player
      drawPlayer(s);
      // pops — the juiciest bloom on screen
      for (const p of s.pops) {
        glow(p.color, 16);
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = 1 - p.age / 0.35;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 + p.age * 60, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      noGlow();
      // popups
      ctx.font = 'bold 15px ui-monospace, monospace';
      glow('rgba(244,253,123,0.8)', 8);
      for (const pp of s.popups) {
        ctx.fillStyle = '#F4FD7B';
        ctx.globalAlpha = 1 - pp.age;
        ctx.fillText(pp.text, pp.x - 14, pp.y - pp.age * 20);
        ctx.globalAlpha = 1;
      }
      noGlow();
      // HUD
      ctx.font = 'bold 17px ui-monospace, monospace';
      glow('rgba(255,255,255,0.5)', 5);
      ctx.fillStyle = '#fff';
      ctx.fillText('SCORE ' + s.score, 16, 28);
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText('WAVE ' + s.wave, W / 2, 28);
      ctx.textAlign = 'left';
      // lives as helmets
      for (let i = 0; i < s.lives; i++) {
        const hx = W - 30 - i * 28;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(hx, 22, 9, 0, Math.PI * 2);
        ctx.fill();
        noGlow();
        ctx.fillStyle = '#0b1020';
        ctx.beginPath();
        ctx.roundRect(hx - 5.5, 18.5, 11, 7, 3.5);
        ctx.fill();
        glow('rgba(255,255,255,0.5)', 5);
      }
      noGlow();
      // banner
      if (s.banner) {
        ctx.font = 'bold 44px ui-monospace, monospace';
        glow('rgba(57,213,203,0.9)', 18);
        ctx.fillStyle = '#39d5cb';
        ctx.globalAlpha = s.banner.age < 0.25 ? s.banner.age / 0.25 : s.banner.age > 1.5 ? (2 - s.banner.age) / 0.5 : 1;
        ctx.textAlign = 'center';
        ctx.fillText(s.banner.text, W / 2, H / 2 - 40);
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
        noGlow();
      }
      ctx.restore();
    };

    let raf = 0;
    let last = performance.now();
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
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [go]);

  const restart = () => {
    simRef.current = newSim(simRef.current.best);
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
                  <h2 className="font-bold text-3xl mb-3">Star Swarm</h2>
                  <p className="text-white/70 mb-4 leading-6">
                    A fleet of alien blobs is descending on the moon. Hold the line, kid.
                  </p>
                  <p className="text-white/50 text-sm mb-6">← → move · space shoots · esc pauses</p>
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
                  <h2 className="font-bold text-3xl mb-2">The swarm wins… this time.</h2>
                  <p className="text-white/70 mb-1">Score: {finalScore}</p>
                  <p className="text-white/50 text-sm mb-6">Best this visit: {bestScore}</p>
                  <button onClick={restart} className={btn}>
                    ↻ Try again
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
