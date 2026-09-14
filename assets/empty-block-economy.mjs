// Classroom model of Kaspa empty-block inventory. Not a node, not a fee market.
export const BPS_TARGET = 10;
export const SLOTS_PER_DAY = 864_000;
export const RECEIPT_SOMPI = 1;
export const MIN_RELAY_SOMPI_PER_GRAM = 100;
export const COINBASE_SUBNETWORK = '0100000000000000000000000000000000000000';
export const HISTORY = 40;
export const QUEUE_CAP = 48;

// Pins from api.kaspa.org, 11 Sep 2026 afternoon. Recheck. Not a live feed.
export const MACRO_PIN = Object.freeze({
  checked: '11 Sep 2026',
  daa: '537,194,659',
  rewardKas: '2.18267645',
  circulatingKas: '27.694 billion',
  maxKas: '28.704 billion',
  remainingKas: '~1.01 billion',
  hashrate: '~339 PH/s',
  node: 'v2.0.1',
  sources: [
    'https://api.kaspa.org/info/blockdag',
    'https://api.kaspa.org/info/coinsupply',
    'https://api.kaspa.org/info/blockreward',
    'https://api.kaspa.org/info/hashrate',
  ],
});

export const FILLERS = Object.freeze([
  {
    id: 'receipt',
    mark: 'R',
    name: '1-sompi receipt',
    plane: 'micro',
    feeSompi: RECEIPT_SOMPI,
    massGrams: 1,
    status: 'lab',
    what: 'A still number. Parker won receipts. Not a dollar.',
    href: '/covenants',
  },
  {
    id: 'postage',
    mark: 'P',
    name: 'Message postage',
    plane: 'micro',
    feeSompi: 100,
    massGrams: 1,
    status: 'shape',
    what: 'KaChat envelope stamp. Inclusion of the message, not the chat app.',
    href: '/peglab',
  },
  {
    id: 'timeout',
    mark: 'T',
    name: 'Timeout escrow',
    plane: 'micro',
    feeSompi: 1000,
    massGrams: 10,
    status: 'lab',
    what: 'Lock, claim, or reclaim after the clock. stillpay shape.',
    href: '/covenants',
  },
  {
    id: 'x402',
    mark: '4',
    name: 'Paid API call',
    plane: 'micro',
    feeSompi: 10_000,
    massGrams: 100,
    status: 'alpha',
    what: 'HTTP 402. Bind kaspa-x402. Steal the k402 lock. No fourth envelope.',
    href: '/build-on-kaspa',
  },
  {
    id: 'till',
    mark: 'K',
    name: 'Till ticket',
    plane: 'micro',
    feeSompi: 20_000,
    massGrams: 200,
    status: 'shape',
    what: 'Shop takes KAS. Desk keeps 0. Fiat is the price of the cup.',
    href: '/why-kaspa-matters',
  },
  {
    id: 'gram',
    mark: 'G',
    name: 'Work credit',
    plane: 'micro',
    feeSompi: 100,
    massGrams: 1,
    status: 'policy',
    what: 'Grams are KIP-21 mass, not a GRAM token. Prepaid work.',
    href: '/build-on-kaspa',
  },
  {
    id: 'name',
    mark: 'N',
    name: 'Name bump',
    plane: 'micro',
    feeSompi: 5000,
    massGrams: 50,
    status: 'live-kns',
    what: 'Official KNS locates. Kaspa settles. The machine runs the dapp.',
    href: '/wallet',
  },
  {
    id: 'vault',
    mark: 'V',
    name: 'Vault pin',
    plane: 'micro',
    feeSompi: 2000,
    massGrams: 20,
    status: 'lab',
    what: 'Own-UTXO lock. Not a bank. Not Kassword.',
    href: '/build-on-kaspa',
  },
  {
    id: 'tip',
    mark: 'I',
    name: 'Tip',
    plane: 'micro',
    feeSompi: 500,
    massGrams: 5,
    status: 'shape',
    what: 'One tap in a thread. Receipts, not USD.',
    href: '/peglab',
  },
  {
    id: 'stake',
    mark: 'S',
    name: 'Stake',
    plane: 'micro',
    feeSompi: 5000,
    massGrams: 50,
    status: 'shape',
    what: 'Lock, release to a winner, or refund.',
    href: '/covenants',
  },
  {
    id: 'split',
    mark: 'L',
    name: 'Split',
    plane: 'micro',
    feeSompi: 1500,
    massGrams: 15,
    status: 'shape',
    what: 'Group invoice. Same court, more names.',
    href: '/covenants',
  },
  {
    id: 'pin',
    mark: '·',
    name: 'Public pin',
    plane: 'micro',
    feeSompi: RECEIPT_SOMPI,
    massGrams: 1,
    status: 'live',
    what: '1 sompi timestamp. Track 0 public goods.',
    href: '/status',
  },
]);

