export const normalize = s => String(s??'').trim().toLowerCase().replace(/\s+/g,' ');
export const alternatives = s => normalize(s).split('/').map(x=>x.trim());
export function matches(answer,expected) {
  const e=alternatives(expected), raw=normalize(answer);
  if(e.includes(raw))return true;
  let a=raw.split(/\s*(?:[/,;|]|\b(?:or|and|o|y)\b)\s*/).filter(Boolean);
  // Espacios entre variantes como «was were», sin romper «wake up».
  if(a.length===1 && e.length>1 && e.every(x=>!x.includes(' ')))a=raw.split(/\s+/);
  return a.length>0 && a.every(x=>e.includes(x));
}
export function shuffle(items,random=Math.random) {
  const a=[...items]; for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a;
}
export function seeded(seed) {let n=2166136261;for(const c of seed)n=Math.imul(n^c.charCodeAt(0),16777619);return ()=>{n+=0x6D2B79F5;let t=Math.imul(n^n>>>15,1|n);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296;};}
export function grade(rows,answers,maxErrors=3) {
  const cells=rows.flatMap(r=>r.verb.forms.map((expected,i)=>({verb:r.verb.id,col:i,expected,answer:answers[`${r.verb.id}:${i}`]??'',given:i===r.given}))).filter(c=>!c.given);
  cells.forEach(c=>c.correct=matches(c.answer,c.expected));
  const errors=cells.filter(c=>!c.correct).length;
  return {cells,errors,correct:cells.length-errors,total:cells.length,passed:errors<=maxErrors};
}
export const level = xp => 1+Math.floor(Math.max(0,xp)/100);
export function recordReview(profile,verb,col,correct,now=Date.now()) {
  const key=`${verb}:${col}`; const old=profile.reviews[key]??{right:0,wrong:0,streak:0,due:0};
  const streak=correct?old.streak+1:0;
  profile.reviews[key]={right:old.right+(correct?1:0),wrong:old.wrong+(correct?0:1),streak,due:now+(correct?[1,3,7,14,30][Math.min(streak-1,4)]*86400000:600000)};
}
export function parseList(text) {
  const lines=text.trim().split(/\r?\n/).filter(x=>x.trim()); const verbs=[];
  lines.forEach((line,i)=>{
    const cols=line.split(/[;\t|]/).map(x=>x.trim());
    if(i===0 && /infinitivo|base form/i.test(cols[0]))return;
    if((cols.length<4||cols.length>5) || cols.slice(0,3).some(x=>!x) || !/^[1-4]$/.test(cols[3]))throw Error(`Línea ${i+1}: usa infinitivo;pasado;participio;bloque (1–4).`);
    if(cols.slice(0,3).some(x=>! /^[a-zA-Z /'-]+$/.test(x)))throw Error(`Línea ${i+1}: revisa las formas escritas.`);
    const forms=cols.slice(0,3).map(normalize); const id=`${forms[0]}-${verbs.length}`;
    verbs.push({id,forms,block:Number(cols[3])-1,note:(cols[4]||'').slice(0,80)});
  });
  if(!verbs.length)throw Error('La lista está vacía.');
  if([0,1,2,3].some(b=>!verbs.some(v=>v.block===b)))throw Error('Incluye verbos para los cuatro bloques.');
  return verbs;
}
