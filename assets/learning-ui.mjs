// Optional reading continuity. No scores or tracking.
const stops=[
  ['/what-is-kaspa','Understand the network'],
  ['/why-kaspa-matters','Follow a payment'],
  ['/build-on-kaspa','Test a spending rule'],
  ['/skeptical-case','Evaluate the tradeoffs'],
];
const path=location.pathname.replace(/\.html$/,'').replace(/\/$/,'')||'/';
const key='kaspa-explained-reading-v1';
try{
  const current=stops.find(([href])=>href===path);
  if(current)localStorage.setItem(key,JSON.stringify({href:current[0],title:current[1]}));
  const resume=document.querySelector('[data-learning-resume]');
  const saved=JSON.parse(localStorage.getItem(key)||'null');
  const known=stops.find(([href,title])=>href===saved?.href&&title===saved?.title);
  if(resume&&known){const a=document.createElement('a');a.href=known[0];a.textContent=`Return to ${known[1].toLowerCase()} →`;resume.replaceChildren(a);resume.hidden=false;}
}catch{/* Reading and navigation work when browser storage is unavailable. */}
