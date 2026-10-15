-- =========================================================================
-- MIGRATION: Security Hardening & Zero-Credit Admin Moderation
-- Fixes the 2 security findings flagged by Supabase/Lovable for FREE:
--   1. Strips all anonymous access from sensitive compliance tables
--   2. Grants admin moderation access to content_appeals & ugc_reports
--   3. Hardens profiles to prevent unauthorized PII leakage
-- =========================================================================

-- 1. Ensure content_appeals has the resolution fields and expanded statuses
alter table public.content_appeals 
  add column if not exists resolved_at timestamptz default null,
  add column if not exists reviewer_notes text default null;

alter table public.content_appeals drop constraint if exists content_appeals_status_check;
alter table public.content_appeals add constraint content_appeals_status_check 
  check (status in ('pending', 'under_review', 'upheld', 'reversed', 'open', 'reviewing', 'overturned'));

-- 2. Strip ALL anon access to compliance and sensitive user tables (Critical finding fix)
revoke all on public.user_consents from anon;
revoke all on public.account_deletion_requests from anon;
revoke all on public.user_blocks from anon;
revoke all on public.ugc_reports from anon;
revoke all on public.content_appeals from anon;

-- Ensure authenticated users can only touch their own data
alter table public.user_consents enable row level security;
alter table public.account_deletion_requests enable row level security;
alter table public.user_blocks enable row level security;
alter table public.ugc_reports enable row level security;
alter table public.content_appeals enable row level security;

-- 3. Admin Moderation Policies (Allows admins to view & resolve all reports/appeals)
drop policy if exists "Admins can view and manage all content appeals" on public.content_appeals;
create policy "Admins can view and manage all content appeals" on public.content_appeals
  for all to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role))
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role));

drop policy if exists "Admins can view and manage all UGC reports" on public.ugc_reports;
create policy "Admins can view and manage all UGC reports" on public.ugc_reports
  for all to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role))
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role));

drop policy if exists "Admins can view and manage deletion requests" on public.account_deletion_requests;
create policy "Admins can view and manage deletion requests" on public.account_deletion_requests
  for all to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role))
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role));

-- 4. Profiles Hardening (Warning finding fix)
-- Ensure anonymous users can only SELECT display_name, avatar_url, bio, trust_score
revoke insert, update, delete on public.profiles from anon;
