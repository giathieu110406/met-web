'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Canvas from '@/components/canvas';
import TitleScreen from '@/components/title-screen';
import IntroText from '@/components/intro-text';
import Hero from '@/components/hero';
import Companion from '@/components/companion';
import Ground from '@/components/ground';
import Collectible from '@/components/collectible';
import Decorations from '@/components/decorations';
import DynamicSky from '@/components/dynamic-sky';
import WeatherEffects from '@/components/weather-effects';
import PropsLayer from '@/components/props-layer';
import ThoughtBubble from '@/components/thought-bubble';
import FirstPersonView, { FPVSceneType } from '@/components/first-person-view';
import HUD from '@/components/hud';
import EndingCutscene from '@/components/ending-cutscene';
import AdminPanel from '@/components/admin-panel';
import LetterFragment from '@/components/letter-fragment';
import FpvLetterCrafting from '@/components/fpv-letter-crafting';
import PetalRain from '@/components/petal-rain';
import { LEVEL, HILL_LEVEL, CANVAS_WIDTH, STORIES, StoryMilestone, LETTER_FRAGMENTS } from '@/lib/level-data';
import { SFX, BGM, resumeAudio } from '@/lib/sound';

type GameState = 'title' | 'intro' | 'playing' | 'dialogue' | 'ending';

interface FPVSpot {
  id: FPVSceneType;
  label: string;
  minX: number;
  maxX: number;
}

