// Original, gently played melody generated locally. No external recordings or requests.
let context,musicBus,sfxBus,started=false,preferences={music:8,sound:100};
export function setAudioPreferences(value){preferences=value;if(context){musicBus.gain.setTargetAtTime(value.music/100*.35,context.currentTime,.3);sfxBus.gain.setTargetAtTime(value.sound/100*.07,context.currentTime,.05);}}
async function makeMelody(){
 const Offline=window.OfflineAudioContext||window.webkitOfflineAudioContext;if(!Offline)return;
 const beat=1.1,duration=32*beat,rate=22050,offline=new Offline(1,Math.ceil(duration*rate),rate);
 // Four calm phrases over C, Am, F and G, with breathing spaces between them.
 const phrases=[[76,79,81,79,76,74,72,null],[76,79,81,84,81,79,76,null],[77,81,79,77,76,74,72,null],[74,79,77,74,72,71,72,null]];
 function note(midi,time,length,volume){const frequency=440*Math.pow(2,(midi-69)/12);for(const [harmonic,weight] of [[1,1],[2,.12]]){const osc=offline.createOscillator(),gain=offline.createGain();osc.type='sine';osc.frequency.value=frequency*harmonic;gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume*weight,time+.06);gain.gain.exponentialRampToValueAtTime(.0001,time+length);osc.connect(gain);gain.connect(offline.destination);osc.start(time);osc.stop(time+length+.02);}}
 phrases.forEach((phrase,bar)=>{phrase.forEach((midi,i)=>{if(midi!==null)note(midi,(bar*8+i)*beat,2.2,.17);});const chord=[[48,55,60],[45,52,57],[41,48,53],[43,50,55]][bar];chord.forEach((midi,i)=>note(midi,bar*8*beat+i*.38,3.6,.055));});
 const buffer=await offline.startRendering(),source=context.createBufferSource();source.buffer=buffer;source.loop=true;source.connect(musicBus);source.start();
}
function init(){if(started)return;const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;context=new AudioContext();musicBus=context.createGain();sfxBus=context.createGain();musicBus.connect(context.destination);sfxBus.connect(context.destination);musicBus.gain.value=0;sfxBus.gain.value=0;started=true;setAudioPreferences(preferences);makeMelody().catch(()=>{});}
export async function unlockAudio(){try{init();if(context&&context.state==='suspended'&&!document.hidden)await context.resume();}catch{}}
export function playClick(){if(!context||context.state!=='running'||!preferences.sound)return;const osc=context.createOscillator(),gain=context.createGain(),now=context.currentTime;osc.type='sine';osc.frequency.setValueAtTime(620,now);osc.frequency.exponentialRampToValueAtTime(420,now+.055);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.3,now+.006);gain.gain.exponentialRampToValueAtTime(.001,now+.07);osc.connect(gain);gain.connect(sfxBus);osc.start(now);osc.stop(now+.08);osc.onended=()=>{osc.disconnect();gain.disconnect();};}
document.addEventListener('visibilitychange',()=>{if(!context)return;if(document.hidden)context.suspend().catch(()=>{});else if(started)context.resume().catch(()=>{});});
