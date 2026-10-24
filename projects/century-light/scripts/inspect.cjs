const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||path.join(require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const fs=require('node:fs');
(async()=>{
fs.mkdirSync('output/playwright',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.goto(process.argv[2]||process.env.SITE_URL||'http://127.0.0.1:4175/',{waitUntil:'networkidle'});
await page.waitForFunction(()=>window.__study?.getState().ready,{timeout:30000});
await page.waitForTimeout(1800);
await page.screenshot({path:'output/playwright/initial.png'});
const poster=await page.evaluate(()=>document.querySelector('canvas').toDataURL('image/jpeg',.92));
fs.writeFileSync('public/poster.jpg',Buffer.from(poster.split(',')[1],'base64'));
const states=[];
for(const moment of ['dawn','noon','golden','blue']){
 await page.locator(`[data-moment="${moment}"]`).click();await page.waitForTimeout(500);
 await page.screenshot({path:`output/playwright/${moment}.png`});
 states.push({moment,...await page.evaluate(()=>window.__study.getState())});
}
await page.setViewportSize({width:390,height:844});await page.locator('[data-moment="golden"]').click();await page.waitForTimeout(600);await page.screenshot({path:'output/playwright/mobile.png'});
console.log(JSON.stringify({states,errors},null,2));
await browser.close();
if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
