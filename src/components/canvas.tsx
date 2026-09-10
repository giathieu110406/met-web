import { ReactNode } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/level-data';

export default function Canvas({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative overflow-hidden border-2 border-solid border-[#2e2f31] rounded-lg shadow-2xl"
      style={{
        width: `${CANVAS_WIDTH}px`,
        height: `${CANVAS_HEIGHT}px`,
      }}
    >
      {children}
    </div>
  );
}
