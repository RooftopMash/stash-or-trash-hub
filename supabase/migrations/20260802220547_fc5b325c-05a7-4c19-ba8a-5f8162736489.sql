DROP VIEW IF EXISTS public.public_profiles;

CREATE POLICY "Public can view basic profile fields"
ON public.profiles
FOR SELECT
TO anon
USING (true);

GRANT SELECT (id, display_name, avatar_url, trust_score) ON public.profiles TO anon;
