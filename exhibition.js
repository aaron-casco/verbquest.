import {PETS} from './data.js';
export function leaderboardEligible(p){return !p.blocked&&p.competitiveEnabled!==false&&(p.cloudRanking?p.classEligible===true:/@educarex\.es$/i.test(p.email||''));}
export function xpLeaderboard(profiles){return profiles.filter(leaderboardEligible).sort((a,b)=>(Number(b.xp)||0)-(Number(a.xp)||0)||String(a.id).localeCompare(String(b.id)));}
export function exhibitionPets(p){if(p.cloudRanking)return (p.exhibitionPets||[]).slice(0,3).filter(pet=>PETS.some(d=>d.id===pet.species));return (p.exhibition||[]).map(id=>p.creatures?.[id]).filter(Boolean).slice(0,3);}
export function saveExhibition(p,ids){const safe=[...new Set(ids)];if(safe.length!==Math.min(3,Object.keys(p.creatures||{}).length)||safe.some(id=>!p.creatures?.[id]))return false;p.exhibition=safe;p.exhibitionChosen=true;return true;}
