const fs = require('fs');
const sharp = require('sharp');

// Generates a genuine 16-bit pixel art umbrella canopy viewed from underneath/front
async function generatePixelUmbrella() {
  const W = 480;
  const H = 140;
  const buffer = Buffer.alloc(W * H * 4, 0); // RGBA

  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= W || y < 0 || y >= H) return;
    const idx = (y * W + x) * 4;
    buffer[idx] = r;
    buffer[idx + 1] = g;
    buffer[idx + 2] = b;
    buffer[idx + 3] = a;
  }

  // Canopy top ellipse: center at (W/2, 22), radius X = 230, radius Y = 70
  // Canopy bottom scalloped rim: 8 scalloped ribs
  const cx = W / 2;
  const cy = 20;
  const rx = 232;
  const ry = 62;

  const numRibs = 8;
  const ribAngles = [];
  for (let i = 0; i <= numRibs; i++) {
    // from PI (left) to 0 (right)
    ribAngles.push(Math.PI - (i * Math.PI) / numRibs);
  }

  // For each pixel in bounding box
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      const distFromCenter = dx * dx + dy * dy;

      // Outer canopy top boundary
      if (y < cy && distFromCenter > 1.0) continue;
      if (y < cy - 12) continue; // Apex cut

      // Calculate angle from apex
      const angle = Math.atan2(y - cy, x - cx);
      if (angle < -0.05 || angle > Math.PI + 0.05) continue;

      // Bottom scalloped rim calculation
      // Normalized angle t from 0 (left) to 1 (right)
      const t = 1 - angle / Math.PI;
      const ribFloat = t * numRibs;
      const ribIdx = Math.floor(ribFloat);
      const ribFrac = ribFloat - ribIdx; // 0 to 1 inside segment

      // Scalloped arch: sag in middle of segment
      const sag = Math.sin(ribFrac * Math.PI) * 16;
      const baseRimY = cy + Math.sin(angle) * 82;
      const rimY = baseRimY - sag;

      // Inside canopy region
      if (y <= rimY && distFromCenter <= 1.05) {
        // Distance along panel (0 at top, 1 at rim)
        const v = Math.max(0, Math.min(1, (y - cy) / (rimY - cy + 0.1)));
        // Panel curve highlight (brightest in middle of panel)
        const uHighlight = Math.sin(ribFrac * Math.PI);

        // Palette blending
        // Base red tones:
        // Darkest at ribs and edges, bright crimson on curved highlights
        let r, g, b;

        const isEvenPanel = ribIdx % 2 === 0;

        if (distFromCenter > 0.98 || y >= rimY - 2) {
          // Dark pixel outline
          r = 38; g = 8; b = 17;
        } else if (uHighlight > 0.65 && v > 0.25 && v < 0.85) {
          // Highlight shine
          if (isEvenPanel) {
            r = 244; g = 63; b = 94; // #f43f5e
          } else {
            r = 225; g = 29; b = 72; // #e11d48
          }
        } else if (uHighlight > 0.3) {
          // Midtone rich crimson
          r = 190; g = 18; b = 60; // #be123c
        } else {
          // Shadow near ribs
          r = 136; g = 19; b = 55; // #881337
        }

        // Top inner apex ring shadow
        if (distFromCenter < 0.12) {
          r = 50; g = 10; b = 20;
        }

        setPixel(x, y, r, g, b, 255);
      }
    }
  }

  // Draw iron rib spokes radiating from apex to scalloped tips
  for (let i = 0; i <= numRibs; i++) {
    const angle = ribAngles[i];
    const tipX = cx + Math.cos(angle) * (rx * 0.96);
    const tipY = cy + Math.sin(angle) * 82;

    // Line from apex to tip
    const steps = 90;
    for (let s = 10; s <= steps; s++) {
      const frac = s / steps;
      const lx = Math.round(cx + (tipX - cx) * frac);
      const ly = Math.round(cy + (tipY - cy) * frac);
      // Dark rib line with metallic pixel highlight
      setPixel(lx, ly, 30, 20, 25, 255);
      setPixel(lx + 1, ly, 75, 65, 70, 240);
    }

    // Scallop tip metal bead / ferrule
    const bx = Math.round(tipX);
    const by = Math.round(tipY);
    setPixel(bx, by, 20, 20, 25, 255);
    setPixel(bx, by + 1, 220, 225, 235, 255); // glint
    setPixel(bx, by + 2, 50, 45, 50, 255);

    // Hanging raindrop on alternating ribs
    if (i % 2 === 1) {
      setPixel(bx, by + 3, 147, 197, 253, 220); // water drop
      setPixel(bx, by + 4, 186, 230, 253, 240);
      setPixel(bx, by + 5, 224, 242, 254, 200);
    }
  }

  // Top center ferrule hub
  for (let dy = -3; dy <= 6; dy++) {
    for (let dx = -8; dx <= 8; dx++) {
      if (dx * dx + dy * dy * 2 <= 38) {
        const isHighlight = dy < 0 && dx < 0;
        setPixel(
          Math.round(cx + dx),
          Math.round(cy + dy),
          isHighlight ? 160 : 40,
          isHighlight ? 150 : 35,
          isHighlight ? 155 : 40,
          255
        );
      }
    }
  }

  // Save to public/assets/others/fpv-umbrella-canopy-pixel.png
  const dest = 'public/assets/others/fpv-umbrella-canopy-pixel.png';
  await sharp(buffer, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .toFile(dest);

  console.log('Saved genuine 16-bit pixel umbrella canopy to:', dest);
}

generatePixelUmbrella().catch(console.error);
