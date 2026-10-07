export const DEFAULT_PREFERENCES=Object.freeze({language:'en',music:8,sound:100});
export function normalisePreferences(value={}){const volume=(v,f)=>Number.isFinite(Number(v))?Math.max(0,Math.min(100,Number(v))):f;return {language:value.language==='es'?'es':'en',music:volume(value.music,8),sound:volume(value.sound,100)};}
