// Physics utilities and collision detection for Met game

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlatformRect {
  x: number;
  y: number;
  width: number;
  height?: number;
}

export interface HeroState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  lastSafeX: number;
  lastSafeY: number;
  facingRight: boolean;
}

/**
 * AABB collision detection between two rectangles
 */
export function isColliding(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Check and resolve horizontal collision against solid platforms
 * Prevents hero from walking through platforms horizontally
 */
export function resolveHorizontalPlatformCollision(
  heroX: number,
  heroY: number,
  heroWidth: number,
  heroHeight: number,
  vx: number,
  platforms: PlatformRect[],
  defaultPlatformHeight: number = 24,
): { x: number; collided: boolean } {
  let x = heroX;
  let collided = false;

  for (const plat of platforms) {
    const pHeight = plat.height ?? defaultPlatformHeight;
    // Overlap vertically: hero body penetrates platform Y space
    // Margin of 4px prevents snagging when standing directly on top of platform
    const overlapsY =
      heroY + heroHeight > plat.y + 4 && heroY < plat.y + pHeight - 2;

    if (!overlapsY) continue;

    if (vx > 0) {
      // Moving right: hitting left edge of platform
      if (x + heroWidth > plat.x && x < plat.x + plat.width) {
        x = plat.x - heroWidth;
        collided = true;
      }
    } else if (vx < 0) {
      // Moving left: hitting right edge of platform
      if (x < plat.x + plat.width && x + heroWidth > plat.x) {
        x = plat.x + plat.width;
        collided = true;
      }
    }
  }

  return { x, collided };
}

/**
 * Check and resolve vertical collision against solid platforms
 * Handles landing on top as well as bumping head underneath
 */
export function resolveVerticalPlatformCollision(
  heroX: number,
  heroY: number,
  heroWidth: number,
  heroHeight: number,
  vy: number,
  platforms: PlatformRect[],
  defaultPlatformHeight: number = 24,
): { y: number; landed: boolean; bumpedHead: boolean } {
  let y = heroY;
  let landed = false;
  let bumpedHead = false;

  for (const plat of platforms) {
    const pHeight = plat.height ?? defaultPlatformHeight;
    // Overlap horizontally: hero must be within platform X span (with 2px margin)
    const overlapsX =
      heroX + heroWidth > plat.x + 2 && heroX < plat.x + plat.width - 2;

    if (!overlapsX) continue;

    if (vy >= 0) {
      // Falling down: check if hero feet landed on platform top
      const prevBottom = heroY + heroHeight - vy;
      // If hero feet were above or slightly touching top, and now at/below top
      if (prevBottom <= plat.y + 12 && heroY + heroHeight >= plat.y) {
        y = plat.y - heroHeight;
        landed = true;
        break;
      }
    } else if (vy < 0) {
      // Jumping up: check if hero head bumped platform bottom
      const prevTop = heroY - vy;
      if (prevTop >= plat.y + pHeight - 12 && heroY <= plat.y + pHeight) {
        y = plat.y + pHeight;
        bumpedHead = true;
        break;
      }
    }
  }

  return { y, landed, bumpedHead };
}

/**
 * Check if hero is landing on top of a platform (backward compatibility)
 */
export function isLandingOnPlatform(
  hero: Rect,
  platform: Rect,
  vy: number,
): boolean {
  const tolerance = 12;
  return (
    vy >= 0 &&
    hero.y + hero.height >= platform.y &&
    hero.y + hero.height <= platform.y + tolerance &&
    hero.x + hero.width > platform.x &&
    hero.x < platform.x + platform.width
  );
}

/**
 * Check if a position (hero feet) is over a gap (no ground below)
 */
export function isOverGap(
  heroX: number,
  heroWidth: number,
  gaps: { x: number; width: number }[],
): boolean {
  const heroCenterX = heroX + heroWidth / 2;
  return gaps.some(
    (gap) => heroCenterX > gap.x && heroCenterX < gap.x + gap.width,
  );
}

export interface GroundSegment {
  x: number;
  width: number;
  y: number;
  endY?: number;
  type?: 'ground' | 'slope' | 'hill-curve';
}

/**
 * Calculates the undulating curved ground height (Y) for the Cherry Blossom Hill (Map 2).
 * Spans across 1850px of arduous winding mountain crests and dips before reaching the summit plateau at x >= 1850 (y = 265).
 * Features multiple natural up-and-down rolling ridges with smooth zero-discontinuity envelope.
 */
export function getHillGroundY(x: number): number {
  if (x <= 0) return 320;
  if (x >= 1850) return 265;
  const t = x / 1850;
  // Base gradual mountain ascent from y=320 to y=265
  const base = 320 - t * 55;
  // Arduous multi-tiered rolling mountain waves across 1850px
  const wave1 = -18 * Math.sin(2 * Math.PI * t * 3.5);
  const wave2 = -6 * Math.sin(2 * Math.PI * t * 7.0);
  const envelope = Math.sin(Math.PI * t);
  return Math.round(base + (wave1 + wave2) * envelope);
}

/**
 * Find the ground Y level at a given X position
 * Supports flat grounds, sloped segments, and undulating hill curves
 * Returns undefined if hero is over a gap
 */
export function getGroundYAtX(
  heroX: number,
  heroWidth: number,
  grounds: GroundSegment[],
): number | undefined {
  const heroCenterX = heroX + heroWidth / 2;
  for (const ground of grounds) {
    if (heroCenterX >= ground.x && heroCenterX <= ground.x + ground.width) {
      if (ground.type === 'hill-curve') {
        return getHillGroundY(heroCenterX);
      }
      if (ground.endY !== undefined) {
        const ratio = Math.max(0, Math.min(1, (heroCenterX - ground.x) / ground.width));
        return Math.round(ground.y + ratio * (ground.endY - ground.y));
      }
      return ground.y;
    }
  }
  return undefined;
}
