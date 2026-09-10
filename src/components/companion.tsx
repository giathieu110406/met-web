'use client';

import { forwardRef } from 'react';
import Image from 'next/image';
import leftIdle from '../../public/assets/character/companion-idle.png';
import { LEVEL } from '@/lib/level-data';

interface CompanionProps {
  cameraX: number;
  showHitbox?: boolean;
  x?: number;
  y?: number;
}

const Companion = forwardRef<HTMLImageElement, CompanionProps>(
  ({ cameraX, showHitbox, x, y }, ref) => {
    const compX = x ?? LEVEL.companionPos.x;
    const compY = y ?? LEVEL.companionPos.y;
    const screenX = compX - cameraX;

    // Don't render if off screen
    if (screenX < -60 || screenX > 660) return null;

    return (
      <div
        className={`absolute z-20 ${
          showHitbox ? 'ring-2 ring-cyan-400 ring-offset-2 bg-cyan-400/20' : ''
        }`}
        style={{
          left: `${screenX}px`,
          top: `${compY}px`,
          width: '48px',
          height: '64px',
        }}
      >
        <Image
          src={leftIdle}
          height={64}
          width={48}
          alt="Companion"
          ref={ref}
          priority
        />
      </div>
    );
  },
);

Companion.displayName = 'Companion';
export default Companion;
