// Vercel Node function: only a verified identity can receive this role.
export const ADMIN_EMAIL='acascog01@educarex.es';
export async function verifiedAdministrator(token,{url,key,fetcher=fetch}={}){
  if(!token||!url||!key)return false;
  try{const response=await fetcher(`${url.replace(/\/$/,'')}/auth/v1/user`,{headers:{apikey:key,Authorization:`Bearer ${token}`}});
    if(!response.ok)return false;const user=await response.json();
    return !!user.id&&!!user.email_confirmed_at&&String(user.email).toLowerCase()===ADMIN_EMAIL;
  }catch{return false;}
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET')return res.status(405).json({error:'method_not_allowed'});
  const token=/^Bearer ([^\s]+)$/.exec(req.headers.authorization||'')?.[1];
  const admin=await verifiedAdministrator(token,{url:process.env.SUPABASE_URL,key:process.env.SUPABASE_ANON_KEY});
  return res.status(admin?200:401).json({administrator:admin});
}
