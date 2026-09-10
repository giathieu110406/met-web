const fs = require('fs');
const path = require('path');

function getAllFiles(dir, exts = ['.ts', '.tsx', '.css', '.js']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(file))) {
      results.push(fullPath);
    }
  });
  return results;
}

const srcFiles = getAllFiles(path.resolve('src'));
const assetRegex = /['"](\/assets\/[^'"]+)['"]/g;
const foundAssets = new Set();

srcFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = assetRegex.exec(content)) !== null) {
    foundAssets.add(match[1]);
  }
});

const relRegex = /from\s+['"](\.\.[^'"]*public\/assets\/[^'"]+)['"]/g;
srcFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = relRegex.exec(content)) !== null) {
    const p = match[1].replace(/.*public/, '');
    foundAssets.add(p);
  }
});

console.log('Total referenced assets in src:', foundAssets.size);
const publicDir = path.resolve('public');
const missing = [];
const exactMatches = [];
const caseMismatches = [];

function getActualPublicFiles(dir, prefix = '') {
  let map = {};
  const list = fs.readdirSync(dir);
  list.forEach(item => {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    const rel = (prefix ? prefix + '/' : '') + item;
    if (stat.isDirectory()) {
      Object.assign(map, getActualPublicFiles(full, rel));
    } else {
      map[rel.toLowerCase()] = rel;
    }
  });
  return map;
}

const actualFilesMap = getActualPublicFiles(publicDir);

foundAssets.forEach(assetPath => {
  const cleanPath = assetPath.replace(/^\//, '');
  const cleanPathLower = cleanPath.toLowerCase();
  if (actualFilesMap[cleanPathLower]) {
    const actualCase = actualFilesMap[cleanPathLower];
    if (actualCase === cleanPath) {
      exactMatches.push(cleanPath);
    } else {
      caseMismatches.push({ referenced: cleanPath, actual: actualCase });
    }
  } else {
    missing.push(cleanPath);
  }
});

console.log('Exact matches count:', exactMatches.length);
console.log('Case mismatches:', JSON.stringify(caseMismatches, null, 2));
console.log('Missing assets:', JSON.stringify(missing, null, 2));

// Check sizes of all actual files in public
console.log('\n--- Actual Public Files & Sizes ---');
const sizes = [];
Object.values(actualFilesMap).forEach(rel => {
  const full = path.join(publicDir, rel);
  const s = fs.statSync(full).size;
  sizes.push({ file: rel, sizeKb: (s / 1024).toFixed(1) + ' KB', bytes: s });
});
sizes.sort((a, b) => b.bytes - a.bytes);
sizes.slice(0, 15).forEach(s => console.log(`${s.file}: ${s.sizeKb}`));
