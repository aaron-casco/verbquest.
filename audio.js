// Original, quiet ambient sound generated locally; no recordings or external requests.
let context,musicBus,sfxBus,voices=[],started=false,preferences={music:12,sound:25};
export function setAudioPreferences(value){preferences=value;if(context){musicBus.gain.setTargetAtTime(value.music/100*.045,context.currentTime,.3);sfxBus.gain.setTargetAtTime(value.sound/100*.07,context.currentTime,.05);}}
function init(){if(started)return;const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;context=new AudioContext();musicBus=context.createGain();sfxBus=context.createGain();musicBus.connect(context.destination);sfxBus.connect(context.destination);musicBus.gain.value=0;sfxBus.gain.value=0;
 // A soft C-major/add-nine pad, with gently moving amplitudes and no sharp beats.
 for(const [i,freq] of [130.81,196,261.63,293.66,329.63].entries()){
  const osc=context.createOscillator(),gain=context.createGain(),lfo=context.createOscillator(),depth=context.createGain();osc.type='sine';osc.frequency.value=freq;gain.gain.value=.1;lfo.frequency.value=.025+i*.007;depth.gain.value=.035;lfo.connect(depth);depth.connect(gain.gain);osc.connect(gain);gain.connect(musicBus);osc.start();lfo.start();voices.push(osc,lfo);
 }started=true;setAudioPreferences(preferences);}
export async function unlockAudio(){try{init();if(context&&context.state==='suspended'&&!document.hidden)await context.resume();}catch{}}
export function playClick(){if(!context||context.state!=='running'||!preferences.sound)return;const osc=context.createOscillator(),gain=context.createGain(),now=context.currentTime;osc.type='sine';osc.frequency.setValueAtTime(620,now);osc.frequency.exponentialRampToValueAtTime(420,now+.055);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.3,now+.006);gain.gain.exponentialRampToValueAtTime(.001,now+.07);osc.connect(gain);gain.connect(sfxBus);osc.start(now);osc.stop(now+.08);osc.onended=()=>{osc.disconnect();gain.disconnect();};}
document.addEventListener('visibilitychange',()=>{if(!context)return;if(document.hidden)context.suspend().catch(()=>{});else if(started)context.resume().catch(()=>{});});
