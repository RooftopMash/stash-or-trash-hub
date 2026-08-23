DELETE FROM public.brand_import_candidates a
USING public.brand_import_candidates b
WHERE a.source = b.source
  AND a.source_id = b.source_id
  AND a.source_id IS NOT NULL
  AND a.ctid > b.ctid;

CREATE UNIQUE INDEX IF NOT EXISTS brand_import_candidates_source_source_id_key
ON public.brand_import_candidates (source, source_id);
