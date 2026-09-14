import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
  FILLERS, STORY, BPS_TARGET, SLOTS_PER_DAY, RECEIPT_SOMPI, MIN_RELAY_SOMPI_PER_GRAM,
  GRAM_IS_LISTED_TOKEN, COINBASE_SUBNETWORK,
  createEconomy, enqueue, burst, setMinerPolicy, stepBlock, stepMany, metrics,
  runStoryStep, classifyLiveBlock, fillerById,
} from '../src/empty-block-economy.mjs';

test('empty classroom blocks still have coinbase and parents', () => {
  const block = stepBlock(createEconomy()).last;
  assert.equal(block.empty, true);
  assert.equal(block.coinbase, true);
  assert.ok(block.parents >= 1);
  assert.equal(block.feeSompi, 0);
});

test('a receipt is one sompi and is not a dollar', () => {
  const receipt = fillerById('receipt');
  assert.equal(receipt.feeSompi, RECEIPT_SOMPI);
  assert.equal(RECEIPT_SOMPI, 1);
  assert.match(receipt.what, /not a dollar/i);
});

test('grams are mass policy, not a listed token', () => {
  assert.equal(GRAM_IS_LISTED_TOKEN, false);
  const gram = fillerById('gram');
  assert.equal(gram.status, 'policy');
  assert.equal(gram.feeSompi, MIN_RELAY_SOMPI_PER_GRAM);
  assert.equal(FILLERS.some(f => f.id === 'GRAM' || f.name === 'GRAM'), false);
});

test('include policy fills the next empty slot from the queue', () => {
  let state = enqueue(createEconomy(), 'postage');
  state = stepBlock(state);
  assert.equal(state.last.empty, false);
  assert.deepEqual(state.last.fillers, ['postage']);
  assert.equal(state.filled, 1);
  assert.equal(state.feeSompi, 100);
  assert.equal(state.queue.length, 0);
  assert.equal(metrics(state).fillRate, 1);
});

test('empty mining while work waits records missed fees', () => {
  let state = enqueue(setMinerPolicy(createEconomy(), 'empty'), 'x402');
  state = stepBlock(state);
  assert.equal(state.last.empty, true);
  assert.equal(state.missedFeeSompi, 10_000);
  assert.equal(state.queue.length, 1);
  state = stepBlock(setMinerPolicy(state, 'include'));
  assert.equal(state.last.empty, false);
  assert.deepEqual(state.last.fillers, ['x402']);
  assert.equal(state.feeSompi, 10_000);
});

test('ten BPS target implies 864000 classroom slots a day', () => {
  assert.equal(BPS_TARGET, 10);
  assert.equal(SLOTS_PER_DAY, 864_000);
  const m = metrics(stepMany(enqueue(createEconomy(), 'pin'), 10));
  assert.equal(m.filled, 1);
  assert.equal(m.empty, 9);
  assert.equal(m.dayIfHeld.filledSlots + m.dayIfHeld.emptySlots, SLOTS_PER_DAY);
});

test('burst and queue cap reject overflow without losing the prior queue', () => {
  const state = burst(createEconomy(), [['tip', 2], ['split', 1]]);
  assert.equal(state.queue.length, 3);
  assert.throws(() => burst(state, [['pin', 46]]));
  assert.throws(() => fillerById('dollar'));
  assert.throws(() => setMinerPolicy(state, 'stake'));
});

test('live classifier treats coinbase-only as empty of user payments', () => {
  const empty = classifyLiveBlock({
    transactions: [{ subnetworkId: COINBASE_SUBNETWORK }],
    verboseData: { hash: 'ab', transactionIds: ['cb'] },
    header: { daaScore: '1' },
  });
  assert.equal(empty.empty, true);
  assert.equal(empty.coinbaseOnly, true);
  assert.equal(empty.userTxCount, 0);
  const filled = classifyLiveBlock({
    transactions: [{ subnetworkId: COINBASE_SUBNETWORK }, { subnetworkId: '00'.repeat(20) }],
    verboseData: { transactionIds: ['a', 'b'] },
  });
  assert.equal(filled.empty, false);
  assert.equal(filled.userTxCount, 1);
});

test('guided story covers clock, receipt, miss, include, and a classroom minute', () => {
  let state = createEconomy();
  state = runStoryStep(state, 0);
  assert.equal(state.last.empty, true);
  state = runStoryStep(state, 1);
  assert.deepEqual(state.last.fillers, ['receipt']);
  state = runStoryStep(state, 2);
  assert.equal(state.last.empty, true);
  assert.ok(state.missedFeeSompi >= 10_000);
  state = runStoryStep(state, 3);
  assert.deepEqual(state.last.fillers, ['x402']);
  state = runStoryStep(state, 4);
  assert.equal(STORY.length, 5);
  assert.ok(state.filled >= 3);
  assert.equal(metrics(state).modelOnly, true);
});