const FILLER_BY_ID = Object.freeze(Object.fromEntries(FILLERS.map(f => [f.id, f])));

export function fillerById(id) {
  const filler = FILLER_BY_ID[id];
  if (!filler) throw new RangeError('Unknown filler.');
  return filler;
}

export function createEconomy({ seed = 11, miner = 'include' } = {}) {
  if (!Number.isInteger(seed)) throw new TypeError('Use an integer model seed.');
  if (miner !== 'include' && miner !== 'empty') throw new TypeError('Miner policy is include or empty.');
  return {
    modelOnly: true,
    seed: seed >>> 0 || 1,
    miner,
    height: 0,
    empty: 0,
    filled: 0,
    feeSompi: 0,
    missedFeeSompi: 0,
    massGrams: 0,
    counts: Object.fromEntries(FILLERS.map(f => [f.id, 0])),
    queue: [],
    history: [],
    last: null,
  };
}

export function setMinerPolicy(state, miner) {
  if (miner !== 'include' && miner !== 'empty') throw new TypeError('Miner policy is include or empty.');
  return { ...state, miner };
}

export function enqueue(state, fillerId) {
  if (state.queue.length >= QUEUE_CAP) throw new RangeError('Queue is full.');
  const filler = fillerById(fillerId);
  return { ...state, queue: [...state.queue, { id: filler.id, feeSompi: filler.feeSompi, massGrams: filler.massGrams, mark: filler.mark }] };
}

export function burst(state, plan) {
  let next = state;
  for (const [id, count] of plan) {
    if (!Number.isInteger(count) || count < 1 || count > QUEUE_CAP) throw new RangeError('Burst counts must be whole numbers from 1 to 48.');
    for (let i = 0; i < count; i++) next = enqueue(next, id);
  }
  return next;
}

export function stepBlock(state) {
  const waiting = state.queue.reduce((n, item) => n + item.feeSompi, 0);
  const take = state.miner === 'include' && state.queue.length ? [state.queue[0]] : [];
  const empty = take.length === 0;
  const feeSompi = take.reduce((n, item) => n + item.feeSompi, 0);
  const massGrams = take.reduce((n, item) => n + item.massGrams, 0);
  const missed = empty && waiting ? waiting : 0;
  const counts = { ...state.counts };
  for (const item of take) counts[item.id] += 1;
  const block = {
    modelOnly: true,
    height: state.height + 1,
    empty,
    parents: Math.max(1, Math.min(3, 1 + (state.seed % 3))),
    coinbase: true,
    fillers: take.map(item => item.id),
    marks: take.map(item => item.mark),
    feeSompi,
    massGrams,
    missedFeeSompi: missed,
    miner: state.miner,
  };
  return {
    ...state,
    seed: nextSeed(state.seed),
    height: block.height,
    empty: state.empty + Number(empty),
    filled: state.filled + Number(!empty),
    feeSompi: state.feeSompi + feeSompi,
    missedFeeSompi: state.missedFeeSompi + missed,
    massGrams: state.massGrams + massGrams,
    counts,
    queue: take.length ? state.queue.slice(1) : state.queue,
    history: [...state.history, block].slice(-HISTORY),
    last: block,
  };
}

export function stepMany(state, n) {
  if (!Number.isInteger(n) || n < 1 || n > 600) throw new RangeError('Step at most 600 classroom blocks.');
  let next = state;
  for (let i = 0; i < n; i++) next = stepBlock(next);
  return next;
}

