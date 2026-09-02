-- SOT Enterprise Roadmap Migration
-- Creates brand_members, brand_responses, crisis_alerts, brand_webhooks
-- Security definer functions and RLS policies

-- 1. SECURITY DEFINER FUNCTION FOR BRAND ROLES
CREATE OR REPLACE FUNCTION public.has_brand_role(_brand_id uuid, _role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner_id uuid;
  v_member_role text;
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Owner is treated as admin
  SELECT owner_id INTO v_owner_id FROM public.brands WHERE id = _brand_id;
  IF v_owner_id IS NOT NULL AND v_owner_id = v_user_id THEN
    RETURN true;
  END IF;

  -- Check brand_members table
  SELECT role INTO v_member_role
  FROM public.brand_members
  WHERE brand_id = _brand_id
    AND user_id = v_user_id
    AND status = 'active';

  IF v_member_role IS NULL THEN
    RETURN false;
  END IF;

  IF _role = 'viewer' THEN
    RETURN v_member_role IN ('admin', 'analyst', 'viewer');
  ELSIF _role = 'analyst' THEN
    RETURN v_member_role IN ('admin', 'analyst');
  ELSIF _role = 'admin' THEN
    RETURN v_member_role = 'admin';
  END IF;

  RETURN false;
END;
$$;

-- 2. BRAND MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.brand_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role text NOT NULL CHECK (role IN ('admin', 'analyst', 'viewer')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT brand_members_brand_user_key UNIQUE (brand_id, user_id),
  CONSTRAINT brand_members_brand_email_key UNIQUE (brand_id, email)
);

CREATE INDEX IF NOT EXISTS brand_members_brand_id_idx ON public.brand_members (brand_id);
CREATE INDEX IF NOT EXISTS brand_members_user_id_idx ON public.brand_members (user_id);
CREATE INDEX IF NOT EXISTS brand_members_email_idx ON public.brand_members (email);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_members TO authenticated;
GRANT ALL ON public.brand_members TO service_role;
ALTER TABLE public.brand_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Brand members viewable by brand team" ON public.brand_members;
CREATE POLICY "Brand members viewable by brand team" ON public.brand_members FOR SELECT TO authenticated
  USING (has_brand_role(brand_id, 'viewer') OR user_id = auth.uid());

DROP POLICY IF EXISTS "Brand admins can insert members" ON public.brand_members;
CREATE POLICY "Brand admins can insert members" ON public.brand_members FOR INSERT TO authenticated
  WITH CHECK (has_brand_role(brand_id, 'admin'));

DROP POLICY IF EXISTS "Brand admins can update members" ON public.brand_members;
CREATE POLICY "Brand admins can update members" ON public.brand_members FOR UPDATE TO authenticated
  USING (has_brand_role(brand_id, 'admin')) WITH CHECK (has_brand_role(brand_id, 'admin'));

DROP POLICY IF EXISTS "Brand admins can delete members" ON public.brand_members;
CREATE POLICY "Brand admins can delete members" ON public.brand_members FOR DELETE TO authenticated
  USING (has_brand_role(brand_id, 'admin') OR user_id = auth.uid());

-- 3. ADDITIVE COLUMNS ON ITEMS & BRAND RESPONSES TABLE
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS sentiment text CHECK (sentiment IN ('positive', 'neutral', 'negative', 'unknown')) DEFAULT 'unknown';
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS responded_at timestamptz;

CREATE TABLE IF NOT EXISTS public.brand_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  response_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS brand_responses_item_id_idx ON public.brand_responses (item_id);
CREATE INDEX IF NOT EXISTS brand_responses_brand_id_idx ON public.brand_responses (brand_id);

GRANT SELECT ON public.brand_responses TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.brand_responses TO authenticated;
GRANT ALL ON public.brand_responses TO service_role;
ALTER TABLE public.brand_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Brand responses public select" ON public.brand_responses;
CREATE POLICY "Brand responses public select" ON public.brand_responses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Brand analysts can create response" ON public.brand_responses;
CREATE POLICY "Brand analysts can create response" ON public.brand_responses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND has_brand_role(brand_id, 'analyst'));

DROP POLICY IF EXISTS "Brand analysts can delete response" ON public.brand_responses;
CREATE POLICY "Brand analysts can delete response" ON public.brand_responses FOR DELETE TO authenticated
  USING (has_brand_role(brand_id, 'analyst'));

-- Trigger for brand response
CREATE OR REPLACE FUNCTION public.trg_on_brand_response() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_post_author uuid;
BEGIN
  UPDATE public.items SET responded_at = NEW.created_at WHERE id = NEW.item_id;

  -- Notify post author
  SELECT user_id INTO v_post_author FROM public.items WHERE id = NEW.item_id;
  IF v_post_author IS NOT NULL AND v_post_author <> NEW.user_id THEN
    PERFORM public.notify(v_post_author, NEW.user_id, 'brand_response', NEW.item_id, NULL);
  END IF;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_brand_response_inserted ON public.brand_responses;
