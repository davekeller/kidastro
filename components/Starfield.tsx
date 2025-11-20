'use client';

import React, { useEffect, useRef } from 'react';

const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Interfaces
    interface Star {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
      twinkleSpeed: number;
      twinklePhase: number;
      color: string;
    }

    interface ShootingStar {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      opacity: number;
      size: number;
      color: string;
    }

    // Brand color palette
    const brandColors = [
      '#f4fd7b', // Yellow
      '#39d5cb', // Teal
      '#e4416f', // Pink
      '#fcd34d', // Gold
      '#6ee7b7', // Mint
    ];

    const stars: Star[] = [];
    const numStars = 320;
    
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        opacity: Math.random() * 0.4 + 0.1, // Varied: 0.1 to 0.5 for more brightness variation
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        color: brandColors[Math.floor(Math.random() * brandColors.length)],
      });
    }

    const shootingStars: ShootingStar[] = [];

    const createShootingStar = () => {
      // Vary direction more: can go left-to-right, right-to-left, or diagonal
      const direction = Math.random();
      let angle;
      let startX;
      
      if (direction < 0.33) {
        // Top-left to bottom-right
        angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
        startX = Math.random() * canvas.width * 0.3;
      } else if (direction < 0.66) {
        // Top-right to bottom-left
        angle = (3 * Math.PI) / 4 + (Math.random() - 0.5) * 0.5;
        startX = canvas.width * 0.7 + Math.random() * canvas.width * 0.3;
      } else {
        // More vertical
        angle = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
        startX = Math.random() * canvas.width;
      }
      
      shootingStars.push({
        x: startX,
        y: Math.random() * canvas.height * 0.3,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 15 + 10,
        angle: angle,
        opacity: 1,
        size: Math.random() * 1 + 1.5,
        color: brandColors[Math.floor(Math.random() * brandColors.length)],
      });
    };

    // Initial elements
    setTimeout(createShootingStar, 1000);

    let animationFrameId: number;
    let lastShootingStarTime = Date.now();

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update regular stars
      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7;

        // Convert hex color to RGB for rgba
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 255, g: 255, b: 255 };
        };
        
        const rgb = hexToRgb(star.color);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${star.opacity * twinkle})`;
        ctx.fill();
      });

      // Draw and update shooting stars
      shootingStars.forEach((shootingStar, index) => {
        const x2 = shootingStar.x + Math.cos(shootingStar.angle) * shootingStar.len;
        const y2 = shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.len;

        // Convert hex color to RGB for rgba
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 255, g: 255, b: 255 };
        };
        
        const rgb = hexToRgb(shootingStar.color);

        // Tail gradient
        const gradient = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          x2,
          y2
        );
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shootingStar.opacity})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Glowing head
        ctx.beginPath();
        ctx.arc(x2, y2, shootingStar.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shootingStar.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = shootingStar.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.01;

        if (shootingStar.opacity <= 0 || shootingStar.x > canvas.width || shootingStar.y > canvas.height) {
          shootingStars.splice(index, 1);
        }
      });

      // Create new elements
      const now = Date.now();
      
      if (now - lastShootingStarTime > 4000 && Math.random() > 0.985) {
        createShootingStar();
        lastShootingStarTime = now;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ height: '100%' }}
    />
  );
};

export default Starfield;
