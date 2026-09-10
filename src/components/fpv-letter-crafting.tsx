'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { SFX } from '@/lib/sound';

interface FpvLetterCraftingProps {
  onComplete: () => void;
}

interface PiecePos {
  x: number;
  y: number;
  rot: number;
}

export default function FpvLetterCrafting({ onComplete }: FpvLetterCraftingProps) {
  // Piece dimensions (in pixels, derived from authentic message.png ratio: 101x233, 133x233, 113x233 scaled by 0.75)
  const PIECE_W = [76, 100, 85];
  const PIECE_H = 175;
  const OVERLAP = 6;

  // Initial scattered / messy positions across the wooden desk
  const [positions, setPositions] = useState<PiecePos[]>([
    { x: 30, y: 40, rot: -8 },
    { x: 185, y: 55, rot: 6 },
    { x: 335, y: 35, rot: -5 },
  ]);

  // Snapping state
  const [isPair01Snapped, setIsPair01Snapped] = useState(false);
  const [isPair12Snapped, setIsPair12Snapped] = useState(false);
  const [isFullyAssembled, setIsFullyAssembled] = useState(false);

  // Glue / Washi tape state
  const [gluedSeams, setGluedSeams] = useState<boolean[]>([false, false]); // seam 0: between I & LOVE, seam 1: between LOVE & U
  const [isTaped, setIsTaped] = useState(false);

  const [activeMessage, setActiveMessage] = useState<string>(
    'Các mảnh thư đang nằm lộn xộn trên bàn... Hãy kéo và sắp xếp 3 mảnh lại theo thứ tự: "I" ➔ "LOVE" ➔ "U".'
  );

  // Dragging state
  const [draggingItem, setDraggingItem] = useState<
    { type: 'piece'; pieceIndex: number } | { type: 'glue' } | null
  >(null);
  const [dragPointerStart, setDragPointerStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragPieceStartPositions, setDragPieceStartPositions] = useState<PiecePos[]>([]);
  const [gluePos, setGluePos] = useState<{ x: number; y: number }>({ x: 440, y: 110 });

  const deskRef = useRef<HTMLDivElement>(null);
  const seam0Ref = useRef<HTMLDivElement>(null);
  const seam1Ref = useRef<HTMLDivElement>(null);

  const fragmentDetails = [
    {
      id: 0,
      title: 'Mảnh #1: "I"',
      text: '“Khoảnh khắc cậu quay đầu lại cười, thế giới của mình tự nhiên có màu...”',
    },
    {
      id: 1,
      title: 'Mảnh #2: "LOVE"',
      text: '“Những đêm cậu mệt mỏi, mình chỉ ước có thể mang cho cậu một ly trà ấm...”',
    },
    {
      id: 2,
      title: 'Mảnh #3: "U ♥"',
      text: '“Dù câu trả lời có là gì, cảm ơn cậu vì đã xuất hiện trong thanh xuân của mình...”',
    },
  ];

  // Helper: check snapping between fragments
  const checkSnapping = useCallback(
    (newPositions: PiecePos[]) => {
      let p0 = { ...newPositions[0] };
      let p1 = { ...newPositions[1] };
      let p2 = { ...newPositions[2] };

      let snapped01 = isPair01Snapped;
      let snapped12 = isPair12Snapped;

      // Check Pair 0 & 1 ("I" and "LOVE")
      if (!snapped01) {
        // Target: p1.x should be near p0.x + PIECE_W[0] - OVERLAP, and p1.y near p0.y
        const idealP1X = p0.x + PIECE_W[0] - OVERLAP;
        const dx01 = Math.abs(p1.x - idealP1X);
        const dy01 = Math.abs(p1.y - p0.y);

        if (dx01 < 45 && dy01 < 45) {
          snapped01 = true;
          setIsPair01Snapped(true);
          p1.x = idealP1X;
          p1.y = p0.y;
          p0.rot = 0;
          p1.rot = 0;
          SFX.paperPickup();
          setActiveMessage('Đã ghép được "I" và "LOVE"! Hãy kéo mảnh "U ♥" lại gần bên phải.');
        }
      }

      // Check Pair 1 & 2 ("LOVE" and "U")
      if (!snapped12) {
        const idealP2X = p1.x + PIECE_W[1] - OVERLAP;
        const dx12 = Math.abs(p2.x - idealP2X);
        const dy12 = Math.abs(p2.y - p1.y);

        if (dx12 < 45 && dy12 < 45) {
          snapped12 = true;
          setIsPair12Snapped(true);
          p2.x = idealP2X;
          p2.y = p1.y;
          p1.rot = 0;
          p2.rot = 0;
          SFX.paperPickup();
          setActiveMessage('Đã ghép được "LOVE" và "U ♥"! Hãy ghép nốt mảnh còn lại.');
        }
      }

      // Check if all 3 are assembled together
      if (snapped01 && snapped12 && !isFullyAssembled) {
        setIsFullyAssembled(true);
        // Center the 3 pieces nicely in the middle of the desk
        const deskW = deskRef.current ? deskRef.current.clientWidth : 480;
        const deskH = deskRef.current ? deskRef.current.clientHeight : 260;
        const totalAssembledW = PIECE_W[0] + PIECE_W[1] + PIECE_W[2] - 2 * OVERLAP;
        const centerX = Math.max(15, Math.round((deskW - totalAssembledW) / 2));
        const centerY = Math.max(15, Math.round((deskH - PIECE_H) / 2));

        p0 = { x: centerX, y: centerY, rot: 0 };
        p1 = { x: centerX + PIECE_W[0] - OVERLAP, y: centerY, rot: 0 };
        p2 = { x: centerX + PIECE_W[0] + PIECE_W[1] - 2 * OVERLAP, y: centerY, rot: 0 };

        setTimeout(() => {
          SFX.harpChime();
          setActiveMessage('♥ Đã xếp hoàn chỉnh "I LOVE U"! Hãy kéo chai keo dán qua 2 đường nối để dán kín bức thư.');
        }, 300);
      }

      return [p0, p1, p2];
    },
    [isPair01Snapped, isPair12Snapped, isFullyAssembled, PIECE_W]
  );

  // Start dragging a paper piece
  const handlePointerDownPiece = (e: React.PointerEvent, pieceIdx: number) => {
    if (isTaped) return;
    e.preventDefault();
    e.stopPropagation();

    setDraggingItem({ type: 'piece', pieceIndex: pieceIdx });
    setDragPointerStart({ x: e.clientX, y: e.clientY });
    setDragPieceStartPositions([...positions]);

    setActiveMessage(fragmentDetails[pieceIdx].text);
  };

  // Start dragging glue bottle
  const handlePointerDownGlue = (e: React.PointerEvent) => {
    if (!isFullyAssembled || isTaped) return;
    e.preventDefault();
    e.stopPropagation();

    setDraggingItem({ type: 'glue' });
    setDragPointerStart({ x: e.clientX, y: e.clientY });
  };

  // Check seam collision while dragging glue
  const checkGlueOverSeams = useCallback(
    (clientX: number, clientY: number) => {
      [seam0Ref, seam1Ref].forEach((ref, seamIdx) => {
        if (!gluedSeams[seamIdx] && ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (
            clientX >= rect.left - 26 &&
            clientX <= rect.right + 26 &&
            clientY >= rect.top - 20 &&
            clientY <= rect.bottom + 20
          ) {
            SFX.tapeStick();
            setGluedSeams((prev) => {
              const next = [...prev];
              next[seamIdx] = true;
              if (next.every(Boolean)) {
                setTimeout(() => {
                  SFX.harpChime();
                  setIsTaped(true);
                  setActiveMessage('♥ Bức thư tỏ tình đã được dán kín và hàn gắn lại trọn vẹn! Nhấn [Tiếp tục ➔] để bước tới đỉnh đồi gặp bạn ấy.');
                }, 250);
              } else {
                setActiveMessage('Đã dán xong 1 đường nối! Hãy kéo keo qua đường nối còn lại.');
              }
              return next;
            });
          }
        }
      });
    },
    [gluedSeams]
  );

  // Global Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingItem) return;

    const dx = e.clientX - dragPointerStart.x;
    const dy = e.clientY - dragPointerStart.y;

    if (draggingItem.type === 'piece') {
      const idx = draggingItem.pieceIndex;
      const deskW = deskRef.current ? deskRef.current.clientWidth : 520;
      const deskH = deskRef.current ? deskRef.current.clientHeight : 270;

      const next = dragPieceStartPositions.map((p, i) => {
        // If pieces are already snapped together, they move as a connected block!
        let shouldMove = i === idx;
        if (isFullyAssembled) {
          shouldMove = true;
        } else if (isPair01Snapped && (idx === 0 || idx === 1) && (i === 0 || i === 1)) {
          shouldMove = true;
        } else if (isPair12Snapped && (idx === 1 || idx === 2) && (i === 1 || i === 2)) {
          shouldMove = true;
        }

        if (shouldMove) {
          const clampX = Math.max(5, Math.min(deskW - PIECE_W[i] - 5, p.x + dx));
          const clampY = Math.max(5, Math.min(deskH - PIECE_H - 5, p.y + dy));
          return { ...p, x: clampX, y: clampY };
        }
        return p;
      });

      setPositions(next);
    } else if (draggingItem.type === 'glue') {
      if (deskRef.current) {
        const dRect = deskRef.current.getBoundingClientRect();
        const curX = Math.max(10, Math.min(dRect.width - 40, e.clientX - dRect.left - 20));
        const curY = Math.max(10, Math.min(dRect.height - 50, e.clientY - dRect.top - 25));
        setGluePos({ x: curX, y: curY });
      }
      checkGlueOverSeams(e.clientX, e.clientY);
    }
  };

  // Global Pointer Up
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingItem) return;

    if (draggingItem.type === 'piece') {
      // Check snapping on drop
      setPositions((currentPositions) => checkSnapping(currentPositions));
    } else if (draggingItem.type === 'glue') {
      checkGlueOverSeams(e.clientX, e.clientY);
    }

    setDraggingItem(null);
  };

  // Click shortcut for sealing a seam
  const handleQuickGlueSeam = (seamIdx: number) => {
    if (!isFullyAssembled || isTaped || gluedSeams[seamIdx]) return;
    SFX.tapeStick();
    setGluedSeams((prev) => {
      const next = [...prev];
      next[seamIdx] = true;
      if (next.every(Boolean)) {
        setTimeout(() => {
          SFX.harpChime();
          setIsTaped(true);
          setActiveMessage('♥ Bức thư tỏ tình đã được dán kín và hàn gắn lại trọn vẹn! Nhấn phím mũi tên phải [➔] để bước tới đỉnh đồi gặp bạn ấy.');
        }, 250);
      } else {
        setActiveMessage('Đã dán xong 1 đường nối! Hãy dán tiếp đường nối còn lại.');
      }
      return next;
    });
  };

  // Keyboard shortcut: ArrowRight, Space, or Enter to complete when ready
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowRight' || e.code === 'ArrowRight' || e.code === 'Space' || e.code === 'Enter') && isTaped) {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaped, onComplete]);

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="absolute inset-0 z-50 flex flex-col justify-between overflow-hidden bg-black select-none animate-fade-in cursor-default"
    >
      {/* Cinematic Top Letterbox */}
      <div className="h-4 bg-black w-full flex-shrink-0 z-30" />

      {/* Main Pixel Art Crafting Desk */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Authentic 16-bit Pixel Art Desk Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full max-w-[640px] max-h-[400px]">
            <Image
              src="/assets/others/crafting-table-pixel-bg.jpg"
              alt="Pixel Art Crafting Desk"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Ambient cherry blossom petals drifting across the desk */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <div className="absolute top-6 left-1/4 w-2 h-2 bg-pink-300/70 rounded-full" />
          <div className="absolute top-16 right-1/3 w-3 h-2 bg-pink-200/60 rounded-full" />
          <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-pink-400/50 rounded-full" />
        </div>

        {/* ========================================================================= */}
        {/* OPEN WOODEN WORKSPACE: NO RIGID SLOTS, FREELY MOVE PIECES                 */}
        {/* ========================================================================= */}
        <div
          ref={deskRef}
          className="relative z-20 w-[94%] max-w-[530px] h-[260px] rounded-lg shadow-2xl transition-all"
          style={{
            backgroundColor: 'rgba(45, 26, 14, 0.45)',
            border: isTaped
              ? '2px solid rgba(244, 114, 182, 0.8)'
              : '2px solid rgba(217, 119, 6, 0.35)',
            boxShadow: isTaped
              ? '0 0 25px rgba(244, 114, 182, 0.6), inset 0 0 15px rgba(254, 240, 138, 0.4)'
              : 'inset 0 2px 12px rgba(0,0,0,0.6)',
          }}
        >
          {/* Subtle guide watermark in background */}
          {!isFullyAssembled && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-25">
              <span
                className="text-amber-200 font-bold tracking-widest text-2xl"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                I LOVE U
              </span>
              <span
                className="text-amber-100 text-xs mt-1"
                style={{ fontFamily: "'VT323', monospace", fontSize: '15px' }}
              >
                Kéo 3 mảnh lại gần nhau theo thứ tự để ghép lại
              </span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3 SCATTERED, DRAGGABLE PAPER PIECES                                      */}
          {/* ========================================================================= */}

          {/* Piece 0: "I" */}
          <div
            onPointerDown={(e) => handlePointerDownPiece(e, 0)}
            className={`absolute transition-all duration-150 select-none ${
              isTaped
                ? 'cursor-default z-20'
                : 'cursor-grab active:cursor-grabbing hover:scale-105 z-22'
            }`}
            style={{
              left: `${positions[0].x}px`,
              top: `${positions[0].y}px`,
              width: `${PIECE_W[0]}px`,
              height: `${PIECE_H}px`,
              transform: `rotate(${positions[0].rot}deg)`,
              filter:
                draggingItem?.type === 'piece' && draggingItem.pieceIndex === 0
                  ? 'drop-shadow(0 14px 24px rgba(0,0,0,0.8)) drop-shadow(0 0 10px rgba(251, 191, 36, 0.7))'
                  : 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
            }}
          >
            <Image
              src="/assets/others/message-piece-0.png"
              alt='Mảnh thư: "I"'
              fill
              sizes={`${PIECE_W[0]}px`}
              className="object-contain pointer-events-none"
              style={{ imageRendering: 'pixelated' }}
              unoptimized
              priority
            />
          </div>

          {/* Seam 0 between "I" & "LOVE" (active when fully assembled) */}
          {isFullyAssembled && (
            <div
              ref={seam0Ref}
              onClick={() => handleQuickGlueSeam(0)}
              className={`absolute z-35 flex items-center justify-center ${
                !gluedSeams[0] ? 'cursor-pointer' : 'pointer-events-none'
              }`}
              style={{
                left: `${positions[0].x + PIECE_W[0] - OVERLAP - 12}px`,
                top: `${positions[0].y - 4}px`,
                width: '24px',
                height: `${PIECE_H + 8}px`,
              }}
              title="Dán vết nối 1"
            >
              {gluedSeams[0] ? (
                <div
                  className="w-5 h-full transition-all duration-300 flex items-center justify-center rounded-xs shadow-md"
                  style={{
                    transform: 'rotate(-2deg)',
                    background:
                      'repeating-linear-gradient(45deg, #fbcfe8, #fbcfe8 6px, #f472b6 6px, #f472b6 12px)',
                    border: '1px solid #db2777',
                    opacity: 0.95,
                  }}
                >
                  <span className="text-[9px] select-none text-pink-950">🌸</span>
                </div>
              ) : (
                <div className="w-0.5 h-full border-r-2 border-dashed border-pink-400/90 animate-pulse" />
              )}
            </div>
          )}

          {/* Piece 1: "LOVE" */}
          <div
            onPointerDown={(e) => handlePointerDownPiece(e, 1)}
            className={`absolute transition-all duration-150 select-none ${
              isTaped
                ? 'cursor-default z-20'
                : 'cursor-grab active:cursor-grabbing hover:scale-105 z-21'
            }`}
            style={{
              left: `${positions[1].x}px`,
              top: `${positions[1].y}px`,
              width: `${PIECE_W[1]}px`,
              height: `${PIECE_H}px`,
              transform: `rotate(${positions[1].rot}deg)`,
              filter:
                draggingItem?.type === 'piece' && draggingItem.pieceIndex === 1
                  ? 'drop-shadow(0 14px 24px rgba(0,0,0,0.8)) drop-shadow(0 0 10px rgba(251, 191, 36, 0.7))'
                  : 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
            }}
          >
            <Image
              src="/assets/others/message-piece-1.png"
              alt='Mảnh thư: "LOVE"'
              fill
              sizes={`${PIECE_W[1]}px`}
              className="object-contain pointer-events-none"
              style={{ imageRendering: 'pixelated' }}
              unoptimized
              priority
            />
          </div>

          {/* Seam 1 between "LOVE" & "U" (active when fully assembled) */}
          {isFullyAssembled && (
            <div
              ref={seam1Ref}
              onClick={() => handleQuickGlueSeam(1)}
              className={`absolute z-35 flex items-center justify-center ${
                !gluedSeams[1] ? 'cursor-pointer' : 'pointer-events-none'
              }`}
              style={{
                left: `${positions[1].x + PIECE_W[1] - OVERLAP - 12}px`,
                top: `${positions[1].y - 4}px`,
                width: '24px',
                height: `${PIECE_H + 8}px`,
              }}
              title="Dán vết nối 2"
            >
              {gluedSeams[1] ? (
                <div
                  className="w-5 h-full transition-all duration-300 flex items-center justify-center rounded-xs shadow-md"
                  style={{
                    transform: 'rotate(2deg)',
                    background:
                      'repeating-linear-gradient(-45deg, #fbcfe8, #fbcfe8 6px, #f472b6 6px, #f472b6 12px)',
                    border: '1px solid #db2777',
                    opacity: 0.95,
                  }}
                >
                  <span className="text-[9px] select-none text-pink-950">🌸</span>
                </div>
              ) : (
                <div className="w-0.5 h-full border-r-2 border-dashed border-pink-400/90 animate-pulse" />
              )}
            </div>
          )}

          {/* Piece 2: "U ♥" */}
          <div
            onPointerDown={(e) => handlePointerDownPiece(e, 2)}
            className={`absolute transition-all duration-150 select-none ${
              isTaped
                ? 'cursor-default z-20'
                : 'cursor-grab active:cursor-grabbing hover:scale-105 z-20'
            }`}
            style={{
              left: `${positions[2].x}px`,
              top: `${positions[2].y}px`,
              width: `${PIECE_W[2]}px`,
              height: `${PIECE_H}px`,
              transform: `rotate(${positions[2].rot}deg)`,
              filter:
                draggingItem?.type === 'piece' && draggingItem.pieceIndex === 2
                  ? 'drop-shadow(0 14px 24px rgba(0,0,0,0.8)) drop-shadow(0 0 10px rgba(251, 191, 36, 0.7))'
                  : 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
            }}
          >
            <Image
              src="/assets/others/message-piece-2.png"
              alt='Mảnh thư: "U ♥"'
              fill
              sizes={`${PIECE_W[2]}px`}
              className="object-contain pointer-events-none"
              style={{ imageRendering: 'pixelated' }}
              unoptimized
              priority
            />
          </div>

          {/* ========================================================================= */}
          {/* GLUE BOTTLE TOOL ON THE DESK                                              */}
          {/* ========================================================================= */}
          {isFullyAssembled && !isTaped && (
            <div
              onPointerDown={handlePointerDownGlue}
              className="absolute z-40 flex flex-col items-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform select-none"
              style={{
                left: `${gluePos.x}px`,
                top: `${gluePos.y}px`,
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.7))',
              }}
              title="Kéo chai keo qua 2 đường nối để dán kín"
            >
              {/* Cute Pixel Art Glue Bottle */}
              <div className="w-3.5 h-2.5 bg-rose-600 border border-black rounded-t" />
              <div className="w-2.5 h-2 bg-amber-100 border-x border-black" />
              <div className="w-8 h-11 bg-amber-50 border-2 border-stone-800 rounded-b shadow-md flex flex-col items-center justify-center p-0.5">
                <span className="text-[7px] font-black text-rose-800 leading-none">KEO</span>
                <span className="text-[6px] text-amber-900 font-mono mt-0.5">DÁN</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cinematic Bottom Letterbox & Dialogue Bar */}
      <div className="h-4 bg-black w-full flex-shrink-0 z-30" />

      {/* Bottom Subtitle / Instruction Dialog */}
      <div className="absolute bottom-2.5 left-0 right-0 mx-auto w-[94%] max-w-[560px] z-40">
        <div
          className="relative rounded-xl px-4 py-2 shadow-2xl backdrop-blur-md transition-all flex items-center justify-between gap-3"
          style={{
            backgroundColor: 'rgba(10, 15, 29, 0.94)',
            border: '1px solid rgba(244, 114, 182, 0.4)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(244, 63, 94, 0.2)',
          }}
        >
          <p
            className="leading-snug min-h-[34px] flex items-center"
            style={{
              color: '#f8fafc',
              fontFamily: "'VT323', monospace",
              fontSize: '18px',
              letterSpacing: '0.03em',
              textShadow: '0 1px 2px rgba(0,0,0,0.9)',
            }}
          >
            {activeMessage}
          </p>

          {isTaped && (
            <button
              onClick={onComplete}
              className="shrink-0 px-3 py-1 rounded bg-rose-900 hover:bg-rose-800 border border-rose-400 text-rose-100 text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
              style={{ fontFamily: "'VT323', monospace", fontSize: '15px' }}
            >
              <span>Tiếp tục</span>
              <span className="text-amber-300 font-bold">➔ [Mũi tên phải]</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
