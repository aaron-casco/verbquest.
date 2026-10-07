-- Ejecutar una vez en SQL Editor antes de publicar el parche.
-- No reinicia cuentas, monedas ni progreso.
begin;
create table if not exists public.vq_season_rewards (
 season_id text not null, user_id uuid not null references auth.users(id) on delete cascade,
 position integer not null check(position>0), amount integer not null check(amount in(500,400,300,200,75)),
 claimed_at timestamptz, primary key(season_id,user_id)
);
alter table public.vq_season_rewards enable row level security;
drop policy if exists vq_season_rewards_read on public.vq_season_rewards;
create policy vq_season_rewards_read on public.vq_season_rewards for select to authenticated using(user_id=auth.uid());
revoke all on public.vq_season_rewards from public,anon,authenticated;
grant select on public.vq_season_rewards to authenticated;
create or replace function public.vq_close_season(expected_revision bigint,next_block integer,finish_only boolean default false) returns jsonb
language plpgsql security definer set search_path='' as $$
declare cfg jsonb; rev bigint; sid text; ranks jsonb; item jsonb; pos integer:=0; amount integer; label text; next_season jsonb;
begin
 if not public.vq_is_admin() then raise exception 'permission_denied'; end if;
 if next_block is null or next_block not between 0 and 3 then raise exception 'invalid_block'; end if;
 select state,revision into cfg,rev from public.vq_config where id=1 for update;
 if rev<>expected_revision then raise exception 'revision_conflict'; end if;
 sid:=cfg#>>'{season,id}';
 if sid is null then raise exception 'missing_season'; end if;
 if not coalesce((cfg#>>'{season,closed}')::boolean,false) then
  if not finish_only and (cfg#>>'{season,block}')::integer=next_block then raise exception 'same_season'; end if;
  -- Snapshot each player's best completed round, then sort by accuracy and time.
  with best as (
   select p.user_id,p.state,b.a from public.vq_profiles p cross join lateral (
    select a from jsonb_array_elements(coalesce(p.state->'attempts','[]'::jsonb)) a
    where a->>'season'=sid and not coalesce((a->>'inProgress')::boolean,false) and not coalesce((a->>'abandoned')::boolean,false)
     and (a->>'total')::integer>0 and (a->>'correct')::integer between 0 and (a->>'total')::integer and (a->>'time')::numeric>=0
    order by (a->>'correct')::integer desc,(a->>'time')::numeric asc limit 1
   ) b where not coalesce((p.state->>'blocked')::boolean,false)
  ) select coalesce(jsonb_agg(jsonb_build_object('id',user_id,'name',state->'name','pet',state->'pet','correct',a->'correct','total',a->'total','time',a->'time') order by (a->>'correct')::integer desc,(a->>'time')::numeric asc,user_id),'[]'::jsonb) into ranks from best;
  for item in select value from jsonb_array_elements(ranks) loop
   pos:=pos+1;amount:=case pos when 1 then 500 when 2 then 400 when 3 then 300 when 4 then 200 when 5 then 200 else 75 end;
   insert into public.vq_season_rewards(season_id,user_id,position,amount) values(sid,(item->>'id')::uuid,pos,amount) on conflict do nothing;
  end loop;
  cfg:=jsonb_set(cfg,'{archives}',coalesce(cfg->'archives','[]'::jsonb)||jsonb_build_array(jsonb_build_object('id',sid,'label',cfg#>>'{season,label}','ranks',ranks,'closedAt',now(),'rewardVersion',1)));
 elsif finish_only then raise exception 'season_already_closed';
 end if;
 if finish_only then next_season:=jsonb_set(cfg->'season','{closed}','true'::jsonb);
 else
  label:=case next_block when 0 then '7 octubre' when 1 then '14 octubre' when 2 then '21 octubre' else '28 octubre' end;
  next_season:=jsonb_build_object('id',gen_random_uuid(),'block',next_block,'label',label,'createdAt',now(),'closed',false);
 end if;
 cfg:=jsonb_set(cfg,'{season}',next_season);
 update public.vq_config set state=cfg,revision=rev+1 where id=1;
 return jsonb_build_object('revision',rev+1,'config',cfg);
end; $$;
revoke all on function public.vq_close_season(bigint,integer,boolean) from public;
grant execute on function public.vq_close_season(bigint,integer,boolean) to authenticated;
create or replace function public.vq_claim_season_reward(season_id text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare reward public.vq_season_rewards%rowtype; s jsonb; rev bigint; credited integer:=0;
begin
 -- Same lock order as normal profile saves; concurrent claims cannot pay twice.
 select state,revision into s,rev from public.vq_profiles where user_id=auth.uid() for update;
 if s is null or coalesce((s->>'blocked')::boolean,false) then raise exception 'permission_denied'; end if;
 select * into reward from public.vq_season_rewards r where r.season_id=$1 and r.user_id=auth.uid() for update;
 if not found then raise exception 'no_season_reward'; end if;
 if reward.claimed_at is null then
  credited:=reward.amount;
  s:=jsonb_set(s,'{coins}',to_jsonb(coalesce((s->>'coins')::integer,0)+credited));
  update public.vq_profiles set state=s,revision=rev+1 where user_id=auth.uid();rev:=rev+1;
  update public.vq_season_rewards r set claimed_at=now() where r.season_id=$1 and r.user_id=auth.uid();
 end if;
 return jsonb_build_object('profile',s,'revision',rev,'amount',credited,'position',reward.position);
end; $$;
revoke all on function public.vq_claim_season_reward(text) from public;
grant execute on function public.vq_claim_season_reward(text) to authenticated;
-- Protect the access flag and preserve historical rounds. No profile is reset.
create or replace function public.vq_guard_competitive_access() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if public.vq_is_admin() then return new; end if;
 if tg_op='INSERT' then
  new.state:=jsonb_set(new.state,'{competitiveEnabled}','true'::jsonb);
 else
  new.state:=jsonb_set(new.state,'{competitiveEnabled}',coalesce(old.state->'competitiveEnabled','true'::jsonb));
  if old.state->'competitiveEnabled'='false'::jsonb and
   coalesce(new.state->'attempts','[]'::jsonb)<>coalesce(old.state->'attempts','[]'::jsonb) then
   raise exception 'competitive_access_denied';
  end if;
 end if;
 return new;
end; $$;
revoke all on function public.vq_guard_competitive_access() from public,anon,authenticated;
drop trigger if exists vq_guard_competitive_access on public.vq_profiles;
create trigger vq_guard_competitive_access before insert or update on public.vq_profiles for each row execute function public.vq_guard_competitive_access();
commit;
