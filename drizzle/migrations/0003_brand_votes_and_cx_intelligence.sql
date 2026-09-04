-- 1. Direct brand-level verdicts
CREATE TABLE public.brand_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verdict text NOT NULL CHECK (verdict IN ('stash','trash')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX brand_votes_unique ON public.brand_votes (brand_id, user_id);
CREATE INDEX brand_votes_brand_idx ON public.brand_votes (brand_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_votes TO authenticated;
GRANT SELECT ON public.brand_votes TO anon;
GRANT ALL ON public.brand_votes TO service_role;

ALTER TABLE public.brand_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brand votes are public" ON public.brand_votes FOR SELECT USING (true);
CREATE POLICY "Users cast their own brand vote" ON public.brand_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users change their own brand vote" ON public.brand_votes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove their own brand vote" ON public.brand_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER brand_votes_touch BEFORE UPDATE ON public.brand_votes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Crisis alerts
CREATE TABLE public.brand_crisis_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  negative_share numeric NOT NULL,
  baseline_share numeric NOT NULL,
  sample_size integer NOT NULL DEFAULT 0,
  opened_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
CREATE INDEX brand_crisis_open_idx ON public.brand_crisis_alerts (brand_id, resolved_at);

GRANT SELECT, UPDATE ON public.brand_crisis_alerts TO authenticated;
GRANT ALL ON public.brand_crisis_alerts TO service_role;

ALTER TABLE public.brand_crisis_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brand team reads crisis alerts" ON public.brand_crisis_alerts FOR SELECT TO authenticated
USING (
  public.has_brand_role(brand_id, 'viewer')
  OR EXISTS (SELECT 1 FROM public.brands b WHERE b.id = brand_id AND b.owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Brand team resolves crisis alerts" ON public.brand_crisis_alerts FOR UPDATE TO authenticated
USING (
  public.has_brand_role(brand_id, 'analyst')
  OR EXISTS (SELECT 1 FROM public.brands b WHERE b.id = brand_id AND b.owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_brand_role(brand_id, 'analyst')
  OR EXISTS (SELECT 1 FROM public.brands b WHERE b.id = brand_id AND b.owner_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- 3. Brand verdict summary (item votes + direct brand votes)
CREATE OR REPLACE FUNCTION public.brand_verdict_summary(_brand_id uuid)
RETURNS TABLE(stash integer, trash integer, total integer, stash_pct integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH v AS (
    SELECT verdict FROM public.brand_votes WHERE brand_id = _brand_id
    UNION ALL
    SELECT vt.verdict FROM public.votes vt
    JOIN public.items i ON i.id = vt.item_id
    WHERE i.brand_id = _brand_id
  )
  SELECT
    COUNT(*) FILTER (WHERE verdict = 'stash')::int,
    COUNT(*) FILTER (WHERE verdict = 'trash')::int,
    COUNT(*)::int,
    CASE WHEN COUNT(*) = 0 THEN 50
      ELSE ROUND(100.0 * COUNT(*) FILTER (WHERE verdict = 'stash') / COUNT(*))::int END
  FROM v;
$$;

-- 4. Daily trend for analytics
CREATE OR REPLACE FUNCTION public.brand_trend(_brand_id uuid, _days integer DEFAULT 30)
RETURNS TABLE(day date, posts integer, stash integer, trash integer, stash_pct integer,
              positive integer, neutral integer, negative integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH days AS (
    SELECT generate_series((now() - make_interval(days => _days))::date, now()::date, '1 day')::date AS day
  ),
  p AS (
    SELECT created_at::date AS day,
           COUNT(*)::int AS posts,
           COUNT(*) FILTER (WHERE sentiment = 'positive')::int AS positive,
           COUNT(*) FILTER (WHERE sentiment = 'neutral')::int AS neutral,
           COUNT(*) FILTER (WHERE sentiment = 'negative')::int AS negative
    FROM public.items
    WHERE brand_id = _brand_id AND created_at >= now() - make_interval(days => _days)
    GROUP BY 1
  ),
  vv AS (
    SELECT day, COUNT(*) FILTER (WHERE verdict='stash')::int AS stash,
                COUNT(*) FILTER (WHERE verdict='trash')::int AS trash
    FROM (
      SELECT bv.created_at::date AS day, bv.verdict FROM public.brand_votes bv
      WHERE bv.brand_id = _brand_id AND bv.created_at >= now() - make_interval(days => _days)
      UNION ALL
      SELECT vt.created_at::date AS day, vt.verdict FROM public.votes vt
      JOIN public.items i ON i.id = vt.item_id
      WHERE i.brand_id = _brand_id AND vt.created_at >= now() - make_interval(days => _days)
    ) u
    GROUP BY day
  )
  SELECT d.day,
         COALESCE(p.posts,0), COALESCE(vv.stash,0), COALESCE(vv.trash,0),
         CASE WHEN COALESCE(vv.stash,0) + COALESCE(vv.trash,0) = 0 THEN 50
           ELSE ROUND(100.0 * vv.stash / (vv.stash + vv.trash))::int END,
         COALESCE(p.positive,0), COALESCE(p.neutral,0), COALESCE(p.negative,0)
  FROM days d
  LEFT JOIN p ON p.day = d.day
  LEFT JOIN vv ON vv.day = d.day
  ORDER BY d.day;
$$;

-- 5. Top voices talking about a brand
CREATE OR REPLACE FUNCTION public.brand_top_voices(_brand_id uuid, _days integer DEFAULT 30, _limit integer DEFAULT 10)
RETURNS TABLE(user_id uuid, display_name text, avatar_url text, trust_score integer,
              posts integer, engagement integer, followers integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH base AS (
    SELECT i.user_id, COUNT(*)::int AS posts,
           COALESCE(SUM((SELECT COUNT(*) FROM public.post_likes pl WHERE pl.item_id = i.id)),0)::int
         + COALESCE(SUM((SELECT COUNT(*) FROM public.reposts r WHERE r.item_id = i.id)),0)::int
         + COALESCE(SUM((SELECT COUNT(*) FROM public.post_comments c WHERE c.item_id = i.id)),0)::int AS engagement
    FROM public.items i
    WHERE i.brand_id = _brand_id AND i.created_at >= now() - make_interval(days => _days)
    GROUP BY i.user_id
  )
  SELECT b.user_id, pr.display_name, pr.avatar_url, pr.trust_score,
         b.posts, b.engagement,
         (SELECT COUNT(*) FROM public.follows f WHERE f.followee_id = b.user_id)::int
  FROM base b
  LEFT JOIN public.profiles pr ON pr.id = b.user_id
  ORDER BY b.engagement DESC, pr.trust_score DESC NULLS LAST, b.posts DESC
  LIMIT _limit;
$$;

-- 6. Crisis detection on new negative signal
CREATE OR REPLACE FUNCTION public.trg_brand_crisis_check()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _brand uuid;
  _recent_total int;
  _recent_neg int;
  _base_total int;
  _base_neg int;
  _recent_share numeric;
  _base_share numeric;
  _alert_id uuid;
  _m record;
BEGIN
  IF TG_TABLE_NAME = 'brand_votes' THEN
    _brand := NEW.brand_id;
  ELSE
    SELECT i.brand_id INTO _brand FROM public.items i WHERE i.id = NEW.item_id;
  END IF;
  IF _brand IS NULL OR NEW.verdict <> 'trash' THEN RETURN NEW; END IF;

  SELECT COUNT(*), COUNT(*) FILTER (WHERE verdict='trash') INTO _recent_total, _recent_neg
  FROM (
    SELECT verdict, created_at FROM public.brand_votes WHERE brand_id = _brand
    UNION ALL
    SELECT vt.verdict, vt.created_at FROM public.votes vt JOIN public.items i ON i.id = vt.item_id WHERE i.brand_id = _brand
  ) u WHERE created_at >= now() - interval '7 days';

  IF _recent_total < 10 THEN RETURN NEW; END IF;

  SELECT COUNT(*), COUNT(*) FILTER (WHERE verdict='trash') INTO _base_total, _base_neg
  FROM (
    SELECT verdict, created_at FROM public.brand_votes WHERE brand_id = _brand
    UNION ALL
    SELECT vt.verdict, vt.created_at FROM public.votes vt JOIN public.items i ON i.id = vt.item_id WHERE i.brand_id = _brand
  ) u WHERE created_at >= now() - interval '37 days' AND created_at < now() - interval '7 days';

  IF _base_total < 10 THEN RETURN NEW; END IF;

  _recent_share := 100.0 * _recent_neg / _recent_total;
  _base_share := 100.0 * _base_neg / _base_total;

  IF _recent_share < _base_share + 30 THEN RETURN NEW; END IF;

  SELECT id INTO _alert_id FROM public.brand_crisis_alerts
  WHERE brand_id = _brand AND resolved_at IS NULL LIMIT 1;
  IF _alert_id IS NOT NULL THEN RETURN NEW; END IF;

  INSERT INTO public.brand_crisis_alerts (brand_id, negative_share, baseline_share, sample_size)
  VALUES (_brand, ROUND(_recent_share, 1), ROUND(_base_share, 1), _recent_total);

  FOR _m IN
    SELECT owner_id AS uid FROM public.brands WHERE id = _brand
    UNION
    SELECT user_id AS uid FROM public.brand_members WHERE brand_id = _brand AND user_id IS NOT NULL
  LOOP
    IF _m.uid IS NOT NULL THEN
      PERFORM public.notify(_m.uid, NULL, 'brand_crisis', NULL, NULL);
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE TRIGGER brand_votes_crisis AFTER INSERT OR UPDATE ON public.brand_votes
FOR EACH ROW EXECUTE FUNCTION public.trg_brand_crisis_check();

CREATE TRIGGER votes_brand_crisis AFTER INSERT ON public.votes
FOR EACH ROW EXECUTE FUNCTION public.trg_brand_crisis_check();