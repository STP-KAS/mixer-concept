import {doors, peopleChips} from './doors.mjs';
import {localFilm} from './community.mjs';
import {network, payment, spend, vault, permission, tradeoffComparison} from './components.mjs';
import {snapshot} from './site.mjs';

const routes = items => `<nav class="topic-list" aria-label="Next reading">${items.map(([title, text, url]) =>
  `<a href="${url}"><div><strong>${title}</strong><p>${text}</p></div><span aria-hidden="true">↗</span></a>`
).join('')}</nav>`;

function principles() {
  return `<aside class="door-principles">
    <p class="eyebrow">Door principles</p>
    <ul>
      <li>Who is reading comes first.</li>
      <li>Live, roadmap, research, and wrong are different labels.</li>
      <li>Price talk is not intel.</li>
      <li>A model you can break beats a lecture.</li>
    </ul>
  </aside>`;
}

function statusStrip() {
  return `<aside class="door-status" aria-label="Dated Kaspa labels">
    <p class="eyebrow">Kaspa now</p>
    <p class="small">Checked ${snapshot.checked}. Labels, not a pitch.</p>
    <ul>${snapshot.items.map(([name, state]) => `<li><span class="status-tag">${state}</span> ${name}</li>`).join('')}</ul>
    <p class="small"><a href="/status">Full status with sources</a></p>
  </aside>`;
}

const models = {
  1: () => `<div class="door-model">
      <p class="eyebrow">Kaspa intel · Parker’s model</p>
      <h2>Two miners. Parallel blocks stay.</h2>
      <p>Bitcoin throws one honest block away. Kaspa keeps both and orders them. Inclusion is not acceptance. The recipient still chooses when a payment is settled. There is no undo. A wrong address is a new payment, not a chargeback.</p>
      ${network({introductory: true})}
      <h2>A payment through the network</h2>
      ${payment()}
    </div>`,
  2: () => `<div class="door-model">
      <p class="eyebrow">Kaspa intel · Parker’s model</p>
      <h2>A DAG is not a free pass to spend twice.</h2>
      <p>After GHOSTDAG orders the blocks, the ledger still spends an output only once. Compare that to the chain you already know, then check what is live versus research.</p>
      ${spend()}
      ${network({introductory: true})}
    </div>`,
  3: () => `<div class="door-model">
      <p class="eyebrow">Kaspa intel · dated 9 Sep 2026</p>
      <h2>A live rule is not an app.</h2>
      <p>Toccata is live. SilverScript v1.0.0 is tagged; MIX Town still pins v1-rc1. vProgs are research. DAGKnight is Proposed. Parker’s Kaspa Studio is an isolated local beta, not this site. Hosted V5 and V6 stay withdrawn. Town is the Testnet-10 lab.</p>
      ${vault()}
      ${permission()}
    </div>`,
  4: () => `<div class="door-model">
      <p class="eyebrow">Kaspa intel · tradeoffs</p>
      <h2>Speed is not a new security story.</h2>
      <p>10 BPS is live. Instant irreversible coffee is not. Answer with labels and a model, not a market cap.</p>
      ${tradeoffComparison()}
    </div>`,
};

const explore = [
  ['Help', 'Pick the Discord room. Facts, not a seed or a price.', '/help'],
  ['Explore', 'kaspa.stream, tn10.kaspa.stream, Graph Inspector.', '/explore'],
  ['Playground', 'Delay, double spend, mining share, spending rules. Bring tKAS if you have it.', '/playground'],
  ['Town', 'Testnet-10 contract lab. Game rules on real spends. One browser holds every key.', '/covenants'],
  ['Node', 'TN10 node plus CPU miner, or a mainnet follower. Do not mix the flags.', '/node'],
];

function pageBody(door) {
  const film = `<details class="door-film-fold"><summary>Optional film · Kaspa Silver</summary>${localFilm('/media/kaspa-silver.mp4', 'Kaspa Silver: what Kaspa is.', {preload: 'metadata'})}</details>`;
  return `<div class="page-intro intro-door">
      <p class="eyebrow">${door.label}</p>
      <h1>${door.title}</h1>
      <p class="lead">${door.intel}</p>
    </div>
    <p class="door-as" data-door-as hidden></p>
    <div class="door-top">
      ${principles()}
      ${statusStrip()}
    </div>
    ${models[door.id]()}
    <div class="door-intel-body">${door.body}</div>
    ${film}
    ${peopleChips(door.id)}
    <section class="chapter">
      <div class="section-title"><h2>Continue</h2><p>Help is questions. Explore is the live ledger. The playground is the mechanics.</p></div>
      ${routes(explore)}
    </section>
    <p class="small"><a href="/#doors">Back to the four doors</a></p>`;
}

export const doorPages = Object.values(doors).map(door => ({
  file: `door-${door.id}.html`,
  title: `${door.label} · ${door.title}`,
  description: door.intel,
  body: pageBody(door),
}));
