// Pure simulation: seconds and logical pixels, no browser or React dependencies.
export type EnemyKind = 'leaf' | 'firefly' | 'thorn' | 'boss';
export type UpgradeId = 'heal' | 'repair' | 'damage' | 'reach' | 'dash' | 'special' | 'points';
export type Action = 'left' | 'right' | 'attack' | 'jump' | 'dash' | 'special';
export interface WaveDefinition { duration: number; spawns: { at: number; kind: EnemyKind; side: -1 | 1 }[]; rainEvery?: number }
export interface SurvivalLevel {
  id: string; name: string; background: string; ground: number; playerX: number; flowerX: number;
  waves: WaveDefinition[]; boss: { hp: number; duration: number };
}
export const GARDEN: SurvivalLevel = {
  id: 'rain-garden', name: 'Khu vườn trong mưa', background: '/assets/survival/garden.png',
  ground: 320, playerX: 260, flowerX: 300,
  waves: [6, 8, 10, 12, 14, 16].map((count, wave) => ({
    duration: 50, rainEvery: wave >= 4 ? 9 : undefined,
    spawns: Array.from({ length: count }, (_, i) => ({
      at: i * 40 / (count - 1), side: (i % 2 ? 1 : -1) as -1 | 1,
      kind: (wave >= 2 && i % 4 === 3 ? 'thorn' : wave >= 1 && i % 3 === 2 ? 'firefly' : 'leaf') as EnemyKind,
    })),
  })), boss: { hp: 600, duration: 90 },
};
export const ENEMIES = {
  leaf: { hp: 24, speed: 29, damage: 8, flower: 5, windup: .4, range: 38, score: 10, width: 38, height: 40 },
  firefly: { hp: 20, speed: 21, damage: 8, flower: 0, windup: .8, range: 250, score: 15, width: 38, height: 34 },
  thorn: { hp: 60, speed: 16, damage: 15, flower: 8, windup: .8, range: 58, score: 30, width: 56, height: 58 },
  boss: { hp: 600, speed: 24, damage: 16, flower: 8, windup: .9, range: 110, score: 300, width: 86, height: 104 },
};
export const UPGRADES: Record<UpgradeId, { name: string; detail: string; icon: string; cap: number }> = {
  heal: { name: 'Hơi ấm', detail: 'Hồi 25 máu cho bạn', icon: '♡', cap: Infinity },
  repair: { name: 'Giọt sương', detail: 'Hồi 25 sức sống cho hoa', icon: '❀', cap: Infinity },
  damage: { name: 'Ô ánh trăng', detail: 'Thêm 15% sát thương', icon: '☂', cap: 3 },
  reach: { name: 'Cánh ô rộng', detail: 'Tầm đánh thêm 12 px', icon: '↔', cap: 2 },
  dash: { name: 'Bước gió', detail: 'Lướt hồi nhanh hơn 0,15 giây', icon: '»', cap: 2 },
  special: { name: 'Mưa cánh hoa', detail: 'Tuyệt chiêu hồi nhanh hơn 1 giây', icon: '✧', cap: 3 },
  points: { name: 'Ánh sao', detail: 'Nhận thêm 100 điểm', icon: '☆', cap: Infinity },
};
export interface Enemy {
  id: number; kind: EnemyKind; x: number; y: number; hp: number; maxHp: number;
  cooldown: number; windup: number; targetX: number; target: 'player' | 'flower';
  facing: number; move: number; flash: number; charge: number;
}
export interface RunResult { won: boolean; reason: string; score: number; kills: number; wave: number; seconds: number }
export interface RunState {
  phase: 'welcome' | 'tutorial' | 'wave' | 'upgrade' | 'boss' | 'result';
  paused: boolean; elapsed: number; time: number; wave: number; spawn: number; id: number;
  player: { x: number; y: number; vy: number; moving: boolean; facing: number; hp: number; invincible: number; dashTime: number; dashCd: number; specialCd: number; attackCd: number; combo: number; slash: number; specialFx: number };
  flowerHp: number; enemies: Enemy[];
  projectiles: { id: number; x: number; y: number; vx: number; vy: number }[];
  hazards: { id: number; x: number; width: number; time: number; fired: boolean }[];
  upgrades: Record<UpgradeId, number>; choices: UpgradeId[]; score: number; kills: number;
  result?: RunResult; cue: 'attack' | 'hit' | 'special' | 'upgrade' | 'win' | 'lose' | null;
}
export interface CombatInput { held: Set<Action>; queued: Set<Action> }
export function newInput(): CombatInput { return { held: new Set(), queued: new Set() }; }
export function newRun(level = GARDEN): RunState {
  return { phase: 'welcome', paused: false, elapsed: 0, time: 0, wave: 0, spawn: 0, id: 0,
    player: { x: level.playerX, y: level.ground, vy: 0, moving: false, facing: 1, hp: 100, invincible: 0, dashTime: 0, dashCd: 0, specialCd: 0, attackCd: 0, combo: 0, slash: 0, specialFx: 0 },
    flowerHp: 100, enemies: [], projectiles: [], hazards: [],
    upgrades: { heal: 0, repair: 0, damage: 0, reach: 0, dash: 0, special: 0, points: 0 }, choices: [], score: 0, kills: 0, cue: null,
  };
}
export function spawnEnemy(s: RunState, kind: EnemyKind, side: number, level = GARDEN): Enemy {
  const hp = kind === 'boss' ? level.boss.hp : ENEMIES[kind].hp;
  const enemy: Enemy = { id: ++s.id, kind, x: side < 0 ? 22 : 578, y: level.ground - (kind === 'firefly' ? 43 : 0), hp, maxHp: hp,
    cooldown: kind === 'boss' ? 1.5 : .6, windup: 0, targetX: 0, target: 'player', facing: -side, move: 0, flash: 0, charge: 0 };
  s.enemies.push(enemy); return enemy;
}
export function beginTutorial(s: RunState, level = GARDEN) {
  s.phase = 'tutorial'; s.time = 0;
  const dummy = spawnEnemy(s, 'leaf', 1, level); dummy.x = 360; dummy.hp = dummy.maxHp = 999;
}
export function beginWave(s: RunState) {
  s.phase = 'wave'; s.time = 0; s.spawn = 0; s.enemies = []; s.projectiles = []; s.hazards = [];
}
export function upgradeChoices(s: RunState, random = Math.random): UpgradeId[] {
  const pool = (Object.keys(UPGRADES) as UpgradeId[]).filter(id => id !== 'points'
    && s.upgrades[id] < UPGRADES[id].cap && (id !== 'heal' || s.player.hp < 100) && (id !== 'repair' || s.flowerHp < 100));
  // Shuffle once per break, never during rendering.
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const result = pool.slice(0, 3); while (result.length < 3) result.push('points'); return result;
}
export function chooseUpgrade(s: RunState, index: number, level = GARDEN) {
  if (s.phase !== 'upgrade' || s.paused || !s.choices[index]) return;
  const id = s.choices[index]; s.upgrades[id]++;
  if (id === 'heal') s.player.hp = Math.min(100, s.player.hp + 25);
  if (id === 'repair') s.flowerHp = Math.min(100, s.flowerHp + 25);
  if (id === 'points') s.score += 100;
  s.choices = []; s.cue = 'upgrade';
  s.wave++;
  if (s.wave >= level.waves.length) {
    s.phase = 'boss'; s.time = 0; s.enemies = []; s.projectiles = []; s.hazards = [];
    spawnEnemy(s, 'boss', 1, level);
  } else beginWave(s);
}
function hurtPlayer(s: RunState, damage: number) {
  if (s.phase === 'tutorial' || s.player.invincible > 0 || s.player.dashTime > 0) return;
  s.player.hp = Math.max(0, s.player.hp - damage); s.player.invincible = .6; s.cue = 'hit';
}
function finish(s: RunState, won: boolean, reason: string, level: SurvivalLevel) {
  if (won) s.score += Math.round(5 * (s.player.hp + s.flowerHp));
  s.result = { won, reason, score: s.score, kills: s.kills, wave: Math.min(s.wave + 1, level.waves.length), seconds: s.elapsed };
  s.phase = 'result'; s.cue = won ? 'win' : 'lose';
}
function rain(s: RunState, x: number, width = 70) { s.hazards.push({ id: ++s.id, x: Math.max(40, Math.min(560, x)), width, time: 1, fired: false }); }
export function step(s: RunState, input: CombatInput, dt: number, level = GARDEN, random = Math.random) {
  s.cue = null;
  if (s.paused || s.phase === 'welcome' || s.phase === 'result') { input.queued.clear(); return; }
  s.time += dt; s.elapsed += dt;
  if (s.phase === 'upgrade') { input.queued.clear(); if (s.time >= 10) chooseUpgrade(s, 0, level); return; }
  const p = s.player;
  for (const key of ['invincible', 'dashCd', 'specialCd', 'attackCd', 'slash', 'specialFx'] as const) p[key] = Math.max(0, p[key] - dt);
  const direction = Number(input.held.has('right')) - Number(input.held.has('left'));
  p.moving = direction !== 0;
  if (direction && p.dashTime <= 0) p.facing = direction;
  if (input.queued.has('jump') && p.y >= level.ground) p.vy = -420;
  if (input.queued.has('dash') && p.dashCd <= 0) { p.dashTime = .2; p.dashCd = 1.2 - .15 * s.upgrades.dash; p.slash = 0; }
  p.x = Math.max(18, Math.min(582, p.x + (p.dashTime > 0 ? p.facing * 450 : direction * 180) * dt));
  p.dashTime = Math.max(0, p.dashTime - dt);
  p.vy += 1100 * dt; p.y = Math.min(level.ground, p.y + p.vy * dt); if (p.y === level.ground) p.vy = 0;
  const damageMultiplier = 1 + .15 * s.upgrades.damage;
  if ((input.held.has('attack') || input.queued.has('attack')) && p.attackCd <= 0 && p.dashTime <= 0) {
    const damage = [12, 12, 20][p.combo] * damageMultiplier;
    p.combo = (p.combo + 1) % 3; p.attackCd = .35; p.slash = .18; s.cue = 'attack';
    for (const e of s.enemies) {
      const dx = (e.x - p.x) * p.facing;
      if (e.hp > 0 && dx >= -14 && dx <= 65 + s.upgrades.reach * 12 + ENEMIES[e.kind].width / 2 && Math.abs((e.y - 25) - (p.y - 25)) < 66) {
        e.hp -= damage; e.flash = .15; e.x = Math.max(20, Math.min(580, e.x + p.facing * (e.kind === 'boss' ? 2 : 9)));
      }
    }
  }
  if (input.queued.has('special') && p.specialCd <= 0) {
    p.specialCd = 10 - s.upgrades.special; p.specialFx = .45; s.cue = 'special';
    for (const e of s.enemies) if (e.hp > 0 && Math.hypot(e.x - p.x, e.y - p.y) <= 140) {
      e.hp -= 35 * damageMultiplier; e.flash = .25;
      e.x = Math.max(20, Math.min(580, e.x + (Math.sign(e.x - p.x) || p.facing) * (e.kind === 'boss' ? 8 : 32)));
    }
    s.projectiles = s.projectiles.filter(b => Math.hypot(b.x - p.x, b.y - p.y) > 140);
  }
  input.queued.clear();
  if (s.phase === 'tutorial') {
    for (const e of s.enemies) { e.hp = 999; e.flash = Math.max(0, e.flash - dt); }
    if (s.time >= 20) beginWave(s);
    return;
  }
  if (s.phase === 'wave') {
    const wave = level.waves[s.wave];
    if (s.time >= wave.duration) {
      s.phase = 'upgrade'; s.time = 0; s.enemies = []; s.projectiles = []; s.hazards = []; s.choices = upgradeChoices(s, random); return;
    }
    while (s.spawn < wave.spawns.length && wave.spawns[s.spawn].at <= s.time && s.enemies.length < 8) {
      const spawn = wave.spawns[s.spawn++]; spawnEnemy(s, spawn.kind, spawn.side, level);
    }
    if (wave.rainEvery && Math.floor(s.time / wave.rainEvery) > Math.floor((s.time - dt) / wave.rainEvery)) rain(s, p.x);
  }
  for (const e of s.enemies) {
    e.flash = Math.max(0, e.flash - dt);
    if (e.hp <= 0) continue;
    const info = ENEMIES[e.kind];
    if (e.charge > 0) {
      e.x = Math.max(20, Math.min(580, e.x + e.facing * 290 * dt)); e.charge = Math.max(0, e.charge - dt);
      if (Math.abs(e.x - p.x) < 50 && Math.abs(e.y - p.y) < 65) hurtPlayer(s, info.damage);
      continue;
    }
    if (e.windup > 0) {
      e.windup -= dt;
      if (e.windup <= 0) {
        if (e.kind === 'firefly') {
          const dx = e.targetX - e.x, dy = p.y - 28 - (e.y - 15), distance = Math.max(1, Math.hypot(dx, dy));
          s.projectiles.push({ id: ++s.id, x: e.x, y: e.y - 15, vx: dx / distance * 105, vy: dy / distance * 105 });
        } else if (e.kind === 'boss' && e.move === 1) {
          rain(s, e.targetX, 85); rain(s, e.targetX + (e.targetX > 300 ? -120 : 120), 65);
        } else if (e.kind === 'boss' && e.move === 2) e.charge = .65;
        else {
          if (Math.abs(e.x - p.x) < info.range + 12 && Math.abs(e.y - p.y) < 65) hurtPlayer(s, info.damage);
          if (e.target === 'flower' && Math.abs(e.x - level.flowerX) < info.range + 10) s.flowerHp = Math.max(0, s.flowerHp - info.flower);
        }
        e.cooldown = e.kind === 'boss' ? (e.hp < e.maxHp / 2 ? .6 : 1) : e.kind === 'firefly' ? 1.7 : 1.5;
        if (e.kind === 'boss') e.move = (e.move + 1) % 3;
      }
      continue;
    }
    e.cooldown = Math.max(0, e.cooldown - dt);
    const targetPlayer = e.kind === 'boss' || e.kind === 'firefly' || Math.abs(e.x - p.x) < 105;
    const targetX = targetPlayer ? p.x : level.flowerX;
    e.facing = Math.sign(targetX - e.x) || e.facing;
    const distance = Math.abs(targetX - e.x);
    if (distance > (e.kind === 'firefly' ? 170 : info.range - 8)) e.x += e.facing * info.speed * dt;
    if (e.cooldown <= 0 && (distance <= info.range || e.kind === 'boss')) {
      e.windup = info.windup; e.targetX = targetX; e.target = targetPlayer ? 'player' : 'flower';
    }
  }
  for (const b of s.projectiles) {
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (Math.abs(b.x - p.x) < 18 && b.y > p.y - 52 && b.y < p.y + 3) { hurtPlayer(s, 8); b.x = -100; }
  }
  s.projectiles = s.projectiles.filter(b => b.x > -20 && b.x < 620 && b.y > 0 && b.y < 400);
  for (const h of s.hazards) {
    h.time -= dt;
    if (h.time <= 0 && !h.fired) { h.fired = true; if (Math.abs(p.x - h.x) < h.width / 2 + 12) hurtPlayer(s, 12); }
  }
  s.hazards = s.hazards.filter(h => h.time > -.3);
  const deadBoss = s.enemies.some(e => e.kind === 'boss' && e.hp <= 0);
  s.enemies = s.enemies.filter(e => { if (e.hp > 0) return true; s.score += ENEMIES[e.kind].score; s.kills++; return false; });
  if (p.hp <= 0 || s.flowerHp <= 0) finish(s, false, p.hp <= 0 ? 'Bạn đã kiệt sức trong mưa.' : 'Đóa hoa cần thêm một người canh giữ.', level);
  else if (deadBoss) finish(s, true, 'Bình minh đã về. Đóa hoa vẫn còn ở đây.', level);
  else if (s.phase === 'boss' && s.time >= level.boss.duration) finish(s, false, 'Bóng tối đã phủ kín khu vườn.', level);
}