CREATE TRIGGER trg_brand_response_inserted
  AFTER INSERT ON public.brand_responses
  FOR EACH ROW EXECUTE FUNCTION public.trg_on_brand_response();

-- 4. CRISIS ALERTS
CREATE TABLE IF NOT EXISTS public.crisis_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  alert_type text NOT NULL,
  message text NOT NULL,
  negative_share double precision NOT NULL,
  baseline_share double precision NOT NULL,
  acknowledged boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS crisis_alerts_brand_id_idx ON public.crisis_alerts (brand_id);

GRANT SELECT, UPDATE ON public.crisis_alerts TO authenticated;
GRANT ALL ON public.crisis_alerts TO service_role;
ALTER TABLE public.crisis_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Brand team can view crisis alerts" ON public.crisis_alerts;
CREATE POLICY "Brand team can view crisis alerts" ON public.crisis_alerts FOR SELECT TO authenticated
  USING (has_brand_role(brand_id, 'viewer'));

DROP POLICY IF EXISTS "Brand team can acknowledge crisis alerts" ON public.crisis_alerts;
CREATE POLICY "Brand team can acknowledge crisis alerts" ON public.crisis_alerts FOR UPDATE TO authenticated
  USING (has_brand_role(brand_id, 'analyst'))
  WITH CHECK (has_brand_role(brand_id, 'analyst'));

-- 5. BRAND WEBHOOKS
CREATE TABLE IF NOT EXISTS public.brand_webhooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  url text NOT NULL,
  secret text NOT NULL,
  events text[] NOT NULL DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS brand_webhooks_brand_id_idx ON public.brand_webhooks (brand_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_webhooks TO authenticated;
GRANT ALL ON public.brand_webhooks TO service_role;
ALTER TABLE public.brand_webhooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Brand admins manage webhooks" ON public.brand_webhooks;
CREATE POLICY "Brand admins manage webhooks" ON public.brand_webhooks FOR ALL TO authenticated
  USING (has_brand_role(brand_id, 'admin'))
  WITH CHECK (has_brand_role(brand_id, 'admin'));

-- 6. CRISIS EVALUATION FUNCTION
CREATE OR REPLACE FUNCTION public.evaluate_crisis_alert(_brand_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recent_total int;
  v_recent_neg int;
  v_baseline_total int;
  v_baseline_neg int;
  v_recent_share float := 0;
  v_baseline_share float := 0;
  v_recent_alert_count int;
  v_alert_created boolean := false;
BEGIN
  IF _brand_id IS NULL THEN
    RETURN json_build_object('triggered', false, 'reason', 'no brand_id');
  END IF;

  SELECT
    count(*),
    count(*) FILTER (WHERE i.sentiment = 'negative' OR v.verdict = 'trash')
  INTO v_recent_total, v_recent_neg
  FROM public.items i
  LEFT JOIN public.votes v ON v.item_id = i.id
  WHERE i.brand_id = _brand_id
    AND i.created_at >= (now() - interval '7 days');

  SELECT
    count(*),
    count(*) FILTER (WHERE i.sentiment = 'negative' OR v.verdict = 'trash')
  INTO v_baseline_total, v_baseline_neg
  FROM public.items i
  LEFT JOIN public.votes v ON v.item_id = i.id
  WHERE i.brand_id = _brand_id
    AND i.created_at >= (now() - interval '37 days')
    AND i.created_at < (now() - interval '7 days');

  IF v_recent_total > 0 THEN
    v_recent_share := v_recent_neg::float / v_recent_total::float;
  END IF;

  IF v_baseline_total > 0 THEN
    v_baseline_share := v_baseline_neg::float / v_baseline_total::float;
  ELSE
    v_baseline_share := 0.2;
  END IF;

  SELECT count(*) INTO v_recent_alert_count
  FROM public.crisis_alerts
  WHERE brand_id = _brand_id
    AND created_at >= (now() - interval '24 hours');

  IF (v_recent_share - v_baseline_share) >= 0.3 AND v_recent_alert_count = 0 AND v_recent_total >= 3 THEN
    INSERT INTO public.crisis_alerts (
      brand_id,
      alert_type,
      message,
      negative_share,
      baseline_share
    ) VALUES (
      _brand_id,
      'negative_sentiment_spike',
      'Negative sentiment / trash share jumped by ' || round(((v_recent_share - v_baseline_share) * 100)::numeric, 1) || '% over baseline.',
      v_recent_share,
      v_baseline_share
    );
    v_alert_created := true;
  END IF;

  RETURN json_build_object(
    'triggered', v_alert_created,
    'recent_share', v_recent_share,
    'baseline_share', v_baseline_share
  );
END;
$$;

-- Enable Realtime
ALTER TABLE public.brand_responses REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.brand_responses;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

ALTER TABLE public.crisis_alerts REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.crisis_alerts;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
