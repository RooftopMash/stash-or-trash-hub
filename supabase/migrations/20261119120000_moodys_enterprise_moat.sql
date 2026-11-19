-- =========================================================================
-- MIGRATION: Moody's of Brand Trust — Enterprise Moat & Global Anti-Counterfeit
-- Tables:
--   1. brand_domain_claims      (Hardened corporate domain + DNS TXT verification)
--   2. brand_operators          (Brand-owner allocated shift operators)
--   3. inbound_call_requests    (Tab-independent persistent customer callback queue)
--   4. cx_turnarounds           (Multi-region CX lifecycle & revenue-saved ledger)
--   5. brand_oem_batches        (Global OEM SKU / batch / serial prefix whitelist)
--   6. brand_authorized_dealers (Official retail & regional channel whitelist)
--   7. counterfeit_scan_events  (Global grey-market & counterfeit intercept log)
--   8. brand_rating_snapshots   (Immutable monthly Moody's credit-style snapshots)
-- =========================================================================

-- 1. Corporate Domain Claims
CREATE TABLE IF NOT EXISTS public.brand_domain_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_slug text NOT NULL,
  brand_name text NOT NULL,
  official_domain text NOT NULL,
  claimant_uid text NOT NULL,
  claimant_email text NOT NULL,
  verification_method text NOT NULL CHECK (verification_method IN ('corporate_email', 'dns_txt', 'admin_approved')),
  dns_txt_token text NOT NULL,
  dns_verified boolean NOT NULL DEFAULT false,
  email_verified boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT brand_domain_claims_unique_brand_claimant UNIQUE (brand_slug, claimant_uid)
);

CREATE INDEX IF NOT EXISTS brand_domain_claims_slug_idx ON public.brand_domain_claims (brand_slug, status);
GRANT SELECT, INSERT, UPDATE ON public.brand_domain_claims TO anon, authenticated;
GRANT ALL ON public.brand_domain_claims TO service_role;
ALTER TABLE public.brand_domain_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read domain claims" ON public.brand_domain_claims;
CREATE POLICY "Read domain claims" ON public.brand_domain_claims FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert domain claims" ON public.brand_domain_claims;
CREATE POLICY "Insert domain claims" ON public.brand_domain_claims FOR INSERT
  WITH CHECK (char_length(brand_slug) > 0 AND char_length(claimant_uid) > 0 AND char_length(official_domain) > 2);
DROP POLICY IF EXISTS "Update domain claims" ON public.brand_domain_claims;
CREATE POLICY "Update domain claims" ON public.brand_domain_claims FOR UPDATE
  USING (char_length(brand_slug) > 0)
  WITH CHECK (char_length(brand_slug) > 0);

-- 2. Brand Operators (Owner-Allocated Desk Team)
CREATE TABLE IF NOT EXISTS public.brand_operators (
  id text PRIMARY KEY,
  brand_slug text NOT NULL,
  owner_uid text NOT NULL,
  operator_email text NOT NULL,
  operator_name text NOT NULL,
  role_title text NOT NULL DEFAULT 'Brand CX Specialist',
  shift_label text NOT NULL DEFAULT 'Global Shift A (08:00 - 17:00)',
  country_code text NOT NULL DEFAULT 'GLOBAL',
  status text NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'busy', 'offline', 'revoked')),
  verified_by_owner boolean NOT NULL DEFAULT true,
  trashes_flipped integer NOT NULL DEFAULT 0,
  vouchers_issued integer NOT NULL DEFAULT 0,
  median_response_minutes integer NOT NULL DEFAULT 6,
  client_call_rating numeric(3,1) NOT NULL DEFAULT 4.8,
  live_broadcasts_hosted integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS brand_operators_slug_idx ON public.brand_operators (brand_slug, status);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_operators TO anon, authenticated;
GRANT ALL ON public.brand_operators TO service_role;
ALTER TABLE public.brand_operators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read brand operators" ON public.brand_operators;
CREATE POLICY "Read brand operators" ON public.brand_operators FOR SELECT USING (true);
DROP POLICY IF EXISTS "Manage brand operators" ON public.brand_operators;
CREATE POLICY "Manage brand operators" ON public.brand_operators FOR INSERT
  WITH CHECK (char_length(brand_slug) > 0 AND char_length(owner_uid) > 0 AND char_length(operator_email) > 3);
