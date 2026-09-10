'use client';

import React, { useEffect, useState } from 'react';
import { resumeAudio, SFX } from '@/lib/sound';
import { preloadGameAssets } from '@/lib/preload-assets';

interface TitleScreenProps {
  onStart: () => void;
}

// Pre-defined static particles to avoid impure Math.random during render
const PARTICLES = [
  { size: 4, left: '12%', top: '22%', color: '#f9a8d4', duration: 4.2, delay: 0.3 },
  { size: 6, left: '28%', top: '65%', color: '#c4b5fd', duration: 5.1, delay: 1.2 },
  { size: 3, left: '45%', top: '15%', color: '#fde68a', duration: 3.8, delay: 0.8 },
  { size: 5, left: '72%', top: '30%', color: '#86efac', duration: 6.0, delay: 2.1 },
  { size: 4, left: '85%', top: '75%', color: '#f9a8d4', duration: 4.5, delay: 1.5 },
  { size: 6, left: '18%', top: '80%', color: '#fde68a', duration: 5.5, delay: 0.5 },
  { size: 3, left: '60%', top: '85%', color: '#c4b5fd', duration: 3.9, delay: 1.9 },
  { size: 5, left: '35%', top: '40%', color: '#86efac', duration: 4.8, delay: 0.2 },
  { size: 4, left: '90%', top: '18%', color: '#f9a8d4', duration: 5.2, delay: 2.4 },
  { size: 5, left: '8%', top: '48%', color: '#c4b5fd', duration: 4.0, delay: 1.1 },
  { size: 3, left: '50%', top: '60%', color: '#fde68a', duration: 6.2, delay: 0.7 },
  { size: 6, left: '78%', top: '55%', color: '#86efac', duration: 4.6, delay: 1.7 },
];

export default function TitleScreen({ onStart }: TitleScreenProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Warm up all game assets in browser cache in background
    preloadGameAssets();
    // Show "Press any key" prompt after a brief delay
    const timer = setTimeout(() => setShowPrompt(true), 600);
    return () => clearTimeout(timer);
  }, []);


  const handleStart = () => {
    if (fadeOut) return;
    resumeAudio();
    SFX.click();
    setFadeOut(true);

    setTimeout(() => {
      onStart();
    }, 600);
  };

  useEffect(() => {
    if (fadeOut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore admin panel keys
      if (e.key === '`' || e.key === '~' || e.key === 'F2') return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.repeat) return;

      handleStart();
    };

    const handleClick = () => {
      handleStart();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [fadeOut]);

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
      }}
    >
      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-40"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: p.left,
              top: p.top,
              backgroundColor: p.color,
              animation: `title-float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Title "Met" — Kerned perfectly without split appearance */}
      <h1
        className="mb-2 text-6xl font-bold flex items-center justify-center select-none"
        style={{
          fontFamily: "var(--font-press-start), 'Press Start 2P', monospace",
          color: '#f9a8d4',
          textShadow: '0 0 20px rgba(249, 168, 212, 0.5), 0 0 40px rgba(249, 168, 212, 0.2)',
          animation: 'title-glow 3s ease-in-out infinite alternate',
        }}
      >
        <span>M</span>
        <span>e</span>
        <span style={{ marginLeft: '-14px' }}>t</span>
      </h1>

      {/* Subtitle */}
      <p
        className="mb-8 text-sm tracking-widest uppercase select-none"
        style={{
          fontFamily: "'VT323', monospace",
          color: '#94a3b8',
          fontSize: '18px',
          letterSpacing: '0.2em',
        }}
      >
        a tiny love story
      </p>

      {/* Spacing before prompt */}
      <div className="mb-10" />

      {/* Press any key prompt */}
      <div
        className={`transition-opacity duration-700 cursor-pointer select-none ${showPrompt ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleStart}
      >
        <p
          className="text-center text-xs tracking-wider"
          style={{
            fontFamily: "'VT323', monospace",
            color: '#e2e8f0',
            fontSize: '17px',
            animation: 'title-blink 1.2s step-end infinite',
          }}
        >
          [ nhấn phím bất kỳ hoặc click để bắt đầu ]
        </p>
      </div>

      {/* Footer credit */}
      <div className="absolute bottom-3 text-center select-none">
        <p
          className="text-[10px]"
          style={{
            fontFamily: "'VT323', monospace",
            color: '#475569',
            fontSize: '13px',
          }}
        >
          made with love
        </p>
      </div>
    </div>
  );
}
