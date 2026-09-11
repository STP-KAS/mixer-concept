import {snapshot} from './site.mjs';
import {honestLabels, liveDagInvite} from './community.mjs';

export const mixerPage = {
  file: 'mixer.html',
  title: 'mixer concept',
  description: 'MIX version mixer concept: Parker’s inspectable Kaspa explanations, STP doors and Node, PegLab, plus live DAG, wallet, and honest labels.',
  body: `<div class="page-intro intro-mixer">
      <p class="eyebrow">MIX · version</p>
      <h1>mixer concept</h1>
      <p class="lead">Parker’s inspectable Kaspa models on STP’s doors, plus the parameters a learn/explore site needs that neither source is alone.</p>
    </div>
    <p class="mix-credit">Not kaspaexplained.com. Not a token. Not a bank. Door principles stay. Kaspa intel on the doors is Parker’s models plus dated labels.</p>
    <section class="chapter" id="labels">
      <div class="section-title"><h2>Honest labels</h2><p>A tag is not an app. A lab is not three independent people. Mix these and you are pitching.</p></div>
      ${honestLabels()}
      <div class="reading-rows">
        <article><h3>SilverScript v1.0.0 versus MIX v1-rc1</h3><div><p>The official compiler is tagged v1.0.0 (9 Sep 2026). Application readiness is separate. MIX Town still pins v1-rc1 until this site retargets. A compiler tag is not a dapp.</p></div></article>
        <article><h3>Studio is isolated</h3><div><p>Parker’s Kaspa Studio is branch studio-beta, 9 Sep 2026. Local workbench. Not this public MIX site. It does not broadcast. Compiler success, a local VM, and network acceptance stay three facts.</p></div></article>
        <article><h3>V5 and V6 withdrawn. Town is the TN10 lab.</h3><div><p>Hosted V5 and V6 stay withdrawn. Town at /covenants is Testnet-10. Game rules on real spends. One browser holds every key. That is not three independent people.</p></div></article>
      </div>
    </section>
    <section class="chapter" id="both">
      <div class="section-title"><h2>Best of both worlds</h2><p>Each source keeps what it is good at. MIX does not flatten them.</p></div>
      <div class="mixer-split">
        <article>
          <p class="eyebrow">Parker</p>
          <h3>Inspect the machine</h3>
          <ul>
            <li>Parallel-block, payment, spend, and vault models</li>
            <li>Spending-rule stories: fair exchange, helper budget, verified work</li>
            <li>A four-stop learning route with resume</li>
            <li>Town economy, wrap lab, sources you can check</li>
          </ul>
        </article>
        <article>
          <p class="eyebrow">STP</p>
          <h3>Who is reading</h3>
          <ul>
            <li>Four doors and people chips</li>
            <li>PoW ethos, no price talk</li>
            <li>Node: TN10 tKAS vs mainnet follower</li>
            <li>Kasware / Kastle, Windows local preview, honest labels</li>
          </ul>
        </article>
      </div>
    </section>
    <section class="chapter" id="parameters">
      <div class="section-title"><h2>Other parameters</h2><p>Things a complete learn/explore site needs that neither source is alone.</p></div>
      <div class="mixer-params">
        <a href="/peglab"><strong>PegLab</strong><p>A dapp unit that depegs on purpose. Engine and live lab.</p></a>
        <a href="/explore"><strong>Live DAG</strong><p>kaspa.stream and the Graph Inspector. No ticker required.</p></a>
        <a href="/wallet"><strong>Wallet</strong><p>Kasware or Kastle hold keys. This page reads an indexer, not your node.</p></a>
        <a href="/help"><strong>Help</strong><p>Kaspa Discord rooms. Nobody here recovers a phrase.</p></a>
        <a href="/status"><strong>Dated status</strong><p>Checked ${snapshot.checked}. Live, roadmap, research, wrong.</p></a>
        <a href="/search"><strong>Search</strong><p>Find a payment, a door, a node step, or a claim.</p></a>
        <a href="/moonboy"><strong>Moonboy refusal</strong><p>Price predictions are not intel.</p></a>
        <a href="/best-practices"><strong>Other-chain practices</strong><p>Keys, verify, node versus explorer. Same as Bitcoin, Ethereum, Monero. Then Kaspa Silver.</p></a>
      </div>
    </section>
    <section class="chapter" id="how">
      <div class="section-title"><h2>How mixer concept uses a door</h2></div>
      <ol class="mixer-steps">
        <li><strong>Principles first.</strong> Who you are. Labels. No price. A model you can break.</li>
        <li><strong>Kaspa now.</strong> Dated chips from the status snapshot.</li>
        <li><strong>Parker’s model.</strong> Parallel blocks, a payment, a failed double spend, or a vault. The model comes before the lecture.</li>
        <li><strong>STP intel text.</strong> Where Kaspa sits next to the rest of crypto.</li>
        <li><strong>Explore.</strong> Playground, DAG, town, node. Help if you have a question. Best practices if you need the shared rules.</li>
      </ol>
    </section>
    <section class="chapter" id="layers">
      <div class="section-title"><h2>Do not mix layers</h2><p>Same split as Lightning, Cashu, and Solana clusters. MIX names the trust model.</p></div>
      <div class="table-scroll" role="region" aria-label="MIX layers" tabindex="0"><table><thead><tr><th>Thing on MIX</th><th>What it is</th><th>What it is not</th></tr></thead><tbody>
        <tr><th>Keys on L1 (<code>kaspa:</code>)</th><td>Coins the network will spend</td><td>An IOU</td></tr>
        <tr><th>Exchange balance</th><td>A company claim</td><td>Keys</td></tr>
        <tr><th>Wrap lab</th><td>A redeemable receipt on Testnet-10</td><td>L1 cash. Not a mainnet bridge</td></tr>
        <tr><th>PegLab</th><td>A toy peg that is meant to break</td><td>A stable</td></tr>
        <tr><th>Town / playground tKAS</th><td>Faucet money. One browser holds every key</td><td>Mainnet KAS, or three independent people</td></tr>
        <tr><th>kaspa.stream / this site</th><td>A window</td><td>Your node</td></tr>
      </tbody></table></div>
    </section>
    ${liveDagInvite()}
    <nav class="reading-next" aria-label="Start mixer concept"><p>Start</p><a href="/#doors">Pick a door <span aria-hidden="true">→</span></a></nav>`,
};
