// Real block identities and reference edges in an illustrative spatial layout.
// A pending parcel never enters a block until an accepted-block ID is supplied.
const validHash=v=>typeof v==='string'&&/^[0-9a-f]{64}$/i.test(v);
const defaults={terrarium:[-6,0,-4],agent:[1,0,-6],market:[7,0,-1],coordination:[4,0,6],computation:[-5,0,5]};
export function createV4Dag3D({THREE,scene,places=defaults,maxBlocks=30}={}){
 const layer=new THREE.Group();layer.name='Node-observed block DAG';layer.userData.nodeObserved=true;scene.add(layer);
 const nodes=new Map(),edges=new Map(),parcels=new Map(),completed=new Set(),limit=Math.min(30,Math.max(6,maxBlocks));let clock=0,last=null,focused=false,disposed=false;
 const box=new THREE.BoxGeometry(.62,.25,.44),header=new THREE.BoxGeometry(.5,.025,.035),packet=new THREE.BoxGeometry(.16,.16,.16),arrowShape=new THREE.ConeGeometry(.045,.14,5),coinShape=new THREE.CylinderGeometry(.13,.13,.055,16);
 const stripe=new THREE.MeshBasicMaterial({color:0xe3e8e5}),edgeMaterial=new THREE.LineBasicMaterial({color:0x7c8d87,transparent:true,opacity:.55}),arrowMaterial=new THREE.MeshBasicMaterial({color:0x7c8d87});
 const coinMaterial=new THREE.MeshStandardMaterial({color:0xffcc43,metalness:0,roughness:.8,emissive:0x8a4b00,emissiveIntensity:0});
 const up=new THREE.Vector3(0,1,0);
 const interiorPoints={agent:{origin:[3,.95,2.8],recipient:[2,1.2,2]},market:{origin:[2,1.2,2],recipient:[-3,1.55,-1.5]},terrarium:{origin:[0,.9,0],recipient:[0,.9,0]},coordination:{origin:[2,1.2,2],recipient:[0,1,-1.6]},computation:{origin:[0,1.2,2],recipient:[0,1.9,-2]}};
 const kindKey=k=>({bundle:'market',launch:'coordination',compute:'computation',composed:'market'}[k]||k);
 function pointFor(event,role='origin'){const account=role==='recipient'?event.recipientAccount:event.originAccount;if(focused&&kindKey(event.kind)==='agent'&&Number.isInteger(account)&&account>=0&&account<3)return role==='origin'?new THREE.Vector3(3,.95,2.8):new THREE.Vector3(-3+account*3,.95,-.65);const explicit=role==='recipient'?event.recipientPosition:event.position;if(Array.isArray(explicit)&&explicit.length===3&&explicit.every(Number.isFinite))return new THREE.Vector3(...explicit);const kind=kindKey(event.kind);if(focused)return new THREE.Vector3(...(interiorPoints[kind]||interiorPoints.agent)[role]);const p=places[kind]||[0,0,0];return new THREE.Vector3(p[0]+(role==='recipient'?.7:0),p[1]+.8,p[2]);}
 function addNode(hash,parents=[],role='parent',birth=clock){
  let node=nodes.get(hash);if(node){if(parents.length)node.parents=new Set(parents);if(role!=='parent')node.role=role;return node;}
  const group=new THREE.Group(),material=new THREE.MeshStandardMaterial({color:0x71817b,metalness:0,roughness:1});
  group.add(new THREE.Mesh(box,material));for(let row=0;row<3;row++){const bar=new THREE.Mesh(header,stripe);bar.position.set(0,.132,-.11+row*.09);group.add(bar);}
  group.userData={hash,parents:[...parents],nodeObserved:true,kind:'dag-block'};group.name=`Block ${hash}`;
  node={hash,parents:new Set(parents),group,material,birth,role,lane:parseInt(hash.slice(0,2),16)%3};nodes.set(hash,node);layer.add(group);positionNode(node);
  while(nodes.size>limit){const oldest=nodes.keys().next().value;removeNode(oldest);}
  return node;
 }
 function removeNode(hash){const node=nodes.get(hash);if(!node)return;layer.remove(node.group);node.material.dispose();nodes.delete(hash);for(const [key,edge]of edges)if(edge.from===hash||edge.to===hash){layer.remove(edge.line,edge.arrow);edge.line.geometry.dispose();edges.delete(key);}}
 function positionNode(node){const index=[...nodes.keys()].indexOf(node.hash);node.group.position.set(3.7+Math.floor(index/10)*.65,.9+(index%10)*.44,-4.3);}
 function synchronizeEdges(){
  const needed=new Set();for(const node of nodes.values())for(const parent of node.parents){if(!nodes.has(parent)||parent===node.hash)continue;const key=`${node.hash}:${parent}`;needed.add(key);if(!edges.has(key)){const geometry=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),line=new THREE.Line(geometry,edgeMaterial),arrow=new THREE.Mesh(arrowShape,arrowMaterial);line.userData={from:node.hash,to:parent,nodeObserved:true};layer.add(line,arrow);edges.set(key,{from:node.hash,to:parent,line,arrow});}}
  for(const [key,edge]of edges)if(!needed.has(key)){layer.remove(edge.line,edge.arrow);edge.line.geometry.dispose();edges.delete(key);}
 }
 function updateDag({hash,parents}={}){
  if(disposed)return;if(!validHash(hash)||!Array.isArray(parents)||parents.some(p=>!validHash(p)))throw new Error('DAG geometry requires actual block and parent hashes.');
  const unique=[...new Set(parents)].filter(p=>p!==hash).slice(0,limit-1);
  // Parent hashes themselves are observed in the real header. Their own parents
  // remain unknown; no additional ancestors or edges are generated.
  unique.forEach((parent,index)=>addNode(parent,[],'parent',clock-3500-index*1000));
  const node=addNode(hash,unique,'tip');node.parents=new Set(unique);node.group.userData.parents=unique;node.role='tip';node.material.color.setHex(0x71817b);synchronizeEdges();
 }
 function transaction(event={}){
  if(disposed||completed.has(event.id))return;if(!validHash(event.id))throw new Error('A transaction parcel requires an actual transaction ID.');
  const accepted=event.status==='accepted'&&validHash(event.acceptingBlock);let item=parcels.get(event.id);
  if(!item){const group=new THREE.Group(),material=new THREE.MeshStandardMaterial({color:0xd99c36,roughness:1,metalness:0});group.add(new THREE.Mesh(packet,material));group.userData={transactionId:event.id,status:'pending'};layer.add(group);item={event:{...event},group,material,phase:'pending',birth:clock,start:pointFor(event)};group.position.copy(item.start);parcels.set(event.id,item);}
  item.event={...item.event,...event};for(const key of ['inputCount','covenantCount','outputCount'])if(Number.isInteger(event[key]))item.group.userData[key]=event[key];
  if(accepted&&item.phase==='pending'){addNode(event.acceptingBlock,[],'accepting',clock-8000);synchronizeEdges();item.phase='enter';item.birth=Math.max(clock,item.birth+850);item.start=item.group.position.clone();item.group.userData.status='accepted';item.material.color.setHex(0x32936b);for(let i=0;i<3;i++){const coin=new THREE.Mesh(coinShape,coinMaterial);coin.name='Accepted tKAS receipt';coin.rotation.x=Math.PI/2;coin.position.set(-.22-i*.2,0,0);item.group.add(coin);}}
  while(parcels.size>16){const key=parcels.keys().next().value;removeParcel(key);}
 }
 function removeParcel(id){const item=parcels.get(id);if(item){layer.remove(item.group);item.material.dispose();parcels.delete(id);}}
 function travel(item,target,t,lift=.9){const p=item.start.clone().lerp(target,t);p.y+=Math.sin(t*Math.PI)*lift;item.group.position.copy(p);item.group.rotation.set(0,0,0);}
 function frame(now,{playing=true,focused:focus=false,reducedMotion=false}={}){
  if(disposed)return;focused=focus;if(last===null)last=now;const delta=Math.max(0,Math.min(100,now-last));last=now;if(playing)clock+=delta;
  for(const node of nodes.values())positionNode(node);
  for(const edge of edges.values()){const a=nodes.get(edge.from)?.group.position,b=nodes.get(edge.to)?.group.position;if(!a||!b)continue;const attr=edge.line.geometry.attributes.position;attr.setXYZ(0,a.x,a.y,a.z);attr.setXYZ(1,b.x,b.y,b.z);attr.needsUpdate=true;edge.line.geometry.computeBoundingSphere();const direction=b.clone().sub(a).normalize();edge.arrow.position.copy(b).addScaledVector(direction,-.42);edge.arrow.quaternion.setFromUnitVectors(up,direction);}
  for(const [id,item]of parcels){if(reducedMotion){item.group.position.copy(pointFor(item.event,item.phase==='pending'?'origin':'recipient'));if(item.phase!=='pending'){completed.add(id);removeParcel(id);}continue;}const age=Math.max(0,clock-item.birth);item.group.visible=!focused||focused===true||kindKey(item.event.kind)===focused;
   if(item.phase==='pending'){item.group.visible=item.group.visible&&age>=850;const origin=pointFor(item.event),target=new THREE.Vector3(origin.x*.35,4.1,-2);item.start=origin;travel(item,target,Math.min(1,Math.max(0,age-850)/1900),.3);}
   else if(item.phase==='enter'){const target=nodes.get(item.event.acceptingBlock)?.group.position??new THREE.Vector3(0,5,-3);travel(item,target,Math.min(1,age/1300));if(age>=1300){item.phase='return';item.birth=clock;item.start=item.group.position.clone();const count=Math.min(4,Array.isArray(item.event.outputs)?item.event.outputs.length:1);for(let i=1;i<count;i++){const part=new THREE.Mesh(packet,item.material);part.position.set((i%2)*.22,Math.floor(i/2)*.22,0);item.group.add(part);}}}
   else if(item.phase==='return'){travel(item,pointFor(item.event,'recipient'),Math.min(1,age/1900),1.1);if(age>=1900){item.phase='arrived';item.birth=clock;}}
   else{item.group.scale.setScalar(1);if(age>500){completed.add(id);while(completed.size>160)completed.delete(completed.values().next().value);removeParcel(id);}}
  }
 }
 function dispose(){if(disposed)return;disposed=true;for(const id of [...parcels.keys()])removeParcel(id);for(const id of [...nodes.keys()])removeNode(id);scene.remove(layer);for(const resource of [box,header,packet,arrowShape,coinShape,stripe,edgeMaterial,arrowMaterial,coinMaterial])resource.dispose();}
 return {updateDag,updateTip:updateDag,transaction,frame,tick:frame,isAnimating(){return [...parcels.values()].some(item=>item.phase!=='pending'||clock-item.birth<2750);},dispose};
}
