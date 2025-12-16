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

    // Aurora colors - orange, pink, blue, purple
    const colors = [
      { r: 255, g: 140, b: 50 },  // Orange #ff8c32
      { r: 236, g: 72, b: 153 }, // Pink #ec4899
      { r: 59, g: 130, b: 246 },  // Blue #3b82f6
      { r: 168, g: 85, b: 247 }, // Purple #a855f7
      { r: 244, g: 114, b: 182 }, // Light pink #f472b6
    ];

    // 2-4 aurora shapes visible at a time
    const numAuroras = 3;
    const auroras = Array.from({ length: numAuroras }, (_, i) => ({
      baseX: canvas.width * (0.1 + i * 0.4), // Spread across screen
      colorIndex: i % colors.length,
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

    // Track which color pair we're showing
    let colorPairIndex = 0;
    let colorTransition = 0;

    let animationId: number;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Slowly cycle through color pairs
      colorTransition += 0.001;
      if (colorTransition >= 1) {
        colorTransition = 0;
        colorPairIndex = (colorPairIndex + 1) % colors.length;
      }

      // Get current colors with smooth transition
      const getColorIndices = (auroraIndex: number) => {
        const base = (colorPairIndex + auroraIndex) % colors.length;
        const next = (base + 1) % colors.length;
        return { base, next };
      };

      auroras.forEach((aurora, i) => {
        // Each aurora gets its own color, cycling through the palette
        const { base, next } = getColorIndices(i);
        const baseColor = colors[base];
        const nextColor = colors[next];

        // Lerp between current and next color
        const color = {
          r: baseColor.r + (nextColor.r - baseColor.r) * colorTransition,
          g: baseColor.g + (nextColor.g - baseColor.g) * colorTransition,
          b: baseColor.b + (nextColor.b - baseColor.b) * colorTransition,
        };

        const { phaseOffset, speedMultiplier, topWidth, waveFrequency, waveAmplitude, driftSpeed, taperStyle, diffuseRate } = aurora;
        const waveTime = time * speedMultiplier;

        // Pulsing length - auroras flare down from above and retract
        const pulseLength = aurora.baseLength * (0.7 + Math.sin(waveTime * 0.5 + phaseOffset) * 0.3);
        const auroraHeight = canvas.height * pulseLength;

        // Independent horizontal drift - auroras move through each other
        const drift = Math.sin(waveTime * driftSpeed + phaseOffset) * (canvas.width * 0.35);
        const secondaryDrift = Math.sin(waveTime * driftSpeed * 0.7 + phaseOffset * 2) * (canvas.width * 0.1);
        const centerX = aurora.baseX + drift + secondaryDrift;

        // Pulsing intensity - subtle
        const pulse = 0.07 + Math.sin(waveTime * 0.4 + phaseOffset) * 0.035;

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
