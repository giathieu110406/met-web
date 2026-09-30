// PLAYWRIGHT_MODULE may point to an existing Playwright installation; no project dependency.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Tran Gia Thieu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const output = path.resolve('.playwright-cli/survival'); fs.mkdirSync(output, { recursive: true });
const base = process.env.BASE_URL || 'http://localhost:3000';
const realTime = process.argv.includes('--realtime');
async function unlock(page) {
  await page.goto(base); await page.getByRole('button', { name: '1', exact: true }).waitFor();
  for (const digit of '1104') await page.getByRole('button', { name: digit, exact: true }).click();
  await page.getByRole('button', { name: 'Bắt đầu canh hoa →' }).waitFor({ timeout: 30000 });
}
async function openSurvival(page) {
  await page.getByRole('button', { name: 'Bắt đầu canh hoa →' }).waitFor({ timeout: 30000 });
}
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  try {
    await unlock(page);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.survival-scene').getAttribute('data-phase'), 'welcome', 'Tab must not start a game');
    await openSurvival(page);
    await page.screenshot({ path: path.join(output, 'desktop-welcome.png') });
    assert.equal(await page.locator('.survival-scene img').evaluateAll(images => images.every(i => i.complete && i.naturalWidth > 0)), true);
    if (process.argv.includes('--smoke')) { console.log('SMOKE OK', errors); return; }
    await page.getByRole('button', { name: 'Bắt đầu canh hoa →' }).click();
    await page.keyboard.down('KeyD'); await page.waitForTimeout(180); await page.keyboard.up('KeyD');
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);
    assert.ok(Number(await page.locator('[data-player="survival"]').getAttribute('data-y')) < 320);
    await page.getByRole('button', { name: 'Vào trận ngay →' }).click();
    await page.keyboard.press('Escape');
    const elapsed = await page.locator('.survival-scene').getAttribute('data-elapsed');
    await page.waitForTimeout(300); assert.equal(await page.locator('.survival-scene').getAttribute('data-elapsed'), elapsed);
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click();
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    await page.getByRole('button', { name: 'Tiếp tục', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Chơi lại', exact: true }).click();
    assert.equal(await page.locator('.survival-scene').getAttribute('data-hp'), '100');
    await page.getByRole('button', { name: 'Vào trận ngay →' }).click();
    await page.screenshot({ path: path.join(output, 'desktop-battle.png') });
    if (realTime) {
      const started = Date.now(); let lastLog = 0;
      // Input-only pilot sees the same DOM positions/telegraphs as a player.
      await page.evaluate(() => {
        const held = new Set();
        const key = (code, down) => { window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code, key: code, bubbles: true })); };
        window.survivalPilot = setInterval(() => {
          const scene = document.querySelector('.survival-scene'); if (!scene) return;
          const desired = new Set();
          if (scene.dataset.phase === 'upgrade') {
            const cards = [...document.querySelectorAll('.survival-upgrades button')];
            const hp = Number(scene.dataset.hp), flower = Number(scene.dataset.flower);
            const names = hp < 60 ? ['Hơi ấm', 'Ô ánh trăng', 'Giọt sương', 'Cánh ô rộng', 'Mưa cánh hoa'] : flower < 70 ? ['Giọt sương', 'Ô ánh trăng', 'Hơi ấm', 'Cánh ô rộng'] : ['Ô ánh trăng', 'Cánh ô rộng', 'Mưa cánh hoa', 'Hơi ấm', 'Giọt sương'];
            // Leave 4 seconds to read the cards, as in a normal run.
            const countdown = document.querySelector('.survival-panel p')?.textContent || '';
            if (/sau [0-6] giây/.test(countdown)) (names.map(name => cards.find(b => b.textContent.includes(name))).find(Boolean) || cards[0])?.click();
          } else if (['wave', 'boss'].includes(scene.dataset.phase) && scene.dataset.paused !== 'true') {
            desired.add('KeyJ');
            const hero = document.querySelector('[data-player="survival"]');
            const x = Number(hero.dataset.x);
            const enemies = [...document.querySelectorAll('.survival-enemy')].filter(e => Number(e.dataset.hp) > 0).sort((a,b) => Math.abs(Number(a.dataset.x) - 300) - Math.abs(Number(b.dataset.x) - 300));
            const e = enemies[0];
            const tap = code => { key(code, true); key(code, false); };
            if (e) {
              const dx = Number(e.dataset.x) - x;
              const facing = hero.style.transform.includes('-1') ? -1 : 1;
              if (Math.abs(dx) > 68 || Math.sign(dx) !== facing) desired.add(dx > 0 ? 'KeyD' : 'KeyA');
              if (Math.abs(dx) < 140) tap('KeyL');
              const windup = Number(e.dataset.windup);
              if (windup > 0 && windup < .14 && Math.abs(dx) < 125) tap('KeyK');
              if ([...document.querySelectorAll('.survival-projectile')].some(b => Math.abs(parseFloat(b.style.left) - x) < 70)) tap('Space');
              if ([...document.querySelectorAll('.survival-hazard:not(.fired)')].some(h => Math.abs(parseFloat(h.style.left) + parseFloat(h.style.width) / 2 - x) < parseFloat(h.style.width) / 2 + 20)) desired.add(x < 300 ? 'KeyA' : 'KeyD');
            } else if (Math.abs(x - 300) > 8) desired.add(x > 300 ? 'KeyA' : 'KeyD');
          }
          for (const code of held) if (!desired.has(code)) { key(code, false); held.delete(code); }
          for (const code of desired) if (!held.has(code)) { key(code, true); held.add(code); }
        }, 50);
      });
      while (Date.now() - started < 600000) {
        await page.waitForTimeout(1000);
        const info = await page.locator('.survival-scene').evaluate(e => ({ ...e.dataset }));
        if (Date.now() - lastLog > 20000) { console.log('REALTIME', Math.round((Date.now() - started) / 1000), info); lastLog = Date.now(); }
        if (info.phase === 'result') break;
      }
      await page.evaluate(() => clearInterval(window.survivalPilot));
      const result = await page.locator('.survival-panel').innerText();
      fs.writeFileSync(path.join(output, 'realtime.json'), JSON.stringify({ wallSeconds: (Date.now()-started)/1000, result, errors }, null, 2));
      await page.screenshot({ path: path.join(output, 'desktop-result.png') });
      assert.match(result, /Hoa vẫn nở vì bạn/, 'Real-time run must win');
      assert.ok((Date.now() - started) / 1000 >= 300 && (Date.now() - started) / 1000 <= 600);
      console.log('REALTIME WIN', result);
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('met.survival.v1')));
      assert.equal(saved['rain-garden'].wins, 1); assert.ok(saved['rain-garden'].best > 0);
      await unlock(page); await openSurvival(page);
      assert.match(await page.locator('.survival-record').innerText(), /1 lần gọi bình minh/);
    }
    assert.deepEqual(errors, []); console.log('BROWSER PASS');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
