// Run with: playwright-cli -s=met-mobile run-code --filename=scripts/check-mobile.js
async (page) => {
  const check = (value, message) => { if (!value) throw new Error(message); };
  const context = await page.context().browser().newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36' });
  const mobile = await context.newPage();
  const errors = [];
  mobile.on('pageerror', (error) => errors.push(error.message));
  try {
    await mobile.goto('http://localhost:3000');
    await mobile.getByRole('heading', { name: 'Xoay ngang để bắt đầu' }).waitFor();
    await mobile.screenshot({ path: '.playwright-cli/mobile-portrait.png' });
    // Simulate Safari without fullscreen or orientation-lock support.
    await mobile.evaluate(() => {
      document.documentElement.requestFullscreen = async () => { throw new Error('Unsupported'); };
    });
    await mobile.getByRole('button', { name: /Vào trải nghiệm/ }).click();
    check(await mobile.locator('.mobile-gate').isVisible(), 'Portrait must remain gated');
    await mobile.setViewportSize({ width: 844, height: 390 });
    await mobile.locator('.mobile-gate').waitFor({ state: 'hidden' });
    check(await mobile.locator('.game-canvas h1').textContent() === 'Met', 'Entry must not accidentally start the title');
    await mobile.locator('.mobile-notice').click();
    await mobile.locator('.game-canvas').click();
    await mobile.getByRole('button', { name: 'Sang phải', exact: true }).waitFor({ timeout: 15000 });
    const hero = mobile.locator('[data-player="hero"]');
    const position = () => hero.evaluate((element) => ({ x: parseFloat(element.style.left), y: parseFloat(element.style.top) }));
    const cdp = await context.newCDPSession(mobile);
    const right = await mobile.getByRole('button', { name: 'Sang phải', exact: true }).boundingBox();
    const jump = await mobile.getByRole('button', { name: 'Nhảy', exact: true }).boundingBox();
    const point = (box, id) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2, id });
    const start = await position();
    await mobile.screenshot({ path: '.playwright-cli/mobile-before-input.png' });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(right, 1)] });
    await mobile.waitForTimeout(220);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(right, 1), point(jump, 2)] });
    await mobile.waitForTimeout(150);
    const moving = await position();
    check(moving.x > start.x, 'Holding right should move the hero');
    check(moving.y < start.y, 'Second finger should jump while moving');
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await mobile.waitForTimeout(300);
    const released = await position();
    await mobile.waitForTimeout(150);
    check(Math.abs((await position()).x - released.x) < 1, 'Cancellation must release movement');
    await mobile.setViewportSize({ width: 390, height: 844 });
    await mobile.locator('.mobile-gate').waitFor();
    const paused = await position();
    await mobile.waitForTimeout(250);
    check((await position()).x === paused.x, 'Portrait must pause the hero');
    await mobile.setViewportSize({ width: 844, height: 390 });
    await mobile.locator('.mobile-gate').waitFor({ state: 'hidden' });
    check(Math.abs((await position()).x - paused.x) < 1, 'Rotation must preserve hero position');
    for (const [width, height] of [[844, 390], [667, 375], [568, 320], [1024, 768]]) {
      await mobile.setViewportSize({ width, height });
      await mobile.waitForTimeout(100);
      const bounds = await mobile.locator('.game-frame').boundingBox();
      check(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= width + 1 && bounds.y + bounds.height <= height + 1, `Canvas must fit ${width}x${height}`);
      const buttons = await mobile.locator('.mobile-control').all();
      for (const button of buttons) {
        const box = await button.boundingBox();
        check(box.width >= 44 && box.height >= 44, 'Touch target must be at least 44px');
        check(box.x >= 0 && box.x + box.width <= width, 'Controls must fit viewport');
      }
      check(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
      await mobile.screenshot({ path: `.playwright-cli/mobile-${width}x${height}.png` });
      const leftButton = await mobile.getByRole('button', { name: 'Sang trái', exact: true }).boundingBox();
      const rightButton = await mobile.getByRole('button', { name: 'Sang phải', exact: true }).boundingBox();
      check(leftButton.y === rightButton.y && rightButton.x > leftButton.x, 'Movement buttons must share one row');
      check(await mobile.locator('.mobile-primary').count() === 1, 'Only one combined action button');
    }
    await mobile.setViewportSize({ width: 844, height: 390 });
    // Restore the real API and check a user-initiated fullscreen transition.
    await mobile.evaluate(() => { delete document.documentElement.requestFullscreen; });
    await mobile.getByRole('button', { name: 'Toàn màn hình', exact: true }).click();
    await mobile.waitForFunction(() => document.fullscreenElement === document.documentElement);
    await mobile.getByRole('button', { name: 'Thoát toàn màn hình', exact: true }).click();
    await mobile.waitForFunction(() => document.fullscreenElement === null);
    const rightAgain = await mobile.getByRole('button', { name: 'Sang phải', exact: true }).boundingBox();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point(rightAgain, 1)] });
    await mobile.waitForFunction(() => parseFloat(document.querySelector('[data-player="hero"]').style.left) >= 160);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    for (let i = 0; i < 4 && await mobile.getByRole('button', { name: 'Sang phải', exact: true }).isVisible(); i++) {
      await mobile.getByRole('button', { name: 'Tương tác / Tiếp', exact: true }).click();
      await mobile.waitForTimeout(300);
    }
    await mobile.getByRole('button', { name: 'Sang phải', exact: true }).waitFor({ state: 'hidden' });
    await mobile.waitForTimeout(500);
    const subtitle = mobile.locator('.game-subtitle');
    check((await subtitle.boundingBox()).height < 100, 'Mobile subtitle should occupy less than a quarter of landscape height');
    check(!await mobile.locator('.game-subtitle-actions').isVisible(), 'Mobile hides duplicate subtitle buttons');
    await mobile.screenshot({ path: '.playwright-cli/mobile-mailbox.png' });
    check(await mobile.getByRole('button', { name: 'Tương tác / Tiếp', exact: true }).isVisible(), 'Scene must expose combined action');
    for (let i = 0; i < 7 && !await mobile.getByRole('button', { name: 'Sang phải', exact: true }).isVisible(); i++) {
      await mobile.locator('.mobile-primary').click();
      await mobile.waitForTimeout(160);
    }
    await mobile.getByRole('button', { name: 'Sang phải', exact: true }).waitFor();
    check(errors.length === 0, errors.join('\n'));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/?scene=playing');
    const desktop = await page.locator('.game-canvas').boundingBox();
    check(desktop.width === 600 && desktop.height === 400, 'Desktop keeps original canvas size');
    check(await page.locator('.mobile-control').count() === 0, 'Desktop hides touch controls');
    await page.keyboard.press('F2');
    await page.getByRole('switch', { name: 'Mobile mode' }).check();
    await page.keyboard.press('F2');
    await page.locator('.mobile-gate').waitFor();
    await page.evaluate(() => { document.documentElement.requestFullscreen = async () => { throw new Error('Preview'); }; });
    await page.getByRole('button', { name: /Vào trải nghiệm/ }).click();
    await page.locator('.mobile-primary').waitFor();
    const previewPosition = await page.locator('[data-player="hero"]').evaluate(element => element.style.left);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('heading', { name: 'Xoay ngang để bắt đầu' }).waitFor();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator('.mobile-gate').waitFor({ state: 'hidden' });
    await page.keyboard.press('F2');
    await page.getByRole('switch', { name: 'Mobile mode' }).uncheck();
    await page.keyboard.press('F2');
    await page.waitForFunction(() => document.querySelector('.game-stage').dataset.mobile === 'false');
    check(await page.locator('.mobile-control').count() === 0, 'Disabling preview restores desktop');
    check(await page.locator('[data-player="hero"]').evaluate(element => element.style.left) === previewPosition, 'Preview toggle must preserve progress');
    for (const [agent, touchPoints, expected] of [
      ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36', 10, false],
      ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1', 5, true],
    ]) {
      const device = await page.context().browser().newContext({ userAgent: agent, hasTouch: true, viewport: { width: 1024, height: 768 } });
      const devicePage = await device.newPage();
      await devicePage.addInitScript(points => Object.defineProperty(navigator, 'maxTouchPoints', { get: () => points }), touchPoints);
      await devicePage.goto('http://localhost:3000');
      await devicePage.waitForTimeout(300);
      check((await devicePage.locator('.game-stage').getAttribute('data-mobile') === 'true') === expected, 'Device recognition must distinguish iPad and touch desktop');
      await device.close();
    }
    console.log('PASS: portrait gate, unsupported fullscreen fallback, actual fullscreen entry/exit, title entry, multi-touch movement + jump, pointer cancellation, rotation pause/resume, mailbox interaction, four landscape sizes, desktop, no runtime errors.');
  } finally {
    await context.close();
  }
}
