-- 1. Tighten brand verification/claim request inserts
DROP POLICY IF EXISTS "Signed in users can request brand verification or claim" ON public.brand_verification_requests;

CREATE POLICY "Signed in users can request brand verification or claim"
ON public.brand_verification_requests
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = requested_by
  AND EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = brand_verification_requests.brand_id
      AND b.verified = false
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.brand_verification_requests r
    WHERE r.brand_id = brand_verification_requests.brand_id
      AND r.requested_by = auth.uid()
      AND r.status = 'pending'
  )
);

-- 2. Restrict full profile reads to authenticated users; expose a safe public view
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = false) AS
SELECT id, display_name, avatar_url, trust_score
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;
