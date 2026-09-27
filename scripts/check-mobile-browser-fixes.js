// playwright-cli -s=met-mobile run-code --filename=scripts/check-mobile-browser-fixes.js
async (page) => {
  const check = (value, message) => { if (!value) throw new Error(message); };
  const context = await page.context().browser().newContext({
    viewport: { width: 844, height: 320 }, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1',
  });
  const phone = await context.newPage();
  const errors = [];
  phone.on('pageerror', error => errors.push(error.message));
  await phone.addInitScript(() => {
    window.testAudio = [];
    const Original = window.AudioContext;
    window.AudioContext = class extends Original {
      constructor(...args) { super(...args); this.testAnalysers = []; window.testAudio.push(this); }
      createGain() {
        const gain = super.createGain();
        const analyser = this.createAnalyser();
        gain.connect(analyser);
        this.testAnalysers.push(analyser);
        return gain;
      }
    };
    const request = HTMLElement.prototype.requestFullscreen;
    HTMLElement.prototype.requestFullscreen = function (options) {
      window.testFullscreen = options;
      return request.call(this, options);
    };
  });
  try {
    await phone.goto('http://localhost:3000/?scene=playing');
    await phone.getByRole('button', { name: /Vào trải nghiệm/ }).click();
    await phone.waitForFunction(() => !!document.fullscreenElement);
    check(await phone.evaluate(() => window.testFullscreen.navigationUI === 'hide'), 'Entry requests hidden navigation UI');
    await phone.waitForFunction(() => window.testAudio.some(ctx => ctx.state === 'running'));
    await phone.evaluate(() => Promise.all(window.testAudio.map(ctx => ctx.suspend())));
    await phone.getByRole('button', { name: 'Tắt âm thanh', exact: true }).click();
    await phone.waitForFunction(() => window.testAudio.every(ctx => ctx.state === 'running'));
    await phone.getByRole('button', { name: 'Bật âm thanh', exact: true }).click();
    await phone.waitForFunction(() => window.testAudio.some(ctx => ctx.testAnalysers.some(analyser => {
      const samples = new Float32Array(analyser.fftSize);
      analyser.getFloatTimeDomainData(samples);
      return samples.some(sample => Math.abs(sample) > 0.0001);
    })));
    const suppressed = await phone.locator('.mobile-primary').evaluate(element => {
      const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
      element.dispatchEvent(event);
      return event.defaultPrevented && getComputedStyle(element).userSelect === 'none';
    });
    check(suppressed, 'Long press context menu must be suppressed');
    check(await phone.locator('body > div').first().evaluate(element => getComputedStyle(element).backgroundImage === 'none'), 'Mobile removes the selectable background image');
    const cdp = await context.newCDPSession(phone);
    const right = await phone.getByRole('button', { name: 'Sang phải', exact: true }).boundingBox();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: right.x + 30, y: right.y + 25, id: 1 }] });
    await phone.waitForTimeout(1100);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    check(await phone.getByRole('button', { name: 'Sang phải', exact: true }).isVisible(), 'Holding controls keeps game available');
    await phone.getByRole('button', { name: 'Thoát toàn màn hình', exact: true }).click();
    await phone.evaluate(() => { document.documentElement.requestFullscreen = async () => { throw new Error('Unsupported iOS tab'); }; });
    await phone.getByRole('button', { name: 'Toàn màn hình', exact: true }).click();
    await phone.locator('.mobile-notice').filter({ hasText: 'Thêm vào Màn hình chính' }).waitFor();
    check(await phone.evaluate(() => !document.fullscreenElement), 'Fallback must not claim native fullscreen');
    const response = await context.request.get('http://localhost:3000/manifest.webmanifest');
    const manifest = await response.json();
    check(manifest.display === 'standalone' && manifest.start_url === '/', 'Home screen mode configured');

    await phone.goto('http://localhost:3000/?scene=ending&book=1');
    await phone.locator('.book-fit .stf__parent').waitFor({ state: 'attached' }).catch(() => {});
    await phone.locator('.book-fit').waitFor();
    for (const [width, height] of [[844, 320], [667, 300], [390, 844], [1024, 768]]) {
      await phone.setViewportSize({ width, height });
      await phone.waitForTimeout(650);
      const rect = await phone.locator('.book-fit').boundingBox();
      check(rect.x >= 0 && rect.y >= 12 && rect.x + rect.width <= width && rect.y + rect.height <= height - 12, `Book fits ${width}x${height}`);
      await phone.screenshot({ path: `.playwright-cli/book-cover-${width}x${height}.png` });
    }
    await phone.setViewportSize({ width: 844, height: 320 });
    await phone.getByTitle('Trang tiếp [→]', { exact: true }).click();
    await phone.getByText(/Trang 1 \/ 6/).waitFor();
    await phone.waitForTimeout(800);
    await phone.screenshot({ path: '.playwright-cli/book-spread-mobile.png' });
    const fit = await phone.locator('.book-fit').boundingBox();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: fit.x + fit.width * 0.8, y: fit.y + fit.height / 2, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: fit.x + fit.width * 0.2, y: fit.y + fit.height / 2, id: 1 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await phone.getByText(/Trang 3 \/ 6/).waitFor();
    await phone.getByTitle('Đóng sách [Esc]', { exact: true }).click();
    await phone.locator('.book-overlay').waitFor({ state: 'hidden' });
    check(errors.length === 0, errors.join('\n'));
    console.log('PASS: fullscreen gesture + fallback, standalone manifest, audio unlock/recovery, hold/context menu protection, book fitting four sizes, page navigation and scaled swipe.');
  } finally { await context.close(); }
}
