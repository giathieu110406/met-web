const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const othersDir = path.resolve('public/assets/others');

async function compressAll() {
  console.log('=== STARTING IMAGE OPTIMIZATION PIPELINE ===');
  const files = fs.readdirSync(othersDir);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const filePath = path.join(othersDir, file);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;

    const ext = path.extname(file).toLowerCase();
    const sizeKb = stat.size / 1024;
    totalBefore += stat.size;

    // Only compress files larger than 100KB or JPGs
    if (ext === '.jpg' || ext === '.jpeg') {
      const buffer = fs.readFileSync(filePath);
      // High-quality mozjpeg compression, progressive, preserving colors
      const optimized = await sharp(buffer)
        .jpeg({ quality: 84, mozjpeg: true, progressive: true })
        .toBuffer();

      if (optimized.length < stat.size) {
        fs.writeFileSync(filePath, optimized);
        const newSizeKb = optimized.length / 1024;
        totalAfter += optimized.length;
        console.log(`✓ Optimized ${file}: ${sizeKb.toFixed(1)} KB -> ${newSizeKb.toFixed(1)} KB (-${(((stat.size - optimized.length) / stat.size) * 100).toFixed(0)}%)`);
      } else {
        totalAfter += stat.size;
        console.log(`- Skipped ${file}: already optimal`);
      }
    } else if (ext === '.png' && stat.size > 100 * 1024) {
      const buffer = fs.readFileSync(filePath);
      // PNG compression with max level and palette when suitable
      const optimized = await sharp(buffer)
        .png({ compressionLevel: 9, quality: 90 })
        .toBuffer();

      if (optimized.length < stat.size) {
        fs.writeFileSync(filePath, optimized);
        const newSizeKb = optimized.length / 1024;
        totalAfter += optimized.length;
        console.log(`✓ Optimized ${file}: ${sizeKb.toFixed(1)} KB -> ${newSizeKb.toFixed(1)} KB (-${(((stat.size - optimized.length) / stat.size) * 100).toFixed(0)}%)`);
      } else {
        totalAfter += stat.size;
        console.log(`- Kept ${file} as-is (${sizeKb.toFixed(1)} KB)`);
      }
    } else {
      totalAfter += stat.size;
    }
  }

  console.log('============================================');
  console.log(`Total Before: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total After:  ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved:        ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}% payload reduction!`);
}

compressAll().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
