'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

type GameState = 'title' | 'intro' | 'playing' | 'dialogue' | 'ending';
type MapId = 'valley' | 'hill';

interface TeleportTarget {
  label: string;
  x: number;
  map: MapId;
  icon: string;
}

const WAYPOINTS: TeleportTarget[] = [
  // Valley (Map 1)
  { label: 'Spawn đầu đường', x: 40,   map: 'valley', icon: '🏠' },
  { label: 'Hòm thư',         x: 200,  map: 'valley', icon: '📬' },
  { label: 'Ghế đá + Mèo',   x: 450,  map: 'valley', icon: '🐱' },
  { label: 'Xích đu',         x: 680,  map: 'valley', icon: '🎠' },
  { label: 'Vùng mưa',        x: 980,  map: 'valley', icon: '🌧️' },
  { label: 'Đèn đường (F1)',  x: 1150, map: 'valley', icon: '💡' },
  { label: 'Thuyền giấy (F2)',x: 1520, map: 'valley', icon: '🚢' },
  { label: 'Cầu sao đêm',    x: 1640, map: 'valley', icon: '🌉' },
  { label: 'Mèo rừng (F3)',  x: 1800, map: 'valley', icon: '🌿' },
  { label: 'Bàn ghép thư',   x: 2210, map: 'valley', icon: '✉️' },
  { label: 'Cuối Map 1',     x: 2380, map: 'valley', icon: '➡️' },
  // Hill (Map 2)
  { label: 'Đầu đồi',        x: 40,   map: 'hill',   icon: '⛰️' },
  { label: 'Ghế nghỉ đồi',   x: 940,  map: 'hill',   icon: '🪑' },
  { label: 'Gặp bạn gái',    x: 1990, map: 'hill',   icon: '💕' },
  { label: 'Đỉnh đồi',       x: 2100, map: 'hill',   icon: '🌸' },
];

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
  currentMap: MapId;
  heroX: number;
  onTeleport: (x: number, map: MapId) => void;
  onUnlockAll: () => void;
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
  currentMap,
  heroX,
  onTeleport,
  onUnlockAll,
}: AdminPanelProps) {
  const [customX, setCustomX] = useState(heroX);
  const [activeTab, setActiveTab] = useState<'state' | 'teleport'>('teleport');

  // Draggable state — start at top-right
  const panelRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null); // null = use CSS default

  // Sync slider with live heroX
  useEffect(() => {
    setCustomX(heroX);
  }, [heroX]);

  // Toggle open/close via keyboard
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

  // Drag handlers
  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag on header (not buttons)
    if ((e.target as HTMLElement).closest('button')) return;
    dragging.current = true;
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const panel = panelRef.current;
      if (!panel) return;
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      // Clamp within viewport
      const maxX = window.innerWidth - panel.offsetWidth;
      const maxY = window.innerHeight - panel.offsetHeight;
      setPos({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };
    const onMouseUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  if (!isOpen) return null;

  const stateLabels: Record<GameState, string> = {
    title: '🎬 Title',
    intro: '📖 Intro',
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

  const maxX = currentMap === 'valley' ? 2380 : 2160;

  // Compute position style
  const posStyle: React.CSSProperties = pos
    ? { position: 'fixed', left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' }
    : { position: 'fixed', top: 24, right: 24 };

  return (
    <div
      ref={panelRef}
      style={{ ...posStyle, zIndex: 999, width: 288 }}
      className="max-h-[88vh] overflow-y-auto bg-slate-900/97 text-slate-100 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col font-sans text-xs select-none"
    >
      {/* ── Header (drag handle) ── */}
      <div
        onMouseDown={onMouseDown}
        className="flex items-center justify-between border-b border-slate-700/80 px-3 py-2.5 sticky top-0 bg-slate-900/97 backdrop-blur-xl z-10 rounded-t-2xl cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">🛠️</span>
          <div>
            <h3 className="font-bold text-[12px] text-amber-400 leading-tight">Dev Tools</h3>
            <p className="text-[9px] text-slate-500 leading-tight">
              <kbd className="px-0.5 bg-black/40 rounded border border-slate-600 font-mono">~</kbd>
              {' / '}
              <kbd className="px-0.5 bg-black/40 rounded border border-slate-600 font-mono">F2</kbd>
              {' · kéo để di chuyển'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition cursor-pointer shrink-0"
        >
          ✕
        </button>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex border-b border-slate-700/60 shrink-0">
        {(['teleport', 'state'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-[10px] font-semibold transition cursor-pointer ${
              activeTab === tab
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'teleport' ? '🗺️ Teleport' : '⚙️ State'}
          </button>
        ))}
      </div>

      <div className="p-3 flex flex-col gap-2.5">

        {/* ── TAB: TELEPORT ── */}
        {activeTab === 'teleport' && (
          <>
            {/* Current position */}
            <div className="flex items-center justify-between bg-slate-800/70 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 text-[10px]">Vị trí hiện tại</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-slate-500 bg-slate-700/60 px-1.5 py-0.5 rounded">
                  {currentMap === 'valley' ? 'Map 1' : 'Map 2'}
                </span>
                <span className="font-mono text-amber-300 font-bold text-[11px]">x={Math.round(heroX)}</span>
              </div>
            </div>

            {/* Unlock All */}
            <button
              onClick={onUnlockAll}
              className="w-full py-1.5 px-2.5 rounded-lg font-bold text-[10px] cursor-pointer transition flex items-center justify-center gap-1 border"
              style={{
                background: 'linear-gradient(135deg, #7c3aed22, #db277722)',
                borderColor: '#a855f799',
                color: '#e879f9',
              }}
              title="Mở khóa: mailbox, mèo, mảnh thư, bàn ghép, hoa hồng"
            >
              <span>⚡</span>
              <span>Unlock All — Skip mọi ràng buộc</span>
            </button>

            {/* Custom X slider */}
            <div className="flex flex-col gap-1.5 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center">
                <label className="text-slate-300 font-medium text-[10px]">Toạ độ X</label>
                <span className="font-mono text-cyan-300 font-bold text-[11px]">{Math.round(customX)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={maxX}
                step={10}
                value={customX}
                onChange={(e) => setCustomX(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-1.5"
              />
              {/* Map selector + teleport */}
              <div className="flex gap-1.5 items-center">
                <div className="flex gap-1">
                  {(['valley', 'hill'] as MapId[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => onTeleport(customX, m)}
                      className={`px-2 py-1 rounded-md text-[9px] font-semibold cursor-pointer transition border ${
                        currentMap === m
                          ? 'border-cyan-500/60 bg-cyan-500/20 text-cyan-200'
                          : 'border-slate-600/50 bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {m === 'valley' ? 'Map 1' : 'Map 2'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => onTeleport(customX, currentMap)}
                  className="flex-1 py-1 rounded-md text-[10px] font-semibold cursor-pointer transition border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                >
                  🚀 Go
                </button>
              </div>
            </div>

            {/* Valley waypoints */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-wider">Map 1 — Valley</span>
                <div className="flex-1 h-px bg-slate-700/60" />
              </div>
              <div className="grid grid-cols-2 gap-1">
                {WAYPOINTS.filter((w) => w.map === 'valley').map((wp) => (
                  <button
                    key={`v-${wp.x}`}
                    onClick={() => onTeleport(wp.x, wp.map)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-medium cursor-pointer transition border border-slate-600/40 bg-slate-800/40 hover:bg-emerald-900/30 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-200"
                    title={`x=${wp.x}`}
                  >
                    <span className="shrink-0 text-[10px]">{wp.icon}</span>
                    <span className="truncate">{wp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hill waypoints */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-rose-500/80 uppercase tracking-wider">Map 2 — Hill</span>
                <div className="flex-1 h-px bg-slate-700/60" />
              </div>
              <div className="grid grid-cols-2 gap-1">
                {WAYPOINTS.filter((w) => w.map === 'hill').map((wp) => (
                  <button
                    key={`h-${wp.x}`}
                    onClick={() => onTeleport(wp.x, wp.map)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-medium cursor-pointer transition border border-slate-600/40 bg-slate-800/40 hover:bg-rose-900/30 hover:border-rose-500/40 text-slate-300 hover:text-rose-200"
                    title={`x=${wp.x}`}
                  >
                    <span className="shrink-0 text-[10px]">{wp.icon}</span>
                    <span className="truncate">{wp.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── TAB: GAME STATE ── */}
        {activeTab === 'state' && (
          <>
            {/* Game State switcher */}
            <div className="flex flex-col gap-2 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center">
                <label className="font-medium text-slate-200 text-[10px]">Game State:</label>
                <span className={`font-bold text-[11px] ${stateColors[gameState]}`}>
                  {stateLabels[gameState]}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {(['title', 'intro', 'playing', 'ending'] as GameState[]).map((state) => (
                  <button
                    key={state}
                    onClick={() => setGameState(state)}
                    className={`py-1 px-0.5 rounded-lg text-[9px] font-medium border cursor-pointer transition ${
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

            {/* Collectibles */}
            <div className="flex items-center justify-between bg-slate-800/60 px-2.5 py-2 rounded-xl border border-slate-700/50">
              <span className="font-medium text-slate-200 text-[10px]">Thu thập</span>
              <span className="text-[10px] text-amber-300 font-mono">
                🌹 {collectedCount}/{totalCollectibles}
              </span>
            </div>

            {/* Hitbox toggle */}
            <div className="flex items-center justify-between bg-slate-800/60 px-2.5 py-2 rounded-xl border border-slate-700/50">
              <div>
                <span className="font-medium text-slate-200 block text-[10px]">Hiện Hitbox</span>
                <span className="text-[9px] text-slate-500">Viền va chạm</span>
              </div>
              <button
                onClick={() => setShowHitbox(!showHitbox)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer border shrink-0 ${
                  showHitbox ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-700 border-slate-600'
                }`}
              >
                <span
                  className={`block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform absolute top-0.5 ${
                    showHitbox ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={onReset}
              className="w-full py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-600/70 cursor-pointer transition flex items-center justify-center gap-1 text-[10px]"
            >
              <span>🔄</span> Reset Game
            </button>
          </>
        )}
      </div>
    </div>
  );
}
