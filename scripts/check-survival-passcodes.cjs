const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Tran Gia Thieu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const enter = async pin => { for (const digit of pin) await page.getByRole('button', { name: digit, exact: true }).click(); };
  try {
    await page.goto(process.env.BASE_URL || 'http://localhost:3000');
    await enter('0000'); await page.waitForTimeout(750);
    await page.getByRole('heading', { name: 'ENTER PASSCODE' }).waitFor();
    assert.equal(await page.locator('.survival-scene').count(), 0);
    await enter('1104');
    // Keyboard editing while the bloom transition is running must not switch destination.
    await page.keyboard.press('Backspace'); await page.keyboard.type('1406');
    await page.getByRole('button', { name: 'Bắt đầu canh hoa →' }).waitFor({ timeout: 30000 });
    assert.equal(await page.getByText('a tiny love story', { exact: true }).count(), 0);
    await page.getByRole('button', { name: 'Về màn nhập mã', exact: true }).click();
    await page.getByRole('heading', { name: 'ENTER PASSCODE' }).waitFor();
    assert.equal(await page.locator('.survival-scene').count(), 0);
    await page.keyboard.type('1104', { delay: 100 });
    await page.getByRole('button', { name: 'Bắt đầu canh hoa →' }).click();
    await page.getByRole('button', { name: 'Vào trận ngay →' }).click();
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Về màn nhập mã', exact: true }).click();
    await enter('1406');
    await page.getByText('a tiny love story', { exact: true }).waitFor();
    assert.equal(await page.locator('.survival-scene').count(), 0);
    assert.equal(await page.getByRole('button', { name: /Đêm Canh Hoa/ }).count(), 0);
    await page.reload(); await page.getByRole('heading', { name: 'ENTER PASSCODE' }).waitFor();
    assert.deepEqual(errors, []);
    console.log('PASS: 1104 keypad/keyboard opens survival only; 1406 opens story only; wrong code rejected; bloom locked; welcome/pause exits relock; reload locks.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