DROP POLICY IF EXISTS "Update brand operators" ON public.brand_operators;
CREATE POLICY "Update brand operators" ON public.brand_operators FOR UPDATE
  USING (char_length(brand_slug) > 0)
  WITH CHECK (char_length(brand_slug) > 0);
DROP POLICY IF EXISTS "Delete brand operators" ON public.brand_operators;
CREATE POLICY "Delete brand operators" ON public.brand_operators FOR DELETE
  USING (char_length(brand_slug) > 0);

-- 3. Durable Inbound Call Requests (Tab-Independent Callback Queue)
CREATE TABLE IF NOT EXISTS public.inbound_call_requests (
  id text PRIMARY KEY,
  brand_slug text NOT NULL,
  brand_name text NOT NULL,
  customer_id text NOT NULL,
  customer_name text NOT NULL,
  issue_topic text NOT NULL,
  product_name text NOT NULL,
  batch_or_receipt_number text,
  urgency text NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent')),
  requested_call_mode text NOT NULL DEFAULT 'audio' CHECK (requested_call_mode IN ('audio', 'video')),
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'answered', 'resolved', 'missed')),
  assigned_operator_id text,
  operator_notes text,
  country_code text NOT NULL DEFAULT 'GLOBAL',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS inbound_call_requests_slug_idx ON public.inbound_call_requests (brand_slug, status, created_at DESC);
GRANT SELECT, INSERT, UPDATE ON public.inbound_call_requests TO anon, authenticated;
GRANT ALL ON public.inbound_call_requests TO service_role;
ALTER TABLE public.inbound_call_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read inbound call requests" ON public.inbound_call_requests;
CREATE POLICY "Read inbound call requests" ON public.inbound_call_requests FOR SELECT USING (true);
DROP POLICY IF EXISTS "Create inbound call requests" ON public.inbound_call_requests;
CREATE POLICY "Create inbound call requests" ON public.inbound_call_requests FOR INSERT
  WITH CHECK (char_length(brand_slug) > 0 AND char_length(customer_id) > 0);
DROP POLICY IF EXISTS "Update inbound call requests" ON public.inbound_call_requests;
CREATE POLICY "Update inbound call requests" ON public.inbound_call_requests FOR UPDATE
  USING (char_length(brand_slug) > 0)
  WITH CHECK (char_length(brand_slug) > 0);

-- 4. CX Lifecycle Turnarounds (14-Day Cure Window + Multi-Currency ROI)
CREATE TABLE IF NOT EXISTS public.cx_turnarounds (
  id text PRIMARY KEY,
  brand_slug text NOT NULL,
  brand_name text NOT NULL,
  client_name text NOT NULL,
  stage1_source text NOT NULL,
  stage2_signal text NOT NULL,
  initial_verdict text NOT NULL CHECK (initial_verdict IN ('TRASH', 'AT_RISK')),
  operator_assigned text NOT NULL,
  action_taken text NOT NULL,
  voucher_code text,
  final_verdict text NOT NULL DEFAULT 'STASH' CHECK (final_verdict IN ('STASH', 'PENDING', 'UNRESOLVED')),
  revenue_retained_amount numeric(12,2) NOT NULL DEFAULT 0,
  currency_code text NOT NULL DEFAULT 'USD',
  country_code text NOT NULL DEFAULT 'GLOBAL',
  sla_minutes integer NOT NULL DEFAULT 15,
  resolved_within_cure_window boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cx_turnarounds_slug_idx ON public.cx_turnarounds (brand_slug, created_at DESC);
GRANT SELECT, INSERT, UPDATE ON public.cx_turnarounds TO anon, authenticated;
GRANT ALL ON public.cx_turnarounds TO service_role;
ALTER TABLE public.cx_turnarounds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read cx turnarounds" ON public.cx_turnarounds;
CREATE POLICY "Read cx turnarounds" ON public.cx_turnarounds FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert cx turnarounds" ON public.cx_turnarounds;
CREATE POLICY "Insert cx turnarounds" ON public.cx_turnarounds FOR INSERT
  WITH CHECK (char_length(brand_slug) > 0 AND char_length(client_name) > 0);
DROP POLICY IF EXISTS "Update cx turnarounds" ON public.cx_turnarounds;
CREATE POLICY "Update cx turnarounds" ON public.cx_turnarounds FOR UPDATE
  USING (char_length(brand_slug) > 0)
  WITH CHECK (char_length(brand_slug) > 0);

-- 5. Brand OEM Batches & Serial Prefix Registry
CREATE TABLE IF NOT EXISTS public.brand_oem_batches (
  id text PRIMARY KEY,
  brand_slug text NOT NULL,
  brand_name text NOT NULL,
  industry_sector text NOT NULL CHECK (industry_sector IN ('groceries_fmcg', 'luxury_watches', 'athletic_footwear', 'automotive_parts', 'electronics_appliances', 'pharmaceuticals', 'general_retail')),
  sku_code text NOT NULL,
  batch_prefix text NOT NULL,
  serial_regex text,
  authentic_portal_domain text,
  notes text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'recalled', 'expired')),
  created_by_uid text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS brand_oem_batches_slug_idx ON public.brand_oem_batches (brand_slug, status);
