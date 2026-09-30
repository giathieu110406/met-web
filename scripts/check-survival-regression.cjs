const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/Tran Gia Thieu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base=process.env.BASE_URL||'http://localhost:3000';
  const unlock=async(pin='1406')=>{for(const digit of pin)await page.getByRole('button',{name:digit,exact:true}).click();};
  try{
    await page.goto(base);await unlock('1104');
    await page.getByRole('button',{name:'Bắt đầu canh hoa →'}).waitFor();await page.getByRole('button',{name:'Về màn nhập mã',exact:true}).click();
    await page.getByRole('heading',{name:'ENTER PASSCODE'}).waitFor();assert.equal(await page.locator('.survival-scene').count(),0);
    await unlock(); await page.getByText('a tiny love story',{exact:true}).waitFor();
    await page.locator('body').click({position:{x:10,y:10}});await page.keyboard.press('Enter');
    // Intro is an existing cinematic. Skip with its existing input affordance.
    await page.waitForTimeout(1500);await page.keyboard.press('Enter');await page.waitForTimeout(1000);await page.keyboard.press('Enter');
    console.log('Title exit and story start checked');
    await page.goto(base+'/?scene=playing');await unlock();
    const hero=page.locator('[data-player="hero"]');await hero.waitFor();
    const before=await hero.evaluate(e=>parseFloat(e.style.left));await page.keyboard.down('ArrowRight');await page.waitForTimeout(500);await page.keyboard.up('ArrowRight');
    assert.ok(await hero.evaluate(e=>parseFloat(e.style.left))>before,'Story movement');
    await page.keyboard.press('e');await page.waitForTimeout(100);
    await page.goto(base+'/?scene=ending&book=1');await unlock();
    await page.getByTitle('Đóng sách [Esc]').waitFor();await page.getByTitle('Trang tiếp [→]').click();await page.waitForTimeout(800);
    await page.screenshot({path:'.playwright-cli/survival/story-book.png'});await page.getByTitle('Đóng sách [Esc]').click();
    assert.equal(await page.getByTitle('Đóng sách [Esc]').count(),0);
    // Idle survival intentionally loses without state overrides; verify retry resets.
    await page.goto(base);await unlock('1104');await page.getByRole('button',{name:'Bắt đầu canh hoa →'}).click();await page.getByRole('button',{name:'Vào trận ngay →'}).click();
    await page.getByRole('heading',{name:'Thử thêm một lần nhé'}).waitFor({timeout:130000});
    await page.screenshot({path:'.playwright-cli/survival/early-defeat.png'});await page.getByRole('button',{name:'Canh hoa lần nữa'}).click();
    assert.equal(await page.locator('.survival-scene').getAttribute('data-hp'),'100');assert.equal(await page.locator('.survival-scene').getAttribute('data-flower'),'100');assert.equal(await page.locator('.survival-scene').getAttribute('data-score'),'0');
    assert.deepEqual(errors,[]);console.log('REGRESSION PASS: unlocked exit, story movement, book turn/close, natural defeat and retry');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
