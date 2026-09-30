// Run: node scripts/check-survival.cjs. No test framework or added dependencies.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const source = ts.transpileModule(fs.readFileSync('src/lib/survival.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const compiled = new Module('survival'); compiled._compile(source, 'survival.cjs');
const { newRun, newInput, beginWave, step, advance, spawnEnemy, upgradeChoices, chooseUpgrade, parseRecords, GARDEN } = compiled.exports;
function setup() { const s = newRun(); beginWave(s); s.spawn = 999; return [s, newInput()]; }
function tick(s, i, n = 1) { for (let t = 0; t < n; t++) step(s, i, 1 / 60); }
{
  const [s, i] = setup(); const e = spawnEnemy(s, 'thorn', 1); e.x = s.player.x + 50;
  i.held.add('attack'); tick(s, i); assert.equal(e.hp, 48); tick(s, i, 10); assert.equal(e.hp, 48, 'One hit per swing');
  tick(s, i, 12); assert.equal(e.hp, 36); tick(s, i, 22); assert.equal(e.hp, 16, 'Third swing deals 20');
}
{
  const [s, i] = setup();
  const hit = () => s.projectiles.push({ id: 100, x: s.player.x, y: s.player.y - 20, vx: 0, vy: 0 });
  hit(); tick(s, i); assert.equal(s.player.hp, 92); hit(); tick(s, i); assert.equal(s.player.hp, 92);
  tick(s, i, 40); i.queued.add('dash'); hit(); tick(s, i); assert.equal(s.player.hp, 92);
  const cd = s.player.dashCd; i.queued.add('dash'); tick(s, i); assert.ok(s.player.dashCd < cd);
}
{
  const [s, i] = setup(); s.spawn = 0; tick(s, i); assert.equal(s.spawn, 1);
  s.enemies = Array.from({ length: 8 }, () => ({ ...s.enemies[0], hp: 999 })); s.time = 39;
  tick(s, i); assert.equal(s.spawn, 1, 'Spawn cap queues enemies');
  s.time = 50; tick(s, i); assert.equal(s.phase, 'upgrade'); assert.equal(s.enemies.length, 0); assert.equal(s.score, 0);
  assert.equal(new Set(s.choices).size, 3);
  s.player.hp = 100; s.flowerHp = 100; s.upgrades.damage = 3; s.upgrades.reach = 2; s.upgrades.dash = 2; s.upgrades.special = 3;
  assert.deepEqual(upgradeChoices(s), ['points', 'points', 'points']);
  s.choices = ['points', 'points', 'points']; s.wave = 5; chooseUpgrade(s, 0); assert.equal(s.phase, 'boss'); assert.equal(s.enemies[0].hp, 600);
}
{
  const [s, i] = setup(); s.phase = 'boss'; const boss = spawnEnemy(s, 'boss', 1); boss.x = s.player.x + 30; boss.hp = 1;
  s.player.hp = 8; s.projectiles.push({ id: 20, x: s.player.x, y: s.player.y - 20, vx: 0, vy: 0 });
  i.held.add('attack'); tick(s, i); assert.equal(s.result.won, false, 'Death wins a simultaneous trade');
  const [s2, i2] = setup(); s2.phase = 'boss'; s2.time = 90; tick(s2, i2); assert.equal(s2.result.won, false);
}
{
  const values = [30, 60, 120].map(fps => { const [s, i] = setup(); let acc = 0; i.held.add('right');
    for (let n = 0; n < fps; n++) acc = advance(s, i, 1 / fps, acc);
    return [s.player.x, s.elapsed]; });
  for (const value of values) { assert.ok(Math.abs(value[0] - 440) < 1e-8); assert.ok(Math.abs(value[1] - 1) < 1e-8); }
  const [s, i] = setup(); s.paused = true; i.held.add('right'); tick(s, i, 60); assert.equal(s.elapsed, 0); assert.equal(s.player.x, 260);
  s.paused = false; i.queued.add('jump'); i.held.clear(); tick(s, i); assert.ok(s.player.y < 320, 'Brief taps survive until a step');
}
assert.deepEqual(parseRecords('{bad'), {}); assert.deepEqual(parseRecords('{"x":{"best":-1,"wins":2}}'), {});
assert.deepEqual(parseRecords('{"x":{"best":10,"wins":2}}'), { x: { best: 10, wins: 2 } });

// Input-only balance pilot: no health overrides, time warp within the simulation only.
// This checks feasibility; real browser wall-clock run is recorded separately.
function pilot(s, i) {
  i.held.clear(); i.held.add('attack');
  if (s.phase === 'upgrade') {
    const priorities = s.player.hp < 60 ? ['heal', 'damage', 'repair', 'reach', 'special', 'dash', 'points'] : s.flowerHp < 70 ? ['repair', 'damage', 'heal', 'reach', 'special', 'dash', 'points'] : ['damage', 'reach', 'special', 'heal', 'repair', 'dash', 'points'];
    const id = priorities.find(id => s.choices.includes(id)); chooseUpgrade(s, s.choices.indexOf(id)); return;
  }
  const enemies = s.enemies.filter(e => e.hp > 0).sort((a,b) => Math.abs(a.x - GARDEN.flowerX) - Math.abs(b.x - GARDEN.flowerX));
  const e = enemies[0];
  if (e) {
    const dx = e.x - s.player.x;
    if (Math.abs(dx) > 70) i.held.add(dx > 0 ? 'right' : 'left');
    else if (Math.sign(dx) !== s.player.facing) i.held.add(dx > 0 ? 'right' : 'left');
    if (Math.abs(dx) < 140) i.queued.add('special');
    if (e.windup > 0 && e.windup < .12 && Math.abs(dx) < 125) i.queued.add('dash');
    if (s.hazards.some(h => Math.abs(h.x - s.player.x) < h.width / 2 + 15 && h.time < .12 && h.time > 0)) i.queued.add('dash');
    if (s.projectiles.some(b => Math.abs(b.x - s.player.x) < 70)) i.queued.add('jump');
  } else if (Math.abs(s.player.x - 300) > 5) i.held.add(s.player.x > 300 ? 'left' : 'right');
}
if (require.main === module) {
  let wins = 0;
  for (let trial = 0; trial < 3; trial++) {
    const s = newRun(), i = newInput(); beginWave(s);
    for (let n = 0; n < 60 * 600 && !s.result; n++) { pilot(s, i); step(s, i, 1 / 60); }
    console.log('BALANCE', trial, s.result, 'hp', s.player.hp, 'flower', s.flowerHp); if (s.result?.won) wins++;
  }
  assert.ok(wins > 0, 'Input-only pilot can finish without invulnerability');
  console.log('PASS: combat, cooldowns, caps, upgrades, result precedence, timing, storage and balance');
}
module.exports = { simulation: compiled.exports, pilot };
