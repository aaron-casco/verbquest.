export const INSTALL_COOLDOWN=3*24*60*60*1000;
export function shouldSuggestInstall({mobile,installed,lastShown=0,now=Date.now()}){return mobile&&!installed&&now-Number(lastShown||0)>=INSTALL_COOLDOWN;}
export function isMobileDevice(nav=navigator){return /Android|iPhone|iPad|iPod/i.test(nav.userAgent)||(nav.platform==='MacIntel'&&nav.maxTouchPoints>1);}
export function isInstalled(){return matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;}
