'use client';

import { useState } from 'react';
import Image from 'next/image';
import woodenSwingSprite from '../../public/assets/others/wooden-swing-v2-pixel.png';
import { LEVEL, HILL_LEVEL } from '@/lib/level-data';
import { getHillGroundY } from '@/lib/physics';

interface PropsLayerProps {
  cameraX: number;
  heroX: number;
  onPetCat: () => void;
  catPetted?: boolean;
  lampOn?: boolean;
  onToggleLamp?: () => void;
  isSitting?: boolean;
  onToggleSit?: () => void;
  isSwinging?: boolean;
  onToggleSwing?: () => void;
  swingAngle?: number;
  hasLostLetter?: boolean;
  isChasingLetter?: boolean;
  onOpenMailbox?: () => void;
  hasOpenedMailbox?: boolean;
  onSitReminder?: () => void;
  isHillMap?: boolean;
}

export default function PropsLayer({
  cameraX,
  heroX,
  onPetCat,
  catPetted = false,
  lampOn = false,
  isSitting = false,
  onToggleSit,
  isSwinging = false,
  swingAngle = 0,
  hasLostLetter = false,
  isChasingLetter = false,
  onOpenMailbox,
  hasOpenedMailbox = false,
  onSitReminder,
  isHillMap = false,
}: PropsLayerProps) {
  const [catHover, setCatHover] = useState(false);
  const [mailboxHover, setMailboxHover] = useState(false);

  // Map 2: Cherry Blossom Garden mode (arduous mountain trail with 28 layered blooming sakura trees across 2200px)
  if (isHillMap) {
    // Array of background distant sakura trees (depth layer, softer opacity) across 2200px
    const bgTrees = [
      { x: 80, size: 96, flip: true, opacity: 0.78 },
      { x: 240, size: 100, flip: false, opacity: 0.80 },
      { x: 420, size: 104, flip: true, opacity: 0.82 },
      { x: 600, size: 110, flip: false, opacity: 0.84 },
      { x: 780, size: 115, flip: true, opacity: 0.85 },
      { x: 960, size: 118, flip: false, opacity: 0.82 },
      { x: 1140, size: 105, flip: true, opacity: 0.78 },
      { x: 1320, size: 112, flip: false, opacity: 0.82 },
      { x: 1500, size: 116, flip: true, opacity: 0.84 },
      { x: 1680, size: 120, flip: false, opacity: 0.85 },
      { x: 1840, size: 115, flip: true, opacity: 0.82 },
      { x: 2020, size: 108, flip: false, opacity: 0.78 },
      { x: 2160, size: 104, flip: true, opacity: 0.75 },
    ];

    // Array of main / foreground vibrant sakura trees along the 2200px walking trail
    const fgTrees = [
      { x: 20, size: 120, flip: false },
      { x: 180, size: 120, flip: true },
      { x: 340, size: 125, flip: false },
      { x: 520, size: 130, flip: true },
      { x: 700, size: 135, flip: false },
      { x: 860, size: 125, flip: true },
      { x: 1040, size: 130, flip: false },
      { x: 1220, size: 135, flip: true },
      { x: 1400, size: 130, flip: false },
      { x: 1580, size: 135, flip: true },
      { x: 1760, size: 130, flip: false },
      { x: 1900, size: 125, flip: true },
      { x: 2100, size: 120, flip: false },
    ];

    return (
      <div className="absolute inset-0 z-10 pointer-events-none select-none">
        {/* Layer 1: Background Sakura Trees (Depth of garden, grounded to undulating hill) */}
        {bgTrees.map((tree, i) => {
          const groundY = getHillGroundY(tree.x);
          return (
            <div
              key={`bg-tree-${i}`}
              className="absolute transition-transform"
              style={{
                left: `${tree.x - cameraX}px`,
                top: `${groundY - tree.size + 4}px`,
                width: `${tree.size}px`,
                height: `${tree.size}px`,
                opacity: tree.opacity,
                transform: tree.flip ? 'scaleX(-1)' : 'none',
                filter: 'blur(0.4px)',
              }}
            >
              <Image
                src="/assets/others/cherry-tree-small-pixel.png"
                width={tree.size}
                height={tree.size}
                alt="Distant Cherry Tree"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          );
        })}

        {/* Layer 2: Scenic Mountain Trail Resting Bench (x = 940, halfway along the arduous path) */}
        <div
          className="absolute"
          style={{
            left: `${940 - cameraX}px`,
            top: `${getHillGroundY(940) - 26}px`,
            width: '48px',
            height: '32px',
          }}
        >
          <Image
            src="/assets/others/park-bench-empty.png"
            width={48}
            height={32}
            alt="Mountain Bench"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Layer 3: Main Foreground Sakura Trees along the walking trail */}
        {fgTrees.map((tree, i) => {
          const groundY = getHillGroundY(tree.x);
          return (
            <div
              key={`fg-tree-${i}`}
              className="absolute"
              style={{
                left: `${tree.x - cameraX}px`,
                top: `${groundY - tree.size + 14}px`,
                width: `${tree.size}px`,
                height: `${tree.size}px`,
                transform: tree.flip ? 'scaleX(-1)' : 'none',
              }}
            >
              <Image
                src="/assets/others/cherry-tree-small-pixel.png"
                width={tree.size}
                height={tree.size}
                alt="Garden Cherry Tree"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          );
        })}

        {/* Layer 4: The Grand Master Sakura Tree at the Summit (x = 1940, y = 73) */}
        <div
          className="absolute"
          style={{
            left: `${1940 - cameraX}px`,
            top: '73px',
            width: '192px',
            height: '192px',
          }}
        >
          <Image
            src="/assets/others/cherry-tree-grand-pixel.png"
            width={192}
            height={192}
            alt="Grand Master Cherry Blossom Tree"
            style={{ imageRendering: 'pixelated' }}
            priority
          />
          {/* Radiant cherry blossom aura */}
          <div
            className="absolute inset-0 pointer-events-none -z-10 rounded-full opacity-45 blur-xl"
            style={{
              background:
                'radial-gradient(circle, rgba(244, 114, 182, 0.7) 0%, rgba(251, 113, 133, 0.3) 50%, transparent 75%)',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">
      {/* 1. Grounded Wooden A-Frame Swing (x = 680) */}
      <div
        className="absolute"
        style={{
          left: `${LEVEL.props.swing.x - 44 - cameraX}px`,
          top: '218px',
          width: '88px',
          height: '104px',
        }}
      >
        {/* A. Grounded Pixel Wooden A-Frame Stand (Firmly planted in soil at y=322) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Ground contact shadow beneath the timber legs */}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-3 rounded-full pointer-events-none opacity-70"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.9) 0%, rgba(30,15,8,0.5) 60%, transparent 80%)',
            }}
          />
          <Image
            src={woodenSwingSprite}
            alt="Pixel Wooden Swing Frame"
            style={{
              imageRendering: 'pixelated',
            }}
            priority
          />
        </div>

        {/* B. Unified Swinging Assembly (Ropes + Seat + Seated Boy) */}
        <div
          className="absolute pointer-events-none select-none flex items-start justify-center"
          style={{
            left: '44px',
            top: '21px',
            width: '0px',
            height: '72px',
            transformOrigin: 'top center',
            transform: `rotate(${swingAngle}deg)`,
            transition: isSwinging ? 'none' : 'transform 0.35s ease-out',
          }}
        >
          {/* Hanging Ropes & Wooden Plank Seat */}
          <div className="relative w-0 h-full flex justify-center">
            {/* Left rope (aligned with eye-bolt at x=37, which is -7px from center 44) */}
            <div
              className="absolute top-0 -left-[8px] w-[2px] h-[68px]"
              style={{
                background: 'repeating-linear-gradient(180deg, #49281a 0px, #49281a 2px, #b47850 2px, #b47850 4px)',
                boxShadow: '0 0 1px #000000',
              }}
            />
            {/* Right rope (aligned with eye-bolt at x=51, which is +7px from center 44) */}
            <div
              className="absolute top-0 left-[6px] w-[2px] h-[68px]"
              style={{
                background: 'repeating-linear-gradient(180deg, #49281a 0px, #49281a 2px, #b47850 2px, #b47850 4px)',
                boxShadow: '0 0 1px #000000',
              }}
            />
            {/* Wooden seat plank in matching 16-bit pixel palette */}
            <div
              className="absolute top-[68px] -left-3.5 w-7 h-2"
              style={{
                backgroundColor: '#8f563b',
                border: '1px solid #000000',
                borderTopColor: '#b47850',
                borderBottomColor: '#49281a',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            />

            {/* UNIFIED HERO SEATED ON SWING */}
            {isSwinging && (
              <div
                className="absolute -left-6 top-[22px] w-12 h-14 pointer-events-none"
                style={{
                  imageRendering: 'pixelated',
                }}
              >
                <Image
                  src="/assets/character/hero-sit-swing.png"
                  width={48}
                  height={56}
                  alt="Hero Swinging"
                  style={{ imageRendering: 'pixelated' }}
                  priority
                />
              </div>
            )}
          </div>
        </div>

        {/* Resilient Wild Rose beside swing foot (Spark of courage in rain) */}
        <div
          className="absolute -right-3 bottom-0 pointer-events-none drop-shadow-md"
          title="Nhành hoa dại thắm đỏ kiên cường dưới mưa"
        >
          <div className="relative w-4 h-5 flex flex-col items-center animate-pulse">
            {/* Red rose bud/blossom */}
            <div className="w-2.5 h-2.5 rounded-full bg-rose-600 border border-rose-950 shadow-sm" />
            {/* Green stem & leaf */}
            <div className="w-0.5 h-2.5 bg-emerald-700" />
            <div className="absolute bottom-1 -left-1 w-1.5 h-1 bg-emerald-600 rounded-full rotate-45" />
          </div>
        </div>
      </div>

      {/* 2. Rustic Wooden Mailbox with red flag beside Flower #1 (x = 200) */}
      <div
        className="absolute"
        style={{
          left: `${LEVEL.props.mailbox.x - cameraX}px`,
          top: `${LEVEL.props.mailbox.y}px`,
          width: '32px',
          height: '48px',
        }}
      >
        <div
          className={`relative w-full h-full ${!hasOpenedMailbox ? 'pointer-events-auto cursor-pointer hover:scale-105 transition-transform' : 'pointer-events-none opacity-90'}`}
          onClick={!hasOpenedMailbox ? onOpenMailbox : undefined}
          title={!hasOpenedMailbox ? 'Mở Hòm Thư' : 'Hòm Thư (Đã mở)'}
        >
          <Image
            src="/assets/others/wooden-sign.png"
            width={32}
            height={48}
            alt="Rustic Wooden Mailbox"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      </div>

      {/* 3. Park Bench with Sleeping Calico Cat / Placed Letter (x = 450) */}
      <div
        className="absolute"
        style={{
          left: `${LEVEL.props.cat.x - 40 - cameraX}px`,
          top: '284px',
          width: '80px',
          height: '36px',
        }}
      >
        <div
          className="relative w-full h-full pointer-events-auto cursor-pointer"
          onClick={() => {
            if (!hasLostLetter) {
              if (isSitting) {
                onPetCat();
              } else if (onSitReminder) {
                onSitReminder();
              }
            } else {
              onToggleSit?.();
            }
          }}
        >
          <Image
            src={hasLostLetter ? '/assets/others/park-bench-empty.png' : '/assets/others/park-bench.png'}
            width={80}
            height={36}
            alt={hasLostLetter ? 'Empty Park Bench' : 'Park Bench with Sleeping Cat'}
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Placed Kraft Love Letter on bench beside the cat when sitting */}
          {isSitting && !hasLostLetter && (
            <div
              className="absolute top-2 left-3 w-4 h-3 pointer-events-none drop-shadow-sm animate-pulse z-20"
              title="Bức thư tỏ tình đặt trên ghế"
            >
              <svg viewBox="0 0 20 16" className="w-full h-full">
                <rect x="1" y="2" width="18" height="12" rx="1" fill="#c99b66" stroke="#451a03" strokeWidth="1.5" />
                <path d="M 2,3 L 10,9 L 18,3" fill="none" stroke="#451a03" strokeWidth="1.2" />
                <circle cx="10" cy="8.5" r="1.5" fill="#f43f5e" />
              </svg>
            </div>
          )}

          {/* 3 Torn Letter Fragments blowing away in wind during letter rip incident */}
          {isChasingLetter && (
            <div className="absolute top-0 left-10 pointer-events-none z-30">
              {[
                { dx: 60, dy: -45, rot: 35, delay: 0 },
                { dx: 120, dy: -70, rot: -25, delay: 0.1 },
                { dx: 180, dy: -95, rot: 50, delay: 0.2 },
              ].map((f, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-3 rounded-xs shadow-md border border-amber-950/60"
                  style={{
                    backgroundColor: '#c99b66',
                    animation: 'title-float 1.2s ease-out infinite alternate',
                    transform: `translate(${f.dx}px, ${f.dy}px) rotate(${f.rot}deg)`,
                    opacity: 0.9 - i * 0.15,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-[6px] text-amber-900 font-serif">
                    ~
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. First Wooden Bridge (x = 790) */}
      <div
        className="absolute"
        style={{
          left: `${LEVEL.props.bridge.x - cameraX}px`,
          top: `${LEVEL.props.bridge.y}px`,
          width: `${LEVEL.props.bridge.width}px`,
          height: '32px',
        }}
      >
        <Image
          src="/assets/others/wooden-bridge.png"
          width={120}
          height={32}
          alt="Bridge"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* 5. Tall Lamp Post (x = 1150, height = 112px, top = 208px) */}
      <div
        className="absolute"
        style={{
          left: `${LEVEL.props.lampPost.x - cameraX}px`,
          top: `${LEVEL.props.lampPost.y}px`,
          width: '32px',
          height: '112px',
        }}
      >
        <Image
          src={lampOn ? '/assets/others/lamp-post-single-tall-on.png' : '/assets/others/lamp-post-single-tall-off.png'}
          width={32}
          height={112}
          alt="Tall Lamp Post"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Warm golden light cone radiating from fixture above */}
        {lampOn && (
          <div
            className="absolute pointer-events-none -left-20 top-4 h-36 w-48 opacity-55 transition-opacity duration-1000"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(254, 240, 138, 0.8) 0%, rgba(253, 224, 71, 0.4) 40%, transparent 80%)',
              filter: 'blur(3px)',
            }}
          />
        )}
      </div>

      {/* 5.5. Starry Night Wooden Bridge (x = 1600) */}
      <div
        className="absolute"
        style={{
          left: `${LEVEL.props.starBridge.x - cameraX}px`,
          top: `${LEVEL.props.starBridge.y}px`,
          width: `${LEVEL.props.starBridge.width}px`,
          height: '32px',
        }}
      >
        <Image
          src="/assets/others/wooden-bridge.png"
          width={130}
          height={32}
          alt="Star Bridge"
          style={{
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 0 8px rgba(254, 240, 138, 0.35))',
          }}
        />
      </div>

      {/* 5.8. Calico Cat at Forest Edge (x = 1800) for Fragment #3 */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          left: `${1800 - cameraX}px`,
          top: '298px',
        }}
      >
        <Image
          src="/assets/others/cat-sleep.png"
          width={28}
          height={18}
          alt="Playful Forest Cat"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* 5.9. Rustic Crafting Table under the Dawn Sky (x = 2210) */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          left: `${LEVEL.props.craftingTable.x - cameraX}px`,
          top: `${LEVEL.props.craftingTable.y}px`,
          width: '44px',
          height: '24px',
        }}
      >
        {/* Wooden table surface */}
        <div className="w-11 h-2.5 bg-[#633e24] border-t border-[#8c5934] rounded-t-sm shadow-md flex justify-around items-center">
          <span className="text-[7px]">🌸</span>
          <span className="text-[7px]">📜</span>
        </div>
        {/* Table legs */}
        <div className="w-9 flex justify-between">
          <div className="w-1.5 h-3.5 bg-[#45281a]" />
          <div className="w-1.5 h-3.5 bg-[#45281a]" />
        </div>
      </div>
    </div>
  );
}

