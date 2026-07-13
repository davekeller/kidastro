'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'ready' | 'playing' | 'paused' | 'gameover' | 'won';

const W = 800;
const H = 600;
const GRAVITY = 1100;
const PLAYER_W = 18;
const PLAYER_H = 30;

// Platforms indexed 0 (bottom) → 5 (top). y = top surface.
const PLATFORMS: { x1: number; x2: number; y: number; dir: number }[] = [
  { x1: 0, x2: 800, y: 568, dir: 1 },
  { x1: 0, x2: 720, y: 476, dir: 1 },
  { x1: 80, x2: 800, y: 384, dir: -1 },
  { x1: 0, x2: 720, y: 292, dir: 1 },
  { x1: 80, x2: 800, y: 200, dir: -1 },
  { x1: 0, x2: 800, y: 108, dir: 1 },
];
// Rocket pad above top platform.
const PAD = { x1: 540, x2: 700, y: 46 };

// Ladder x positions per gap (gap i connects platform i → i+1), varied per level.
const LADDER_SETS: number[][][] = [
  [[180, 560], [260, 640], [140, 500], [340, 700], [220, 600]],
  [[300, 680], [160, 520], [420, 720], [120, 460], [360, 660]],
  [[240, 620], [380, 700], [180, 560], [280, 640], [140, 480]],
];
const FINAL_LADDER_X = 620; // top platform → pad

interface Rock {
  x: number;
  y: number;
  tier: number;
  vy: number;
  falling: boolean;
  onLadder: boolean;
  ladderTargetY: number;
  rot: number;
  lastLadderX: number;
  jumped: boolean;
}
interface Popup { x: number; y: number; text: string; age: number }

interface Sim {
  px: number;
  py: number; // feet y
  vx: number;
  vy: number;
  onGround: boolean;
  climbing: boolean;
  facing: number;
  walkT: number;
  fallStart: number;
  stun: number;
  invuln: number;
  lives: number;
  score: number;
  level: number;
  rocks: Rock[];
  rockTimer: number;
  tossAnim: number;
  popups: Popup[];
  liftoff: number; // >0 during win animation
  bgStars: { x: number; y: number; a: number; r: number }[];
  keys: Record<string, boolean>;
  t: number;
}

const ladders = (level: number) => LADDER_SETS[(level - 1) % LADDER_SETS.length];

function rockInterval(level: number) {
  return Math.max(1.4, 2.6 * Math.pow(0.88, level - 1));
}
function rockSpeed(level: number) {
  return 95 * Math.pow(1.12, level - 1);
}

function spawnPlayer(s: Sim) {
  s.px = 40;
  s.py = PLATFORMS[0].y;
  s.vx = 0;
  s.vy = 0;
  s.onGround = true;
  s.climbing = false;
  s.stun = 0;
}

function newSim(level: number, score: number, lives: number): Sim {
  const s: Sim = {
    px: 40,
    py: PLATFORMS[0].y,
    vx: 0,
    vy: 0,
    onGround: true,
    climbing: false,
    facing: 1,
    walkT: 0,
    fallStart: 0,
    stun: 0,
    invuln: 0,
    lives,
    score,
    level,
    rocks: [],
    rockTimer: 1.2,
    tossAnim: 0,
    popups: [],
    liftoff: 0,
    bgStars: Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      a: 0.15 + Math.random() * 0.35,
      r: Math.random() < 0.7 ? 1 : 2,
    })),
    keys: {},
    t: 0,
  };
  return s;
}

