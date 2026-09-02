CREATE TABLE public.incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  media_url text,
  media_type text CHECK (media_type IN ('photo','video','audio')),
  lat double precision,
  lng double precision,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.incidents TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.incidents TO authenticated;
GRANT ALL ON public.incidents TO service_role;

ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Incidents are public" ON public.incidents
  FOR SELECT USING (true);
CREATE POLICY "Users create own incidents" ON public.incidents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND length(btrim(title)) > 0);
CREATE POLICY "Users edit own incidents" ON public.incidents
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authors or admins delete incidents" ON public.incidents
  FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE INDEX incidents_created_at_idx ON public.incidents (created_at DESC);
CREATE INDEX incidents_brand_id_idx ON public.incidents (brand_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.incidents;

ALTER TABLE public.items ADD COLUMN audit jsonb;
ALTER TABLE public.items ADD COLUMN phash text;
CREATE INDEX items_phash_idx ON public.items (phash) WHERE phash IS NOT NULL;

CREATE POLICY "Users can upload incident media to their folder" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'incident-media' AND (storage.foldername(name))[1] = (auth.uid())::text);
CREATE POLICY "Users can read incident media" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'incident-media');
CREATE POLICY "Users can delete their own incident media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'incident-media' AND (storage.foldername(name))[1] = (auth.uid())::text);
