'use client';

/* Sprite images use native img: tiny local sprites must switch synchronously in the loop. */
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from 'react';
import Canvas from './canvas';
import { useGameLoop } from '@/hooks/use-game-loop';
import { resumeAudio, SFX, BGM } from '@/lib/sound';
import { Action, GARDEN, ENEMIES, UPGRADES, RECORD_KEY, RunState, advance, beginTutorial, beginWave, chooseUpgrade, newInput, newRun, parseRecords } from '@/lib/survival';
import './survival.css';

const KEYS: Record<string, Action> = { KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right', Space: 'jump', ArrowUp: 'jump', KeyJ: 'attack', KeyK: 'dash', KeyL: 'special' };
const ACTIONS: { action: Action; label: string; icon: string; key: string }[] = [
  { action: 'left', label: 'Sang trái', icon: '←', key: 'A' }, { action: 'right', label: 'Sang phải', icon: '→', key: 'D' },
  { action: 'jump', label: 'Nhảy', icon: '↑', key: 'Space' }, { action: 'attack', label: 'Đánh', icon: '☂', key: 'J' },
  { action: 'dash', label: 'Lướt', icon: '»', key: 'K' }, { action: 'special', label: 'Cánh hoa', icon: '✧', key: 'L' },
];
function clock(seconds: number) { const n = Math.max(0, Math.ceil(seconds)); return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`; }
const ASSETS = ['garden', 'leaf', 'firefly', 'thorn', 'boss', 'hero-attack', 'hero-dash'].map(name => `/assets/survival/${name}.png`);

export default function SurvivalGame({ onExit }: { onExit: () => void }) {
  const run = useRef<RunState>(newRun());
  const input = useRef(newInput());
  const sources = useRef(new Map<string, Action>());
  const accumulator = useRef(0);
  const [s, setSnapshot] = useState<RunState>(() => newRun());
  const [muted, setMuted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [assetError, setAssetError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [record, setRecord] = useState(() => { try { return parseRecords(localStorage.getItem(RECORD_KEY))[GARDEN.id] || { best: 0, wins: 0 }; } catch { return { best: 0, wins: 0 }; } });
  const [storageError, setStorageError] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const publish = useCallback(() => { const r = run.current; setSnapshot({ ...r, player: { ...r.player }, enemies: r.enemies.map(e => ({ ...e })), projectiles: r.projectiles.map(b => ({ ...b })), hazards: r.hazards.map(h => ({ ...h })) }); }, []);
  const clearInput = useCallback(() => { sources.current.clear(); input.current.held.clear(); input.current.queued.clear(); accumulator.current = 0; }, []);
  const pause = useCallback(() => {
    clearInput();
    if (run.current.phase !== 'welcome' && run.current.phase !== 'result') { run.current.paused = true; publish(); }
  }, [clearInput, publish]);
  const dispatch = useCallback((action: Action, down: boolean, source: string) => {
    if (down) {
      if (run.current.paused || !['wave', 'boss', 'tutorial'].includes(run.current.phase)) return;
      if (!sources.current.has(source)) input.current.queued.add(action);
      sources.current.set(source, action); input.current.held.add(action);
    } else {
      sources.current.delete(source);
      if (![...sources.current.values()].includes(action)) input.current.held.delete(action);
    }
  }, []);
  useEffect(() => {
    let cancelled = false;
    const images = [...ASSETS, '/assets/character/hero-umbrella-idle.png', '/assets/others/rose-item.png', '/assets/others/cat-sleep.png'];
    Promise.all(images.map(src => new Promise<void>((resolve, reject) => {
      const img = new Image(); img.onload = () => resolve(); img.onerror = () => reject(new Error(src)); img.src = src;
    }))).then(() => { if (!cancelled) setLoaded(true); }).catch(() => { if (!cancelled) setAssetError(true); });
    return () => { cancelled = true; };
  }, [loadAttempt]);
  useEffect(() => {
    BGM.stop();
    return () => BGM.stop();
  }, []);
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || (e.target instanceof HTMLElement && e.target.matches('input,textarea,select'))) return;
      if (e.code === 'Escape') { e.preventDefault(); if (!e.repeat) pause(); return; }
      const action = KEYS[e.code];
      if (action && ['wave', 'boss', 'tutorial'].includes(run.current.phase) && !run.current.paused) {
        e.preventDefault(); if (!e.repeat) { resumeAudio(); dispatch(action, true, e.code); }
      }
    };
    const keyup = (e: KeyboardEvent) => { const action = KEYS[e.code]; if (action) dispatch(action, false, e.code); };
    const visibility = () => { if (document.hidden) pause(); };
    window.addEventListener('keydown', keydown); window.addEventListener('keyup', keyup);
    window.addEventListener('blur', pause); document.addEventListener('visibilitychange', visibility);
    return () => { clearInput(); window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup); window.removeEventListener('blur', pause); document.removeEventListener('visibilitychange', visibility); };
  }, [dispatch, clearInput, pause]);
  useEffect(() => { overlay.current?.focus(); }, [s.phase, s.paused]);
  useGameLoop(delta => {
    const before = run.current.phase;
    accumulator.current = advance(run.current, input.current, delta * 16.67 / 1000, accumulator.current);
    if (run.current.phase !== before) clearInput();
    if (before !== 'result' && run.current.result) {
      try {
        const all = parseRecords(localStorage.getItem(RECORD_KEY));
        const previous = all[GARDEN.id] || { best: 0, wins: 0 };
        const result = run.current.result;
        const next = { best: Math.max(previous.best, result.score), wins: previous.wins + Number(result.won) };
        localStorage.setItem(RECORD_KEY, JSON.stringify({ ...all, [GARDEN.id]: next })); setRecord(next);
      } catch { setStorageError(true); }
    }
    if (run.current.cue && !muted) {
      if (run.current.cue === 'special' || run.current.cue === 'win') SFX.flowerBloom();
      else if (run.current.cue === 'hit') SFX.jump();
      else SFX.click();
    }
    publish();
  }, loaded && !s.paused && s.phase !== 'welcome' && s.phase !== 'result');

  function start() { resumeAudio(); clearInput(); run.current = newRun(); beginTutorial(run.current); publish(); }
  function resume() { resumeAudio(); clearInput(); run.current.paused = false; publish(); }
  function select(index: number) { clearInput(); chooseUpgrade(run.current, index); publish(); }
  const blocked = useCallback((value: boolean) => { if (value) pause(); }, [pause]);
  const p = s.player, boss = s.enemies.find(e => e.kind === 'boss');
  const playable = ['tutorial', 'wave', 'boss'].includes(s.phase) && !s.paused;
  const timeLeft = s.phase === 'boss' ? 90 - s.time : s.phase === 'upgrade' ? 10 - s.time : s.phase === 'tutorial' ? 20 - s.time : 50 - s.time;
  const moving = p.moving;
  const frame = Math.floor(s.elapsed * 8) % 2 ? 'lf' : 'rf';
  const heroImage = p.dashTime > 0 ? '/assets/survival/hero-dash.png' : p.slash > 0 ? '/assets/survival/hero-attack.png' : moving ? `/assets/character/hero-umbrella-right-${frame}.png` : '/assets/character/hero-umbrella-idle.png';
  const isPose = p.dashTime > 0 || p.slash > 0;
  function actionButton({ action, label, icon, key }: typeof ACTIONS[number]) {
    const cd = action === 'dash' ? p.dashCd : action === 'special' ? p.specialCd : 0;
    return <button type="button" key={action} className={`survival-touch ${action}`} aria-label={label}
      onPointerDown={e => { if (e.button !== 0) return; e.preventDefault(); resumeAudio(); e.currentTarget.setPointerCapture(e.pointerId); dispatch(action, true, `p${e.pointerId}`); }}
      onPointerUp={e => dispatch(action, false, `p${e.pointerId}`)} onPointerCancel={e => dispatch(action, false, `p${e.pointerId}`)}
      onLostPointerCapture={e => dispatch(action, false, `p${e.pointerId}`)}
      onClick={e => { if (e.detail === 0) { dispatch(action, true, `accessible-${action}`); dispatch(action, false, `accessible-${action}`); } }}>
      <span aria-hidden="true">{icon}</span><small>{cd > 0 ? `${cd.toFixed(1)}s` : label}</small><kbd>{key}</kbd>
    </button>;
  }
  const controls = playable ? <div className="survival-controls"><div className="survival-direction">{ACTIONS.slice(0, 2).map(actionButton)}</div><div className="survival-actions">{ACTIONS.slice(2).map(actionButton)}</div></div> : null;
  return <div className="survival-shell">
    <Canvas controls={controls} onBlockedChange={blocked} mobileTitle="Đêm Canh Hoa" mobileHelp="Giữ Đánh để vung ô. Chạm Lướt để né đòn, Cánh hoa để bảo vệ khu vườn." controlGutter={244}>
      <section className="survival-scene" aria-label="Đấu trường Đêm Canh Hoa" data-phase={s.phase} data-paused={s.paused}
        data-elapsed={s.elapsed.toFixed(2)} data-hp={p.hp} data-flower={s.flowerHp} data-score={s.score} data-wave={s.wave}>
        <div className="survival-background" style={{ backgroundImage: `url(${GARDEN.background})` }} />
        <div className="survival-vignette" />
        <div className="survival-rain" aria-hidden="true" />
        <div className="survival-flower" style={{ left: GARDEN.flowerX - 18, top: GARDEN.ground - 44, opacity: .4 + .6 * s.flowerHp / 100 }}><img src="/assets/others/rose-item.png" alt="Đóa hoa cuối cùng" /></div>
        {s.phase === 'tutorial' && <img className="survival-cat" src="/assets/others/cat-sleep.png" alt="Mèo dẫn đường" />}
        {s.hazards.map(h => <div key={h.id} className={`survival-hazard ${h.fired ? 'fired' : ''}`} style={{ left: h.x - h.width / 2, width: h.width }}><span>{h.fired ? '✦' : '⚠'}</span></div>)}
        {s.enemies.map(e => <div key={e.id} className={`survival-enemy ${e.flash > 0 ? 'hit' : ''}`} data-kind={e.kind} data-x={e.x.toFixed(1)} data-hp={e.hp} data-windup={e.windup}
          style={{ left: e.x - ENEMIES[e.kind].width / 2, top: e.y - ENEMIES[e.kind].height, width: ENEMIES[e.kind].width, height: ENEMIES[e.kind].height }}>
          <img src={`/assets/survival/${e.kind}.png`} alt={e.kind === 'boss' ? 'Bù Nhìn Mưa' : e.kind === 'leaf' ? 'Bóng Lá' : e.kind === 'thorn' ? 'Bụi Gai Sống' : 'Đom Đóm Bóng'} style={{ transform: `scaleX(${e.facing > 0 ? -1 : 1})` }} />
          {e.windup > 0 && <span className="survival-warning">{e.kind === 'boss' ? ['QUÉT!', 'MƯA!', 'LAO!'][e.move] : '!'}</span>}
          {e.kind !== 'boss' && <meter min="0" max={e.maxHp} value={Math.max(0, e.hp)} aria-label="Máu đối thủ" />}
        </div>)}
        <div className={`survival-hero ${p.invincible > 0 ? 'invincible' : ''}`} data-player="survival" data-x={p.x.toFixed(1)} data-y={p.y.toFixed(1)}
          style={{ left: p.x - (isPose ? 38 : 24), top: p.y - 62, width: isPose ? 76 : 48, transform: `scaleX(${p.facing})` }}><img src={heroImage} alt="Người canh hoa" /></div>
        {p.slash > 0 && <div className="survival-slash" style={{ left: p.x + (p.facing > 0 ? 12 : -76), top: p.y - 65, transform: `scaleX(${p.facing})` }} />}
        {p.specialFx > 0 && <div className="survival-special" style={{ left: p.x - 140, top: p.y - 170 }}>✧</div>}
        {s.projectiles.map(b => <div key={b.id} className="survival-projectile" style={{ left: b.x - 5, top: b.y - 5 }} />)}
        <header className="survival-hud">
          <div className="survival-stat"><label htmlFor="survival-hp">♡ Bạn <b>{Math.ceil(p.hp)}</b></label><meter id="survival-hp" min="0" max="100" value={p.hp} /></div>
          <div className="survival-stat flower"><label htmlFor="survival-flower">❀ Hoa <b>{Math.ceil(s.flowerHp)}</b></label><meter id="survival-flower" min="0" max="100" value={s.flowerHp} /></div>
          <div className="survival-round"><strong>{s.phase === 'boss' ? 'BOSS' : `Đợt ${Math.min(s.wave + 1, 6)} / 6`}</strong><span>{clock(timeLeft)} · {s.score} điểm</span></div>
          <button onClick={pause} aria-label="Tạm dừng" disabled={s.phase === 'welcome' || s.phase === 'result'}>Ⅱ</button>
          <button onClick={() => { resumeAudio(); setMuted(!muted); }} aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}>{muted ? '♪̸' : '♪'}</button>
        </header>
        {boss && <div className="survival-boss"><label htmlFor="boss-hp">BÙ NHÌN MƯA <span>{Math.ceil(boss.hp)} / {boss.maxHp}</span></label><meter id="boss-hp" min="0" max={boss.maxHp} value={boss.hp} /></div>}
        {s.phase === 'tutorial' && !s.paused && <aside className="survival-tutorial"><strong>Thử chiếc ô của bạn</strong><p>J đánh · K lướt · L cánh hoa · Space nhảy<br />Giữ hoa an toàn qua 6 đợt, rồi hạ Bù Nhìn Mưa.</p><button onClick={() => { clearInput(); beginWave(run.current); publish(); }}>Vào trận ngay →</button></aside>}
        <footer className="survival-keyboard">A D di chuyển · Space nhảy · J đánh · K lướt {p.dashCd > 0 ? `(${p.dashCd.toFixed(1)}s)` : ''} · L cánh hoa {p.specialCd > 0 ? `(${Math.ceil(p.specialCd)}s)` : ''}</footer>
        {(s.phase === 'welcome' || s.phase === 'upgrade' || s.phase === 'result' || s.paused) && <div className="survival-overlay" ref={overlay} tabIndex={-1} role="dialog" aria-modal="true" aria-label={s.paused ? 'Tạm dừng' : s.phase === 'upgrade' ? 'Chọn nâng cấp' : 'Đêm Canh Hoa'}
          onKeyDown={e => { if (e.key === 'Tab') { const items = overlay.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'); if (!items?.length) return; const first = items[0], last = items[items.length - 1]; if (e.shiftKey && (document.activeElement === first || document.activeElement === overlay.current)) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } } }}>
          <div className="survival-panel">
            {s.paused ? <><span className="survival-eyebrow">MỘT KHOẢNG NGHỈ</span><h1>Khu vườn đang đợi</h1><p>Thời gian và mọi đòn đánh đã dừng.</p><div className="survival-buttons"><button className="primary" onClick={resume}>Tiếp tục</button><button onClick={start}>Chơi lại</button><button onClick={onExit}>Về màn nhập mã</button></div></> :
              s.phase === 'welcome' ? <><span className="survival-eyebrow">MET · MỘT ĐÊM PHIÊU LƯU</span><div className="survival-emblem">☂</div><h1>Đêm Canh Hoa</h1><p>Cầm chiếc ô ánh sáng, giữ đóa hoa cuối cùng<br />qua cơn mưa, cho đến lúc bình minh.</p><div className="survival-tags"><span>6 đợt tấn công</span><span>1 boss</span><span>5–10 phút</span></div><p className="survival-record">Kỷ lục {record.best} · {record.wins} lần gọi bình minh</p><div className="survival-buttons"><button className="primary" disabled={!loaded} onClick={start}>{loaded ? 'Bắt đầu canh hoa →' : assetError ? 'Chưa tải được hình ảnh' : 'Đang mở khu vườn…'}</button>{assetError && <button onClick={() => { setAssetError(false); setLoadAttempt(v => v + 1); }}>Tải lại hình ảnh</button>}<button onClick={onExit}>Về màn nhập mã</button></div></> :
              s.phase === 'upgrade' ? <><span className="survival-eyebrow">ĐÃ QUA ĐỢT {s.wave + 1}</span><h1>Một chút phép màu</h1><p>Chọn một món quà. Tự chọn thẻ đầu sau {Math.max(0, Math.ceil(10 - s.time))} giây.</p><div className="survival-upgrades">{s.choices.map((id, index) => <button key={`${id}-${index}`} onClick={() => select(index)}><span className="upgrade-icon">{UPGRADES[id].icon}</span><strong>{UPGRADES[id].name}</strong><small>{UPGRADES[id].detail}</small><em>{index === 0 ? 'Tự chọn khi hết giờ' : 'Chạm để chọn'}</em></button>)}</div><button onClick={pause}>Tạm dừng để suy nghĩ</button></> :
              <><span className="survival-eyebrow">{s.result?.won ? 'BÌNH MINH TRỞ LẠI' : 'MỘT ĐÊM CHƯA TRỌN'}</span><div className="survival-emblem">{s.result?.won ? '❀' : '☂'}</div><h1>{s.result?.won ? 'Hoa vẫn nở vì bạn' : 'Thử thêm một lần nhé'}</h1><p>{s.result?.reason}</p><div className="survival-results"><span><b>{s.score}</b>điểm</span><span><b>{s.kills}</b>địch đã hạ</span><span><b>{s.result?.wave}/6</b>đợt</span><span><b>{clock(s.elapsed)}</b>thời gian</span></div><p className="survival-record">Kỷ lục {record.best} · {record.wins} lần thắng{storageError ? ' · Trình duyệt chưa cho lưu kỷ lục.' : ''}</p><div className="survival-buttons"><button className="primary" onClick={start}>Canh hoa lần nữa</button><button onClick={onExit}>Về màn nhập mã</button></div></>}
          </div>
        </div>}
      </section>
    </Canvas>
  </div>;
}
