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

export default function EasterEggBook({
  onClose,
  sheets = DEFAULT_BOOK_SHEETS,
}: EasterEggBookProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const bookContainerRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);
  const pageFlipInstanceRef = useRef<PageFlip | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sequential single pages list:
  // [Sheet0.front (Cover), Sheet0.back (p1), Sheet1.front (p2), Sheet1.back (p3), Sheet2.front (p4), Sheet2.back (p5), Sheet3.front (p6), Sheet3.back (Back Cover)]
  const allPages = useMemo(() => {
    const list: BookPageSide[] = [];
    sheets.forEach((sheet) => {
      list.push(sheet.front);
      list.push(sheet.back);
    });
    return list;
  }, [sheets]);

  // Dimensions:
  // Windowed mode: single page 290px x 380px (open spread 580px x 380px)
  // Fullscreen mode: single page 440px x 580px (open spread 880px x 580px)
  const pageWidth = isExpanded ? 440 : 290;
  const pageHeight = isExpanded ? 580 : 380;

  // Outer covers: Page 0 (Front Cover) and Page 7 / last page (Back Cover)
  const isOuterCover = currentPageIndex === 0 || currentPageIndex >= allPages.length - 1;

  // Initialize and update PageFlip instance with robust cloned template strategy
  useEffect(() => {
    if (!isMounted || !bookContainerRef.current || !templatesRef.current) return;
    if (templatesRef.current.children.length === 0) return;

    // Destroy existing instance cleanly before creating a new one
    if (pageFlipInstanceRef.current) {
      try {
        pageFlipInstanceRef.current.destroy();
      } catch {
        // ignore
      }
      pageFlipInstanceRef.current = null;
    }

    const container = bookContainerRef.current;
    container.innerHTML = ''; // Reset container cleanly to prevent any DOM collisions

    // Clone fresh copies of the pages from the template container
    const clonedPageNodes = Array.from(templatesRef.current.children).map((child) =>
      child.cloneNode(true) as HTMLElement
    );

    let initTimer: NodeJS.Timeout | null = null;

    try {
      const pageFlip = new PageFlip(container, {
        width: pageWidth,
        height: pageHeight,
        size: 'fixed',
        minWidth: pageWidth,
        maxWidth: pageWidth,
        minHeight: pageHeight,
        maxHeight: pageHeight,
        showCover: true, // Page 0 is Front Cover, last page is Back Cover
        drawShadow: true,
        maxShadowOpacity: 0.5,
        flippingTime: 750, // silky smooth transition
        usePortrait: false, // keep 2-page spread
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

      // Track initial page index
      pageFlip.on('init', (e) => {
        if (e && typeof e.data?.page === 'number') {
          setCurrentPageIndex(e.data.page);
        }
      });

      // Audio on page curl & page tracking
      pageFlip.on('flip', (e) => {
        SFX.pageFlip();
        if (typeof e.data === 'number') {
          setCurrentPageIndex(e.data);
        }
      });

      // Recalculate layout after DOM mounting
      initTimer = setTimeout(() => {
        try {
          pageFlip.update();
        } catch {
          // ignore
        }
      }, 50);
    } catch (err) {
      console.error('Failed to initialize PageFlip:', err);
    }

    return () => {
      if (initTimer) clearTimeout(initTimer);
      if (pageFlipInstanceRef.current) {
        try {
          pageFlipInstanceRef.current.destroy();
        } catch {
          // ignore
        }
        pageFlipInstanceRef.current = null;
      }
    };
  }, [isMounted, pageWidth, pageHeight, isExpanded, allPages]);

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
        if (isExpanded) {
          setIsExpanded(false);
        } else {
          SFX.click();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, onClose]);

  // ============================================================================
  // PURE VECTOR ARTISAN GRAPHICS (MATCHING IMAGE 1 - NO EMOJIS)
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
          {/* Outer Brass Bracket */}
          <path
            d="M 2 2 L 25 2 C 25 7 21 9 19 11 C 17 13 15 17 13 21 C 11 23 7 25 2 25 Z"
            fill="#caa059"
            stroke="#6e451b"
            strokeWidth="1.2"
          />
          {/* Inner Highlight Layer */}
          <path
            d="M 4 4 L 19 4 C 19 7 16 9 14 11 C 12 13 10 16 8 19 L 4 19 Z"
            fill="#eacb88"
            stroke="#916327"
            strokeWidth="0.8"
          />
          {/* Rivet Stud */}
          <circle cx="8.5" cy="8.5" r="1.8" fill="#52310f" stroke="#e8c784" strokeWidth="0.6" />
          <path d="M 13 5 Q 12 9 8 12" fill="none" stroke="#7e4c20" strokeWidth="0.8" />
        </svg>
      </div>
    );
  };

  // 2. Cherry Blossom Branch Filigree on Page Corners (Vector SVG)
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
          {/* Delicate tree branch in warm brown */}
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

          {/* Tiny olive leaves */}
          <path d="M 28 22 Q 33 19 31 16 Q 26 19 28 22 Z" fill="#757c46" opacity="0.85" />
          <path d="M 44 14 Q 48 10 46 8 Q 42 12 44 14 Z" fill="#757c46" opacity="0.85" />
          <path d="M 18 19 Q 14 17 14 13 Q 19 15 18 19 Z" fill="#757c46" opacity="0.85" />

          {/* Center 5-petal Blossom */}
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

          {/* Secondary bud */}
          <g transform="translate(19, 8)">
            <path d="M 0 -4 C 3 -6 5 -3 2 0 C 0 1 0 0 0 0 Z" fill="#de7d92" />
            <path d="M 0 -4 C -3 -6 -5 -3 -2 0 C 0 1 0 0 0 0 Z" fill="#ea94a7" />
            <circle cx="0" cy="0" r="1" fill="#c0752d" />
          </g>

          {/* Tertiary bud */}
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

  // Render a Single Page Side (Both Left & Right use authentic Aged Parchment from Image 1)
  const renderPageContent = (page: BookPageSide, isLeft: boolean) => {
    const isCover = page.type === 'cover';
    const isBackCover = page.type === 'back-cover';

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
        {/* Cherry Blossom Branch Corner Filigrees (4 corners) */}
        <CherryBranchCorner isLeft={true} isTop={true} />
        <CherryBranchCorner isLeft={false} isTop={true} />
        <CherryBranchCorner isLeft={true} isTop={false} />
        <CherryBranchCorner isLeft={false} isTop={false} />

        {/* Double Hairline Vintage Inner Border */}
        <div className="absolute inset-2.5 border border-[#cfb291]/80 rounded-[2px] pointer-events-none" />
        <div className="absolute inset-3 border border-[#cfb291]/35 rounded-[2px] pointer-events-none" />

        {/* Top Header Section */}
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

        {/* Middle Body Paragraphs */}
        <div className="z-10 space-y-1.5 my-auto px-1 sm:px-2">
          {page.paragraphs?.map((para, idx) => (
            <div key={idx}>{renderParagraphWithDropCap(para, idx === 0 && !isCover)}</div>
          ))}

          {/* Quote Cartouche Box (Matching Image 1) */}
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

        {/* Bottom Signature / Page Number Section */}
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
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center select-none transition-all duration-300 ${
        isExpanded
          ? 'bg-black/85 backdrop-blur-md p-3 sm:p-6'
          : 'bg-black/75 backdrop-blur-[2px] p-2 sm:p-4'
      }`}
    >
      {/* Top Floating Control Buttons (Clean Retro Pixel Art) */}
      <div className="absolute top-3 right-3 z-60 flex items-center gap-1.5 select-none">
        <button
          onClick={() => {
            SFX.click();
            setIsExpanded((prev) => !prev);
          }}
          className="px-2.5 py-1 rounded-xs transition-transform hover:scale-105 cursor-pointer shadow-md flex items-center gap-1"
          style={{
            backgroundColor: 'rgba(15, 10, 24, 0.92)',
            border: '1px solid #e2b77a',
            color: '#fbbf24',
            fontFamily: "'VT323', monospace",
            fontSize: '16px',
            textShadow: '1px 1px 0 #000',
          }}
          title={isExpanded ? 'Thu nhỏ lại [Esc]' : 'Mở rộng toàn màn hình'}
        >
          <span>{isExpanded ? '⊡' : '⛶'}</span>
          <span>{isExpanded ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
        </button>

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
          width: `${pageWidth}px`,
          height: `${pageHeight}px`,
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
                width: `${pageWidth}px`,
                height: `${pageHeight}px`,
                backgroundColor: '#f4ebd7',
              }}
            >
              {renderPageContent(page, idx % 2 === 1)}
            </div>
          );
        })}
      </div>

      {/* Book Outer Physical Casing (Burgundy Leather + Brass Corners + Stacked Paper Edges) */}
      <div
        className="relative flex items-center justify-center transition-all duration-300 select-none"
        style={{
          width: `${pageWidth * 2}px`,
          height: `${pageHeight}px`,
          maxWidth: '96vw',
          maxHeight: '94vh',
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

        {/* 4 Authentic Ornamental Brass Corner Protectors */}
        <BrassCorner position="top-left" />
        <BrassCorner position="top-right" />
        <BrassCorner position="bottom-left" />
        <BrassCorner position="bottom-right" />

        {/* Stacked Paper Block Edge Thickness at Bottom & Sides */}
        <div
          className="absolute inset-x-2 bottom-0 h-2 -z-10 rounded-b pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(to bottom, #ded0b6 0px, #baa78e 1px, #ded0b6 2px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
          }}
        />

        {/* Satin Bookmark Ribbon with Gold Blossom Crest (Hidden on outer front & back covers) */}
        {!isOuterCover && (
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-16 pointer-events-none z-45 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to bottom, #721624 0%, #a62b3f 65%, #721624 100%)',
              boxShadow: '0 3px 8px rgba(0,0,0,0.5)',
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 86%, 0% 100%)',
            }}
          >
            {/* Small 4-petal Gold Flower Crest on Top of Ribbon */}
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
          style={{ width: `${pageWidth * 2}px`, height: `${pageHeight}px` }}
        />
      </div>
    </div>
  );

  if (!isMounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(bookDOM, document.body);
}