function nextSeed(seed) {
  let x = seed;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

export function metrics(state) {
  const total = state.height;
  const fillRate = total ? state.filled / total : 0;
  const idleRate = total ? state.empty / total : 0;
  return {
    modelOnly: true,
    height: total,
    empty: state.empty,
    filled: state.filled,
    fillRate,
    idleRate,
    feeSompi: state.feeSompi,
    missedFeeSompi: state.missedFeeSompi,
    massGrams: state.massGrams,
    queued: state.queue.length,
    queuedFeeSompi: state.queue.reduce((n, item) => n + item.feeSompi, 0),
    counts: { ...state.counts },
    miner: state.miner,
    dayIfHeld: {
      modelOnly: true,
      filledSlots: Math.round(fillRate * SLOTS_PER_DAY),
      emptySlots: SLOTS_PER_DAY - Math.round(fillRate * SLOTS_PER_DAY),
      feeSompi: Math.round(fillRate ? (state.feeSompi / Math.max(state.filled, 1)) * fillRate * SLOTS_PER_DAY : 0),
    },
  };
}

export function classifyLiveBlock(block) {
  if (!block || typeof block !== 'object') throw new TypeError('Need a block object.');
  const txs = Array.isArray(block.transactions) ? block.transactions : [];
  const ids = block.verboseData?.transactionIds;
  const listed = Array.isArray(ids) ? ids.length : txs.length;
  const userTxs = txs.filter(tx => (tx.subnetworkId || '') !== COINBASE_SUBNETWORK);
  const empty = userTxs.length === 0 && (listed === 0 || listed === 1 || txs.length <= 1);
  return {
    window: true,
    empty,
    txCount: listed || txs.length,
    userTxCount: userTxs.length,
    coinbaseOnly: txs.length > 0 && userTxs.length === 0,
    hash: block.verboseData?.hash || block.header?.hash || null,
    daa: block.header?.daaScore || null,
  };
}

export const STORY = Object.freeze([
  {
    id: 'clock',
    title: 'An empty block still counts.',
    line: 'The clock ticks. The miner is paid the subsidy. Nobody paid a user fee. Parents still glue the DAG.',
    action: 'Mine an empty block',
    apply: state => stepBlock(state),
  },
  {
    id: 'receipt',
    title: 'A receipt is one sompi.',
    line: 'Queue a 1-sompi receipt, then include it. The number is still. It is not a dollar.',
    action: 'Queue and include a receipt',
    apply: state => stepBlock(enqueue(setMinerPolicy(state, 'include'), 'receipt')),
  },
  {
    id: 'miss',
    title: 'Empty while work waits costs the miner.',
    line: 'A paid API call is queued. The miner publishes empty anyway. The fee is missed. Core R&D said the same: empty blocks leave pending fees on the table.',
    action: 'Queue a 402, mine empty',
    apply: state => stepBlock(enqueue(setMinerPolicy(state, 'empty'), 'x402')),
  },
  {
    id: 'include',
    title: 'Include the waiting call.',
    line: 'Switch the miner to include. The 402 lands. The slot that was inventory is now a billed call.',
    action: 'Include the waiting 402',
    apply: state => stepBlock(setMinerPolicy(state, 'include')),
  },
  {
    id: 'minute',
    title: 'A minute of micro commerce.',
    line: 'Postage, a till ticket, a name bump, a timeout. Ten blocks a second is capacity, not a promise that ten shops paid.',
    action: 'Fill a classroom minute',
    apply: state => {
      let next = setMinerPolicy(state, 'include');
      next = burst(next, [['postage', 4], ['till', 1], ['name', 1], ['timeout', 1], ['tip', 2], ['pin', 2]]);
      return stepMany(next, 10);
    },
  },
]);

export function runStoryStep(state, index) {
  if (!Number.isInteger(index) || index < 0 || index >= STORY.length) throw new RangeError('Unknown story step.');
  return STORY[index].apply(state);
}

export const GRAM_IS_LISTED_TOKEN = false;
