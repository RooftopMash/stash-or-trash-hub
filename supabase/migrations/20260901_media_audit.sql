ALTER TABLE public.items ADD COLUMN IF NOT EXISTS audit jsonb;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS phash text;
CREATE INDEX IF NOT EXISTS items_phash_idx ON public.items (phash) WHERE phash IS NOT NULL;