export const FIXED_STEP = 1 / 60;
export function advance(s: RunState, input: CombatInput, seconds: number, accumulator: number, level = GARDEN) {
  if (s.paused || s.phase === 'welcome' || s.phase === 'result') { input.queued.clear(); return 0; }
  accumulator += Math.min(seconds, .05);
  let cue: RunState['cue'] = null;
  while (accumulator + 1e-9 >= FIXED_STEP) { step(s, input, FIXED_STEP, level); if (s.cue) cue = s.cue; accumulator -= FIXED_STEP; }
  s.cue = cue; return Math.max(0, accumulator);
}

export type Records = Record<string, { best: number; wins: number }>;
export const RECORD_KEY = 'met.survival.v1';
export function parseRecords(raw: string | null): Records {
  try {
    const value: unknown = JSON.parse(raw || '{}'); const records: Records = {};
    if (!value || typeof value !== 'object' || Array.isArray(value)) return records;
    for (const [id, entry] of Object.entries(value)) {
      if (id === '__proto__' || !entry || typeof entry !== 'object') continue;
      const { best, wins } = entry;
      if (Number.isSafeInteger(best) && best >= 0 && Number.isSafeInteger(wins) && wins >= 0) records[id] = { best, wins };
    }
    return records;
  } catch { return {}; }
}
