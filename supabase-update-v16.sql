-- V16: moderator-only adjustments and notices. No bulk reset or automatic deductions.
begin;
create or replace function public.vq_admin_pet_change(target_id uuid,instance_id text,operation text,reason text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare saved jsonb; creature jsonb; replacement jsonb; count_owned integer;
begin
 if not public.vq_is_admin() then raise exception 'administrator_required';end if;
 if operation not in ('delete','downgrade') or length(trim(reason)) not between 1 and 300 then raise exception 'invalid_adjustment';end if;
 select state into saved from public.vq_profiles where user_id=target_id for update;
 creature:=saved->'creatures'->instance_id;if creature is null then raise exception 'invalid_creature';end if;
 if operation='delete' then
  select count(*) into count_owned from jsonb_object_keys(saved->'creatures');
  if count_owned<=1 then raise exception 'last_creature_required';end if;
  saved:=jsonb_set(saved,'{creatures}',(saved->'creatures')-instance_id);
  if saved->'pet'->>'instanceId'=instance_id then
   select value into replacement from jsonb_each(saved->'creatures') order by key limit 1;
   saved:=jsonb_set(saved,'{pet}',replacement);
  end if;
  saved:=jsonb_set(saved,'{exhibition}',coalesce((select jsonb_agg(e) from jsonb_array_elements(coalesce(saved->'exhibition','[]'::jsonb)) e where e#>>'{}'<>instance_id),'[]'::jsonb));
  if saved->'discovery'->>'instanceId'=instance_id then saved:=saved-'discovery';end if;
  if saved->'discoveryBatch' is not null then
   saved:=jsonb_set(saved,'{discoveryBatch,receipts}',coalesce((select jsonb_agg(r) from jsonb_array_elements(coalesce(saved->'discoveryBatch'->'receipts','[]'::jsonb)) r where r->>'instanceId'<>instance_id),'[]'::jsonb));
  end if;
 else
  creature:=jsonb_set(creature,'{stage}',to_jsonb(greatest(0,coalesce((creature->>'stage')::integer,0)-1)));
  saved:=jsonb_set(saved,array['creatures',instance_id],creature);
  if saved->'pet'->>'instanceId'=instance_id then saved:=jsonb_set(saved,'{pet}',creature);end if;
 end if;
 saved:=jsonb_set(saved,'{moderationLog}',coalesce(saved->'moderationLog','[]'::jsonb)||jsonb_build_array(jsonb_build_object('at',current_timestamp,'moderator',auth.uid(),'operation',operation,'instanceId',instance_id,'reason',trim(reason))));
 update public.vq_profiles set state=saved,revision=revision+1 where user_id=target_id;
 return jsonb_build_object('ok',true);
end;$$;
revoke all on function public.vq_admin_pet_change(uuid,text,text,text) from public;
grant execute on function public.vq_admin_pet_change(uuid,text,text,text) to authenticated;
create or replace function public.vq_admin_notice(target_id uuid,notice_title text,notice_message text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare saved jsonb; notice jsonb;
begin
 if not public.vq_is_admin() then raise exception 'administrator_required';end if;
 if length(trim(notice_title)) not between 1 and 80 or length(trim(notice_message)) not between 1 and 800 then raise exception 'invalid_notice';end if;
 select state into saved from public.vq_profiles where user_id=target_id for update;
 if saved is null then raise exception 'invalid_profile';end if;
 notice:=jsonb_build_object('id',gen_random_uuid()::text,'title',trim(notice_title),'message',trim(notice_message),'createdAt',current_timestamp,'receivedAt',null,'moderator',auth.uid());
 saved:=jsonb_set(saved,'{moderatorNotices}',coalesce(saved->'moderatorNotices','[]'::jsonb)||jsonb_build_array(notice));
 update public.vq_profiles set state=saved,revision=revision+1 where user_id=target_id;
 return jsonb_build_object('ok',true);
end;$$;
revoke all on function public.vq_admin_notice(uuid,text,text) from public;
grant execute on function public.vq_admin_notice(uuid,text,text) to authenticated;
commit;
