import {
  FILLERS, STORY, MACRO_PIN, SLOTS_PER_DAY,
  createEconomy, enqueue, setMinerPolicy, stepBlock, stepMany, metrics,
  runStoryStep, classifyLiveBlock,
} from './empty-block-economy.mjs';

const text = (root, selector, value) => {
  const node = root.querySelector(selector);
  if (node) node.textContent = value;
};

function pct(n) {
  return `${Math.round(n * 1000) / 10}%`;
}

function sompi(n) {
  return `${n.toLocaleString('en-US')} sompi`;
}

export function mountEmptyBlockEconomy(root = document) {
  const exhibit = root.querySelector('[data-empty-block-economy]');
  if (!exhibit || exhibit.dataset.ebMounted === 'true') return;
  exhibit.dataset.ebMounted = 'true';

  let state = createEconomy();
  let storyIndex = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const strip = exhibit.querySelector('[data-eb-strip]');
  const fillers = exhibit.querySelector('[data-eb-fillers]');
  const story = exhibit.querySelector('[data-eb-story]');
  const meters = exhibit.querySelector('[data-eb-meters]');

  fillers.innerHTML = FILLERS.map(f =>
    `<button type="button" data-eb-fill="${f.id}" title="${f.what}"><span>${f.mark}</span>${f.name}</button>`
  ).join('');

  story.innerHTML = STORY.map((beat, i) =>
    `<li data-eb-beat="${i}"><strong>${beat.title}</strong> ${beat.line}</li>`
  ).join('');

  function render() {
    const m = metrics(state);
    const last = state.last;
    strip.replaceChildren();
    for (const block of state.history) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'eb-cell';
      cell.dataset.empty = String(block.empty);
      cell.textContent = block.empty ? '' : (block.marks[0] || '·');
      cell.setAttribute('aria-label', block.empty
        ? `Block ${block.height}, empty, ${block.parents} parents`
        : `Block ${block.height}, filled with ${block.fillers.join(', ')}`);
      strip.append(cell);
    }
    meters.innerHTML = [
      ['Blocks', String(m.height)],
      ['Empty', String(m.empty)],
      ['Filled', String(m.filled)],
      ['Fill rate', pct(m.fillRate)],
      ['User fees', sompi(m.feeSompi)],
      ['Missed fees', sompi(m.missedFeeSompi)],
      ['If held a day', `${m.dayIfHeld.filledSlots.toLocaleString('en-US')} of ${SLOTS_PER_DAY.toLocaleString('en-US')} slots`],
      ['Miner', m.miner === 'include' ? 'includes work' : 'mines empty'],
    ].map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('');

    const caption = last
      ? last.empty
        ? `Block ${last.height} is empty. Coinbase paid. ${last.parents} parent${last.parents === 1 ? '' : 's'}. ${last.missedFeeSompi ? `Missed ${sompi(last.missedFeeSompi)} waiting in the queue.` : 'No user fee.'}`
        : `Block ${last.height} included ${last.fillers.join(', ')}. User fee ${sompi(last.feeSompi)}. Inclusion is not acceptance.`
      : 'No blocks yet. Mine one empty block, or queue a filler.';
    text(exhibit, '[data-eb-caption]', caption);
    text(exhibit, '[data-eb-queue]', m.queued
      ? `${m.queued} waiting · ${sompi(m.queuedFeeSompi)}`
      : 'Queue empty.');

    for (const button of exhibit.querySelectorAll('[data-eb-miner]')) {
      button.setAttribute('aria-pressed', String(button.dataset.ebMiner === state.miner));
    }
    for (const beat of exhibit.querySelectorAll('[data-eb-beat]')) {
      beat.dataset.current = String(Number(beat.dataset.ebBeat) === Math.min(storyIndex, STORY.length - 1));
    }
  }

  exhibit.querySelector('[data-eb-step]').addEventListener('click', () => {
    state = stepBlock(state);
    render();
  });
  exhibit.querySelector('[data-eb-ten]').addEventListener('click', () => {
    state = stepMany(state, 10);
    render();
  });
  exhibit.querySelector('[data-eb-reset]').addEventListener('click', () => {
    state = createEconomy();
    storyIndex = 0;
    text(exhibit, '[data-eb-story-line]', 'Start with an empty block. It still counts.');
    render();
  });
  for (const button of exhibit.querySelectorAll('[data-eb-miner]')) {
    button.addEventListener('click', () => {
      state = setMinerPolicy(state, button.dataset.ebMiner);
      render();
    });
  }
  fillers.addEventListener('click', event => {
    const button = event.target.closest('[data-eb-fill]');
    if (!button) return;
    try {
      state = enqueue(state, button.dataset.ebFill);
      render();
    } catch (error) {
      text(exhibit, '[data-eb-queue]', error.message);
    }
  });
  exhibit.querySelector('[data-eb-story-next]').addEventListener('click', () => {
    if (storyIndex >= STORY.length) {
      storyIndex = 0;
      state = createEconomy();
    }
    const beat = STORY[Math.min(storyIndex, STORY.length - 1)];
    state = runStoryStep(state, Math.min(storyIndex, STORY.length - 1));
    text(exhibit, '[data-eb-story-line]', beat.line);
    storyIndex += 1;
    render();
  });
  exhibit.querySelector('[data-eb-live]').addEventListener('click', async () => {
    const out = exhibit.querySelector('[data-eb-live-out]');
    out.textContent = 'Reading api.kaspa.org…';
    try {
      const dag = await getJson('https://api.kaspa.org/info/blockdag');
      const sink = dag.sink;
      if (!sink) throw new Error('No sink hash in the BlockDAG reading.');
      const block = await getJson(`https://api.kaspa.org/blocks/${sink}`);
      const view = classifyLiveBlock(block);
      const extra = block.extra?.minerInfo ? ` Miner tag: ${block.extra.minerInfo}.` : '';
      out.textContent = view.empty
        ? `Sink ${String(sink).slice(0, 12)}… is empty of user payments (${view.txCount} tx, coinbase only). DAA ${view.daa || dag.virtualDaaScore}. Window, not a node.${extra} Classroom pin was ${MACRO_PIN.checked}, DAA ${MACRO_PIN.daa}.`
        : `Sink ${String(sink).slice(0, 12)}… carries ${view.userTxCount} user tx (${view.txCount} total). DAA ${view.daa || dag.virtualDaaScore}. Window, not a node.${extra}`;
    } catch (error) {
      out.textContent = `Live sample failed (${error.message}). Treat the classroom as the lesson. Open the Graph Inspector instead.`;
    }
  });

  render();
  if (!reduced.matches) {
    // One slow tick so the strip is not a 10 Hz seizure. User mines the rest.
    window.setTimeout(() => {
      if (state.height === 0) {
        state = stepBlock(state);
        render();
      }
    }, 400);
  }
}

function getJson(url) {
  return fetch(url, { headers: { Accept: 'application/json' } }).then(async response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  });
}

if (typeof document !== 'undefined') mountEmptyBlockEconomy();
