'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Fireworks from './fireworks';
import PetalRain from './petal-rain';

export default function EndingCutscene() {
  return (
    <>
      <Fireworks active={true} />
      <PetalRain active={true} />

      {/* Gentle radiant heart aura behind the letter */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-45">
        <div
          className="w-48 h-48 rounded-full bg-pink-500/20 blur-3xl animate-pulse select-none"
          style={{ animationDuration: '3s' }}
        />
      </div>

      {/* Message "I LIKE U" — silky smooth 60FPS gliding up into center */}
      <div
        className="absolute z-50 pointer-events-none"
        style={{
          width: '600px',
          height: '400px',
          animation: 'message-scroll-smooth 4.2s cubic-bezier(0.2, 0.85, 0.35, 1) forwards',
          willChange: 'transform',
        }}
      >
        <Image
          src="/assets/others/message.png"
          height={400}
          width={600}
          alt="Message"
          priority
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </>
  );
}
