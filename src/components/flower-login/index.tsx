'use client';

import React, { useState, useCallback } from 'react';
import FlowerLoginModal from './flower-login-modal';
import FlowerCanvas from './flower-canvas';
import { flowerEngine } from './particle-engine';
import { playSuccessBloomSound } from './sound';
import Game, { GameState } from '@/components/game';
import AdminPanel from '@/components/admin-panel';

type FlowState = 'locked' | 'blooming' | 'unlocked';

export default function FlowerLoginWrapper() {
  const [flowState, setFlowState] = useState<FlowState>('locked');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [initialScene, setInitialScene] = useState<GameState | undefined>(undefined);

  const handleSuccess = useCallback((origin: { x: number; y: number }) => {
    setFlowState('blooming');

    // 1. Play romantic chimes & harp
    playSuccessBloomSound();

    // 2. REQUIREMENT: Nở hoa từ trong ra ngoài (bông tâm trên cùng nở trước, các bông sau nở ở layer dưới)
    flowerEngine.triggerTrueRadialBloom(origin.x, origin.y, () => {
      setFlowState('unlocked');
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full select-none overflow-hidden">
      {/* 1. Real-time Canvas 2D Engine: Falling Gravity Flowers + True Radial Multi-Flower Bloom */}
      <FlowerCanvas />

      {/* 2. Dev Tools Panel on Lockscreen (Available via ~ or F2) */}
      {flowState !== 'unlocked' && (
        <AdminPanel
          isOpen={isAdminOpen}
          setIsOpen={setIsAdminOpen}
          mobilePreview={mobilePreview}
          setMobilePreview={setMobilePreview}
          isLockScreen={true}
          onBypassLock={(targetScene) => {
            if (targetScene) setInitialScene(targetScene);
            setFlowState('unlocked');
          }}
          onTriggerBloom={() => {
            handleSuccess({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
          }}
        />
      )}

      {/* 3. Cozy Pixel Art Login Modal (Thay thế vị trí ô game ban đầu) */}
      {flowState !== 'unlocked' && (
        <div
          className={`relative z-10 flex min-h-screen w-full items-center justify-center p-2 sm:p-4 landscape:p-1.5 transition-all duration-700 ${
            flowState === 'blooming'
              ? 'pointer-events-none scale-95 opacity-0'
              : 'scale-100 opacity-100'
          }`}
        >
          <FlowerLoginModal onSuccess={handleSuccess} correctPin="1406" />
        </div>
      )}

      {/* 4. The Original Game (Hiện ra sau khi toàn bộ hoa biến mất) */}
      {flowState === 'unlocked' && (
        <div className="relative z-10 flex min-h-screen w-full items-center justify-center animate-in fade-in duration-700">
          <Game
            initialScene={initialScene}
            onRelock={() => setFlowState('locked')}
          />
        </div>
      )}
    </div>
  );
}
