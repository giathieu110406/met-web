'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import PetalRain from './petal-rain';
import FpvRainEffect from './fpv-rain-effect';
import { SFX } from '@/lib/sound';

export type FPVSceneType =
  | 'mailbox'
  | 'cat'
  | 'rain'
  | 'lamp'
  | 'lamp-reach'
  | 'bridge'
  | 'boat-retrieve'
  | 'forest-cat-chase'
  | 'cherry-entrance'
  | 'cherry-summit';

interface FirstPersonViewProps {
  scene: FPVSceneType;
  onComplete: () => void;
  onCatPet?: () => void;
  isForestCat?: boolean;
}

interface DialogueLine {
  speaker?: string;
  text: string;
}

const MAILBOX_DIALOGUES: DialogueLine[] = [
  {
    text: 'Một bưu kiện gửi đến hòm thư... Là cuốn sách hôm trước cậu ấy nhắc tới!',
  },
  {
    text: "Mẩu giấy nhắn kẹp kèm theo... 'Đỉnh đồi Hoa Anh Đào'. Đây chính là địa chỉ nơi cậu ấy đang đợi!",
  },
  {
    text: 'Bức thư tình này mình đã nắn nót viết suốt bao đêm... Mình phải lên đường ngay để trao tận tay cậu ấy!',
  },
];

const CAT_BENCH_DIALOGUES: DialogueLine[] = [
  {
    text: 'Bộ lông ấm áp thật đấy... Ngoan quá. Mình đặt bức thư tỏ tình ở đây một chút nhé, nắn nót viết mãi mới xong đấy...',
  },
  {
    text: 'Ô kìa, chú mèo cựa mình vươn móng vuốt... Mèo ơi đừng cào vào phong bì thư!',
  },
  {
    text: 'Gió bất ngờ thổi thốc qua cuốn 3 mảnh thư bay vút đi! Chú mèo cũng giật mình phóng chạy... Mình phải đuổi theo ngay!',
  },
];

const FOREST_CAT_DIALOGUES: DialogueLine[] = [
  {
    text: 'Bắt được cậu rồi nhé nhóc con nghịch ngợm! Cậu đang ôm mảnh thư thứ 3 kìa...',
  },
  {
    text: 'Ngoan nào... để mình xoa đầu làm lành nhé. Cảm ơn nhóc đã nhả lại mảnh thư kỷ niệm cho mình.',
  },
];

const RAIN_DIALOGUES: DialogueLine[] = [
  {
    text: 'Tiếng mưa rơi tí tách trên mặt ô nghe thật êm đềm...',
  },
  {
    text: 'Chiếc ô này ngày ấy quá nhỏ cho cả hai... nhưng em lại cố tình nép sát vào vai anh. Mưa làm ướt một bên áo, mà tim anh lúc đó lại ấm lạ thường.',
  },
];

const LAMP_DIALOGUES: DialogueLine[] = [
  {
    text: 'Đã qua nửa chặng đường rồi... Sao tim mình đập nhanh thế này?',
  },
  {
    text: '"Chào em... hôm nay trời lạnh nhỉ? Anh mang hoa đến cho em này." — Nghe ngốc nghếch quá, nhưng chắc chỉ cần chân thành nói hết lòng mình là được rồi.',
  },
];

const LAMP_REACH_DIALOGUES: DialogueLine[] = [
  {
    text: 'Ánh đèn đường soi rọi qua màn mưa... Kìa, trên cành cây sát chao đèn có một mảnh giấy màu nâu!',
  },
  {
    text: "Đúng là Mảnh #1 rồi! 'Cậu có nhớ lần đầu tiên chúng mình ngồi trú mưa ở hiên quán cũ không? Cậu chia cho mình nửa chiếc bánh quy...' Mình phải nhảy lên lấy lại mới được!",
  },
  {
    text: 'Bắt được rồi! May quá, con chữ vẫn còn nguyên vẹn. Cố lên, mình sẽ tìm lại đủ cả 3 mảnh!',
  },
];

const BRIDGE_DIALOGUES: DialogueLine[] = [
  {
    text: 'Đứng trên cây cầu này nhìn xuống, dòng suối lặng lẽ trôi dưới ánh trăng vàng...',
  },
  {
    text: 'Những chú đom đóm dập dờn như ngàn vì sao lạc lối. Nhấn [E] để ngắm sao và gửi trao điều ước nhỏ...',
  },
];

