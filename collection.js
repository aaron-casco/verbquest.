import {PETS} from './data.js';
export const DISCOVERY_PRICE=150;
export const COLLECTION_LIMIT=30;
export const collectibleDefs=()=>PETS.filter(p=>p.collectible);
export const starterDefs=()=>PETS.filter(p=>!p.collectible);
export function newCreature(def){return {instanceId:crypto.randomUUID(),species:def.id,stage:0,name:def.name,primary:def.primary,secondary:def.secondary,owned:[],accessories:[],accessorySettings:{}};}
export function ensureCollection(p){p.creatures??={};for(const [id,pet] of Object.entries(p.creatures)){pet.instanceId??=id;pet.accessorySettings??={};}if(p.pet){p.pet.instanceId??=p.pet.species;p.pet.accessorySettings??={};p.creatures[p.pet.instanceId]=p.pet;}p.discoveredSpecies??=[];for(const pet of Object.values(p.creatures))if(!p.discoveredSpecies.includes(pet.species))p.discoveredSpecies.push(pet.species);return p.creatures;}
export function discoveryOdds(p){ensureCollection(p);const available=collectibleDefs(),total=available.reduce((s,d)=>s+d.weight,0);return available.map(d=>({def:d,probability:d.weight/total}));}
export function chooseDiscovery(p,random=secureRandom){const odds=discoveryOdds(p);let r=Math.max(0,Math.min(1-Number.EPSILON,random()));for(const o of odds){r-=o.probability;if(r<0)return o.def;}return odds.at(-1).def;}
export function secureRandom(){const value=new Uint32Array(1);crypto.getRandomValues(value);return value[0]/4294967296;}
export function purchaseDiscovery(p,random=secureRandom){return purchaseDiscoveries(p,1,random);}
export function purchaseDiscoveries(p,count=1,random=secureRandom){ensureCollection(p);if(![1,5,10].includes(count))return {ok:false,reason:'count'};if((p.discovery&&!p.discovery.seenAt)||(p.discoveryBatch&&!p.discoveryBatch.seenAt&&p.discoveryBatch.receipts.some(r=>!r.seenAt)))return {ok:false,reason:'pending'};if(Object.keys(p.creatures).length+count>COLLECTION_LIMIT)return {ok:false,reason:'capacity'};if(!Number.isSafeInteger(p.coins)||p.coins<count*DISCOVERY_PRICE)return {ok:false,reason:'coins'};const results=Array.from({length:count},()=>{const def=chooseDiscovery(p,random),creature=newCreature(def);return {def,creature};}),at=new Date().toISOString();p.coins-=count*DISCOVERY_PRICE;const receipts=results.map(({def,creature})=>{p.creatures[creature.instanceId]=creature;if(!p.discoveredSpecies.includes(def.id))p.discoveredSpecies.push(def.id);return {id:crypto.randomUUID(),instanceId:creature.instanceId,species:def.id,at,seenAt:null};});p.discoveryBatch={id:crypto.randomUUID(),receipts,at,seenAt:null,animationDone:false};p.discovery=receipts[0];return {ok:true,...results[0],results};}
export function discoveryReceipts(p){return p.discoveryBatch&&!p.discoveryBatch.seenAt?p.discoveryBatch.receipts:p.discovery&&!p.discovery.seenAt?[p.discovery]:[];}
export function finishDiscoveries(p){const now=new Date().toISOString();for(const r of discoveryReceipts(p))r.seenAt??=now;if(p.discovery)p.discovery.seenAt??=now;if(p.discoveryBatch)p.discoveryBatch.seenAt??=now;}
export function sellDiscovered(p,id){const receipt=discoveryReceipts(p).find(r=>(r.instanceId||r.species)===id),pet=p.creatures?.[id];if(!receipt||!pet||p.pet?.instanceId===id)return {ok:false};receipt.seenAt=new Date().toISOString();if((p.discovery?.instanceId||p.discovery?.species)===id)p.discovery.seenAt=receipt.seenAt;return sellCreatures(p,[id]);}
export function sellCreatures(p,ids){ensureCollection(p);const chosen=[...new Set(ids)],pending=discoveryReceipts(p).filter(r=>!r.seenAt).map(r=>r.instanceId||r.species);if(!chosen.length||chosen.some(id=>!p.creatures[id]||!PETS.find(d=>d.id===p.creatures[id].species)?.collectible||p.pet?.instanceId===id||pending.includes(id)))return {ok:false};const refund=chosen.reduce((sum,id)=>sum+salePrice(p.creatures[id]),0);for(const id of chosen)delete p.creatures[id];p.coins+=refund;return {ok:true,refund,count:chosen.length};}
export function switchCreature(p,id){ensureCollection(p);if(!p.creatures[id])return false;p.pet=p.creatures[id];return true;}
export function salePrice(pet){return {common:80,uncommon:120,rare:200,legendary:300}[PETS.find(d=>d.id===pet.species)?.rarityClass]??0;}
export function removeCreature(p,id,sell=true){if(!sell)return {ok:false};return sellCreatures(p,[id]);}
export function finalStage(p){return (PETS.find(d=>d.id===p.pet?.species)?.stages.length||3)-1;}
export function isFinal(p){return !!p.pet&&p.pet.stage>=finalStage(p);}
export function evolutionPrice(p){return finalStage(p)===1?350:p.pet.stage===0?150:350;}

export const STARTER_PRICE=700;
export function purchaseStarter(p,species){ensureCollection(p);const def=starterDefs().find(d=>d.id===species);if(!def)return {ok:false,reason:'species'};if(Object.keys(p.creatures).length>=COLLECTION_LIMIT)return {ok:false,reason:'capacity'};if(!Number.isSafeInteger(p.coins)||p.coins<STARTER_PRICE)return {ok:false,reason:'coins'};const pet=newCreature(def);p.coins-=STARTER_PRICE;p.creatures[pet.instanceId]=pet;p.pet=pet;return {ok:true,creature:pet};}
