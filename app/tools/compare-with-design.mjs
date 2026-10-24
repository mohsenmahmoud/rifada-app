/**
 * Renders the design's own bundle beside this port and diffs the text of
 * every gallery screen.
 *
 * The source diff in `project/` only compares one export to the next, so
 * anything the port got wrong that the design never touched stays invisible
 * to it. This catches those.
 *
 *   npm run build && npx vite preview --port 4173 &
 *   node tools/compare-with-design.mjs
 *
 * Needs Chromium at /opt/pw-browsers/chromium, or set CHROMIUM.
 */
import { chromium } from 'playwright';

const APP = process.env.APP_URL ?? 'http://localhost:4173/rifada-app/';
const DESIGN = process.env.DESIGN_URL
  ?? 'file://' + new URL('../../project/Rifada Resident App - Figma 2 2.html', import.meta.url).pathname;
const GALLERY = 'معرض الشاشات';
/** The bottom bar is inside our tiles and not the design's. */
const NAV = 'الرئيسية الخدمات اسأل جيرانك استعارة الرسائل';

/** Screens that differ on purpose — see the README's departures section. */
const EXPECTED = new Set([
  'R4', 'R4s1', 'R4s2',   // the home carousel sits on whichever slide is up
  'R21', 'R29', 'R54',    // documented departures: names, بجوار, WE
  'R11b',                 // the design's duplicate `paidAmount` blanks its own
  'R73', 'R73s4',         // avatar initials follow the renamed residents
]);

const harvest = (page) => page.evaluate(() => {
  const scaled = [...document.querySelectorAll('div')].filter(
    (d) => getComputedStyle(d).transform.startsWith('matrix(0.49'));
  return scaled.map((s) => {
    let node = s, label = '';
    for (let i = 0; i < 5 && node.parentElement; i++) {
      node = node.parentElement;
      const first = (node.innerText || '').split('\n')[0].trim();
      if (/^[A-Z]+\d*[a-z0-9]*$/.test(first) && first.length <= 7) {
        label = (node.innerText || '').split('\n').slice(0, 2).join(' | ').trim();
        break;
      }
    }
    return { label, text: s.innerText.replace(/\s+/g, ' ').trim() };
  });
});

const openGallery = async (browser, url) => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
  await page.goto(url);
  await page.waitForTimeout(9000);
  await page.evaluate((name) => {
    const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === name);
    b?.click();
  }, GALLERY);
  // 100+ full app instances; give them room to paint.
  await page.waitForTimeout(15000);
  const rows = await harvest(page);
  await page.close();
  return rows;
};

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM ?? '/opt/pw-browsers/chromium',
});
const index = (rows) => Object.fromEntries(
  rows.map((r) => [r.label.split('|')[0].trim(), r]).filter(([k]) => k && k !== '?'));
const design = index(await openGallery(browser, DESIGN));
const mine = index(await openGallery(browser, APP));
await browser.close();

const strip = (s) => s.replace(NAV, '').replace(/\s+/g, '');
const shared = Object.keys(design).filter((k) => k in mine).sort();
const differing = shared.filter((k) => strip(design[k].text) !== strip(mine[k].text));
const unexpected = differing.filter((k) => !EXPECTED.has(k));

console.log(`matching: ${shared.length - differing.length} / ${shared.length}`);
console.log(`differing: ${differing.length} (${differing.length - unexpected.length} expected)`);
for (const k of unexpected) {
  console.log(`\n### ${k}  ${design[k].label.split('|').pop().trim()}`);
  console.log(' design:', design[k].text.replace(NAV, '').slice(0, 400));
  console.log(' mine  :', mine[k].text.replace(NAV, '').slice(0, 400));
}
process.exit(unexpected.length ? 1 : 0);
