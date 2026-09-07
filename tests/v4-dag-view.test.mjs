import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fetchV4Dag} from '../src/v4-dag-view.mjs';
const tx='11'.repeat(32),block='22'.repeat(32),parent='33'.repeat(32),checkpoint='44'.repeat(32);
const history=ids=>({removedChainBlockHashes:[],addedChainBlockHashes:[],acceptedTransactionIds:[{acceptingBlockHash:block,acceptedTransactionIds:ids}]});
test('DAG view uses exact accepted transaction and direct header parents only',async()=>{
 const result=await fetchV4Dag({getVirtualChainFromBlock:async()=>history([tx]),getBlock:async()=>({block:{header:{hash:block,parentsByLevel:[[parent],['55'.repeat(32)]]}}})},{id:tx,checkpoint});
 assert.equal(result.acceptingBlock,block);assert.deepEqual(result.parents,[parent]);assert.equal(result.nodeVerified,true);
});
test('saved acceptance or another transaction cannot manufacture DAG edges',async()=>{
 const result=await fetchV4Dag({getVirtualChainFromBlock:async()=>history(['66'.repeat(32)]),getBlock:async()=>{throw Error('must not fetch');}},{id:tx,checkpoint,acceptingBlock:block});
 assert.equal(result.acceptingBlock,null);assert.deepEqual(result.parents,[]);assert.equal(result.status,'pending');
});
test('wrong block and incomplete parents are refused',async()=>{
 for(const header of [{hash:parent,parentsByLevel:[[parent]]},{hash:block,parentsByLevel:[['bad']]}])await assert.rejects(fetchV4Dag({getVirtualChainFromBlock:async()=>history([tx]),getBlock:async()=>({block:{header}})},{id:tx,checkpoint}),/different|incomplete/);
});
test('containing-block claim requires the transaction in that block',async()=>{
 await assert.rejects(fetchV4Dag({getBlock:async()=>({block:{header:{hash:block},verboseData:{transactionIds:[parent]}}})},{id:tx,containingBlock:block}),/does not contain/);
});

test('live watcher reads real tip parents without replacing selected transaction',async()=>{
 const {watchV4Dag}=await import('../src/v4-dag-view.mjs');let finish;const done=new Promise(resolve=>{finish=resolve;});
 const selected={transactionId:tx};let stop;
 stop=watchV4Dag({getSink:async()=>({sink:block}),getBlock:async request=>{assert.equal(request.hash,block);return {block:{header:{hash:block,parentsByLevel:[[parent]],daaScore:123n}}};}},{updateTip(value){assert.equal(selected.transactionId,tx);assert.deepEqual(value.parents,[parent]);assert.equal(value.hash,block);stop();finish();}});
 await done;
});
test('stopping a pending tip poll prevents its next request',async()=>{
 const {watchV4Dag}=await import('../src/v4-dag-view.mjs');let release,requests=0;const sink=new Promise(resolve=>{release=resolve;});
 const stop=watchV4Dag({getSink:()=>sink,getBlock:async()=>{requests++;}},{updateTip(){throw Error('stopped view must not update');}});
 stop();release({sink:block});await new Promise(resolve=>setImmediate(resolve));assert.equal(requests,0);
});