const BRIDGE_WISHED_DIALOGUES: DialogueLine[] = [
  {
    text: 'Một ngôi sao băng vừa vút qua bầu trời xa! Kìa, những vì sao đang lấp lánh như hồi đáp lại...',
  },
  {
    text: 'Ước gì em cũng đang đứng ở đây cùng anh lúc này... Ước gì bức thư này sẽ mang chúng mình đến bên nhau.',
  },
];

const CHERRY_ENTRANCE_DIALOGUES: DialogueLine[] = [
  {
    text: 'Khu vườn hoa anh đào... Khung cảnh nơi đây rực rỡ và bình yên đến nghẹn ngào.',
  },
  {
    text: 'Từng cánh hoa đào đang rơi phấp phới trong làn gió xuân... Đẹp tựa như một giấc mơ vậy.',
  },
  {
    text: 'Cô ấy đang đứng đợi mình trên đỉnh đồi kia rồi. Mình phải bước tiếp lên gặp cậu ấy ngay!',
  },
];

const BOAT_RETRIEVE_DIALOGUES: DialogueLine[] = [
  {
    text: 'Một chiếc thuyền giấy đang trôi dưới suối đêm... Bên trong chở một mảnh thư!',
  },
  {
    text: "Mảnh #2: 'Có những đêm nghe cậu thở dài vì mệt mỏi, mình chỉ ước có thể mang cho cậu một ly trà ấm. Mình sợ sự vụng về làm phiền cậu, nên chỉ biết lặng lẽ thức cùng cậu...'",
  },
  {
    text: 'Từng con chữ ướt sương đêm nhưng vẫn vẹn nguyên tấm lòng... Chỉ còn một mảnh nữa thôi!',
  },
];

const FOREST_CAT_CHASE_DIALOGUES: DialogueLine[] = [
  {
    text: 'Chú mèo dừng lại rồi... Ngoan nào, đừng sợ, anh không làm đau em đâu.',
  },
  {
    text: "Mảnh #3: 'Hôm nay, mình gom hết tất cả sự can đảm tích cóp từ những ngày tháng ngắm nhìn cậu từ xa... Dù câu trả lời có là gì, cảm ơn cậu vì đã xuất hiện trong thanh xuân của mình.' Cả 3 mảnh đã đủ rồi!",
  },
  {
    text: 'Mình phải mang các mảnh thư tới chiếc bàn gỗ trước thềm đồi hoa anh đào để dán lại ngay!',
  },
];

const CHERRY_DIALOGUES: DialogueLine[] = [
  {
    speaker: 'Anh',
    text: 'Gió sớm khẽ lay lọn tóc em... Cuối cùng, anh cũng đã đến được nơi này.',
  },
  {
    speaker: 'Em',
    text: 'Em đã đợi anh rất lâu rồi... Thật mừng vì anh đã tới!',
  },
  {
    speaker: 'Anh',
    text: 'Gió bão dọc đường đã xé rách bức thư anh viết... Nhưng anh đã nhặt lại từng mảnh, dán lại phẳng phiu cùng 7 đóa hoa này gửi trao em.',
  },
  {
    speaker: 'Em',
    text: 'Từng vết dán hoa đào này... thật đẹp và ấm áp. Cảm ơn anh vì đã không bỏ cuộc để mang trọn vẹn chân thành đến đây cùng em!',
  },
];

