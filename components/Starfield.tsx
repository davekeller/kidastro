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
      canvas.height = document.documentElement.scrollHeight;
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
    }

    interface ShootingStar {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      opacity: number;
    }

    interface UFO {
      x: number;
      y: number;
      vx: number;
      vy: number;
      scale: number;
      wobblePhase: number;
      lightsPhase: number;
    }

    interface Nebula {
      x: number;
      y: number;
      radius: number;
      color: string;
      opacity: number;
      pulsePhase: number;
      pulseSpeed: number;
    }

    interface Nova {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
      color: string;
    }

    const stars: Star[] = [];
    const numStars = 800;
    
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    const shootingStars: ShootingStar[] = [];
    const ufos: UFO[] = [];
    const nebulas: Nebula[] = [];
    const novas: Nova[] = [];

    // Create initial nebulas
    const nebulaColors = ['#f4fd7b', '#39d5cb', '#e4416f', '#6ee7b7', '#fcd34d'];
    for (let i = 0; i < 3; i++) {
      nebulas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 150 + 100,
        color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
        opacity: 0.03 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.005 + 0.002,
      });
    }

    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 10 + 10,
        angle: Math.PI / 4,
        opacity: 1,
      });
    };

    const createUFO = () => {
      const startLeft = Math.random() > 0.5;
      ufos.push({
        x: startLeft ? -50 : canvas.width + 50,
        y: Math.random() * (canvas.height * 0.6),
        vx: (startLeft ? 1 : -1) * (Math.random() * 2 + 1),
        vy: (Math.random() - 0.5) * 0.5,
        scale: Math.random() * 0.4 + 0.6,
        wobblePhase: 0,
        lightsPhase: 0,
      });
    };

    const createNova = () => {
      novas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0,
        maxRadius: Math.random() * 40 + 30,
        opacity: 1,
        color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
      });
    };

    // Initial elements
    setTimeout(createShootingStar, 1000);
    setTimeout(createUFO, 2000);
    setTimeout(createNova, 5000);

    let animationFrameId: number;
    let lastShootingStarTime = Date.now();
    let lastUFOTime = Date.now();
    let lastNovaTime = Date.now();

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebulas
      nebulas.forEach((nebula) => {
        nebula.pulsePhase += nebula.pulseSpeed;
        const pulse = Math.sin(nebula.pulsePhase) * 0.3 + 0.7;
        
        const gradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.radius * pulse
        );
        gradient.addColorStop(0, `${nebula.color}${Math.floor(nebula.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.5, `${nebula.color}${Math.floor(nebula.opacity * 0.5 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          nebula.x - nebula.radius * pulse,
          nebula.y - nebula.radius * pulse,
          nebula.radius * 2 * pulse,
          nebula.radius * 2 * pulse
        );
      });

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

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();
      });

      // Draw and update novas (exploding stars)
      novas.forEach((nova, index) => {
        nova.radius += 1.5;
        nova.opacity -= 0.015;

        // Draw expanding ring
        const gradient = ctx.createRadialGradient(
          nova.x, nova.y, nova.radius * 0.7,
          nova.x, nova.y, nova.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, `${nova.color}${Math.floor(nova.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(nova.x, nova.y, nova.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw bright center
        ctx.beginPath();
        ctx.arc(nova.x, nova.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${nova.opacity})`;
        ctx.fill();

        if (nova.opacity <= 0 || nova.radius > nova.maxRadius) {
          novas.splice(index, 1);
        }
      });

      // Draw and update shooting stars
      shootingStars.forEach((shootingStar, index) => {
        const x2 = shootingStar.x + Math.cos(shootingStar.angle) * shootingStar.len;
        const y2 = shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.len;

        const gradient = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          x2,
          y2
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${shootingStar.opacity * 0.8})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${shootingStar.opacity})`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.015;

        if (shootingStar.opacity <= 0 || shootingStar.x > canvas.width || shootingStar.y > canvas.height) {
          shootingStars.splice(index, 1);
        }
      });

      // Draw and update UFOs
      ufos.forEach((ufo, index) => {
        ufo.x += ufo.vx;
        ufo.y += ufo.vy + Math.sin(ufo.wobblePhase) * 0.2;
        ufo.wobblePhase += 0.05;
        ufo.lightsPhase += 0.1;

        const scale = ufo.scale;
        
        ctx.save();
        ctx.translate(ufo.x, ufo.y);
        ctx.rotate(Math.sin(ufo.wobblePhase) * 0.1);
        ctx.scale(scale, scale);

        // Dome
        ctx.beginPath();
        ctx.ellipse(0, -5, 15, 10, 0, Math.PI, 0);
        ctx.fillStyle = 'rgba(200, 230, 255, 0.6)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, 30, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(200, 200, 200, 1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Lights
        const numLights = 5;
        for (let i = 0; i < numLights; i++) {
          const angle = (i / numLights) * Math.PI + Math.PI;
          const lx = Math.cos(angle) * 20;
          const ly = Math.sin(angle) * 6;
          
          const blink = Math.sin(ufo.lightsPhase + i * 1.5) > 0;
          
          ctx.beginPath();
          ctx.arc(lx, ly, 2, 0, Math.PI * 2);
          ctx.fillStyle = blink ? '#f4fd7b' : '#e4416f';
          ctx.fill();
        }

        ctx.restore();

        if (ufo.x < -100 || ufo.x > canvas.width + 100) {
          ufos.splice(index, 1);
        }
      });

      // Create new elements
      const now = Date.now();
      
      if (now - lastShootingStarTime > 800 && Math.random() > 0.95) {
        createShootingStar();
        lastShootingStarTime = now;
      }

      if (now - lastUFOTime > 7000 && Math.random() > 0.98) {
        createUFO();
        lastUFOTime = now;
      }

      if (now - lastNovaTime > 12000 && Math.random() > 0.97) {
        createNova();
        lastNovaTime = now;
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
