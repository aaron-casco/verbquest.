import test from 'node:test';
import assert from 'node:assert/strict';
import {matches,grade,parseList,recordReview,seeded,shuffle} from './core.js';
test('Acepta variantes individuales, mayúsculas y espacios; rechaza variantes ajenas y blancos',()=>{
  assert(matches(' WERE ','was/were'));assert(matches('was / were','was/were'));assert(!matches('was/wrong','was/were'));assert(!matches('','been'));assert(!matches('went','gone'));
});
test('Tres fallos aprueban, cuatro suspenden; cuenta cada palabra y no las casillas dadas',()=>{
  const rows=[{verb:{id:'a',forms:['a','b','c']},given:0},{verb:{id:'d',forms:['d','e','f']},given:0}];
  const three=grade(rows,{'a:1':'b'},3);assert.equal(three.errors,3);assert.equal(three.passed,true);
  const four=grade(rows,{},3);assert.equal(four.errors,4);assert.equal(four.passed,false);assert.equal(four.total,4);
  assert.equal(grade(rows,{'a:1':'b','a:2':'c','d:1':'e','d:2':'f'},0).passed,true);
});
test('Repaso: un error reinicia la racha y adelanta la revisión',()=>{
  const p={reviews:{}};recordReview(p,'x',1,true,0);assert.equal(p.reviews['x:1'].due,86400000);recordReview(p,'x',1,true,0);assert.equal(p.reviews['x:1'].due,3*86400000);recordReview(p,'x',1,false,0);assert.equal(p.reviews['x:1'].streak,0);assert.equal(p.reviews['x:1'].due,600000);
});
test('Importador valida bloques y mantiene variantes y duplicados de infinitivo',()=>{
  const text='a;b;c;1\na;d;e;2\nf;g;h/i;3\nj;k;l;4';const v=parseList(text);assert.equal(v.length,4);assert.notEqual(v[0].id,v[1].id);assert.equal(v[2].forms[2],'h/i');assert.throws(()=>parseList('a;b;c;5'));assert.throws(()=>parseList('a;b;c;1'));
});
test('La semilla diaria ofrece la misma ronda a cada perfil',()=>{assert.deepEqual(shuffle([1,2,3,4,5],seeded('day')),shuffle([1,2,3,4,5],seeded('day')));});
import {DEMO_VERBS} from './data.js';
import {distractors,makeQuestion,seasonRanks,rewardFor,latestErrors} from './gameplay.js';
import {examples} from './tutor.js';
test('Corrección flexible no confunde variantes con otras palabras o frases',()=>{
 for(const a of ['was were','WAS / WERE','was, were','was or were','was y were','was;were'])assert(matches(a,'was/were'),a);
 assert(matches('  WOKE   UP ','woke up'));assert(!matches('woke','woke up'));assert(!matches('was were went','was/were'));assert(!matches('lent lens','lent'));
});
test('Lista suministrada: 105 entradas, bloques íntegros y dos sentidos de lie',()=>{
 assert.equal(DEMO_VERBS.length,105);assert.deepEqual([0,1,2,3].map(b=>DEMO_VERBS.filter(v=>v.block===b).length),[25,28,25,27]);assert.equal(new Set(DEMO_VERBS.map(v=>v.id)).size,105);
 assert.deepEqual(DEMO_VERBS.filter(v=>v.forms[0]==='lie').map(v=>v.forms),[['lie','lay','lain'],['lie','lied','lied']]);assert(DEMO_VERBS.some(v=>v.forms[0]==='wake up'));
});
test('Distractores cercanos: 3 opciones distintas y ninguna variante correcta',()=>{
 for(const v of DEMO_VERBS)for(let col=0;col<3;col++){const opts=distractors(v,col,DEMO_VERBS,seeded(v.id+col));assert.equal(opts.length,3);assert.equal(new Set(opts).size,3);assert(opts.every(a=>!matches(a,v.forms[col])));}
});
test('Competitivo convierte cualquiera de las tres formas a otra distinta',()=>{
 const pairs=new Set();const rand=seeded('six-pairs');for(let i=0;i<200;i++){const q=makeQuestion(DEMO_VERBS[24],'single',DEMO_VERBS,rand);assert.notEqual(q.given,q.col);pairs.add(q.given+':'+q.col);}assert.equal(pairs.size,6);
});
test('Temporadas aisladas: un acierto adicional gana aunque tarde más',()=>{
 const profiles=[{id:'1',attempts:[{season:'s',correct:40,time:420,total:40},{season:'old',correct:100,time:1}]},{id:'2',attempts:[{season:'s',correct:39,time:360,total:40}]},{id:'3',attempts:[{season:'s',correct:40,time:421,total:40},{season:'s',correct:40,time:419,total:40}]}];assert.deepEqual(seasonRanks(profiles,'s').map(r=>r.p.id),['3','1','2']);
});
test('Monedas por acierto: 5 práctica, 2 repaso, 0 competitivo; solo errores recientes',()=>{
 assert.equal(rewardFor('practice',25),125);assert.equal(rewardFor('review',2),4);assert.equal(rewardFor('arena',25),0);
 for(const [game,practice,review] of [['recall',5,2],['portals',3,2],['chain',2,1],['detective',3,2],['roulette',5,3]]){assert.equal(rewardFor('practice',7,game),7*practice);assert.equal(rewardFor('review',3,game),3*review);assert.equal(rewardFor('initial',7,game),0);assert.equal(rewardFor('arena',7,game),0);assert.equal(rewardFor('practice',0,game),0);}
 const p={reviews:{'old:1':{wrong:500}},lastErrors:[{verb:'be',col:1}]};assert.deepEqual(latestErrors(p,DEMO_VERBS),p.lastErrors);
});
test('Biblioteca incluye 9 ejemplos para cada entrada de la lista',()=>{for(const v of DEMO_VERBS){const groups=examples(v);assert.equal(groups.length,3);assert(groups.every(g=>g.sentences.length===3));}});

test('Cut distractors model false regular forms without unrelated cat',()=>{const cut=DEMO_VERBS.find(v=>v.forms[0]==='cut');for(const col of [1,2]){const choices=distractors(cut,col,DEMO_VERBS);assert(!choices.includes('cat'));assert(choices.includes('cuted'));assert(choices.includes('cutted'));}});

import {examReward,examReviewQuestions} from './gameplay.js';
test('Simulacro: premios por fallos y repaso de cada palabra fallada',()=>{
 for(const [errors,coins] of [[0,90],[1,85],[2,80],[3,75],[4,0],[20,0]])assert.equal(examReward(errors),coins);
 assert.equal(examReward(1,false),0);assert.equal(examReward(-1),0);
 const v=DEMO_VERBS[0],p={lastErrors:[{verb:v.id,col:1},{verb:v.id,col:2}]};
 const qs=examReviewQuestions(p,DEMO_VERBS);assert.equal(qs.length,2);assert.deepEqual(qs.map(q=>q.col),[1,2]);assert(qs.every(q=>q.mode==='single'&&q.given!==q.col));assert.equal(rewardFor('review',2,'exam'),4);
});
