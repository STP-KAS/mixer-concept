import {doors, demos, doorKgi, peopleChips} from './doors.mjs';
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
      <p>Bitcoin throws one honest block away. Kaspa keeps both and orders them. Inclusion is not acceptance. The recipient still chooses when a payment is settled.</p>
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
      <p class="eyebrow">Kaspa intel · dated 8 Sep 2026</p>
      <h2>A live rule is not an app.</h2>
      <p>Toccata is live. SilverScript is a release candidate. vProgs are research. DAGKnight is Proposed. Parker’s hosted V5 and V6 are withdrawn as of 8 September 2026. Town is the Testnet-10 lab, not those versions and not these local models.</p>
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
  ['Playground', 'Delay, double spend, mining share, spending rules. Bring tKAS if you have it.', '/playground'],
  ['Explore the DAG', 'kaspa.stream and the Graph Inspector. No ticker required.', '/explore'],
  ['Town', 'Testnet-10 contract lab. Game rules on real spends. One browser holds every key.', '/covenants'],
  ['Node', 'TN10 node plus CPU miner, or a mainnet follower. Do not mix the flags.', '/node'],
];

function pageBody(door) {
  const film = door.id === 1 || door.id === 2
    ? `<details class="door-film-fold"><summary>Optional film · Kaspa Silver</summary>${localFilm('/media/kaspa-silver.mp4', 'Kaspa Silver: what Kaspa is.')}</details>`
    : '';
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
    <div class="door-intel-body">${door.body}</div>
    ${models[door.id]()}
    ${film}
    <section class="chapter" id="explore-this-door">
      <div class="section-title"><h2>Explore from here</h2><p>Learn on the models. See the live DAG. Try a spend only if you brought test coins.</p></div>
      ${routes(explore)}
    </section>
    ${doorKgi()}
    ${peopleChips(door.id)}
    <section class="chapter">
      <div class="section-title"><h2>Continue</h2><p>The playground is the mechanics. These pages are the next lesson and the extra reading.</p></div>
      ${routes(door.reads)}
    </section>
    <section class="chapter">
      <div class="section-title"><h2>Try it</h2><p>Same for every door.</p></div>
      ${routes(demos)}
    </section>
    <p class="small"><a href="/#doors">Back to the four doors</a></p>`;
}

export const doorPages = Object.values(doors).map(door => ({
  file: `door-${door.id}.html`,
  title: `${door.label} · ${door.title}`,
  description: door.intel,
  body: pageBody(door),
}));
