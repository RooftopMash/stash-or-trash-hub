ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS country text;
CREATE INDEX IF NOT EXISTS brands_country_idx ON public.brands (country);