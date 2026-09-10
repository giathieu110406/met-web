'use client';

import { useMemo } from 'react';

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  swayAmount: number;
}

// Deterministic or mounted petal generation
function createPetals(): Petal[] {
  const colors = ['#f9a8d4', '#fda4af', '#fb7185', '#fecdd3', '#c4b5fd'];
  const list: Petal[] = [];
  for (let i = 0; i < 25; i++) {
    // Pseudo-random distribution based on index
    const pseudoRand1 = ((i * 17) % 100) / 100;
    const pseudoRand2 = ((i * 31) % 100) / 100;
    const pseudoRand3 = ((i * 47) % 100) / 100;
    list.push({
      id: i,
      x: pseudoRand1 * 100,
      delay: pseudoRand2 * 2.5,
      duration: 3.5 + pseudoRand3 * 3.5,
      size: 5 + (i % 5),
      color: colors[i % colors.length],
      swayAmount: 25 + (i % 30),
    });
  }
  return list;
}

export default function PetalRain({ active }: { active: boolean }) {
  const petals = useMemo(() => (active ? createPetals() : []), [active]);

  if (!active || petals.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            top: '-10px',
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            backgroundColor: petal.color,
            borderRadius: '50% 0 50% 50%',
            transform: 'rotate(45deg)',
            opacity: 0.75,
            animation: `petal-fall ${petal.duration}s ease-in ${petal.delay}s infinite`,
            // @ts-expect-error custom CSS property for sway
            '--sway': `${petal.swayAmount}px`,
          }}
        />
      ))}
    </div>
  );
}
