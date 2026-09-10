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
  const bpp = 4;
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
      if (filter === 1) val = (rawByte + a) & 0xff;
      else if (filter === 2) val = (rawByte + b) & 0xff;
      else if (filter === 3) val = (rawByte + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) {
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

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[i] = c;
  }
  let c = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xFF];
  }
  return (c ^ (-1)) >>> 0;
}

function encodePNG(w, h, rgba) {
  const stride = w * 4;
  const raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  function makeChunk(type, data) {
    const typeBuf = Buffer.from(type);
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

const { width: srcW, height: srcH, pixels: srcPixels } = decodePNG('public/assets/others/message.png');

const minCropX = 135;
const maxCropX = 450;
const minCropY = 75;
const maxCropY = 308;
const paperW = maxCropX - minCropX;
const paperH = maxCropY - minCropY;

function tornOffset(y, seed) {
  return Math.round(Math.sin(y * 0.18 + seed) * 3 + Math.cos(y * 0.45 + seed * 2) * 2);
}

const paperPixels = Buffer.alloc(paperW * paperH * 4);
for (let y = 0; y < paperH; y++) {
  const srcY = minCropY + y;
  for (let x = 0; x < paperW; x++) {
    const srcX = minCropX + x;
    const srcIdx = (srcY * srcW + srcX) * 4;
    const dstIdx = (y * paperW + x) * 4;

    const r = srcPixels[srcIdx];
    const g = srcPixels[srcIdx + 1];
    const b = srcPixels[srcIdx + 2];
    const a = srcPixels[srcIdx + 3];

    // Background white
    const isWhite = r > 240 && g > 240 && b > 240;
    // Skin is peachy: r > 215
    const isSkin = (r > 215 && g >= 160 && g <= 215 && b >= 140 && b <= 195 && (x < 15 || x > paperW - 20));
    // Finger black border line sticking out
    const isFingerLine = (x > paperW - 12 && r < 50 && g < 50 && b < 50 && (y > 90 && y < 140));

    if (isWhite || isSkin || isFingerLine) {
      paperPixels[dstIdx + 3] = 0;
    } else {
      paperPixels[dstIdx] = r;
      paperPixels[dstIdx + 1] = g;
      paperPixels[dstIdx + 2] = b;
      paperPixels[dstIdx + 3] = a;
    }
  }
}

// Cut positions
const cut1Base = 93;
const cut2Base = 210;

// Piece 0
const p0W = cut1Base + 8;
const p0Pixels = Buffer.alloc(p0W * paperH * 4);
for (let y = 0; y < paperH; y++) {
  const cut1 = cut1Base + tornOffset(y, 1);
  for (let x = 0; x < p0W; x++) {
    const dstIdx = (y * p0W + x) * 4;
    if (x <= cut1) {
      const srcIdx = (y * paperW + x) * 4;
      p0Pixels[dstIdx] = paperPixels[srcIdx];
      p0Pixels[dstIdx + 1] = paperPixels[srcIdx + 1];
      p0Pixels[dstIdx + 2] = paperPixels[srcIdx + 2];
      p0Pixels[dstIdx + 3] = paperPixels[srcIdx + 3];
    } else {
      p0Pixels[dstIdx + 3] = 0;
    }
  }
}

// Piece 1
const p1Start = cut1Base - 8;
const p1W = (cut2Base + 8) - p1Start;
const p1Pixels = Buffer.alloc(p1W * paperH * 4);
for (let y = 0; y < paperH; y++) {
  const cut1 = cut1Base + tornOffset(y, 1);
  const cut2 = cut2Base + tornOffset(y, 2);
  for (let x = 0; x < p1W; x++) {
    const globalX = p1Start + x;
    const dstIdx = (y * p1W + x) * 4;
    if (globalX >= cut1 && globalX <= cut2) {
      const srcIdx = (y * paperW + globalX) * 4;
      p1Pixels[dstIdx] = paperPixels[srcIdx];
      p1Pixels[dstIdx + 1] = paperPixels[srcIdx + 1];
      p1Pixels[dstIdx + 2] = paperPixels[srcIdx + 2];
      p1Pixels[dstIdx + 3] = paperPixels[srcIdx + 3];
    } else {
      p1Pixels[dstIdx + 3] = 0;
    }
  }
}

// Piece 2
const p2Start = cut2Base - 8;
const p2W = paperW - p2Start;
const p2Pixels = Buffer.alloc(p2W * paperH * 4);
for (let y = 0; y < paperH; y++) {
  const cut2 = cut2Base + tornOffset(y, 2);
  for (let x = 0; x < p2W; x++) {
    const globalX = p2Start + x;
    const dstIdx = (y * p2W + x) * 4;
    if (globalX >= cut2 && globalX < paperW) {
      const srcIdx = (y * paperW + globalX) * 4;
      p2Pixels[dstIdx] = paperPixels[srcIdx];
      p2Pixels[dstIdx + 1] = paperPixels[srcIdx + 1];
      p2Pixels[dstIdx + 2] = paperPixels[srcIdx + 2];
      p2Pixels[dstIdx + 3] = paperPixels[srcIdx + 3];
    } else {
      p2Pixels[dstIdx + 3] = 0;
    }
  }
}

fs.writeFileSync('public/assets/others/message-piece-0.png', encodePNG(p0W, paperH, p0Pixels));
fs.writeFileSync('public/assets/others/message-piece-1.png', encodePNG(p1W, paperH, p1Pixels));
fs.writeFileSync('public/assets/others/message-piece-2.png', encodePNG(p2W, paperH, p2Pixels));

console.log('Piece 0:', p0W, 'x', paperH);
console.log('Piece 1:', p1W, 'x', paperH);
console.log('Piece 2:', p2W, 'x', paperH);
