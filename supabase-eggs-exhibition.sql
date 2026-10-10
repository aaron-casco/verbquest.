-- VerbQuest v11. Execute once in Supabase SQL Editor before deploying.
-- Replaces only the public projection and adds a validation trigger.
-- No UPDATE/DELETE/TRUNCATE: existing progress, attempts and rewards are untouched.
begin;
create or replace function public.vq_public_profiles()
returns table(user_id uuid,state jsonb,revision bigint)
language sql stable security definer set search_path='' as $$
 select p.user_id,jsonb_build_object(
  'id',p.user_id,'name',p.state->'name','pet',p.state->'pet',
  'attempts',p.state->'attempts','blocked',p.state->'blocked',
  'xp',coalesce(p.state->'xp','0'::jsonb),
  'competitiveEnabled',coalesce(p.state->'competitiveEnabled','true'::jsonb),
  'classEligible',lower(u.email) like '%@educarex.es' and u.email_confirmed_at is not null,
  'exhibitionPets',coalesce((select jsonb_agg(pet) from (
    select p.state->'creatures'->x.id as pet
    from jsonb_array_elements_text(case when jsonb_typeof(p.state->'exhibition')='array' then p.state->'exhibition' else '[]'::jsonb end) with ordinality x(id,n)
    where p.state->'creatures' ? x.id order by x.n limit 3
  ) selected),'[]'::jsonb)
 ),0::bigint
 from public.vq_profiles p join auth.users u on u.id=p.user_id
 where coalesce((p.state->>'blocked')::boolean,false)=false and auth.uid() is not null;
$$;
revoke all on function public.vq_public_profiles() from public;
grant execute on function public.vq_public_profiles() to authenticated;
create or replace function public.vq_guard_egg_unlocks() returns trigger
language plpgsql security definer set search_path='' as $$
declare creature record; xp bigint;
begin
 if public.vq_is_admin() then return new; end if;
 xp:=greatest(0,coalesce((new.state->>'xp')::bigint,0));
 for creature in select key,value from jsonb_each(coalesce(new.state->'creatures','{}'::jsonb)) loop
  if tg_op='UPDATE' and old.state->'creatures' ? creature.key then continue; end if;
  if creature.value->>'species' in ('nocti','mora','corvi','umbra','selene') and xp<3900 then raise exception 'egg_level_required'; end if;
  if creature.value->>'species' in ('scali','auri','solis','heli','leora') and xp<7900 then raise exception 'egg_level_required'; end if;
 end loop;
 return new;
end;
$$;
revoke all on function public.vq_guard_egg_unlocks() from public;
drop trigger if exists vq_egg_unlock_guard on public.vq_profiles;
create trigger vq_egg_unlock_guard before insert or update on public.vq_profiles
for each row execute function public.vq_guard_egg_unlocks();
commit;
