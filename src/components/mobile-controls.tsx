'use client';

import { useEffect, useRef } from 'react';

const codes: Record<string, string> = { ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight', ArrowUp: 'ArrowUp', s: 'KeyS', e: 'KeyE', Enter: 'Enter' };
// Reuse gameplay actions and scene guards from the physical keyboard.
function sendKey(type: 'keydown' | 'keyup', key: string) {
  window.dispatchEvent(new KeyboardEvent(type, { key, code: codes[key], bubbles: true, cancelable: true }));
}

export default function MobileControls({ movement, sitting, onMute, muted, onPrimary }: {
  movement: boolean; sitting: boolean; onMute: () => void; muted: boolean; onPrimary: () => void;
}) {
  const held = useRef(new Map<number, string>());
  useEffect(() => {
    const keys = held.current;
    const releaseAll = () => { keys.forEach((key) => sendKey('keyup', key)); keys.clear(); };
    window.addEventListener('blur', releaseAll);
    document.addEventListener('visibilitychange', releaseAll);
    return () => {
      releaseAll();
      window.removeEventListener('blur', releaseAll);
      document.removeEventListener('visibilitychange', releaseAll);
    };
  }, [movement]);

  function release(pointerId: number) {
    const key = held.current.get(pointerId);
    held.current.delete(pointerId);
    if (key && ![...held.current.values()].includes(key)) sendKey('keyup', key);
  }

  function button(key: string, label: string, icon: string, hold = false) {
    return <button type="button" className="mobile-control" aria-label={label}
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (!hold || event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        held.current.set(event.pointerId, key);
        sendKey('keydown', key);
      }}
      onPointerUp={(event) => release(event.pointerId)}
      onPointerCancel={(event) => release(event.pointerId)}
      onLostPointerCapture={(event) => release(event.pointerId)}
      onClick={(event) => {
        event.stopPropagation();
        if (!hold || event.detail === 0) { sendKey('keydown', key); sendKey('keyup', key); }
      }}><span aria-hidden="true">{icon}</span><small>{label}</small></button>;
  }

  return <div className="mobile-controls" onClick={(event) => event.stopPropagation()}>
    <button type="button" className="mobile-sound" aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'} onClick={onMute}>{muted ? 'Âm thanh: tắt' : 'Âm thanh: bật'}</button>
    {movement && <div className="mobile-movement">
      {button('ArrowLeft', 'Sang trái', '←', true)}
      {button('ArrowRight', 'Sang phải', '→', true)}
    </div>}
    <div className="mobile-actions">
      {movement && button('ArrowUp', 'Nhảy', '↑', true)}
      {movement && button('s', sitting ? 'Đứng dậy' : 'Ngồi', '↓')}
      <button type="button" className="mobile-control mobile-primary" aria-label="Tương tác / Tiếp" onClick={onPrimary}>
        <span aria-hidden="true">✦</span><small>Tương tác / Tiếp</small>
      </button>
    </div>
  </div>;
}
