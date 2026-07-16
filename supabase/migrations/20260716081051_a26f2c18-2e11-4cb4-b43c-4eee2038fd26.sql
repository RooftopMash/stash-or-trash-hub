DROP POLICY IF EXISTS "Brand owners can request verification" ON public.brand_verification_requests;

CREATE POLICY "Signed in users can request brand verification or claim"
ON public.brand_verification_requests
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = requested_by
  AND EXISTS (
    SELECT 1
    FROM public.brands b
    WHERE b.id = brand_verification_requests.brand_id
  )
);