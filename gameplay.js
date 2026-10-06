import {alternatives,matches,shuffle} from './core.js';
export const FORM_NAMES=['Infinitivo','Pasado simple','Participio pasado'];
export function editDistance(a,b){const row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let prev=row[0];row[0]=i;for(let j=1;j<=b.length;j++){const old=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,prev+(a[i-1]!==b[j-1]));prev=old;}}return row[b.length];}
// Plausible overregularisation and confusion between forms; no arbitrary vowel swaps.
export function distractors(verb,col,verbs,random=Math.random){
 const infinitive=alternatives(verb.forms[0])[0],correct=verb.forms[col],stem=infinitive.replace(/ up$/,''),suffix=infinitive.endsWith(' up')?' up':'',regular=(s)=>s.endsWith('e')?s+'d':/[^aeiou]y$/.test(s)?s.slice(0,-1)+'ied':s+'ed';
 const candidates=[regular(stem)+suffix,stem+stem.at(-1)+'ed'+suffix,stem+'en'+suffix,stem+'ing'+suffix,stem+'s'+suffix,...verb.forms.flatMap(alternatives),stem+'ed'+suffix,stem+'d'+suffix,stem+'n'+suffix,stem+stem.at(-1)+'en'+suffix];
 const credible=[...new Set(candidates)].filter(x=>!matches(x,correct));
 // Prioritise false regular past/participles; other valid forms are grammatical traps.
 return credible.slice(0,3);
}
export function makeQuestion(v,mode,verbs,random=Math.random){
 const col=mode==='single'||mode==='detective'?Math.floor(random()*3):1+Math.floor(random()*2);
 let given=Math.floor(random()*3);if(given===col)given=(given+1)%3;
 const expected=alternatives(v.forms[col])[0],wrong=distractors(v,col,verbs,random);
 return {v,mode,col,given,options:shuffle([expected,...wrong],random),wrong:wrong[0],tokens:shuffle(v.forms.map((f,id)=>({text:alternatives(f)[0],id})),random)};
}
export function seasonRanks(profiles,seasonId){return profiles.filter(p=>!p.blocked).map(p=>({p,best:p.attempts.filter(a=>a.season===seasonId&&!a.inProgress&&!a.abandoned).sort((a,b)=>b.correct-a.correct||a.time-b.time)[0]})).filter(r=>r.best).sort((a,b)=>b.best.correct-a.best.correct||a.best.time-b.best.time||a.p.id.localeCompare(b.p.id));}
export function latestErrors(profile,verbs){return (profile.lastErrors||[]).filter(c=>verbs.some(v=>v.id===c.verb));}
export const COIN_RATES=Object.freeze({recall:[5,2],portals:[3,2],chain:[2,1],detective:[3,2],roulette:[5,3]});
export function rewardFor(type,correct,game='recall'){const rates=COIN_RATES[game]||COIN_RATES.recall;return type==='review'?correct*rates[1]:type==='practice'?correct*rates[0]:0;}

export function examReward(errors,passed=true){return passed&&Number.isInteger(errors)&&errors>=0&&errors<=3?90-5*errors:0;}
export function examReviewQuestions(profile,verbs){return latestErrors(profile,verbs).map(c=>({v:verbs.find(v=>v.id===c.verb),mode:'single',col:c.col,given:(c.col+1)%3}));}
