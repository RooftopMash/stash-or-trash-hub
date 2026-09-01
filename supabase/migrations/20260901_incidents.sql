-- Live incident broadcasting.
CREATE TABLE IF NOT EXISTS public.incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  media_url text,
  media_type text CHECK (media_type IN ('photo','video','audio') OR media_type IS NULL),
  lat double precision,
  lng double precision,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS incidents_created_idx ON public.incidents (created_at DESC);
CREATE INDEX IF NOT EXISTS incidents_brand_idx ON public.incidents (brand_id);

GRANT SELECT ON public.incidents TO authenticated, anon;
GRANT INSERT, DELETE ON public.incidents TO authenticated;
GRANT ALL ON public.incidents TO service_role;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Incidents are public" ON public.incidents;
CREATE POLICY "Incidents are public" ON public.incidents FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users report as themselves" ON public.incidents;
CREATE POLICY "Users report as themselves" ON public.incidents FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users delete own incidents" ON public.incidents;
CREATE POLICY "Users delete own incidents" ON public.incidents FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- storage bucket for incident media
INSERT INTO storage.buckets (id, name, public)
VALUES ('incident-media', 'incident-media', false)
ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "incident media read" ON storage.objects;
CREATE POLICY "incident media read" ON storage.objects FOR SELECT
  USING (bucket_id = 'incident-media');
DROP POLICY IF EXISTS "incident media insert" ON storage.objects;
CREATE POLICY "incident media insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'incident-media' AND auth.role() = 'authenticated');

-- notify brand owners when an incident names their brand
CREATE OR REPLACE FUNCTION public.trg_notify_incident() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner uuid;
BEGIN
  IF NEW.brand_id IS NOT NULL THEN
    SELECT owner_id INTO owner FROM public.brands WHERE id = NEW.brand_id;
    PERFORM public.notify(owner, NEW.user_id, 'incident', NULL, NULL);
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS notify_incident ON public.incidents;
CREATE TRIGGER notify_incident AFTER INSERT ON public.incidents
FOR EACH ROW EXECUTE FUNCTION public.trg_notify_incident();

ALTER TABLE public.incidents REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.incidents;
