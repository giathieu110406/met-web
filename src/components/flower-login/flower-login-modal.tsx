'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { flowerEngine } from './particle-engine';
import { playKeyTapSound, playErrorSound } from './sound';

export type LoginDestination = 'story' | 'survival';

interface FlowerLoginModalProps {
  onSuccess: (origin: { x: number; y: number }, destination: LoginDestination) => void;
  correctPin?: string;
  survivalPin?: string;
  disabled?: boolean;
}

export default function FlowerLoginModal({
  onSuccess,
  correctPin = '1406',
  survivalPin = '1104',
  disabled = false,
}: FlowerLoginModalProps) {
  const [pin, setPin] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleInput = useCallback(
    (digit: string, buttonElement?: HTMLElement | null) => {
      if (disabled || pin.length >= 4 || isShaking) return;

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
        const destination = nextPin === correctPin ? 'story' : nextPin === survivalPin ? 'survival' : null;
        if (destination) {
          // Trigger the grand bloom from the final button coordinates
          onSuccess({ x: originX, y: originY }, destination);
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
    [pin, isShaking, correctPin, survivalPin, disabled, onSuccess]
  );

  const handleBackspace = useCallback(() => {
    if (disabled || isShaking) return;
    setPin((prev) => prev.slice(0, -1));
  }, [disabled, isShaking]);

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
      className={`relative z-20 flex w-full max-w-[760px] flex-col overflow-visible rounded-2xl border-[3px] border-[#533320] bg-[#22162b]/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_0_2px_#ffb3d9] backdrop-blur-md transition-transform duration-300 landscape:max-w-[690px] landscape:flex-row landscape:rounded-[20px] landscape:border-[3.5px] landscape:p-2.5 sm:max-w-[760px] sm:flex-row sm:rounded-[28px] sm:border-[5px] sm:p-7 ${
        isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
      }`}
      style={{
        boxShadow: '0 25px 60px rgba(0,0,0,0.85), inset 0 0 40px rgba(0,0,0,0.6)',
      }}
    >
      {/* Decorative Pixel Cherry Blossom Vines */}
      <div className="pointer-events-none absolute -left-2 -top-2 z-30 select-none text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] landscape:-left-2 landscape:-top-2 landscape:text-lg sm:-left-3 sm:-top-3 sm:text-2xl">
        🌸
      </div>
      <div className="pointer-events-none absolute -right-2 -top-2 z-30 select-none text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] landscape:-right-2 landscape:-top-2 landscape:text-lg sm:-right-3 sm:-top-3 sm:text-2xl">
        🌸
      </div>
      <div className="pointer-events-none absolute -bottom-2 -left-2 z-30 select-none text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] landscape:-bottom-2 landscape:-left-2 landscape:text-lg sm:-bottom-3 sm:-left-3 sm:text-2xl">
        🌸
      </div>
      <div className="pointer-events-none absolute -bottom-2 -right-2 z-30 select-none text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] landscape:-bottom-2 landscape:-right-2 landscape:text-lg sm:-bottom-3 sm:-right-3 sm:text-2xl">
        🌸
      </div>

      {/* Cột trái: Khung tranh Pixel Art cô gái bên hoa anh đào */}
      <div className="relative flex flex-none items-center justify-center landscape:w-[200px] sm:w-[320px]">
        <div className="relative aspect-[280/360] h-[240px] max-h-[75vh] w-auto overflow-hidden rounded-[14px] border-[3px] border-[#6b4226] bg-[#1a1122] shadow-[0_6px_20px_rgba(0,0,0,0.6)] landscape:h-[min(265px,78dvh)] landscape:max-w-[200px] landscape:rounded-[12px] sm:h-[400px] sm:max-w-[310px] sm:rounded-[18px] sm:border-[4px]">
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
      <div className="relative flex flex-1 flex-col items-center justify-center px-2 pt-3 landscape:px-3 landscape:pt-0 sm:px-6 sm:pt-0">
        {/* Glowing Pixel Heart at top */}
        <div className="mb-1 flex items-center justify-center landscape:mb-0.5 sm:mb-2">
          <div className="animate-pulse text-2xl drop-shadow-[0_0_12px_#ff4081] landscape:text-lg sm:text-3xl">
            💖
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-1.5 font-mono text-[11px] font-bold tracking-[0.2em] text-[#fbcfe8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] landscape:mb-1 landscape:text-[10px] sm:mb-3 sm:text-[13px] sm:tracking-[0.25em]">
          ENTER PASSCODE
        </h2>

        {/* 4 Chấm Indicator Pixel Style */}
        <div className="mb-3 flex items-center justify-center gap-2 landscape:mb-1.5 landscape:gap-2 sm:mb-6 sm:gap-3.5">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`h-3 w-3 rounded-full transition-all duration-200 landscape:h-2.5 landscape:w-2.5 sm:h-4 sm:w-4 ${
                  isFilled
                    ? 'scale-115 border-2 border-[#f472b6] bg-[#f43f5e] shadow-[0_0_10px_#f43f5e]'
                    : 'border-2 border-[#a78bfa]/40 bg-[#160e22]'
                }`}
              />
            );
          })}
        </div>

        {/* Bàn phím số Pixel Retro 3x4 */}
        <div className="relative grid w-full max-w-[270px] grid-cols-3 gap-x-4 gap-y-2 landscape:max-w-[210px] landscape:gap-x-2.5 landscape:gap-y-1 sm:max-w-[270px] sm:gap-x-6 sm:gap-y-4">
          {keypad.map((row, rIdx) =>
            row.map((btn, cIdx) => {
              if (btn === '') {
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className="h-10 w-14 landscape:h-8 landscape:w-11 sm:h-12 sm:w-16"
                  />
                );
              }

              if (btn === 'delete') {
                return (
                  <button
                    key={`${rIdx}-${cIdx}`}
                    type="button"
                    disabled={disabled}
                    onClick={handleBackspace}
                    title="Xóa ký tự"
                    className="flex h-10 w-14 items-center justify-center rounded-[10px] border-2 border-[#b07d62] bg-[#fbcfe8] text-[#4a2e18] shadow-[0_3px_0_#9c6644] transition-all hover:bg-[#fed7aa] active:translate-y-0.5 active:shadow-none landscape:h-8 landscape:w-11 landscape:rounded-[8px] landscape:shadow-[0_2px_0_#9c6644] sm:h-12 sm:w-16 sm:rounded-[12px] sm:shadow-[0_4px_0_#9c6644]"
                  >
                    <span className="font-mono text-sm font-bold landscape:text-xs sm:text-base">⌫</span>
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
                  disabled={disabled}
                  onClick={(e) => handleInput(btn, e.currentTarget)}
                  className="flex h-10 w-14 items-center justify-center rounded-[10px] border-2 border-[#b07d62] bg-[#fbcfe8] text-lg font-bold text-[#4a2e18] shadow-[0_3px_0_#9c6644] transition-all hover:bg-[#fed7aa] hover:shadow-[0_3px_0_#9c6644,0_0_8px_#ffb3d9] active:translate-y-0.5 active:shadow-none landscape:h-8 landscape:w-11 landscape:rounded-[8px] landscape:text-base landscape:shadow-[0_2px_0_#9c6644] sm:h-12 sm:w-16 sm:rounded-[12px] sm:text-[22px] sm:shadow-[0_4px_0_#9c6644]"
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
