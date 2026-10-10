import {PETS} from './data.js';
export const LEGENDARY_WAIT=24*60*60*1000;
export const fixedPalette=pet=>!!PETS.find(d=>d.id===pet?.species)?.egg;
export const timedLegendary=pet=>['selene','leora'].includes(pet?.species);
export function legendaryRemaining(pet,now=Date.now()){if(!timedLegendary(pet)||pet.stage>=1)return 0;const acquired=Date.parse(pet.acquiredAt||'');return Number.isFinite(acquired)?Math.max(0,acquired+LEGENDARY_WAIT-now):LEGENDARY_WAIT;}
export function timerLabel(ms){const seconds=Math.ceil(Math.max(0,ms)/1000);return [Math.floor(seconds/3600),Math.floor(seconds%3600/60),seconds%60].map(n=>String(n).padStart(2,'0')).join(':');}
export function evolveLegendaryLocal(p,now=Date.now()){if(!timedLegendary(p.pet)||p.pet.stage!==0||legendaryRemaining(p.pet,now)>0)return false;p.pet.stage=1;return true;}
