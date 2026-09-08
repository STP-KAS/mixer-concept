const states = {
  exchange: [
    {action:'Pay the seller first',result:'The buyer has the coins. The seller has the digital tool.',description:'Buyer owns three coins. Seller owns a digital tool.'},
    {action:'Try an atomic exchange',result:'Coins moved. The seller can still keep the digital tool.',description:'Buyer has zero coins and no tool. Seller has three coins and still owns the digital tool.'},
    {action:'Include the digital tool',result:'New attempt: the tool is withheld, so neither side transfers anything.',description:'In a fresh atomic exchange, buyer retains three coins and seller retains the tool because the tool transfer is missing.'},
    {action:'Replay exchange',result:'One transaction: the buyer gets the tool; the seller gets 3 coins.',description:'Buyer owns the digital tool. Seller owns the three coins. Both transfers happened together.'},
  ],
  helper: [
    {action:'Trade 2 crops for 1 wood',result:'The owner keeps the assets; the helper gets a limited spending allowance.',description:'Owner has three crops and no wood. Trader has one wood and no crops. The allowance permits two crops.'},
    {action:'Try to spend another crop',result:'2 crops traded for 1 wood. The helper has used the whole allowance.',description:'Owner now has one crop and one wood. Trader has two crops and no wood. No allowance remains.'},
    {action:'Replay helper trade',result:'Blocked: no allowance remains. The owner still has 1 crop and 1 wood.',description:'The extra crop transfer was rejected. Owner still has one crop and one wood; trader still has two crops.'},
  ],
  work: [
    {action:'Check 5 × 8',result:'The 0.13 tKAS reward stays locked until the settings pass the check.',description:'Five plus eight is thirteen, but their product is forty. Reward remains locked and the machine is off.'},
    {action:'Try 6 × 7',result:'Rejected: 5 × 8 is 40, not 42. The machine stays off and the reward stays locked.',description:'Invalid settings were rejected. The machine is off and the worker receives zero tKAS.'},
    {action:'Replay work check',result:'6 × 7 = 42 and 6 + 7 = 13. The machine runs; the worker receives the modeled 0.13 tKAS.',description:'Valid settings passed the custom check. The machine is running and the worker receives the modeled reward of zero point one three tKAS.'},
  ],
};
const text = (root,selector,value) => {const node=root.querySelector(selector);if(node)node.textContent=value;};

export function mountUseCaseDemos(root=document) {
  for(const exhibit of root.querySelectorAll('[data-use-case-exhibit]')) {
    if(exhibit.dataset.ucMounted==='true')continue;
    exhibit.dataset.ucMounted='true';
    const tabs=[...exhibit.querySelectorAll('[data-uc-tab]')];
    const panels=[...exhibit.querySelectorAll('[data-uc-scene]')];
    function render(panel,step) {
      const kind=panel.dataset.ucScene,state=states[kind][step];
      panel.dataset.step=String(step);
      text(panel,'[data-uc-next]',state.action);
      text(panel,'[data-uc-result]',state.result);
      text(panel,'[data-uc-scene-description]',state.description);
      if(kind==='helper') {
        const traded=step>0;
        text(panel,'[data-uc-owner-crops]',traded?'1 crop':'3 crops');
        text(panel,'[data-uc-owner-wood]',traded?'1 wood':'0 wood');
        text(panel,'[data-uc-trader-crops]',traded?'2 crops':'0 crops');
        text(panel,'[data-uc-trader-wood]',traded?'0 wood':'1 wood');
        text(panel,'[data-uc-budget]',`Allowance remaining: ${traded?'0':'2'} crops`);
      }
      if(kind==='work') {
        const valid=step===2;
        text(panel,'[data-uc-product]',valid?'6 × 7 = 42':'5 × 8 = 40');
        text(panel,'[data-uc-sum]',valid?'6 + 7 = 13':'5 + 8 = 13');
        text(panel,'[data-uc-reward]',valid?'Reward released':'0.13 tKAS locked');
        text(panel,'[data-uc-worker-balance]',valid?'Receives 0.13 tKAS':'Receives 0 tKAS');
      }
    }
    function choose(tab) {
      for(const item of tabs){const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;}
      for(const panel of panels)panel.hidden=panel.dataset.ucScene!==tab.dataset.ucTab;
    }
    for(const tab of tabs) {
      tab.addEventListener('click',()=>choose(tab));
      tab.addEventListener('keydown',event=>{
        const index=tabs.indexOf(tab);
        const next=event.key==='ArrowRight'?(index+1)%tabs.length:event.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:-1;
        if(next<0)return;event.preventDefault();tabs[next].focus();choose(tabs[next]);
      });
    }
    for(const panel of panels) {
      panel.querySelector('[data-uc-next]').addEventListener('click',()=>render(panel,(Number(panel.dataset.step)+1)%states[panel.dataset.ucScene].length));
      panel.querySelector('[data-uc-reset]').addEventListener('click',()=>render(panel,0));
    }
  }
}
if(typeof document!=='undefined')mountUseCaseDemos();
