'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { LEVEL } from '@/lib/level-data';
import { isColliding, getGroundYAtX, resolveVerticalPlatformCollision, GroundSegment } from '@/lib/physics';
import { useGameLoop } from '@/hooks/use-game-loop';
import { useKeyboard } from '@/hooks/use-keyboard';
import { SFX } from '@/lib/sound';

// Base sprites
import idle from '../../public/assets/character/hero-idle.png';
import rightLF from '../../public/assets/character/hero-right-lf.png';
import rightRF from '../../public/assets/character/hero-right-rf.png';
import leftIdle from '../../public/assets/character/hero-left-idle.png';
import leftLF from '../../public/assets/character/hero-left-lf.png';
import leftRF from '../../public/assets/character/hero-left-rf.png';

// Bouquet sprites (active when all 7 flowers collected)
import bouquetIdle from '../../public/assets/character/hero-bouquet-idle.png';
import bouquetRightLF from '../../public/assets/character/hero-bouquet-right-lf.png';
import bouquetRightRF from '../../public/assets/character/hero-bouquet-right-rf.png';
import bouquetLeftIdle from '../../public/assets/character/hero-bouquet-left-idle.png';
import bouquetLeftLF from '../../public/assets/character/hero-bouquet-left-lf.png';
import bouquetLeftRF from '../../public/assets/character/hero-bouquet-left-rf.png';

// Umbrella sprites (active in rain zone)
import umbrellaIdle from '../../public/assets/character/hero-umbrella-idle.png';
import umbrellaLeftIdle from '../../public/assets/character/hero-umbrella-left-idle.png';
import umbrellaRightLF from '../../public/assets/character/hero-umbrella-right-lf.png';
import umbrellaRightRF from '../../public/assets/character/hero-umbrella-right-rf.png';
import umbrellaLeftLF from '../../public/assets/character/hero-umbrella-left-lf.png';
import umbrellaLeftRF from '../../public/assets/character/hero-umbrella-left-rf.png';

// Sitting and swinging sprites
import heroSit from '../../public/assets/character/hero-sit.png';
import heroSitLeft from '../../public/assets/character/hero-sit-left.png';
import heroSitSwing from '../../public/assets/character/hero-sit-swing.png';

interface HeroProps {
  active: boolean;
  cameraX: number;
  onPositionUpdate: (x: number, y: number) => void;
  onMeetCompanion: () => void;
  onCollectItem: (id: number) => void;
  collectedIds: Set<number>;
  showHitbox?: boolean;
  isPettingCat?: boolean;
  lockMovement?: boolean;
  isSitting?: boolean;
  onToggleSit?: () => void;
  isSwinging?: boolean;
  onToggleSwing?: () => void;
  swingAngle?: number;
  isLetterCrafted?: boolean;
  gateBarrierX?: number;
  grounds?: GroundSegment[];
  mapWidth?: number;
  companionPos?: { x: number; y: number };
  isAutoWalkingBack?: boolean;
  onAutoWalkBackComplete?: () => void;
  isAutoRunningRight?: boolean;
  onRunOffScreen?: () => void;
  onPassBenchBlocked?: () => void;
  spawnX?: number;
  spawnY?: number;
  isHillMap?: boolean;
}

