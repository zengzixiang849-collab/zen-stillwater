const path=require('node:path');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-webgl','--ignore-gpu-blocklist']});
 const url=process.argv[2]||process.env.SITE_URL||'http://127.0.0.1:4175/';
 const errors=[],checks=[];fs.mkdirSync('output/playwright',{recursive:true});
 const context=await browser.newContext({viewport:{width:1440,height:900},timezoneId:'America/New_York'});
 const page=await context.newPage();
 const track=p=>{p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('Requested static fallback'))errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});};track(page);
 const ready=async p=>{await p.goto(url,{waitUntil:'networkidle'});await p.waitForFunction(()=>window.__study?.getState().ready,{timeout:30000});};
 if(process.argv[2]){const home=await context.newPage();track(home);await home.goto(new URL('../',url).href,{waitUntil:'networkidle'});const entry=home.locator('.century-entry');assert(await entry.isVisible());assert((await entry.getAttribute('href')).includes('century-bridge'));checks.push('portfolio home links to Century Light');await home.close();}
 await ready(page);await page.waitForTimeout(1400);
 assert.equal(await page.locator('#clock').textContent(),'17:42');checks.push('initial local time independent of viewer timezone');
 await page.locator('#time').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#clock').textContent(),'17:43');checks.push('keyboard time slider');
 await page.locator('#play').click();const t0=await page.evaluate(()=>__study.getState().minutes);await page.waitForTimeout(400);const t1=await page.evaluate(()=>__study.getState().minutes);assert(t1>t0);await page.locator('#play').click();checks.push('time playback and pause');
 await page.locator('#date').fill('2026-06-21');await page.locator('#date').dispatchEvent('change');const summer=await page.evaluate(()=>__study.getState().altitude);
 await page.locator('#date').fill('2026-12-21');await page.locator('#date').dispatchEvent('change');const winter=await page.evaluate(()=>__study.getState().altitude);assert(Math.abs(summer-winter)>10);checks.push('season changes the actual solar altitude');
 await page.locator('#date').fill('2026-10-24');await page.locator('#date').dispatchEvent('change');
 const moments=[];for(const moment of ['dawn','noon','golden','blue']){await page.locator(`[data-moment="${moment}"]`).click();await page.waitForTimeout(350);moments.push({moment,...await page.evaluate(()=>__study.getState())});}
 assert(moments[0].sun[2]>0&&moments[2].sun[2]<0);assert(moments[1].altitude>50&&moments[3].altitude<0);checks.push('dawn/noon/golden/blue sun positions');
 await page.locator('#view').click();await page.waitForTimeout(1900);assert.equal(await page.evaluate(()=>__study.getState().view),1);await page.screenshot({path:'output/playwright/alternate-view.png'});checks.push('second camera');
 await page.locator('#hide').click();assert.equal(await page.locator('.timeline').evaluate(el=>el.inert),true);await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>__study.getState().clean),false);checks.push('clean view removes hidden controls from keyboard order');
 await page.locator('#about').click();assert(await page.locator('#info').isVisible());await page.keyboard.press('Escape');assert(!(await page.locator('#info').isVisible()));checks.push('accessible native dialog');
 const downloadPromise=page.waitForEvent('download');await page.locator('#capture').click();const download=await downloadPromise;assert(download.suggestedFilename().endsWith('.png'));await download.saveAs('output/playwright/export.png');assert(fs.statSync('output/playwright/export.png').size>10000);checks.push('export real rendered image');
 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,timezoneId:'Asia/Shanghai'});const mp=await mobile.newPage();track(mp);await ready(mp);await mp.locator('[data-moment="golden"]').click();await mp.waitForTimeout(1200);await mp.screenshot({path:'output/playwright/mobile-final.png'});assert(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const bounds=await mp.locator('.timeline').boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=390&&bounds.y+bounds.height<=844);checks.push('mobile viewport, touch presets and timeline bounds');
 const reduced=await browser.newContext({viewport:{width:1000,height:800},reducedMotion:'reduce'});const rp=await reduced.newPage();track(rp);await ready(rp);assert.equal(await rp.evaluate(()=>__study.getState().sea),false);await rp.locator('[data-moment="noon"]').click();assert((await rp.evaluate(()=>__study.getState().altitude))>50);checks.push('reduced-motion static on-demand lighting');
 await rp.goto(url+'?fallback=1',{waitUntil:'networkidle'});assert(await rp.locator('#fallback').isVisible());assert(await rp.locator('#time').isDisabled());assert(await rp.locator('#poster').evaluate(i=>i.complete&&i.naturalWidth>0));checks.push('WebGL fallback poster and disabled unavailable controls');
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:1200,height:800}});const np=await nojs.newPage();await np.goto(url);assert(await np.locator('#poster').evaluate(i=>i.complete&&i.naturalWidth>0));assert(await np.locator('.noscript').isVisible());checks.push('no-JavaScript poster');
 const report={checks,moments,errors};fs.writeFileSync('output/verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();assert.equal(errors.length,0,'Browser errors');
})().catch(e=>{console.error(e);process.exit(1)});
