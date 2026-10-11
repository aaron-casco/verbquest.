export const INSTALL_COOLDOWN=3*24*60*60*1000;
export function shouldSuggestInstall({mobile,installed,lastShown=0,now=Date.now()}){return mobile&&!installed&&now-Number(lastShown||0)>=INSTALL_COOLDOWN;}
export function isMobileDevice(nav=navigator){return /Android|iPhone|iPad|iPod/i.test(nav.userAgent)||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1);}
export function isInstalled(){return matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;}

export async function detectInstalledApp(nav=navigator,manifestUrl=new URL('./manifest.webmanifest',location.href).href){
 if(typeof nav.getInstalledRelatedApps!=='function')return false;
 try{return (await nav.getInstalledRelatedApps()).some(app=>app.platform==='webapp'&&app.url&&new URL(app.url,manifestUrl).href===manifestUrl);}catch{return false;}
}
export function installInstructions(nav=navigator,language='en'){
 const en=language!=='es',ua=nav.userAgent||'',ios=/iPhone|iPad|iPod/i.test(ua)||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1);
 if(/Instagram|FBAN|FBAV|; wv\)/i.test(ua))return en?'Open this page in Chrome or Safari outside this app, then use Install app or Add to Home Screen.':'Abre esta página en Chrome o Safari fuera de esta aplicación. Después usa Instalar aplicación o Añadir a pantalla de inicio.';
 if(ios)return en?'Open VerbQuest in Safari → Share → Add to Home Screen → Add. Then open VerbQuest from its new icon.':'Abre VerbQuest en Safari → Compartir → Añadir a pantalla de inicio → Añadir. Después abre VerbQuest desde su nuevo icono.';
 if(/Android/i.test(ua))return en?'In Chrome: open the ⋮ menu → Install app or Add to Home screen → Install. If unavailable, use a normal tab outside private browsing and reload.':'En Chrome: abre el menú ⋮ → Instalar aplicación o Añadir a pantalla de inicio → Instalar. Si no aparece, usa una pestaña normal fuera del modo privado y recarga.';
 return en?'In Chrome or Edge: click the install icon in the address bar, or open the browser menu → Install VerbQuest. In Safari on Mac: File → Add to Dock, if available.':'En Chrome o Edge: pulsa el icono de instalación de la barra de direcciones, o abre el menú del navegador → Instalar VerbQuest. En Safari de Mac: Archivo → Añadir al Dock, si está disponible.';
}
