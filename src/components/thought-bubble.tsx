'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { StoryMilestone } from '@/lib/level-data';

interface ThoughtBubbleProps {
  currentStory: StoryMilestone | null;
  heroX?: number;
  onDismiss: () => void;
}

export default function ThoughtBubble({ currentStory, onDismiss }: ThoughtBubbleProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(true);
  const isClosingRef = useRef(false);
  const mountTimeRef = useRef(0);

  const handleDismiss = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);

    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
      typewriterTimerRef.current = null;
    }
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }

    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      isClosingRef.current = false;
      onDismissRef.current();
    }, 280);
  }, []);

  const storyId = currentStory?.flowerId;
  const storyText = currentStory?.text;

  // Typewriter effect & Auto-dismiss timer
  useEffect(() => {
    if (!storyText || storyId === undefined) {
      setIsVisible(false);
      setIsClosing(false);
      setDisplayedText('');
      isClosingRef.current = false;
      return;
    }

    // Clear previous timers
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);

    setIsVisible(true);
    setIsClosing(false);
    setIsTyping(true);
    isTypingRef.current = true;
    isClosingRef.current = false;
    setDisplayedText('');
    mountTimeRef.current = Date.now();

    let idx = 0;
    const fullText = storyText;

    typewriterTimerRef.current = setInterval(() => {
      idx++;
      if (idx <= fullText.length) {
        setDisplayedText(fullText.substring(0, idx));
      }
      if (idx >= fullText.length) {
        if (typewriterTimerRef.current) {
          clearInterval(typewriterTimerRef.current);
          typewriterTimerRef.current = null;
        }
        setIsTyping(false);
        isTypingRef.current = false;

        // Keep visible for 4.5s after typewriter finishes so player can read peacefully
        autoDismissTimerRef.current = setTimeout(() => {
          handleDismiss();
        }, 4500);
      }
    }, 24);

    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    };
  }, [storyId, storyText, handleDismiss]);

  // Fast skip or dismiss on user action
  const handleSkipOrClose = useCallback(() => {
    if (isClosingRef.current || !currentStory) return;

    if (isTypingRef.current) {
      // Reveal full text immediately and stop typewriter interval
      if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
        typewriterTimerRef.current = null;
      }
      isTypingRef.current = false;
      setIsTyping(false);
      setDisplayedText(currentStory.text);

      // Start 4.5s auto-dismiss countdown from the moment text is completed
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = setTimeout(() => {
        handleDismiss();
      }, 4500);
      return;
    }

    // If text was already revealed, dismiss bubble
    handleDismiss();
  }, [currentStory, handleDismiss]);

  // Keyboard shortcut: Space / Enter / Escape to skip typewriter or close
  // (NOTE: We DO NOT bind ArrowRight here because ArrowRight is the hero's movement key!)
  useEffect(() => {
    if (!isVisible || isClosing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        if (e.repeat) return;
        if (Date.now() - mountTimeRef.current < 200) return;
        handleSkipOrClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isClosing, handleSkipOrClose]);

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
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSkipOrClose();
            }}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs text-rose-300/80 hover:text-white hover:bg-rose-500/20 cursor-pointer transition-colors"
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: '14px',
            }}
          >
            <span>{isTyping ? '⏩ Xem hết' : '✕ Đóng'}</span>
            <span className="text-amber-300 font-bold">[Space]</span>
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
