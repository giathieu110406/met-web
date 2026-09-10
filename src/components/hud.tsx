'use client';

interface HUDProps {
  collected: number;
  total: number;
  hasLostLetter?: boolean;
  collectedFragments?: number;
  totalFragments?: number;
  showControls?: boolean;
}

export default function HUD({
  collected,
  total,
  hasLostLetter = false,
  collectedFragments = 0,
  totalFragments = 3,
}: HUDProps) {
  const isRosesComplete = collected >= total && total > 0;
  const isFragmentsComplete = collectedFragments >= totalFragments && totalFragments > 0;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 select-none">
      {/* Counters — top left */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        {/* Rose counter */}
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1 transition-all duration-300"
          style={{
            backgroundColor: isRosesComplete ? 'rgba(217, 87, 99, 0.4)' : 'rgba(0, 0, 0, 0.45)',
            border: isRosesComplete ? '1px solid rgba(251, 113, 133, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(4px)',
            boxShadow: isRosesComplete ? '0 0 12px rgba(244, 63, 94, 0.4)' : 'none',
          }}
        >
          <span className="text-sm">{isRosesComplete ? '💐' : '🌹'}</span>
          <span
            style={{
              color: isRosesComplete ? '#ffe4e6' : '#fecdd3',
              fontFamily: "'VT323', monospace",
              fontSize: '18px',
            }}
          >
            {collected}/{total}
          </span>
        </div>

        {/* Letter fragments counter (visible after the wind storm event at x >= 1050) */}
        {hasLostLetter && (
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1 transition-all duration-300 animate-fade-in"
            style={{
              backgroundColor: isFragmentsComplete ? 'rgba(217, 119, 6, 0.35)' : 'rgba(0, 0, 0, 0.45)',
              border: isFragmentsComplete ? '1px solid rgba(251, 191, 36, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
              boxShadow: isFragmentsComplete ? '0 0 12px rgba(245, 158, 11, 0.4)' : 'none',
            }}
          >
            <span className="text-sm">{isFragmentsComplete ? '✨' : '📜'}</span>
            <span
              style={{
                color: isFragmentsComplete ? '#fef3c7' : '#fde68a',
                fontFamily: "'VT323', monospace",
                fontSize: '18px',
              }}
            >
              {collectedFragments}/{totalFragments}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