CREATE INDEX IF NOT EXISTS brand_oem_batches_prefix_idx ON public.brand_oem_batches (batch_prefix);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_oem_batches TO anon, authenticated;
GRANT ALL ON public.brand_oem_batches TO service_role;
ALTER TABLE public.brand_oem_batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read oem batches" ON public.brand_oem_batches;
CREATE POLICY "Public read oem batches" ON public.brand_oem_batches FOR SELECT USING (true);
DROP POLICY IF EXISTS "Manage oem batches" ON public.brand_oem_batches;
CREATE POLICY "Manage oem batches" ON public.brand_oem_batches FOR INSERT
  WITH CHECK (char_length(brand_slug) > 0 AND char_length(batch_prefix) > 1 AND char_length(created_by_uid) > 0);
DROP POLICY IF EXISTS "Update oem batches" ON public.brand_oem_batches;
CREATE POLICY "Update oem batches" ON public.brand_oem_batches FOR UPDATE
  USING (char_length(brand_slug) > 0)
  WITH CHECK (char_length(brand_slug) > 0);
DROP POLICY IF EXISTS "Delete oem batches" ON public.brand_oem_batches;
CREATE POLICY "Delete oem batches" ON public.brand_oem_batches FOR DELETE
  USING (char_length(brand_slug) > 0);