const FPV_SPOTS: FPVSpot[] = [
  { id: 'rain', label: 'Lắng nghe tiếng mưa', minX: 920, maxX: 1040 },
  { id: 'lamp', label: 'Đứng dưới ánh đèn', minX: 1120, maxX: 1220 },
  { id: 'bridge', label: 'Ngắm trăng & đom đóm', minX: 1580, maxX: 1700 },
];

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [cameraX, setCameraX] = useState(0);
  const [heroX, setHeroX] = useState(LEVEL.heroSpawn.x);
  const [collectedIds, setCollectedIds] = useState<Set<number>>(new Set());
  const [currentStory, setCurrentStory] = useState<StoryMilestone | null>(null);

  // Map 1 (Valley) vs Map 2 (Hill) state
  const [currentMap, setCurrentMap] = useState<'valley' | 'hill'>('valley');

  // Support ?scene=ending / ?scene=playing URL query params for direct debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sceneParam = params.get('scene');
      if (sceneParam === 'ending') {
        setGameState('ending');
        setCurrentMap('hill');
      } else if (sceneParam === 'playing') {
        setGameState('playing');
      } else if (sceneParam === 'dialogue') {
        setGameState('dialogue');
        setCurrentMap('hill');
      }
    }
  }, []);
  const [isAutoWalkingBack, setIsAutoWalkingBack] = useState(false);
  const [isAutoRunningToHill, setIsAutoRunningToHill] = useState(false);
  const [mapFadePhase, setMapFadePhase] = useState<'entering' | 'exiting' | null>(null);

  // Mailbox state (x = 200)
  const [hasOpenedMailbox, setHasOpenedMailbox] = useState(false);

  // Letter fragments collection state
  const [hasLostLetter, setHasLostLetter] = useState(false);
  const [isChasingLetter, setIsChasingLetter] = useState(false);
  const [collectedFragments, setCollectedFragments] = useState<boolean[]>([false, false, false]);
  const [isCraftingLetter, setIsCraftingLetter] = useState(false);
  const [isLetterCrafted, setIsLetterCrafted] = useState(false);

  // World interaction states
  const [lampOn, setLampOn] = useState(false);
  const [isSitting, setIsSitting] = useState(false);
  const [isSwinging, setIsSwinging] = useState(false);
  const [swingAngle, setSwingAngle] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const hasContemplatedOnSwingRef = useRef(false);
  const hasContemplatedEmptyBenchRef = useRef(false);
  const swingContemplateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // First-Person View overlay state
  const [fpvScene, setFpvScene] = useState<FPVSceneType | null>(null);
  const hasSeenRainRef = useRef(false);
  const hasSeenLampRef = useRef(false);
  const hasSeenBridgeRef = useRef(false);

  const [catPetted, setCatPetted] = useState(false);
  const [isPettingCat, setIsPettingCat] = useState(false);
  const isPettingForestCatRef = useRef(false);
  const [showHitbox, setShowHitbox] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Check if hero is currently standing in an FPV interactable spot (only on valley map)
  const nearbyFPVSpot = currentMap === 'valley'
    ? FPV_SPOTS.find((spot) => heroX >= spot.minX && heroX <= spot.maxX)
    : undefined;

  // Proximity checks for props and letter fragments (only on valley map)
  const isNearMailbox = currentMap === 'valley' && Math.abs(heroX - LEVEL.props.mailbox.x) < 45;
  const isNearCat = currentMap === 'valley' && Math.abs(heroX - LEVEL.props.cat.x) < 50;
  const isNearSwing = currentMap === 'valley' && Math.abs(heroX - LEVEL.props.swing.x) < 50;
  const isNearStreetlampFragment = currentMap === 'valley' && heroX >= 1110 && heroX <= 1190 && hasLostLetter && !collectedFragments[0];
  const isNearPaperBoat = currentMap === 'valley' && heroX >= 1430 && heroX <= 1610 && hasLostLetter && !collectedFragments[1];
  const isNearForestCat = currentMap === 'valley' && heroX >= 1740 && heroX <= 1860 && hasLostLetter && !collectedFragments[2];
  const isNearCraftingTable = currentMap === 'valley' && heroX >= 2180 && heroX <= 2240;
  const isNearHillBench = currentMap === 'hill' && Math.abs(heroX - 940) < 50;

  // 1. Adaptive BGM Control
  useEffect(() => {
    if (gameState !== 'title' && gameState !== 'intro') {
      resumeAudio();
      BGM.start();
      const inRain = currentMap === 'valley' && heroX >= 580 && heroX <= 1350;
      const isCinematic = gameState === 'dialogue' || gameState === 'ending';
      BGM.updateLayers({
        flowerCount: collectedIds.size,
        inRain,
        isCinematic,
        currentMap,
      });
    } else {
      BGM.stop();
    }
  }, [gameState, heroX, collectedIds.size, currentMap]);

  // 2. Pendulum Swing Animation Loop & 2-Phase Solitary Rain Contemplation
  useEffect(() => {
    if (!isSwinging) {
      if (swingContemplateTimerRef.current) {
        clearTimeout(swingContemplateTimerRef.current);
        swingContemplateTimerRef.current = null;
      }
      const t = setTimeout(() => setSwingAngle(0), 0);
      return () => clearTimeout(t);
    }

    // Trigger sequential 2-phase reflection if player sits on swing after letter loss
    if (hasLostLetter && !hasContemplatedOnSwingRef.current) {
      hasContemplatedOnSwingRef.current = true;
      // Phase 1: Doubt & Hesitation
      setCurrentStory({
        flowerId: 95,
        x: LEVEL.props.swing.x,
        text: 'Đến cả một bức thư cũng không giữ trọn vẹn được... Bây giờ mình phải làm sao đây...',
      });

      // Phase 2: Spark of Courage (after 4.2s of swinging in rain)
      swingContemplateTimerRef.current = setTimeout(() => {
        setCurrentStory({
          flowerId: 95,
          x: LEVEL.props.swing.x,
          text: 'Nhưng mình sẽ kiên cường như nhành hoa này... Dù mưa gió quăng quật tả tơi vẫn đỏ thắm kiên cường. Bức thư có thể rách, nhưng lòng chân thành của mình đâu có rách! Nhất định phải đi tìm lại từng mảnh!',
        });
      }, 4200);
    }

    let animId: number;
    let time = 0;
    const loop = () => {
      time += 0.045;
      const angle = Math.sin(time * 2.4) * 24;
      setSwingAngle(angle);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      if (swingContemplateTimerRef.current) {
        clearTimeout(swingContemplateTimerRef.current);
      }
    };
  }, [isSwinging, hasLostLetter]);

  // 2.5. Empty bench contemplation when player sits down after letter rip incident
  useEffect(() => {
    if (isSitting && isNearCat && hasLostLetter && !hasContemplatedEmptyBenchRef.current) {
      hasContemplatedEmptyBenchRef.current = true;
      setCurrentStory({
        flowerId: 92,
        x: LEVEL.props.cat.x,
        text: 'Chiếc ghế giờ chỉ còn lại mình... Bức thư đã bị gió cuốn đi, mình phải tìm lại cho bằng được!',
      });
    }
  }, [isSitting, isNearCat, hasLostLetter]);

  // 2.6. Mountain trail resting bench on Map 2 (x = 940)
  const hasContemplatedHillBenchRef = useRef(false);
  useEffect(() => {
    if (isSitting && isNearHillBench && !hasContemplatedHillBenchRef.current) {
      hasContemplatedHillBenchRef.current = true;
      setCurrentStory({
        flowerId: 98,
        x: 940,
        text: 'Con đường lên đỉnh đồi tuy dốc và dài, nhưng mỗi bước chân lại đưa anh đến gần em hơn...',
      });
    }
  }, [isSitting, isNearHillBench]);

  // Reminder when player tries to pet cat before sitting
  const handleSitReminder = useCallback(() => {
    setCurrentStory({
      flowerId: 93,
      x: LEVEL.props.cat.x,
      text: 'Mệt quá đi thôi! Mình nên ngồi xuống ghế [S] nghỉ chân một chút vậy... Chú mèo trông cuti đấy chứ ❤️.',
    });
  }, []);

  // 3. Streetlamp auto-turn on when hero arrives
  useEffect(() => {
    if (heroX >= 1050 && !lampOn) {
      SFX.lampClick();
      const t = setTimeout(() => setLampOn(true), 0);
      return () => clearTimeout(t);
    }
  }, [heroX, lampOn]);

  const handleToggleMute = useCallback(() => {
    const muted = BGM.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleCollectFragment = useCallback((index: number) => {
    setCollectedFragments((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });

    if (index === 1) {
      SFX.boatSplosh();
    } else if (index === 2) {
      SFX.catPurr();
    }
    SFX.paperPickup();

    const frag = LETTER_FRAGMENTS[index];
    if (frag) {
      setCurrentStory({
        flowerId: 100 + index,
        x: frag.x,
        text: `${frag.title}: "${frag.excerpt}"`,
      });
    }
  }, []);

  const handleMeetCompanion = useCallback(() => {
    // Switch to first-person cherry blossom reunion!
    setGameState('dialogue');
  }, []);

  const handleAutoWalkBackComplete = useCallback(() => {
    setIsAutoWalkingBack(false);
  }, []);

  const lastBenchBlockedTimeRef = useRef<number>(0);
  const handlePassBenchBlocked = useCallback(() => {
    const now = Date.now();
    if (now - lastBenchBlockedTimeRef.current > 3000) {
      lastBenchBlockedTimeRef.current = now;
      if (!hasOpenedMailbox) {
        setCurrentStory({
          flowerId: 91,
          x: 200,
          text: 'Khoan đã... Có bưu kiện gửi cho mình ở hòm thư đầu đường, hãy quay lại mở trước nhé!',
        });
      } else {
        setCurrentStory({
          flowerId: 93,
          x: LEVEL.props.cat.x,
          text: 'Mình nên ngừng lại một chút... Hãy ngồi xuống ghế đá [S] nghỉ chân đã.',
        });
      }
    }
  }, [hasOpenedMailbox]);

  const hasTriggeredCherryEntranceRef = useRef(false);

  const handleRunOffScreen = useCallback(() => {
    if (currentMap === 'valley' && isAutoRunningToHill) {
      setMapFadePhase('entering');
      setTimeout(() => {
        setCurrentMap('hill');
        setHeroX(40);
        setCameraX(0);
        setIsAutoRunningToHill(false);
        setMapFadePhase('exiting');
        setTimeout(() => {
          setMapFadePhase(null);
        }, 500);
      }, 450);
    }
  }, [currentMap, isAutoRunningToHill]);

  const handlePositionUpdate = useCallback((x: number) => {
    setHeroX(x);
    const effectiveWidth = currentMap === 'hill' ? HILL_LEVEL.mapWidth : LEVEL.mapWidth;
    let targetCameraX = x - CANVAS_WIDTH / 3;
    targetCameraX = Math.max(0, Math.min(targetCameraX, effectiveWidth - CANVAS_WIDTH));
    setCameraX(targetCameraX);

    // If on Hill Map
    if (currentMap === 'hill') {
      // Task 6: Boy walks a distance (x >= 130) before FPV cherry entrance triggers automatically
      if (x >= 130 && !hasTriggeredCherryEntranceRef.current && gameState === 'playing' && !fpvScene) {
        hasTriggeredCherryEntranceRef.current = true;
        setFpvScene('cherry-entrance');
      }
      if (x >= 1990 && gameState === 'playing') {
        handleMeetCompanion();
      }
      return;
    }

    // --- Valley Map Logic ---
    // Initial cinematic triggers when walking through for the first time
    if (x >= 950 && x <= 1020 && !hasSeenRainRef.current) {
      hasSeenRainRef.current = true;
      setFpvScene('rain');
    }

    // Task 4: Tall streetlamp Fragment #1 FPV auto-trigger when hero stops under light
    if (hasLostLetter && !collectedFragments[0] && Math.abs(x - 1150) < 30 && !hasSeenLampRef.current) {
      hasSeenLampRef.current = true;
      setFpvScene('lamp-reach');
    }

    // Streetlamp FPV trigger
    if (x >= 1170 && x <= 1240 && !hasSeenLampRef.current) {
      hasSeenLampRef.current = true;
      setFpvScene('lamp');
    }

    // Bridge FPV trigger
    if (x >= 1600 && x <= 1680 && !hasSeenBridgeRef.current) {
      hasSeenBridgeRef.current = true;
      setFpvScene('bridge');
    }

    // Forest Cat Fragment #3 reminder when entering starry forest
    if (x >= 1710 && x <= 1750 && hasLostLetter && !collectedFragments[2]) {
      setCurrentStory({
        flowerId: 96,
        x: 1730,
        text: 'Kìa! Phía trước có chú mèo đang nghịch mảnh thư thứ 3! Hãy đến dỗ dành chú mèo [E] để xin lại mảnh thư!',
      });
    }

    // Pre-summit reminder if player hasn't crafted the letter
    if (x >= 2250 && !isLetterCrafted) {
      if (!collectedFragments.every(Boolean)) {
        const remaining = 3 - collectedFragments.filter(Boolean).length;
        setCurrentStory({
          flowerId: 98,
          x: 2250,
          text: `Đỉnh đồi vắng bóng người... Bạn vẫn còn thiếu ${remaining} mảnh thư, hãy quay lại tìm đủ nhé!`,
        });
      } else {
        setCurrentStory({
          flowerId: 98,
          x: 2250,
          text: 'Đỉnh đồi vắng lặng gió bay... Bạn đã gom đủ 3 mảnh thư, hãy tới bàn đá [x=2210] ghép hoàn chỉnh để gặp bạn ấy!',
        });
      }
    }
  }, [
    currentMap,
    gameState,
    hasLostLetter,
    isSitting,
    isAutoWalkingBack,
    collectedFragments,
    isLetterCrafted,
    handleMeetCompanion,
  ]);

  const handleCollectItem = useCallback((id: number) => {
    setCollectedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    // Find story milestone
    const story = STORIES.find((s) => s.flowerId === id);
    if (story) {
      setCurrentStory(story);
    }
  }, []);

  // Trigger any FPV spot (allows watching again anytime!)
  const triggerFPVSpot = useCallback((spotId: FPVSceneType) => {
    if (spotId === 'cat') {
      setIsPettingCat(true);
      setCatPetted(true);
      SFX.catPurr();
    }
    setFpvScene(spotId);
  }, []);

  // Keyboard shortcuts for FPV [E], Bench Sit [S/Down], Swing [E], Fragments [E]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || fpvScene || isCraftingLetter) return;

      const key = e.key.toLowerCase();

      // Mailbox (x = 200) with 'e' - only once!
      if (key === 'e' && isNearMailbox && !isSitting && !isSwinging) {
        if (!hasOpenedMailbox) {
          triggerFPVSpot('mailbox');
        }
        return;
      }

      // Collect Fragment #1 (Tall streetlamp reach FPV) with 'e'
      if (key === 'e' && isNearStreetlampFragment) {
        triggerFPVSpot('lamp-reach');
        return;
      }

      // Collect Fragment #2 (Paper boat FPV) with 'e'
      if (key === 'e' && isNearPaperBoat) {
        triggerFPVSpot('boat-retrieve');
        return;
      }

      // Pet forest cat to retrieve Fragment #3 with 'e'
      if (key === 'e' && isNearForestCat) {
        isPettingForestCatRef.current = true;
        triggerFPVSpot('forest-cat-chase');
        return;
      }

      // Open Crafting Table with 'e' if all 3 fragments collected and not yet crafted
      if (key === 'e' && isNearCraftingTable && collectedFragments.every(Boolean) && !isLetterCrafted) {
        setIsCraftingLetter(true);
        return;
      }

      // If standing near cat bench and presses 'e' before sitting, remind to sit
      if (key === 'e' && isNearCat && !isSitting && !hasLostLetter) {
        handleSitReminder();
        return;
      }

      // Sit toggle on bench (x: 410..490)
      if (isSitting) {
        // If sitting on bench near cat and presses 'e', pet the cat! (Only if mailbox has been opened)
        if (key === 'e' && isNearCat && !hasLostLetter) {
          if (hasOpenedMailbox) {
            triggerFPVSpot('cat');
          } else {
            setCurrentStory({
              flowerId: 92,
              x: LEVEL.props.cat.x,
              text: 'Khoan đã... Có bưu kiện chưa mở ở hòm thư, bạn cần mở hòm thư trước khi vuốt ve mèo nhé.',
            });
          }
          return;
        }
        if (key === 'arrowdown' || key === 's' || key === 'arrowleft' || key === 'arrowright' || key === 'a' || key === 'd' || key === ' ' || key === 'w' || key === 'arrowup') {
          setIsSitting(false);
          return;
        }
      } else if ((e.key === 'ArrowDown' || key === 's') && (isNearCat || isNearHillBench)) {
        setIsSitting(true);
        return;
      }

      // Swing toggle (x: 650..710)
      if (isSwinging) {
        if (key === 'e' || key === ' ' || key === 'escape' || key === 'arrowdown' || key === 's') {
          setIsSwinging(false);
          setHeroX(LEVEL.props.swing.x + 36);
          return;
        }
      } else if (key === 'e' && isNearSwing) {
        setIsSwinging(true);
        SFX.swingWhoosh();
        return;
      }

      // FPV interaction with 'e'
      if (key === 'e' && nearbyFPVSpot && !isSitting && !isSwinging) {
        triggerFPVSpot(nearbyFPVSpot.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    nearbyFPVSpot,
    gameState,
    fpvScene,
    isCraftingLetter,
    heroX,
    isSitting,
    isSwinging,
    isNearMailbox,
    isNearCat,
    isNearSwing,
    isNearStreetlampFragment,
    isNearPaperBoat,
    isNearForestCat,
    isNearCraftingTable,
    collectedFragments,
    isLetterCrafted,
    hasLostLetter,
    triggerFPVSpot,
    handleSitReminder,
  ]);

  const handleReset = useCallback(() => {
    setGameState('title');
    setCurrentMap('valley');
    setIsAutoWalkingBack(false);
    setIsAutoRunningToHill(false);
    setMapFadePhase(null);
    setCameraX(0);
    setHeroX(LEVEL.heroSpawn.x);
    setCollectedIds(new Set());
    setHasOpenedMailbox(false);
    setHasLostLetter(false);
    setIsChasingLetter(false);
    hasContemplatedOnSwingRef.current = false;
    hasContemplatedEmptyBenchRef.current = false;
    if (swingContemplateTimerRef.current) {
      clearTimeout(swingContemplateTimerRef.current);
      swingContemplateTimerRef.current = null;
    }
    setCollectedFragments([false, false, false]);
    setIsCraftingLetter(false);
    setIsLetterCrafted(false);
    setCurrentStory(null);
    setFpvScene(null);
    hasSeenRainRef.current = false;
    hasSeenLampRef.current = false;
    hasSeenBridgeRef.current = false;
    setCatPetted(false);
    setIsPettingCat(false);
    setIsSitting(false);
    setIsSwinging(false);
    setLampOn(false);
    BGM.stop();
  }, []);

  const isCinematic = gameState === 'dialogue' || gameState === 'ending';
  const isMapFading = mapFadePhase !== null;
  const shouldLockHero = isCinematic || fpvScene !== null || isCraftingLetter || isSitting || isSwinging || isMapFading;

  return (
    <>
      {/* Admin Panel — always available via ~ or F2 */}
      <AdminPanel
        isOpen={isAdminOpen}
        setIsOpen={setIsAdminOpen}
        gameState={gameState}
        setGameState={setGameState}
        showHitbox={showHitbox}
        setShowHitbox={setShowHitbox}
        onReset={handleReset}
        collectedCount={collectedIds.size}
        totalCollectibles={LEVEL.collectibles.length}
      />

      <Canvas>
        {/* Title Screen */}
        {gameState === 'title' && (
          <TitleScreen onStart={() => setGameState('intro')} />
        )}

        {/* Intro Text */}
        {gameState === 'intro' && (
          <IntroText onComplete={() => setGameState('playing')} />
        )}

        {/* Gameplay world (rendered for playing, dialogue, and ending) */}
        {gameState !== 'title' && gameState !== 'intro' && (
          <>
            {/* 1. Dynamic Atmosphere Sky (Sunset -> Twilight Rain -> Night Stars -> Dawn -> Cherry Spring) */}
            <DynamicSky cameraX={cameraX} isHillMap={currentMap === 'hill'} />

            {/* 2. Weather Effects (Rain, Fireflies, Petal Wind only in Valley) */}
            {currentMap === 'valley' && <WeatherEffects cameraX={cameraX} />}

            {/* 2.5. Blooming Cherry Blossom Petal Rain across Map 2 */}
            {currentMap === 'hill' && <PetalRain active={true} />}

            {/* 3. Continuous Ground */}
            <Ground cameraX={cameraX} isHillMap={currentMap === 'hill'} />

            {/* 4. Interactive Props (Mailbox, Swing, Sign, Cat, Bridge, Lamp, Cherry Tree) */}
            <PropsLayer
              cameraX={cameraX}
              heroX={heroX}
              onPetCat={() => {
                if (isSitting) {
                  triggerFPVSpot('cat');
                } else {
                  handleSitReminder();
                }
              }}
              catPetted={catPetted}
              lampOn={lampOn}
              isSitting={isSitting}
              onToggleSit={() => setIsSitting((prev) => !prev)}
              isSwinging={isSwinging}
              onToggleSwing={() => setIsSwinging((prev) => !prev)}
              swingAngle={swingAngle}
              hasLostLetter={hasLostLetter}
              isChasingLetter={isChasingLetter}
              onOpenMailbox={() => triggerFPVSpot('mailbox')}
              hasOpenedMailbox={hasOpenedMailbox}
              onSitReminder={handleSitReminder}
              isHillMap={currentMap === 'hill'}
            />

            {/* 5. Environmental Foliage & Butterflies (Valley Map) */}
            {currentMap === 'valley' && (
              <Decorations decorations={LEVEL.decorations} cameraX={cameraX} />
            )}

            {/* 6. 7 Distinct Collectible Roses (Valley Map) */}
            {currentMap === 'valley' &&
              LEVEL.collectibles.map((item) => (
                <Collectible
                  key={item.id}
                  id={item.id}
                  x={item.x}
                  y={item.y}
                  type={item.type}
                  collected={collectedIds.has(item.id)}
                  cameraX={cameraX}
                  heroX={heroX}
                  lampOn={lampOn}
                />
              ))}

            {/* 6.5. 3 Kraft Letter Fragments (Valley Map) */}
            {currentMap === 'valley' &&
              hasLostLetter &&
              LETTER_FRAGMENTS.map((frag, idx) => (
                <div
                  key={frag.id}
                  style={{ transform: `translateX(${-cameraX}px)` }}
                  className="absolute inset-0 pointer-events-none z-25"
                >
                  <LetterFragment
                    fragment={frag}
                    isCollected={collectedFragments[idx]}
                    isCrouching={isSitting}
                  />
                </div>
              ))}

            {/* 7. Companion - Appears at Hill Summit waiting for the hero under Cherry Tree */}
            {currentMap === 'hill' && (
              <Companion
                cameraX={cameraX}
                showHitbox={showHitbox}
                x={HILL_LEVEL.companionPos.x}
                y={HILL_LEVEL.companionPos.y}
              />
            )}

            {/* 8. Hero */}
            <Hero
              key={currentMap}
              active={gameState === 'playing'}
              cameraX={cameraX}
              onPositionUpdate={handlePositionUpdate}
              onMeetCompanion={handleMeetCompanion}
              onCollectItem={handleCollectItem}
              collectedIds={collectedIds}
              showHitbox={showHitbox}
              isPettingCat={isPettingCat}
              lockMovement={shouldLockHero}
              isSitting={isSitting}
              onToggleSit={() => setIsSitting(false)}
              isSwinging={isSwinging}
              onToggleSwing={() => setIsSwinging(false)}
              swingAngle={swingAngle}
              isLetterCrafted={isLetterCrafted}
              gateBarrierX={currentMap === 'valley' && (!hasOpenedMailbox || !hasLostLetter) ? 485 : undefined}
              onPassBenchBlocked={handlePassBenchBlocked}
              grounds={currentMap === 'hill' ? HILL_LEVEL.grounds : LEVEL.grounds}
              mapWidth={currentMap === 'hill' ? HILL_LEVEL.mapWidth : LEVEL.mapWidth}
              companionPos={currentMap === 'hill' ? HILL_LEVEL.companionPos : LEVEL.companionPos}
              isAutoWalkingBack={isAutoWalkingBack}
              onAutoWalkBackComplete={handleAutoWalkBackComplete}
              isAutoRunningRight={isAutoRunningToHill}
              onRunOffScreen={handleRunOffScreen}
              spawnX={currentMap === 'hill' ? 40 : undefined}
              spawnY={currentMap === 'hill' ? 272 : undefined}
            />

            {/* Cinematic 2-Phase Map Transition Screen Fade */}
            {mapFadePhase && (
              <div
                className={`absolute inset-0 bg-slate-950 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-400 ease-in-out ${
                  mapFadePhase === 'entering' ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div
                  className="text-pink-300 font-bold flex items-center gap-2 animate-pulse"
                  style={{ fontFamily: "'VT323', monospace", fontSize: '24px' }}
                >
                  🌸 Đang tiến về Đồi Hoa Anh Đào...
                </div>
              </div>
            )}

            {/* Subtle Audio BGM Mute Toggle Button */}
            <button
              onClick={handleToggleMute}
              className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-white/10 hover:border-pink-400/40 text-rose-200 hover:text-white cursor-pointer shadow flex items-center justify-center transition-all hover:scale-105 active:scale-95 select-none text-xs"
              style={{ fontFamily: "'VT323', monospace" }}
              title={isMuted ? 'Bật âm thanh (BGM)' : 'Tắt âm thanh (Mute)'}
            >
              <span>{isMuted ? '🔇' : '🎵'}</span>
            </button>

            {/* Bottom Context-Sensitive Instruction Dialog Box */}
            {gameState === 'playing' && !fpvScene && !currentStory && !isCraftingLetter && (
              isSwinging ||
              isSitting ||
              (isNearMailbox && !hasOpenedMailbox) ||
              isNearSwing ||
              isNearCat ||
              isNearStreetlampFragment ||
              isNearPaperBoat ||
              isNearForestCat ||
              (isNearCraftingTable && collectedFragments.every(Boolean) && !isLetterCrafted) ||
              nearbyFPVSpot
            ) && (
              <div
                className="absolute bottom-3 left-0 right-0 mx-auto w-fit max-w-[560px] z-30 pointer-events-auto select-none px-3"
                style={{
                  animation: 'subtitle-appear 0.25s ease-out',
                }}
              >
                <div
                  className="flex items-center px-3.5 py-1.5 rounded-full shadow-2xl backdrop-blur-md transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(10, 15, 29, 0.90)',
                    border: '1px solid rgba(244, 114, 182, 0.4)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 12px rgba(244, 63, 94, 0.25)',
                    fontFamily: "'VT323', monospace",
                    fontSize: '16px',
                  }}
                >
                  {/* Mailbox (Task 1): only when !hasOpenedMailbox */}
                  {isNearMailbox && !isSitting && !isSwinging && !hasOpenedMailbox && (
                    <button
                      onClick={() => triggerFPVSpot('mailbox')}
                      className="flex items-center gap-2 text-amber-200 hover:text-white cursor-pointer active:scale-95 transition-all"
                    >
                      <kbd className="px-2 py-0.5 rounded bg-amber-900/90 border border-amber-400 text-amber-100 text-xs font-bold shadow">E</kbd>
                      <span>Mở Hòm Thư</span>
                    </button>
                  )}

                  {isSwinging && (
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-300 font-bold">Xích đu:</span>
                      <button
                        onClick={() => setIsSwinging(false)}
                        className="hover:text-rose-200 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <kbd className="px-1.5 py-0.5 rounded bg-rose-950 border border-rose-500 text-rose-200 text-xs font-bold">Space / E</kbd>
                        <span>Bước xuống</span>
                      </button>
                    </div>
                  )}

                  {/* Sitting on park bench (Task 2) */}
                  {!isSwinging && isSitting && isNearCat && (
                    <div className="flex items-center gap-3">
                      <span className="text-pink-300 font-bold">Ghế công viên:</span>
                      {!hasLostLetter ? (
                        hasOpenedMailbox ? (
                          <>
                            <button
                              onClick={() => triggerFPVSpot('cat')}
                              className="flex items-center gap-1.5 text-slate-100 hover:text-pink-200 cursor-pointer active:scale-95 transition-all"
                            >
                              <kbd className="px-2 py-0.5 rounded bg-rose-900/90 border border-rose-400 text-rose-100 text-xs font-bold shadow">E</kbd>
                              <span>Vuốt ve chú mèo</span>
                            </button>
                            <span className="text-slate-600">•</span>
                          </>
                        ) : (
                          <>
                            <span className="text-amber-200/90 text-xs font-semibold">Cần mở bưu kiện ở hòm thư trước khi vuốt ve mèo</span>
                            <span className="text-slate-600">•</span>
                          </>
                        )
                      ) : (
                        <span className="text-slate-300 text-xs">Đang ngồi suy ngẫm...</span>
                      )}
                      <button
                        onClick={() => setIsSitting(false)}
                        className="hover:text-rose-200 flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <kbd className="px-1.5 py-0.5 rounded bg-rose-950 border border-rose-500 text-rose-200 text-xs font-bold">S / ↓</kbd>
                        <span>Đứng dậy</span>
                      </button>
                    </div>
                  )}

                  {/* Standing near park bench before letter rip: ONLY show S to sit, completely hide E! (Task 2) */}
                  {!isSwinging && !isSitting && isNearCat && !hasLostLetter && (
                    <button
                      onClick={() => setIsSitting(true)}
                      className="flex items-center gap-1.5 text-amber-200 hover:text-white cursor-pointer font-bold active:scale-95 transition-all"
                    >
                      <kbd className="px-2 py-0.5 rounded bg-amber-900/90 border border-amber-400 text-amber-100 text-xs font-bold shadow">S / ↓</kbd>
                      <span>Ngồi nghỉ chân</span>
                    </button>
                  )}

                  {/* Standing near park bench after letter rip: can sit to contemplate (Task 2) */}
                  {!isSwinging && !isSitting && isNearCat && hasLostLetter && (
                    <button
                      onClick={() => setIsSitting(true)}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer active:scale-95 transition-all"
                    >
                      <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-600 text-slate-200 text-xs font-bold shadow">S / ↓</kbd>
                      <span>Ngồi nghỉ chân & suy ngẫm</span>
                    </button>
                  )}

                  {/* Standing near hill bench on Map 2: can sit to contemplate */}
                  {!isSwinging && !isSitting && isNearHillBench && (
                    <button
                      onClick={() => setIsSitting(true)}
                      className="flex items-center gap-1.5 text-pink-200 hover:text-white cursor-pointer active:scale-95 transition-all"
                    >
                      <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-600 text-slate-200 text-xs font-bold shadow">S / ↓</kbd>
                      <span>Ngồi nghỉ chân sườn đồi</span>
                    </button>
                  )}

                  {!isSwinging && !isSitting && !isNearCat && isNearSwing && (
                    <button
                      onClick={() => {
                        setIsSwinging(true);
                        SFX.swingWhoosh();
                      }}
                      className="flex items-center gap-2 text-slate-100 hover:text-white cursor-pointer active:scale-95 transition-all"
                    >
                      <kbd className="px-2 py-0.5 rounded bg-rose-900/90 border border-rose-400 text-rose-100 text-xs font-bold shadow">E</kbd>
                      <span>Lên xích đu gỗ</span>
                    </button>
                  )}

                  {/* Task 4: Streetlamp Fragment 1 reach FPV prompt */}
                  {isNearStreetlampFragment && (
                    <button
                      onClick={() => triggerFPVSpot('lamp-reach')}
                      className="flex items-center gap-2 text-amber-200 hover:text-white cursor-pointer active:scale-95 transition-all"
                    >
                      <kbd className="px-2 py-0.5 rounded bg-amber-900/90 border border-amber-400 text-amber-100 text-xs font-bold shadow">E</kbd>
                      <span>Nhảy với lấy Mảnh Thư #1</span>
                    </button>
                  )}

                  {/* Task 5: Paper boat fragment retrieval FPV prompt */}
                  {isNearPaperBoat && (
                    <button
                      onClick={() => triggerFPVSpot('boat-retrieve')}
                      className="flex items-center gap-2 text-cyan-200 hover:text-white cursor-pointer active:scale-95 transition-all"
                    >
                      <kbd className="px-2 py-0.5 rounded bg-cyan-900/90 border border-cyan-400 text-cyan-100 text-xs font-bold shadow">E</kbd>
                      <span>Vớt Thuyền Giấy Ký Ức</span>
                    </button>
                  )}

                  {/* Task 6: Forest cat calming FPV prompt */}
                  {isNearForestCat && (
                    <button
                      onClick={() => {
                        isPettingForestCatRef.current = true;
                        triggerFPVSpot('forest-cat-chase');
                      }}
                      className="flex items-center gap-2 text-pink-200 hover:text-white cursor-pointer active:scale-95 transition-all"
                    >
                      <kbd className="px-2 py-0.5 rounded bg-pink-900/90 border border-pink-400 text-pink-100 text-xs font-bold shadow">E</kbd>
                      <span>Dỗ dành Chú Mèo Dưới Gốc Sồi</span>
                    </button>
                  )}

                  {/* Task 7: Crafting Table prompt near summit */}
                  {isNearCraftingTable && collectedFragments.every(Boolean) && !isLetterCrafted && (
                    <button
                      onClick={() => setIsCraftingLetter(true)}
                      className="flex items-center gap-2 text-rose-200 hover:text-white cursor-pointer active:scale-95 transition-all"
                    >
                      <kbd className="px-2 py-0.5 rounded bg-rose-900/90 border border-rose-400 text-rose-100 text-xs font-bold shadow">E</kbd>
                      <span>Hàn gắn bức thư ký ức</span>
                    </button>
                  )}

                  {/* Summit reminder when letter not crafted yet */}
                  {heroX >= 2220 && !isLetterCrafted && (
                    <div className="flex items-center gap-2 text-pink-300">
                      <span>Đỉnh đồi vắng người... Cần hàn gắn bức thư ký ức trước để gặp bạn ấy!</span>
                    </div>
                  )}

                  {!isSwinging && !isSitting && !isNearCat && !isNearSwing && !isNearMailbox && !isNearStreetlampFragment && !isNearPaperBoat && !isNearForestCat && nearbyFPVSpot && (
                    <button
                      onClick={() => triggerFPVSpot(nearbyFPVSpot.id)}
                      className="flex items-center gap-2 text-slate-100 hover:text-rose-200 cursor-pointer active:scale-95 transition-all"
                    >
                      <kbd className="px-2 py-0.5 rounded bg-rose-900/90 border border-rose-400 text-rose-100 text-xs font-bold shadow">E</kbd>
                      <span>{nearbyFPVSpot.label}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 9. Thought Bubble */}
            <ThoughtBubble
              currentStory={currentStory}
              heroX={heroX}
              onDismiss={() => setCurrentStory(null)}
            />

            {/* 10. HUD (Rose & Letter Fragment Counters) */}
            {gameState === 'playing' && (
              <HUD
                collected={collectedIds.size}
                total={LEVEL.collectibles.length}
                hasLostLetter={hasLostLetter}
                collectedFragments={collectedFragments.filter(Boolean).length}
                totalFragments={3}
              />
            )}

            {/* 11. First-Person Vignettes */}
            {fpvScene && (
              <FirstPersonView
                scene={fpvScene}
                isForestCat={isPettingForestCatRef.current}
                onCatPet={() => {
                  if (fpvScene === 'forest-cat-chase' || (isPettingForestCatRef.current && !collectedFragments[2])) {
                    handleCollectFragment(2);
                    setCurrentStory({
                      flowerId: 96,
                      x: 1800,
                      text: 'Chú mèo khẽ dụi đầu kêu "gừ gừ" âu yếm rồi ngoan ngoãn nhả mảnh thư thứ 3 ra cho bạn!',
                    });
                  }
                }}
                onComplete={() => {
                  if (fpvScene === 'mailbox') {
                    setHasOpenedMailbox(true);
                  } else if (fpvScene === 'lamp-reach') {
                    handleCollectFragment(0);
                  } else if (fpvScene === 'boat-retrieve') {
                    handleCollectFragment(1);
                  } else if (fpvScene === 'forest-cat-chase') {
                    handleCollectFragment(2);
                    isPettingForestCatRef.current = false;
                  } else if (fpvScene === 'cat') {
                    setIsPettingCat(false);
                    if (isPettingForestCatRef.current) {
                      if (!collectedFragments[2]) {
                        handleCollectFragment(2);
                      }
                      isPettingForestCatRef.current = false;
                    } else {
                      // Benching cat petting at x = 450:
                      setIsSitting(false);
                      handleCollectItem(2);
                      if (!hasLostLetter) {
                        setHasLostLetter(true);
                        setIsChasingLetter(true);
                        SFX.paperRip();
                        setCurrentStory({
                          flowerId: 99,
                          x: 450,
                          text: 'Không thể nào! Bức thư mình nắn nót viết suốt bao đêm qua... Gió thổi bay mất rồi!... Phải đuổi theo tìm lại đủ các mảnh thư mới được!',
                        });
                        // Turn off flying fragment animation after 2.6 seconds
                        setTimeout(() => {
                          setIsChasingLetter(false);
                        }, 2600);
                      }
                    }
                  }
                  setFpvScene(null);
                }}
              />
            )}

            {/* 11.5. First-Person View: Letter Crafting Puzzle */}
            {isCraftingLetter && (
              <FpvLetterCrafting
                onComplete={() => {
                  setIsCraftingLetter(false);
                  setIsLetterCrafted(true);
                  setCurrentStory({
                    flowerId: 104,
                    x: 2210,
                    text: 'Bức thư đã được hàn gắn lại trọn vẹn bằng những đóa hoa anh đào... Cùng chạy nhanh tới ngọn đồi nơi cô ấy đang chờ!',
                  });
                  setIsAutoRunningToHill(true);
                }}
              />
            )}

            {/* 12. First-Person View: Cherry Blossom Reunion Scene */}
            {gameState === 'dialogue' && (
              <FirstPersonView
                scene="cherry-summit"
                onComplete={() => setGameState('ending')}
              />
            )}

            {/* 13. Cinematic Letterbox Bars for Ending */}
            {isCinematic && (
              <>
                <div className="absolute top-0 left-0 right-0 h-6 bg-black z-40 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-black z-40 transition-all duration-700" />
              </>
            )}

            {/* 14. Grand Ending Cutscene (Fireworks, Petal Rain, I LOVE U letter) */}
            {gameState === 'ending' && <EndingCutscene />}
          </>
        )}
      </Canvas>
    </>
  );
}
