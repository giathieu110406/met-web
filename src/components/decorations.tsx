'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DecorationData } from '@/lib/level-data';

interface DecorationsProps {
  decorations: DecorationData[];
  cameraX: number;
}

function getFlowerPalette(color?: string, id = 0) {
  const defaultPalettes = [
    { main: '#f43f5e', light: '#fda4af', dark: '#9f1239' }, // rose red
    { main: '#fbbf24', light: '#fef08a', dark: '#b45309' }, // golden yellow
    { main: '#f472b6', light: '#fbcfe8', dark: '#be185d' }, // sakura pink
    { main: '#a855f7', light: '#e9d5ff', dark: '#6b21a8' }, // violet purple
  ];

  if (!color) return defaultPalettes[id % defaultPalettes.length];

  switch (color.toLowerCase()) {
    case '#f0abfc':
      return { main: '#f0abfc', light: '#fae8ff', dark: '#c084fc' };
    case '#fbbf24':
      return { main: '#fbbf24', light: '#fef9c3', dark: '#b45309' };
    case '#f9a8d4':
      return { main: '#f9a8d4', light: '#fff1f2', dark: '#db2777' };
    case '#fde68a':
      return { main: '#fde68a', light: '#fefce8', dark: '#d97706' };
    case '#c4b5fd':
      return { main: '#c4b5fd', light: '#f5f3ff', dark: '#7c3aed' };
    case '#f43f5e':
      return { main: '#f43f5e', light: '#fda4af', dark: '#9f1239' };
    default:
      return { main: color, light: '#ffffff', dark: '#1e1b4b' };
  }
}

function FlowerDecor({ x, id, color }: { x: number; id: number; color?: string }) {
  const palette = getFlowerPalette(color, id);

  return (
    <div
      className="absolute pointer-events-none select-none z-10"
      style={{
        left: `${x}px`,
        bottom: '80px', // Exact ground grass line (400 - 320 = 80px)
        width: '24px',
        height: '24px',
        transformOrigin: 'bottom center',
        animation: `flower-sway ${2.5 + (id % 3) * 0.5}s ease-in-out infinite alternate`,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 16 16"
        style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}
      >
        {/* Pixel Stem */}
        <rect x="7" y="7" width="2" height="9" fill="#15803d" />
        <rect x="7" y="8" width="1" height="8" fill="#22c55e" />
        {/* Stem Pixel Leaves */}
        <rect x="5" y="11" width="2" height="2" fill="#22c55e" />
        <rect x="9" y="10" width="2" height="2" fill="#16a34a" />

        {/* Blossom Petals: 16-bit Pixel Flower */}
        {/* Top petal */}
        <rect x="6" y="1" width="4" height="3" fill={palette.main} />
        <rect x="7" y="1" width="2" height="1" fill={palette.light} />
        {/* Bottom petal */}
        <rect x="6" y="7" width="4" height="3" fill={palette.main} />
        <rect x="6" y="9" width="4" height="1" fill={palette.dark} />
        {/* Left petal */}
        <rect x="3" y="4" width="3" height="4" fill={palette.main} />
        <rect x="3" y="4" width="1" height="4" fill={palette.light} />
        {/* Right petal */}
        <rect x="10" y="4" width="3" height="4" fill={palette.main} />
        <rect x="12" y="4" width="1" height="4" fill={palette.dark} />
        {/* Petal Corners */}
        <rect x="5" y="2" width="2" height="2" fill={palette.main} />
        <rect x="9" y="2" width="2" height="2" fill={palette.main} />
        <rect x="5" y="7" width="2" height="2" fill={palette.main} />
        <rect x="9" y="7" width="2" height="2" fill={palette.main} />

        {/* Center Golden Core */}
        <rect x="6" y="4" width="4" height="3" fill="#fbbf24" />
        <rect x="7" y="5" width="2" height="1" fill="#fffbeb" />
      </svg>
    </div>
  );
}

function GrassPatch({ x }: { x: number }) {
  return (
    <div
      className="absolute pointer-events-none select-none z-10"
      style={{
        left: `${x}px`,
        bottom: '80px',
        width: '24px',
        height: '16px',
        opacity: 0.95,
      }}
    >
      <Image
        src="/assets/others/grass-patch.png"
        width={24}
        height={16}
        alt="Grass"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}

function ButterflyDecor({ x, y, id }: { x: number; y: number; id: number }) {
  const [frame, setFrame] = useState(1);
  const colors = ['purple', 'pink', 'gold'];
  const colorType = colors[id % colors.length];

  // Flapping animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev === 1 ? 2 : 1));
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute pointer-events-none select-none z-15"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: '20px',
        height: '20px',
        animation: `butterfly-fly ${3.5 + (id % 2)}s ease-in-out infinite`,
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
      }}
    >
      <Image
        src={`/assets/others/butterfly-${colorType}-${frame}.png`}
        width={20}
        height={20}
        alt="Butterfly"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}

export default function Decorations({ decorations, cameraX }: DecorationsProps) {
  return (
    <>
      {decorations.map((dec) => {
        const screenX = dec.x - cameraX;

        // Render buffer: don't render if far off screen
        if (screenX < -60 || screenX > 660) return null;

        if (dec.type === 'flower-small') {
          return <FlowerDecor key={dec.id} x={screenX} id={dec.id} color={dec.color} />;
        }
        if (dec.type === 'grass-tuft') {
          return <GrassPatch key={dec.id} x={screenX} />;
        }
        if (dec.type === 'butterfly') {
          return <ButterflyDecor key={dec.id} x={screenX} y={dec.y} id={dec.id} />;
        }
        return null;
      })}
    </>
  );
}
