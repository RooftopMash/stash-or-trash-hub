/**
 * Global OEM Batch, Serial Prefix, Authorized Dealer Whitelist & Counterfeit Intercept Registry
 * Supports all global industries:
 *  - groceries_fmcg (Coca-Cola, Nestlé, Unilever)
 *  - luxury_watches (Rolex, Omega, Patek Philippe)
 *  - athletic_footwear (Nike, Adidas, Puma)
 *  - automotive_parts (Toyota, BMW, Bosch OEM parts & VIN WMI)
 *  - electronics_appliances (Apple, Samsung, Sony, LG)
 */

import { supabase } from "@/integrations/supabase/client";

export type IndustrySector =
  | "groceries_fmcg"
  | "luxury_watches"
  | "athletic_footwear"
  | "automotive_parts"
  | "electronics_appliances"
  | "pharmaceuticals"
  | "general_retail";

export interface BrandOemBatch {
  id: string;
  brand_slug: string;
  brand_name: string;
  industry_sector: IndustrySector;
  sku_code: string;
  batch_prefix: string;
  serial_regex?: string | null;
  authentic_portal_domain?: string | null;
  notes?: string | null;
  status: "active" | "recalled" | "expired";
  created_by_uid: string;
  created_at: string;
}

export interface BrandAuthorizedDealer {
  id: string;
  brand_slug: string;
  dealer_name: string;
  city: string;
  country_code: string;
  region: string;
  authorized_channels: string;
  active: boolean;
  created_at: string;
}

export type CounterfeitScanOutcome =
  | "matched_oem"
  | "suspected_grey_market_leak"
  | "unverified_batch"
  | "recalled_batch";

export interface CounterfeitScanEvent {
  id: string;
  brand_slug: string;
  sku_or_batch: string;
  matched_oem_batch_id?: string | null;
  country_code: string;
  city_or_store: string;
  scan_outcome: CounterfeitScanOutcome;
  estimated_loss_recovered_usd: number;
  reporter_uid: string;
  created_at: string;
}

export interface BatchVerificationVerdict {
  outcome: CounterfeitScanOutcome;
  authentic: boolean;
  confidencePct: number;
  matchedBatch: BrandOemBatch | null;
  matchedDealer: BrandAuthorizedDealer | null;
  headline: string;
  explanation: string;
  nextAction: string;
  persistedToPostgres: boolean;
}

const OEM_LOCAL_KEY = "sot_oem_batches_v1";
const DEALER_LOCAL_KEY = "sot_authorized_dealers_v1";
const SCAN_EVENTS_LOCAL_KEY = "sot_counterfeit_scan_events_v1";

