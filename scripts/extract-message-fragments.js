const fs = require('fs');
const zlib = require('zlib');

function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  let offset = 8;
  let idatChunks = [];
  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.slice(offset + 4, offset + 8).toString();
    if (type === 'IDAT') idatChunks.push(buf.slice(offset + 8, offset + 8 + len));
    offset += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idatChunks));
  const bpp = 4; // RGBA
  const stride = width * bpp;
  const pixels = Buffer.alloc(width * height * 4);

  let rawOffset = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[rawOffset++];
    const lineStart = y * stride;
    const prevLineStart = (y - 1) * stride;

    for (let x = 0; x < stride; x++) {
      const rawByte = raw[rawOffset++];
      const a = x >= bpp ? pixels[lineStart + x - bpp] : 0;
      const b = y > 0 ? pixels[prevLineStart + x] : 0;
      const c = (x >= bpp && y > 0) ? pixels[prevLineStart + x - bpp] : 0;

      let val = rawByte;
      if (filter === 1) { // Sub
        val = (rawByte + a) & 0xff;
      } else if (filter === 2) { // Up
        val = (rawByte + b) & 0xff;
      } else if (filter === 3) { // Average
        val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
      } else if (filter === 4) { // Paeth
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        let pr = c;
        if (pa <= pb && pa <= pc) pr = a;
        else if (pb <= pc) pr = b;
        val = (rawByte + pr) & 0xff;
      }
      pixels[lineStart + x] = val;
    }
  }
  return { width, height, pixels };
}

const { width, height, pixels } = decodePNG('public/assets/others/message.png');
console.log('Decoded successfully! Image size:', width, 'x', height);

// Find bounds of paper & text
// In message.png, background is white (255,255,255) or transparent.
// The paper is brownish: r > 150, g > 100, b < 100 or black outline
let minX = width, maxX = 0, minY = height, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];
    const a = pixels[idx + 3];
    // Check non-white pixels
    if (a > 50 && !(r > 240 && g > 240 && b > 240)) {
      // Find paper region (y < 300 to exclude hands at bottom)
      if (y < 310 && x > 100 && x < 500) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
}
console.log('Paper bounds:', { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY });

// Let's find columns where text exists
let textHist = [];
for (let x = minX; x <= maxX; x++) {
  let blackPixels = 0;
  for (let y = minY + 30; y <= maxY - 30; y++) {
    const idx = (y * width + x) * 4;
    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];
    // black text is very dark (r < 60, g < 60, b < 60)
    if (r < 80 && g < 80 && b < 80) blackPixels++;
  }
  textHist.push({ x, count: blackPixels });
}

let activeColumns = textHist.filter(t => t.count > 0);
console.log('Columns with text:', activeColumns.map(t => t.x));
