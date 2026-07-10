'use client';

import React, { useEffect, useRef } from 'react';

const NorthernLights = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 600;
    };
    resize();
    window.addEventListener('resize', resize);

    // Site palette — same colors as --color-1..5 and the top color bar gradient
    const palette = [
      { r: 244, g: 253, b: 123 }, // Yellow #f4fd7b
      { r: 57, g: 213, b: 203 },  // Teal #39d5cb
      { r: 228, g: 65, b: 111 },  // Pink #e4416f
      { r: 252, g: 211, b: 77 },  // Gold #fcd34d
      { r: 110, g: 231, b: 183 }, // Mint #6ee7b7
    ];

    // Sync with the top bar's drifting gradient (.color-bar). Its tile is
    // (background-size / 100) viewports wide and slides (that - 1) tile widths
    // per animation cycle, so sampling the tile at a viewport fraction gives
    // the exact color passing overhead at any moment.
    const bar = document.querySelector('.color-bar');
    const barStyle = bar ? getComputedStyle(bar) : null;
    const barDurationMs = (parseFloat(barStyle?.animationDuration ?? '') || 50) * 1000;
    const barTileViewports = (parseFloat(barStyle?.backgroundSize ?? '') || 400) / 100;
    const barTilesPerCycle = barTileViewports - 1;
    let barAnim: Animation | null = null;

    const barPhase = () => {
      if (!barAnim) barAnim = bar?.getAnimations()[0] ?? null;
      const t = typeof barAnim?.currentTime === 'number' ? barAnim.currentTime : time * 1000;
      return ((t / barDurationMs) * barTilesPerCycle) % 1;
    };

    // Color of the bar gradient above viewport fraction u (0 = left, 1 = right)
    const barColorAt = (u: number) => {
      const raw = barPhase() + u / barTileViewports;
      const f = Number.isFinite(raw) ? ((raw % 1) + 1) % 1 : 0;
      const seg = f * palette.length;
      const i = Math.floor(seg) % palette.length;
      const a = palette[i];
      const b = palette[(i + 1) % palette.length];
      const k = seg - Math.floor(seg);
      return {
        r: a.r + (b.r - a.r) * k,
        g: a.g + (b.g - a.g) * k,
        b: a.b + (b.b - a.b) * k,
      };
    };

    // 2-4 aurora shapes visible at a time
    const numAuroras = 3;
    const auroras = Array.from({ length: numAuroras }, (_, i) => ({
      baseX: canvas.width * (0.1 + i * 0.4), // Spread across screen
      phaseOffset: i * (Math.PI / 1.5) + Math.random() * 3,
      baseLength: 0.6 + Math.random() * 0.4, // Varied - 60-100% of canvas height
      topWidth: canvas.width * (0.5 + Math.random() * 0.4), // Wider at top - 50-90% screen width
      speedMultiplier: 0.08 + Math.random() * 0.12,
      driftSpeed: 0.2 + Math.random() * 0.25, // Independent horizontal drift
      waveFrequency: 0.005 + Math.random() * 0.006,
      waveAmplitude: 40 + Math.random() * 60, // More varied flag-like waves
      taperStyle: Math.random(), // 0-1 controls how it tapers (more variety)
      diffuseRate: 0.3 + Math.random() * 0.5, // How quickly it diffuses
    }));

    let animationId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      auroras.forEach((aurora) => {
        const { phaseOffset, speedMultiplier, topWidth, waveFrequency, waveAmplitude, driftSpeed, taperStyle, diffuseRate } = aurora;
        const waveTime = time * speedMultiplier;

        // Pulsing length - auroras flare down from above and retract
        const pulseLength = aurora.baseLength * (0.7 + Math.sin(waveTime * 0.5 + phaseOffset) * 0.3);
        const auroraHeight = canvas.height * pulseLength;

        // Independent horizontal drift - auroras move through each other
        const drift = Math.sin(waveTime * driftSpeed + phaseOffset) * (canvas.width * 0.35);
        const secondaryDrift = Math.sin(waveTime * driftSpeed * 0.7 + phaseOffset * 2) * (canvas.width * 0.1);
        const centerX = aurora.baseX + drift + secondaryDrift;

        // Match the color bar gradient currently passing over this aurora
        const u = canvas.width > 0 ? Math.min(1, Math.max(0, centerX / canvas.width)) : 0;
        const color = barColorAt(u);

        // Pulsing intensity - subtle
        const pulse = 0.14 + Math.sin(waveTime * 0.4 + phaseOffset) * 0.06;

        // Create gradient from above canvas (bright) to bottom (diffused/transparent)
        const gradient = ctx.createLinearGradient(0, -100, 0, auroraHeight + 100);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${pulse * 0.8})`);
        gradient.addColorStop(0.1, `rgba(${color.r}, ${color.g}, ${color.b}, ${pulse})`);
        gradient.addColorStop(0.35, `rgba(${color.r}, ${color.g}, ${color.b}, ${pulse * 0.5})`);
        gradient.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, ${pulse * 0.2})`);
        gradient.addColorStop(0.85, `rgba(${color.r}, ${color.g}, ${color.b}, ${pulse * 0.05})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();

        // Top of aurora - wide, off screen
        const topY = -100;

        // Flag-like wave that travels down - wave phase increases with y
        const getWaveX = (y: number, side: number) => {
          const travelingWave = Math.sin((y * waveFrequency) - (waveTime * 2) + phaseOffset + side);
          const secondaryWave = Math.sin((y * waveFrequency * 2.5) - (waveTime * 1.5) + phaseOffset * 1.5 + side) * 0.3;
          const progress = Math.max(0, (y - topY) / (auroraHeight - topY));
          // Wave amplitude increases as it diffuses downward
          const diffuseAmplitude = waveAmplitude * (1 + progress * diffuseRate);
          return (travelingWave + secondaryWave) * diffuseAmplitude;
        };

        // Width - varies based on taperStyle, diffuses/spreads as it goes down
        const getWidth = (y: number) => {
          const progress = Math.max(0, (y - topY) / (auroraHeight - topY));
          // Different taper curves based on taperStyle
          const taperCurve = taperStyle < 0.33
            ? (1 - progress * 0.8) // Gentle taper
            : taperStyle < 0.66
              ? (1 - progress * progress * 0.9) // Curved taper (stays wider longer)
              : (1 - Math.sqrt(progress) * 0.85); // Quick initial taper then spreads

          // Add diffusion - shape spreads out as it descends
          const diffusion = 1 + progress * diffuseRate * 0.5;
          return topWidth * 0.5 * taperCurve * diffusion;
        };

        // Start at top left
        ctx.moveTo(centerX - getWidth(topY) + getWaveX(topY, 0), topY);

        // Left edge - varies width with diffusion and flag wave
        for (let y = topY; y <= auroraHeight + 50; y += 12) {
          const width = getWidth(Math.min(y, auroraHeight));
          const waveX = getWaveX(y, 0);
          ctx.lineTo(centerX - width + waveX, y);
        }

        // Bottom - diffused, wide spread
        const bottomY = auroraHeight + 50;
        ctx.lineTo(centerX + getWaveX(bottomY, 0.5), bottomY);

        // Right edge - varies width with diffusion and flag wave
        for (let y = auroraHeight + 50; y >= topY; y -= 12) {
          const width = getWidth(Math.min(y, auroraHeight));
          const waveX = getWaveX(y, 1);
          ctx.lineTo(centerX + width + waveX, y);
        }

        ctx.closePath();
        ctx.fill();
      });

      time += 0.015;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full pointer-events-none z-0"
      style={{
        height: '600px',
        filter: 'blur(30px)',
        opacity: 0.9,
      }}
    />
  );
};

export default NorthernLights;
