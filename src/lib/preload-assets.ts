/**
 * Master asset manifest for preloading
 * Ensures 100% of game sprites, backgrounds, cutscenes, and FPV views
 * are warm in browser cache before the player starts the journey.
 */
export const ALL_GAME_ASSETS: string[] = [
  // Characters & Hero states
  '/assets/character/avatar-companion.png',
  '/assets/character/avatar-hero.png',
  '/assets/character/companion-idle.png',
  '/assets/character/hero-idle.png',
  '/assets/character/hero-right-lf.png',
  '/assets/character/hero-right-rf.png',
  '/assets/character/hero-left-idle.png',
  '/assets/character/hero-left-lf.png',
  '/assets/character/hero-left-rf.png',
  '/assets/character/hero-sit.png',
  '/assets/character/hero-sit-left.png',
  '/assets/character/hero-sit-swing.png',
  '/assets/character/hero-pet-cat.png',
  '/assets/character/hero-umbrella-idle.png',
  '/assets/character/hero-umbrella-right-lf.png',
  '/assets/character/hero-umbrella-right-rf.png',
  '/assets/character/hero-umbrella-left-idle.png',
  '/assets/character/hero-umbrella-left-lf.png',
  '/assets/character/hero-umbrella-left-rf.png',
  '/assets/character/hero-bouquet-idle.png',
  '/assets/character/hero-bouquet-right-lf.png',
  '/assets/character/hero-bouquet-right-rf.png',
  '/assets/character/hero-bouquet-left-idle.png',
  '/assets/character/hero-bouquet-left-lf.png',
  '/assets/character/hero-bouquet-left-rf.png',

  // World Props & Environment
  '/assets/others/background-sky.png',
  '/assets/others/ground.png',
  '/assets/others/platform.png',
  '/assets/others/grass-patch.png',
  '/assets/others/rose-item.png',
  '/assets/others/wooden-sign.png',
  '/assets/others/park-bench.png',
  '/assets/others/park-bench-empty.png',
  '/assets/others/wooden-swing-v2-pixel.png',
  '/assets/others/wooden-bridge.png',
  '/assets/others/lamp-post-single-tall-off.png',
  '/assets/others/lamp-post-single-tall-on.png',
  '/assets/others/cat-sleep.png',
  '/assets/others/cherry-tree-small-pixel.png',
  '/assets/others/cherry-tree-grand-pixel.png',

  // Butterflies
  '/assets/others/butterfly-pink-1.png',
  '/assets/others/butterfly-pink-2.png',
  '/assets/others/butterfly-gold-1.png',
  '/assets/others/butterfly-gold-2.png',
  '/assets/others/butterfly-purple-1.png',
  '/assets/others/butterfly-purple-2.png',

  // Letter & Crafting items
  '/assets/others/message.png',
  '/assets/others/message-piece-0.png',
  '/assets/others/message-piece-1.png',
  '/assets/others/message-piece-2.png',
  '/assets/others/crafting-table-pixel-bg.jpg',

  // First-Person Views & Cutscenes
  '/assets/others/fpv-mailbox-parcel.jpg',
  '/assets/others/fpv-cat-storybook.png',
  '/assets/others/cutscene-letter-rip.jpg',
  '/assets/others/cutscene-cat-chase.jpg',
  '/assets/others/fpv-umbrella-canopy-pixel.png',
  '/assets/others/fpv-lamp-reach.jpg',
  '/assets/others/fpv-lamp-hands-storybook.png',
  '/assets/others/fpv-boat-retrieval.jpg',
  '/assets/others/fpv-bridge-starry.jpg',
  '/assets/others/fpv-cat-recover.jpg',
  '/assets/others/fpv-cherry-garden-entrance.jpg',
  '/assets/others/fpv-cherry-summit-reunion.jpg',
];

let preloadPromise: Promise<void> | null = null;

export function preloadGameAssets(onProgress?: (loaded: number, total: number) => void): Promise<void> {
  if (preloadPromise) return preloadPromise;
  if (typeof window === 'undefined') return Promise.resolve();

  preloadPromise = new Promise<void>((resolve) => {
    let loadedCount = 0;
    const total = ALL_GAME_ASSETS.length;

    const checkComplete = () => {
      loadedCount++;
      if (onProgress) onProgress(loadedCount, total);
      if (loadedCount >= total) {
        resolve();
      }
    };

    ALL_GAME_ASSETS.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        // Attempt asynchronous bitmap decoding if supported
        if ('decode' in img && typeof img.decode === 'function') {
          img.decode().catch(() => {}).finally(checkComplete);
        } else {
          checkComplete();
        }
      };
      img.onerror = () => {
        // Resolve anyway so progress is never stuck
        checkComplete();
      };
      img.src = src;
    });
  });

  return preloadPromise;
}
