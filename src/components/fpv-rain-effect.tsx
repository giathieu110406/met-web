'use client';

import { useMemo } from 'react';

export default function FpvRainEffect() {
  // 1. Foreground distinct falling raindrops (clearly visible droplets, not lines)
  const foregroundDrops = useMemo(() => {
    const drops = [];
    for (let i = 0; i < 40; i++) {
      const left = ((i * 17 + 7) % 96) + 2; // 2% to 98%
      const delay = ((i * 13) % 25) / 50;   // 0s to 0.5s
      const duration = 0.38 + ((i * 7) % 15) / 100; // 0.38s to 0.53s
      const height = 18 + ((i * 11) % 14); // 18px to 32px
      const width = i % 3 === 0 ? 2.5 : 2;  // 2px - 2.5px
      drops.push({ id: `fg-${i}`, left, delay, duration, height, width });
    }
    return drops;
  }, []);

  // 2. Background softer raindrops for depth
  const backgroundDrops = useMemo(() => {
    const drops = [];
    for (let i = 0; i < 45; i++) {
      const left = ((i * 23 + 3) % 98) + 1;
      const delay = ((i * 19) % 30) / 60;
      const duration = 0.48 + ((i * 9) % 20) / 100;
      const height = 12 + ((i * 5) % 10);
      drops.push({ id: `bg-${i}`, left, delay, duration, height });
    }
    return drops;
  }, []);

  // 3. Umbrella canopy drip points (following the arch of the umbrella rim)
  const umbrellaDrips = useMemo(() => [
    { id: 'd1', left: '8%', top: '56px', delay: '0.2s', duration: '1.4s' },
    { id: 'd2', left: '18%', top: '44px', delay: '0.9s', duration: '1.2s' },
    { id: 'd3', left: '29%', top: '34px', delay: '0.4s', duration: '1.5s' },
    { id: 'd4', left: '40%', top: '27px', delay: '1.1s', duration: '1.3s' },
    { id: 'd5', left: '50%', top: '24px', delay: '0.1s', duration: '1.6s' },
    { id: 'd6', left: '60%', top: '27px', delay: '0.7s', duration: '1.3s' },
    { id: 'd7', left: '71%', top: '34px', delay: '1.3s', duration: '1.5s' },
    { id: 'd8', left: '82%', top: '44px', delay: '0.5s', duration: '1.2s' },
    { id: 'd9', left: '92%', top: '56px', delay: '1.0s', duration: '1.4s' },
  ], []);

  // 4. Ground puddle splash & ripple points
  const puddleSplashes = useMemo(() => [
    { id: 's1', left: '16%', bottom: '28px', delay: '0.3s' },
    { id: 's2', left: '28%', bottom: '22px', delay: '0.8s' },
    { id: 's3', left: '42%', bottom: '34px', delay: '0.1s' },
    { id: 's4', left: '55%', bottom: '25px', delay: '1.2s' },
    { id: 's5', left: '68%', bottom: '30px', delay: '0.5s' },
    { id: 's6', left: '80%', bottom: '24px', delay: '0.9s' },
    { id: 's7', left: '90%', bottom: '32px', delay: '0.4s' },
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Background Rain Layer */}
      {backgroundDrops.map((drop) => (
        <div
          key={drop.id}
          className="absolute"
          style={{
            left: `${drop.left}%`,
            top: '-20px',
            width: '1.5px',
            height: `${drop.height}px`,
            background: 'linear-gradient(180deg, rgba(147, 197, 253, 0.1) 0%, rgba(186, 230, 253, 0.45) 80%, rgba(224, 242, 254, 0.75) 100%)',
            borderRadius: '0 0 1px 1px',
            animation: `raindrop-fall ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}

      {/* Foreground Realistic Raindrops (Teardrop shape with glowing head) */}
      {foregroundDrops.map((drop) => (
        <div
          key={drop.id}
          className="absolute"
          style={{
            left: `${drop.left}%`,
            top: '-30px',
            width: `${drop.width}px`,
            height: `${drop.height}px`,
            background: 'linear-gradient(180deg, transparent 0%, rgba(186, 230, 253, 0.4) 40%, rgba(224, 242, 254, 0.95) 90%, #ffffff 100%)',
            boxShadow: '0 0 3px rgba(224, 242, 254, 0.8)',
            borderRadius: '0 0 1.5px 1.5px',
            animation: `raindrop-fall ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}

      {/* Dripping Water Droplets from the Umbrella Canopy Edge */}
      {umbrellaDrips.map((drip) => (
        <div
          key={drip.id}
          className="absolute flex flex-col items-center"
          style={{
            left: drip.left,
            top: drip.top,
          }}
        >
          {/* Swelling & Falling Teardrop */}
          <div
            className="rounded-full"
            style={{
              width: '3.5px',
              height: '5px',
              background: 'radial-gradient(circle, #ffffff 30%, #7dd3fc 80%, #38bdf8 100%)',
              boxShadow: '0 0 4px rgba(224, 242, 254, 0.9)',
              animation: `canopy-drip ${drip.duration} ease-in infinite`,
              animationDelay: drip.delay,
            }}
          />
        </div>
      ))}

      {/* Puddle Splashes & Expanding Water Ripples on Ground */}
      {puddleSplashes.map((splash) => (
        <div
          key={splash.id}
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left: splash.left,
            bottom: splash.bottom,
            width: '30px',
            height: '12px',
          }}
        >
          {/* Expanding Ripple Ring */}
          <div
            className="absolute rounded-full border border-sky-300/60"
            style={{
              width: '18px',
              height: '6px',
              animation: 'puddle-ripple 1.5s ease-out infinite',
              animationDelay: splash.delay,
            }}
          />

          {/* Upward Splash Droplets */}
          <div
            className="absolute w-1 h-1 rounded-full bg-white shadow-sm"
            style={{
              animation: 'rain-splash 1.5s ease-out infinite',
              animationDelay: splash.delay,
            }}
          />
          <div
            className="absolute w-1 h-1 rounded-full bg-sky-200"
            style={{
              left: '8px',
              animation: 'rain-splash 1.5s ease-out infinite',
              animationDelay: `${parseFloat(splash.delay) + 0.1}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
