'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { flowerEngine } from './particle-engine';
import { playKeyTapSound, playErrorSound } from './sound';

interface FlowerLoginModalProps {
  onSuccess: (origin: { x: number; y: number }) => void;
  correctPin?: string;
}

export default function FlowerLoginModal({
  onSuccess,
  correctPin = '1406',
}: FlowerLoginModalProps) {
  const [pin, setPin] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleInput = useCallback(
    (digit: string, buttonElement?: HTMLElement | null) => {
      if (pin.length >= 4 || isShaking) return;

      const nextPin = pin + digit;
      setPin(nextPin);
      playKeyTapSound(nextPin.length);

      // Determine button center coordinates
      let originX = window.innerWidth / 2 + 100;
      let originY = window.innerHeight / 2;

      const btn = buttonElement || buttonRefs.current[digit];
      if (btn) {
        const rect = btn.getBoundingClientRect();
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      }

      if (nextPin.length === 4) {
        // REQUIREMENT: Ở ô mật khẩu cuối cùng thì KHÔNG xuất hiện hoa rơi nữa!
        if (nextPin === correctPin) {
          // Trigger the grand bloom from the final button coordinates
          onSuccess({ x: originX, y: originY });
        } else {
          // Wrong PIN -> Shake
          playErrorSound();
          setIsShaking(true);
          setTimeout(() => {
            setPin('');
            setIsShaking(false);
          }, 600);
        }
      } else {
        // Only spawn gravity falling flowers for digits 1, 2, 3 (not the final digit)
        // Flowers are close together with a small, elegant gap
        flowerEngine.spawnGravityFallingFlowers(originX, originY, 3);
      }
    },
    [pin, isShaking, correctPin, onSuccess]
  );

  const handleBackspace = useCallback(() => {
    if (isShaking) return;
    setPin((prev) => prev.slice(0, -1));
  }, [isShaking]);

  // Physical keyboard support
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore admin panel keys
      if (
        e.key === '`' ||
        e.key === '~' ||
        e.key === 'F2' ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')
      ) {
        return;
      }
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleBackspace();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleInput, handleBackspace]);

  const keypad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete'],
  ];

  return (
    <div
      className={`relative z-20 flex w-full max-w-[760px] flex-col overflow-visible rounded-[28px] border-[5px] border-[#533320] bg-[#22162b]/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_0_2px_#ffb3d9] backdrop-blur-md transition-transform duration-300 sm:flex-row sm:p-7 ${
        isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
      }`}
      style={{
        boxShadow: '0 25px 60px rgba(0,0,0,0.85), inset 0 0 40px rgba(0,0,0,0.6)',
      }}
    >
      {/* Decorative Pixel Cherry Blossom Vines */}
      <div className="pointer-events-none absolute -left-3 -top-3 z-30 select-none text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        🌸
      </div>
      <div className="pointer-events-none absolute -right-3 -top-3 z-30 select-none text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        🌸
      </div>
      <div className="pointer-events-none absolute -bottom-3 -left-3 z-30 select-none text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        🌸
      </div>
      <div className="pointer-events-none absolute -bottom-3 -right-3 z-30 select-none text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        🌸
      </div>

      {/* Cột trái: Khung tranh Pixel Art cô gái bên hoa anh đào */}
      <div className="relative flex flex-none items-center justify-center sm:w-[320px]">
        <div className="relative h-[340px] w-full max-w-[280px] overflow-hidden rounded-[18px] border-[4px] border-[#6b4226] bg-[#1a1122] shadow-[0_6px_20px_rgba(0,0,0,0.6)] sm:h-[400px] sm:max-w-[310px]">
          <Image
            src="/assets/lockscreen/pixel-portrait-clean.png"
            alt="Pixel Art Sakura Maiden"
            fill
            priority
            className="object-cover"
            unoptimized
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2a1322]/40 via-transparent to-transparent" />
        </div>
      </div>

      {/* Cột phải: Bảng số Passcode phong cách Pixel Cozy */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-2 pt-6 sm:px-6 sm:pt-0">
        {/* Glowing Pixel Heart at top */}
        <div className="mb-2 flex items-center justify-center">
          <div className="animate-pulse text-3xl drop-shadow-[0_0_12px_#ff4081]">
            💖
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3 font-mono text-[13px] font-bold tracking-[0.25em] text-[#fbcfe8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          ENTER PASSCODE
        </h2>

        {/* 4 Chấm Indicator Pixel Style */}
        <div className="mb-6 flex items-center justify-center gap-3.5">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`h-4 w-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'scale-115 border-2 border-[#f472b6] bg-[#f43f5e] shadow-[0_0_10px_#f43f5e]'
                    : 'border-2 border-[#a78bfa]/40 bg-[#160e22]'
                }`}
              />
            );
          })}
        </div>

        {/* Bàn phím số Pixel Retro 3x4 */}
        <div className="relative grid w-full max-w-[270px] grid-cols-3 gap-x-6 gap-y-4">
          {keypad.map((row, rIdx) =>
            row.map((btn, cIdx) => {
              if (btn === '') {
                return <div key={`${rIdx}-${cIdx}`} className="h-12 w-16" />;
              }

              if (btn === 'delete') {
                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    type="button"
                    onClick={handleBackspace}
                    title="Xóa ký tự"
                    className="flex h-12 w-16 items-center justify-center rounded-[12px] border-2 border-[#b07d62] bg-[#fbcfe8] text-[#4a2e18] shadow-[0_4px_0_#9c6644] transition-all hover:bg-[#fed7aa] active:translate-y-1 active:shadow-none"
                  >
                    <span className="font-mono text-base font-bold">⌫</span>
                  </button>
                );
              }

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  ref={(el) => {
                    buttonRefs.current[btn] = el;
                  }}
                  type="button"
                  onClick={(e) => handleInput(btn, e.currentTarget)}
                  className="flex h-12 w-16 items-center justify-center rounded-[12px] border-2 border-[#b07d62] bg-[#fbcfe8] text-[22px] font-bold text-[#4a2e18] shadow-[0_4px_0_#9c6644] transition-all hover:bg-[#fed7aa] hover:shadow-[0_4px_0_#9c6644,0_0_8px_#ffb3d9] active:translate-y-1 active:shadow-none"
                  style={{
                    fontFamily: 'var(--font-vt323), monospace',
                  }}
                >
                  {btn}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
