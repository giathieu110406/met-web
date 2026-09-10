'use client';

import React, { useMemo } from 'react';

interface DynamicSkyProps {
  cameraX: number;
  isHillMap?: boolean;
}

function DynamicSkyComponent({ cameraX, isHillMap = false }: DynamicSkyProps) {
  // Quantize progress across the 1800px camera scroll range
  const progress = Math.max(0, Math.min(cameraX / 1800, 1));

  // Compute smooth atmospheric layer opacities for continuous cross-fading
  // Zone 0: Sunset (0 - 0.28)
  // Zone 1: Twilight / Rain (0.28 - 0.65)
  // Zone 2: Starry Night (0.65 - 0.88)
  // Zone 3: Rosy Dawn (0.88 - 1.0)
  let sunsetOp = 0;
  let twilightOp = 0;
  let nightOp = 0;
  let dawnOp = 0;

  if (!isHillMap) {
    if (progress <= 0.28) {
      const t = progress / 0.28;
      sunsetOp = 1 - t * 0.4;
      twilightOp = t * 0.4;
    } else if (progress <= 0.65) {
      const t = (progress - 0.28) / (0.65 - 0.28);
      sunsetOp = Math.max(0, 0.6 * (1 - t * 2));
      twilightOp = 1 - Math.max(0, (t - 0.5) * 2) * 0.3;
      nightOp = Math.max(0, (t - 0.5) * 2);
    } else if (progress <= 0.88) {
      const t = (progress - 0.65) / (0.88 - 0.65);
      twilightOp = Math.max(0, 0.7 * (1 - t * 2));
      nightOp = 1 - Math.max(0, (t - 0.6) * 2.5) * 0.4;
      dawnOp = Math.max(0, (t - 0.5) * 2);
    } else {
      const t = (progress - 0.88) / 0.12;
      nightOp = Math.max(0, 0.6 * (1 - t * 2));
      dawnOp = 1;
    }
  }

  const showSun = isHillMap || progress < 0.32 || progress > 0.85;
  const showMoon = !isHillMap && progress >= 0.62 && progress <= 0.90;
  const showStars = !isHillMap && progress >= 0.60 && progress <= 0.92;

  // Pre-calculated star positions
  const stars = useMemo(
    () => [
      { left: '8%', top: '15%', size: 2, delay: '0.2s' },
      { left: '22%', top: '25%', size: 3, delay: '1.2s' },
      { left: '38%', top: '10%', size: 2, delay: '0.8s' },
      { left: '55%', top: '20%', size: 3, delay: '2.1s' },
      { left: '68%', top: '12%', size: 2, delay: '1.5s' },
      { left: '82%', top: '28%', size: 2, delay: '0.5s' },
      { left: '92%', top: '18%', size: 3, delay: '1.9s' },
      { left: '15%', top: '35%', size: 2, delay: '0.4s' },
      { left: '48%', top: '32%', size: 2, delay: '1.7s' },
      { left: '75%', top: '38%', size: 2, delay: '2.5s' },
    ],
    [],
  );

  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-[#0a051b]">
      {/* 1. Map 2: Spring Cherry Blossom Garden Sky Layer */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
        style={{
          opacity: isHillMap ? 1 : 0,
          background: 'linear-gradient(180deg, #60a5fa 0%, #fed7aa 100%)',
        }}
      />

      {/* 2. Map 1: Sunset Layer */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
        style={{
          opacity: isHillMap ? 0 : sunsetOp,
          background: 'linear-gradient(180deg, #4c1d95 0%, #f97316 100%)',
        }}
      />

      {/* 3. Map 1: Twilight & Rain Layer */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
        style={{
          opacity: isHillMap ? 0 : twilightOp,
          background: 'linear-gradient(180deg, #1e1b4b 0%, #581c87 100%)',
        }}
      />

      {/* 4. Map 1: Starry Night Layer */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
        style={{
          opacity: isHillMap ? 0 : nightOp,
          background: 'linear-gradient(180deg, #030712 0%, #0f172a 100%)',
        }}
      />

      {/* 5. Map 1: Rosy Dawn Layer */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out"
        style={{
          opacity: isHillMap ? 0 : dawnOp,
          background: 'linear-gradient(180deg, #831843 0%, #fed7aa 100%)',
        }}
      />

      {/* Distant mountains / cherry blossom hills silhouette with parallax */}
      <div
        className="absolute bottom-[80px] left-0 right-0 h-[60px] opacity-35 will-change-transform"
        style={{
          backgroundImage: isHillMap
            ? 'radial-gradient(ellipse 160px 50px at 15% 100%, #f472b6 100%, transparent 100%), radial-gradient(ellipse 220px 65px at 50% 100%, #fb7185 100%, transparent 100%), radial-gradient(ellipse 180px 55px at 85% 100%, #f472b6 100%, transparent 100%)'
            : 'radial-gradient(ellipse 120px 40px at 15% 100%, #1e1b4b 100%, transparent 100%), radial-gradient(ellipse 180px 55px at 50% 100%, #1e1b4b 100%, transparent 100%), radial-gradient(ellipse 140px 45px at 85% 100%, #1e1b4b 100%, transparent 100%)',
          transform: `translateX(${-cameraX * 0.1}px)`,
        }}
      />

      {/* Sun during sunset, dawn or hill garden */}
      <div
        className="absolute rounded-full transition-all duration-700 ease-in-out pointer-events-none"
        style={{
          opacity: showSun ? 1 : 0,
          width: isHillMap ? '56px' : '48px',
          height: isHillMap ? '56px' : '48px',
          backgroundColor: isHillMap ? '#fef08a' : progress < 0.5 ? '#fef08a' : '#fecdd3',
          boxShadow: isHillMap
            ? '0 0 35px #fde047, 0 0 70px #f472b6, 0 0 100px rgba(254, 240, 138, 0.6)'
            : progress < 0.5
            ? '0 0 30px #f59e0b, 0 0 60px #ea580c'
            : '0 0 35px #fb7185, 0 0 70px #f43f5e',
          right: isHillMap ? '18%' : progress < 0.5 ? '15%' : '20%',
          top: isHillMap ? '12%' : progress < 0.5 ? '25%' : '18%',
          transform: showSun ? 'scale(1)' : 'scale(0.8)',
        }}
      />

      {/* Moon during starry night */}
      <div
        className="absolute rounded-full transition-all duration-700 ease-in-out pointer-events-none"
        style={{
          opacity: showMoon ? 1 : 0,
          width: '32px',
          height: '32px',
          boxShadow: 'inset -6px -2px 0 0 #fef08a',
          backgroundColor: 'transparent',
          filter: 'drop-shadow(0 0 10px rgba(254, 240, 138, 0.8))',
          right: '25%',
          top: '18%',
          transform: showMoon ? 'scale(1)' : 'scale(0.8)',
        }}
      />

      {/* Twinkling stars */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{ opacity: showStars ? 1 : 0 }}
      >
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: '#fff',
              boxShadow: '0 0 4px #fff',
              animation: `title-blink 2s ease-in-out ${star.delay} infinite alternate`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default React.memo(DynamicSkyComponent);
