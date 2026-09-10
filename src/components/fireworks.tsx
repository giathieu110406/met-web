'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  gravity: number;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  exploded: boolean;
  color: string;
}

export default function Fireworks({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const fireworksRef = useRef<Firework[]>([]);
  const lastFireworkTime = useRef(0);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 400;

    const colors = ['#f9a8d4', '#c4b5fd', '#fde68a', '#86efac', '#fca5a5', '#93c5fd'];

    function spawnFirework() {
      const color = colors[Math.floor(Math.random() * colors.length)];
      fireworksRef.current.push({
        x: 100 + Math.random() * 400,
        y: 400,
        targetY: 60 + Math.random() * 120,
        vy: -6 - Math.random() * 3,
        exploded: false,
        color,
      });
    }

    function explodeFirework(fw: Firework) {
      const particleCount = 30 + Math.floor(Math.random() * 20);
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3;
        const speed = 1 + Math.random() * 3;
        particlesRef.current.push({
          x: fw.x,
          y: fw.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: fw.color,
          size: 1.5 + Math.random() * 2,
          life: 60 + Math.random() * 40,
          maxLife: 100,
          gravity: 0.03,
        });
      }
    }

    let animId: number;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      if (now - lastFireworkTime.current > 800 + Math.random() * 1200) {
        spawnFirework();
        lastFireworkTime.current = now;
      }

      // Update & draw fireworks (rising phase)
      fireworksRef.current = fireworksRef.current.filter((fw) => {
        if (!fw.exploded) {
          fw.y += fw.vy;
          // Draw trail
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.globalAlpha = 0.8;
          ctx.fill();
          ctx.globalAlpha = 1;

          if (fw.y <= fw.targetY) {
            fw.exploded = true;
            explodeFirework(fw);
            return false;
          }
          return true;
        }
        return false;
      });

      // Update & draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.life--;

        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        return p.life > 0;
      });

      animId = requestAnimationFrame(animate);
    }

    // Fire first firework immediately
    spawnFirework();
    lastFireworkTime.current = Date.now();
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      particlesRef.current = [];
      fireworksRef.current = [];
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-40"
      style={{ width: '600px', height: '400px' }}
    />
  );
}
