'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Fireworks from './fireworks';
import PetalRain from './petal-rain';
import EasterEggBook from './easter-egg-book';
import { SFX } from '@/lib/sound';

export default function EndingCutscene() {
  const [showBook, setShowBook] = useState(false);
  const [bookHintVisible, setBookHintVisible] = useState(false);

  // Reveal glowing Easter Egg book prompt after the "I LOVE U" message scrolls into place
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('book') === '1') {
        setBookHintVisible(true);
        setShowBook(true);
        return;
      }
    }
    const timer = setTimeout(() => {
      setBookHintVisible(true);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  // Listen for 'E' or 'Space' key to open book when prompt is visible
  useEffect(() => {
    if (showBook) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'e' || e.key === 'E') && bookHintVisible) {
        e.preventDefault();
        SFX.click();
        setShowBook(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bookHintVisible, showBook]);

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

      {/* Message "I LOVE U" — silky smooth 60FPS gliding up into center */}
      <div
        className={`absolute z-48 pointer-events-none transition-opacity duration-700 ${
          showBook ? 'opacity-20 blur-xs' : 'opacity-100'
        }`}
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

      {/* Authentic Retro 16-bit Pixel Art Easter Egg Box / Prompt */}
      {bookHintVisible && !showBook && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center cursor-pointer select-none group"
          style={{
            imageRendering: 'pixelated',
            animation: 'title-float 2.4s ease-in-out infinite',
          }}
          onClick={() => {
            SFX.click();
            setShowBook(true);
          }}
        >

          {/* Retro Pixel Dialog Box with DB32 gold border */}
          <div
            className="px-3.5 py-1 flex items-center gap-2 rounded-xs group-hover:scale-105 transition-transform"
            style={{
              backgroundColor: 'rgba(15, 10, 24, 0.95)',
              border: '2px solid #e2b77a',
              boxShadow: '0 0 0 1px #2d1808, 0 4px 14px rgba(0,0,0,0.85), inset 0 0 8px rgba(226,183,122,0.15)',
            }}
          >
            <span
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: '19px',
                color: '#fef3c7',
                letterSpacing: '0.04em',
                textShadow: '1px 1px 0 #000',
              }}
            >
              Món quà từ hòm thư...
            </span>

            {/* Retro Pixel Keycap [E] */}
            <span
              className="px-1.5 py-0.5 rounded-xs font-bold inline-flex items-center gap-1 group-hover:bg-amber-300 transition-colors"
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: '15px',
                backgroundColor: '#fbbf24',
                color: '#2d1808',
                border: '1px solid #b45309',
                boxShadow: '0 1px 0 #78350f',
              }}
            >
              [E] Mở sách
            </span>
          </div>
        </div>
      )}

      {/* Easter Egg 3D Book Overlay */}
      {showBook && (
        <EasterEggBook
          onClose={() => setShowBook(false)}
        />
      )}
    </>
  );
}

