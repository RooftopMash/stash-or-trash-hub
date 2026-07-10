-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'brand', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- SHARED updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES additions
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS trust_score integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS avatar_url text;

-- BRANDS
CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  logo_url text,
  website text,
  category text,
  verified boolean NOT NULL DEFAULT false,
  trust_score integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.brands TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT ALL ON public.brands TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands are viewable by everyone" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Users can create brands" ON public.brands
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners or admins can update brands" ON public.brands
  FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners or admins can delete brands" ON public.brands
  FOR DELETE TO authenticated
  USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-grant the brand role to a brand's owner
CREATE OR REPLACE FUNCTION public.grant_brand_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.owner_id, 'brand')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_brand_created AFTER INSERT ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.grant_brand_role();

-- Protect privileged brand fields (verified / trust_score)
CREATE OR REPLACE FUNCTION public.protect_brand_privileged_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.verified IS DISTINCT FROM OLD.verified
     AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.verified := OLD.verified;
  END IF;
  IF NEW.trust_score IS DISTINCT FROM OLD.trust_score
     AND COALESCE(current_setting('app.allow_trust_update', true), '') <> '1'
     AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.trust_score := OLD.trust_score;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER protect_brand_fields BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.protect_brand_privileged_fields();

-- Protect profile trust_score
CREATE OR REPLACE FUNCTION public.protect_profile_trust()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.trust_score IS DISTINCT FROM OLD.trust_score
     AND COALESCE(current_setting('app.allow_trust_update', true), '') <> '1'
     AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.trust_score := OLD.trust_score;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER protect_profile_trust_field BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_trust();

-- ITEMS: link posts to a brand + category
ALTER TABLE public.items
  ADD COLUMN IF NOT EXISTS brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS category text;

-- TRUST recompute functions
CREATE OR REPLACE FUNCTION public.recompute_brand_trust(_brand_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s int; t int; total int; score int;
BEGIN
  IF _brand_id IS NULL THEN RETURN; END IF;
  SELECT count(*) FILTER (WHERE v.verdict = 'stash'),
         count(*) FILTER (WHERE v.verdict = 'trash')
    INTO s, t
  FROM public.votes v JOIN public.items i ON i.id = v.item_id
  WHERE i.brand_id = _brand_id;
  total := COALESCE(s, 0) + COALESCE(t, 0);
  IF total = 0 THEN score := 0; ELSE score := round(100.0 * COALESCE(s, 0) / total); END IF;
  PERFORM set_config('app.allow_trust_update', '1', true);
  UPDATE public.brands SET trust_score = score WHERE id = _brand_id;
  PERFORM set_config('app.allow_trust_update', '0', true);
END; $$;

CREATE OR REPLACE FUNCTION public.recompute_user_trust(_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE votes_c int; items_c int; score int;
BEGIN
  IF _user_id IS NULL THEN RETURN; END IF;
  SELECT count(*) INTO votes_c FROM public.votes WHERE user_id = _user_id;
  SELECT count(*) INTO items_c FROM public.items WHERE user_id = _user_id;
  score := least(100, votes_c + items_c * 5);
  PERFORM set_config('app.allow_trust_update', '1', true);
  UPDATE public.profiles SET trust_score = score WHERE id = _user_id;
  PERFORM set_config('app.allow_trust_update', '0', true);
END; $$;

CREATE OR REPLACE FUNCTION public.trg_votes_recompute()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE bid uuid;
BEGIN
  SELECT brand_id INTO bid FROM public.items WHERE id = COALESCE(NEW.item_id, OLD.item_id);
  PERFORM public.recompute_brand_trust(bid);
  PERFORM public.recompute_user_trust(COALESCE(NEW.user_id, OLD.user_id));
  RETURN COALESCE(NEW, OLD);
END; $$;
CREATE TRIGGER votes_recompute AFTER INSERT OR UPDATE OR DELETE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.trg_votes_recompute();

CREATE OR REPLACE FUNCTION public.trg_items_recompute()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.recompute_user_trust(COALESCE(NEW.user_id, OLD.user_id));
  PERFORM public.recompute_brand_trust(COALESCE(NEW.brand_id, OLD.brand_id));
  RETURN COALESCE(NEW, OLD);
END; $$;
CREATE TRIGGER items_recompute AFTER INSERT OR DELETE ON public.items
  FOR EACH ROW EXECUTE FUNCTION public.trg_items_recompute();

-- BRAND VERIFICATION REQUESTS
CREATE TABLE public.brand_verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  requested_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  message text,
  reviewed_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.brand_verification_requests TO authenticated;
GRANT ALL ON public.brand_verification_requests TO service_role;
ALTER TABLE public.brand_verification_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and admins can view verification requests"
  ON public.brand_verification_requests FOR SELECT TO authenticated
  USING (auth.uid() = requested_by OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Brand owners can request verification"
  ON public.brand_verification_requests FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = requested_by
    AND EXISTS (SELECT 1 FROM public.brands b WHERE b.id = brand_id AND b.owner_id = auth.uid())
  );
CREATE POLICY "Admins can review verification requests"
  ON public.brand_verification_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_verification_updated_at BEFORE UPDATE ON public.brand_verification_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- MESSAGES
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Recipients can update their messages" ON public.messages
  FOR UPDATE TO authenticated USING (auth.uid() = recipient_id) WITH CHECK (auth.uid() = recipient_id);