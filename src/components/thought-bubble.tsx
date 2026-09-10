'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { StoryMilestone } from '@/lib/level-data';

interface ThoughtBubbleProps {
  currentStory: StoryMilestone | null;
  heroX?: number;
  onDismiss: () => void;
}

export default function ThoughtBubble({ currentStory, heroX, onDismiss }: ThoughtBubbleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  // Track the exact heroX when this story dialog first opened
  const initialHeroXRef = useRef<number | null>(null);
  const prevStoryIdRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);

  // Record initial hero position whenever a new milestone opens
  useEffect(() => {
    if (currentStory) {
      if (prevStoryIdRef.current !== currentStory.flowerId) {
        prevStoryIdRef.current = currentStory.flowerId;
        initialHeroXRef.current = heroX !== undefined ? heroX : currentStory.x;
      }
    } else {
      prevStoryIdRef.current = null;
      initialHeroXRef.current = null;
      isClosingRef.current = false;
    }
  }, [currentStory, heroX]);

  const handleDismiss = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      isClosingRef.current = false;
      onDismissRef.current();
    }, 300);
  }, []);

  const storyId = currentStory?.flowerId;
  const storyText = currentStory?.text;

  // Typewriter effect, followed by exactly 3 seconds wait before auto-dismiss
  useEffect(() => {
    if (!storyText || storyId === undefined) {
      setIsVisible(false);
      setIsClosing(false);
      setDisplayedText('');
      return;
    }

    setIsVisible(true);
    setIsClosing(false);
    setDisplayedText('');

    let idx = 0;
    const fullText = storyText;
    let autoDismissTimer: NodeJS.Timeout | null = null;

    // Typewriter effect (~25ms per character)
    const typewriterInterval = setInterval(() => {
      idx++;
      if (idx <= fullText.length) {
        setDisplayedText(fullText.substring(0, idx));
      }
      if (idx >= fullText.length) {
        clearInterval(typewriterInterval);
        // Text has completely finished typing. Wait 3 seconds before auto-dismissing:
        autoDismissTimer = setTimeout(() => {
          handleDismiss();
        }, 3000);
      }
    }, 25);

    return () => {
      clearInterval(typewriterInterval);
      if (autoDismissTimer) {
        clearTimeout(autoDismissTimer);
      }
    };
  }, [storyId, storyText, handleDismiss]);

  // Keyboard shortcut: Press ArrowRight to dismiss dialogue immediately (Task 6)
  useEffect(() => {
    if (!isVisible || isClosing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isClosing, handleDismiss]);

  if (!currentStory || !isVisible) return null;

  return (
    <div
      className={`absolute top-2 left-0 right-0 mx-auto z-40 max-w-[620px] w-[97%] select-none transition-all duration-300 ${
        isClosing ? 'opacity-0 -translate-y-2 scale-98 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        animation: !isClosing ? 'thought-fade-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)' : undefined,
      }}
    >
      <div
        className="relative rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-md overflow-hidden"
        style={{
          backgroundColor: 'rgba(10, 15, 29, 0.96)',
          border: '1px solid rgba(244, 114, 182, 0.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(244, 63, 94, 0.25)',
        }}
      >
        {/* Top Header: Flower milestone & Close button */}
        <div className="flex items-center justify-between mb-2.5 border-b border-rose-500/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {currentStory.flowerId === 95
                ? '🌿'
                : currentStory.flowerId === 99
                ? '🐾'
                : currentStory.flowerId >= 100
                ? '📜'
                : '🌹'}
            </span>
            <span
              style={{
                color: '#fbcfe8',
                fontFamily: "'VT323', monospace",
                fontSize: '16px',
                letterSpacing: '0.05em',
              }}
            >
              {currentStory.flowerId === 95
                ? 'Khoảng lặng dưới mưa'
                : currentStory.flowerId === 99
                ? 'Biến cố ở ghế đá'
                : currentStory.flowerId >= 100
                ? 'Mảnh thư ký ức'
                : `Kỷ niệm #${currentStory.flowerId} / 7`}
            </span>
          </div>

          <button
            onClick={handleDismiss}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs text-rose-300/80 hover:text-white hover:bg-rose-500/20 cursor-pointer transition-colors"
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: '14px',
            }}
          >
            <span>✕ Đóng</span>
            <span className="text-amber-300 font-bold">[➔]</span>
          </button>
        </div>

        {/* Monologue Text with Typewriter */}
        <p
          className="leading-relaxed min-h-[48px] text-justify"
          style={{
            color: '#f8fafc',
            fontFamily: "'VT323', monospace",
            fontSize: '18px',
            letterSpacing: '0.03em',
            textShadow: '0 1px 2px rgba(0,0,0,0.9)',
          }}
        >
          {displayedText}
          {displayedText.length < currentStory.text.length && (
            <span
              className="inline-block ml-1"
              style={{
                width: '6px',
                height: '3px',
                backgroundColor: '#f472b6',
                animation: 'title-blink 0.6s step-end infinite',
              }}
            />
          )}
        </p>

        {/* Tail pointing down towards Hero */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
          style={{
            backgroundColor: 'rgba(10, 15, 29, 0.96)',
            borderRight: '1px solid rgba(244, 114, 182, 0.5)',
            borderBottom: '1px solid rgba(244, 114, 182, 0.5)',
          }}
        />
      </div>
    </div>
  );
}
