import {ADMIN_EMAIL} from './admin-session.mjs';

export function isAdministrator(user){return !!user?.id&&!!user.email_confirmed_at&&String(user.email).toLowerCase()===ADMIN_EMAIL;}
const cookieName='__Host-vq-session';
function cookie(value,age=3600){return `${cookieName}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;}
function sessionCookie(req){try{return JSON.parse(Buffer.from((req.headers.cookie||'').split('; ').find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1)||'','base64url').toString());}catch{return {};}}
export function sameOrigin(req){try{return new URL(req.headers.origin).host===req.headers.host;}catch{return false;}}
export function publicFailure(e,mode){
 if(e.code==='email_not_confirmed')return {status:403,error:'Confirma tu correo antes de iniciar sesión. Revisa el mensaje de Supabase.'};
 if(e.code==='invalid_credentials'||(mode==='login'&&[400,422].includes(e.status)))return {status:401,error:'El correo o la contraseña no coinciden. Usa la contraseña de tu cuenta de Supabase.'};
 if(e.status===429)return {status:429,error:'Has realizado demasiados intentos. Espera un momento antes de repetir.'};
 if(e.status===401)return {status:401,error:'Tu sesión ha caducado. Vuelve a iniciar sesión.'};
 if(e.status===409||/revision_conflict/.test(e.message))return {status:409,error:'El progreso cambió en otra sesión. Recarga antes de continuar.'};
 if(mode==='signup'&&[400,422].includes(e.status))return {status:400,error:'No se pudo crear la cuenta. Si ya la creaste en Supabase, pulsa «Ya tengo cuenta» e inicia sesión.'};
 return {status:503,error:/vq_|schema cache|does not exist/.test(e.message)?'Falta ejecutar la configuración SQL de VerbQuest en Supabase.':'No se pudo conectar con las cuentas. Reinténtalo.'};
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('Vary','Cookie');
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_ANON_KEY;
 if(!url||!key)return res.status(503).json({error:'La conexión de cuentas no está configurada.'});
 const mode=String(req.query?.mode||'session');
 if(req.method!=='GET'&&req.method!=='POST')return res.status(405).json({error:'Método no permitido.'});
 if(req.method==='POST'&&!sameOrigin(req))return res.status(403).json({error:'Origen no permitido.'});
 let body=req.body||{};if(typeof body==='string'){try{body=JSON.parse(body);}catch{return res.status(400).json({error:'Datos incorrectos.'});}}
 if(Buffer.byteLength(JSON.stringify(body))>300000)return res.status(413).json({error:'Demasiados datos.'});
 async function call(path,{method='GET',data,token,prefer}={}){
  const response=await fetch(url.replace(/\/$/,'')+path,{method,headers:{apikey:key,'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`} :{}),...(prefer?{Prefer:prefer}:{})},...(data?{body:JSON.stringify(data)}:{})});
  const json=await response.json().catch(()=>null);if(!response.ok){const e=new Error(json?.msg||json?.message||json?.error_description||'No se pudo completar la solicitud.');e.status=response.status;e.code=json?.code||json?.error_code;throw e;}return json;
 }
 function setSession(s){res.setHeader('Set-Cookie',cookie(Buffer.from(JSON.stringify({access:s.access_token,refresh:s.refresh_token})).toString('base64url'),60*60*24*7));}
 try{
  if(mode==='login'||mode==='signup'){
   if(req.method!=='POST')return res.status(405).json({error:'Método no permitido.'});
   const email=String(body.email||'').trim().toLowerCase(),password=String(body.password||'');
   if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)||password.length<6||password.length>256)return res.status(400).json({error:'Revisa el correo y la contraseña (mínimo 6 caracteres).'});
   const s=await call(mode==='login'?'/auth/v1/token?grant_type=password':'/auth/v1/signup',{method:'POST',data:{email,password,...(mode==='signup'?{data:{name:String(body.name||'').slice(0,32)}}:{})}});
   if(!s.access_token)return res.status(200).json({confirmationRequired:true});
   setSession(s);return res.status(200).json({user:{id:s.user.id,email:s.user.email},administrator:isAdministrator(s.user)});
  }
  let session=sessionCookie(req),user;
  if(!session.access)return res.status(401).json({error:'Inicia sesión con tu cuenta.'});
  try{user=await call('/auth/v1/user',{token:session.access});}catch(e){if(e.status!==401&&e.status!==403)throw e;if(!session.refresh)throw e;const s=await call('/auth/v1/token?grant_type=refresh_token',{method:'POST',data:{refresh_token:session.refresh}});setSession(s);session={access:s.access_token,refresh:s.refresh_token};user=await call('/auth/v1/user',{token:session.access});}
  if(!user.email_confirmed_at)return res.status(403).json({error:'Confirma tu correo antes de entrar.'});
  if(mode==='logout'){if(req.method!=='POST')return res.status(405).json({error:'Método no permitido.'});res.setHeader('Set-Cookie',cookie('',0));await call('/auth/v1/logout',{method:'POST',token:session.access}).catch(()=>{});return res.status(200).json({ok:true});}
  if(mode==='session')return res.status(200).json({user:{id:user.id,email:user.email},administrator:isAdministrator(user)});
  const admin=isAdministrator(user);
  if(mode==='state'&&req.method==='GET'){
   const own=await call(`/rest/v1/vq_profiles?user_id=eq.${user.id}&select=state,revision`,{token:session.access});
   const config=await call('/rest/v1/vq_config?id=eq.1&select=state,revision',{token:session.access});
   const profiles=admin?await call('/rest/v1/vq_profiles?select=user_id,state,revision',{token:session.access}):await call('/rest/v1/rpc/vq_public_profiles',{method:'POST',data:{},token:session.access});
   return res.status(200).json({own:own[0]||null,config:config[0],profiles,administrator:admin,user:{id:user.id,email:user.email}});
  }
  if(mode==='save'&&req.method==='POST'){
   const id=String(body.profile?.id||'');if(id!==user.id&&!admin)return res.status(403).json({error:'No tienes permisos sobre ese perfil.'});
   if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({error:'Perfil incorrecto.'});
   const output=await call('/rest/v1/rpc/vq_save_profile',{method:'POST',token:session.access,data:{target_id:id,next_state:body.profile,expected_revision:Number(body.revision)||0}});
   return res.status(200).json({revision:output});
  }
  if(mode==='claim'&&req.method==='POST')return res.status(200).json({profile:await call('/rest/v1/rpc/vq_claim_award',{method:'POST',token:session.access,data:{award_id:String(body.id||'')}})});
  if(mode==='config'&&req.method==='POST'){
   if(!admin)return res.status(403).json({error:'Necesitas permisos de moderador.'});
   const rows=await call(`/rest/v1/vq_config?id=eq.1&revision=eq.${Number(body.revision)||0}`,{method:'PATCH',token:session.access,data:{state:body.config,revision:(Number(body.revision)||0)+1},prefer:'return=representation'});
   if(!rows.length)return res.status(409).json({error:'La configuración cambió en otra sesión. Recarga antes de editar.'});return res.status(200).json({revision:rows[0].revision});
  }
  if(mode==='reset'&&req.method==='POST'){
   if(!admin)return res.status(403).json({error:'Necesitas permisos de moderador.'});
   const all=body.all===true,id=String(body.id||'');
   if(body.confirm!=='REINICIAR')return res.status(400).json({error:'Escribe REINICIAR para confirmar.'});
   if(!all&&(id===user.id||!/^[0-9a-f-]{36}$/i.test(id)))return res.status(400).json({error:'No puedes reiniciar esa cuenta.'});
   const count=await call('/rest/v1/rpc/vq_reset_accounts',{method:'POST',token:session.access,data:{target_id:all?null:id,reset_all:all}});
   return res.status(200).json({count});
  }
  if(mode==='delete'&&req.method==='POST'){
   if(!admin||body.id===user.id)return res.status(403).json({error:'No puedes eliminar ese perfil.'});
   if(!/^[0-9a-f-]{36}$/i.test(String(body.id)))return res.status(400).json({error:'Perfil incorrecto.'});
   // Retain the Auth identity; block and archive progress instead of erasing it.
   return res.status(400).json({error:'Usa Bloquear para conservar el progreso. La eliminación definitiva no está habilitada.'});
  }
  return res.status(404).json({error:'Acción desconocida.'});
 }catch(e){const failure=publicFailure(e,mode);console.warn('account_request_failed',{mode,status:e.status||503,code:e.code||'connection_failure'});return res.status(failure.status).json({error:failure.error});}
}
