'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { SFX } from '@/lib/sound';

export type CollectibleType = 'bloom' | 'cat' | 'falling' | 'lamp' | 'fireflies' | 'high-hop' | 'dawn';

interface CollectibleProps {
  id: number;
  x: number;
  y: number;
  type?: CollectibleType;
  collected: boolean;
  cameraX: number;
  heroX?: number;
  lampOn?: boolean;
}

export default function Collectible({
  x,
  y,
  type = 'bloom',
  collected,
  cameraX,
  heroX = 0,
  lampOn = false,
}: CollectibleProps) {
  const [sparkle, setSparkle] = useState(false);
  const [isBloomed, setIsBloomed] = useState(type !== 'bloom');
  const wasCollectedRef = useRef(false);
  const bloomSoundPlayedRef = useRef(false);

  // Trigger bloom when hero approaches Flower #1
  useEffect(() => {
    if (type === 'bloom' && !isBloomed && Math.abs(heroX - x) < 65) {
      if (!bloomSoundPlayedRef.current) {
        bloomSoundPlayedRef.current = true;
        SFX.flowerBloom();
      }
      const timer = setTimeout(() => {
        setIsBloomed(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [type, isBloomed, heroX, x]);

  // Sparkle burst when collected
  useEffect(() => {
    if (collected && !wasCollectedRef.current) {
      wasCollectedRef.current = true;
      const sparkTimer = setTimeout(() => {
        setSparkle(true);
        setTimeout(() => setSparkle(false), 500);
      }, 0);
      return () => clearTimeout(sparkTimer);
    }
  }, [collected]);

  const screenX = x - cameraX;

  // Don't render if off screen
  if (screenX < -60 || screenX > 660) return null;

  if (sparkle) {
    return (
      <div
        className="pointer-events-none absolute z-30"
        style={{
          left: `${screenX}px`,
          top: `${y}px`,
          width: '32px',
          height: '32px',
        }}
      >
        {/* Pixel sparkle burst particles */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <div
            key={angle}
            className="absolute"
            style={{
              width: i % 2 === 0 ? '4px' : '3px',
              height: i % 2 === 0 ? '4px' : '3px',
              backgroundColor: i % 2 === 0 ? '#fbf236' : '#d95763',
              boxShadow: '0 0 6px #fff',
              left: '50%',
              top: '50%',
              animation: 'sparkle-burst 0.5s ease-out forwards',
              transform: `rotate(${angle}deg) translateX(0px)`,
              // @ts-expect-error Custom CSS property for sparkle animation
              '--burst-angle': `${angle}deg`,
            }}
          />
        ))}
      </div>
    );
  }

  if (collected) return null;

  return (
    <div
      className="absolute z-20 pointer-events-none select-none"
      style={{
        left: `${screenX - 6}px`,
        top: `${y - 6}px`,
        width: '36px',
        height: '36px',
      }}
    >
      {/* Type 5: Floating Lake Water Ripple for Water Rose */}
      {type === 'fireflies' && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-cyan-400/30 rounded-full blur-[1px] animate-ping opacity-60 pointer-events-none" />
      )}

      {/* Type 5: Orbiting Fireflies for Bridge Rose */}
      {type === 'fireflies' && (
        <>
          {[0, 120, 240].map((deg, i) => (
            <div
              key={deg}
              className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300"
              style={{
                top: `${14 + Math.sin((deg * Math.PI) / 180) * 16}px`,
                left: `${14 + Math.cos((deg * Math.PI) / 180) * 16}px`,
                boxShadow: '0 0 8px #facc15',
                animation: `firefly-drift ${2.5 + i * 0.4}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </>
      )}

      {/* Main Rose Body with Dynamic Filter */}
      <div
        style={{
          animation:
            type === 'falling'
              ? 'collectible-bob 2.2s ease-in-out infinite, flower-sway 3s ease-in-out infinite alternate'
              : 'collectible-bob 1.8s ease-in-out infinite',
          filter:
            type === 'lamp' && !lampOn
              ? 'brightness(0.35) grayscale(0.6)'
              : type === 'lamp' && lampOn
              ? 'drop-shadow(0 0 10px #fde047) brightness(1.2)'
              : type === 'dawn'
              ? 'drop-shadow(0 0 12px rgba(244, 114, 182, 0.9)) drop-shadow(0 0 6px #fde047)'
              : 'drop-shadow(0 0 6px rgba(217, 87, 99, 0.85))',
          transform: !isBloomed ? 'scale(0.7)' : undefined,
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.5s ease',
        }}
        className={isBloomed && type === 'bloom' ? 'animate-[bloom-pop_0.45s_ease-out]' : ''}
      >
        <Image
          src="/assets/others/rose-item.png"
          width={32}
          height={32}
          alt="Rose"
          style={{ imageRendering: 'pixelated' }}
          priority
        />
      </div>
    </div>
  );
}
