'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

  // flippedCount = number of sheets turned from right to left (0 to sheets.length)
  // 0: Book closed at front cover (Cover on right, inside casing on left)
  // 1: Sheet 0 flipped (Page 1 on left, Page 2 on right)
  // 2: Sheet 1 flipped (Page 3 on left, Page 4 on right)
  // 3: Sheet 2 flipped (Page 5 on left, Page 6 on right)
  // 4: Sheet 3 flipped (Back Cover on left, inside casing on right)
  const [flippedCount, setFlippedCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const bookContainerRef = useRef<HTMLDivElement>(null);
  const sheetRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Drag tracking ref
  const dragRef = useRef<{
    isDragging: boolean;
    targetIndex: number;
    direction: 'forward' | 'backward';
    startX: number;
    startY: number;
    startTime: number;
    currentAngle: number;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Dimensions:
  // Canvas mode (600x400 viewport): 265px x 336px per page (total book 530px x 336px)
  // Fullscreen mode: 430px x 560px per page (total book 860px x 560px)
  const pageWidth = isExpanded ? 430 : 265;
  const pageHeight = isExpanded ? 560 : 336;

  // Turn forward (right to left)
  const flipForward = useCallback(() => {
    if (isAnimating || flippedCount >= sheets.length) return;
    const targetIndex = flippedCount;
    const sheetEl = sheetRefs.current[targetIndex];
    if (!sheetEl) return;

    setIsAnimating(true);
    SFX.pageFlip();

    sheetEl.style.zIndex = '100';
    sheetEl.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
    sheetEl.style.transform = 'rotateY(-180deg)';

    setTimeout(() => {
      setFlippedCount((prev) => prev + 1);
      setIsAnimating(false);
    }, 600);
  }, [flippedCount, isAnimating, sheets.length]);

  // Turn backward (left to right)
  const flipBackward = useCallback(() => {
    if (isAnimating || flippedCount <= 0) return;
    const targetIndex = flippedCount - 1;
    const sheetEl = sheetRefs.current[targetIndex];
    if (!sheetEl) return;

    setIsAnimating(true);
    SFX.pageFlip();

    sheetEl.style.zIndex = '100';
    sheetEl.style.transition = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)';
    sheetEl.style.transform = 'rotateY(0deg)';

    setTimeout(() => {
      setFlippedCount((prev) => prev - 1);
      setIsAnimating(false);
    }, 600);
  }, [flippedCount, isAnimating]);

  // Sync sheet positions and z-indices whenever flippedCount changes and not animating
  useEffect(() => {
    sheets.forEach((_, idx) => {
      const el = sheetRefs.current[idx];
      if (!el) return;

      const isFlipped = idx < flippedCount;
      el.style.transition = 'none';
      el.style.transform = `rotateY(${isFlipped ? -180 : 0}deg)`;
      el.style.zIndex = isFlipped ? `${(idx + 1) * 5}` : `${(sheets.length - idx) * 5}`;
    });
  }, [flippedCount, sheets]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flipForward();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        flipBackward();
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
  }, [isExpanded, onClose, flipForward, flipBackward]);

  // Pointer Drag Handlers (Smooth, silky drag from any edge/point)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isAnimating) return;
    const rect = bookContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const isRightSide = clickX >= rect.width / 2;

    if (isRightSide) {
      if (flippedCount >= sheets.length) return;
      const targetIndex = flippedCount;
      const sheetEl = sheetRefs.current[targetIndex];
      if (!sheetEl) return;

      sheetEl.style.zIndex = '100';
      sheetEl.style.transition = 'none';

      dragRef.current = {
        isDragging: true,
        targetIndex,
        direction: 'forward',
        startX: e.clientX,
        startY: e.clientY,
        startTime: Date.now(),
        currentAngle: 0,
      };

      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    } else {
      if (flippedCount <= 0) return;
      const targetIndex = flippedCount - 1;
      const sheetEl = sheetRefs.current[targetIndex];
      if (!sheetEl) return;

      sheetEl.style.zIndex = '100';
      sheetEl.style.transition = 'none';

      dragRef.current = {
        isDragging: true,
        targetIndex,
        direction: 'backward',
        startX: e.clientX,
        startY: e.clientY,
        startTime: Date.now(),
        currentAngle: -180,
      };

      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current?.isDragging) return;
    const { targetIndex, direction, startX } = dragRef.current;
    const sheetEl = sheetRefs.current[targetIndex];
    if (!sheetEl) return;

    const deltaX = e.clientX - startX;
    const maxDrag = pageWidth * 1.25;

    if (direction === 'forward') {
      // Dragging left means deltaX < 0
      const progress = Math.max(0, Math.min(1, -deltaX / maxDrag));
      const angle = -progress * 180;
      dragRef.current.currentAngle = angle;
      sheetEl.style.transform = `rotateY(${angle}deg)`;
    } else {
      // Dragging right means deltaX > 0
      const progress = Math.max(0, Math.min(1, deltaX / maxDrag));
      const angle = -180 + progress * 180;
      dragRef.current.currentAngle = angle;
      sheetEl.style.transform = `rotateY(${angle}deg)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current?.isDragging) return;
    const { targetIndex, direction, startX, startTime, currentAngle } = dragRef.current;
    const sheetEl = sheetRefs.current[targetIndex];
    dragRef.current = null;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (!sheetEl) return;

    const elapsed = Date.now() - startTime;
    const deltaX = e.clientX - startX;
    const isQuickClick = Math.abs(deltaX) < 10 && elapsed < 350;

    setIsAnimating(true);
    sheetEl.style.transition = 'transform 550ms cubic-bezier(0.16, 1, 0.3, 1)';

    if (direction === 'forward') {
      const shouldFlip = isQuickClick || currentAngle < -45 || (deltaX < -30 && elapsed < 400);
      if (shouldFlip) {
        SFX.pageFlip();
        sheetEl.style.transform = 'rotateY(-180deg)';
        setTimeout(() => {
          setFlippedCount((prev) => prev + 1);
          setIsAnimating(false);
        }, 550);
      } else {
        sheetEl.style.transform = 'rotateY(0deg)';
        setTimeout(() => {
          sheetEl.style.zIndex = `${(sheets.length - targetIndex) * 5}`;
          setIsAnimating(false);
        }, 550);
      }
    } else {
      const shouldFlip = isQuickClick || currentAngle > -135 || (deltaX > 30 && elapsed < 400);
      if (shouldFlip) {
        SFX.pageFlip();
        sheetEl.style.transform = 'rotateY(0deg)';
        setTimeout(() => {
          setFlippedCount((prev) => prev - 1);
          setIsAnimating(false);
        }, 550);
      } else {
        sheetEl.style.transform = 'rotateY(-180deg)';
        setTimeout(() => {
          sheetEl.style.zIndex = `${(targetIndex + 1) * 5}`;
          setIsAnimating(false);
        }, 550);
      }
    }
  };

  // ============================================================================
  // ORNAMENTAL ARTISAN DESIGN HELPERS
  // ============================================================================

  const CherryDivider = () => (
    <div className="flex items-center justify-center gap-2 my-1.5 opacity-75 select-none pointer-events-none">
      <div className="w-10 h-[0.75px] bg-gradient-to-r from-transparent via-[#c49f75] to-[#a37c56]" />
      <span className="text-[10px] text-[#cf768b] leading-none">🌸</span>
      <div className="w-10 h-[0.75px] bg-gradient-to-l from-transparent via-[#c49f75] to-[#a37c56]" />
    </div>
  );

  const CornerOrnament = ({ isLeft, isTop }: { isLeft: boolean; isTop: boolean }) => (
    <svg
      viewBox="0 0 24 24"
      className={`absolute w-3.5 h-3.5 pointer-events-none opacity-30 text-[#8f6d52] ${
        isLeft ? 'left-2.5' : 'right-2.5'
      } ${isTop ? 'top-2.5' : 'bottom-2.5'} ${
        !isLeft && !isTop
          ? 'rotate-180'
          : isLeft && !isTop
            ? '-rotate-90'
            : !isLeft && isTop
              ? 'rotate-90'
              : ''
      }`}
    >
      <path
        d="M2 2 H14 Q8 8 2 14 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.85"
      />
      <circle cx="5" cy="5" r="1" fill="currentColor" />
    </svg>
  );

  const renderParagraphWithDropCap = (para: string, isFirst: boolean) => {
    if (!isFirst || !para || para.length < 2) {
      return (
        <p className="book-sans text-[10.5px] sm:text-[11px] leading-[1.72] text-[#3c2a1f] text-justify font-normal tracking-normal select-none">
          {para}
        </p>
      );
    }
    const firstLetter = para.charAt(0);
    const rest = para.slice(1);
    return (
      <p className="book-sans text-[10.5px] sm:text-[11px] leading-[1.72] text-[#3c2a1f] text-justify font-normal tracking-normal select-none">
        <span className="book-serif float-left text-[24px] leading-[0.8] font-bold text-[#91323f] mr-1.5 pt-0.5 select-none drop-shadow-xs">
          {firstLetter}
        </span>
        {rest}
      </p>
    );
  };

  const renderPageContent = (page: BookPageSide, isLeft: boolean) => {
    const isCover = page.type === 'cover';
    const isBackCover = page.type === 'back-cover';

    // FRONT COVER (100% Solid Opaque Burgundy Leather)
    if (isCover) {
      return (
        <div className="w-full h-full p-6 flex flex-col justify-between items-center text-center select-none bg-[#240c0f] text-[#f7e8ce] rounded-r-md relative overflow-hidden border-r-2 border-y border-[#4d1f23]">
          <div className="absolute inset-2 border border-[#d4af37]/45 rounded-sm pointer-events-none" />
          <div className="absolute inset-3 border border-dashed border-[#d4af37]/25 rounded-sm pointer-events-none" />

          <div className="pt-3 z-10">
            <span className="text-2xl inline-block animate-pulse">🌸</span>
          </div>

          <div className="my-auto z-10 flex flex-col items-center max-w-[230px]">
            <h1 className="book-serif text-lg sm:text-xl font-semibold text-[#fedca2] tracking-wide drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]">
              {page.title}
            </h1>
            <p className="book-sans text-[10.5px] text-[#dfbe95] mt-1.5 italic">
              {page.subtitle}
            </p>

            <CherryDivider />

            {page.paragraphs?.map((p, idx) => (
              <p key={idx} className="book-sans text-[10px] text-[#f0e2cf] leading-relaxed mb-2 select-none">
                {p}
              </p>
            ))}

            {page.quote && (
              <p className="book-serif text-[9.5px] text-[#f8d4ad] italic mt-1 px-3 py-1.5 bg-black/30 rounded border border-[#d4af37]/25 leading-relaxed select-none">
                {page.quote}
              </p>
            )}
          </div>

          <div className="pb-2 z-10">
            <span className="book-sans text-[9px] text-[#dfbe95]/90 tracking-widest uppercase select-none">
              {page.signature || 'Gửi em 🕊️'}
            </span>
          </div>
        </div>
      );
    }

    // BACK COVER (100% Solid Opaque Burgundy Leather)
    if (isBackCover) {
      return (
        <div className="w-full h-full p-6 flex flex-col justify-between items-center text-center select-none bg-[#240c0f] text-[#f7e8ce] rounded-l-md relative overflow-hidden border-l-2 border-y border-[#4d1f23]">
          <div className="absolute inset-2 border border-[#d4af37]/45 rounded-sm pointer-events-none" />

          <div className="pt-3 z-10">
            <span className="text-2xl">🌸</span>
          </div>

          <div className="my-auto z-10 flex flex-col items-center max-w-[230px]">
            <h2 className="book-serif text-base sm:text-lg font-semibold text-[#fedca2]">
              {page.title}
            </h2>
            <p className="book-sans text-[10px] text-[#dfbe95] mt-1">
              {page.subtitle}
            </p>

            <CherryDivider />

            {page.paragraphs?.map((p, idx) => (
              <p key={idx} className="book-sans text-[10px] text-[#f0e2cf] leading-relaxed mb-1.5 select-none">
                {p}
              </p>
            ))}

            {page.quote && (
              <p className="book-serif text-[9.5px] text-[#f8d4ad] italic mt-2 px-2.5 select-none">
                {page.quote}
              </p>
            )}
          </div>

          <div className="pb-2 z-10">
            <span className="book-sans text-[9px] text-[#d4af37]/80 tracking-wider select-none">
              Met — A Tiny Love Story
            </span>
          </div>
        </div>
      );
    }

    // STORY & LETTER PAGES (100% Solid Opaque Warm Ivory Paper)
    // No transparent gradient, no specular shine, completely matte fine parchment
    return (
      <div
        className={`w-full h-full p-5 sm:p-6 flex flex-col justify-between select-none relative overflow-hidden bg-[#faf5eb] text-[#3b271d] ${
          isLeft ? 'rounded-l-xs border-r border-[#e8d5c0]' : 'rounded-r-xs border-l border-[#e8d5c0]'
        }`}
        style={{
          boxShadow: isLeft
            ? 'inset -14px 0 20px -10px rgba(50,22,8,0.1)'
            : 'inset 14px 0 20px -10px rgba(50,22,8,0.1)',
        }}
      >
        <CornerOrnament isLeft={isLeft} isTop={true} />
        <CornerOrnament isLeft={isLeft} isTop={false} />

        <div className="absolute inset-2 border border-[#ebd8c1]/60 rounded-xs pointer-events-none" />

        <div>
          <div className="text-center pt-1 pb-1">
            <h2 className="book-serif text-[13px] sm:text-[14px] font-semibold text-[#321d12] tracking-wide leading-snug select-none">
              {page.title}
            </h2>
            {page.subtitle && (
              <p className="book-sans text-[9.5px] text-[#825e47] italic mt-0.5 font-light select-none">
                {page.subtitle}
              </p>
            )}
            <CherryDivider />
          </div>

          <div className="space-y-2 mt-1">
            {page.paragraphs?.map((para, idx) => (
              <div key={idx}>
                {renderParagraphWithDropCap(para, idx === 0)}
              </div>
            ))}
          </div>

          {page.quote && (
            <div className="mt-3 px-3.5 py-2 bg-[#f4ece0] border-l-2 border-[#b57a54] rounded-r text-[9.5px] italic text-[#59331d] book-serif leading-relaxed select-none">
              {page.quote}
            </div>
          )}

          {page.signature && (
            <p className="book-serif text-[9.5px] text-[#78432a] italic text-right mt-2.5 mr-1 font-medium select-none">
              {page.signature}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-[#ebd8c1]/60 flex items-center justify-center text-[9px] book-sans text-[#997960] tracking-widest select-none">
          {page.pageNumber ? `— ❧ ${page.pageNumber} ❧ —` : ''}
        </div>
      </div>
    );
  };

  // Descriptive label for the current spread
  const getSpreadLabel = () => {
    if (flippedCount === 0) return 'Bìa Trước';
    if (flippedCount === 1) return 'Trang 1 — 2';
    if (flippedCount === 2) return 'Trang 3 — 4';
    if (flippedCount === 3) return 'Trang 5 — 6';
    return 'Bìa Sau';
  };

  const bookDOM = (
    <div
      className={`${
        isExpanded
          ? 'fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4'
          : 'absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[2px] select-none p-1.5'
      } transition-all duration-300`}
    >
      {/* Top Floating Control Buttons */}
      <div className="absolute top-2 right-2.5 z-60 flex items-center gap-1.5">
        <button
          onClick={() => {
            SFX.click();
            setIsExpanded((prev) => !prev);
          }}
          className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/90 text-amber-200/80 hover:text-white flex items-center justify-center text-xs transition border border-white/15 cursor-pointer shadow-md backdrop-blur-xs"
          title={isExpanded ? 'Thu nhỏ lại [Esc]' : 'Mở rộng toàn màn hình'}
        >
          {isExpanded ? '⊡' : '⛶'}
        </button>

        <button
          onClick={() => {
            SFX.click();
            onClose();
          }}
          className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/90 text-rose-200/80 hover:text-white flex items-center justify-center text-xs transition border border-white/15 cursor-pointer shadow-md backdrop-blur-xs"
          title="Đóng sách [Esc]"
        >
          ✕
        </button>
      </div>

      {/* Book Outer Container */}
      <div className="relative flex flex-col items-center justify-center select-none">
        {/* Left Floating Turn Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            SFX.click();
            flipBackward();
          }}
          disabled={flippedCount <= 0 || isAnimating}
          className={`absolute -left-8 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all border border-white/20 z-50 ${
            flippedCount <= 0
              ? 'opacity-0 pointer-events-none'
              : 'bg-black/60 hover:bg-black/90 text-amber-200 cursor-pointer shadow-lg hover:scale-110 active:scale-95'
          }`}
          title="Trang trước [←]"
        >
          ❮
        </button>

        {/* Right Floating Turn Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            SFX.click();
            flipForward();
          }}
          disabled={flippedCount >= sheets.length || isAnimating}
          className={`absolute -right-8 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all border border-white/20 z-50 ${
            flippedCount >= sheets.length
              ? 'opacity-0 pointer-events-none'
              : 'bg-black/60 hover:bg-black/90 text-amber-200 cursor-pointer shadow-lg hover:scale-110 active:scale-95'
          }`}
          title="Trang sau [→]"
        >
          ❯
        </button>

        <div
          ref={bookContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative transition-all duration-300 select-none cursor-grab active:cursor-grabbing"
          style={{
            width: `${pageWidth * 2}px`,
            height: `${pageHeight}px`,
            perspective: '1800px',
            touchAction: 'none',
          }}
        >
          {/* Deep Ambient Drop Shadow Behind Book */}
          <div className="absolute -inset-2 bg-black/60 rounded-2xl blur-lg -z-20 transform translate-y-3 pointer-events-none" />

          {/* Hardcover Leather Casing Backing */}
          <div className="absolute inset-0 rounded-xl bg-[#230c0e] border-2 border-[#45191d] -z-10 shadow-[0_16px_40px_rgba(0,0,0,0.85)] overflow-hidden flex">
            {/* Inside Front Cover (shown on left when cover is closed) */}
            <div className="w-1/2 h-full p-6 flex flex-col justify-between items-center text-center select-none bg-[#230c0e] text-[#f7e8ce] relative border-r border-[#3a1417]">
              <div className="absolute inset-3 border border-[#d4af37]/20 rounded-sm pointer-events-none" />
              <div className="pt-2 text-xl opacity-60">🌸</div>
              <div className="my-auto">
                <h3 className="book-serif text-sm font-semibold text-[#fedca2]/90 tracking-wider">
                  Met — A Tiny Love Story
                </h3>
                <p className="book-sans text-[9px] text-[#dfbe95]/70 italic mt-1">
                  Món quà kỷ niệm cho người thương
                </p>
                <div className="w-8 h-[0.5px] bg-[#d4af37]/30 mx-auto my-2" />
                <p className="book-sans text-[8.5px] text-[#dfbe95]/50">
                  Nhấp hoặc kéo trang để lật mở ❯
                </p>
              </div>
              <div className="pb-1 text-[8.5px] book-sans text-[#d4af37]/40 tracking-widest">
                — KỶ NIỆM 2026 —
              </div>
            </div>

            {/* Inside Back Cover (shown on right when book is finished) */}
            <div className="w-1/2 h-full p-6 flex flex-col justify-between items-center text-center select-none bg-[#230c0e] text-[#f7e8ce] relative border-l border-[#3a1417]">
              <div className="absolute inset-3 border border-[#d4af37]/20 rounded-sm pointer-events-none" />
              <div className="pt-2 text-xl opacity-60">🕊️</div>
              <div className="my-auto">
                <h3 className="book-serif text-sm font-semibold text-[#fedca2]/90 tracking-wider">
                  Forever & Always
                </h3>
                <p className="book-sans text-[9px] text-[#dfbe95]/70 italic mt-1">
                  Hành trình yêu thương vẫn còn tiếp diễn
                </p>
                <div className="w-8 h-[0.5px] bg-[#d4af37]/30 mx-auto my-2" />
                <p className="book-sans text-[8.5px] text-[#dfbe95]/50">
                  ❮ Nhấp hoặc kéo để lật lại
                </p>
              </div>
              <div className="pb-1 text-[8.5px] book-sans text-[#d4af37]/40 tracking-widest">
                — THE END —
              </div>
            </div>
          </div>

          {/* Satin Bookmark Ribbon */}
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-14 pointer-events-none z-45"
            style={{
              background: 'linear-gradient(to bottom, #8a2434 0%, #b8384e 65%, #8a2434 100%)',
              boxShadow: '0 3px 6px rgba(0,0,0,0.4)',
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 84%, 0% 100%)',
            }}
          />

          {/* Center Spine Crease */}
          <div
            className="absolute top-0 bottom-0 left-1/2 w-8 -translate-x-1/2 z-40 pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, transparent 0%, rgba(45,18,8,0.08) 30%, rgba(20,6,3,0.3) 50%, rgba(45,18,8,0.08) 70%, transparent 100%)',
            }}
          />
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 z-40 pointer-events-none bg-black/40" />

          {/* Interactive Dual-Sided 3D Sheets */}
          {sheets.map((sheet, idx) => {
            return (
              <div
                key={sheet.id}
                ref={(el) => {
                  sheetRefs.current[idx] = el;
                }}
                className="absolute top-0 right-0 w-1/2 h-full select-none"
                style={{
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              >
                {/* Front Face (Faces user when unflipped at 0deg on the right side) */}
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden select-none"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                    backgroundColor: sheet.front.type === 'cover' ? '#240c0f' : '#faf5eb',
                  }}
                >
                  {renderPageContent(sheet.front, false)}
                </div>

                {/* Back Face (Faces user when flipped at -180deg on the left side) */}
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden select-none"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    backgroundColor: sheet.back.type === 'back-cover' ? '#240c0f' : '#faf5eb',
                  }}
                >
                  {renderPageContent(sheet.back, true)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation Controls & Spread Indicator */}
        <div className="mt-2.5 flex items-center justify-between w-full max-w-[320px] px-2 text-xs text-amber-100/80 select-none">
          <button
            onClick={() => {
              SFX.click();
              flipBackward();
            }}
            disabled={flippedCount <= 0 || isAnimating}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] transition border border-white/10 ${
              flippedCount <= 0
                ? 'opacity-30 cursor-not-allowed bg-black/20'
                : 'hover:bg-black/60 bg-black/40 text-amber-200 cursor-pointer shadow-xs'
            }`}
            title="Trang trước [←]"
          >
            <span>❮</span>
            <span>Trước</span>
          </button>

          <div className="flex flex-col items-center">
            <span className="book-sans font-medium text-[10.5px] text-amber-200/90 tracking-wide">
              {getSpreadLabel()}
            </span>
            <div className="flex gap-1 mt-0.5">
              {Array.from({ length: sheets.length + 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === flippedCount
                      ? 'bg-amber-300 scale-125 shadow-[0_0_4px_rgba(251,191,36,0.8)]'
                      : 'bg-white/25'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              SFX.click();
              flipForward();
            }}
            disabled={flippedCount >= sheets.length || isAnimating}
            className={`px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] transition border border-white/10 ${
              flippedCount >= sheets.length
                ? 'opacity-30 cursor-not-allowed bg-black/20'
                : 'hover:bg-black/60 bg-black/40 text-amber-200 cursor-pointer shadow-xs'
            }`}
            title="Trang sau [→]"
          >
            <span>Sau</span>
            <span>❯</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (isExpanded && isMounted && typeof document !== 'undefined') {
    return createPortal(bookDOM, document.body);
  }

  return bookDOM;
}
