/** Loads a built copy and reports what painted. Usage: node tools/smoke.mjs <url> */
import { chromium } from 'playwright';

const url = process.argv[2];
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
const failed = [];
page.on('requestfailed', (r) => failed.push(r.url()));
page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(6000);
console.log('title   :', await page.title());
console.log('text    :', (await page.evaluate(() => document.body.innerText)).slice(0, 160).replace(/\n/g, ' / '));
console.log('imgs ok :', await page.evaluate(() =>
  [...document.images].filter((i) => i.naturalWidth > 0).length + '/' + document.images.length));
console.log('failed  :', failed.filter((u) => !/fonts\.|unsplash/.test(u)).join('\n          ') || 'none');
await browser.close();
