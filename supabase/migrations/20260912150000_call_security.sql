create table if not exists public.call_security_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id) on delete cascade,
  peer_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('token_issued', 'call_started', 'call_left', 'call_reported')),
  mode text not null check (mode in ('voice', 'video')),
  recording_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.call_security_events enable row level security;

drop policy if exists "Participants can view call events" on public.call_security_events;
create policy "Participants can view call events" on public.call_security_events
  for select to authenticated
  using ((select auth.uid()) = actor_id or (select auth.uid()) = peer_id);

drop policy if exists "Actors can create call events" on public.call_security_events;
create policy "Actors can create call events" on public.call_security_events
  for insert to authenticated
  with check ((select auth.uid()) = actor_id and actor_id <> peer_id and recording_enabled = false);

create index if not exists call_security_events_actor_created_idx on public.call_security_events (actor_id, created_at desc);
create index if not exists call_security_events_peer_created_idx on public.call_security_events (peer_id, created_at desc);