export default function FirstPersonView({
  scene,
  onComplete,
  onCatPet,
  isForestCat = false,
}: FirstPersonViewProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // --- Cat Micro-Interaction State ---
  const [catPetProgress, setCatPetProgress] = useState(0);
  const [isCatExhaling, setIsCatExhaling] = useState(false);
  const [catHearts, setCatHearts] = useState<{ id: number; left: number; drift: number }[]>([]);
  const [isPurringRumble, setIsPurringRumble] = useState(false);

  // --- Lamp Reach Micro-Interaction State ---
  const [reachHops, setReachHops] = useState(0);
  const [isHopping, setIsHopping] = useState(false);

  // --- Boat Retrieval State ---
  const [boatLifted, setBoatLifted] = useState(false);

  // --- Starry Bridge State ---
  const [hasWished, setHasWished] = useState(false);
  const [isShootingStar, setIsShootingStar] = useState(false);
  const [burstStarsActive, setBurstStarsActive] = useState(false);

  // --- Lamp Warmth State ---
  const [warmth, setWarmth] = useState(25);
  const [steamPuffs, setSteamPuffs] = useState<{ id: number; left: number }[]>([]);

  let dialogues = BRIDGE_DIALOGUES;
  if (scene === 'mailbox') dialogues = MAILBOX_DIALOGUES;
  else if (scene === 'cat') dialogues = isForestCat ? FOREST_CAT_DIALOGUES : CAT_BENCH_DIALOGUES;
  else if (scene === 'rain') dialogues = RAIN_DIALOGUES;
  else if (scene === 'lamp') dialogues = LAMP_DIALOGUES;
  else if (scene === 'lamp-reach') dialogues = LAMP_REACH_DIALOGUES;
  else if (scene === 'bridge') dialogues = hasWished ? BRIDGE_WISHED_DIALOGUES : BRIDGE_DIALOGUES;
  else if (scene === 'boat-retrieve') dialogues = BOAT_RETRIEVE_DIALOGUES;
  else if (scene === 'forest-cat-chase') dialogues = FOREST_CAT_CHASE_DIALOGUES;
  else if (scene === 'cherry-entrance') dialogues = CHERRY_ENTRANCE_DIALOGUES;
  else if (scene === 'cherry-summit') dialogues = CHERRY_DIALOGUES;

  const currentLine = dialogues[lineIndex] || dialogues[0];

  // 1. Cat Breathing Cycle
  useEffect(() => {
    if (scene !== 'cat' && scene !== 'forest-cat-chase') return;
    const interval = setInterval(() => {
      setIsCatExhaling((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, [scene]);

  // 2. Play paper rip sound on cat dialogue transition to line 1
  useEffect(() => {
    if (scene === 'cat' && !isForestCat && lineIndex === 1) {
      SFX.paperRip();
    }
  }, [scene, isForestCat, lineIndex]);

  // 3. Warmth Decay for Lamp
  useEffect(() => {
    if (scene !== 'lamp') return;
    const interval = setInterval(() => {
      setWarmth((w) => Math.max(15, w - 2));
    }, 600);
    return () => clearInterval(interval);
  }, [scene]);

  // Typewriter effect for dialogues
  useEffect(() => {
    if (!currentLine) return;
    setDisplayedText('');
    setIsTyping(true);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < currentLine.text.length) {
        setDisplayedText(currentLine.text.slice(0, idx + 1));
        idx++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [currentLine]);

  // Advance dialogue or close
  const handleAdvance = useCallback(() => {
    if (isFadingOut) return;

    if (isTyping) {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      return;
    }

    // Task 2: In bench cat scene, cannot advance manually before petting is complete
    if (scene === 'cat' && !isForestCat && lineIndex === 0) {
      return;
    }

    if (lineIndex < dialogues.length - 1) {
      setLineIndex((prev) => prev + 1);
    } else {
      setIsFadingOut(true);
      setTimeout(() => {
        onComplete();
      }, 400);
    }
  }, [isTyping, lineIndex, dialogues.length, currentLine, isFadingOut, onComplete, scene, isForestCat]);

  // Micro-action: Stroke the cat
  const handlePetCat = useCallback(() => {
    onCatPet?.();
    const isExhaling = isCatExhaling;
    const increment = isExhaling ? 35 : 20;

    setCatPetProgress((p) => {
      const next = Math.min(100, p + increment);
      // Task 2: When petting reaches 100%, trigger letter rip and move to cutscene (lineIndex 1)
      if (next >= 100 && scene === 'cat' && !isForestCat && lineIndex === 0) {
        setTimeout(() => {
          SFX.paperRip();
          setLineIndex(1);
        }, 350);
      }
      return next;
    });

    if (isExhaling) {
      SFX.catPurr();
      setIsPurringRumble(true);
      setTimeout(() => setIsPurringRumble(false), 450);

      setCatHearts((prev) => [
        ...prev.slice(-6),
        { id: Date.now(), left: 45 + Math.random() * 12, drift: -10 + Math.random() * 20 },
      ]);
    } else {
      SFX.catMeowShort();
    }
  }, [isCatExhaling, onCatPet, scene, isForestCat, lineIndex]);

  // Micro-action: Hop and reach for Fragment #1
  const handleLampReachHop = useCallback(() => {
    setIsHopping(true);
    setReachHops((prev) => {
      const next = prev + 1;
      if (next < 3) {
        SFX.jump();
      } else {
        SFX.paperPickup();
      }
      return next;
    });
    setTimeout(() => setIsHopping(false), 300);
  }, []);

  // Micro-action: Scoop boat from water
  const handleBoatRetrieve = useCallback(() => {
    if (!boatLifted) {
      setBoatLifted(true);
      SFX.boatSplosh();
    } else {
      SFX.paperPickup();
    }
  }, [boatLifted]);

  // Micro-action: Warm hands
  const handleWarmHands = useCallback(() => {
    setWarmth((w) => {
      const next = Math.min(100, w + 18);
      if (next >= 100 && w < 100) {
        SFX.harpChime();
      }
      return next;
    });

    setSteamPuffs((prev) => [
      ...prev.slice(-4),
      { id: Date.now(), left: 48 + (Math.random() * 8 - 4) },
    ]);
  }, []);

  // Generalized Interaction Trigger (Click or Space)
  const handleInteraction = useCallback(() => {
    if (scene === 'mailbox') {
      SFX.paperPickup();
    } else if (scene === 'cat') {
      handlePetCat();
    } else if (scene === 'lamp-reach') {
      handleLampReachHop();
    } else if (scene === 'boat-retrieve') {
      handleBoatRetrieve();
    } else if (scene === 'forest-cat-chase') {
      handlePetCat();
    } else if (scene === 'lamp') {
      handleWarmHands();
    } else if (scene === 'rain') {
      SFX.umbrellaTap();
    } else if (scene === 'bridge') {
      SFX.harpChime();
      setHasWished(true);
      setIsShootingStar(true);
      setBurstStarsActive(true);
      setTimeout(() => setBurstStarsActive(false), 1600);
      setTimeout(() => setIsShootingStar(false), 2000);
      setLineIndex(0);
    } else if (scene === 'cherry-entrance' || scene === 'cherry-summit') {
      SFX.harpChime();
      handleAdvance();
    }
  }, [scene, handlePetCat, handleLampReachHop, handleBoatRetrieve, handleWarmHands, handleAdvance]);

  // One-shot latch state: guarantees 1 press = 1 skip, then self-cuts off ("tự ngắt")
  const isRightKeyHeldRef = useRef(false);
  const mountTimeRef = useRef(Date.now());
  const lastAdvanceTimeRef = useRef(0);

  const triggerAdvanceOneShot = useCallback(() => {
    const now = Date.now();
    if (now - lastAdvanceTimeRef.current < 250) return;
    lastAdvanceTimeRef.current = now;
    handleAdvance();
  }, [handleAdvance]);

  // Keyboard navigation & interaction shortcuts ([E] for action, [➔] or [Enter] to advance)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // [E] key triggers the scene action
      if (key === 'e') {
        e.preventDefault();
        if (e.repeat) return;
        handleInteraction();
        return;
      }

      // [ArrowRight] or [Enter] advances dialogue line
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        if (e.repeat || isRightKeyHeldRef.current) return;
        if (Date.now() - mountTimeRef.current < 350) return;

        isRightKeyHeldRef.current = true;
        triggerAdvanceOneShot();
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        isRightKeyHeldRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleInteraction, triggerAdvanceOneShot]);

  return (
    <div
      className={`absolute inset-0 z-50 overflow-hidden select-none transition-opacity duration-400 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        animation: 'fpv-fade-in 0.4s ease-out forwards',
      }}
    >
      {/* ========================================================================= */}
      {/* SCENE 0: MAILBOX & BOOK PARCEL WITH ADDRESS (FIRST PERSON)               */}
      {/* ========================================================================= */}
      {scene === 'mailbox' && (
        <div className="absolute inset-0 w-full h-full bg-[#18111e] flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full max-w-[640px] max-h-[400px]">
            <Image
              src="/assets/others/fpv-mailbox-parcel.jpg"
              alt="Mailbox Parcel First Person"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 1: PETTING THE CAT & LETTER RIP COMIC CUTSCENE                     */}
      {/* ========================================================================= */}
      {scene === 'cat' && (
        <div className="absolute inset-0 w-full h-full bg-[#fdfbf7] flex items-center justify-center overflow-hidden">
          {/* Floating Hearts upon Successful Pet */}
          {catHearts.map((h) => (
            <div
              key={h.id}
              className="absolute text-rose-500 text-2xl pointer-events-none select-none z-30 font-bold"
              style={{
                left: `${h.left}%`,
                top: '35%',
                '--drift-x': `${h.drift}px`,
                animation: 'heart-float-up 1.2s ease-out forwards',
              } as React.CSSProperties}
            >
              ♥
            </div>
          ))}

          {/* Line 0: Petting Cat on Bench (Stable, no stretch/squash/breathing) */}
          {lineIndex === 0 && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handlePetCat();
              }}
              className="relative w-full h-full cursor-pointer flex items-center justify-center select-none"
            >
              <div
                className="relative w-full h-full max-w-[620px] max-h-[380px]"
              >
                <Image
                  src="/assets/others/fpv-cat-storybook.png"
                  alt="Petting Cat Storybook"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          )}

          {/* Line 1: Comic cutscene - Cat scratches letter into 3 pieces */}
          {lineIndex === 1 && (
            <div className="relative w-full h-full max-w-[640px] max-h-[400px] animate-fade-in">
              <Image
                src="/assets/others/cutscene-letter-rip.jpg"
                alt="Cat Scratches Letter Cutscene"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Line 2: Comic cutscene - Wind blows fragments, cat runs away, boy chases */}
          {lineIndex >= 2 && (
            <div className="relative w-full h-full max-w-[640px] max-h-[400px] animate-fade-in">
              <Image
                src="/assets/others/cutscene-cat-chase.jpg"
                alt="Cat Chase Cutscene"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 2: STANDING IN RAIN WITH RED UMBRELLA                               */}
      {/* ========================================================================= */}
      {scene === 'rain' && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 45%, #020617 100%)',
            }}
          >
            <FpvRainEffect />

            {/* Overarching Retro Pixel Umbrella Canopy (framing top strip and extending down left and right sides) */}
            <div className="absolute top-0 inset-x-0 w-full pointer-events-none z-20">
              <Image
                src="/assets/others/fpv-umbrella-canopy-pixel.png"
                alt="Retro Pixel Umbrella Canopy"
                width={640}
                height={280}
                className="w-full h-auto object-cover"
                style={{
                  imageRendering: 'pixelated',
                  filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.85))',
                }}
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 3: UNDER TALL STREETLAMP & JUMPING TO REACH FRAGMENT #1             */}
      {/* ========================================================================= */}
      {scene === 'lamp-reach' && (
        <div className="absolute inset-0 w-full h-full bg-[#110e1a] flex items-center justify-center overflow-hidden">
          <div
            className="relative w-full h-full max-w-[640px] max-h-[400px] transition-transform duration-300"
            style={{
              transform: isHopping ? 'translateY(-24px) scale(1.02)' : 'translateY(0px)',
            }}
          >
            <Image
              src="/assets/others/fpv-lamp-reach.jpg"
              alt="Reaching for Fragment #1 on Tall Lamp"
              fill
              className="object-cover"
              priority
            />

            {/* Hint overlay on screen */}
            {reachHops < 2 && (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-[#1a0f2e]/90 text-amber-200 text-xs px-2.5 py-0.5 border border-amber-400/80 animate-bounce font-mono">
                ✨ Nhấn [E] để nhảy với lấy mảnh thư!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 3B: WARMING HANDS UNDER LAMP                                        */}
      {/* ========================================================================= */}
      {scene === 'lamp' && (
        <div className="absolute inset-0 w-full h-full">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #090d16 0%, #111827 50%, #030712 100%)',
            }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none transition-all duration-300"
              style={{
                background: `radial-gradient(ellipse 65% 80% at 50% 0%, rgba(251, 242, 54, ${0.3 + warmth * 0.002}) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 75%)`,
              }}
            />

            {steamPuffs.map((p) => (
              <div
                key={p.id}
                className="absolute text-yellow-100 text-xs pointer-events-none select-none opacity-60 z-30"
                style={{
                  left: `${p.left}%`,
                  top: '42%',
                  animation: 'steam-rise 1.4s ease-out forwards',
                }}
              >
                ♨
              </div>
            ))}

            <div
              onClick={(e) => {
                e.stopPropagation();
                handleWarmHands();
              }}
              className="absolute top-[40px] left-1/2 -translate-x-1/2 cursor-pointer transition-transform active:scale-98 select-none"
              style={{
                animation: 'title-float 3.2s ease-in-out infinite alternate',
              }}
            >
              <div className="relative w-[400px] h-[267px]">
                <Image
                  src="/assets/others/fpv-lamp-hands-storybook.png"
                  alt="Hands Holding Rose Under Lamp"
                  fill
                  className="object-contain"
                  style={{
                    filter: `drop-shadow(0 4px 20px rgba(251, 191, 36, ${0.45 + warmth * 0.005}))`,
                  }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 4: RETRIEVING PAPER BOAT WITH FRAGMENT #2 ON MOONLIT STREAM         */}
      {/* ========================================================================= */}
      {scene === 'boat-retrieve' && (
        <div className="absolute inset-0 w-full h-full bg-[#080d1a] flex items-center justify-center overflow-hidden">
          <div
            className="relative w-full h-full max-w-[640px] max-h-[400px] transition-all duration-500"
            style={{
              transform: boatLifted ? 'translateY(-12px)' : 'translateY(0px)',
            }}
          >
            <Image
              src="/assets/others/fpv-boat-retrieval.jpg"
              alt="Retrieving Paper Boat with Fragment #2"
              fill
              className="object-cover"
              priority
            />

            {!boatLifted && (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-[#061b2e]/90 text-cyan-200 text-xs px-2.5 py-0.5 border border-cyan-400/80 animate-bounce font-mono">
                ⛵ Nhấn [E] để vớt thuyền giấy lên bờ!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 4B: RETRO PIXEL STARRY NIGHT BRIDGE                                 */}
      {/* ========================================================================= */}
      {scene === 'bridge' && (
        <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
          {/* Authentic 16-bit Storybook Pixel Art Background */}
          <div className="absolute inset-0">
            <Image
              src="/assets/others/fpv-bridge-starry.jpg"
              alt="Retro Pixel Starry Night Bridge"
              fill
              className="object-cover"
              priority
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Shimmering / Twinkling Star Overlays across the sky (Thin & Delicate) */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { x: 16, y: 10, size: 13, delay: 0 },
              { x: 30, y: 7, size: 10, delay: 1.2 },
              { x: 44, y: 15, size: 14, delay: 0.6 },
              { x: 58, y: 9, size: 11, delay: 1.8 },
              { x: 73, y: 13, size: 13, delay: 0.9 },
              { x: 86, y: 10, size: 11, delay: 2.1 },
              { x: 25, y: 20, size: 10, delay: 1.5 },
              { x: 65, y: 18, size: 12, delay: 0.3 },
            ].map((star, i) => (
              <div
                key={i}
                className="absolute animate-pulse select-none flex items-center justify-center"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animationDuration: `${2.0 + (i % 3) * 0.7}s`,
                  animationDelay: `${star.delay}s`,
                }}
              >
                <svg viewBox="-8 -8 16 16" className="w-full h-full drop-shadow-[0_0_3px_rgba(254,240,138,0.7)]">
                  <line x1="0" y1="-7" x2="0" y2="7" stroke="#fef08a" strokeWidth="0.8" strokeLinecap="round" />
                  <line x1="-7" y1="0" x2="7" y2="0" stroke="#fef08a" strokeWidth="0.8" strokeLinecap="round" />
                  <polygon points="0,-1.5 1.5,0 0,1.5 -1.5,0" fill="#ffffff" />
                </svg>
              </div>
            ))}
          </div>

          {/* Special Stars Bursting / Flaring on [E] (Slender, Delicate 4-Point Flares) */}
          {burstStarsActive && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {[
                { x: 26, y: 14, size: 22, delay: 0 },
                { x: 42, y: 10, size: 20, delay: 0.1 },
                { x: 56, y: 16, size: 24, delay: 0.2 },
                { x: 70, y: 12, size: 20, delay: 0.15 },
                { x: 84, y: 20, size: 18, delay: 0.05 },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="absolute animate-star-burst select-none flex items-center justify-center"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: `${s.size}px`,
                    height: `${s.size}px`,
                    animationDelay: `${s.delay}s`,
                  }}
                >
                  <svg viewBox="-12 -12 24 24" className="w-full h-full drop-shadow-[0_0_5px_rgba(254,240,138,0.9)]">
                    <line x1="0" y1="-11" x2="0" y2="11" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" />
                    <line x1="-11" y1="0" x2="11" y2="0" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" />
                    <line x1="-4" y1="-4" x2="4" y2="4" stroke="#7dd3fc" strokeWidth="0.6" strokeLinecap="round" opacity="0.8" />
                    <line x1="-4" y1="4" x2="4" y2="-4" stroke="#7dd3fc" strokeWidth="0.6" strokeLinecap="round" opacity="0.8" />
                    <polygon points="0,-2.5 2,0 0,2.5 -2,0" fill="#fef08a" />
                  </svg>
                </div>
              ))}
            </div>
          )}

          {/* Shooting Star: Thin, delicate luminous filament gliding horizontally across sky */}
          {isShootingStar && (
            <div
              className="absolute top-[13%] right-[8%] pointer-events-none z-20 animate-shooting-star"
            >
              <div className="relative flex items-center">
                {/* Tiny luminous star head */}
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fef08a,0_0_12px_#7dd3fc]" />
                {/* Slender horizontal luminous trail */}
                <div
                  className="h-[1.5px] w-24 origin-left"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(254,240,138,0.7) 20%, rgba(125,211,252,0.35) 55%, transparent 100%)',
                    filter: 'drop-shadow(0 0 2px rgba(254,240,138,0.5))',
                  }}
                />
              </div>
            </div>
          )}

          {/* Floating Fireflies drifting near the water */}
          {[
            { left: 30, top: 62, delay: 0 },
            { left: 48, top: 58, delay: 1.2 },
            { left: 66, top: 64, delay: 0.6 },
            { left: 82, top: 60, delay: 1.8 },
          ].map((ff, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_8px_#fef08a] pointer-events-none"
              style={{
                left: `${ff.left}%`,
                top: `${ff.top}%`,
                animation: `title-float ${2.4 + i * 0.4}s ease-in-out infinite alternate`,
                animationDelay: `${ff.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 5: CALMING FOREST CAT UNDER OAK TREE & RECOVERING FRAGMENT #3       */}
      {/* ========================================================================= */}
      {scene === 'forest-cat-chase' && (
        <div className="absolute inset-0 w-full h-full bg-[#0c1322] flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full max-w-[640px] max-h-[400px]">
            <Image
              src="/assets/others/fpv-cat-recover.jpg"
              alt="Calming Forest Cat to Recover Fragment #3"
              fill
              className="object-cover"
              priority
            />

            {/* Heart particles */}
            {catHearts.map((h) => (
              <div
                key={h.id}
                className="absolute text-pink-400 text-2xl pointer-events-none select-none z-30 font-bold"
                style={{
                  left: `${h.left}%`,
                  top: '30%',
                  '--drift-x': `${h.drift}px`,
                  animation: 'heart-float-up 1.2s ease-out forwards',
                } as React.CSSProperties}
              >
                ♥
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 5.5: ENTRANCE TO CHERRY BLOSSOM GARDEN (PANORAMIC FIRST PERSON)     */}
      {/* ========================================================================= */}
      {scene === 'cherry-entrance' && (
        <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
          {/* Authentic 16-bit Storybook Pixel Art Background */}
          <div className="absolute inset-0">
            <Image
              src="/assets/others/fpv-cherry-garden-entrance.jpg"
              alt="Cherry Blossom Garden Entrance"
              fill
              className="object-cover"
              priority
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Gentle Petal Rain and Drifting Blossom Overlay */}
          <PetalRain active={true} />

          {/* Floating glowing sakura petals drifting close to screen */}
          {[
            { left: 15, top: 30, delay: 0 },
            { left: 30, top: 50, delay: 1.1 },
            { left: 68, top: 36, delay: 0.7 },
            { left: 82, top: 58, delay: 1.5 },
            { left: 48, top: 22, delay: 2.0 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute text-pink-300 font-bold text-lg pointer-events-none animate-pulse select-none"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.delay}s`,
                textShadow: '0 0 8px rgba(244, 114, 182, 0.8)',
              }}
            >
              🌸
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCENE 6: CHERRY SUMMIT REUNION (STORYBOOK PIXEL ART FIRST PERSON)         */}
      {/* ========================================================================= */}
      {scene === 'cherry-summit' && (
        <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
          {/* Authentic 16-bit Storybook Pixel Art Climax Illustration */}
          <div className="absolute inset-0">
            <Image
              src="/assets/others/fpv-cherry-summit-reunion.jpg"
              alt="Cherry Summit Reunion"
              fill
              className="object-cover"
              priority
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          {/* Drifting Petals & Sunlight Aura */}
          <PetalRain active={true} />

          {/* Gentle Sparkles of emotion around the moment */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { left: 42, top: 38, delay: 0 },
              { left: 56, top: 44, delay: 1.2 },
              { left: 32, top: 62, delay: 0.6 },
              { left: 68, top: 58, delay: 1.8 },
            ].map((sp, i) => (
              <div
                key={i}
                className="absolute text-amber-200 text-sm animate-pulse select-none"
                style={{
                  left: `${sp.left}%`,
                  top: `${sp.top}%`,
                  animationDelay: `${sp.delay}s`,
                  textShadow: '0 0 8px rgba(254, 240, 138, 0.9)',
                }}
              >
                ✨
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 16-BIT RETRO PIXEL ART DIALOGUE BOX (Compact, Low-Profile, High-Legibility) */}
      {/* ========================================================================= */}
      {(() => {
        let actionLabel: string | null = null;
        if (scene === 'cat') actionLabel = isForestCat ? 'Vuốt ve mèo' : 'Vuốt ve mèo';
        else if (scene === 'forest-cat-chase') actionLabel = 'Dỗ dành mèo';
        else if (scene === 'lamp-reach') actionLabel = 'Nhảy với thư';
        else if (scene === 'boat-retrieve') actionLabel = 'Vớt thuyền';
        else if (scene === 'lamp') actionLabel = 'Sưởi ấm';
        else if (scene === 'rain') actionLabel = 'Lắng nghe';
        else if (scene === 'bridge') actionLabel = hasWished ? 'Ước thêm lần nữa' : 'Ngắm sao & Ước';
        else if (scene === 'cherry-entrance') actionLabel = null;
        else if (scene === 'cherry-summit') actionLabel = 'Trao hoa & thư';

        return (
          <div
            className="absolute bottom-2 left-0 right-0 mx-auto w-[96%] max-w-[570px] z-40 select-none"
            style={{
              animation: 'subtitle-appear 0.25s ease-out',
            }}
          >
            <div
              className="relative px-3 py-1.5 shadow-2xl backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(9, 7, 18, 0.94)',
                border: '2px solid #e2b77a',
                boxShadow: '0 0 0 1px #2d1808, 0 4px 16px rgba(0, 0, 0, 0.85)',
                imageRendering: 'pixelated',
              }}
            >
              <div className="flex items-center justify-between gap-2.5 min-h-[30px]">
                <p
                  className="leading-tight flex items-center flex-wrap flex-1"
                  style={{
                    color: '#fef3c7',
                    fontFamily: "'VT323', monospace",
                    fontSize: '17px',
                    letterSpacing: '0.02em',
                    textShadow: '1px 1px 0px #000',
                  }}
                >
                  {scene === 'cherry-summit' && currentLine.speaker && (
                    <span
                      className="font-bold mr-1.5 select-none"
                      style={{
                        color: currentLine.speaker === 'Anh' ? '#93c5fd' : '#f472b6',
                      }}
                    >
                      [{currentLine.speaker}]
                    </span>
                  )}
                  <span>{displayedText}</span>
                  {isTyping && (
                    <span
                      className="inline-block ml-1"
                      style={{
                        width: '6px',
                        height: '2px',
                        backgroundColor: '#f472b6',
                        animation: 'title-blink 0.5s step-end infinite',
                      }}
                    />
                  )}
                </p>

                <div className="shrink-0 flex items-center gap-1.5 select-none">
                  {/* Action key indicator: Pixel badge [E] */}
                  {actionLabel && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInteraction();
                      }}
                      className="px-2 py-0.5 bg-[#451a03] hover:bg-[#78350f] border border-[#f59e0b] text-[#fef3c7] text-xs font-bold flex items-center gap-1 cursor-pointer active:translate-y-0.5 transition-transform"
                      style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: '13px',
                        boxShadow: '1px 1px 0px #000',
                      }}
                    >
                      <span className="text-[#fbbf24] font-bold">[E]</span>
                      <span>{actionLabel}</span>
                    </button>
                  )}

                  {/* Advance button: Pixel badge [➔] */}
                  {/* Task 2: Hide Advance button during bench cat petting until letter is torn (lineIndex >= 1) */}
                  {!(scene === 'cat' && !isForestCat && lineIndex === 0) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerAdvanceOneShot();
                      }}
                      className="px-2.5 py-0.5 bg-[#1e1b4b] hover:bg-[#312e81] border border-[#a855f7] text-[#f3e8ff] text-xs font-bold flex items-center gap-1 cursor-pointer active:translate-y-0.5 transition-transform"
                      style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: '13px',
                        boxShadow: '1px 1px 0px #000',
                      }}
                      title="Bấm nút hoặc phím [➔] để tiếp tục"
                    >
                      <span>{lineIndex < dialogues.length - 1 ? 'Tiếp' : 'Xong'}</span>
                      <span className="text-[#f472b6]">➔</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
