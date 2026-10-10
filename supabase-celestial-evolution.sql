-- VerbQuest V12. Adds acquisition metadata and server-enforced 24-hour evolution.
-- XP, coins, rounds, purchases and existing final stages are preserved.
begin;
create or replace function public.vq_creature_acquired_at(profile_state jsonb,instance_id text)
returns timestamptz language plpgsql stable set search_path='' as $$
declare raw text; acquired timestamptz;
begin
 raw:=profile_state->'creatures'->instance_id->>'acquiredAt';
 if raw is null then
  select r->>'at' into raw from jsonb_array_elements(coalesce(profile_state->'discoveryBatch'->'receipts','[]'::jsonb)) r where r->>'instanceId'=instance_id limit 1;
 end if;
 if raw is null and profile_state->'discovery'->>'instanceId'=instance_id then raw:=profile_state->'discovery'->>'at'; end if;
 begin acquired:=raw::timestamptz;exception when others then acquired:=null;end;
 return least(coalesce(acquired,current_timestamp),current_timestamp);
end;
$$;
revoke all on function public.vq_creature_acquired_at(jsonb,text) from public;
create or replace function public.vq_guard_egg_unlocks() returns trigger
language plpgsql security definer set search_path='' as $$
declare creature record; xp bigint; old_creature jsonb; next_creature jsonb; species text; acquired timestamptz;
begin
 xp:=greatest(0,coalesce((new.state->>'xp')::bigint,0));
 for creature in select key,value from jsonb_each(coalesce(new.state->'creatures','{}'::jsonb)) loop
  species:=creature.value->>'species';old_creature:=null;
  if tg_op='UPDATE' then old_creature:=old.state->'creatures'->creature.key;end if;
  if old_creature is not null and old_creature->>'species' is distinct from species then raise exception 'invalid_creature';end if;
  if old_creature is null and not public.vq_is_admin() then
   if species in ('nocti','mora','corvi','umbra','selene') and xp<3900 then raise exception 'egg_level_required';end if;
   if species in ('scali','auri','solis','heli','leora') and xp<7900 then raise exception 'egg_level_required';end if;
  end if;
  next_creature:=creature.value;
  if species in ('nocti','mora','corvi','umbra','selene') then next_creature:=next_creature||jsonb_build_object('primary','#a780dc','secondary','#ffe5a8');end if;
  if species in ('scali','auri','solis','heli','leora') then next_creature:=next_creature||jsonb_build_object('primary','#efb24c','secondary','#67c9d1');end if;
  if species in ('selene','leora') then
   if coalesce((next_creature->>'stage')::integer,0) not in (0,1) then raise exception 'invalid_creature';end if;
   acquired:=case when old_creature is not null and old_creature->>'species'=species then public.vq_creature_acquired_at(old.state,creature.key) else current_timestamp end;
   next_creature:=next_creature||jsonb_build_object('acquiredAt',acquired);
   if coalesce((next_creature->>'stage')::integer,0)>coalesce((old_creature->>'stage')::integer,0) and not public.vq_is_admin() and current_timestamp<acquired+interval '24 hours' then raise exception 'legendary_not_ready';end if;
  end if;
  if next_creature is distinct from creature.value then new.state:=jsonb_set(new.state,array['creatures',creature.key],next_creature);end if;
  if new.state->'pet'->>'instanceId'=creature.key then new.state:=jsonb_set(new.state,'{pet}',next_creature);end if;
 end loop;
 return new;
end;
$$;
revoke all on function public.vq_guard_egg_unlocks() from public;
drop trigger if exists vq_egg_unlock_guard on public.vq_profiles;
create trigger vq_egg_unlock_guard before insert or update on public.vq_profiles
for each row execute function public.vq_guard_egg_unlocks();
-- A no-op assignment only on affected profiles invokes the trigger and stamps legacy metadata.
-- Revision increases so an old browser cannot overwrite that metadata with a stale snapshot.
update public.vq_profiles
set state=state,revision=revision+1
where exists(select 1 from jsonb_each(coalesce(state->'creatures','{}'::jsonb)) c
 where c.value->>'species' in ('nocti','mora','corvi','umbra','selene','scali','auri','solis','heli','leora')
 and (c.value->>'primary' is distinct from case when c.value->>'species' in ('nocti','mora','corvi','umbra','selene') then '#a780dc' else '#efb24c' end
 or (c.value->>'species' in ('selene','leora') and c.value->>'acquiredAt' is null)));
create or replace function public.vq_evolve_legendary(instance_id text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare saved jsonb; creature jsonb; saved_revision bigint; acquired timestamptz;
begin
 if auth.uid() is null then raise exception 'authentication_required';end if;
 select state,revision into saved,saved_revision from public.vq_profiles where user_id=auth.uid() for update;
 if saved is null or coalesce((saved->>'blocked')::boolean,false) then raise exception 'permission_denied';end if;
 creature:=saved->'creatures'->instance_id;
 if creature is null or creature->>'species' not in ('selene','leora') then raise exception 'invalid_creature';end if;
 if (creature->>'stage')::integer>=1 then return jsonb_build_object('evolved',false,'revision',saved_revision);end if;
 acquired:=public.vq_creature_acquired_at(saved,instance_id);
 if current_timestamp<acquired+interval '24 hours' then raise exception 'legendary_not_ready';end if;
 creature:=creature||jsonb_build_object('stage',1,'acquiredAt',acquired);
 saved:=jsonb_set(saved,array['creatures',instance_id],creature);
 if saved->'pet'->>'instanceId'=instance_id then saved:=jsonb_set(saved,'{pet}',creature);end if;
 update public.vq_profiles set state=saved,revision=revision+1 where user_id=auth.uid();
 return jsonb_build_object('evolved',true,'revision',saved_revision+1);
end;
$$;
revoke all on function public.vq_evolve_legendary(text) from public;
grant execute on function public.vq_evolve_legendary(text) to authenticated;
create or replace function public.vq_admin_evolve_creature(target_id uuid,instance_id text) returns jsonb language plpgsql security definer set search_path='' as $$
declare saved jsonb; creature jsonb; maximum integer; next_stage integer;
begin
 if not public.vq_is_admin() then raise exception 'administrator_required';end if;
 select state into saved from public.vq_profiles where user_id=target_id for update;
 creature:=saved->'creatures'->instance_id;
 if creature is null then raise exception 'invalid_creature';end if;
 if creature->>'species' in ('lumio','nyx','bruma') then maximum:=2;
 elsif creature->>'species' in ('luma','nimbo','gema','vesper','astra','nocti','mora','corvi','umbra','selene','scali','auri','solis','heli','leora') then maximum:=1;
 else raise exception 'invalid_creature';end if;
 next_stage:=least(maximum,coalesce((creature->>'stage')::integer,0)+1);
 if next_stage=coalesce((creature->>'stage')::integer,0) then return jsonb_build_object('evolved',false);end if;
 creature:=creature||jsonb_build_object('stage',next_stage);saved:=jsonb_set(saved,array['creatures',instance_id],creature);
 if saved->'pet'->>'instanceId'=instance_id then saved:=jsonb_set(saved,'{pet}',creature);end if;
 update public.vq_profiles set state=saved,revision=revision+1 where user_id=target_id;
 return jsonb_build_object('evolved',true);
end;$$;
revoke all on function public.vq_admin_evolve_creature(uuid,text) from public;
grant execute on function public.vq_admin_evolve_creature(uuid,text) to authenticated;

commit;
