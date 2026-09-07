// Real UI and SDK, synthetic unfunded UTXOs, mock RPC only. Not live Testnet evidence.
import{chromium}from'playwright';import assert from'node:assert/strict';import{access,writeFile,mkdir}from'node:fs/promises';
const origin=process.env.V4_QA_ORIGIN||'http://127.0.0.1:8904',browser=await chromium.launch(),reports=[];await mkdir('.cache/visual-review/v4-flow-regression',{recursive:true});
try{for(const width of [1440,390]){const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.routeWebSocket('**',ws=>ws.close());await context.route('**/*',async r=>{const url=new URL(r.request().url());if(url.origin!==origin)return r.abort();if(url.pathname==='/api/faucet')throw Error('Forbidden faucet');if(url.pathname==='/assets/public-apps.mjs')return r.fulfill({body:"import '/assets/flow-regression-host.mjs';",contentType:'text/javascript'});if(url.pathname==='/assets/flow-regression-host.mjs')return r.fulfill({path:'scripts/fixtures/v4-flow-regression-host.mjs',contentType:'text/javascript'});const name=url.pathname.split('/').at(-1);if(url.pathname.startsWith('/assets/')&&/^[a-z0-9-]+\.(mjs|css)$/.test(name)){try{await access('src/'+name);return r.fulfill({path:'src/'+name,contentType:name.endsWith('.mjs')?'text/javascript':'text/css'});}catch{}}return r.continue();});await page.goto(origin+'/covenants/');await page.waitForFunction(()=>window.payFixture?.ready);await page.locator('[data-game-explore]').click();await page.waitForFunction(()=>!window.payFixture.snapshot().busy);await page.locator('.v4-three-surface > canvas').first().focus();await page.keyboard.press('1');const labels=['Create a three-step habitat','Move Sprout · step 1 of 3','Move Sprout · step 2 of 3','Move Sprout · step 3 of 3','Walk complete · return habitat deposit'];
const positions=['Square 1,1 · 3 energy','Square 2,1 · 2 energy','Square 2,2 · 1 energy','Square 1,2 · 0 energy'];
for(let i=0;i<5;i++){
 const button=page.locator('[data-game-continue]');
 assert.equal(await button.textContent(),labels[i]);
 const before=await page.locator('[data-game-progress-items]').textContent();
 if(i===1)await page.evaluate(()=>window.payFixture.holdNext());
 await button.click();
 if(i===1){
  await page.waitForFunction(()=>window.payFixture.snapshot().submits===2);
  assert(await button.isDisabled());
  assert.equal(await button.textContent(),'Checking transaction…');
  assert.equal(await page.locator('[data-game-progress-items]').textContent(),before,'Pending move retains previous accepted position/energy');
  await button.evaluate(el=>el.click());
  assert.equal((await page.evaluate(()=>window.payFixture.snapshot())).submits,2,'Repeated pending click cannot duplicate submission');
  await page.evaluate(()=>window.payFixture.releaseHeld());
 }
 await page.waitForFunction(()=>!window.payFixture.snapshot().busy);
 const snap=await page.evaluate(()=>window.payFixture.snapshot());
 assert.equal(snap.count,i+1);assert.equal(snap.submits,i+1);assert.equal(snap.pending,false);
 if(i<4)assert((await page.locator('[data-game-progress-items]').textContent()).includes(positions[i]));
 if(i>0&&i<4)assert.match(await page.locator('[data-game-line]').textContent(),new RegExp('Step '+i+' of 3 complete'));
}
assert.match(await page.locator('[data-game-line]').textContent(),/deposit is returned/);
assert(await page.locator('[data-game-progress]').isHidden(),'Completed card omits duplicate progress block');
assert.match(await page.locator('[data-game-progress-items]').textContent(),/No open deposit/);
assert(await page.locator('[data-game-continue]').isHidden(),'Completed walk has no required action');
assert.match(await page.locator('[data-game-title]').textContent(),/session complete/);
assert.doesNotMatch(await page.locator('[data-game-line]').textContent(),/Locks |Fee capped/);
const restart=page.locator('[data-game-restart]');assert(await restart.isVisible());
assert.equal(await restart.textContent(),'Start another habitat walk');
await page.screenshot({path:'.cache/visual-review/v4-flow-regression/'+width+'-habitat-free-complete.png'});
await restart.click();assert.equal((await page.evaluate(()=>window.payFixture.snapshot())).submits,5,'Optional restart reveals setup without sending coins');
assert.equal(await page.locator('[data-game-progress]').getAttribute('data-phase'),'ready');
assert(await page.locator('[data-game-effect]').isHidden(),'Optional setup hides the previous completed receipt');
assert.match(await page.locator('[data-game-line]').textContent(),/Optional new session/);
assert.equal(await page.locator('[data-game-continue]').textContent(),'Create a three-step habitat again');
await page.reload();await page.waitForFunction(()=>window.payFixture?.ready);
await page.locator('[data-game-explore]').click();await page.waitForFunction(()=>!window.payFixture.snapshot().busy);
assert.equal((await page.evaluate(()=>window.payFixture.snapshot())).submits,0,'Restoring the completed visit does not fund another deposit');
assert.equal((await page.evaluate(()=>window.payFixture.snapshot())).count,5);
reports.push({width,acceptedPositions:positions,threeMoves:true,pendingKeepsState:true,pendingRepeatBlocked:true,returnedDeposit:true,completeHidesRequiredAction:true,optionalRestartDoesNotSpend:true,reloadDoesNotSpend:true});
assert.deepEqual(errors,[]);await context.close();}await writeFile('docs/v4-habitat-local-regression.json',JSON.stringify({checkedAt:new Date().toISOString(),scope:'Real UI and SDK; synthetic unfunded UTXOs and mock RPC. No live transactions.',reports},null,2));console.log('PASS desktop/mobile manual habitat: three distinct accepted moves, pending duplicate guard, deposit return and reload.');}finally{await browser.close();}