export default function Hero({
  active,
  cameraX,
  onPositionUpdate,
  onMeetCompanion,
  onCollectItem,
  collectedIds,
  showHitbox = false,
  isPettingCat = false,
  lockMovement = false,
  isSitting = false,
  onToggleSit,
  isSwinging = false,
  onToggleSwing,
  swingAngle = 0,
  isLetterCrafted = false,
  gateBarrierX,
  grounds,
  mapWidth,
  companionPos,
  isAutoWalkingBack = false,
  onAutoWalkBackComplete,
  isAutoRunningRight = false,
  onRunOffScreen,
  onPassBenchBlocked,
  spawnX,
  spawnY,
  isHillMap = false,
}: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  // Physics state in refs
  const initialX = spawnX ?? LEVEL.heroSpawn.x;
  const initialY = spawnY ?? LEVEL.heroSpawn.y;
  const posRef = useRef({ x: initialX, y: initialY });
  const velRef = useRef({ vx: 0, vy: 0 });
  const groundedRef = useRef(true);
  const facingRightRef = useRef(true);
  const metRef = useRef(false);
  const allCollectedPlayedRef = useRef(false);
  const umbrellaSoundPlayedRef = useRef(false);

  // Visual state
  const [displayX, setDisplayX] = useState(initialX);
  const [displayY, setDisplayY] = useState(initialY);
  const [facingRight, setFacingRight] = useState(true);
  const [sprite, setSprite] = useState(idle);
  const [inRain, setInRain] = useState(false);
  const walkFrameRef = useRef(0);
  const walkTimerRef = useRef(0);

  const { isAnyPressed, resetKeys } = useKeyboard(active);

  // Reposition if spawn coordinates change (e.g. transitioning to Hill Map)
  useEffect(() => {
    if (spawnX !== undefined && spawnY !== undefined) {
      posRef.current = { x: spawnX, y: spawnY };
      velRef.current = { vx: 0, vy: 0 };
      setDisplayX(spawnX);
      setDisplayY(spawnY);
    }
  }, [spawnX, spawnY]);

  // Whenever movement lock changes or becomes active, reset keys and cancel horizontal velocity
  useEffect(() => {
    resetKeys();
    velRef.current.vx = 0;
  }, [lockMovement, isPettingCat, isSitting, isSwinging, isAutoWalkingBack, isAutoRunningRight, resetKeys]);

  const gameLoop = useCallback(
    (dt: number) => {
      if (metRef.current || isPettingCat) return;

      const pos = posRef.current;
      const vel = velRef.current;
      const { moveSpeed, gravity, jumpForce, maxFallSpeed, heroWidth, heroHeight } = LEVEL;
      const hasBouquet = collectedIds.size >= LEVEL.collectibles.length;
      const activeGrounds = grounds ?? LEVEL.grounds;
      const effectiveMapWidth = mapWidth ?? LEVEL.mapWidth;

      // --- Auto-run off screen to the right when letter is crafted ---
      if (isAutoRunningRight) {
        pos.x += 4.5 * dt;
        facingRightRef.current = true;
        setFacingRight(true);
        walkTimerRef.current += dt;
        if (walkTimerRef.current > 4) {
          walkTimerRef.current = 0;
          walkFrameRef.current = (walkFrameRef.current + 1) % 2;
          setSprite(walkFrameRef.current === 0 ? bouquetRightLF : bouquetRightRF);
        }
        const groundY = getGroundYAtX(pos.x, heroWidth, activeGrounds);
        if (groundY !== undefined) {
          pos.y = groundY - heroHeight;
          vel.vy = 0;
        }
        if (pos.x >= effectiveMapWidth - 10) {
          onRunOffScreen?.();
        }
        setDisplayX(pos.x);
        setDisplayY(pos.y);
        onPositionUpdate(pos.x, pos.y);
        return;
      }

      // --- Lock manual player movement during cutscenes / dialogue ---
      if (lockMovement) return;

      // --- Sitting behavior on bench ---
      if (isSitting) {
        if (isAnyPressed('ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'a', 'd', 'w', 'e', 'E', 's', 'S')) {
          onToggleSit?.();
        }
        return;
      }

      // --- Swinging behavior on wooden swing ---
      if (isSwinging) {
        pos.x = LEVEL.props.swing.x;
        pos.y = LEVEL.props.swing.y;
        setDisplayX(pos.x);
        setDisplayY(pos.y);
        onPositionUpdate(pos.x, pos.y);
        if (isAnyPressed(' ', 'e', 'E', 'w', 'W', 'ArrowUp')) {
          onToggleSwing?.();
          pos.x = LEVEL.props.swing.x + 36;
          pos.y = 320 - LEVEL.heroHeight;
          vel.vx = 0;
          vel.vy = -2.0;
        }
        return;
      }

      // --- Rain zone check (x: 600..1350, only in valley map) ---
      const currentlyInRain = !isHillMap && effectiveMapWidth > 1500 && pos.x >= 580 && pos.x <= 1350;
      setInRain(currentlyInRain);
      if (currentlyInRain && !umbrellaSoundPlayedRef.current) {
        umbrellaSoundPlayedRef.current = true;
        SFX.umbrellaOpen();
      } else if (!currentlyInRain && umbrellaSoundPlayedRef.current) {
        umbrellaSoundPlayedRef.current = false;
      }

      // --- Input ---
      const moveLeft = isAnyPressed('ArrowLeft', 'a', 'A');
      const moveRight = isAnyPressed('ArrowRight', 'd', 'D');
      const jumpKey = isAnyPressed(' ', 'ArrowUp', 'w', 'W');

      // --- Horizontal movement ---
      vel.vx = 0;
      if (moveLeft) {
        vel.vx = -moveSpeed * dt;
        facingRightRef.current = false;
        setFacingRight(false);
      }
      if (moveRight) {
        vel.vx = moveSpeed * dt;
        facingRightRef.current = true;
        setFacingRight(true);
      }

      pos.x += vel.vx;

      // Clamp X to map bounds and story gate barrier
      let maxX = effectiveMapWidth - heroWidth;
      if (gateBarrierX !== undefined) {
        maxX = Math.min(maxX, gateBarrierX);
      }
      if (pos.x >= maxX) {
        pos.x = maxX;
        vel.vx = 0;
        if (gateBarrierX !== undefined && maxX === gateBarrierX && moveRight) {
          onPassBenchBlocked?.();
        }
      }
      pos.x = Math.max(0, pos.x);
      pos.x = Math.max(0, pos.x);

      // --- Jump (light comfortable hop) ---
      if (jumpKey && groundedRef.current) {
        vel.vy = jumpForce;
        groundedRef.current = false;
        SFX.jump();
      }

      // --- Gravity ---
      vel.vy += gravity * dt;
      vel.vy = Math.min(vel.vy, maxFallSpeed);
      pos.y += vel.vy;

      // --- Ground Collision ---
      const groundY = getGroundYAtX(pos.x, heroWidth, activeGrounds);
      if (groundY !== undefined) {
        const footY = pos.y + heroHeight;
        // Snap to ground if falling/landing OR already grounded and walking along slopes/undulating curves
        if ((footY >= groundY && vel.vy >= 0) || (groundedRef.current && footY >= groundY - 6 && footY <= groundY + 6 && vel.vy >= 0)) {
          pos.y = groundY - heroHeight;
          vel.vy = 0;
          groundedRef.current = true;
        }
      } else {
        groundedRef.current = false;
      }

      // --- Solid Platforms (e.g. mossy boulder for rose #6) ---
      if (LEVEL.platforms && LEVEL.platforms.length > 0) {
        const platRes = resolveVerticalPlatformCollision(
          pos.x,
          pos.y,
          heroWidth,
          heroHeight,
          vel.vy,
          LEVEL.platforms,
        );
        if (platRes.landed) {
          pos.y = platRes.y;
          vel.vy = 0;
          groundedRef.current = true;
        }
      }

      // --- Collectibles ---
      for (const item of LEVEL.collectibles) {
        if (collectedIds.has(item.id)) continue;
        const heroRect = { x: pos.x, y: pos.y, width: heroWidth, height: heroHeight };
        const itemRect = { x: item.x, y: item.y, width: 32, height: 32 };
        if (isColliding(heroRect, itemRect)) {
          resetKeys();
          velRef.current.vx = 0;
          onCollectItem(item.id);
          const newTotal = collectedIds.size + 1;
          if (newTotal >= LEVEL.collectibles.length && !allCollectedPlayedRef.current) {
            allCollectedPlayedRef.current = true;
            SFX.allCollected();
          } else {
            SFX.harpChime();
          }
        }
      }

      // --- Companion collision / meeting trigger ---
      const activeCompanionPos = companionPos ?? LEVEL.companionPos;
      const heroRect = { x: pos.x, y: pos.y, width: heroWidth, height: heroHeight };
      const compRect = {
        x: activeCompanionPos.x - 30,
        y: activeCompanionPos.y,
        width: 60,
        height: 64,
      };
      if (isLetterCrafted && isColliding(heroRect, compRect) && !metRef.current) {
        metRef.current = true;
        SFX.meet();
        onMeetCompanion();
      }

      // --- Animation selection ---
      const isMoving = moveLeft || moveRight;
      walkTimerRef.current += dt;

      if (isMoving && groundedRef.current && walkTimerRef.current > 5) {
        walkTimerRef.current = 0;
        walkFrameRef.current = (walkFrameRef.current + 1) % 2;

        const inPuddle =
          !isHillMap &&
          ((pos.x >= 735 && pos.x <= 810) ||
            (pos.x >= 905 && pos.x <= 985) ||
            (pos.x >= 1065 && pos.x <= 1135));
        if (inPuddle) {
          SFX.puddleStep();
        }

        if (inRain) {
          if (facingRightRef.current) {
            setSprite(walkFrameRef.current === 0 ? umbrellaRightLF : umbrellaRightRF);
          } else {
            setSprite(walkFrameRef.current === 0 ? umbrellaLeftLF : umbrellaLeftRF);
          }
        } else if (hasBouquet) {
          if (facingRightRef.current) {
            setSprite(walkFrameRef.current === 0 ? bouquetRightLF : bouquetRightRF);
          } else {
            setSprite(walkFrameRef.current === 0 ? bouquetLeftLF : bouquetLeftRF);
          }
        } else {
          if (facingRightRef.current) {
            setSprite(walkFrameRef.current === 0 ? rightLF : rightRF);
          } else {
            setSprite(walkFrameRef.current === 0 ? leftLF : leftRF);
          }
        }
      } else if (!isMoving && groundedRef.current) {
        if (inRain) {
          setSprite(facingRightRef.current ? umbrellaIdle : umbrellaLeftIdle);
        } else if (hasBouquet) {
          setSprite(facingRightRef.current ? bouquetIdle : bouquetLeftIdle);
        } else {
          setSprite(facingRightRef.current ? idle : leftIdle);
        }
      }

      // Update display
      setDisplayX(pos.x);
      setDisplayY(pos.y);
      onPositionUpdate(pos.x, pos.y);
    },
    [
      isAnyPressed,
      resetKeys,
      collectedIds,
      onCollectItem,
      onMeetCompanion,
      onPositionUpdate,
      lockMovement,
      isPettingCat,
      isSitting,
      onToggleSit,
      isSwinging,
      onToggleSwing,
      swingAngle,
      isLetterCrafted,
      gateBarrierX,
      grounds,
      mapWidth,
      companionPos,
      isAutoWalkingBack,
      onAutoWalkBackComplete,
      isAutoRunningRight,
      onRunOffScreen,
      onPassBenchBlocked,
    ],
  );

  useGameLoop(gameLoop, active);

  // Reset when becoming active
  useEffect(() => {
    if (active) {
      const initX = spawnX ?? LEVEL.heroSpawn.x;
      const initY = spawnY ?? LEVEL.heroSpawn.y;
      posRef.current = { x: initX, y: initY };
      velRef.current = { vx: 0, vy: 0 };
      groundedRef.current = true;
      metRef.current = false;
      allCollectedPlayedRef.current = false;
      umbrellaSoundPlayedRef.current = false;
      const resetTimer = setTimeout(() => {
        setDisplayX(initX);
        setDisplayY(initY);
      }, 0);
      return () => clearTimeout(resetTimer);
    }
  }, [active, spawnX, spawnY]);

  const screenX = displayX - cameraX;

  // Compute sprite dimensions and current image
  let currentSprite = sprite;
  let spriteW = LEVEL.heroWidth;
  let spriteH = LEVEL.heroHeight;

  if (isSitting) {
    currentSprite = facingRight ? heroSit : heroSitLeft;
    spriteW = 48;
    spriteH = 54;
  } else if (isSwinging) {
    currentSprite = heroSitSwing;
    spriteW = 48;
    spriteH = 48;
  } else if (inRain) {
    spriteW = LEVEL.heroWidth;
    spriteH = LEVEL.heroHeight;
  }

  return (
    <div
      ref={heroRef}
      className={`absolute z-20 select-none pointer-events-none ${
        showHitbox ? 'ring-2 ring-rose-500 ring-offset-2 bg-rose-500/20' : ''
      }`}
      style={{
        left: `${screenX}px`,
        top: `${displayY}px`,
        width: `${LEVEL.heroWidth}px`,
        height: `${LEVEL.heroHeight}px`,
      }}
    >
      {/* Hero and Integrated Equipment Sprite (Rendered inside unified swing when swinging) */}
      {!isSwinging && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none flex items-end justify-center"
          style={{
            width: `${spriteW}px`,
            height: `${spriteH}px`,
          }}
        >
          <Image
            src={isPettingCat ? '/assets/character/hero-pet-cat.png' : currentSprite}
            width={spriteW}
            height={spriteH}
            alt="Hero"
            style={{ imageRendering: 'pixelated' }}
            priority
          />
        </div>
      )}
    </div>
  );
}
