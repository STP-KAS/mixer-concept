// Each accepted step corresponds to one transaction. The overspend step is a local precheck.
// Main, Second and Third are all keys in the user's disposable Testnet wallet.
export const V4_LIVE_ROLES=Object.freeze({
 Main:'You · seller, budget recovery and project beneficiary',
 Second:'Pip · buyer and paid worker',
 Third:'Third backer',
 explanation:'You control all three accounts in this test wallet. tKAS are test coins. The story gives the accounts different roles.'
});
export const V4_LIVE_PURPOSE=Object.freeze({
 title:'Get Sprout Harbor running.',
 line:'Trade for parts, bring the greenhouse’s backers together, then solve its work bottleneck. Your first goal is a running greenhouse that supplies Sprout’s habitat.',
 boundary:'Testnet checks the coin transfers and contract states. Parts, construction, food and production are game rules; the node does not verify a physical town.'
});
const connections={
 shop:{objective:'Find the parts for Sprout’s greenhouse.',connection:'The exchange offers three component vouchers. Pip will need the complete set for the garden project.'},
 budget:{objective:'Let Pip shop without handing over your wallet.',connection:'The same restricted budget will pay for preparation and then buy the component set.'},
 overspend:{objective:'Keep the garden’s spending within its limit.',connection:'Pip’s larger request must leave the project’s coins untouched.'},
 pay:{objective:'Make Pip’s first permitted payment.',connection:'This payment tests the recipient and cap before Pip attempts the complete purchase.'},
 buy:{objective:'Get the complete set for the greenhouse.',connection:'Pip buys the three vouchers together. The game treats that set as greenhouse components; the node checks the assets and payment.',consequence:'Game world: the purchased set can supply the greenhouse project.'},
 'parts-refund':{objective:'Free the deposits after the purchase.',connection:'Pip closes the vouchers and recovers their deposits. The game can retain the acquired components as project inventory.'},
 recover:{objective:'Put the unused shopping money back in your hands.',connection:'The shopping trip is finished. Recover Pip’s remaining budget before visiting Sprout.'},
 habitat:{objective:'Meet the garden you are helping.',connection:'Sprout’s movement state gives the project a small inhabitant with a limited energy supply.'},
 'move-1':{objective:'Help Sprout explore one square.',connection:'A small move uses real contract energy. The game shows why the garden needs a dependable supply.'},
 'move-2':{objective:'Keep Sprout moving within its energy supply.',connection:'One more step leaves just one energy. The same rule follows Sprout into its next state.'},
 'move-3':{objective:'See what happens when Sprout runs out.',connection:'The last permitted step brings energy to zero. This is where the garden story turns toward its greenhouse.',consequence:'Game world: Sprout needs the greenhouse project to improve the garden’s supply. Its on-chain energy remains zero.'},
 'habitat-refund':{objective:'Close Sprout’s completed movement session.',connection:'Recover the deposit, then bring the greenhouse project to its backers. Closing this state does not refill its energy.'},
 factory:{objective:'Bring the greenhouse’s backers together.',connection:'Pip has completed the supply purchase. Now three accounts must agree to release the project’s funding.'},
 'approve-main':{objective:'Commit your part to the greenhouse.',connection:'Your approval is the first of three. The project payment still waits for the others.'},
 'approve-pip':{objective:'Add Pip’s commitment.',connection:'The buyer now approves its project pledge. One backer remains.'},
 'approve-third':{objective:'Get the final commitment.',connection:'With all three pledges ready, the greenhouse’s project payment can move in one transaction.'},
 'factory-pay':{objective:'Fund the greenhouse together.',connection:'The three pledges pay the beneficiary. The game connects that funding with the component purchase to build the greenhouse.',consequence:'Game world: funding and components can open the greenhouse. The node checks the payment, not a physical building.'},
 compute:{objective:'Help the greenhouse workers keep up.',connection:'A greenhouse still needs its jobs scheduled. Offer a reward for a valid assignment of the three workers.'},
 'compute-pay':{objective:'Remove the scheduling bottleneck.',connection:'Pip submits an assignment the contract can check. Its reward is a real test-coin payment; the faster greenhouse is a game outcome.',consequence:'Game world: the verified schedule can improve greenhouse production.'},
 'compute-refund':{objective:'Finish the project and recover the spare coins.',connection:'Parts and funding brought the greenhouse together; the verified schedule removes its work bottleneck. Recover the last deposit, then check the town’s food supply.'}
};
const networkMoments={shop:'custody',pay:'pow',buy:'realtime','approve-third':'verification','compute-pay':'verification','compute-refund':'participation'};
const step=(id,kind,title,line,button,contract,operation,why,extra={})=>Object.freeze({id,kind,title,line,button,networkKey:networkMoments[id]||null,...connections[id],contract:`contracts/public/${contract}.sil`,expected:{kind:({market:'bundle',coordination:'launch',computation:'compute'}[kind]||kind),operation,accepted:true},why,...extra});
export const V4_LIVE_STORY=Object.freeze([
 step('shop','market','Put three parts up for sale.','Your Main account owns the parts. Lock 0.75 tKAS across their three deposits, plus a transaction fee.','Create the three parts','v4-bundle',null,'A covenant makes the sale conditions part of each asset’s spending rules.'),
 step('budget','agent','Give Pip a budget with limits.','Move 0.23 tKAS from Main into Pip’s budget. Pip may pay Main at most 0.05 tKAS per purchase. Your recovery key can reclaim what remains.','Fund Pip’s budget','v4-agent',null,'Pip may ask for more or send misleading messages. Its key still cannot override the spending policy. Your recovery key has a separate power to close the budget.'),
 step('overspend','agent','Pip asks for too much.','Try a 0.10 tKAS payment against the 0.05 limit. The app will stop this request before signing or sending it.','Try 0.10 tKAS','v4-agent',null,'This click demonstrates the app’s precheck. It does not submit an invalid transaction to the node.',{action:'request',choice:{id:'Pip',amount:8},expected:{kind:'agent',operation:null,accepted:false,localReject:true}}),
 step('pay','agent','Pay within the rule.','Pip sends 0.05 tKAS from its restricted budget to Main. The remainder keeps the same policy, after the fee.','Pay 0.05 tKAS','v4-agent',0,'Pip cannot use its spending key to change the recipient or lift its cap. The connected node checks the signature and continuing budget; this browser is not itself a full node.'),
 step('buy','market','Buy all three parts together.','The parts move from Main to Pip. Pip’s budget pays Main another 0.05 tKAS in the same transaction.','Buy the complete set','v4-bundle',null,'The seller must not keep both the payment and the parts, and Pip must not take the parts without paying. All asset rules and the budget rule check the same transaction: the complete deal passes or none of it does.',{expected:{kind:'composed',operation:1,accepted:true},additionalContracts:['contracts/public/v4-agent.sil']}),
 step('parts-refund','market','Release Pip’s asset deposits.','Pip now owns the three parts. Close them and return their combined 0.75 tKAS deposit to Second, minus the fee.','Return deposits to Pip','v4-bundle',2,'The current owner signs to retire these custom assets and release their deposits.'),
 step('recover','agent','Take back the unused budget.','Your Main recovery key closes Pip’s budget. Its remaining tKAS return to Main, minus the fee.','Recover the remainder','v4-agent',1,'Recovery uses a separate key. Pip’s spending key cannot invoke this route.',{action:'revoke'}),
 step('habitat','terrarium','Give Sprout a state on the network.','Main locks 0.10 tKAS in Sprout’s state. Sprout starts with three energy and may move one neighboring square at a time.','Create Sprout’s state','v4-terrarium',null,'A state output records position and energy. Its covenant restricts which successor may replace it.'),
 step('move-1','terrarium','One step costs one energy.','Move Sprout one neighboring square. Its state changes from three energy to two; the deposit pays the fee.','Move Sprout','v4-terrarium',0,'The node checks adjacency, grid bounds, identity and the exact energy decrease.'),
 step('move-2','terrarium','The next move follows the same rule.','Move one square again. Two energy become one, and the new state keeps the same covenant identity.','Take another step','v4-terrarium',0,'The state changes while its covenant ID preserves the lineage.'),
 step('move-3','terrarium','Use Sprout’s last energy.','One final neighboring step changes one energy to zero. Another move will no longer be permitted.','Take the last step','v4-terrarium',0,'Every spend must satisfy the current state. An earlier state cannot be spent again.'),
 step('habitat-refund','terrarium','Bring the deposit home.','Close Sprout’s state and return its remaining test coins to Main, minus the fee.','Return Sprout’s deposit','v4-terrarium',1,'The contract has an owner-signed exit. Closing the state releases the remaining value.'),
 step('factory','coordination','Set aside three contributions.','Main funds three 0.25 tKAS pledge deposits. Main, Second and Third each control one approval. You control all three demo keys.','Create the three pledges','v4-launch',null,'A beneficiary must not collect early just because two backers agree. Each key controls a separate pledge; release requires all three ready states. You control all three test keys here.'),
 step('approve-main','coordination','You approve your pledge.','Main marks its pledge ready. The deposit stays locked under the project’s rule, minus this step’s fee.','Approve as Main','v4-launch',0,'Only this pledge’s owner may sign its readiness change.'),
 step('approve-pip','coordination','Pip approves the second pledge.','Second marks its pledge ready. Two approvals still cannot release the project payment.','Approve as Pip','v4-launch',0,'The release rule requires three distinct owners and all three readiness flags.'),
 step('approve-third','coordination','The third backer agrees.','Third marks the final pledge ready. The contributions are ready to move together.','Approve as Third','v4-launch',0,'Readiness is a signed contract state. It does not prove a delivery or other outside event.'),
 step('factory-pay','coordination','Release the contributions together.','Spend all three ready pledges in one transaction. Their remaining tKAS pay Main, the named project beneficiary, after the fee.','Fund the project','v4-launch',1,'The node checks the three ready members and exact beneficiary. The building animation illustrates the result.'),
 step('compute','computation','Offer a reward for a valid schedule.','Main locks 0.25 tKAS. A schedule must assign a different worker to each of three jobs, with total cost at most six.','Fund the scheduling job','v4-compute',null,'This small problem can be checked directly by the contract. No ZK proof is used.'),
 step('compute-pay','computation','Find it. Check it. Pay Pip.','The browser finds a schedule. The node checks its assignment and releases exactly 0.05 tKAS to Second as the worker reward.','Verify and pay 0.05 tKAS','v4-compute',0,'A worker claiming “job done” is not enough. The node checks the submitted assignment and reward rule before paying Pip. It checks these numbers, not whether someone performed a job outside the game.'),
 step('compute-refund','computation','Recover the unused reward deposit.','Close the completed job. The remaining tKAS return to Main, minus the fee.','Return the remainder','v4-compute',1,'The owner signs the exit. Node-reported acceptance is evidence of this test-coin transition. The game can now check whether the greenhouse is running and the habitat has supplies.')
]);
export const V4_LIVE_TECHNOLOGY=Object.freeze({
 title:'What made these actions enforceable?',
 covenant:'The rules travel with the outputs holding your test coins. Every spend must satisfy them.',
 silverScript:'SilverScript is the language used to write these rules; its compiler produces the Kaspa Script checked by nodes.',
 argent:'Argent adds actor and cross-app abstractions above SilverScript. This tour does not execute Argent-generated contracts.',
 zk:'ZK can let a contract verify a proof of a larger computation. This three-job example is checked directly and uses no ZK proof.',
 pow:'Miners commit to candidate block contents before finding a valid proof of work. Nodes still check every transaction’s rules.',
 realtime:'Frequent block events can provide useful feedback sooner under the protocol’s mining-majority and network assumptions. One observed block is not unconditional finality.',
 verification:'This browser queries a connected node. Running a separate full node lets you check consensus rules independently; neither node proves an outside delivery or an honest person.',
 participation:'Mining and running a node are separate optional activities outside this browser. This tour does neither.',
 sourceKeys:['kip17','kip20','silver','argent','kip16','hashdag','dag'],
 sourceModule:'v4-technical-map.mjs'
});
