-- Adds paid daily competitive attempts. Does not reset profiles or existing rounds.
begin;
create table if not exists public.vq_arena_tickets (
 purchase_id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 season_id text not null,
 day date not null,
 created_at timestamptz not null default current_timestamp
);
alter table public.vq_arena_tickets enable row level security;
drop policy if exists vq_arena_tickets_read on public.vq_arena_tickets;
create policy vq_arena_tickets_read on public.vq_arena_tickets for select to authenticated using(user_id=auth.uid());
revoke all on public.vq_arena_tickets from public,anon,authenticated;
grant select on public.vq_arena_tickets to authenticated;
create or replace function public.vq_buy_arena_ticket(purchase_id uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare request_id uuid:=purchase_id; saved jsonb; cfg jsonb; sid text; today date:=(current_timestamp at time zone 'Europe/Madrid')::date; used integer; bought integer; old_owner uuid; coins bigint;
begin
 if auth.uid() is null then raise exception 'authentication_required';end if;
 select state into cfg from public.vq_config where id=1 for share;
 select state into saved from public.vq_profiles where user_id=auth.uid() for update;
 if saved is null or coalesce((saved->>'blocked')::boolean,false) or not coalesce((saved->>'competitiveEnabled')::boolean,true) then raise exception 'competitive_access_denied';end if;
 select user_id into old_owner from public.vq_arena_tickets t where t.purchase_id=request_id;
 if old_owner is not null then
  if old_owner<>auth.uid() then raise exception 'invalid_purchase';end if;
  return jsonb_build_object('ok',true,'alreadyPurchased',true);
 end if;
 sid:=cfg#>>'{season,id}';
 if sid is null or coalesce((cfg#>>'{season,closed}')::boolean,false) then raise exception 'season_closed';end if;
 if not coalesce(saved->'unlocked','[]'::jsonb) ? 'arena' then raise exception 'competitive_access_denied';end if;
 select count(*) into used from jsonb_array_elements(coalesce(saved->'attempts','[]'::jsonb)) a where a->>'season'=sid and a->>'day'=today::text;
 select count(*) into bought from public.vq_arena_tickets t where t.user_id=auth.uid() and t.season_id=sid and t.day=today;
 if used<3+bought then raise exception 'attempt_not_exhausted';end if;
 coins:=coalesce((saved->>'coins')::bigint,0);
 if coins<150 then raise exception 'insufficient_coins';end if;
 insert into public.vq_arena_tickets(purchase_id,user_id,season_id,day) values(request_id,auth.uid(),sid,today);
 update public.vq_profiles set state=jsonb_set(saved,'{coins}',to_jsonb(coins-150)),revision=revision+1 where user_id=auth.uid();
 return jsonb_build_object('ok',true,'alreadyPurchased',false,'charged',150);
end;$$;
revoke all on function public.vq_buy_arena_ticket(uuid) from public;
grant execute on function public.vq_buy_arena_ticket(uuid) to authenticated;
create or replace function public.vq_guard_arena_attempt_limit() returns trigger
language plpgsql security definer set search_path='' as $$
declare attempt jsonb; cfg jsonb; today text:=(current_timestamp at time zone 'Europe/Madrid')::date::text; count_used integer; count_tickets integer;
begin
 for attempt in select value from jsonb_array_elements(coalesce(new.state->'attempts','[]'::jsonb)) loop
  if tg_op='UPDATE' and exists(select 1 from jsonb_array_elements(coalesce(old.state->'attempts','[]'::jsonb)) a where a->>'id'=attempt->>'id') then continue;end if;
  select state into cfg from public.vq_config where id=1;
  if attempt->>'day' is distinct from today or attempt->>'season' is distinct from cfg#>>'{season,id}' or coalesce((cfg#>>'{season,closed}')::boolean,false) then raise exception 'season_closed';end if;
  select count(*) into count_used from jsonb_array_elements(coalesce(new.state->'attempts','[]'::jsonb)) a where a->>'season'=attempt->>'season' and a->>'day'=today;
  select count(*) into count_tickets from public.vq_arena_tickets t where t.user_id=new.user_id and t.season_id=attempt->>'season' and t.day=today::date;
  if count_used>3+count_tickets then raise exception 'arena_daily_limit';end if;
 end loop;
 return new;
end;$$;
revoke all on function public.vq_guard_arena_attempt_limit() from public;
drop trigger if exists vq_arena_attempt_limit on public.vq_profiles;
create trigger vq_arena_attempt_limit before insert or update on public.vq_profiles for each row execute function public.vq_guard_arena_attempt_limit();
commit;
