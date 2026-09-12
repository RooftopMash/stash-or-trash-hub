-- Election-readiness foundation: provenance and append-only audit records.
-- This does not certify the platform; independent review and jurisdictional approval remain required.

create table if not exists public.rating_provenance (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  submitted_by uuid references auth.users(id) on delete set null,
  methodology_version text not null,
  evidence_urls text[] not null default '{}',
  rationale text not null,
  confidence numeric(5,4) check (confidence >= 0 and confidence <= 1),
  status text not null default 'pending' check (status in ('pending','approved','rejected','superseded')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);

create index if not exists rating_provenance_brand_created_idx on public.rating_provenance(brand_id, created_at desc);
alter table public.rating_provenance enable row level security;
grant select on public.rating_provenance to anon, authenticated;
grant insert on public.rating_provenance to authenticated;
grant all on public.rating_provenance to service_role;
drop policy if exists "Public can view approved provenance" on public.rating_provenance;
create policy "Public can view approved provenance" on public.rating_provenance for select using (status = 'approved' or (select auth.uid()) = submitted_by or public.has_role((select auth.uid()), 'admin'::public.app_role));
drop policy if exists "Users can submit provenance" on public.rating_provenance;
create policy "Users can submit provenance" on public.rating_provenance for insert to authenticated with check ((select auth.uid()) = submitted_by);

create table if not exists public.security_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb not null default '{}'::jsonb,
  previous_hash text,
  record_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists security_audit_log_created_idx on public.security_audit_log(created_at desc);
alter table public.security_audit_log enable row level security;
grant select on public.security_audit_log to authenticated;
grant all on public.security_audit_log to service_role;
drop policy if exists "Admins can view security audit log" on public.security_audit_log;
create policy "Admins can view security audit log" on public.security_audit_log for select to authenticated using (public.has_role((select auth.uid()), 'admin'::public.app_role));
revoke insert, update, delete on public.security_audit_log from anon, authenticated;

create or replace function public.prevent_audit_log_mutation()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  raise exception 'security audit log is append-only';
end;
$$;
drop trigger if exists security_audit_log_immutable on public.security_audit_log;
create trigger security_audit_log_immutable before update or delete on public.security_audit_log for each row execute function public.prevent_audit_log_mutation();

comment on table public.rating_provenance is 'Evidence, methodology, review state, and confidence for published ratings.';
comment on table public.security_audit_log is 'Append-only security and privileged-action audit chain; write through a trusted server-side process only.';
