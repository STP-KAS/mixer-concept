import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {staticPreview} from './static-preview.mjs';

const output = '.cache/visual-review/empty-block';
await mkdir(output, { recursive: true });
const server = staticPreview('dist');
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const errors = [];
try {
  for (const { name, width, height } of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
    await page.goto(`${base}/empty-block`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-empty-block-economy]').waitFor();
    await page.locator('[data-eb-fill="receipt"]').waitFor();
    assert.equal(await page.locator('#eb-title').textContent(), 'Fill the empty block.');
    await page.locator('[data-eb-reset]').click();
    await page.locator('[data-eb-step]').click();
    const emptyCaption = await page.locator('[data-eb-caption]').textContent();
    assert.match(emptyCaption, /empty/i);
    await page.locator('[data-eb-fill="receipt"]').click();
    await page.locator('[data-eb-miner="include"]').click();
    await page.locator('[data-eb-step]').click();
    const filledCaption = await page.locator('[data-eb-caption]').textContent();
    assert.match(filledCaption, /receipt/i);
    await page.locator('[data-eb-fill="x402"]').click();
    await page.locator('[data-eb-miner="empty"]').click();
    await page.locator('[data-eb-step]').click();
    const missCaption = await page.locator('[data-eb-caption]').textContent();
    assert.match(missCaption, /Missed/i);
    await page.locator('[data-eb-story-next]').click();
    const meters = await page.locator('[data-eb-meters]').textContent();
    assert.match(meters, /Fill rate/);
    assert.match(meters, /User fees/);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${output}/${name}-clock.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert(overflow <= 1, `${name}: horizontal overflow ${overflow}`);
    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('a[href="/empty-block"]').count() > 0, true, 'home missing empty-block link');
    await page.goto(`${base}/explore`, { waitUntil: 'domcontentloaded' });
    assert.equal(await page.locator('a[href="/empty-block"]').count() > 0, true, 'explore missing empty-block link');
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(`empty-block browser check passed. ${base}/empty-block`);
} finally {
  await browser.close();
  server.close();
}
