'use client';

import React, { useEffect } from 'react';

type GameState = 'title' | 'intro' | 'playing' | 'dialogue' | 'ending';

interface AdminPanelProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  showHitbox: boolean;
  setShowHitbox: (val: boolean) => void;
  onReset: () => void;
  collectedCount: number;
  totalCollectibles: number;
}

export default function AdminPanel({
  isOpen,
  setIsOpen,
  gameState,
  setGameState,
  showHitbox,
  setShowHitbox,
  onReset,
  collectedCount,
  totalCollectibles,
}: AdminPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '`' ||
        e.key === '~' ||
        e.key === 'F2' ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')
      ) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  if (!isOpen) return null;

  const stateLabels: Record<GameState, string> = {
    title: '🎬 Title Screen',
    intro: '📖 Intro Text',
    playing: '🎮 Playing',
    dialogue: '💬 Dialogue',
    ending: '💕 Ending',
  };

  const stateColors: Record<GameState, string> = {
    title: 'text-indigo-400',
    intro: 'text-amber-400',
    playing: 'text-emerald-400',
    dialogue: 'text-sky-400',
    ending: 'text-rose-400',
  };

  return (
    <div className="fixed top-6 right-6 z-[999] w-80 max-h-[85vh] overflow-y-auto bg-slate-900/95 text-slate-100 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-xl p-5 flex flex-col gap-4 font-sans text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛠️</span>
          <div>
            <h3 className="font-bold text-sm text-amber-400">Admin Panel</h3>
            <p className="text-[10px] text-slate-400">Met — Game Debug Tools</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Shortcut hint */}
      <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-2.5 text-[11px] text-amber-200/90 flex items-start gap-2">
        <span>💡</span>
        <span>
          Nhấn <kbd className="px-1 py-0.5 bg-black/40 rounded border border-amber-400/40 font-mono">~</kbd> hoặc <kbd className="px-1 py-0.5 bg-black/40 rounded border border-amber-400/40 font-mono">F2</kbd> để bật/ẩn panel.
        </span>
      </div>

      {/* Game State */}
      <div className="flex flex-col gap-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
        <div className="flex justify-between items-center">
          <label className="font-medium text-slate-200">Game State:</label>
          <span className={`font-bold text-sm ${stateColors[gameState]}`}>
            {stateLabels[gameState]}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {(['title', 'intro', 'playing', 'ending'] as GameState[]).map((state) => (
            <button
              key={state}
              onClick={() => setGameState(state)}
              className={`py-1.5 px-1 rounded-lg text-[10px] font-medium border cursor-pointer transition ${
                gameState === state
                  ? 'bg-amber-500/30 text-amber-300 border-amber-500/50'
                  : 'bg-slate-700/50 text-slate-400 border-slate-600/50 hover:bg-slate-700'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      {/* Collectibles info */}
      <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
        <div>
          <span className="font-medium text-slate-200 block">Thu thập</span>
          <span className="text-[10px] text-slate-400">
            🌹 {collectedCount}/{totalCollectibles} bông hoa
          </span>
        </div>
      </div>

      {/* Show Hitbox Toggle */}
      <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
        <div>
          <span className="font-medium text-slate-200 block">Hiện khung Hitbox</span>
          <span className="text-[10px] text-slate-400">Xem viền va chạm</span>
        </div>
        <button
          onClick={() => setShowHitbox(!showHitbox)}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer border ${
            showHitbox ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-700 border-slate-600'
          }`}
        >
          <span
            className={`block w-4 h-4 bg-white rounded-full shadow transition-transform absolute top-0.5 ${
              showHitbox ? 'left-5.5' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={onReset}
          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-600/70 shadow-sm cursor-pointer transition flex items-center justify-center gap-1.5"
        >
          <span>🔄</span> Reset Game về ban đầu
        </button>
      </div>
    </div>
  );
}
