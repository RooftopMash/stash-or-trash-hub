
-- 1. Brand import candidates (admin-moderated queue for Wikidata etc.)
CREATE TABLE public.brand_import_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  country text,
  category text,
  description text,
  website text,
  logo_url text,
  source text NOT NULL DEFAULT 'wikidata',
  source_id text,
  status text NOT NULL DEFAULT 'pending',
  imported_brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX brand_import_candidates_source_key
  ON public.brand_import_candidates(source, source_id)
  WHERE source_id IS NOT NULL;

CREATE INDEX brand_import_candidates_status_idx
  ON public.brand_import_candidates(status, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_import_candidates TO authenticated;
GRANT ALL ON public.brand_import_candidates TO service_role;

ALTER TABLE public.brand_import_candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage import candidates"
  ON public.brand_import_candidates FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_brand_import_candidates_updated_at
  BEFORE UPDATE ON public.brand_import_candidates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Realtime for messages
ALTER TABLE public.messages REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
