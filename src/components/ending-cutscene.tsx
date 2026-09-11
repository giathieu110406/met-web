'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Fireworks from './fireworks';
import PetalRain from './petal-rain';
import EasterEggBook from './easter-egg-book';
import { SFX } from '@/lib/sound';

export default function EndingCutscene() {
  const [showBook, setShowBook] = useState(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('book') === '1') {
      return true;
    }
    return false;
  });
  const [bookHintVisible, setBookHintVisible] = useState(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('book') === '1') {
      return true;
    }
    return false;
  });

  // Reveal glowing Easter Egg book prompt after the "I LOVE U" message scrolls into place
  useEffect(() => {
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

      {/* Glowing Easter Egg Book Trigger Prompt */}
      {bookHintVisible && !showBook && (
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center animate-bounce cursor-pointer select-none"
          style={{ animationDuration: '2.2s' }}
          onClick={() => {
            SFX.click();
            setShowBook(true);
          }}
        >
          <div className="relative group px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#4a1c24]/90 via-[#632630]/90 to-[#4a1c24]/90 border border-amber-300/60 shadow-[0_0_15px_rgba(251,191,36,0.5)] backdrop-blur-xs flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="text-base animate-pulse">📖</span>
            <span className="text-[11px] font-serif font-bold text-[#fef08a] drop-shadow-sm tracking-wide">
              Món quà từ hòm thư... [Nhấn E / Mở sách]
            </span>
            <span className="text-xs">🌸</span>

            {/* Radiant glow ring around the button */}
            <div className="absolute -inset-1 rounded-full bg-amber-400/20 blur-sm pointer-events-none -z-10 group-hover:bg-amber-400/40 transition-colors" />
          </div>
          <span className="text-[9px] font-mono text-white/70 mt-1 bg-black/40 px-2 py-0.5 rounded">
            ✨ Easter Egg bí mật
          </span>
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

