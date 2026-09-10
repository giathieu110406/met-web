const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// Canvas dimensions
const W = 88;
const H = 104;

const png = new PNG({ width: W, height: H });

// Fill completely transparent
for (let i = 0; i < W * H * 4; i++) {
  png.data[i] = 0;
}

// Color palette (exact match with park-bench-empty.png and wooden-bridge.png)
const PALETTE = {
  black: [0, 0, 0, 255],         // #000000 - Crisp pixel outline
  woodHi: [180, 120, 80, 255],   // #b47850 - Warm light timber highlight
  woodMid: [143, 86, 59, 255],   // #8f563b - Warm chestnut timber body
  woodShad: [73, 40, 26, 255],   // #49281a - Deep shadow timber
  woodDeep: [48, 24, 14, 255],   // #30180e - Rear leg shadow
  ironDark: [34, 32, 52, 255],   // #222034 - Dark iron plate
  ironMid: [60, 60, 75, 255],    // #3c3c4b - Slate iron plate
  ironHi: [144, 144, 168, 255],  // #9090a8 - Bolt highlight
};

function setPixel(x, y, color) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const idx = (y * W + x) << 2;
  png.data[idx] = color[0];
  png.data[idx + 1] = color[1];
  png.data[idx + 2] = color[2];
  png.data[idx + 3] = color[3];
}

function fillRect(x1, y1, w, h, color) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      setPixel(x1 + dx, y1 + dy, color);
    }
  }
}

// 1. Rear legs (slanted, darker depth tone)
// Left rear leg: (20, 16) down to (26, 103)
for (let y = 16; y < 104; y++) {
  const t = (y - 16) / (104 - 16);
  const cx = Math.round(20 + t * 6);
  fillRect(cx - 3, y, 6, 1, PALETTE.black);
  fillRect(cx - 2, y, 4, 1, PALETTE.woodDeep);
  fillRect(cx - 1, y, 2, 1, PALETTE.woodShad);
}

// Right rear leg: (67, 16) down to (61, 103)
for (let y = 16; y < 104; y++) {
  const t = (y - 16) / (104 - 16);
  const cx = Math.round(67 - t * 6);
  fillRect(cx - 3, y, 6, 1, PALETTE.black);
  fillRect(cx - 2, y, 4, 1, PALETTE.woodDeep);
  fillRect(cx - 1, y, 2, 1, PALETTE.woodShad);
}

// 2. Front legs (slanted outwards, warm timber tones)
// Left front leg: (15, 14) down to (5, 103)
for (let y = 14; y < 104; y++) {
  const t = (y - 14) / (104 - 14);
  const cx = Math.round(15 - t * 10);
  fillRect(cx - 3, y, 7, 1, PALETTE.black);
  fillRect(cx - 2, y, 5, 1, PALETTE.woodMid);
  fillRect(cx - 2, y, 2, 1, PALETTE.woodHi);
  fillRect(cx + 1, y, 2, 1, PALETTE.woodShad);
}

// Right front leg: (72, 14) down to (82, 103)
for (let y = 14; y < 104; y++) {
  const t = (y - 14) / (104 - 14);
  const cx = Math.round(72 + t * 10);
  fillRect(cx - 3, y, 7, 1, PALETTE.black);
  fillRect(cx - 2, y, 5, 1, PALETTE.woodMid);
  fillRect(cx - 2, y, 2, 1, PALETTE.woodHi);
  fillRect(cx + 1, y, 2, 1, PALETTE.woodShad);
}

// 3. Horizontal cross-braces (left and right)
// Left cross-brace at y = 72..78
fillRect(7, 72, 18, 7, PALETTE.black);
fillRect(8, 73, 16, 5, PALETTE.woodMid);
fillRect(8, 73, 16, 2, PALETTE.woodHi);
fillRect(8, 76, 16, 2, PALETTE.woodShad);
// Iron plate bolts on left brace
fillRect(8, 74, 2, 2, PALETTE.ironMid);
setPixel(8, 74, PALETTE.ironHi);
fillRect(21, 74, 2, 2, PALETTE.ironMid);
setPixel(21, 74, PALETTE.ironHi);

