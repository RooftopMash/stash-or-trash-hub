-- =========================================================================
-- MIGRATION: Admin Moderation RLS Policies & Appeals Columns
-- Grants admin role access to:
--   - content_appeals (view and resolve all user appeals)
--   - ugc_reports (view and moderate all UGC reports)
--   - account_deletion_requests (process and complete user deletions)
-- Adds resolved_at and reviewer_notes columns and status constraints to content_appeals
-- =========================================================================

-- 1. Ensure columns exist on content_appeals
alter table public.content_appeals 
  add column if not exists resolved_at timestamptz default null,
  add column if not exists reviewer_notes text default null;

-- Update status check constraint to support both pending/under_review and open/reviewing/overturned
alter table public.content_appeals drop constraint if exists content_appeals_status_check;
alter table public.content_appeals add constraint content_appeals_status_check 
  check (status in ('pending', 'under_review', 'upheld', 'reversed', 'open', 'reviewing', 'overturned'));

-- 2. Admin RLS Policy for content_appeals
drop policy if exists "Admins can view and manage all content appeals" on public.content_appeals;
create policy "Admins can view and manage all content appeals" on public.content_appeals
  for all to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role))
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role));

-- 3. Admin RLS Policy for ugc_reports
drop policy if exists "Admins can view and manage all UGC reports" on public.ugc_reports;
create policy "Admins can view and manage all UGC reports" on public.ugc_reports
  for all to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role))
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role));

-- 4. Admin RLS Policy for account_deletion_requests
drop policy if exists "Admins can view and manage deletion requests" on public.account_deletion_requests;
create policy "Admins can view and manage deletion requests" on public.account_deletion_requests
  for all to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role))
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role));
