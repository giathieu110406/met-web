'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { PageFlip } from 'page-flip';
import { SFX } from '@/lib/sound';
import { DEFAULT_BOOK_SHEETS, BookSheet, BookPageSide } from '@/lib/book-content';

interface EasterEggBookProps {
  onClose: () => void;
  sheets?: BookSheet[];
}

// Fullscreen-only dimensions: single page 440px × 580px (open spread 880px × 580px)
const PAGE_WIDTH = 440;
const PAGE_HEIGHT = 580;

export default function EasterEggBook({
  onClose,
  sheets = DEFAULT_BOOK_SHEETS,
}: EasterEggBookProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const bookContainerRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  const pageFlipInstanceRef = useRef<PageFlip | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sequential single pages list:
  // [Sheet0.front (Cover), Sheet0.back (p1), Sheet1.front (p2), … Sheet3.back (Back Cover)]
  const allPages = useMemo(() => {
    const list: BookPageSide[] = [];
    sheets.forEach((sheet) => {
      list.push(sheet.front);
      list.push(sheet.back);
    });
    return list;
  }, [sheets]);

  // Outer covers: Page 0 (Front Cover) and last page (Back Cover)
  const isOuterCover = currentPageIndex === 0 || currentPageIndex >= allPages.length - 1;

  // Initialize PageFlip instance with robust cloned-template strategy
  useEffect(() => {
    if (!isMounted || !bookContainerRef.current || !templatesRef.current) return;
    if (templatesRef.current.children.length === 0) return;

    // Destroy existing instance cleanly before creating a new one
    if (pageFlipInstanceRef.current) {
      try { pageFlipInstanceRef.current.destroy(); } catch { /* ignore */ }
      pageFlipInstanceRef.current = null;
    }

    const container = bookContainerRef.current;
    container.innerHTML = '';

    // Clone fresh copies of the pages from the template container
    const clonedPageNodes = Array.from(templatesRef.current.children).map((child) =>
      child.cloneNode(true) as HTMLElement
    );

    let initTimer: NodeJS.Timeout | null = null;

    try {
      const pageFlip = new PageFlip(container, {
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        size: 'fixed',
        minWidth: PAGE_WIDTH,
        maxWidth: PAGE_WIDTH,
        minHeight: PAGE_HEIGHT,
        maxHeight: PAGE_HEIGHT,
        showCover: true,
        drawShadow: true,
        maxShadowOpacity: 0.5,
        flippingTime: 700,
        usePortrait: false,
        startPage: currentPageIndex,
        autoSize: false,
        showPageCorners: true,
        useMouseEvents: true,
        swipeDistance: 15,
        clickEventForward: true,
        disableFlipByClick: false,
      });

      pageFlipInstanceRef.current = pageFlip;
      pageFlip.loadFromHTML(clonedPageNodes);

      pageFlip.on('init', (e) => {
        if (e && typeof e.data?.page === 'number') {
          setCurrentPageIndex(e.data.page);
        }
      });

      pageFlip.on('flip', (e) => {
        SFX.pageFlip();
        if (typeof e.data === 'number') {
          setCurrentPageIndex(e.data);
        }
      });

      // Recalculate layout after DOM mounting
      initTimer = setTimeout(() => {
        try { pageFlip.update(); } catch { /* ignore */ }
      }, 50);
    } catch (err) {
      console.error('Failed to initialize PageFlip:', err);
    }

    return () => {
      if (initTimer) clearTimeout(initTimer);
      if (pageFlipInstanceRef.current) {
        try { pageFlipInstanceRef.current.destroy(); } catch { /* ignore */ }
        pageFlipInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, allPages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const pf = pageFlipInstanceRef.current;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        pf?.flipNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        pf?.flipPrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        SFX.click();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // ============================================================================
  // PURE VECTOR ARTISAN GRAPHICS (NO EMOJIS)
  // ============================================================================

  // 1. Brass Corner Protectors on Outer Book Casing
  const BrassCorner = ({
    position,
  }: {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }) => {
    const rotation =
      position === 'top-left'
        ? 'rotate(0deg)'
        : position === 'top-right'
          ? 'rotate(90deg)'
          : position === 'bottom-right'
            ? 'rotate(180deg)'
            : 'rotate(270deg)';

    const posClasses =
      position === 'top-left'
        ? '-top-1.5 -left-1.5'
        : position === 'top-right'
          ? '-top-1.5 -right-1.5'
          : position === 'bottom-right'
            ? '-bottom-1.5 -right-1.5'
            : '-bottom-1.5 -left-1.5';

    return (
      <div
        className={`absolute ${posClasses} w-7 h-7 pointer-events-none z-50`}
        style={{ transform: rotation }}
      >
        <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
          <path
            d="M 2 2 L 25 2 C 25 7 21 9 19 11 C 17 13 15 17 13 21 C 11 23 7 25 2 25 Z"
            fill="#caa059"
            stroke="#6e451b"
            strokeWidth="1.2"
          />
          <path
            d="M 4 4 L 19 4 C 19 7 16 9 14 11 C 12 13 10 16 8 19 L 4 19 Z"
            fill="#eacb88"
            stroke="#916327"
            strokeWidth="0.8"
          />
          <circle cx="8.5" cy="8.5" r="1.8" fill="#52310f" stroke="#e8c784" strokeWidth="0.6" />
          <path d="M 13 5 Q 12 9 8 12" fill="none" stroke="#7e4c20" strokeWidth="0.8" />
        </svg>
      </div>
    );
  };

  // 2. Cherry Blossom Branch Filigree on Page Corners
  const CherryBranchCorner = ({
    isLeft,
    isTop,
  }: {
    isLeft: boolean;
    isTop: boolean;
  }) => {
    const transform = `${isLeft ? '' : 'scaleX(-1)'} ${isTop ? '' : 'scaleY(-1)'}`;
    const posClass = `${isLeft ? 'left-2.5' : 'right-2.5'} ${isTop ? 'top-2.5' : 'bottom-2.5'}`;

    return (
      <div
        className={`absolute ${posClass} w-13 h-13 pointer-events-none opacity-90 select-none`}
        style={{ transform, transformOrigin: 'center center' }}
      >
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <path
            d="M 5 55 C 13 42 19 30 38 18 C 45 14 52 10 56 6"
            fill="none"
            stroke="#734e37"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 23 27 C 18 22 16 14 18 8"
            fill="none"
            stroke="#80573e"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M 37 19 C 39 12 43 8 49 6"
            fill="none"
            stroke="#80573e"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path d="M 28 22 Q 33 19 31 16 Q 26 19 28 22 Z" fill="#757c46" opacity="0.85" />
          <path d="M 44 14 Q 48 10 46 8 Q 42 12 44 14 Z" fill="#757c46" opacity="0.85" />
          <path d="M 18 19 Q 14 17 14 13 Q 19 15 18 19 Z" fill="#757c46" opacity="0.85" />
          <g transform="translate(36, 20)">
            <path d="M 0 -7 C 2 -11 6 -11 6 -7 C 6 -3 2 -1 0 0 Z" fill="#de7d92" />
            <path d="M 0 -7 C -2 -11 -6 -11 -6 -7 C -6 -3 -2 -1 0 0 Z" fill="#ea94a7" />
            <path d="M 7 -2 C 11 -3 12 1 8 4 C 5 5 2 2 0 0 Z" fill="#de7d92" />
            <path d="M 5 6 C 6 10 2 12 -2 9 C -4 6 -2 3 0 0 Z" fill="#ea94a7" />
            <path d="M -5 6 C -7 9 -11 7 -9 3 C -7 0 -3 0 0 0 Z" fill="#de7d92" />
            <path d="M -7 -2 C -11 -2 -11 2 -7 5 C -4 5 -2 2 0 0 Z" fill="#ea94a7" />
            <circle cx="0" cy="0" r="1.8" fill="#c0752d" />
            <circle cx="0" cy="0" r="0.7" fill="#fef08a" />
          </g>
          <g transform="translate(19, 8)">
            <path d="M 0 -4 C 3 -6 5 -3 2 0 C 0 1 0 0 0 0 Z" fill="#de7d92" />
            <path d="M 0 -4 C -3 -6 -5 -3 -2 0 C 0 1 0 0 0 0 Z" fill="#ea94a7" />
            <circle cx="0" cy="0" r="1" fill="#c0752d" />
          </g>
          <g transform="translate(49, 7)">
            <path d="M 0 -3 C 2 -5 4 -2 2 0 Z" fill="#de7d92" />
            <path d="M 0 -3 C -2 -5 -4 -2 -2 0 Z" fill="#ea94a7" />
            <circle cx="0" cy="0" r="1" fill="#c0752d" />
          </g>
        </svg>
      </div>
    );
  };

  // 3. Top Symmetrical Cherry Blossom Crest
  const CherryCrest = () => (
    <div className="flex items-center justify-center gap-2 my-1 select-none pointer-events-none">
      <div className="flex items-center gap-1.5 opacity-75">
        <div className="w-8 h-[0.75px] bg-gradient-to-r from-transparent to-[#b88e63]" />
        <span className="text-[6.5px] text-[#9c6f44]">◇</span>
        <div className="w-4 h-[0.75px] bg-[#b88e63]" />
        <span className="text-[6.5px] text-[#9c6f44]">◇</span>
        <div className="w-2.5 h-[0.75px] bg-[#b88e63]" />
      </div>

      <svg viewBox="0 0 24 24" className="w-5 h-5 drop-shadow-2xs">
        <g transform="translate(12, 12)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <path
              key={i}
              d="M 0 0 C -2 -4 -3 -7 -1.5 -8.5 C 0 -9.5 1.5 -9.5 2 -8 C 2.5 -9.5 4 -9.5 4.5 -8 C 5 -6.5 3 -3 0 0 Z"
              fill={i % 2 === 0 ? '#d46d82' : '#e68499'}
              stroke="#8c2f42"
              strokeWidth="0.4"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="2.2" fill="#bc7126" />
          <circle cx="0" cy="0" r="0.9" fill="#fef08a" />
        </g>
      </svg>

      <div className="flex items-center gap-1.5 opacity-75">
        <div className="w-2.5 h-[0.75px] bg-[#b88e63]" />
        <span className="text-[6.5px] text-[#9c6f44]">◇</span>
        <div className="w-4 h-[0.75px] bg-[#b88e63]" />
        <span className="text-[6.5px] text-[#9c6f44]">◇</span>
        <div className="w-8 h-[0.75px] bg-gradient-to-l from-transparent to-[#b88e63]" />
      </div>
    </div>
  );

  // 4. Subtle Flower Divider for Body
  const SmallFlowerDivider = () => (
    <div className="flex items-center justify-center gap-2 my-1.5 select-none pointer-events-none opacity-85">
      <div className="w-8 h-[0.75px] bg-gradient-to-r from-transparent to-[#b88e63]" />
      <span className="text-[6.5px] text-[#9c6f44]">◇</span>
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5">
        <g transform="translate(8, 8)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-3.8"
              rx="1.9"
              ry="2.8"
              fill={i % 2 === 0 ? '#d46d82' : '#e68499'}
              stroke="#8c2f42"
              strokeWidth="0.3"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="1.4" fill="#bc7126" />
        </g>
      </svg>
      <span className="text-[6.5px] text-[#9c6f44]">◇</span>
      <div className="w-8 h-[0.75px] bg-gradient-to-l from-transparent to-[#b88e63]" />
    </div>
  );

  const renderParagraphWithDropCap = (para: string, isFirst: boolean) => {
    if (!isFirst || !para || para.length < 2) {
      return (
        <p className="book-sans text-[10px] sm:text-[11px] leading-[1.68] text-[#3e271c] text-justify font-normal tracking-normal select-none">
          {para}
        </p>
      );
    }
    const firstLetter = para.charAt(0);
    const rest = para.slice(1);
    return (
      <p className="book-sans text-[10px] sm:text-[11px] leading-[1.68] text-[#3e271c] text-justify font-normal tracking-normal select-none">
        <span className="book-serif float-left text-[23px] leading-[0.8] font-bold text-[#882b3a] mr-1.5 pt-0.5 select-none">
          {firstLetter}
        </span>
        {rest}
      </p>
    );
  };

  // ── Cover Page (Bìa Trước) — Leather Book Cover Design ──
  const renderCoverPage = () => (
    <div
      className="w-full h-full flex flex-col items-center justify-between select-none relative overflow-hidden rounded-r-xs"
      style={{
        background: 'radial-gradient(ellipse at 40% 35%, #5a1a22 0%, #3a0d13 55%, #220709 100%)',
      }}
    >
      {/* Subtle leather texture grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Outer gold frame border */}
      <div
        className="absolute inset-3 pointer-events-none"
        style={{ border: '1.5px solid rgba(212,175,75,0.55)', borderRadius: '3px' }}
      />
      <div
        className="absolute inset-[18px] pointer-events-none"
        style={{ border: '0.75px solid rgba(212,175,75,0.25)', borderRadius: '2px' }}
      />

      {/* Top ornament — large SVG filigree crown */}
      <div className="z-10 flex flex-col items-center pt-8 gap-1.5">
        {/* Crown / top filigree */}
        <svg viewBox="0 0 180 50" className="w-44 opacity-80">
          {/* Central arch */}
          <path d="M 90 45 C 60 35 30 20 20 5" fill="none" stroke="#c9a84c" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M 90 45 C 120 35 150 20 160 5" fill="none" stroke="#c9a84c" strokeWidth="1.2" strokeLinecap="round"/>
          {/* Symmetrical side scrolls */}
          <path d="M 20 5 C 18 10 25 15 22 22" fill="none" stroke="#c9a84c" strokeWidth="0.9"/>
          <path d="M 160 5 C 162 10 155 15 158 22" fill="none" stroke="#c9a84c" strokeWidth="0.9"/>
          {/* Diamond chain */}
          {[40, 65, 90, 115, 140].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${i === 2 ? 14 : i === 1 || i === 3 ? 22 : 30})`}>
              <rect x="-3" y="-3" width="6" height="6" transform="rotate(45)" fill="#c9a84c" opacity="0.9"/>
            </g>
          ))}
          {/* Center crown peak */}
          <path d="M 75 14 L 90 2 L 105 14" fill="none" stroke="#e8c96e" strokeWidth="1.4" strokeLinejoin="round"/>
          <circle cx="90" cy="2" r="2.5" fill="#f0d68a"/>
          <circle cx="90" cy="2" r="1" fill="#fff8dc"/>
        </svg>

        {/* Series tag */}
        <div
          className="px-4 py-0.5 select-none"
          style={{ border: '0.75px solid rgba(200,160,60,0.45)', borderRadius: '1px' }}
        >
          <p className="book-sans text-[8px] tracking-[0.35em] uppercase text-center select-none"
             style={{ color: '#c9a84c', letterSpacing: '0.35em' }}>
            Kỷ Niệm Của Chúng Mình
          </p>
        </div>
      </div>

      {/* Center — Main title block */}
      <div className="z-10 flex flex-col items-center gap-3 px-8">
        {/* Horizontal rule top */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c9a84c88)' }}/>
          <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 shrink-0">
            <g transform="translate(10,10)">
              {[0,72,144,216,288].map((a,i) => (
                <path key={i} d="M0 0 C-1.5-3 -2.5-6 -1-7 C0-8 1-8 1.5-6.5 C2-8 3-8 3.5-6.5 C4-5 2.5-2 0 0Z"
                  fill={i%2===0?'#c9a84c':'#e8c96e'} transform={`rotate(${a})`}/>
              ))}
              <circle cx="0" cy="0" r="1.5" fill="#f0d68a"/>
            </g>
          </svg>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c9a84c88)' }}/>
        </div>

        {/* Main title — embossed look */}
        <div className="text-center">
          <h1
            className="book-serif select-none leading-snug"
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#f5e6b8',
              textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,75,0.25)',
              letterSpacing: '0.03em',
            }}
          >
            Kỷ Niệm
          </h1>
          <h1
            className="book-serif select-none leading-snug"
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#f5e6b8',
              textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,75,0.25)',
              letterSpacing: '0.03em',
            }}
          >
            Của Chúng Mình
          </h1>
        </div>

        {/* Subtitle */}
        <p className="book-sans text-center select-none"
           style={{ fontSize: '9px', color: '#c9a84c', opacity: 0.85, letterSpacing: '0.12em', fontStyle: 'italic' }}>
          Món quà mang theo suốt chuyến hành trình
        </p>

        {/* Horizontal rule bottom */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #c9a84c88)' }}/>
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 shrink-0">
            <rect x="1" y="1" width="10" height="10" transform="rotate(45 6 6)" fill="none" stroke="#c9a84c" strokeWidth="1.2"/>
            <circle cx="6" cy="6" r="1.5" fill="#c9a84c"/>
          </svg>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #c9a84c88)' }}/>
        </div>

        {/* Quote cartouche */}
        <div
          className="px-4 py-2.5 relative"
          style={{
            border: '0.75px solid rgba(200,160,60,0.40)',
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '2px',
          }}
        >
          <span className="absolute top-0.5 left-1 text-[6px] select-none" style={{ color: '#c9a84c' }}>◇</span>
          <span className="absolute top-0.5 right-1 text-[6px] select-none" style={{ color: '#c9a84c' }}>◇</span>
          <span className="absolute bottom-0.5 left-1 text-[6px] select-none" style={{ color: '#c9a84c' }}>◇</span>
          <span className="absolute bottom-0.5 right-1 text-[6px] select-none" style={{ color: '#c9a84c' }}>◇</span>
          <p className="book-serif text-center select-none"
             style={{ fontSize: '9.5px', color: '#f0dda0', fontStyle: 'italic', lineHeight: 1.6 }}>
            "Gặp được người mình thương,<br/>mọi bước chân đều hóa dịu dàng."
          </p>
        </div>
      </div>

      {/* Bottom — signature & bottom ornament */}
      <div className="z-10 flex flex-col items-center gap-2 pb-7">
        {/* Signature */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-px" style={{ background: 'linear-gradient(to right, transparent, #c9a84c)' }}/>
          <span className="book-serif select-none" style={{ fontSize: '9px', color: '#e8c96e', letterSpacing: '0.3em' }}>GỬI EM</span>
          <div className="w-6 h-px" style={{ background: 'linear-gradient(to left, transparent, #c9a84c)' }}/>
        </div>

        {/* Bottom filigree mirror */}
        <svg viewBox="0 0 180 50" className="w-44 opacity-70" style={{ transform: 'scaleY(-1)' }}>
          <path d="M 90 45 C 60 35 30 20 20 5" fill="none" stroke="#c9a84c" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M 90 45 C 120 35 150 20 160 5" fill="none" stroke="#c9a84c" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M 20 5 C 18 10 25 15 22 22" fill="none" stroke="#c9a84c" strokeWidth="0.9"/>
          <path d="M 160 5 C 162 10 155 15 158 22" fill="none" stroke="#c9a84c" strokeWidth="0.9"/>
          {[40, 65, 90, 115, 140].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${i === 2 ? 14 : i === 1 || i === 3 ? 22 : 30})`}>
              <rect x="-3" y="-3" width="6" height="6" transform="rotate(45)" fill="#c9a84c" opacity="0.9"/>
            </g>
          ))}
        </svg>

        {/* Book title at bottom spine */}
        <p className="book-sans select-none text-center"
           style={{ fontSize: '7.5px', color: 'rgba(200,160,60,0.5)', letterSpacing: '0.2em' }}>
          MET — A TINY LOVE STORY
        </p>
      </div>
    </div>
  );

  // ── Back Cover ──
  const renderBackCoverPage = () => (
    <div
      className="w-full h-full flex flex-col items-center justify-between select-none relative overflow-hidden rounded-l-xs"
      style={{
        background: 'radial-gradient(ellipse at 60% 60%, #42100f 0%, #2a0608 55%, #180304 100%)',
      }}
    >
      {/* Leather grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Border frames */}
      <div className="absolute inset-3 pointer-events-none" style={{ border: '1.5px solid rgba(180,140,55,0.45)', borderRadius: '3px' }} />
      <div className="absolute inset-[18px] pointer-events-none" style={{ border: '0.75px solid rgba(180,140,55,0.2)', borderRadius: '2px' }} />

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-10">
        {/* Central emblem */}
        <svg viewBox="0 0 80 80" className="w-20 h-20 opacity-75">
          {/* Outer circle */}
          <circle cx="40" cy="40" r="36" fill="none" stroke="#c9a84c" strokeWidth="0.8" strokeDasharray="3,2"/>
          <circle cx="40" cy="40" r="30" fill="none" stroke="#c9a84c" strokeWidth="0.5" opacity="0.5"/>
          {/* Cherry blossom center */}
          <g transform="translate(40,40)">
            {[0,72,144,216,288].map((a,i) => (
              <path key={i}
                d="M0 0 C-3-7 -5-13 -2-15 C0-17 3-17 4-14 C5-17 7-17 8-14 C10-11 7-5 0 0Z"
                fill={i%2===0?'#c9a84c':'#e8c96e'}
                opacity="0.9"
                transform={`rotate(${a})`}/>
            ))}
            <circle cx="0" cy="0" r="4" fill="#2a0608"/>
            <circle cx="0" cy="0" r="2.5" fill="#f0d68a"/>
            <circle cx="0" cy="0" r="1" fill="#fff"/>
          </g>
          {/* Corner dots */}
          {[0,90,180,270].map((a,i) => (
            <g key={i} transform={`rotate(${a} 40 40) translate(40 6)`}>
              <circle cx="0" cy="0" r="1.5" fill="#c9a84c" opacity="0.7"/>
            </g>
          ))}
        </svg>

        {/* Title */}
        <div className="text-center">
          <p className="book-serif select-none" style={{ fontSize: '13px', color: '#f0dda0', fontWeight: 700, letterSpacing: '0.05em', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
            Met — A Tiny Love Story
          </p>
          <p className="book-sans select-none mt-0.5" style={{ fontSize: '8px', color: '#c9a84c', letterSpacing: '0.15em', opacity: 0.8 }}>
            Kỷ Niệm Của Chúng Mình
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(200,160,60,0.5))' }}/>
          <span style={{ color: '#c9a84c', fontSize: '8px' }}>◇</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(200,160,60,0.5))' }}/>
        </div>

        {/* Quote */}
        <p className="book-serif text-center select-none"
           style={{ fontSize: '9px', color: '#d4b87a', fontStyle: 'italic', lineHeight: 1.65, opacity: 0.9 }}>
          "Cuộc gặp gỡ đẹp nhất là khi<br/>hai trái tim cùng chung một nhịp đập."
        </p>

        {/* Credits */}
        <div className="flex flex-col items-center gap-0.5 mt-1">
          <p className="book-sans select-none" style={{ fontSize: '7.5px', color: 'rgba(200,160,60,0.55)', letterSpacing: '0.15em' }}>
            Made with love, care
          </p>
          <p className="book-sans select-none" style={{ fontSize: '7.5px', color: 'rgba(200,160,60,0.4)', letterSpacing: '0.1em' }}>
            and pixel nostalgia
          </p>
        </div>
      </div>

      {/* Bottom barcode-style ornament */}
      <div className="pb-6 flex flex-col items-center gap-1.5">
        <div className="flex gap-0.5">
          {[3,1,2,1,3,1,2,1,3,1,2,3,1,2,1,3].map((w, i) => (
            <div key={i} className="h-6" style={{ width: `${w}px`, backgroundColor: `rgba(200,160,60,${0.15 + (i%3)*0.08})` }}/>
          ))}
        </div>
        <p className="book-sans select-none" style={{ fontSize: '6.5px', color: 'rgba(200,160,60,0.35)', letterSpacing: '0.25em' }}>
          MET · 2025 · EASTER EGG
        </p>
      </div>
    </div>
  );

  // Render a Single Page Side
  const renderPageContent = (page: BookPageSide, isLeft: boolean) => {
    const isCover = page.type === 'cover';
    const isBackCover = page.type === 'back-cover';

    // Special full-design renders for cover pages
    if (isCover) return renderCoverPage();
    if (isBackCover) return renderBackCoverPage();

    return (
      <div
        className={`w-full h-full p-4 sm:p-5 flex flex-col justify-between select-none relative overflow-hidden text-[#3a2217] ${
          isLeft ? 'rounded-l-xs' : 'rounded-r-xs'
        }`}
        style={{
          background: 'radial-gradient(circle at center, #faf4e6 0%, #f4ebd7 65%, #e8dcc4 100%)',
          boxShadow: isLeft
            ? 'inset -12px 0 18px -8px rgba(50,20,6,0.15), inset 0 0 4px rgba(0,0,0,0.03)'
            : 'inset 12px 0 18px -8px rgba(50,20,6,0.15), inset 0 0 4px rgba(0,0,0,0.03)',
        }}
      >
        <CherryBranchCorner isLeft={true} isTop={true} />
        <CherryBranchCorner isLeft={false} isTop={true} />
        <CherryBranchCorner isLeft={true} isTop={false} />
        <CherryBranchCorner isLeft={false} isTop={false} />

        <div className="absolute inset-2.5 border border-[#cfb291]/80 rounded-[2px] pointer-events-none" />
        <div className="absolute inset-3 border border-[#cfb291]/35 rounded-[2px] pointer-events-none" />

        <div className="z-10 pt-1">
          <CherryCrest />
          <div className="text-center px-2">
            <h1 className="book-serif text-[13px] sm:text-[16px] font-bold text-[#44121a] tracking-wide leading-tight select-none">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="book-sans text-[9px] sm:text-[9.5px] text-[#784f37] italic mt-0.5 font-normal select-none">
                {page.subtitle}
              </p>
            )}
          </div>
          <SmallFlowerDivider />
        </div>

        <div className="z-10 space-y-1.5 my-auto px-1 sm:px-2">
          {page.paragraphs?.map((para, idx) => (
            <div key={idx}>{renderParagraphWithDropCap(para, idx === 0 && !isCover)}</div>
          ))}

          {page.quote && (
            <div
              className="mt-2.5 px-3 py-1.5 rounded-[3px] relative select-none"
              style={{
                backgroundColor: 'rgba(255, 252, 246, 0.65)',
                border: '1px solid #b89368',
                boxShadow: 'inset 0 0 6px rgba(184, 147, 104, 0.12)',
              }}
            >
              <span className="absolute top-0.5 left-1 text-[6.5px] text-[#966d43] leading-none">◇</span>
              <span className="absolute top-0.5 right-1 text-[6.5px] text-[#966d43] leading-none">◇</span>
              <span className="absolute bottom-0.5 left-1 text-[6.5px] text-[#966d43] leading-none">◇</span>
              <span className="absolute bottom-0.5 right-1 text-[6.5px] text-[#966d43] leading-none">◇</span>
              <p className="book-serif text-[9.5px] sm:text-[10.5px] text-[#46151f] italic text-center font-normal leading-relaxed px-2 select-none">
                {page.quote}
              </p>
            </div>
          )}
        </div>

        <div className="z-10 pb-1">
          {page.signature ? (
            <div className="flex items-center justify-center gap-2 select-none">
              <div className="w-6 h-[0.75px] bg-gradient-to-r from-transparent to-[#966d43]" />
              <span className="text-[6.5px] text-[#966d43]">◇</span>
              <span className="book-serif text-[9px] sm:text-[9.5px] text-[#5c242c] font-semibold tracking-widest uppercase">
                {page.signature}
              </span>
              <span className="text-[6.5px] text-[#966d43]">◇</span>
              <div className="w-6 h-[0.75px] bg-gradient-to-l from-transparent to-[#966d43]" />
            </div>
          ) : page.pageNumber ? (
            <div className="flex items-center justify-center text-[8px] book-sans text-[#8f6d50] tracking-widest select-none">
              — ❧ {page.pageNumber} ❧ —
            </div>
          ) : isBackCover ? (
            <div className="text-center text-[8px] book-sans text-[#8f6d50] tracking-wider select-none">
              Met — A Tiny Love Story
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const bookDOM = (

    <div className="fixed inset-0 z-[99999] flex items-center justify-center select-none bg-black/85 backdrop-blur-md p-3 sm:p-6">
      {/* Close Button */}
      <div className="absolute top-3 right-3 z-60 select-none">
        <button
          onClick={() => {
            SFX.click();
            onClose();
          }}
          className="w-7 h-7 flex items-center justify-center rounded-xs transition-transform hover:scale-105 cursor-pointer shadow-md"
          style={{
            backgroundColor: 'rgba(38, 12, 18, 0.92)',
            border: '1px solid #f472b6',
            color: '#fecdd3',
            fontFamily: "'VT323', monospace",
            fontSize: '17px',
            textShadow: '1px 1px 0 #000',
          }}
          title="Đóng sách [Esc]"
        >
          ✕
        </button>
      </div>

      {/* Hidden React-Rendered Templates Container (untouched by PageFlip DOM mutations) */}
      <div
        ref={templatesRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: `${PAGE_WIDTH}px`,
          height: `${PAGE_HEIGHT}px`,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {allPages.map((page, idx) => {
          const isCover = page.type === 'cover' || page.type === 'back-cover';
          return (
            <div
              key={page.id}
              className="st-page-template w-full h-full overflow-hidden"
              data-density={isCover ? 'hard' : 'soft'}
              style={{
                width: `${PAGE_WIDTH}px`,
                height: `${PAGE_HEIGHT}px`,
                backgroundColor: '#f4ebd7',
              }}
            >
              {renderPageContent(page, idx % 2 === 1)}
            </div>
          );
        })}
      </div>

      {/* Book Outer Physical Casing */}
      <div
        className="relative flex items-center justify-center select-none"
        style={{
          width: `${PAGE_WIDTH * 2}px`,
          height: `${PAGE_HEIGHT}px`,
          maxWidth: '96vw',
          maxHeight: '94vh',
          willChange: 'transform',
        }}
      >
        {/* Deep Ambient Drop Shadow Behind Book */}
        <div className="absolute -inset-3 bg-black/70 rounded-2xl blur-xl -z-30 transform translate-y-3 pointer-events-none" />

        {/* Hardcover Burgundy Leather Casing Backing */}
        <div
          className="absolute inset-0 rounded-xl -z-10 overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at center, #350e15 0%, #24090e 65%, #160406 100%)',
            border: '2px solid #4a1820',
            boxShadow: '0 18px 45px rgba(0,0,0,0.88), inset 0 0 10px rgba(0,0,0,0.9)',
          }}
        />

        {/* 4 Ornamental Brass Corner Protectors */}
        <BrassCorner position="top-left" />
        <BrassCorner position="top-right" />
        <BrassCorner position="bottom-left" />
        <BrassCorner position="bottom-right" />

        {/* Stacked Paper Block Edge Thickness at Bottom */}
        <div
          className="absolute inset-x-2 bottom-0 h-2 -z-10 rounded-b pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(to bottom, #ded0b6 0px, #baa78e 1px, #ded0b6 2px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
          }}
        />

        {/* Satin Bookmark Ribbon (Hidden on outer covers) */}
        {!isOuterCover && (
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-16 pointer-events-none z-45 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to bottom, #721624 0%, #a62b3f 65%, #721624 100%)',
              boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 86%, 0% 100%)',
            }}
          >
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 flex items-center justify-center">
              <svg viewBox="0 0 12 12" className="w-full h-full">
                <circle cx="6" cy="6" r="1.4" fill="#fef08a" />
                <circle cx="6" cy="2.5" r="1.4" fill="#e5b869" />
                <circle cx="6" cy="9.5" r="1.4" fill="#e5b869" />
                <circle cx="2.5" cy="6" r="1.4" fill="#e5b869" />
                <circle cx="9.5" cy="6" r="1.4" fill="#e5b869" />
              </svg>
            </div>
          </div>
        )}

        {/* Center Leather Spine Seam with Gold Diamond Studs (Hidden on outer covers) */}
        {!isOuterCover && (
          <div
            className="absolute top-0 bottom-0 left-1/2 w-5 -translate-x-1/2 z-40 pointer-events-none flex flex-col justify-around items-center py-6"
            style={{
              background:
                'linear-gradient(to right, rgba(20,5,8,0.7) 0%, rgba(46,12,18,0.95) 20%, #42121b 50%, rgba(46,12,18,0.95) 80%, rgba(20,5,8,0.7) 100%)',
              boxShadow: 'inset 0 0 3px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)',
            }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rotate-45 border border-[#855523] rounded-2xs"
                style={{
                  backgroundColor: '#d8ab60',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.6), inset 0 0 1px #fff',
                }}
              />
            ))}
          </div>
        )}

        {/* Dynamic PageFlip Mount Element */}
        <div
          ref={bookContainerRef}
          className="st-page-flip-container relative w-full h-full cursor-grab active:cursor-grabbing"
          style={{
            width: `${PAGE_WIDTH * 2}px`,
            height: `${PAGE_HEIGHT}px`,
            willChange: 'transform',
          }}
        />
      </div>
    </div>
  );

  if (!isMounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(bookDOM, document.body);
}
