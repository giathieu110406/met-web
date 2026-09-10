'use client';

import React from 'react';
import { LEVEL } from '@/lib/level-data';
import { getHillGroundY } from '@/lib/physics';

interface GroundProps {
  cameraX: number;
  isHillMap?: boolean;
}

const PUDDLES = [
  { x: 750, width: 64 },
  { x: 920, width: 72 },
  { x: 1080, width: 56 },
];

// Precompute static Hill SVG path data once at module evaluation to eliminate 60fps recalculation
const HILL_SURFACE_PATH = (() => {
  const hillPoints: [number, number][] = [];
  for (let x = 0; x <= 1850; x += 20) {
    hillPoints.push([x, getHillGroundY(x)]);
  }
  hillPoints.push([2200, 265]);
  return `M 0,${getHillGroundY(0)} ` + hillPoints.slice(1).map(([x, y]) => `L ${x},${y}`).join(' ');
})();

const HILL_FILL_PATH = `${HILL_SURFACE_PATH} L 2200,400 L 0,400 Z`;

const HILL_DECOR_POINTS = [
  40, 110, 190, 280, 360, 450, 540, 630, 720, 810, 900, 990, 1080,
  1170, 1260, 1350, 1440, 1530, 1620, 1710, 1800, 1880, 1960, 2040, 2120,
].map((gx) => ({ gx, gy: getHillGroundY(gx) }));

function GroundComponent({ cameraX, isHillMap = false }: GroundProps) {
  if (isHillMap) {
    return (
      <svg
        className="absolute top-0 left-0 pointer-events-none select-none z-10 will-change-transform"
        style={{
          transform: `translateX(${-cameraX}px)`,
          width: '2200px',
          height: '400px',
        }}
        viewBox="0 0 2200 400"
      >
        <defs>
          <linearGradient id="hillGrass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#48bb78" />
            <stop offset="8%" stopColor="#2f855a" />
            <stop offset="22%" stopColor="#22543d" />
            <stop offset="45%" stopColor="#3d2b1f" />
            <stop offset="100%" stopColor="#1a110b" />
          </linearGradient>
        </defs>
        {/* Undulating Hill base soil */}
        <path d={HILL_FILL_PATH} fill="url(#hillGrass)" />
        {/* Grass edge highlights tracing the undulating curve */}
        <path d={HILL_SURFACE_PATH} fill="none" stroke="#68d391" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={HILL_SURFACE_PATH} fill="none" stroke="#9ae6b4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Summit grass tufts and flowers placed precisely on the undulating surface across 2200px */}
        {HILL_DECOR_POINTS.map(({ gx, gy }, i) => (
          <g key={i} transform={`translate(${gx}, ${gy})`}>
            {/* Grass blades */}
            <rect x="-4" y="-3" width="2" height="4" fill="#9ae6b4" />
            <rect x="-1" y="-5" width="2" height="6" fill="#68d391" />
            <rect x="2" y="-3" width="2" height="4" fill="#9ae6b4" />
            {/* Fallen cherry blossom petals on garden grass */}
            <circle cx="5" cy="2" r="2" fill="#fbcfe8" />
            <circle cx="-6" cy="3" r="1.5" fill="#f472b6" />
            <circle cx="2" cy="4" r="1.5" fill="#fda4af" />
          </g>
        ))}
      </svg>
    );
  }
  return (
    <>
      {/* Ground segments */}
      {LEVEL.grounds.map((segment, i) => {
        const screenX = segment.x - cameraX;

        // Don't render if entirely off screen
        if (screenX + segment.width < -20 || screenX > 620) return null;

        return (
          <div
            key={i}
            className="absolute z-10 select-none pointer-events-none"
            style={{
              left: `${screenX}px`,
              top: `${segment.y}px`,
              width: `${segment.width}px`,
              height: '80px',
              backgroundImage: "url('/assets/others/ground.png')",
              backgroundRepeat: 'repeat-x',
              backgroundSize: '600px 80px',
              imageRendering: 'pixelated',
            }}
          />
        );
      })}

      {/* Reflective Rain Puddles in the Twilight/Rain Zone */}
      {PUDDLES.map((puddle, i) => {
        const screenX = puddle.x - cameraX;
        if (screenX + puddle.width < -20 || screenX > 620) return null;

        return (
          <div
            key={`puddle-${i}`}
            className="absolute z-10 pointer-events-none select-none overflow-hidden"
            style={{
              left: `${screenX}px`,
              top: '318px',
              width: `${puddle.width}px`,
              height: '8px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.45) 0%, rgba(15, 23, 42, 0.7) 75%, transparent 100%)',
              boxShadow: '0 0 6px rgba(56, 189, 248, 0.3)',
              borderBottom: '1px solid rgba(186, 230, 253, 0.4)',
            }}
          >
            {/* Water surface glint */}
            <div
              className="absolute inset-x-2 top-0.5 h-0.5 rounded-full bg-cyan-200/40"
              style={{
                animation: 'title-blink 3s ease-in-out infinite alternate',
              }}
            />
          </div>
        );
      })}
      {/* Serene Night Lake under the Starry Sky (x = 1460 to 1640) */}
      {(() => {
        const lakeX = 1460 - cameraX;
        if (lakeX + 180 < -20 || lakeX > 620) return null;
        return (
          <div
            className="absolute z-10 pointer-events-none select-none overflow-hidden"
            style={{
              left: `${lakeX}px`,
              top: '316px',
              width: '180px',
              height: '14px',
              borderRadius: '50% / 40%',
              background: 'radial-gradient(ellipse at 50% 40%, rgba(30, 58, 138, 0.85) 0%, rgba(15, 23, 42, 0.95) 75%, transparent 100%)',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.35)',
              borderBottom: '1.5px solid rgba(125, 211, 252, 0.5)',
            }}
          >
            {/* Lake water surface shimmering ripples */}
            <div
              className="absolute inset-x-4 top-1 h-1 rounded-full bg-cyan-300/30"
              style={{
                animation: 'title-blink 2.5s ease-in-out infinite alternate',
              }}
            />
            <div
              className="absolute left-8 top-2 w-16 h-0.5 rounded-full bg-indigo-200/40"
              style={{
                animation: 'firefly-drift 3s ease-in-out infinite alternate',
              }}
            />
          </div>
        );
      })()}
    </>
  );
}

export default React.memo(GroundComponent);
