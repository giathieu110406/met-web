'use client';

import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/level-data';
import { resumeAudio } from '@/lib/sound';

export default function Canvas({ children, controls, onBlockedChange, mobilePreview = false, mobileTitle, mobileHelp, controlGutter = 92 }: {
  children: ReactNode;
  controls?: ReactNode;
  mobilePreview?: boolean;
  mobileTitle?: string;
  mobileHelp?: string;
  controlGutter?: number;
  onBlockedChange?: (blocked: boolean) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ mobile: false, portrait: false, scale: 1 });
  const [entered, setEntered] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState('');
  const blocked = viewport.mobile && (!entered || viewport.portrait);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      // iPadOS may use a desktop Mac user agent; Windows touch PCs stay desktop.
      const mobile = mobilePreview || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        || (/Macintosh|MacIntel/i.test(`${navigator.userAgent} ${navigator.platform}`) && navigator.maxTouchPoints > 1);
      const portrait = window.innerHeight > window.innerWidth;
      const style = getComputedStyle(stage);
      const width = stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height = stage.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      setViewport({ mobile, portrait, scale: Math.max(0.1, Math.min(mobile ? Infinity : 1,
        (width - (mobile && !portrait ? controlGutter : 0)) / CANVAS_WIDTH, height / CANVAS_HEIGHT)) });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener('resize', measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [mobilePreview, controlGutter]);

  useEffect(() => { onBlockedChange?.(blocked); }, [blocked, onBlockedChange]);
  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement
      || (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement));
    document.addEventListener('fullscreenchange', update);
    document.addEventListener('webkitfullscreenchange', update);
    return () => {
      document.removeEventListener('fullscreenchange', update);
      document.removeEventListener('webkitfullscreenchange', update);
    };
  }, []);

  async function enterFullscreen() {
    setNotice('');
    try {
      // Invoke directly in the click gesture, before awaiting anything else.
      const root = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
      const standalone = window.matchMedia('(display-mode: standalone)').matches
        || (navigator as Navigator & { standalone?: boolean }).standalone;
      const request = !fullscreen && !standalone
        ? root.requestFullscreen ? root.requestFullscreen({ navigationUI: 'hide' })
          : root.webkitRequestFullscreen ? root.webkitRequestFullscreen()
          : Promise.reject(new Error('Fullscreen unavailable'))
        : Promise.resolve();
      resumeAudio();
      await request;
    } catch {
      setNotice('Để chơi không có thanh địa chỉ: mở menu Chia sẻ → Thêm vào Màn hình chính → mở Met từ biểu tượng mới. Trình duyệt này chưa cho phép ép toàn màn hình trong tab. Chạm để tiếp tục chơi trong tab.');
    } finally {
      setEntered(true);
    }
    try {
      const orientation = screen.orientation as ScreenOrientation & { lock?: (mode: string) => Promise<void> };
      await orientation?.lock?.('landscape');
    } catch {
      // The rotate prompt stays visible if orientation lock is unavailable.
    }
  }

  return (
    <div ref={stageRef} className="game-stage" data-mobile={viewport.mobile} style={{ '--game-scale': viewport.scale } as CSSProperties}
      onContextMenu={(event) => { if (viewport.mobile) event.preventDefault(); }}
      onDragStart={(event) => { if (viewport.mobile) event.preventDefault(); }}>
      <div className="game-frame" inert={blocked} style={{ width: CANVAS_WIDTH * viewport.scale, height: CANVAS_HEIGHT * viewport.scale }}>
        <div className="game-canvas relative overflow-hidden border-2 border-solid border-[#2e2f31] rounded-lg shadow-2xl"
          style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, transform: `scale(${viewport.scale})`, transformOrigin: 'top left' }}>
          {children}
        </div>
      </div>
      {viewport.mobile && !blocked && <>
        <button className="mobile-fullscreen" aria-label={fullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          onClick={(event) => {
            event.stopPropagation();
            if (!fullscreen) { void enterFullscreen(); return; }
            const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> | void };
            if (doc.exitFullscreen) void doc.exitFullscreen().catch(() => {});
            else void doc.webkitExitFullscreen?.();
          }}>
          <span aria-hidden="true">⛶</span><span>{fullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
        </button>
        {controls}
        {notice && <button className="mobile-notice" onClick={(event) => { event.stopPropagation(); setNotice(''); }} aria-label={`${notice} Chạm để đóng`}>{notice} ×</button>}
      </>}
      {blocked && <div className="mobile-gate" role="dialog" aria-modal="true" aria-labelledby="mobile-gate-title"
        onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
        <div className="mobile-gate-card">
          <span className="mobile-brand">Met</span>
          <svg className="rotate-phone" width="88" height="72" viewBox="0 0 88 72" fill="none" aria-hidden="true">
            <rect x="23" y="7" width="42" height="58" rx="8" stroke="currentColor" strokeWidth="2" transform="rotate(-25 44 36)" />
            <path d="M37 53h9M72 19a29 29 0 0 1 5 30m0 0 5-6m-5 6-6-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h1 id="mobile-gate-title">{viewport.portrait ? 'Xoay ngang để bắt đầu' : (mobileTitle || 'Một câu chuyện nhỏ, dành cho bạn')}</h1>
          <p>{viewport.portrait ? 'Xoay điện thoại sang ngang để nhìn trọn khung cảnh và điều khiển bằng hai tay.' : (mobileHelp || 'Chạm để mở trải nghiệm toàn màn hình. Giữ nút trái / phải để đi, chạm Nhảy và Tương tác để khám phá.')}</p>
          {!entered && <button className="mobile-enter" onClick={() => void enterFullscreen()}>Vào trải nghiệm <span aria-hidden="true">→</span></button>}
          {entered && viewport.portrait && <p className="mobile-rotate-hint">Hãy tắt khóa xoay trên điện thoại, rồi xoay ngang.</p>}
          {notice && <p role="status">{notice}</p>}
          <small>Đeo tai nghe để nghe câu chuyện rõ hơn.</small>
        </div>
      </div>}
    </div>
  );
}
