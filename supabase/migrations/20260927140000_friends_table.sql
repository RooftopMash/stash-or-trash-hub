-- Mutual connection ('friends') table supporting pending, accepted, and blocked states
create table if not exists public.friends (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  addressee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'blocked')),
  bond_tag text not null default 'stranger',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint friends_no_self_connection check (requester_id <> addressee_id),
  constraint friends_unique_pair unique (requester_id, addressee_id)
);

create unique index if not exists friends_canonical_pair_idx
  on public.friends (least(requester_id, addressee_id), greatest(requester_id, addressee_id));

create index if not exists friends_requester_status_idx on public.friends (requester_id, status);
create index if not exists friends_addressee_status_idx on public.friends (addressee_id, status);

grant select, insert, update, delete on public.friends to authenticated;
grant all on public.friends to service_role;

alter table public.friends enable row level security;

drop policy if exists "Users can view their own friend connections" on public.friends;
create policy "Users can view their own friend connections" on public.friends
  for select to authenticated
  using ((select auth.uid()) = requester_id or (select auth.uid()) = addressee_id);

drop policy if exists "Users can send friend requests" on public.friends;
create policy "Users can send friend requests" on public.friends
  for insert to authenticated
  with check (
    (select auth.uid()) = requester_id
    and requester_id <> addressee_id
    and status in ('pending', 'blocked')
  );

drop policy if exists "Participants can update friend status" on public.friends;
create policy "Participants can update friend status" on public.friends
  for update to authenticated
  using ((select auth.uid()) = requester_id or (select auth.uid()) = addressee_id)
  with check (
    ((select auth.uid()) = requester_id or (select auth.uid()) = addressee_id)
    and status in ('pending', 'accepted', 'blocked')
  );

drop policy if exists "Participants can delete friend connections" on public.friends;
create policy "Participants can delete friend connections" on public.friends
  for delete to authenticated
  using ((select auth.uid()) = requester_id or (select auth.uid()) = addressee_id);

drop trigger if exists update_friends_updated_at on public.friends;
create trigger update_friends_updated_at
  before update on public.friends
  for each row execute function public.update_updated_at_column();

create or replace function public.trg_notify_friend() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT' and new.status = 'pending') then
    perform public.notify(new.addressee_id, new.requester_id, 'friend_request', null, null);
  elsif (tg_op = 'UPDATE' and old.status = 'pending' and new.status = 'accepted') then
    perform public.notify(new.requester_id, new.addressee_id, 'friend_accepted', null, null);
  end if;
  return new;
end; $$;

revoke execute on function public.trg_notify_friend() from public, anon, authenticated;

drop trigger if exists notify_friend on public.friends;
create trigger notify_friend
  after insert or update on public.friends
  for each row execute function public.trg_notify_friend();

alter table public.friends replica identity full;
do $$ begin
  alter publication supabase_realtime add table public.friends;
exception when duplicate_object then null; end $$;

comment on table public.friends is 'Mutual friend connections between users with pending, accepted, and blocked states.';

