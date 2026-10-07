import test from 'node:test';import assert from 'node:assert/strict';
import handler,{isAdministrator,sameOrigin,publicFailure} from './api/account.mjs';
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
test('provider credential and confirmation failures do not masquerade as network outages',()=>{
 assert.equal(publicFailure({status:400,code:'invalid_credentials',message:'Invalid login credentials'},'login').status,401);
 assert.equal(publicFailure({status:400,code:'email_not_confirmed',message:'Email not confirmed'},'login').status,403);
 assert.equal(publicFailure({status:429,message:'rate limit'},'login').status,429);
 assert.equal(publicFailure({status:422,message:'invalid signup'},'signup').status,400);
 assert.equal(publicFailure(new Error('fetch failed'),'login').status,503);
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
 const req={method:'POST',headers:{origin:'https://verbquest.vercel.app',host:'verbquest.vercel.app',cookie:`__Host-vq-session=${session}`},body:{profile:{id:'22222222-2222-4222-8222-222222222222'},administrator:true,self:true,confirm:'REINICIAR'}};
 let code;const res={setHeader(){},status(n){code=n;return this;},json(){return this;}};
 try{for(const mode of ['save','config','delete','reset','season-close']){await handler({...req,query:{mode}},res);assert.equal(code,403);}assert.equal(calls,5);}finally{globalThis.fetch=oldFetch;if(oldUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldUrl;if(oldKey===undefined)delete process.env.SUPABASE_ANON_KEY;else process.env.SUPABASE_ANON_KEY=oldKey;}
});
test('Moderator self reset requires confirmation and uses the progress-only RPC',async()=>{
 const oldFetch=globalThis.fetch,oldUrl=process.env.SUPABASE_URL,oldKey=process.env.SUPABASE_ANON_KEY;process.env.SUPABASE_URL='https://example.test';process.env.SUPABASE_ANON_KEY='public';const calls=[];
 globalThis.fetch=async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>url.endsWith('/auth/v1/user')?{id:'11111111-1111-4111-8111-111111111111',email:'acascog01@educarex.es',email_confirmed_at:'date'}:null};};
 const session=Buffer.from(JSON.stringify({access:'test'})).toString('base64url'),req={method:'POST',query:{mode:'reset'},headers:{origin:'https://verbquest.vercel.app',host:'verbquest.vercel.app',cookie:`__Host-vq-session=${session}`}};let code,output;const res={setHeader(){},status(n){code=n;return this;},json(v){output=v;return this;}};
 try{await handler({...req,body:{self:true}},res);assert.equal(code,400);assert.equal(calls.length,1);await handler({...req,body:{self:true,confirm:'REINICIAR'}},res);assert.equal(code,200);assert.equal(output.self,true);assert(calls.at(-1).url.endsWith('/rpc/vq_reset_moderator_progress'));assert.equal(calls.at(-1).options.method,'POST');assert.equal(calls.some(c=>c.url.includes('/auth/v1/admin')),false);}finally{globalThis.fetch=oldFetch;if(oldUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldUrl;if(oldKey===undefined)delete process.env.SUPABASE_ANON_KEY;else process.env.SUPABASE_ANON_KEY=oldKey;}
});

test('Season reward claim uses authenticated identity and ignores client prize amounts',async()=>{
 const oldFetch=globalThis.fetch,oldUrl=process.env.SUPABASE_URL,oldKey=process.env.SUPABASE_ANON_KEY;
 process.env.SUPABASE_URL='https://example.test';process.env.SUPABASE_ANON_KEY='public';const calls=[];
 globalThis.fetch=async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>url.endsWith('/auth/v1/user')?{id:'11111111-1111-4111-8111-111111111111',email:'student@educarex.es',email_confirmed_at:'date'}:{amount:75,position:6}};};
 const session=Buffer.from(JSON.stringify({access:'test'})).toString('base64url');let code,output;
 const req={method:'POST',query:{mode:'season-claim'},headers:{origin:'https://verbquest.vercel.app',host:'verbquest.vercel.app',cookie:`__Host-vq-session=${session}`},body:{id:'s1',amount:500,user_id:'another'}};
 const res={setHeader(){},status(n){code=n;return this;},json(v){output=v;return this;}};
 try{await handler(req,res);assert.equal(code,200);assert.equal(output.amount,75);assert.deepEqual(JSON.parse(calls.at(-1).options.body),{season_id:'s1'});assert(calls.at(-1).url.endsWith('/rpc/vq_claim_season_reward'));}finally{globalThis.fetch=oldFetch;if(oldUrl===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=oldUrl;if(oldKey===undefined)delete process.env.SUPABASE_ANON_KEY;else process.env.SUPABASE_ANON_KEY=oldKey;}
});
