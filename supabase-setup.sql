-- Ejecutar una vez en SQL Editor. Conserva tablas y perfiles existentes.
begin;
create or replace function public.vq_is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from auth.users where id=auth.uid() and lower(email)='acascog01@educarex.es' and email_confirmed_at is not null);
$$;
revoke all on function public.vq_is_admin() from public;
grant execute on function public.vq_is_admin() to authenticated;
create table if not exists public.vq_profiles(user_id uuid primary key references auth.users(id),state jsonb not null,revision bigint not null default 1);
create table if not exists public.vq_config(id integer primary key check(id=1),state jsonb not null,revision bigint not null default 1);
alter table public.vq_profiles enable row level security;
alter table public.vq_config enable row level security;
drop policy if exists vq_profile_read on public.vq_profiles;
create policy vq_profile_read on public.vq_profiles for select to authenticated using(user_id=auth.uid() or public.vq_is_admin());
drop policy if exists vq_config_read on public.vq_config;
create policy vq_config_read on public.vq_config for select to authenticated using(true);
drop policy if exists vq_config_update on public.vq_config;
create policy vq_config_update on public.vq_config for update to authenticated using(public.vq_is_admin()) with check(public.vq_is_admin());
revoke all on public.vq_profiles,public.vq_config from anon,authenticated;
grant select on public.vq_profiles,public.vq_config to authenticated;
grant update on public.vq_config to authenticated;
create or replace function public.vq_public_profiles() returns table(user_id uuid,state jsonb,revision bigint) language sql stable security definer set search_path='' as $$
 select p.user_id,jsonb_build_object('id',p.user_id,'name',p.state->'name','pet',p.state->'pet','attempts',p.state->'attempts','blocked',p.state->'blocked'),0::bigint from public.vq_profiles p where coalesce((p.state->>'blocked')::boolean,false)=false and auth.uid() is not null;
$$;
revoke all on function public.vq_public_profiles() from public;
grant execute on function public.vq_public_profiles() to authenticated;
create or replace function public.vq_save_profile(target_id uuid,next_state jsonb,expected_revision bigint) returns bigint language plpgsql security definer set search_path='' as $$
declare old_state jsonb; old_revision bigint; email_address text; admin boolean;
begin
 if auth.uid() is null then raise exception 'authentication_required'; end if;
 admin:=public.vq_is_admin();
 if target_id<>auth.uid() and not admin then raise exception 'permission_denied'; end if;
 select email into email_address from auth.users where id=target_id and email_confirmed_at is not null;
 if email_address is null then raise exception 'confirmation_required'; end if;
 if next_state->>'id'<>target_id::text or jsonb_typeof(next_state)<>'object' then raise exception 'invalid_profile'; end if;
 select state,revision into old_state,old_revision from public.vq_profiles where user_id=target_id for update;
 if old_revision is null then
  if expected_revision<>0 then raise exception 'revision_conflict'; end if;
  next_state:=jsonb_set(jsonb_set(next_state,'{awards}','[]'::jsonb),'{blocked}','false'::jsonb);
  insert into public.vq_profiles(user_id,state,revision) values(target_id,jsonb_set(next_state,'{email}',to_jsonb(email_address)),1);
  return 1;
 end if;
 if old_revision<>expected_revision then raise exception 'revision_conflict'; end if;
 if not admin then
  if coalesce((old_state->>'blocked')::boolean,false) then raise exception 'profile_blocked'; end if;
  -- An ordinary save cannot create awards or alter the moderator's block flag.
  if coalesce(next_state->'awards','[]'::jsonb)<>coalesce(old_state->'awards','[]'::jsonb) then raise exception 'award_requires_claim'; end if;
  next_state:=jsonb_set(next_state,'{blocked}',coalesce(old_state->'blocked','false'::jsonb));
 end if;
 update public.vq_profiles set state=jsonb_set(next_state,'{email}',to_jsonb(email_address)),revision=old_revision+1 where user_id=target_id;
 return old_revision+1;
end;
$$;
revoke all on function public.vq_save_profile(uuid,jsonb,bigint) from public;
grant execute on function public.vq_save_profile(uuid,jsonb,bigint) to authenticated;
create or replace function public.vq_claim_award(award_id text) returns jsonb language plpgsql security definer set search_path='' as $$
declare s jsonb; a jsonb; updated jsonb:='[]'::jsonb; amount integer:=0;
begin
 select state into s from public.vq_profiles where user_id=auth.uid() for update;
 if s is null or coalesce((s->>'blocked')::boolean,false) then raise exception 'permission_denied'; end if;
 for a in select value from jsonb_array_elements(coalesce(s->'awards','[]'::jsonb)) loop
  if a->>'id'=award_id and (a->>'receivedAt') is null then amount:=(a->>'amount')::integer;a:=jsonb_set(a,'{receivedAt}',to_jsonb(now()));end if;
  updated:=updated||jsonb_build_array(a);
 end loop;
 s:=jsonb_set(jsonb_set(s,'{awards}',updated),'{coins}',to_jsonb(coalesce((s->>'coins')::integer,0)+amount));
 update public.vq_profiles set state=s,revision=revision+1 where user_id=auth.uid();return s;
end;
$$;
revoke all on function public.vq_claim_award(text) from public;
grant execute on function public.vq_claim_award(text) to authenticated;
insert into public.vq_config(id,state) values(1,'{"season":{"id":"october-2026-7","block":0,"label":"7 de octubre","createdAt":"2026-10-06T00:00:00Z"},"archives":[],"settings":{"maxErrors":3}}') on conflict(id) do nothing;
commit;