// Right cross-brace at y = 72..78
fillRect(63, 72, 18, 7, PALETTE.black);
fillRect(64, 73, 16, 5, PALETTE.woodMid);
fillRect(64, 73, 16, 2, PALETTE.woodHi);
fillRect(64, 76, 16, 2, PALETTE.woodShad);
// Iron plate bolts on right brace
fillRect(65, 74, 2, 2, PALETTE.ironMid);
setPixel(65, 74, PALETTE.ironHi);
fillRect(78, 74, 2, 2, PALETTE.ironMid);
setPixel(78, 74, PALETTE.ironHi);

// 4. Main Top Crossbeam (x: 4..83, y: 5..17)
fillRect(4, 5, 80, 13, PALETTE.black);
fillRect(5, 6, 78, 11, PALETTE.woodMid);
fillRect(5, 6, 78, 3, PALETTE.woodHi);
fillRect(5, 13, 78, 4, PALETTE.woodShad);

// End grain caps on left and right of top beam
fillRect(4, 6, 2, 11, PALETTE.woodShad);
fillRect(82, 6, 2, 11, PALETTE.woodShad);

// 5. Iron Joint Brackets at top junctions
// Left iron plate (x: 11..21, y: 4..18)
fillRect(11, 4, 11, 15, PALETTE.black);
fillRect(12, 5, 9, 13, PALETTE.ironDark);
fillRect(13, 6, 7, 11, PALETTE.ironMid);
// 4 Corner bolts on left bracket
fillRect(13, 7, 2, 2, PALETTE.ironDark);
setPixel(13, 7, PALETTE.ironHi);
fillRect(17, 7, 2, 2, PALETTE.ironDark);
setPixel(17, 7, PALETTE.ironHi);
fillRect(13, 14, 2, 2, PALETTE.ironDark);
setPixel(13, 14, PALETTE.ironHi);
fillRect(17, 14, 2, 2, PALETTE.ironDark);
setPixel(17, 14, PALETTE.ironHi);

// Right iron plate (x: 66..76, y: 4..18)
fillRect(66, 4, 11, 15, PALETTE.black);
fillRect(67, 5, 9, 13, PALETTE.ironDark);
fillRect(68, 6, 7, 11, PALETTE.ironMid);
// 4 Corner bolts on right bracket
fillRect(69, 7, 2, 2, PALETTE.ironDark);
setPixel(69, 7, PALETTE.ironHi);
fillRect(73, 7, 2, 2, PALETTE.ironDark);
setPixel(73, 7, PALETTE.ironHi);
fillRect(69, 14, 2, 2, PALETTE.ironDark);
setPixel(69, 14, PALETTE.ironHi);
fillRect(73, 14, 2, 2, PALETTE.ironDark);
setPixel(73, 14, PALETTE.ironHi);

// 6. Hanging Eye-Bolts / Steel Rings for Ropes
// Left hook: center x = 37, y = 17..22
fillRect(35, 17, 4, 6, PALETTE.black);
fillRect(36, 17, 2, 5, PALETTE.ironMid);
setPixel(36, 18, PALETTE.ironHi);

// Right hook: center x = 51, y = 17..22
fillRect(49, 17, 4, 6, PALETTE.black);
fillRect(50, 17, 2, 5, PALETTE.ironMid);
setPixel(50, 18, PALETTE.ironHi);

const outPath = path.join(__dirname, '..', 'public', 'assets', 'others', 'wooden-swing-v2-pixel.png');
png.pack().pipe(fs.createWriteStream(outPath)).on('finish', () => {
  console.log('Successfully saved new pixel swing sprite to:', outPath);
});
