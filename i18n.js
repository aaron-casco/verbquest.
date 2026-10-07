// UI strings only. English verb answers, player data and input values remain untouched.
import {EN,EN_PATTERNS} from './translations.js';
let language='es';
const originals=new WeakMap(),attributes=new WeakMap();
const escapeRE=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const entries=Object.entries(EN).filter(([a,b])=>a!==b).sort((a,b)=>b[0].length-a[0].length).map(([from,to])=>[from,to,new RegExp('(?<![\\p{L}])'+escapeRE(from)+'(?![\\p{L}])','gu')]);
const patterns=EN_PATTERNS.map(([from,to])=>[new RegExp('^'+from+'$','s'),to]);
export function translateText(value){
 if(language!=='en'||!value.trim())return value;
 if(value.includes('\n'))return value.split('\n').map(translateText).join('\n');
 const leading=value.match(/^\s*/)[0],trailing=value.match(/\s*$/)[0],raw=value.trim();
 if(EN[raw])return leading+EN[raw]+trailing;
 for(const [pattern,to] of patterns)if(pattern.test(raw)){let result=raw.replace(pattern,to);for(const [from,en,pattern] of entries){if(from.length>=4)result=result.replace(pattern,en);}return leading+result+trailing;}
 // Compound text (e.g. form labels or headings split by markup).
 let out=raw;for(const [from,to,pattern] of entries){if(from.length<4)continue;out=out.replace(pattern,to);}
 return leading+out+trailing;
}
export function translatePage(root=document.body){
 if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let node;while(node=walker.nextNode()){
  if(node.parentElement?.closest('script,style,textarea,[data-no-i18n]'))continue;
  const prior=originals.get(node);let source=prior&&node.nodeValue===prior.output?prior.source:node.nodeValue;
  const output=translateText(source);if(output!==node.nodeValue)node.nodeValue=output;originals.set(node,{source,output});
 }
 for(const el of root.querySelectorAll('[placeholder],[aria-label],[title]')){
  if(el.closest('[data-no-i18n]'))continue;
  let saved=attributes.get(el)||{};
  for(const name of ['placeholder','aria-label','title']){const value=el.getAttribute(name);if(value===null)continue;const prior=saved[name],source=prior&&value===prior.output?prior.source:value,output=translateText(source);if(output!==value)el.setAttribute(name,output);saved[name]={source,output};}
  attributes.set(el,saved);
 }
}
export function setLanguage(value){language=value==='en'?'en':'es';document.documentElement.lang=language;translatePage();}
let pending=false;
new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;translatePage();});}).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});
