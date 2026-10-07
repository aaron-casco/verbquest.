export const DEFAULT_PREFERENCES=Object.freeze({language:'en',music:12,sound:25});
export function normalisePreferences(value={}){const volume=(v,f)=>Number.isFinite(Number(v))?Math.max(0,Math.min(100,Number(v))):f;return {language:value.language==='es'?'es':'en',music:volume(value.music,12),sound:volume(value.sound,25)};}
