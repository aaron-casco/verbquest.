import {EXAMS} from './data.js';
export function activeExam(season){return EXAMS.find(e=>e.block===Number(season?.block))||EXAMS[0];}
export function seasonReward(position){return Number.isInteger(position)&&position>0?([500,400,300,200,200][position-1]??75):0;}
export function archiveReward(archive,userId){const place=archive.ranks.findIndex(r=>r.id===userId)+1;return archive.rewardVersion===1?seasonReward(place):0;}
export function examDateLabel(exam,language='es'){return new Intl.DateTimeFormat(language==='en'?'en-GB':'es-ES',{day:'numeric',month:'long',timeZone:'Europe/Madrid'}).format(new Date(exam.date+'T12:00:00Z'));}
export function examCountdown(exam,today,language='es'){const days=Math.round((Date.parse(exam.date+'T12:00:00Z')-Date.parse(today+'T12:00:00Z'))/86400000);return language==='en'?(days===0?'Today':days===1?'Tomorrow':days===7?'In one week':days>0?`In ${days} days`:'Scheduled exam'):(days===0?'Hoy':days===1?'Mañana':days===7?'Dentro de una semana':days>0?`Dentro de ${days} días`:'Examen seleccionado');}

export function competitiveAllowed(profile){return profile?.competitiveEnabled!==false;}
