begin;
create or replace function public.vq_reset_moderator_progress()
returns void language plpgsql security definer set search_path=public,auth as $$
begin
 if not public.vq_is_admin() then raise exception 'administrator_required'; end if;
 -- Preserve the Auth identity and moderator permission; discard the entire player state.
 delete from public.vq_profiles where user_id=auth.uid();
 update public.vq_config set state=jsonb_set(state,'{archives}',coalesce((
  select jsonb_agg(jsonb_set(a,'{ranks}',coalesce((
   select jsonb_agg(r) from jsonb_array_elements(coalesce(a->'ranks','[]'::jsonb)) r where r->>'id'<>auth.uid()::text
  ),'[]'::jsonb))) from jsonb_array_elements(coalesce(state->'archives','[]'::jsonb)) a
 ),'[]'::jsonb)),revision=revision+1 where id=1;
end;
$$;
revoke all on function public.vq_reset_moderator_progress() from public,anon;
grant execute on function public.vq_reset_moderator_progress() to authenticated;
commit;
