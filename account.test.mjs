import test from 'node:test';import assert from 'node:assert/strict';
import handler,{isAdministrator,sameOrigin} from './api/account.mjs';
import {ADMIN_EMAIL} from './api/admin-session.mjs';
test('moderator permission requires confirmed provider identity, never local fields',()=>{
 assert.equal(isAdministrator({id:'a',email:ADMIN_EMAIL,email_confirmed_at:'date'}),true);
 assert.equal(isAdministrator({id:'a',email:ADMIN_EMAIL}),false);
 assert.equal(isAdministrator({id:'a',email:'other@educarex.es',email_confirmed_at:'date',role:'admin'}),false);
 assert.equal(isAdministrator({id:'a',email:ADMIN_EMAIL+'.attacker.test',email_confirmed_at:'date'}),false);
 assert.equal(isAdministrator(null),false);
});
test('cross-origin writes are rejected',()=>{
 assert.equal(sameOrigin({headers:{origin:'https://verbquest.vercel.app',host:'verbquest.vercel.app'}}),true);
 assert.equal(sameOrigin({headers:{origin:'https://attacker.test',host:'verbquest.vercel.app'}}),false);
 assert.equal(sameOrigin({headers:{host:'verbquest.vercel.app'}}),false);
});
test('unauthenticated requests never reach profile writes',async()=>{
 const oldUrl=process.env.SUPABASE_URL,oldKey=process.env.SUPABASE_ANON_KEY;
 process.env.SUPABASE_URL='https://example.test';process.env.SUPABASE_ANON_KEY='public';
 let code,output;const res={setHeader(){},status(n){code=n;return this;},json(v){output=v;return this;}};
 try{await handler({method:'POST',query:{mode:'save'},headers:{origin:'https://verbquest.vercel.app',host:'verbquest.vercel.app'},body:{profile:{id:'fake',role:'admin'}}},res);assert.equal(code,401);assert.ok(output.error);}finally{if(oldUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldUrl;if(oldKey===undefined)delete process.env.SUPABASE_ANON_KEY;else process.env.SUPABASE_ANON_KEY=oldKey;}
});
test('verified student cannot edit another profile or change the season even with a forged admin field',async()=>{
 const oldFetch=globalThis.fetch,oldUrl=process.env.SUPABASE_URL,oldKey=process.env.SUPABASE_ANON_KEY;
 process.env.SUPABASE_URL='https://example.test';process.env.SUPABASE_ANON_KEY='public';
 let calls=0;globalThis.fetch=async()=>{calls++;return {ok:true,json:async()=>({id:'11111111-1111-4111-8111-111111111111',email:'student@educarex.es',email_confirmed_at:'date'})};};
 const session=Buffer.from(JSON.stringify({access:'fake-test-access'})).toString('base64url');
 const req={method:'POST',headers:{origin:'https://verbquest.vercel.app',host:'verbquest.vercel.app',cookie:`__Host-vq-session=${session}`},body:{profile:{id:'22222222-2222-4222-8222-222222222222'},administrator:true}};
 let code;const res={setHeader(){},status(n){code=n;return this;},json(){return this;}};
 try{for(const mode of ['save','config','delete']){await handler({...req,query:{mode}},res);assert.equal(code,403);}assert.equal(calls,3);}finally{globalThis.fetch=oldFetch;if(oldUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldUrl;if(oldKey===undefined)delete process.env.SUPABASE_ANON_KEY;else process.env.SUPABASE_ANON_KEY=oldKey;}
});
