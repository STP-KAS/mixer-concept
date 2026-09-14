import {link, section} from './components.mjs';
import {kgiCard, pinList} from './community.mjs';
import {FILLERS, MACRO_PIN, BPS_TARGET, SLOTS_PER_DAY, RECEIPT_SOMPI, MIN_RELAY_SOMPI_PER_GRAM} from './empty-block-economy.mjs';

const intro = (eyebrow, title, lead) =>
  `<div class="page-intro"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${lead}</p></div>`;

const rows = items =>
  `<div class="reading-rows">${items.map(([title, html]) =>
    `<article><h3>${title}</h3><div>${html}</div></article>`
  ).join('')}</div>`;

const fillerRows = FILLERS.map(f =>
  `<tr><th>${f.name}</th><td>${f.what}</td><td><span class="status-tag">${f.status}</span></td><td class="eb-num">${f.feeSompi} sompi</td><td><a href="${f.href}">Open</a></td></tr>`
).join('');

export const emptyBlockPage = {
  file: 'empty-block.html',
  title: 'Empty block economy',
  description: 'Kaspa targets ten blocks a second. A coinbase-only block still counts. Treat empty slots as inventory: macro fees, micro receipts, postage, 402, tills.',
  body: `${intro('Use case', 'Empty blocks are inventory.', 'Kaspa’s target is ten blocks a second. A block with only a coinbase is still a block: it has parents, it moves DAA-tracked time, it pays the miner subsidy. It did not carry a user payment. This page is the use case for that leftover capacity, from the whole network down to one sompi.')}
    <p class="small">Local classroom unless you sample a live block. Inclusion is not acceptance. 10 BPS is a target, not ten independent people. This is not a dollar, not 100 BPS, not DAGKnight.</p>
    <div class="action-row">
      <a class="primary-button" href="#clock">Fill an empty block</a>
      <a href="/covenants">Town (Testnet-10)</a>
      <a href="/status">Dated status</a>
    </div>
    <link rel="stylesheet" href="/assets/empty-block.css">
    <section class="eb-exhibit" id="clock" data-empty-block-economy aria-labelledby="eb-title">
      <div class="eb-heading">
        <div>
          <p class="eyebrow">Classroom clock · ${BPS_TARGET} blocks / s target</p>
          <h2 id="eb-title">Fill the empty block.</h2>
        </div>
        <p>Model only until you sample live. Coinbase still pays. User fees only land when a filler is included.</p>
      </div>
      <div class="eb-strip" data-eb-strip role="img" aria-label="Recent classroom blocks"></div>
      <p class="eb-caption" data-eb-caption>No blocks yet. Mine one empty block, or queue a filler.</p>
      <div class="eb-meters" data-eb-meters></div>
      <div class="eb-board">
        <div>
          <h3>Miner</h3>
          <div class="eb-policies" role="group" aria-label="Miner policy">
            <button type="button" data-eb-miner="include" aria-pressed="true">Include waiting work</button>
            <button type="button" data-eb-miner="empty" aria-pressed="false">Mine empty anyway</button>
          </div>
          <p class="small">If work is queued and the miner publishes empty, the fee is missed. That is the Core R&amp;D point, not a slogan.</p>
          <div class="eb-actions">
            <button type="button" class="primary-button" data-eb-step>Mine next block</button>
            <button type="button" class="quiet-button" data-eb-ten>Mine 10</button>
            <button type="button" class="quiet-button" data-eb-reset>Reset</button>
          </div>
        </div>
        <div>
          <h3>Queue a micro filler</h3>
          <div class="eb-fillers" data-eb-fillers></div>
          <p class="small" data-eb-queue>Queue empty.</p>
        </div>
      </div>
      <div class="eb-story">
        <h3>Guided use case</h3>
        <ol data-eb-story></ol>
        <button type="button" class="quiet-button" data-eb-story-next>Next story beat</button>
        <p class="small" data-eb-story-line role="status" aria-live="polite">Start with an empty block. It still counts.</p>
      </div>
      <div class="eb-live">
        <h3>One live window</h3>
        <p>api.kaspa.org is an indexer window, not your node. Sample the current sink. Coinbase-only means empty of user payments.</p>
        <button type="button" class="quiet-button" data-eb-live>Sample the live sink</button>
        <p class="small" data-eb-live-out>No live sample yet.</p>
      </div>
    </section>
    ${section('macro', 'Macro: the leftover factory', rows([
      ['Ten slots a second', `<p>Crescendo set a 100 ms target. That is about <strong>${SLOTS_PER_DAY.toLocaleString('en-US')} blocks a day</strong> if the target holds. Most of those blocks can be empty of user transactions and still be valid GHOSTDAG blocks.</p>`],
      ['Empty is not waste', '<p>An empty block still has parents, so the DAG stays connected. It still advances DAA-tracked time. It still pays the chromatic subsidy. Mining rule engines even fall back to empty templates when a node is recovering from bad Merkle roots. The leftover is inventory, not a failed stamp.</p>'],
      ['Fees are the endgame', `<p>Checked ${MACRO_PIN.checked}: circulating ${MACRO_PIN.circulatingKas} of ${MACRO_PIN.maxKas} max. Remaining issuance is about ${MACRO_PIN.remainingKas}, chromatic, not a cliff. After that, miners eat fees. Filling empty slots is how this desk feeds that budget without minting a dollar.</p><p class="small">${MACRO_PIN.sources.map(url => `<a href="${url}">${url.replace('https://','')}</a>`).join(' · ')}</p>`],
      ['Fill rate is not GDP', '<p>This classroom counts filled slots and sompi of user fees. That is activity, not a national account, not a price, not adoption. A high empty rate can mean a healthy clock with little demand. It can also mean miners ignoring a mempool. Distinguish those with the include/empty control.</p>'],
      ['What Sutton actually said', '<p>11 Sep 2026: global DeFi is not sequential; push partitioned, parallel, replicated state. Relative order still matters inside related events. That is a hypothesis, not a KIP, not a DEX, not kUSD. One own-UTXO till is aligned with that push. Empty-block inventory is the parallel slot the till can occupy.</p>'],
    ]))}
    ${section('micro', 'Micro: what fills one slot', `
      <p>Every filler below already exists as a desk object, a lab, or a shape from the same conversations. Status is honest. A shape is not a mainnet product. A lab is Testnet-10. Alpha 402 is elldeeone’s envelope, not a fourth one.</p>
      <div class="table-scroll" role="region" aria-label="Micro fillers">
        <table>
          <thead><tr><th>Filler</th><th>What it is</th><th>Status</th><th>Classroom fee</th><th></th></tr></thead>
          <tbody>${fillerRows}</tbody>
        </table>
      </div>
      <p class="small">Receipt unit is ${RECEIPT_SOMPI} sompi. 100 sompi/gram is min-relay policy (${MIN_RELAY_SOMPI_PER_GRAM} sompi), not a KIP number and not a token called GRAM. PegLab tPEG will depeg. Do not list it as money.</p>
    `)}
    ${section('stack', 'The stack this page is using', rows([
      ['L1', '<p>GHOSTDAG, 10 BPS target, Toccata spend rules. rusty-kaspa v2.0.1. SilverScript v1.0.0 is the compiler pin, not an audited dapp. Own-UTXO <code>validateOutputState</code> plus an explicit value check. No foreign <code>readInputState</code>.</p>'],
      ['Receipts beat dollars', '<p>Parker 1-sompi receipts won. PegLab won the classroom that depegs. Dollars remain 0-0. The till prices in fiat and settles in KAS, SEPA, or cash. Grams meter work.</p>'],
      ['Charge for the call', '<p>HTTP 402 binds kaspa-x402. Steal k402’s lock. Do not invent envelope four. Do not call a draft KCC adopted. A 402 that does not verify is theatre.</p>'],
      ['Name locates', '<p>Official KNS is inscriptions. <code>kns://</code> is this desk’s overlay: name locates, chain settles, the user machine runs the dapp. Not a new chain. Not Tor by rebrand. Uniqueness is still indexer first-come.</p>'],
      ['Anyone hosts', '<p>Track 1 is BTCPay-shaped software. Desk keeps 0. QR / kaspa: URI / paste txid. In-page inject is Kasware or Kastle only. Many desks are many jars, not one Circle.</p>'],
    ]))}
    <details class="detail"><summary>What this page refuses</summary>
      <div class="detail-body">
        <p>100 BPS live. Instant irreversible payments. DAGKnight as consensus. KCC-20 / GRAM as a listed token. tPEG as money. Argent production-ready. vProgs live. A fourth 402 envelope. Seed paste. Foreign input-state reads. Pricing coffee only in grams. Treating this classroom fill rate as a forecast.</p>
        <p>Kill-if from the 11 Sep desk law still applies: if a sentence needs a Kaspa dollar, stop.</p>
      </div>
    </details>
    ${kgiCard('door')}
    ${section('next', 'Where to do it for real', pinList([
      ['Town', 'Testnet-10 greenhouse, wage, crops, delivery. Game rules on real spends.', '/covenants'],
      ['PegLab', 'A unit that depegs on purpose. KaChat is the phone, not this PC.', '/peglab'],
      ['Build', 'Covenants, TN10 node, official builder door.', '/build-on-kaspa'],
      ['Node', 'TN10 mine tKAS, or a mainnet follower. Do not mix flags.', '/node'],
      ['Explore', 'kaspa.stream and the Graph Inspector. Empty blocks show up there as ordinary blocks.', '/explore'],
      ['Status', 'Dated live / roadmap / research / wrong.', '/status'],
      ['kaspa.org/build', 'Official WASM, node, faucet.', 'https://kaspa.org/build'],
      ['Graph Inspector', 'Live blockDAG. Parallel empty blocks are the picture.', 'https://kgi.kaspad.net/'],
    ]))}
    <p class="source-line">${link('GHOSTDAG paper','https://eprint.iacr.org/2018/104')} · ${link('KIP-14 Crescendo','https://github.com/kaspanet/kips/blob/master/kip-0014.md')} · ${link('Toccata guide','https://docs.kaspa.org/toccata')} · ${link('kaspa-x402','https://github.com/elldeeone/kaspa-x402')} · ${link('k402','https://github.com/Kali123411/k402')}</p>`,
};
