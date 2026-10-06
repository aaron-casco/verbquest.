begin;
-- Exclusively the verified moderator may erase trial accounts.
create or replace function public.vq_reset_accounts(target_id uuid default null, reset_all boolean default false)
returns integer language plpgsql security definer set search_path = public, auth as $$
declare removed integer;
begin
 if not public.vq_is_admin() then raise exception 'administrator_required'; end if;
 if not reset_all and (target_id is null or target_id=auth.uid()) then raise exception 'invalid_target'; end if;
 -- Protect the moderator both by ID and by email. Profiles cascade from auth.users.
 delete from auth.users u where u.id<>auth.uid()
  and lower(coalesce(u.email,''))<>'acascog01@educarex.es'
  and (reset_all or u.id=target_id);
 get diagnostics removed=row_count;
 if reset_all then
  update public.vq_config set state=jsonb_set(jsonb_set(state,'{archives}','[]'::jsonb),'{season,id}',to_jsonb(gen_random_uuid()::text)),revision=revision+1 where id=1;
 end if;
 return removed;
end;
$$;
revoke all on function public.vq_reset_accounts(uuid,boolean) from public,anon;
grant execute on function public.vq_reset_accounts(uuid,boolean) to authenticated;
commit;
