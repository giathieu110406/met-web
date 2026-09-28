'use client';

import React, { useEffect, useRef } from 'react';
import { flowerEngine } from './particle-engine';

export default function FlowerCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    flowerEngine.setCanvas(canvas);

    return () => {
      window.removeEventListener('resize', resize);
      flowerEngine.setCanvas(null);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
