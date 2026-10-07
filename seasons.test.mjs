import test from 'node:test';
import assert from 'node:assert/strict';
import {EXAMS} from './data.js';
import {competitiveAllowed,activeExam,seasonReward,archiveReward,examDateLabel,examCountdown} from './seasons.js';
import {seasonRanks} from './gameplay.js';
test('Moderator selection controls the date even on 7 October',()=>{for(let block=0;block<4;block++)assert.equal(activeExam({block}).date,EXAMS[block].date);assert.equal(examDateLabel(activeExam({block:1}),'en'),'14 October');assert.equal(examCountdown(EXAMS[1],'2026-10-07','es'),'Dentro de una semana');assert.equal(examCountdown(EXAMS[2],'2026-10-07','en'),'In 14 days');});
test('Rewards are exclusive, completed participants only, and legacy podiums do not pay',()=>{assert.deepEqual([0,1,2,3,4,5,6,30,-1].map(seasonReward),[0,500,400,300,200,200,75,75,0]);const a={ranks:[{id:'a'},{id:'b'}],rewardVersion:1};assert.equal(archiveReward(a,'a'),500);assert.equal(archiveReward(a,'outsider'),0);assert.equal(archiveReward({...a,rewardVersion:undefined},'a'),0);});
test('Accuracy precedes time and unfinished or abandoned attempts cannot earn rewards',()=>{const p=(id,correct,time,extra={})=>({id,attempts:[{season:'s',correct,time,total:25,...extra}]});assert.deepEqual(seasonRanks([p('fast',24,5),p('accurate',25,100),p('abandoned',25,1,{abandoned:true}),p('unfinished',25,1,{inProgress:true}),p('no-round',25,1,{season:'other'})],'s').map(r=>r.p.id),['accurate','fast']);});

test('Existing players keep access and prior scores; denying access never edits their rounds',()=>{const p={attempts:[{season:'s',correct:25,total:25,time:90}]};assert(competitiveAllowed(p));const before=JSON.stringify(p.attempts);p.competitiveEnabled=false;assert.equal(competitiveAllowed(p),false);assert.equal(JSON.stringify(p.attempts),before);assert.equal(seasonRanks([{...p,id:'p'}],'s')[0].best.correct,25);});
