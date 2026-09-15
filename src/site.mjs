export const site = {
  title: 'MIX',
  version: 'mixer concept',
  domain: 'https://mixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.club',
  localHost: 'mix.localhost',
  checked: '2026-09-15',
  navigation: [
    ['Doors', '/#doors'],
    ['Play', '/playground'],
    ['Explore', '/explore'],
    ['Help', '/help'],
    ['PegLab', '/peglab'],
    ['Town', '/covenants'],
    ['Status', '/status'],
  ],
};

export const sources = {
  paper: ['GHOSTDAG paper', 'https://eprint.iacr.org/2018/104'],
  node: ['Rusty Kaspa', 'https://github.com/kaspanet/rusty-kaspa'],
  acceptance: ['Accepted-transaction integration', 'https://docs.kaspa.org/integrate/accepted-transactions'],
  programmable: ['Programmability documentation', 'https://docs.kaspa.org/programmability'],
  kips: ['Protocol proposals', 'https://github.com/kaspanet/kips'],
  kccs: ['Application conventions', 'https://github.com/kaspanet/kccs'],
  wallet: ['Wallet directory', 'https://wiki.kaspa.org/wallet'],
  explorer: ['Kaspa Explorer', 'https://explorer.kaspa.org/transactions'],
  reward: ['Consensus subsidy table', 'https://github.com/kaspanet/rusty-kaspa/blob/master/consensus/src/processes/coinbase.rs'],
};

export const snapshot = {
  checked: '14 September 2026, 09:14 UTC; labels rechecked 15 Sep', daa: '539,569,173',
  reward: '2.18267645', supply: '27.6996 billion', version: '2.0.1',
  items: [
    ['GHOSTDAG', 'Live', 'Orders the blockDAG. Crescendo set a target of ten blocks per second.', 'https://github.com/kaspanet/kips/blob/master/kip-0014.md'],
    ['Toccata', 'Live protocol', 'Covenant spending rules are active. Rechecked 15 Sep 2026: rusty-kaspa v2.0.1 is still the newest tagged release. Application readiness is separate.', 'https://github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.1'],
    ['Silverscript', 'v1.0.0', 'Official language and compiler release, tagged 9 Sep 2026. Application readiness is separate. MIX Town still pins v1-rc1.', 'https://github.com/kaspanet/silverscript/releases/tag/v1.0.0'],
    ['Kaspa Studio', 'Isolated beta', 'Parker branch studio-beta, 9 Sep 2026. Local workbench, not this public site. Does not broadcast. V5 and V6 remain withdrawn.', 'https://github.com/parker2017code/kaspa-explained/tree/studio-beta'],
    ['HTTP 402 rails', 'TN10 lab', 'Parker reviewed kaspahttp402 metered payments on Testnet-10, 14 Sep 2026. Paid, delivered, and accepted stay separate. Not mainnet products. MIX does not ship them.', 'https://github.com/parker2017code/kaspahttp402-metered-protocol'],
    ['Argent', 'Prototype', 'Compiler and examples exist. Its README says it is not release-ready.', 'https://github.com/argent-lang/argent'],
    ['vProgs', 'Research', 'Rechecked 15 Sep 2026: still early development, no tags, master still 28 Jul 2026. Repository existence is not a product.', 'https://github.com/kaspanet/vprogs'],
    ['DAGKnight', 'Proposed', 'Rechecked 15 Sep 2026: KIP-2 still Proposed. 100 BPS, netsplit, and partition-resilience are not in that document.', 'https://github.com/kaspanet/kips/blob/master/kip-0002.md'],
  ],
};