// Publicly documented global OEM reference patterns so first-time testers can verify
// real-world multi-industry formats (Rolex, Nike, Toyota, Coca-Cola, Apple, Adidas)
const BUILTIN_GLOBAL_OEM_PATTERNS: BrandOemBatch[] = [
  {
    id: "builtin-nike-style",
    brand_slug: "nike",
    brand_name: "Nike",
    industry_sector: "athletic_footwear",
    sku_code: "CW2288-111 / DZ5485-612",
    batch_prefix: "CW2288",
    serial_regex: "^[A-Z]{2}\\d{4}-\\d{3}$",
    authentic_portal_domain: "nike.com",
    notes: "Standard 9-char Nike Global Style-Color code (e.g., CW2288-111, DD1391-100)",
    status: "active",
    created_by_uid: "sot-global-oem-index",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "builtin-toyota-oem",
    brand_slug: "toyota",
    brand_name: "Toyota Genuine Parts",
    industry_sector: "automotive_parts",
    sku_code: "90915-YZZD2 / 04465-0K240",
    batch_prefix: "90915",
    serial_regex: "^[0-9A-Z]{5}-[0-9A-Z]{5}$",
    authentic_portal_domain: "toyota.com",
    notes: "10-character Toyota Genuine Parts 5+5 OEM number or 17-char JTD/JTM/AHT VIN",
    status: "active",
    created_by_uid: "sot-global-oem-index",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "builtin-rolex-ref",
    brand_slug: "rolex",
    brand_name: "Rolex Geneva",
    industry_sector: "luxury_watches",
    sku_code: "126610LN / 126500LN / 116610",
    batch_prefix: "126610",
    serial_regex: "^(1[12][46]\\d{3}[A-Z]{0,4}|[A-Z0-9]{8})$",
    authentic_portal_domain: "rolex.com",
    notes: "6-digit Rolex reference or 8-char randomized post-2010 rehaut engraved serial",
    status: "active",
    created_by_uid: "sot-global-oem-index",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "builtin-coca-cola-gs1",
    brand_slug: "coca-cola",
    brand_name: "Coca-Cola",
    industry_sector: "groceries_fmcg",
    sku_code: "5449000000996 / 6001087",
    batch_prefix: "6001087",
    serial_regex: "^(5449\\d{9}|6001087\\d{6}|049\\d{9,10}|ZA-BATCH-\\d{4})$",
    authentic_portal_domain: "coca-cola.com",
    notes: "GS1 Coca-Cola bottling prefix (EU 5449, ZA 6001087, US 049) & lot codes",
    status: "active",
    created_by_uid: "sot-global-oem-index",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "builtin-adidas-art",
    brand_slug: "adidas",
    brand_name: "Adidas",
    industry_sector: "athletic_footwear",
    sku_code: "HQ4276 / IF6514",
    batch_prefix: "HQ42",
    serial_regex: "^[A-Z]{2}\\d{4}$",
    authentic_portal_domain: "adidas.com",
    notes: "Adidas 6-character Art. No. (2 uppercase letters + 4 digits)",
    status: "active",
    created_by_uid: "sot-global-oem-index",
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "builtin-apple-model",
    brand_slug: "apple",
    brand_name: "Apple",
    industry_sector: "electronics_appliances",
    sku_code: "A3106 / A2890 / MTUV3",
    batch_prefix: "A31",
    serial_regex: "^(A\\d{4}|[A-Z0-9]{10,12})$",
    authentic_portal_domain: "apple.com",
    notes: "Apple regulatory A-model & 10-12 character randomized serial format",
    status: "active",
    created_by_uid: "sot-global-oem-index",
    created_at: "2026-01-01T00:00:00Z",
  },
];

const BUILTIN_AUTHORIZED_DEALERS: BrandAuthorizedDealer[] = [
  {
    id: "dealer-nike-nyc",
    brand_slug: "nike",
    dealer_name: "Nike House of Innovation 000",
    city: "New York",
    country_code: "US",
    region: "North America",
    authorized_channels: "Nike Flagship & nike.com",
    active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "dealer-nike-london",
    brand_slug: "nike",
    dealer_name: "Niketown London Oxford Circus",
    city: "London",
    country_code: "GB",
    region: "Europe",
    authorized_channels: "Nike Flagship & JD Official",
    active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "dealer-rolex-geneva",
    brand_slug: "rolex",
    dealer_name: "Chronometrie Bucherer Geneva",
    city: "Geneva",
    country_code: "CH",
    region: "Europe",
    authorized_channels: "Official Rolex Jeweler",
    active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "dealer-toyota-jhb",
    brand_slug: "toyota",
    dealer_name: "Toyota South Africa Official Parts Network",
    city: "Johannesburg",
    country_code: "ZA",
    region: "Africa",
    authorized_channels: "Toyota Certified Dealerships",
    active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "dealer-coke-global",
    brand_slug: "coca-cola",
    dealer_name: "Coca-Cola Bottling Official Retail Partners",
    city: "Johannesburg",
    country_code: "ZA",
    region: "Global Bottling Network",
    authorized_channels: "Authorized Supermarkets & Distributors",
    active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
];

function readLocalArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalArray<T>(key: string, rows: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(rows));
  } catch {
    // ignore storage quota
  }
}

