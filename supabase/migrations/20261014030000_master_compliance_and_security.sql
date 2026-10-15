-- =========================================================================
-- MASTER COMPLIANCE, DISPUTES, ADMIN MODERATION & SECURITY HARDENING
-- Self-contained: includes role type, user_roles, has_role function,
-- all 5 compliance tables, RLS policies, and security hardening.
-- =========================================================================

-- 1. Ensure app_role enum, user_roles table, and has_role function exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'brand', 'user');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role::text = _role)
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO authenticated;

-- 2. Add dispute columns to items if not present
ALTER TABLE public.items 
  ADD COLUMN IF NOT EXISTS dispute_status text default null,
  ADD COLUMN IF NOT EXISTS dispute_resolution_notes text default null;

-- 3. UGC Reports Table
CREATE TABLE IF NOT EXISTS public.ugc_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('wall_post', 'item', 'comment', 'brand')),
  target_id text NOT NULL,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ugc_reports ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.ugc_reports FROM anon;
GRANT SELECT, INSERT ON public.ugc_reports TO authenticated;
GRANT ALL ON public.ugc_reports TO service_role;

DROP POLICY IF EXISTS "Users can insert their own UGC reports" ON public.ugc_reports;
CREATE POLICY "Users can insert their own UGC reports" ON public.ugc_reports
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = reporter_id);

DROP POLICY IF EXISTS "Users can view their own reports" ON public.ugc_reports;
CREATE POLICY "Users can view their own reports" ON public.ugc_reports
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = reporter_id);

DROP POLICY IF EXISTS "Admins can view and manage all UGC reports" ON public.ugc_reports;
CREATE POLICY "Admins can view and manage all UGC reports" ON public.ugc_reports
  FOR ALL TO authenticated
  USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role))
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));

-- 4. User Blocks Table
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_blocks_no_self_block CHECK (blocker_id <> blocked_id),
  CONSTRAINT user_blocks_unique_pair UNIQUE (blocker_id, blocked_id)
);

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_blocks FROM anon;
GRANT SELECT, INSERT, DELETE ON public.user_blocks TO authenticated;
GRANT ALL ON public.user_blocks TO service_role;

DROP POLICY IF EXISTS "Users can manage their blocks" ON public.user_blocks;
CREATE POLICY "Users can manage their blocks" ON public.user_blocks
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = blocker_id)
  WITH CHECK ((SELECT auth.uid()) = blocker_id);

-- 5. Account Deletion Requests Table (POPIA / GDPR Right to Erasure)
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'processing', 'completed', 'cancelled')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT unique_user_deletion_request UNIQUE (user_id)
);

ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.account_deletion_requests FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.account_deletion_requests TO authenticated;
GRANT ALL ON public.account_deletion_requests TO service_role;

DROP POLICY IF EXISTS "Users can request account deletion" ON public.account_deletion_requests;
CREATE POLICY "Users can request account deletion" ON public.account_deletion_requests
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins can view and manage deletion requests" ON public.account_deletion_requests;
CREATE POLICY "Admins can view and manage deletion requests" ON public.account_deletion_requests
  FOR ALL TO authenticated
  USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role))
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));

-- 6. User Consents Table (Terms & Privacy Audit Log)
CREATE TABLE IF NOT EXISTS public.user_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  terms_version text NOT NULL,
  privacy_version text NOT NULL,
  marketing_opt_in boolean NOT NULL DEFAULT false,
  consented_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_consent UNIQUE (user_id)
);

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_consents FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.user_consents TO authenticated;
GRANT ALL ON public.user_consents TO service_role;

DROP POLICY IF EXISTS "Users can view and record consent" ON public.user_consents;
CREATE POLICY "Users can view and record consent" ON public.user_consents
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- 7. Content Appeals Table
CREATE TABLE IF NOT EXISTS public.content_appeals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id text NOT NULL,
  appellant_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'upheld', 'reversed', 'open', 'reviewing', 'overturned')),
  reviewer_notes text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.content_appeals ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.content_appeals FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.content_appeals TO authenticated;
GRANT ALL ON public.content_appeals TO service_role;

DROP POLICY IF EXISTS "Users can submit appeals" ON public.content_appeals;
CREATE POLICY "Users can submit appeals" ON public.content_appeals
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = appellant_id);

DROP POLICY IF EXISTS "Users can view own appeals" on public.content_appeals;
CREATE POLICY "Users can view own appeals" ON public.content_appeals
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = appellant_id);

DROP POLICY IF EXISTS "Admins can view and manage all content appeals" ON public.content_appeals;
CREATE POLICY "Admins can view and manage all content appeals" ON public.content_appeals
  FOR ALL TO authenticated
  USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role))
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));

-- 8. Profiles Hardening (Warning finding fix)
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon;
