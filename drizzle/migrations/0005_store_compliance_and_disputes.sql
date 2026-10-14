-- =========================================================================
-- MIGRATION: Store Compliance, Dispute Resolution & UGC Safety
-- Adds missing item dispute columns (cleans up HTTP 400 feed queries)
-- Provisions App Store / Play Store UGC compliance tables:
--   - ugc_reports (content flagging)
--   - user_blocks (blocking abusive users)
--   - account_deletion_requests (POPIA / GDPR account deletion)
--   - user_consents (Terms & Privacy audit trail)
--   - content_appeals (Human moderation review appeals)
-- =========================================================================

-- 1. Add dispute columns to items if not already present
alter table public.items 
  add column if not exists dispute_status text default null,
  add column if not exists dispute_resolution_notes text default null;

-- 2. UGC Reports Table
create table if not exists public.ugc_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('wall_post', 'item', 'comment', 'brand')),
  target_id text not null,
  reason text not null,
  details text,
  status text not null default 'pending' check (status in ('pending', 'investigating', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert on public.ugc_reports to authenticated;
grant all on public.ugc_reports to service_role;
alter table public.ugc_reports enable row level security;

drop policy if exists "Users can insert their own UGC reports" on public.ugc_reports;
create policy "Users can insert their own UGC reports" on public.ugc_reports
  for insert to authenticated
  with check ((select auth.uid()) = reporter_id);

drop policy if exists "Users can view their own reports" on public.ugc_reports;
create policy "Users can view their own reports" on public.ugc_reports
  for select to authenticated
  using ((select auth.uid()) = reporter_id);

-- 3. User Blocks Table
create table if not exists public.user_blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint user_blocks_no_self_block check (blocker_id <> blocked_id),
  constraint user_blocks_unique_pair unique (blocker_id, blocked_id)
);

grant select, insert, delete on public.user_blocks to authenticated;
grant all on public.user_blocks to service_role;
alter table public.user_blocks enable row level security;

drop policy if exists "Users can manage their blocks" on public.user_blocks;
create policy "Users can manage their blocks" on public.user_blocks
  for all to authenticated
  using ((select auth.uid()) = blocker_id)
  with check ((select auth.uid()) = blocker_id);

-- 4. Account Deletion Requests Table (POPIA / GDPR Right to Erasure)
create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'requested' check (status in ('requested', 'processing', 'completed', 'cancelled')),
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint unique_user_deletion_request unique (user_id)
);

grant select, insert, update on public.account_deletion_requests to authenticated;
grant all on public.account_deletion_requests to service_role;
alter table public.account_deletion_requests enable row level security;

drop policy if exists "Users can request account deletion" on public.account_deletion_requests;
create policy "Users can request account deletion" on public.account_deletion_requests
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 5. User Consents Table (Terms & Privacy Audit Log)
create table if not exists public.user_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  terms_version text not null,
  privacy_version text not null,
  marketing_opt_in boolean not null default false,
  consented_at timestamptz not null default now(),
  constraint unique_user_consent unique (user_id)
);

grant select, insert, update on public.user_consents to authenticated;
grant all on public.user_consents to service_role;
alter table public.user_consents enable row level security;

drop policy if exists "Users can view and record consent" on public.user_consents;
create policy "Users can view and record consent" on public.user_consents
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 6. Content Appeals Table
create table if not exists public.content_appeals (
  id uuid primary key default gen_random_uuid(),
  review_id text not null,
  appellant_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'under_review', 'upheld', 'reversed')),
  created_at timestamptz not null default now()
);

grant select, insert on public.content_appeals to authenticated;
grant all on public.content_appeals to service_role;
alter table public.content_appeals enable row level security;

drop policy if exists "Users can submit appeals" on public.content_appeals;
create policy "Users can submit appeals" on public.content_appeals
  for insert to authenticated
  with check ((select auth.uid()) = appellant_id);

drop policy if exists "Users can view own appeals" on public.content_appeals;
create policy "Users can view own appeals" on public.content_appeals
  for select to authenticated
  using ((select auth.uid()) = appellant_id);