export async function fetchBrandOemBatches(brandSlug?: string): Promise<{
  batches: BrandOemBatch[];
  syncedToPostgres: boolean;
}> {
  const localCustom = readLocalArray<BrandOemBatch>(OEM_LOCAL_KEY);
  const builtin = brandSlug
    ? BUILTIN_GLOBAL_OEM_PATTERNS.filter((b) => b.brand_slug === brandSlug)
    : BUILTIN_GLOBAL_OEM_PATTERNS;

  try {
    const db = supabase as any;
    let query = db.from("brand_oem_batches").select("*").order("created_at", { ascending: false });
    if (brandSlug) query = query.eq("brand_slug", brandSlug);
    const { data, error } = await query;

    if (!error && Array.isArray(data)) {
      const mergedMap = new Map<string, BrandOemBatch>();
      [...data, ...builtin].forEach((row) => mergedMap.set(row.id, row));
      return { batches: Array.from(mergedMap.values()), syncedToPostgres: true };
    }
  } catch {
    // fallback
  }

  const filteredLocal = brandSlug
    ? localCustom.filter((b) => b.brand_slug === brandSlug)
    : localCustom;
  const mergedMap = new Map<string, BrandOemBatch>();
  [...filteredLocal, ...builtin].forEach((row) => mergedMap.set(row.id, row));
  return { batches: Array.from(mergedMap.values()), syncedToPostgres: false };
}

export async function registerBrandOemBatch(
  batch: Omit<BrandOemBatch, "id" | "created_at">,
): Promise<{ record: BrandOemBatch; syncedToPostgres: boolean }> {
  const record: BrandOemBatch = {
    ...batch,
    id: `oem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    batch_prefix: batch.batch_prefix.trim().toUpperCase(),
    sku_code: batch.sku_code.trim().toUpperCase(),
    created_at: new Date().toISOString(),
  };

  const localAll = readLocalArray<BrandOemBatch>(OEM_LOCAL_KEY);
  writeLocalArray(OEM_LOCAL_KEY, [record, ...localAll]);

  try {
    const db = supabase as any;
    const { error } = await db.from("brand_oem_batches").insert(record);
    if (!error) {
      return { record, syncedToPostgres: true };
    }
  } catch {
    // fallback
  }
  return { record, syncedToPostgres: false };
}

export async function removeBrandOemBatch(id: string): Promise<void> {
  const localAll = readLocalArray<BrandOemBatch>(OEM_LOCAL_KEY).filter((b) => b.id !== id);
  writeLocalArray(OEM_LOCAL_KEY, localAll);
  try {
    const db = supabase as any;
    await db.from("brand_oem_batches").delete().eq("id", id);
  } catch {
    // ignore
  }
}

export async function fetchAuthorizedDealers(brandSlug?: string): Promise<{
  dealers: BrandAuthorizedDealer[];
  syncedToPostgres: boolean;
}> {
  const localCustom = readLocalArray<BrandAuthorizedDealer>(DEALER_LOCAL_KEY);
  const builtin = brandSlug
    ? BUILTIN_AUTHORIZED_DEALERS.filter((d) => d.brand_slug === brandSlug)
    : BUILTIN_AUTHORIZED_DEALERS;

  try {
    const db = supabase as any;
    let query = db
      .from("brand_authorized_dealers")
      .select("*")
      .order("created_at", { ascending: false });
    if (brandSlug) query = query.eq("brand_slug", brandSlug);
    const { data, error } = await query;

    if (!error && Array.isArray(data)) {
      const map = new Map<string, BrandAuthorizedDealer>();
      [...data, ...builtin].forEach((d) => map.set(d.id, d));
      return { dealers: Array.from(map.values()), syncedToPostgres: true };
    }
  } catch {
    // fallback
  }

  const filteredLocal = brandSlug
    ? localCustom.filter((d) => d.brand_slug === brandSlug)
    : localCustom;
  const map = new Map<string, BrandAuthorizedDealer>();
  [...filteredLocal, ...builtin].forEach((d) => map.set(d.id, d));
  return { dealers: Array.from(map.values()), syncedToPostgres: false };
}

export async function addAuthorizedDealer(
  dealer: Omit<BrandAuthorizedDealer, "id" | "created_at">,
): Promise<{ record: BrandAuthorizedDealer; syncedToPostgres: boolean }> {
  const record: BrandAuthorizedDealer = {
    ...dealer,
    id: `dlr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    city: dealer.city.trim(),
    country_code: dealer.country_code.trim().toUpperCase() || "GLOBAL",
    created_at: new Date().toISOString(),
  };

  const localAll = readLocalArray<BrandAuthorizedDealer>(DEALER_LOCAL_KEY);
  writeLocalArray(DEALER_LOCAL_KEY, [record, ...localAll]);

  try {
    const db = supabase as any;
    const { error } = await db.from("brand_authorized_dealers").insert(record);
    if (!error) return { record, syncedToPostgres: true };
  } catch {
    // fallback
  }
  return { record, syncedToPostgres: false };
}

