// Advanced Flower Physics Engine: Separated Gravity Falling & Expanding Outer-Edge Bloom
// Real-time Canvas Rendering with zero external dependencies (Ponytail Ladder)

export interface FallingFlower {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  rotation: number;
  rotSpeed: number;
  size: number;
  scale: number;
  opacity: number;
  age: number; // in milliseconds
  maxAge: number; // ~2000ms
  flowerIndex: number;
}

export interface BloomFlower {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  targetSize: number;
  targetRotation: number;
  rotDelta: number;
  delayMs: number;
  bloomDuration: number;
  flowerIndex: number;
  wobbleSpeed: number;
  wobblePhase: number;
  dist: number;
}

class FlowerAnimationEngine {
  private fallingParticles: FallingFlower[] = [];
  private bloomFlowers: BloomFlower[] = [];
  private isBlooming = false;
  private bloomStartTime = 0;
  private bloomFadeStart = 0;
  private bloomAlpha = 1.0;
  private onBloomCompleteCallback: (() => void) | null = null;

  private images: HTMLImageElement[] = [];
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;
  private lastTime = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.preloadImages();
    }
  }

  private preloadImages() {
    for (let i = 1; i <= 13; i++) {
      const img = new Image();
      img.src = `/assets/flowers/flower-${i}.png`;
      this.images.push(img);
    }
  }

  public setCanvas(canvas: HTMLCanvasElement | null) {
    this.canvas = canvas;
    if (canvas) {
      this.ctx = canvas.getContext('2d');
      this.startLoop();
    } else {
      this.stopLoop();
    }
  }

  /**
   * REQUIREMENT (Updated):
   * When typing password digits 1, 2, 3:
   * Flowers stay CLOSE together (not bunched into 1 pixel, but separated by a small gap),
   * falling DOWNWARDS strictly by gravity without flying far horizontally.
   */
  public spawnGravityFallingFlowers(originX: number, originY: number, count: number = 3) {
    // REQUIREMENT: Các bông hoa lại gần nhau hơn, rơi theo trọng lực và tách nhau 1 khoảng nhỏ (~6-8px), không bung xa
    const offsets = [-7, 0, 7]; // Tight spacing between falling flowers

    for (let i = 0; i < count; i++) {
      const xOffset = (offsets[i % offsets.length] || 0) + (Math.random() - 0.5) * 2;
      // Minimal horizontal drift: strictly vertical gravity fall
      const vx = (Math.random() - 0.5) * 0.06;

      this.fallingParticles.push({
        x: originX + xOffset,
        y: originY + (i === 1 ? -4 : 3) + (Math.random() - 0.5) * 2,
        vx,
        vy: 1.15 + Math.random() * 0.25, // Downward velocity
        gravity: 0.18 + Math.random() * 0.02, // Natural gravity acceleration
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        size: 26 + Math.random() * 6,
        scale: 0.85,
        opacity: 1,
        age: 0,
        maxAge: 2000, // Strictly ~2 seconds lifetime
        flowerIndex: Math.floor(Math.random() * 13),
      });
    }
    this.startLoop();
  }

  /**
   * REQUIREMENT (Updated):
   * Expanding Outer-Edge Bloom:
   * Flowers bloom in place at the center first, then subsequent layers expand outward from outer perimeter,
   * overflowing past screen edges.
   */
  public triggerTrueRadialBloom(
    originX: number,
    originY: number,
    onComplete: () => void
  ) {
    if (!this.canvas) return;
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.onBloomCompleteCallback = onComplete;
    this.isBlooming = true;
    this.bloomStartTime = performance.now();
    this.bloomFadeStart = 0;
    this.bloomAlpha = 1.0;
    this.bloomFlowers = [];
    this.fallingParticles = []; // Clear any remaining falling particles immediately

    // Expanded grid boundary so flowers overflow beyond screen edges
    const pad = 120;
    const minX = -pad;
    const maxX = width + pad;
    const minY = -pad;
    const maxY = height + pad;

    const cols = 22;
    const rows = 14;
    const cellW = (maxX - minX) / cols;
    const cellH = (maxY - minY) / rows;

    const corners = [
      Math.hypot(minX - originX, minY - originY),
      Math.hypot(maxX - originX, minY - originY),
      Math.hypot(minX - originX, maxY - originY),
      Math.hypot(maxX - originX, maxY - originY),
    ];
    const maxDist = Math.max(...corners);

    // REQUIREMENT: Đảo ngược hiệu ứng nở hoa là từ trong ra ngoài.
    // Bông trên cùng nở ra trước, các bông còn lại nở ở phía dưới chứ không bung ra ở layer phía trên bông trên cùng.
    
    // 1. Bông trên cùng ngay tại tâm (originX, originY): nở đầu tiên (delayMs = 0), ở layer trên cùng (dist = 0)
    this.bloomFlowers.push({
      startX: originX,
      startY: originY,
      targetX: originX,
      targetY: originY,
      targetSize: 210,
      targetRotation: Math.random() * Math.PI * 2,
      rotDelta: (Math.random() - 0.5) * Math.PI * 0.4,
      delayMs: 0,
      bloomDuration: 680,
      flowerIndex: Math.floor(Math.random() * 13),
      wobbleSpeed: 0.002,
      wobblePhase: 0,
      dist: 0,
    });

    // 2. Lưới hoa bao phủ toàn bộ màn hình, nở dần từ trong ra ngoài (dist nhỏ -> delay nhỏ)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const targetX = minX + (c + 0.5) * cellW + (Math.random() - 0.5) * cellW * 0.7;
        const targetY = minY + (r + 0.5) * cellH + (Math.random() - 0.5) * cellH * 0.7;
        const dist = Math.hypot(targetX - originX, targetY - originY);
        if (dist < 15) continue; // Tránh trùng khít hoàn toàn với bông tâm

        const angle = Math.atan2(targetY - originY, targetX - originX);

        // Nở từ trong ra ngoài: tốc độ lan tỏa sóng hoa chậm rãi, mượt mà hơn (1650ms thay vì 850ms)
        const delayMs = (dist / maxDist) * 1650 + (Math.random() - 0.5) * 35;

        // Các bông xuất phát hơi lùi về phía tâm (nằm dưới các bông lớp trong) và nở vươn ra ngoài
        const pushBack = Math.min(50, dist * 0.2);
        const startX = targetX - Math.cos(angle) * pushBack;
        const startY = targetY - Math.sin(angle) * pushBack;

        this.bloomFlowers.push({
          startX,
          startY,
          targetX,
          targetY,
          targetSize: 180 + Math.random() * 55,
          targetRotation: Math.random() * Math.PI * 2,
          rotDelta: (Math.random() - 0.5) * Math.PI,
          delayMs: Math.max(0, delayMs),
          bloomDuration: 750 + Math.random() * 150,
          flowerIndex: Math.floor(Math.random() * 13),
          wobbleSpeed: 0.002 + Math.random() * 0.002,
          wobblePhase: Math.random() * Math.PI * 2,
          dist,
        });
      }
    }

    // 3. Vòng hoa viền ngoài tràn màn hình, nở sau cùng ở lớp sâu nhất
    for (let i = 0; i < 70; i++) {
      const isHorizontal = Math.random() > 0.5;
      const targetX = isHorizontal ? (Math.random() > 0.5 ? minX + Math.random() * 180 : maxX - Math.random() * 180) : Math.random() * width;
      const targetY = !isHorizontal ? (Math.random() > 0.5 ? minY + Math.random() * 180 : maxY - Math.random() * 180) : Math.random() * height;

      const dist = Math.hypot(targetX - originX, targetY - originY);
      const angle = Math.atan2(targetY - originY, targetX - originX);
      const delayMs = (dist / maxDist) * 1650 + Math.random() * 45;

      const pushBack = Math.min(60, dist * 0.2);
      const startX = targetX - Math.cos(angle) * pushBack;
      const startY = targetY - Math.sin(angle) * pushBack;

      this.bloomFlowers.push({
        startX,
        startY,
        targetX,
        targetY,
        targetSize: 190 + Math.random() * 60,
        targetRotation: Math.random() * Math.PI * 2,
        rotDelta: (Math.random() - 0.5) * Math.PI,
        delayMs: Math.max(0, delayMs),
        bloomDuration: 800 + Math.random() * 160,
        flowerIndex: Math.floor(Math.random() * 13),
        wobbleSpeed: 0.002 + Math.random() * 0.002,
        wobblePhase: Math.random() * Math.PI * 2,
        dist,
      });
    }

    // QUAN TRỌNG: Sắp xếp theo thứ tự dist GIẢM DẦN (từ xa về gần).
    // Canvas vẽ từ index 0 -> cuối:
    // - Bông ở xa tâm (dist lớn, nở sau) được vẽ ĐẦU TIÊN -> Nằm ở layer phía dưới cùng!
    // - Bông ở gần tâm (dist nhỏ, nở trước) được vẽ SAU CÙNG -> Nằm ở layer TRÊN CÙNG!
    // -> Bông trên cùng nở ra trước, các bông nở sau luôn nằm ở layer phía dưới!
    this.bloomFlowers.sort((a, b) => b.dist - a.dist);

    setTimeout(() => {
      this.bloomFadeStart = performance.now();
    }, 2500 + 3000);

    this.startLoop();
  }

  private startLoop() {
    if (this.animFrameId !== null) return;
    this.lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(33, currentTime - this.lastTime);
      this.lastTime = currentTime;

      this.updateAndRender(currentTime, dt);

      if (this.fallingParticles.length > 0 || this.isBlooming) {
        this.animFrameId = requestAnimationFrame(loop);
      } else {
        if (this.ctx && this.canvas) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        this.animFrameId = null;
      }
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  private stopLoop() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private easeOutBack(t: number): number {
    // Easing mượt mà, tự nhiên: giảm độ nảy giật từ 1.35 xuống 0.45 giúp cánh hoa bung mở nhẹ nhàng, êm dịu
    const c1 = 0.45;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  private updateAndRender(now: number, dt: number) {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Bloom flowers
    if (this.isBlooming) {
      const elapsedBloom = now - this.bloomStartTime;

      if (this.bloomFadeStart > 0) {
        const fadeElapsed = now - this.bloomFadeStart;
        const fadeDuration = 1000;
        this.bloomAlpha = Math.max(0, 1 - fadeElapsed / fadeDuration);

        if (this.bloomAlpha <= 0) {
          this.isBlooming = false;
          this.bloomFlowers = [];
          if (this.onBloomCompleteCallback) {
            this.onBloomCompleteCallback();
            this.onBloomCompleteCallback = null;
          }
        }
      }

      for (const flower of this.bloomFlowers) {
        if (elapsedBloom < flower.delayMs) {
          continue;
        }

        const bloomProgress = Math.min(1, (elapsedBloom - flower.delayMs) / flower.bloomDuration);
        const ease = this.easeOutBack(bloomProgress);

        const currentX = flower.startX + (flower.targetX - flower.startX) * Math.min(1, ease);
        const currentY = flower.startY + (flower.targetY - flower.startY) * Math.min(1, ease);
        const currentScale = Math.max(0, ease);
        const currentSize = flower.targetSize * currentScale;
        const currentRot = flower.targetRotation + flower.rotDelta * ease;
        const wobble = bloomProgress >= 1 ? Math.sin(now * flower.wobbleSpeed + flower.wobblePhase) * 2.5 : 0;

        const img = this.images[flower.flowerIndex];
        if (img && img.complete && img.naturalWidth > 0 && currentSize > 0) {
          this.ctx.save();
          this.ctx.globalAlpha = Math.max(0, this.bloomAlpha);
          this.ctx.translate(currentX + wobble, currentY + wobble);
          this.ctx.rotate(currentRot);
          this.ctx.drawImage(img, -currentSize / 2, -currentSize / 2, currentSize, currentSize);
          this.ctx.restore();
        }
      }
    }

    // 2. Falling flowers
    for (let i = this.fallingParticles.length - 1; i >= 0; i--) {
      const p = this.fallingParticles[i];
      p.age += dt;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.vx += Math.sin(p.age * 0.003) * 0.002;

      if (p.age > 1200) {
        p.opacity = Math.max(0, 1 - (p.age - 1200) / (p.maxAge - 1200));
      }

      if (p.opacity > 0) {
        const img = this.images[p.flowerIndex];
        if (img && img.complete && img.naturalWidth > 0) {
          this.ctx.save();
          this.ctx.globalAlpha = p.opacity;
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.rotation);
          this.ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
          this.ctx.restore();
        }
      }

      if (p.age >= p.maxAge || p.y > this.canvas.height + 60) {
        this.fallingParticles.splice(i, 1);
      }
    }
  }

  public clear() {
    this.fallingParticles = [];
    this.bloomFlowers = [];
    this.isBlooming = false;
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

export const flowerEngine = new FlowerAnimationEngine();
