// Balanced partition: every selected verb appears once, no empty sectors.
export function rouletteGroups(items,sectors){const count=Math.min(items.length,Math.max(1,sectors)),groups=Array.from({length:count},()=>[]);items.forEach((v,i)=>groups[i%count].push(v));return groups;}
