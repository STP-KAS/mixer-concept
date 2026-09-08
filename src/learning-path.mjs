import {escape} from './components.mjs';

export const learningStops = Object.freeze([
  {file:'what-is-kaspa.html',href:'/what-is-kaspa',title:'Understand the network',description:'See why blocks can arrive in parallel while a payment can spend an output only once.',outcome:'Explain the difference between keeping a block and accepting its transactions.'},
  {file:'why-kaspa-matters.html',href:'/why-kaspa-matters',title:'Follow a payment',description:'Trace the payment, change and fee, then inspect what acceptance establishes.',outcome:'Know what to check before sending and when inspecting a payment.'},
  {file:'build-on-kaspa.html',href:'/build-on-kaspa',title:'Test a spending rule',description:'Try a forbidden withdrawal and discover what a signature cannot authorize.',outcome:'Distinguish the rule a contract enforces from the application around it.'},
  {file:'skeptical-case.html',href:'/skeptical-case',title:'Evaluate the tradeoffs',description:'Connect speed, mining, validation and application claims to their assumptions.',outcome:'Identify the evidence needed to assess a claim about Kaspa.'},
]);

export function lessonContext(file){
  const index=learningStops.findIndex(stop=>stop.file===file);if(index<0)return'';
  const stop=learningStops[index];
  return `<div class="lesson-context"><a href="/#learning-route">Learning route</a><span class="lesson-position">${index+1} of ${learningStops.length}</span><p>${escape(stop.outcome)}</p></div>`;
}

export function learningRoute(){
  return `<section class="learning-route" id="learning-route" aria-labelledby="learning-route-title"><div class="section-title"><h2 id="learning-route-title">A route through the essentials</h2><p>Start at the beginning or open the topic you need. Each explanation includes something to inspect or try.</p></div><ol class="learning-stops">${learningStops.map((stop,index)=>`<li><a href="${stop.href}"><span class="step-index">${String(index+1).padStart(2,'0')}</span><strong>${stop.title}</strong><p>${stop.description}</p><span class="route-meta">Open explanation <span aria-hidden="true">→</span></span></a></li>`).join('')}</ol></section>`;
}
