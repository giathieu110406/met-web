'use client';

import { useEffect, useState } from 'react';

interface IntroTextProps {
  onComplete: () => void;
}

const LINES = [
  'Hôm nay, mình muốn nói với bạn một điều...',
  'Nhưng trước tiên, mình phải tìm đến bạn.',
];

const CHAR_DELAY = 50; // ms per character
const LINE_PAUSE = 800; // ms pause between lines
const END_PAUSE = 1200; // ms pause after all lines before fade

export default function IntroText({ onComplete }: IntroTextProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (fadeOut) return;

    // Finished all lines
    if (currentLine >= LINES.length) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => onComplete(), 600);
      }, END_PAUSE);
      return () => clearTimeout(timer);
    }

    const line = LINES[currentLine];

    // Finished current line
    if (currentChar >= line.length) {
      const timer = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, LINE_PAUSE);
      return () => clearTimeout(timer);
    }

    // Type next character
    const timer = setTimeout(() => {
      setCurrentChar((c) => c + 1);
    }, CHAR_DELAY);
    return () => clearTimeout(timer);
  }, [currentLine, currentChar, fadeOut, onComplete]);

  // Allow skipping with click or key
  useEffect(() => {
    if (fadeOut) return;

    const handleSkip = (e?: KeyboardEvent | MouseEvent) => {
      if (e && 'repeat' in e && e.repeat) return;
      setFadeOut(true);
      setTimeout(() => onComplete(), 400);
    };

    // Only allow skip after first line starts
    const timer = setTimeout(() => {
      window.addEventListener('click', handleSkip);
      window.addEventListener('keydown', handleSkip);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleSkip);
      window.removeEventListener('keydown', handleSkip);
    };
  }, [onComplete, fadeOut]);

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center gap-6 overflow-hidden px-12 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      {LINES.slice(0, currentLine + 1).map((line, lineIdx) => (
        <p
          key={lineIdx}
          className="text-center text-sm leading-relaxed"
          style={{
            color: '#e2e8f0',
            fontFamily: "'VT323', monospace",
            fontSize: '18px',
            letterSpacing: '0.05em',
            opacity: lineIdx < currentLine ? 0.5 : 1,
          }}
        >
          {lineIdx < currentLine
            ? line
            : line.substring(0, currentChar)}
          {lineIdx === currentLine && currentChar < line.length && (
            <span
              className="ml-0.5 inline-block"
              style={{
                width: '8px',
                height: '2px',
                backgroundColor: '#f9a8d4',
                animation: 'title-blink 0.6s step-end infinite',
                verticalAlign: 'middle',
              }}
            />
          )}
        </p>
      ))}
    </div>
  );
}
