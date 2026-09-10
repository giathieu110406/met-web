'use client';

interface PlatformProps {
  x: number;
  width: number;
  y: number;
  cameraX: number;
}

export default function Platform({ x, width, y, cameraX }: PlatformProps) {
  const screenX = x - cameraX;

  // Don't render if off screen
  if (screenX + width < -20 || screenX > 620) return null;

  return (
    <div
      className="absolute z-10 select-none pointer-events-none"
      style={{
        left: `${screenX}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: '24px',
        backgroundImage: "url('/assets/others/platform.png')",
        backgroundRepeat: 'repeat-x',
        backgroundSize: '80px 24px',
        imageRendering: 'pixelated',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
      }}
    />
  );
}