-- 6. Brand Authorized Dealers & Retail Whitelist
CREATE TABLE IF NOT EXISTS public.brand_authorized_dealers (
  id text PRIMARY KEY,
  brand_slug text NOT NULL,
  dealer_name text NOT NULL,
  city text NOT NULL,
  country_code text NOT NULL DEFAULT 'GLOBAL',
  region text NOT NULL DEFAULT 'Global Authorized Network',
  authorized_channels text NOT NULL DEFAULT 'Flagship Boutique & Official E-Commerce',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS brand_authorized_dealers_slug_idx ON public.brand_authorized_dealers (brand_slug, country_code, active);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_authorized_dealers TO anon, authenticated;
GRANT ALL ON public.brand_authorized_dealers TO service_role;
ALTER TABLE public.brand_authorized_dealers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read authorized dealers" ON public.brand_authorized_dealers;
CREATE POLICY "Public read authorized dealers" ON public.brand_authorized_dealers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert authorized dealers" ON public.brand_authorized_dealers;
CREATE POLICY "Insert authorized dealers" ON public.brand_authorized_dealers FOR INSERT
  WITH CHECK (char_length(brand_slug) > 0 AND char_length(dealer_name) > 1);
DROP POLICY IF EXISTS "Update authorized dealers" ON public.brand_authorized_dealers;
CREATE POLICY "Update authorized dealers" ON public.brand_authorized_dealers FOR UPDATE
  USING (char_length(brand_slug) > 0)
  WITH CHECK (char_length(brand_slug) > 0);
DROP POLICY IF EXISTS "Delete authorized dealers" ON public.brand_authorized_dealers;
CREATE POLICY "Delete authorized dealers" ON public.brand_authorized_dealers FOR DELETE
  USING (char_length(brand_slug) > 0);

-- 7. Counterfeit & Grey-Market Scan Events
CREATE TABLE IF NOT EXISTS public.counterfeit_scan_events (
  id text PRIMARY KEY,
  brand_slug text NOT NULL,
  sku_or_batch text NOT NULL,
  matched_oem_batch_id text,
  country_code text NOT NULL DEFAULT 'GLOBAL',
  city_or_store text NOT NULL DEFAULT 'Unspecified Location',
  scan_outcome text NOT NULL CHECK (scan_outcome IN ('matched_oem', 'suspected_grey_market_leak', 'unverified_batch', 'recalled_batch')),
  estimated_loss_recovered_usd numeric(12,2) NOT NULL DEFAULT 0,
  reporter_uid text NOT NULL DEFAULT 'anonymous',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS counterfeit_scan_events_slug_idx ON public.counterfeit_scan_events (brand_slug, scan_outcome, created_at DESC);
GRANT SELECT, INSERT ON public.counterfeit_scan_events TO anon, authenticated;
GRANT ALL ON public.counterfeit_scan_events TO service_role;
ALTER TABLE public.counterfeit_scan_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Read counterfeit scan events" ON public.counterfeit_scan_events;
CREATE POLICY "Read counterfeit scan events" ON public.counterfeit_scan_events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Insert counterfeit scan events" ON public.counterfeit_scan_events;
CREATE POLICY "Insert counterfeit scan events" ON public.counterfeit_scan_events FOR INSERT
  WITH CHECK (char_length(brand_slug) > 0 AND char_length(sku_or_batch) > 0);

-- 8. Immutable Monthly Moody's Credit-Style Rating Snapshots
CREATE TABLE IF NOT EXISTS public.brand_rating_snapshots (
  id text PRIMARY KEY,
  brand_slug text NOT NULL,
  snapshot_month text NOT NULL, -- YYYY-MM
  weighted_trust_score numeric(5,2) NOT NULL,
  proof_verified_votes integer NOT NULL DEFAULT 0,
  standard_votes integer NOT NULL DEFAULT 0,
  sla_resolution_rate numeric(5,2) NOT NULL DEFAULT 0,
  cure_window_penalties numeric(5,2) NOT NULL DEFAULT 0,
  counterfeit_intercept_score numeric(5,2) NOT NULL DEFAULT 0,
  composite_rating numeric(5,2) NOT NULL,
  letter_grade text NOT NULL CHECK (letter_grade IN ('AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-', 'BBB+', 'BBB', 'BB', 'B', 'CCC', 'D')),
  outlook text NOT NULL CHECK (outlook IN ('Positive', 'Stable', 'Watchlist', 'Negative')),
  methodology_version text NOT NULL DEFAULT 'SOT-Moodys-v2.0',
  locked_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT brand_rating_snapshots_unique_month UNIQUE (brand_slug, snapshot_month)
);

CREATE INDEX IF NOT EXISTS brand_rating_snapshots_slug_idx ON public.brand_rating_snapshots (brand_slug, snapshot_month DESC);
-- Intentionally immutable: only SELECT and INSERT allowed for anon/authenticated (no UPDATE/DELETE)
GRANT SELECT, INSERT ON public.brand_rating_snapshots TO anon, authenticated;
GRANT ALL ON public.brand_rating_snapshots TO service_role;
ALTER TABLE public.brand_rating_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read brand rating snapshots" ON public.brand_rating_snapshots;
CREATE POLICY "Public read brand rating snapshots" ON public.brand_rating_snapshots FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lock new monthly rating snapshot" ON public.brand_rating_snapshots;
CREATE POLICY "Lock new monthly rating snapshot" ON public.brand_rating_snapshots FOR INSERT
  WITH CHECK (char_length(brand_slug) > 0 AND char_length(snapshot_month) = 7 AND char_length(locked_hash) >= 16);

-- Realtime publication for cross-tab / cross-device closed-tab wakeups
ALTER TABLE public.inbound_call_requests REPLICA IDENTITY FULL;
ALTER TABLE public.cx_turnarounds REPLICA IDENTITY FULL;
ALTER TABLE public.counterfeit_scan_events REPLICA IDENTITY FULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.inbound_call_requests;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.cx_turnarounds;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.counterfeit_scan_events;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
