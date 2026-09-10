'use client';

import { useEffect, useRef } from 'react';

/**
 * Game loop hook using requestAnimationFrame
 * Provides deltaTime normalized to ~60fps (deltaTime=1.0 at 60fps)
 */
export function useGameLoop(callback: (deltaTime: number) => void, active: boolean = true) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) return;

    let lastTime = performance.now();
    let animationId: number;

    const loop = (currentTime: number) => {
      const elapsed = currentTime - lastTime;
      lastTime = currentTime;
      // Normalize to 60fps: deltaTime = 1.0 at 60fps, 0.5 at 120fps, 2.0 at 30fps
      const deltaTime = Math.min(elapsed / 16.67, 3); // Cap at 3 to avoid huge jumps
      callbackRef.current(deltaTime);
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [active]);
}