export async function fetchCounterfeitScanEvents(brandSlug: string): Promise<{
  events: CounterfeitScanEvent[];
  syncedToPostgres: boolean;
}> {
  const localEvents = readLocalArray<CounterfeitScanEvent>(SCAN_EVENTS_LOCAL_KEY).filter(
    (e) => e.brand_slug === brandSlug,
  );
  try {
    const db = supabase as any;
    const { data, error } = await db
      .from("counterfeit_scan_events")
      .select("*")
      .eq("brand_slug", brandSlug)
      .order("created_at", { ascending: false })
      .limit(40);
    if (!error && Array.isArray(data)) {
      const map = new Map<string, CounterfeitScanEvent>();
      [...data, ...localEvents].forEach((e) => map.set(e.id, e));
      return {
        events: Array.from(map.values()).sort((a, b) =>
          b.created_at.localeCompare(a.created_at),
        ),
        syncedToPostgres: true,
      };
    }
  } catch {
    // fallback
  }
  return { events: localEvents, syncedToPostgres: false };
}

export async function verifyBatchAndLocationAgainstRegistry(params: {
  brandSlug: string;
  brandName: string;
  code: string;
  city?: string;
  countryCode?: string;
  reporterUid?: string;
  estimatedUnitUsd?: number;
}): Promise<BatchVerificationVerdict> {
  const normalizedCode = params.code.trim().toUpperCase().replace(/\s+/g, "");
  const cleanCity = (params.city || "").trim();
  const cleanCountry = (params.countryCode || "GLOBAL").trim().toUpperCase();

  const [{ batches, syncedToPostgres: batchDbOk }, { dealers }] = await Promise.all([
    fetchBrandOemBatches(params.brandSlug),
    fetchAuthorizedDealers(params.brandSlug),
  ]);

  let matchedBatch: BrandOemBatch | null = null;
  for (const b of batches) {
    const prefix = b.batch_prefix.toUpperCase();
    const prefixHit = normalizedCode.startsWith(prefix) || normalizedCode.includes(prefix);
    let regexHit = false;
    if (b.serial_regex) {
      try {
        regexHit = new RegExp(b.serial_regex, "i").test(normalizedCode);
      } catch {
        regexHit = false;
      }
    }
    if (prefixHit || regexHit) {
      matchedBatch = b;
      break;
    }
  }

  // Dealer geo check if city or country supplied
  const activeDealers = dealers.filter((d) => d.active);
  const matchedDealer =
    cleanCity.length > 0
      ? activeDealers.find(
          (d) =>
            d.city.toLowerCase().includes(cleanCity.toLowerCase()) ||
            cleanCity.toLowerCase().includes(d.city.toLowerCase()),
        ) || null
      : cleanCountry !== "GLOBAL"
        ? activeDealers.find((d) => d.country_code === cleanCountry) || null
        : activeDealers[0] || null;

  let outcome: CounterfeitScanOutcome = "unverified_batch";
  let authentic = false;
  let confidencePct = 28;
  let headline = "";
  let explanation = "";
  let nextAction = "";

  if (matchedBatch && matchedBatch.status === "recalled") {
    outcome = "recalled_batch";
    authentic = false;
    confidencePct = 95;
    headline = `RECALLED OEM BATCH DETECTED (${matchedBatch.batch_prefix})`;
    explanation = `${params.brandName} flagged SKU/batch ${matchedBatch.sku_code} under active recall/quarantine. ${matchedBatch.notes || ""}`;
    nextAction = "Do not consume or install. Escalate immediately to the Brand Desk for a 100% replacement/refund.";
  } else if (matchedBatch && cleanCity && activeDealers.length > 0 && !matchedDealer) {
    outcome = "suspected_grey_market_leak";
    authentic = false;
    confidencePct = 82;
    headline = `Grey-Market / Unauthorized Channel Alert in ${cleanCity}`;
    explanation = `Batch pattern matches ${params.brandName} (${matchedBatch.sku_code}), but "${cleanCity}" has zero registered authorized dealers on the ${params.brandName} official network.`;
    nextAction = `Redirect purchase to an official ${params.brandName} distributor (${activeDealers[0]?.dealer_name} in ${activeDealers[0]?.city}) and log a grey-market intercept.`;
  } else if (matchedBatch) {
    outcome = "matched_oem";
    authentic = true;
    confidencePct = 94;
    headline = `OEM Registry Match Verified (${matchedBatch.sku_code})`;
    explanation = `${normalizedCode} matches ${params.brandName}'s authenticated OEM batch/serial specification (${matchedBatch.industry_sector.replace(/_/g, " ")}).${matchedDealer ? ` Authorized dealer coverage confirmed in ${matchedDealer.city} (${matchedDealer.dealer_name}).` : ""}`;
    nextAction = "Eligible for 5× Proof-Weighted Stash/Trash vote on the Moody's Trust Ledger.";
  } else {
    outcome = "unverified_batch";
    authentic = false;
    confidencePct = 24;
    headline = `Unrecognized / Suspect Code (${normalizedCode || "EMPTY"})`;
    explanation = `Code does not match any active ${params.brandName} OEM SKU prefix or serial regex in the SOT registry. High risk of counterfeit label, cloned barcode, or tampered lot.`;
    nextAction = "Trigger high-priority photo forensics in the Universal Scanner or alert the Brand Desk directly.";
  }

  // Record intercept event (both locally and to Postgres when migrated)
  const eventRecord: CounterfeitScanEvent = {
    id: `cse-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    brand_slug: params.brandSlug,
    sku_or_batch: normalizedCode || "UNSPECIFIED",
    matched_oem_batch_id: matchedBatch?.id || null,
    country_code: cleanCountry,
    city_or_store: cleanCity || matchedDealer?.city || "Direct Serial Check",
    scan_outcome: outcome,
    estimated_loss_recovered_usd:
      outcome === "matched_oem" ? 0 : Math.max(85, Number(params.estimatedUnitUsd || 180)),
    reporter_uid: params.reporterUid || "consumer-verifier",
    created_at: new Date().toISOString(),
  };

  const existingEvents = readLocalArray<CounterfeitScanEvent>(SCAN_EVENTS_LOCAL_KEY);
  writeLocalArray(SCAN_EVENTS_LOCAL_KEY, [eventRecord, ...existingEvents].slice(0, 120));

  let eventDbOk = false;
  try {
    const db = supabase as any;
    const { error } = await db.from("counterfeit_scan_events").insert(eventRecord);
    if (!error) eventDbOk = true;
  } catch {
    // ignore
  }

  return {
    outcome,
    authentic,
    confidencePct,
    matchedBatch,
    matchedDealer,
    headline,
    explanation,
    nextAction,
    persistedToPostgres: batchDbOk && eventDbOk,
  };
}
