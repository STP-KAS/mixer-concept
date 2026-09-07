// PREPARED ONLY. Never run while approval is pending. A flag is not user permission.
// Seven sends: escrow funding/release, Warden/Creature funding, feed, Creature/Warden exits.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,access,copyFile} from 'node:fs/promises';
import {createHash,webcrypto as c} from 'node:crypto';
import {createRequire} from 'node:module';
const diagnostic=process.argv.includes('--diagnose-only');
if(!diagnostic&&!process.argv.includes('--authorized-seven'))throw Error('Requires explicit user authorization AND --authorized-seven. --diagnose-only never clicks a spending action.');
const source='.local/v4-guided',dir=source+'/extra-seven',origin=process.env.V4_QA_ORIGIN||'http://127.0.0.1:8904';
assert(['localhost','127.0.0.1'].includes(new URL(origin).hostname),'Local QA origin only');
await mkdir(dir,{recursive:true,mode:0o700});
const exists=async p=>{try{await access(p);return true;}catch(e){if(e.code!=='ENOENT')throw e;return false;}};
const prior=await exists(dir+'/started.json');
if(prior&&!diagnostic)throw Error('Prior attempt exists. Refusing any replay, including partial or unknown history. Use --diagnose-only.');
const privateSource=JSON.parse(await readFile(source+'/keys.json'));
const secret=createHash('sha256').update(privateSource.keys[0]+'v4-guided-qa').digest('hex');
async function key(salt){const raw=await c.subtle.importKey('raw',Buffer.from(secret),'PBKDF2',false,['deriveKey']);return c.subtle.deriveKey({name:'PBKDF2',salt,iterations:250000,hash:'SHA-256'},raw,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
async function decrypt(e){return JSON.parse(Buffer.from(await c.subtle.decrypt({name:'AES-GCM',iv:Buffer.from(e.iv,'base64')},await key(Buffer.from(e.salt,'base64')),Buffer.from(e.ciphertext,'base64'))));}
const envelope=JSON.parse(await readFile(prior&&await exists(dir+'/latest.json')?dir+'/latest.json':source+'/latest.json'));
let wallet=await decrypt(envelope),snapIndex=0;const evidence=[],errors=[];
assert.deepEqual(wallet.keys,privateSource.keys,'Recovery keys must match existing wallet');
if(!diagnostic){assert.equal(wallet.session.v4?.activity.length,19,'Expected exactly the completed guided 19');assert(wallet.session.v4.activity.every(r=>r.acceptingBlock),'All prior guided transactions must have acceptance');assert.equal(wallet.session.argent?.activity.length||0,0,'No prior Argent history allowed');assert(!wallet.session.journal,'No unknown legacy transaction allowed');assert(Object.values(wallet.session.scenarios||{}).every(s=>!s.journal&&!s.contract),'No partial legacy scenario allowed');await copyFile(source+'/latest.json',dir+'/before.json');await writeFile(dir+'/started.json',JSON.stringify({startedAt:new Date().toISOString(),transactions:7,escrowDeposit:'0.2',argentDeposits:'0.25 each',maxTotalFees:'0.17',origin}),{flag:'wx',mode:0o600});}
const sdk=createRequire(import.meta.url)('../.cache/upstream/kaspa-wasm32-sdk/nodejs/kaspa');
const browser=await chromium.launch(),context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
page.setDefaultTimeout(45000);page.on('pageerror',e=>errors.push(e.message));await context.route('**/api/faucet',r=>{errors.push('Blocked unexpected faucet call');return r.abort();});
const idle=()=>page.waitForFunction(()=>!document.querySelector('[data-public-apps]')?.hasAttribute('aria-busy'),null,{timeout:60000});
async function snapshot(label){const raw=await page.evaluate(()=>localStorage.getItem('kaspa-public-encrypted-recovery-v1'));if(raw)wallet=await decrypt(JSON.parse(raw));assert.deepEqual(wallet.keys,privateSource.keys);const salt=c.getRandomValues(new Uint8Array(16)),iv=c.getRandomValues(new Uint8Array(12)),ciphertext=await c.subtle.encrypt({name:'AES-GCM',iv},await key(salt),Buffer.from(JSON.stringify(wallet))),packed=JSON.stringify({version:1,network:'testnet-10',kdf:'PBKDF2-SHA256',iterations:250000,salt:Buffer.from(salt).toString('base64'),iv:Buffer.from(iv).toString('base64'),ciphertext:Buffer.from(ciphertext).toString('base64')});await writeFile(dir+'/'+String(++snapIndex).padStart(3,'0')+'-'+label+'-'+Date.now()+'.json',packed,{mode:0o600});if(!diagnostic){await writeFile(dir+'/latest.json',packed,{mode:0o600});await writeFile(source+'/latest.json',packed,{mode:0o600});}return wallet;}
async function action(label,fn){try{await idle();await fn();await idle();}finally{await snapshot(label);}}
const escrow=()=>wallet.session.contract?.kind==='escrow'?wallet.session:wallet.session.scenarios?.escrow;
function inspect(j,cap){const tx=sdk.Transaction.deserializeFromSafeJSON(j.transaction),fee=tx.inputs.reduce((n,i)=>n+i.utxo.amount,0n)-tx.outputs.reduce((n,o)=>n+o.value,0n);assert(fee>0n&&fee<=cap,'Per-transaction fee cap');return{transactionId:j.id,fee:String(fee),inputs:tx.inputs.length,outputs:tx.outputs.length,covenantGroups:new Set(tx.inputs.map(i=>i.utxo?.entry.covenantId?.toString()).filter(Boolean)).size};}
async function accepted(label,pick,cap){let record;for(let i=0;i<40;i++){await snapshot(label+'-observation');record=pick();if(record?.acceptingBlock)break;await page.waitForTimeout(1500);await idle();}assert(record?.acceptingBlock,'Acceptance required; no retry or next send on uncertainty');const j=record.journal||record,entry={step:label,...inspect(j,cap),acceptingBlock:record.acceptingBlock};evidence.push(entry);assert(evidence.reduce((n,e)=>n+BigInt(e.fee),0n)<=17000000n,'Overall fee cap');await page.waitForFunction(e=>document.querySelector('[data-game-transfer]')?.textContent===`Accepted · 1 transaction · ${e.inputs} inputs · ${e.covenantGroups} covenant groups → ${e.outputs} outputs`,entry,{timeout:15000});await page.screenshot({path:dir+'/'+label+'.png'});await writeFile(dir+'/evidence.json',JSON.stringify({origin,evidence,errors},null,2));assert.deepEqual(errors,[]);}
try{
 await action('restore',async()=>{await page.goto(origin+'/covenants/');await page.locator('[data-v4-wallet-menu]').click();await page.getByText('Restore a recovery file',{exact:true}).click();await page.locator('[data-public-import-file]').setInputFiles({name:'existing-guided-recovery.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(envelope))});await page.locator('[data-public-import-password]').fill(secret);await page.locator('[data-public-import]').click();await idle();assert.notEqual(await page.locator('[data-public-message]').getAttribute('data-error'),'true');await page.locator('[data-v4-close-wallet]').click();});
 if(diagnostic){console.log(JSON.stringify({mode:'read-only restore diagnostic',guidedRecords:wallet.session.v4?.activity.length,argentRecords:wallet.session.argent?.activity.length||0,legacyTransaction:escrow()?.journal?.id||null,recoveryDirectory:dir}));}
 else{
  for(let i=0;i<40&&!wallet.session.v4.activity.every(r=>r.acceptingBlock);i++){await page.waitForTimeout(1500);await idle();await snapshot('restore-observation');}assert(wallet.session.v4.activity.every(r=>r.acceptingBlock),'Restored baseline must be freshly accepted before any new spend');
  // The adapter invokes the actual old controller; no copied construction/signing logic.
  await page.evaluate(async()=>{const {createV4LegacyServices}=await import('/assets/v4-legacy-services.mjs');window.extraQAService=createV4LegacyServices({root:document.querySelector('[data-public-apps]')});await window.extraQAService.open('escrow');});
  await action('escrow-fund',async()=>assert(await page.evaluate(()=>window.extraQAService.invoke('prepare'))));
  await accepted('escrow-fund',()=>escrow()?.journal,1000000n);assert.equal(Number(escrow().contract.state.principal),20000000);assert.equal(escrow().journal.funding,true);
  await action('escrow-release',async()=>{const view=await page.evaluate(()=>window.extraQAService.snapshot());assert(view.actions.some(a=>a.id==='option-0'&&a.label==='Release to seller'));assert(await page.evaluate(()=>window.extraQAService.invoke('option-0')));});
  await accepted('escrow-release',()=>escrow()?.journal,1000000n);assert.equal(escrow().journal.funding,false);assert(escrow().completed);
  await page.locator('[data-game-argent]').click();
  const steps=[['warden-fund','Fund the food keeper','genesis','warden'],['creature-fund','Fund Sprout’s actor','genesis','creature'],['argent-feed','Feed Sprout through both apps','feed',null],['creature-exit','Return Creature deposit','retire','creature'],['warden-exit','Return Warden deposit','retire','warden']];
  for(let i=0;i<steps.length;i++){const[label,button,operation,actor]=steps[i];await action(label,async()=>{const target=i===3?page.locator('[data-game-service-action="retire-creature"]'):page.locator('[data-game-continue]');assert.equal((await target.textContent()).trim(),button);await target.click();});assert.equal(wallet.session.argent.activity.length,i+1,'Exactly one new Argent journal');const r=wallet.session.argent.activity.at(-1);assert.equal(r.journal.operation,operation);assert.equal(r.journal.actor,actor);await accepted(label,()=>wallet.session.argent.activity.at(-1),3000000n);if(i===2){assert.equal(r.journal.states[0].food,8);assert.equal(r.journal.states[1].energy,2);}}
  assert.equal(evidence.length,7);assert.equal(wallet.session.v4.activity.length,19,'No guided replay');await snapshot('complete');console.log(JSON.stringify({verifiedTransactions:7,totalFeeSompi:String(evidence.reduce((n,e)=>n+BigInt(e.fee),0n)),recovery:dir+'/latest.json',evidence:dir+'/evidence.json'}));
 }
}catch(error){await snapshot('failure').catch(()=>{});await page.screenshot({path:dir+'/failure.png'}).catch(()=>{});throw error;}finally{await context.close();await browser.close();}
