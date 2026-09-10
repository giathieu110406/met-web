const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const brainDir = 'C:\\Users\\Tran Gia Thieu\\.gemini\\antigravity-ide\\brain\\438c1864-c18e-4c08-8286-dad53245dcd7';

  // 1. Copy FPV Bridge Starry illustration
  const bridgeSrc = path.join(brainDir, 'fpv_bridge_starry_clean_1789024531948.jpg');
  const bridgeDest = path.join(__dirname, '..', 'public', 'assets', 'others', 'fpv-bridge-starry.jpg');
  fs.copyFileSync(bridgeSrc, bridgeDest);
  console.log('Copied bridge starry illustration to:', bridgeDest);

  // 2. Copy FPV Cherry Garden Entrance illustration
  const cherrySrc = path.join(brainDir, 'fpv_cherry_garden_entrance_1789024553622.jpg');
  const cherryDest = path.join(__dirname, '..', 'public', 'assets', 'others', 'fpv-cherry-garden-entrance.jpg');
  fs.copyFileSync(cherrySrc, cherryDest);
  console.log('Copied cherry garden entrance illustration to:', cherryDest);

  // 3. Wooden Swing Frame is now procedurally generated with authentic retro pixel art by scripts/generate-pixel-swing.js

  // 4. Process FPV Red Umbrella Canopy
  const umbrellaSrc = path.join(brainDir, 'fpv_red_umbrella_canopy_1789024581743.jpg');
  const umbrellaDest = path.join(__dirname, '..', 'public', 'assets', 'others', 'fpv-umbrella-canopy-pixel.png');

  const umbrellaImg = sharp(umbrellaSrc);
  const { data: uData, info: uInfo } = await umbrellaImg
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: uw, height: uh, channels: uc } = uInfo;
  for (let i = 0; i < uw * uh; i++) {
    const idx = i * uc;
    const r = uData[idx];
    const g = uData[idx + 1];
    const b = uData[idx + 2];
    if (r < 24 && g < 24 && b < 24) {
      uData[idx + 3] = 0; // Transparent
    }
  }

  await sharp(uData, { raw: { width: uw, height: uh, channels: uc } })
    .trim()
    .resize({ width: 720, height: 260, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'nearest' })
    .png()
    .toFile(umbrellaDest);
  console.log('Created pixel umbrella canopy at:', umbrellaDest);
}

main().catch(console.error);
