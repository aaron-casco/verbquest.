export async function account(mode,data){
 const response=await fetch(`/api/account?mode=${encodeURIComponent(mode)}`,{credentials:'same-origin',cache:'no-store',...(data?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:{})});
 const result=await response.json().catch(()=>({error:'Respuesta del servidor no válida.'}));
 if(!response.ok){const error=new Error(result.error||'No se pudo completar la acción.');error.status=response.status;throw error;}return result;
}
