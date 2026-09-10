'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { SFX } from '@/lib/sound';

interface DialogueLine {
  speaker: 'hero' | 'companion';
  name: string;
  avatar: string;
  text: string;
}

const DIALOGUES: DialogueLine[] = [
  {
    speaker: 'companion',
    name: 'Cô ấy',
    avatar: '/assets/character/avatar-companion.png',
    text: 'Cậu... đã đi một quãng đường xa đến thế này sao?',
  },
  {
    speaker: 'hero',
    name: 'Chàng trai',
    avatar: '/assets/character/avatar-hero.png',
    text: 'Không xa đâu... Vì ở cuối con đường, người đứng đợi là cậu.',
  },
  {
    speaker: 'companion',
    name: 'Cô ấy',
    avatar: '/assets/character/avatar-companion.png',
    text: 'Đồ ngốc... Tớ đã đứng đây đợi cậu từ lâu lắm rồi.',
  },
];

interface DialogueBoxProps {
  onComplete: () => void;
}

export default function DialogueBox({ onComplete }: DialogueBoxProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const currentLine = DIALOGUES[currentIdx];

  // Typewriter effect
  useEffect(() => {
    setCharCount(0);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count <= currentLine.text.length) {
        setCharCount(count);
      } else {
        clearInterval(interval);
      }
    }, 32);

    return () => clearInterval(interval);
  }, [currentIdx, currentLine.text]);

  const handleNext = useCallback(() => {
    SFX.click();
    // If still typing, complete current line immediately
    if (charCount < currentLine.text.length) {
      setCharCount(currentLine.text.length);
      return;
    }

    if (currentIdx < DIALOGUES.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onComplete();
    }
  }, [charCount, currentLine.text.length, currentIdx, onComplete]);

  // One-shot latch state: guarantees 1 press = 1 skip, then self-cuts off ("tự ngắt")
  const isKeyHeldRef = useRef(false);
  const mountTimeRef = useRef(Date.now());
  const lastNextTimeRef = useRef(0);

  const triggerNextOneShot = useCallback(() => {
    const now = Date.now();
    if (now - lastNextTimeRef.current < 250) return;
    lastNextTimeRef.current = now;
    handleNext();
  }, [handleNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowRight', 'Enter', ' ', 'e', 'E'].includes(e.key)) {
        e.preventDefault();
        if (e.repeat || isKeyHeldRef.current) return;
        if (Date.now() - mountTimeRef.current < 350) return;

        isKeyHeldRef.current = true;
        triggerNextOneShot();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowRight', 'Enter', ' ', 'e', 'E'].includes(e.key)) {
        isKeyHeldRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerNextOneShot]);

  return (
    <div
      className="absolute bottom-6 left-0 right-0 mx-auto z-50 w-[92%] max-w-[540px] select-none pointer-events-auto cursor-pointer"
      onClick={triggerNextOneShot}
      style={{
        animation: 'subtitle-appear 0.35s ease-out',
      }}
    >
      <div
        className="flex items-center gap-4 rounded-2xl px-5 py-3.5 shadow-2xl backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          border: currentLine.speaker === 'hero' ? '2px solid #38bdf8' : '2px solid #f472b6',
          boxShadow: '0 10px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(244, 114, 182, 0.25)',
        }}
      >
        {/* Avatar */}
        <div
          className="relative shrink-0 rounded-xl overflow-hidden shadow-md"
          style={{
            width: '48px',
            height: '48px',
            border: currentLine.speaker === 'hero' ? '2px solid #38bdf8' : '2px solid #f472b6',
            backgroundColor: currentLine.speaker === 'hero' ? '#0f172a' : '#831843',
          }}
        >
          <Image
            src={currentLine.avatar}
            width={48}
            height={48}
            alt={currentLine.name}
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span
              style={{
                color: currentLine.speaker === 'hero' ? '#38bdf8' : '#f472b6',
                fontFamily: "'VT323', monospace",
                fontSize: '17px',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
              }}
            >
              {currentLine.name}
            </span>

            <span
              style={{
                color: '#94a3b8',
                fontFamily: "'VT323', monospace",
                fontSize: '13px',
              }}
            >
              [Nhấn → / Space / Click tiếp tục]
            </span>
          </div>

          <p
            className="leading-relaxed"
            style={{
              color: '#f8fafc',
              fontFamily: "'VT323', monospace",
              fontSize: '18px',
              letterSpacing: '0.04em',
            }}
          >
            {currentLine.text.substring(0, charCount)}
            {charCount < currentLine.text.length && (
              <span
                className="inline-block ml-0.5"
                style={{
                  width: '6px',
                  height: '2px',
                  backgroundColor: currentLine.speaker === 'hero' ? '#38bdf8' : '#f472b6',
                  animation: 'title-blink 0.6s step-end infinite',
                }}
              />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
