const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Tran Gia Thieu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
fs.mkdirSync('.playwright-cli/survival', { recursive: true });
(async()=>{
  const browser = await chromium.launch({channel:'chrome',headless:true});
  const context = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36'});
  const page = await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try {
    await page.goto(process.env.BASE_URL || 'http://localhost:3000');
    for (const digit of '1104') await page.getByRole('button',{name:digit,exact:true}).click();
    await page.getByRole('heading',{name:'Xoay ngang để bắt đầu'}).waitFor();
    await page.setViewportSize({width:844,height:390});
    await page.evaluate(()=>{document.documentElement.requestFullscreen=()=>Promise.reject(new Error('Emulated unsupported'));});
    await page.getByRole('button',{name:/Vào trải nghiệm/}).click();
    if(await page.locator('.mobile-notice').count()) await page.locator('.mobile-notice').click();
    await page.getByRole('button',{name:'Bắt đầu canh hoa →'}).click();
    await page.getByRole('button',{name:'Vào trận ngay →'}).click();
    const hero=page.locator('[data-player="survival"]');
    const position=()=>hero.evaluate(e=>({x:Number(e.dataset.x),y:Number(e.dataset.y)}));
    const cdp=await context.newCDPSession(page);
    const point=async(name,id)=>{const b=await page.getByRole('button',{name,exact:true}).boundingBox();return {x:b.x+b.width/2,y:b.y+b.height/2,id};};
    const right=await point('Sang phải',1),jump=await point('Nhảy',2),attack=await point('Đánh',3);
    const before=await position();
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[right]});
    await page.waitForTimeout(150);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[right,jump,attack]});
    await page.waitForTimeout(150);
    const after=await position();assert.ok(after.x>before.x);assert.ok(after.y<before.y);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
    await page.waitForTimeout(200);const released=await position();await page.waitForTimeout(200);assert.equal((await position()).x,released.x);
    await page.setViewportSize({width:390,height:844});
    await page.getByRole('heading',{name:'Xoay ngang để bắt đầu'}).waitFor();
    await page.screenshot({path:'.playwright-cli/survival/mobile-portrait.png'});
    const paused=await page.locator('.survival-scene').getAttribute('data-elapsed');await page.waitForTimeout(300);assert.equal(await page.locator('.survival-scene').getAttribute('data-elapsed'),paused);
    await page.setViewportSize({width:844,height:390});
    await page.getByRole('button',{name:'Tiếp tục',exact:true}).click();
    for(const [width,height] of [[844,390],[667,375]]){
      await page.setViewportSize({width,height});await page.waitForTimeout(150);
      await page.screenshot({path:`.playwright-cli/survival/mobile-${width}x${height}.png`});
      const frame=await page.locator('.game-frame').boundingBox();
      for(const button of await page.locator('.survival-touch').all()){
        const b=await button.boundingBox();assert.ok(b.width>=44&&b.height>=44,'Physical touch targets');
        assert.ok(b.x>=0&&b.x+b.width<=width&&b.y>=0&&b.y+b.height<=height,'Controls fit');
        assert.ok(b.x+b.width<=frame.x+1||b.x>=frame.x+frame.width-1,'Touch controls outside arena');
      }
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.getByRole('button',{name:'Tạm dừng',exact:true}).click();
      for(const button of await page.locator('.survival-buttons button').all()){const b=await button.boundingBox();assert.ok(b.height>=43.9,'Modal target size');assert.ok(b.y>=0&&b.y+b.height<=height);}
      await page.screenshot({path:`.playwright-cli/survival/mobile-pause-${width}.png`});
      await page.getByRole('button',{name:'Tiếp tục',exact:true}).click();
    }
    assert.deepEqual(errors,[]);console.log('MOBILE PASS: multitouch, cancel, portrait pause, resume, 844/667 bounds and physical targets');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
