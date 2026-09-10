'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DecorationData } from '@/lib/level-data';

interface DecorationsProps {
  decorations: DecorationData[];
  cameraX: number;
}

function FlowerDecor({ x, id }: { x: number; id: number }) {
  // Cycle between 4 flower variants: red, yellow, pink, purple
  const variants = ['red', 'yellow', 'pink', 'purple'];
  const variant = variants[id % variants.length];

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
      <Image
        src={`/assets/others/flower-${variant}.png`}
        width={24}
        height={24}
        alt="Flower"
        style={{ imageRendering: 'pixelated' }}
      />
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
          return <FlowerDecor key={dec.id} x={screenX} id={dec.id} />;
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
