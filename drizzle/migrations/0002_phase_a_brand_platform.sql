-- Phase A: brand teams, official brand responses, sentiment tagging, KPIs

-- 1. Roles inside a brand
CREATE TYPE public.brand_role AS ENUM ('admin', 'analyst', 'viewer');

CREATE TABLE public.brand_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email text,
  role public.brand_role NOT NULL DEFAULT 'viewer',
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX brand_members_brand_user_uniq ON public.brand_members (brand_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX brand_members_brand_email_uniq ON public.brand_members (brand_id, lower(invited_email)) WHERE invited_email IS NOT NULL;
CREATE INDEX brand_members_user_idx ON public.brand_members (user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_members TO authenticated;
GRANT ALL ON public.brand_members TO service_role;

ALTER TABLE public.brand_members ENABLE ROW LEVEL SECURITY;

-- 2. Membership check (security definer, avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_brand_role(_brand_id uuid, _min_role public.brand_role DEFAULT 'viewer')
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.brands b
    WHERE b.id = _brand_id AND b.owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.brand_members m
    WHERE m.brand_id = _brand_id
      AND m.user_id = auth.uid()
      AND m.accepted_at IS NOT NULL
      AND CASE _min_role
            WHEN 'viewer' THEN true
            WHEN 'analyst' THEN m.role IN ('analyst', 'admin')
            WHEN 'admin' THEN m.role = 'admin'
          END
  ) OR public.has_role(auth.uid(), 'admin');
$$;

CREATE POLICY "Team can read members" ON public.brand_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_brand_role(brand_id, 'viewer'));

CREATE POLICY "Brand admins manage members" ON public.brand_members
  FOR INSERT TO authenticated
  WITH CHECK (public.has_brand_role(brand_id, 'admin'));

CREATE POLICY "Brand admins update members" ON public.brand_members
  FOR UPDATE TO authenticated
  USING (public.has_brand_role(brand_id, 'admin') OR user_id = auth.uid())
  WITH CHECK (public.has_brand_role(brand_id, 'admin') OR user_id = auth.uid());

CREATE POLICY "Brand admins delete members" ON public.brand_members
  FOR DELETE TO authenticated
  USING (public.has_brand_role(brand_id, 'admin'));

CREATE TRIGGER brand_members_updated_at BEFORE UPDATE ON public.brand_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Pending email invites resolve when that person signs up
CREATE OR REPLACE FUNCTION public.claim_brand_invites()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.brand_members m
     SET user_id = NEW.id,
         accepted_at = COALESCE(m.accepted_at, now())
   WHERE m.user_id IS NULL
     AND lower(m.invited_email) = lower(NEW.email);
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_claim_invites
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.claim_brand_invites();

-- 3. Official brand responses
CREATE TABLE public.brand_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX brand_responses_item_idx ON public.brand_responses (item_id);
CREATE INDEX brand_responses_brand_idx ON public.brand_responses (brand_id);

GRANT SELECT ON public.brand_responses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_responses TO authenticated;
GRANT ALL ON public.brand_responses TO service_role;

ALTER TABLE public.brand_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Responses are public" ON public.brand_responses
  FOR SELECT USING (true);

CREATE POLICY "Brand team can respond" ON public.brand_responses
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.has_brand_role(brand_id, 'analyst'));

CREATE POLICY "Author can edit response" ON public.brand_responses
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Author or brand admin can delete response" ON public.brand_responses
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.has_brand_role(brand_id, 'admin'));

CREATE TRIGGER brand_responses_updated_at BEFORE UPDATE ON public.brand_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Sentiment + response tracking on items
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS sentiment text NOT NULL DEFAULT 'unknown';
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS responded_at timestamptz;
CREATE INDEX IF NOT EXISTS items_brand_created_idx ON public.items (brand_id, created_at DESC);

-- Stamp responded_at + notify the post author on first official response
CREATE OR REPLACE FUNCTION public.trg_brand_response()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE owner_id uuid;
BEGIN
  UPDATE public.items
     SET responded_at = COALESCE(responded_at, NEW.created_at)
   WHERE id = NEW.item_id
  RETURNING user_id INTO owner_id;
  PERFORM public.notify(owner_id, NEW.user_id, 'brand_response', NEW.item_id, NULL);
  RETURN NEW;
END; $$;

CREATE TRIGGER brand_response_created AFTER INSERT ON public.brand_responses
  FOR EACH ROW EXECUTE FUNCTION public.trg_brand_response();

-- Derive sentiment from votes as they land (brand team can override)
CREATE OR REPLACE FUNCTION public.trg_item_sentiment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE s int; t int; total int;
BEGIN
  SELECT count(*) FILTER (WHERE verdict = 'stash'), count(*) FILTER (WHERE verdict = 'trash')
    INTO s, t FROM public.votes WHERE item_id = COALESCE(NEW.item_id, OLD.item_id);
  total := COALESCE(s,0) + COALESCE(t,0);
  IF total > 0 THEN
    UPDATE public.items SET sentiment = CASE
      WHEN s::numeric / total >= 0.6 THEN 'positive'
      WHEN s::numeric / total <= 0.4 THEN 'negative'
      ELSE 'neutral' END
    WHERE id = COALESCE(NEW.item_id, OLD.item_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END; $$;

CREATE TRIGGER item_sentiment_from_votes AFTER INSERT OR UPDATE OR DELETE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.trg_item_sentiment();

-- 5. Dashboard KPIs for one brand
CREATE OR REPLACE FUNCTION public.brand_kpis(_brand_id uuid, _days int DEFAULT 30)
RETURNS TABLE (
  posts int,
  stash int,
  trash int,
  stash_pct int,
  positive int,
  neutral int,
  negative int,
  unanswered int,
  median_response_minutes int
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH scoped AS (
    SELECT i.* FROM public.items i
    WHERE i.brand_id = _brand_id
      AND i.created_at >= now() - make_interval(days => _days)
  ), v AS (
    SELECT count(*) FILTER (WHERE vv.verdict = 'stash') AS s,
           count(*) FILTER (WHERE vv.verdict = 'trash') AS t
    FROM public.votes vv JOIN scoped sc ON sc.id = vv.item_id
  )
  SELECT (SELECT count(*) FROM scoped)::int,
         (SELECT s FROM v)::int,
         (SELECT t FROM v)::int,
         COALESCE((SELECT CASE WHEN s + t = 0 THEN 0 ELSE round(100.0 * s / (s + t)) END FROM v), 0)::int,
         (SELECT count(*) FROM scoped WHERE sentiment = 'positive')::int,
         (SELECT count(*) FROM scoped WHERE sentiment = 'neutral')::int,
         (SELECT count(*) FROM scoped WHERE sentiment = 'negative')::int,
         (SELECT count(*) FROM scoped WHERE responded_at IS NULL)::int,
         COALESCE((
           SELECT round(percentile_cont(0.5) WITHIN GROUP (
             ORDER BY EXTRACT(EPOCH FROM (responded_at - created_at)) / 60
           ))::int
           FROM scoped WHERE responded_at IS NOT NULL
         ), 0)::int
  WHERE public.has_brand_role(_brand_id, 'viewer');
$$;

REVOKE ALL ON FUNCTION public.brand_kpis(uuid, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.brand_kpis(uuid, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_brand_role(uuid, public.brand_role) TO authenticated, anon;