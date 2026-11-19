-- =========================================================================
-- MIGRATION: Admin Moderation RLS Policies for UGC Reports & Content Appeals
-- Allows platform admins (via public.has_role(..., 'admin')) to query and
-- resolve all rows in public.ugc_reports and public.content_appeals.
-- =========================================================================

grant select, update on public.ugc_reports to authenticated;
grant select, update on public.content_appeals to authenticated;

drop policy if exists "Admins can view all UGC reports" on public.ugc_reports;
create policy "Admins can view all UGC reports" on public.ugc_reports
  for select to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role));

drop policy if exists "Admins can update all UGC reports" on public.ugc_reports;
create policy "Admins can update all UGC reports" on public.ugc_reports
  for update to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role))
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role));

drop policy if exists "Admins can view all content appeals" on public.content_appeals;
create policy "Admins can view all content appeals" on public.content_appeals
  for select to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role));

drop policy if exists "Admins can update all content appeals" on public.content_appeals;
create policy "Admins can update all content appeals" on public.content_appeals
  for update to authenticated
  using (public.has_role((select auth.uid()), 'admin'::public.app_role))
  with check (public.has_role((select auth.uid()), 'admin'::public.app_role));
