'use client';

import { useMemo } from 'react';

interface DynamicSkyProps {
  cameraX: number;
  isHillMap?: boolean;
}

export default function DynamicSky({ cameraX, isHillMap = false }: DynamicSkyProps) {
  // Interpolate sky theme based on camera position (0 to 1800 max camera scroll)
  const progress = Math.max(0, Math.min(cameraX / 1800, 1));

  // Determine current atmosphere
  let topColor = '#1e1b4b';
  let bottomColor = '#ea580c';
  let showMoon = false;
  let showStars = false;
  let showSun = false;

  if (isHillMap) {
    // Map 2: Bright, radiant, romantic cherry blossom spring sky
    topColor = '#60a5fa'; // azure spring morning sky
    bottomColor = '#fed7aa'; // warm golden-pink blossom horizon
    showSun = true;
  } else if (progress < 0.28) {
    // 1. Sunset (0 - 500px camera)
    const t = progress / 0.28;
    topColor = t < 0.5 ? '#7c2d12' : '#4c1d95';
    bottomColor = t < 0.5 ? '#f97316' : '#d946ef';
    showSun = true;
  } else if (progress < 0.65) {
    // 2. Twilight / Rain (500 - 1170px camera)
    const t = (progress - 0.28) / (0.65 - 0.28);
    topColor = t < 0.5 ? '#3b0764' : '#1e1b4b';
    bottomColor = t < 0.5 ? '#581c87' : '#312e81';
  } else if (progress < 0.88) {
    // 3. Starry Night (1170 - 1580px camera)
    topColor = '#030712';
    bottomColor = '#0f172a';
    showMoon = true;
    showStars = true;
  } else {
    // 4. Rosy Dawn (1580 - 1800px camera)
    const t = (progress - 0.88) / 0.12;
    topColor = t < 0.5 ? '#4a044e' : '#be185d';
    bottomColor = t < 0.5 ? '#ec4899' : '#fed7aa';
    showSun = true;
  }

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
    <div
      className="absolute inset-0 z-0 pointer-events-none transition-colors duration-700 select-none overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${topColor} 0%, ${bottomColor} 100%)`,
      }}
    >
      {/* Distant mountains / cherry blossom hills silhouette */}
      <div
        className="absolute bottom-[80px] left-0 right-0 h-[60px] opacity-35"
        style={{
          backgroundImage: isHillMap
            ? 'radial-gradient(ellipse 160px 50px at 15% 100%, #f472b6 100%, transparent 100%), radial-gradient(ellipse 220px 65px at 50% 100%, #fb7185 100%, transparent 100%), radial-gradient(ellipse 180px 55px at 85% 100%, #f472b6 100%, transparent 100%)'
            : 'radial-gradient(ellipse 120px 40px at 15% 100%, #1e1b4b 100%, transparent 100%), radial-gradient(ellipse 180px 55px at 50% 100%, #1e1b4b 100%, transparent 100%), radial-gradient(ellipse 140px 45px at 85% 100%, #1e1b4b 100%, transparent 100%)',
          transform: `translateX(${-cameraX * 0.1}px)`,
        }}
      />

      {/* Sun during sunset or dawn or hill garden */}
      {showSun && (
        <div
          className="absolute rounded-full transition-opacity duration-1000"
          style={{
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
          }}
        />
      )}

      {/* Moon during starry night */}
      {showMoon && (
        <div
          className="absolute rounded-full"
          style={{
            width: '32px',
            height: '32px',
            boxShadow: 'inset -6px -2px 0 0 #fef08a',
            backgroundColor: 'transparent',
            filter: 'drop-shadow(0 0 10px rgba(254, 240, 138, 0.8))',
            right: '25%',
            top: '18%',
          }}
        />
      )}

      {/* Twinkling stars */}
      {showStars &&
        stars.map((star, i) => (
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
  );
}
