'use client';

import React from 'react';
import { LetterFragmentData } from '@/lib/level-data';

interface LetterFragmentProps {
  fragment: LetterFragmentData;
  isCollected: boolean;
  isCrouching?: boolean;
}

export default function LetterFragment({
  fragment,
  isCollected,
  isCrouching = false,
}: LetterFragmentProps) {
  if (isCollected) return null;

  return (
    <div
      className="absolute pointer-events-none select-none transition-all duration-300"
      style={{
        left: `${fragment.x - 20}px`,
        top: `${fragment.y - 15}px`,
        width: '40px',
        height: '34px',
      }}
    >
      {/* Type 1: High Branch Fragment (Left piece of kraft card) */}
      {fragment.type === 'tree-branch' && (
        <div className="relative w-full h-full animate-float-gentle">
          {/* Subtle glowing halo */}
          <div className="absolute -inset-1 bg-amber-400/30 rounded-full blur-[3px] animate-pulse" />
          
          {/* Kraft Paper Fragment #1 (Left section with jagged right edge) */}
          <svg viewBox="0 0 40 32" className="w-full h-full drop-shadow-md">
            {/* Kraft base with jagged torn right edge matching message.png style */}
            <path
              d="M 4,4 Q 16,3 26,5 L 23,10 L 27,15 L 22,20 L 26,26 Q 14,27 4,26 Q 3,15 4,4 Z"
              fill="#c99b66"
              stroke="#2d1c13"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Handwritten doodle strokes */}
            <path d="M 8,9 L 14,9" stroke="#2d1c13" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 8,14 L 18,14" stroke="#2d1c13" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 8,19 L 15,19" stroke="#2d1c13" strokeWidth="1.5" strokeLinecap="round" />
            {/* Sparkle star */}
            <circle cx="28" cy="8" r="1.5" fill="#fde68a" />
          </svg>
        </div>
      )}

      {/* Type 2: Paper Boat on Stream (Middle piece of kraft card) */}
      {fragment.type === 'paper-boat' && (
        <div className="relative w-full h-full animate-boat-bob">
          {/* Always-on Cyan/Aquamarine Sparkle Aura so the player easily spots it on the lake */}
          <div className="absolute -inset-3 bg-cyan-400/30 rounded-full blur-md animate-pulse pointer-events-none" />

          {/* Water ripple underneath */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-cyan-400/30 rounded-full blur-[1px] animate-ping opacity-60" />
          
          <svg viewBox="0 0 44 32" className="w-full h-full drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            {/* Origami boat body folded from kraft paper */}
            <polygon
              points="4,18 40,18 32,27 12,27"
              fill="#c99b66"
              stroke="#2d1c13"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Sail triangle */}
            <polygon
              points="22,6 30,18 22,18"
              fill="#d8ad7b"
              stroke="#2d1c13"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon
              points="22,9 14,18 22,18"
              fill="#b58855"
              stroke="#2d1c13"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Firefly companion glow */}
            <circle cx="34" cy="10" r="2" fill="#a7f3d0" className="animate-pulse" />
          </svg>
        </div>
      )}

      {/* Type 3: Cat Playing with Fragment (Right piece of kraft card) */}
      {fragment.type === 'cat-pounce' && (
        <div className="relative w-full h-full animate-float-gentle">
          {/* Always-on Golden Sparkle Aura so the player easily spots it */}
          <div className="absolute -inset-3 bg-amber-400/30 rounded-full blur-md animate-pulse pointer-events-none" />

          {/* Kraft Paper Fragment #3 (Right section with jagged left edge) */}
          <svg viewBox="0 0 40 32" className="w-full h-full drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
            <path
              d="M 14,5 L 17,11 L 13,16 L 18,21 L 14,26 Q 26,27 36,25 Q 37,15 35,4 Q 24,3 14,5 Z"
              fill="#d97706"
              stroke="#451a03"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Handwritten doodle strokes */}
            <path d="M 20,9 L 30,9" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 19,14 L 32,14" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 21,19 L 29,19" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" />
            {/* Cute cat paw print doodle on the paper */}
            <circle cx="28" cy="22" r="1.2" fill="#78350f" opacity="0.8" />
            <circle cx="26" cy="20" r="0.8" fill="#78350f" opacity="0.8" />
            <circle cx="28" cy="19.5" r="0.8" fill="#78350f" opacity="0.8" />
            <circle cx="30" cy="20" r="0.8" fill="#78350f" opacity="0.8" />
          </svg>
        </div>
      )}
    </div>
  );
}
