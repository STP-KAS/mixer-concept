import {snapshot} from './site.mjs';

export const mixerPage = {
  file: 'mixer.html',
  title: 'mixer concept',
  description: 'MIX version mixer concept: Parker’s inspectable Kaspa explanations, STP doors and Node, PegLab, plus live DAG, wallet, and honest labels.',
  body: `<div class="page-intro intro-mixer">
      <p class="eyebrow">MIX · version</p>
      <h1>mixer concept</h1>
      <p class="lead">The best of Parker’s Kaspa Explained and STP’s doors, plus every extra parameter that helps someone learn or explore Kaspa without a pitch.</p>
    </div>
    <p class="mix-credit">Not kaspaexplained.com. Not a token. Not a bank. mixer concept is the MIX version that keeps door principles and puts inspectable Kaspa intel on them.</p>
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
        <a href="/wallet"><strong>Wallet</strong><p>Kasware or Kastle holdings. Never a seed.</p></a>
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
        <li><strong>Parker’s model.</strong> Parallel blocks, a payment, a failed double spend, or a vault.</li>
        <li><strong>STP intel text.</strong> Where Kaspa sits next to the rest of crypto.</li>
        <li><strong>Explore.</strong> Playground, DAG, town, node. Help if you have a question. Best practices if you need the shared rules.</li>
      </ol>
    </section>
    <nav class="reading-next" aria-label="Start mixer concept"><p>Start</p><a href="/#doors">Pick a door <span aria-hidden="true">→</span></a></nav>`,
};
