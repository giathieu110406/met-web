'use client';

import { useMemo } from 'react';

interface WeatherEffectsProps {
  cameraX: number;
  isHillMap?: boolean;
}

export default function WeatherEffects({ cameraX, isHillMap = false }: WeatherEffectsProps) {
  if (isHillMap) return null;

  // Center of screen in world coordinate
  const worldCenterX = cameraX + 300;

  // Rain is active between world x=550 and x=1350
  const isRaining = worldCenterX >= 550 && worldCenterX <= 1380;
  // Fireflies active between world x=1350 and x=1900
  const isFireflies = worldCenterX >= 1350 && worldCenterX <= 1920;
  // Petals in dawn zone
  const isPetalWind = worldCenterX >= 1700;

  // Rain drops generator
  const rainDrops = useMemo(() => {
    const drops = [];
    for (let i = 0; i < 35; i++) {
      const left = ((i * 19) % 100);
      const delay = ((i * 7) % 10) / 10;
      const duration = 0.6 + ((i * 3) % 4) * 0.1;
      drops.push({ id: i, left: `${left}%`, delay: `${delay}s`, duration: `${duration}s` });
    }
    return drops;
  }, []);

  // Fireflies generator
  const fireflies = useMemo(() => {
    const list = [];
    for (let i = 0; i < 18; i++) {
      const left = ((i * 23) % 100);
      const top = 30 + ((i * 13) % 45);
      const delay = ((i * 5) % 15) / 10;
      list.push({ id: i, left: `${left}%`, top: `${top}%`, delay: `${delay}s` });
    }
    return list;
  }, []);

  return (
    <div className="absolute inset-0 z-15 pointer-events-none select-none overflow-hidden">
      {/* 1. Rain Zone — smooth cross-fade */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{ opacity: isRaining ? 1 : 0 }}
      >
        {rainDrops.map((drop) => (
          <div
            key={drop.id}
            className="absolute opacity-60"
            style={{
              left: drop.left,
              top: '-15px',
              width: '1.5px',
              height: '14px',
              backgroundColor: '#93c5fd',
              transform: 'rotate(15deg)',
              animation: `rain-fall ${drop.duration} linear ${drop.delay} infinite`,
              willChange: 'transform',
            }}
          />
        ))}

        {/* Water puddles with ripple rings on ground (ground line is 320px) */}
        <div
          className="absolute rounded-full opacity-45"
          style={{
            left: `${880 - cameraX}px`,
            top: '318px',
            width: '40px',
            height: '6px',
            backgroundColor: '#60a5fa',
            boxShadow: '0 0 8px #93c5fd',
          }}
        />
        <div
          className="absolute rounded-full opacity-45"
          style={{
            left: `${1120 - cameraX}px`,
            top: '318px',
            width: '50px',
            height: '7px',
            backgroundColor: '#60a5fa',
            boxShadow: '0 0 8px #93c5fd',
          }}
        />
      </div>

      {/* 2. Fireflies in Starry Night Zone — smooth cross-fade */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{ opacity: isFireflies ? 1 : 0 }}
      >
        {fireflies.map((ff) => (
          <div
            key={ff.id}
            className="absolute rounded-full"
            style={{
              left: ff.left,
              top: ff.top,
              width: '4px',
              height: '4px',
              backgroundColor: '#fef08a',
              boxShadow: '0 0 6px #facc15, 0 0 12px #a3e635',
              animation: `firefly-drift 3.5s ease-in-out ${ff.delay} infinite alternate`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* 3. Petal wind in Dawn Zone — smooth cross-fade */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{ opacity: isPetalWind ? 0.8 : 0 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-70"
            style={{
              left: `${15 + (i * 12)}%`,
              top: `${40 + ((i * 7) % 40)}%`,
              width: '6px',
              height: '4px',
              backgroundColor: '#f472b6',
              transform: 'rotate(25deg)',
              animation: `petal-wind ${3 + (i % 3)}s ease-in-out ${i * 0.4}s infinite`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>
    </div>
  );
}