export default function RocketClimb({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>('ready');
  const [finalScore, setFinalScore] = useState(0);
  const phaseRef = useRef<Phase>('ready');
  const simRef = useRef<Sim>(newSim(1, 0, 3));

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
    // Girder strokes pick this up: brighter teal near the pad, deeper at the base.
    const girderGrad = ctx.createLinearGradient(0, PAD.y, 0, PLATFORMS[0].y + 12);
    girderGrad.addColorStop(0, '#4fe3d9');
    girderGrad.addColorStop(1, '#249e96');

    const onKeyDown = (e: KeyboardEvent) => {
      const s = simRef.current;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key) && phaseRef.current === 'playing')
        e.preventDefault();
      s.keys[e.key] = true;
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (phaseRef.current === 'playing') go('paused');
        else if (phaseRef.current === 'paused') go('playing');
      }
      if (e.key === ' ') {
        if (phaseRef.current === 'ready') {
          e.preventDefault();
          go('playing');
        } else if (phaseRef.current === 'playing' && s.onGround && !s.climbing && s.stun <= 0 && s.liftoff <= 0) {
          s.vy = -330;
          s.onGround = false;
          s.fallStart = s.py;
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      simRef.current.keys[e.key] = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const platformAt = (x: number, feetY: number, prevFeetY: number): number => {
      for (let i = 0; i < PLATFORMS.length; i++) {
        const p = PLATFORMS[i];
        if (x >= p.x1 - 4 && x <= p.x2 + 4 && prevFeetY <= p.y + 1 && feetY >= p.y) return i;
      }
      // pad
      if (x >= PAD.x1 && x <= PAD.x2 && prevFeetY <= PAD.y + 1 && feetY >= PAD.y) return 100;
      return -1;
    };

    const ladderRects = (level: number) => {
      const rects: { x: number; y1: number; y2: number }[] = [];
      const sets = ladders(level);
      for (let gap = 0; gap < 5; gap++) {
        for (const lx of sets[gap]) rects.push({ x: lx, y1: PLATFORMS[gap + 1].y, y2: PLATFORMS[gap].y });
      }
      rects.push({ x: FINAL_LADDER_X, y1: PAD.y, y2: PLATFORMS[5].y });
      return rects;
    };

    const update = (dt: number) => {
      const s = simRef.current;
      s.t += dt;
      s.invuln = Math.max(0, s.invuln - dt);
      s.stun = Math.max(0, s.stun - dt);
      s.tossAnim = Math.max(0, s.tossAnim - dt);

      // liftoff win animation
      if (s.liftoff > 0) {
        s.liftoff += dt;
        if (s.liftoff > 1.8) {
          if (s.level >= 5) {
            setFinalScore(s.score);
            go('won');
          } else {
            const next = newSim(s.level + 1, s.score, s.lives);
            next.bgStars = s.bgStars;
            simRef.current = next;
          }
        }
        return;
      }

      const lrects = ladderRects(s.level);

      // player input
      const canMove = s.stun <= 0;
      if (s.climbing) {
        const ladder = lrects.find((l) => Math.abs(l.x - s.px) < 14 && s.py >= l.y1 - 2 && s.py <= l.y2 + 2);
        let dy = 0;
        if (s.keys['ArrowUp']) dy = -110;
        if (s.keys['ArrowDown']) dy = 110;
        s.py += dy * dt;
        if (ladder) {
          if (s.py <= ladder.y1) {
            s.py = ladder.y1;
            s.climbing = false;
            s.onGround = true;
          } else if (s.py >= ladder.y2) {
            s.py = ladder.y2;
            s.climbing = false;
            s.onGround = true;
          }
        } else {
          s.climbing = false;
        }
      } else {
        s.vx = 0;
        if (canMove) {
          if (s.keys['ArrowLeft'] || s.keys['a'] || s.keys['A']) {
            s.vx = -150;
            s.facing = -1;
          }
          if (s.keys['ArrowRight'] || s.keys['d'] || s.keys['D']) {
            s.vx = 150;
            s.facing = 1;
          }
        }
        const prevFeet = s.py;
        s.px = Math.max(10, Math.min(W - 10, s.px + s.vx * dt));
        if (s.vx !== 0 && s.onGround) s.walkT += dt * 10;

        // grab ladder
        if (canMove && (s.keys['ArrowUp'] || s.keys['ArrowDown'])) {
          const dir = s.keys['ArrowUp'] ? -1 : 1;
          const ladder = lrects.find(
            (l) =>
              Math.abs(l.x - s.px) < 14 &&
              ((dir < 0 && s.py > l.y1 + 2 && s.py <= l.y2 + 2) || (dir > 0 && s.py < l.y2 - 2 && s.py >= l.y1 - 2))
          );
          if (ladder) {
            s.climbing = true;
            s.px = ladder.x;
            s.vy = 0;
            s.onGround = false;
          }
        }

        if (!s.climbing) {
          // gravity + platform collision
          if (s.onGround) {
            // walked off an edge?
            const p = PLATFORMS.find((pl) => s.px >= pl.x1 - 4 && s.px <= pl.x2 + 4 && Math.abs(pl.y - s.py) < 3);
            const onPad = s.px >= PAD.x1 && s.px <= PAD.x2 && Math.abs(PAD.y - s.py) < 3;
            if (!p && !onPad) {
              s.onGround = false;
              s.fallStart = s.py;
              s.vy = 0;
            }
          }
          if (!s.onGround) {
            s.vy += GRAVITY * dt;
            const newY = s.py + s.vy * dt;
            const idx = s.vy > 0 ? platformAt(s.px, newY, prevFeet) : -1;
            if (idx >= 0) {
              s.py = idx === 100 ? PAD.y : PLATFORMS[idx].y;
              s.onGround = true;
              s.vy = 0;
              if (s.py < s.fallStart - 1 || s.fallStart - s.py < -180) {
                /* rose, no stun */
              }
              if (s.py - s.fallStart > 180) s.stun = 1;
            } else {
              s.py = Math.min(newY, PLATFORMS[0].y);
              if (s.py >= PLATFORMS[0].y) {
                if (s.py - s.fallStart > 180) s.stun = 1;
                s.py = PLATFORMS[0].y;
                s.onGround = true;
                s.vy = 0;
              }
            }
          }
        }
      }

      // reached rocket?
      if (s.px > PAD.x1 + 20 && s.px < PAD.x2 && Math.abs(s.py - PAD.y) < 6) {
        s.score += 500;
        s.popups.push({ x: s.px, y: s.py - 40, text: 'LIFTOFF! +500', age: 0 });
        s.liftoff = 0.01;
        return;
      }

      // rocks
      s.rockTimer -= dt;
      if (s.rockTimer <= 0) {
        s.rockTimer = rockInterval(s.level);
        s.tossAnim = 0.5;
        s.rocks.push({
          x: 105,
          y: PLATFORMS[5].y - 9,
          tier: 5,
          vy: 0,
          falling: false,
          onLadder: false,
          ladderTargetY: 0,
          rot: 0,
          lastLadderX: -1,
          jumped: false,
        });
      }
      const rspd = rockSpeed(s.level);
      const lsets = ladders(s.level);
      for (let i = s.rocks.length - 1; i >= 0; i--) {
        const r = s.rocks[i];
        if (r.onLadder) {
          r.y += rspd * 1.2 * dt;
          if (r.y >= r.ladderTargetY) {
            r.y = r.ladderTargetY;
            r.onLadder = false;
          }
        } else if (r.falling) {
          r.vy += GRAVITY * dt;
          r.y += r.vy * dt;
          // land on next platform below
          let landed = false;
          for (let ti = r.tier - 1; ti >= 0; ti--) {
            const p = PLATFORMS[ti];
            if (r.x >= p.x1 - 6 && r.x <= p.x2 + 6 && r.y >= p.y - 9) {
              r.y = p.y - 9;
              r.tier = ti;
              r.falling = false;
              r.vy = 0;
              landed = true;
              break;
            }
          }
          if (!landed && r.y > H + 30) {
            s.rocks.splice(i, 1);
            continue;
          }
        } else {
          const p = PLATFORMS[r.tier];
          r.x += p.dir * rspd * dt;
          r.rot += (p.dir * rspd * dt) / 9;
          // ladder descent chance
          if (r.tier > 0) {
            for (const lx of lsets[r.tier - 1]) {
              if (Math.abs(r.x - lx) < 5 && r.lastLadderX !== lx) {
                r.lastLadderX = lx;
                if (Math.random() < 0.35) {
                  r.onLadder = true;
                  r.x = lx;
                  r.ladderTargetY = PLATFORMS[r.tier - 1].y - 9;
                  r.tier = r.tier - 1;
                }
                break;
              }
            }
          }
          if (!r.onLadder && (r.x < p.x1 - 2 || r.x > p.x2 + 2)) {
            if (r.tier === 0) {
              s.rocks.splice(i, 1);
              continue;
            }
            r.falling = true;
            r.vy = 0;
          }
        }
        // collision with player
        const pxc = s.px;
        const pyc = s.py - PLAYER_H / 2;
        if (Math.abs(r.x - pxc) < 9 + PLAYER_W / 2 - 2 && Math.abs(r.y - pyc) < 9 + PLAYER_H / 2 - 4) {
          if (s.invuln <= 0 && s.liftoff <= 0) {
            s.lives -= 1;
            if (s.lives <= 0) {
              setFinalScore(s.score);
              go('gameover');
              return;
            }
            spawnPlayer(s);
            s.invuln = 2;
          }
        }
        // jump-over bonus
        if (!r.jumped && !s.onGround && !s.climbing && Math.abs(r.x - s.px) < 22 && s.py < r.y - 12) {
          r.jumped = true;
          s.score += 100;
          s.popups.push({ x: r.x, y: r.y - 24, text: '+100', age: 0 });
        }
      }
      for (let i = s.popups.length - 1; i >= 0; i--) if ((s.popups[i].age += dt) > 1.1) s.popups.splice(i, 1);
    };

    const drawGirder = (p: { x1: number; x2: number; y: number }) => {
      glow('rgba(57,213,203,0.55)', 6);
      ctx.strokeStyle = girderGrad;
      ctx.lineWidth = 3;
      ctx.strokeRect(p.x1, p.y, p.x2 - p.x1, 12);
      noGlow();
      ctx.fillStyle = 'rgba(57,213,203,0.12)';
      ctx.fillRect(p.x1, p.y, p.x2 - p.x1, 12);
      ctx.fillStyle = 'rgba(57,213,203,0.7)';
      for (let x = p.x1 + 14; x < p.x2 - 6; x += 34) {
        ctx.beginPath();
        ctx.arc(x, p.y + 6, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawLadder = (x: number, y1: number, y2: number) => {
      glow('rgba(244,253,123,0.6)', 6);
      ctx.strokeStyle = '#F4FD7B';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x - 8, y1 + 4);
      ctx.lineTo(x - 8, y2 + 10);
      ctx.moveTo(x + 8, y1 + 4);
      ctx.lineTo(x + 8, y2 + 10);
      ctx.stroke();
      ctx.lineWidth = 2;
      for (let y = y1 + 12; y < y2 + 6; y += 13) {
        ctx.beginPath();
        ctx.moveTo(x - 8, y);
        ctx.lineTo(x + 8, y);
        ctx.stroke();
      }
      noGlow();
    };

    const drawPlayer = (s: Sim) => {
      if (s.invuln > 0 && Math.floor(s.invuln * 10) % 2 === 0) return;
      ctx.save();
      ctx.translate(s.px, s.py);
      ctx.scale(s.facing, 1);
      const walk = s.onGround && s.vx !== 0 ? Math.sin(s.walkT) * 4 : 0;
      glow('rgba(255,255,255,0.75)', 8);
      // legs
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (s.climbing) {
        const c = Math.sin(s.t * 8) * 3;
        ctx.moveTo(-3, -10); ctx.lineTo(-4, 0 + c);
        ctx.moveTo(3, -10); ctx.lineTo(4, 0 - c);
      } else {
        ctx.moveTo(-3, -10); ctx.lineTo(-4 - walk, 0);
        ctx.moveTo(3, -10); ctx.lineTo(4 + walk, 0);
      }
      ctx.stroke();
      // body
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(-7, -24, 14, 16, 4);
      ctx.fill();
      // backpack
      ctx.fillStyle = '#c9ced9';
      ctx.fillRect(-11, -22, 4, 11);
      // arms
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      if (s.climbing) {
        const c = Math.sin(s.t * 8) * 3;
        ctx.moveTo(-5, -20); ctx.lineTo(-6, -28 + c);
        ctx.moveTo(5, -20); ctx.lineTo(6, -28 - c);
      } else if (!s.onGround) {
        ctx.moveTo(-6, -20); ctx.lineTo(-10, -26);
        ctx.moveTo(6, -20); ctx.lineTo(10, -26);
      } else {
        ctx.moveTo(-6, -20); ctx.lineTo(-8, -12 + walk * 0.5);
        ctx.moveTo(6, -20); ctx.lineTo(8, -12 - walk * 0.5);
      }
      ctx.stroke();
      // helmet
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -31, 8.5, 0, Math.PI * 2);
      ctx.fill();
      noGlow();
      ctx.fillStyle = '#0b1020';
      ctx.beginPath();
      ctx.roundRect(-2, -34.5, 8, 7.5, 3.5);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillRect(2, -33, 2.5, 2);
      // stun stars
      if (s.stun > 0) {
        glow('rgba(244,253,123,0.8)', 8);
        ctx.fillStyle = '#F4FD7B';
        for (let i = 0; i < 3; i++) {
          const a = s.t * 6 + (i * Math.PI * 2) / 3;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * 12, -40 + Math.sin(a) * 3, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        noGlow();
      }
      ctx.restore();
    };

    const drawAlien = (s: Sim) => {
      const x = 60;
      const y = PLATFORMS[5].y;
      const toss = s.tossAnim > 0;
      ctx.save();
      ctx.translate(x, y);
      glow('#E4416F', 10);
      ctx.fillStyle = '#E4416F';
      ctx.beginPath();
      ctx.ellipse(0, -22, 22, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      // arms
      ctx.strokeStyle = '#E4416F';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      if (toss) {
        ctx.moveTo(14, -30); ctx.lineTo(30, -44);
        ctx.moveTo(-14, -26); ctx.lineTo(-24, -18);
      } else {
        // crossed arms
        ctx.moveTo(-16, -22); ctx.lineTo(10, -14);
        ctx.moveTo(16, -22); ctx.lineTo(-10, -14);
      }
      ctx.stroke();
      noGlow();
      // grumpy eyes + brow
      ctx.fillStyle = '#0b1020';
      ctx.beginPath();
      ctx.arc(-7, -28, 3, 0, Math.PI * 2);
      ctx.arc(7, -28, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0b1020';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-12, -34); ctx.lineTo(-3, -31);
      ctx.moveTo(12, -34); ctx.lineTo(3, -31);
      ctx.stroke();
      // rock pile
      glow('rgba(201,206,217,0.5)', 7);
      ctx.fillStyle = '#9aa3b2';
      ctx.beginPath();
      ctx.arc(38, -8, 8, 0, Math.PI * 2);
      ctx.arc(50, -6, 6, 0, Math.PI * 2);
      ctx.arc(44, -14, 6, 0, Math.PI * 2);
      ctx.fill();
      noGlow();
      ctx.restore();
    };

    const drawRocket = (s: Sim) => {
      const lift = s.liftoff > 0 ? Math.pow(s.liftoff, 2) * 320 : 0;
      const x = (PAD.x1 + PAD.x2) / 2 + 20;
      const y = PAD.y - lift;
      ctx.save();
      ctx.translate(x, y);
      // flame when lifting
      if (s.liftoff > 0) {
        const f = 12 + Math.sin(s.t * 40) * 5;
        glow('#F4FD7B', 14);
        ctx.fillStyle = '#F4FD7B';
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(0, f + 14);
        ctx.lineTo(8, 0);
        ctx.closePath();
        ctx.fill();
      }
      // rocket body — soft vertical shading for a hint of dimension
      glow('rgba(255,255,255,0.75)', 8);
      const bodyGrad = ctx.createLinearGradient(0, -42, 0, 0);
      bodyGrad.addColorStop(0, '#ffffff');
      bodyGrad.addColorStop(1, '#c7cfdd');
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.moveTo(0, -42);
      ctx.quadraticCurveTo(12, -27, 12, -10);
      ctx.lineTo(12, 0);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-12, -10);
      ctx.quadraticCurveTo(-12, -27, 0, -42);
      ctx.fill();
      glow('#39d5cb', 8);
      ctx.fillStyle = '#39d5cb';
      ctx.beginPath();
      ctx.moveTo(-12, -8); ctx.lineTo(-21, 0); ctx.lineTo(-12, 0);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(12, -8); ctx.lineTo(21, 0); ctx.lineTo(12, 0);
      ctx.closePath();
      ctx.fill();
      glow('rgba(244,253,123,0.6)', 6);
      ctx.fillStyle = '#F4FD7B';
      ctx.beginPath();
      ctx.arc(0, -22, 5, 0, Math.PI * 2);
      ctx.fill();
      noGlow();
      ctx.fillStyle = '#0b1020';
      ctx.beginPath();
      ctx.arc(0, -22, 3, 0, Math.PI * 2);
      ctx.fill();
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
      // ladders (behind platforms)
      const sets = ladders(s.level);
      for (let gap = 0; gap < 5; gap++) for (const lx of sets[gap]) drawLadder(lx, PLATFORMS[gap + 1].y, PLATFORMS[gap].y);
      drawLadder(FINAL_LADDER_X, PAD.y, PLATFORMS[5].y);
      // platforms
      for (const p of PLATFORMS) drawGirder(p);
      drawGirder(PAD);
      drawRocket(s);
      drawAlien(s);
      // rocks
      for (const r of s.rocks) {
        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.rotate(r.rot);
        glow('rgba(201,206,217,0.5)', 7);
        ctx.fillStyle = '#9aa3b2';
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fill();
        noGlow();
        ctx.fillStyle = 'rgba(11,16,32,0.35)';
        ctx.beginPath();
        ctx.arc(-3, -2, 2.2, 0, Math.PI * 2);
        ctx.arc(4, 3, 1.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      drawPlayer(s);
      // popups
      ctx.font = 'bold 15px ui-monospace, monospace';
      glow('rgba(244,253,123,0.8)', 8);
      for (const pp of s.popups) {
        ctx.fillStyle = '#F4FD7B';
        ctx.globalAlpha = 1 - pp.age / 1.1;
        ctx.fillText(pp.text, pp.x - 16, pp.y - pp.age * 24);
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
      ctx.fillText('LEVEL ' + s.level, W / 2, 28);
      ctx.textAlign = 'left';
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
      if (s.liftoff > 0) {
        ctx.font = 'bold 44px ui-monospace, monospace';
        glow('rgba(244,253,123,0.9)', 18);
        ctx.fillStyle = '#F4FD7B';
        ctx.textAlign = 'center';
        ctx.fillText('LIFTOFF!', W / 2, H / 2 - 40);
        ctx.textAlign = 'left';
        noGlow();
      }
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
    simRef.current = newSim(1, 0, 3);
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
                  <h2 className="font-bold text-3xl mb-3">Rocket Climb</h2>
                  <p className="text-white/70 mb-4 leading-6">
                    A grumpy alien took the launch tower and is rolling moon rocks down it.
                    Climb to your rocket, kid — mind the rocks.
                  </p>
                  <p className="text-white/50 text-sm mb-6">← → move · ↑ ↓ climb · space jumps · esc pauses</p>
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
                  <h2 className="font-bold text-3xl mb-2">Squashed by a moon rock!</h2>
                  <p className="text-white/70 mb-6">Score: {finalScore}</p>
                  <button onClick={restart} className={btn}>
                    ↻ Try again
                  </button>
                </>
              )}
              {phase === 'won' && (
                <>
                  <h2 className="font-bold text-3xl mb-2">🚀 To the stars!</h2>
                  <p className="text-white/70 mb-6">You cleared all 5 towers. Score: {finalScore}</p>
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
