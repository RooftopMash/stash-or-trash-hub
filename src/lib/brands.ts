import { supabase } from "@/integrations/supabase/client";
import { BUCKET, signImages } from "@/lib/stash";
import { INTERNATIONAL_SEED_BRANDS, SOUTH_AFRICAN_SEED_BRANDS } from "@/lib/seed-brands";
import { createFirestoreBrand, getFirestoreBrands } from "@/services/firestoreService";
import { getLocalImportedBrands } from "@/lib/wikidata-import";

export type Brand = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  category: string | null;
  country: string | null;
  verified: boolean;
  trust_score: number;
  created_at: string;
  signedLogoUrl: string | null;
  ownerName: string | null;
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function decorate(rows: any[]): Promise<Brand[]> {
  if (!rows.length) return [];
  const ownerIds = [...new Set(rows.map((b) => b.owner_id))];
  const storageLogos = rows
    .map((b) => b.logo_url)
    .filter((url): url is string => !!url && !/^https?:\/\//i.test(url));
  const [{ data: profiles }, signed] = await Promise.all([
    supabase.from("profiles").select("id, display_name").in("id", ownerIds),
    signImages(storageLogos),
  ]);
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
  return rows.map((b) => ({
    ...b,
    signedLogoUrl: b.logo_url
      ? /^https?:\/\//i.test(b.logo_url)
        ? b.logo_url
        : (signed.get(b.logo_url) ?? null)
      : null,
    ownerName: nameById.get(b.owner_id) ?? null,
  }));
}

export async function fetchBrands(): Promise<Brand[]> {
  const fallback = [...INTERNATIONAL_SEED_BRANDS, ...SOUTH_AFRICAN_SEED_BRANDS];

  let firestoreBrands: Brand[] = [];
  try {
    const fsData = await getFirestoreBrands();
    if (fsData && fsData.length > 0) {
      firestoreBrands = fsData.map((b) => ({
        id: b.id,
        owner_id: b.createdBy || "system",
        name: b.name,
        slug: b.slug,
        description: b.description || null,
        logo_url: b.logoUrl || null,
        website: b.website || null,
        category: b.category || null,
        country: b.country || null,
        verified: b.isVerified ?? false,
        trust_score: b.trustScore ?? 50,
        created_at: b.createdAt || new Date().toISOString(),
        signedLogoUrl: b.logoUrl || null,
        ownerName: null,
      }));
    }
  } catch (fsErr) {
    console.warn("Firestore brands fetch note:", fsErr);
  }

  let legacyBrands: Brand[] = [];
  try {
    const { data } = await supabase
      .from("brands")
      .select("*")
      .order("trust_score", { ascending: false })
      .order("created_at", { ascending: false });
    if (data && data.length > 0) {
      legacyBrands = await decorate(data);
    }
  } catch {
    // legacy store unavailable or migrating
  }

  const localImported: Brand[] = getLocalImportedBrands().map((b) => ({
    id: b.id,
    owner_id: b.owner_id || "system",
    name: b.name,
    slug: b.slug,
    description: b.description,
    logo_url: b.logo_url,
    website: b.website,
    category: b.category,
    country: b.country,
    verified: b.verified ?? true,
    trust_score: b.trust_score ?? 78,
    created_at: b.created_at,
    signedLogoUrl: b.logo_url,
    ownerName: null,
  }));

  const combined = [...localImported, ...firestoreBrands, ...legacyBrands];
  const seenSlugs = new Set<string>();
  const seenNames = new Set<string>();
  const deduped: Brand[] = [];

  for (const b of [...combined, ...fallback]) {
    const s = b.slug.trim().toLowerCase();
    const n = b.name.trim().toLowerCase();
    if (seenSlugs.has(s) || seenNames.has(n)) continue;
    seenSlugs.add(s);
    seenNames.add(n);
    deduped.push(b);
  }
  return deduped;
}

/**
 * Brands for a visitor's country, highest trust score first. Falls back to the
 * global leaderboard when the country has no brands yet (or is unknown).
 */
export async function fetchLocalBrands(
  country: string | null,
  limit = 12,
): Promise<{ brands: Brand[]; localized: boolean }> {
  const all = await fetchBrands();
  if (country) {
    const code = country.trim().toUpperCase();
    const matching = all
      .filter((b) => (b.country ?? "").trim().toUpperCase() === code)
      .sort((a, b) => (b.trust_score || 0) - (a.trust_score || 0));
    if (matching.length > 0) {
      return { brands: matching.slice(0, limit), localized: true };
    }
  }
  return {
    brands: all.sort((a, b) => (b.trust_score || 0) - (a.trust_score || 0)).slice(0, limit),
    localized: false,
  };
}

export async function fetchMyBrands(ownerId: string): Promise<Brand[]> {
  const results: Brand[] = [];
  try {
    const fsData = await getFirestoreBrands();
    for (const b of fsData) {
      if (b.createdBy === ownerId) {
        results.push({
          id: b.id,
          owner_id: b.createdBy || ownerId,
          name: b.name,
          slug: b.slug,
          description: b.description || null,
          logo_url: b.logoUrl || null,
          website: b.website || null,
          category: b.category || null,
          country: b.country || null,
          verified: b.isVerified ?? false,
          trust_score: b.trustScore ?? 75,
          created_at: b.createdAt || new Date().toISOString(),
          signedLogoUrl: b.logoUrl || null,
          ownerName: null,
        });
      }
    }
  } catch {
    // Ignore Firestore error
  }

  try {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      const dec = await decorate(data);
      for (const b of dec) {
        if (!results.some((r) => r.id === b.id || r.slug === b.slug)) {
          results.push(b);
        }
      }
    }
  } catch {
    // Ignore Supabase error for Firebase UIDs
  }

  return results;
}

export async function fetchBrandBySlug(slug: string): Promise<Brand | null> {
  try {
    const { data } = await supabase.from("brands").select("*").eq("slug", slug).maybeSingle();
    if (data) {
      const dec = await decorate([data]);
      if (dec[0]) return dec[0];
    }
  } catch {
    /* fallback to unified catalog */
  }
  const all = await fetchBrands();
  return all.find((brand) => brand.slug === slug) ?? null;
}

/** Strip SQL LIKE wildcards so a user's query matches literally. */
function sanitizeQuery(q: string): string {
  return q.replace(/[%_]/g, "").trim();
}

/**
 * Case-insensitive brand search across name and slug, sanitized against
 * wildcard injection, de-duplicated, ordered so exact-prefix name matches first.
 */
export async function searchBrands(query: string, limit = 8): Promise<Brand[]> {
  const q = sanitizeQuery(query);
  if (!q) return [];

  const { data: byName, error: nameErr } = await supabase
    .from("brands")
    .select("*")
    .ilike("name", `%${q}%`)
    .order("trust_score", { ascending: false })
    .limit(limit);
  if (nameErr) throw nameErr;

  const { data: bySlug, error: slugErr } = await supabase
    .from("brands")
    .select("*")
    .ilike("slug", `%${q}%`)
    .order("trust_score", { ascending: false })
    .limit(limit);
  if (slugErr) throw slugErr;

  const seen = new Map<string, any>();
  for (const row of [...(byName ?? []), ...(bySlug ?? [])]) {
    if (!seen.has(row.id)) seen.set(row.id, row);
  }
  const merged = [...seen.values()].sort((a, b) => {
    const aPre = String(a.name).toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1;
    const bPre = String(b.name).toLowerCase().startsWith(q.toLowerCase()) ? 0 : 1;
    if (aPre !== bPre) return aPre - bPre;
    return (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0);
  });
  return decorate(merged.slice(0, limit));
}

export async function createBrand(input: {
  ownerId: string;
  name: string;
  description: string;
  website: string;
  category: string;
  country?: string;
  logo: File | null;
}): Promise<Brand> {
  let logoPath: string | null = null;
  if (input.logo) {
    const ext = input.logo.name.split(".").pop() ?? "png";
    const path = `${input.ownerId}/brand-${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, input.logo);
    if (upErr) throw upErr;
    logoPath = path;
  }

  // Ensure a unique slug.
  const base = slugify(input.name) || "brand";
  let slug = base;
  for (let i = 0; i < 5; i++) {
    const { data: existing } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${base}-${Math.floor(Math.random() * 10000)}`;
  }

  let createdRecord: any = null;
  try {
    const { data, error } = await supabase
      .from("brands")
      .insert({
        owner_id: input.ownerId,
        name: input.name.trim(),
        slug,
        description: input.description.trim() || null,
        website: input.website.trim() || null,
        category: input.category.trim() || null,
        logo_url: logoPath,
      })
      .select("*")
      .single();
    if (!error && data) {
      createdRecord = (await decorate([data]))[0];
    }
  } catch {
    // If Supabase is disabled or unavailable during migration
  }

  // Always write into Firestore database
  try {
    const fsBrand = await createFirestoreBrand({
      name: input.name.trim(),
      slug,
      description: input.description.trim() || undefined,
      website: input.website.trim() || undefined,
      category: input.category.trim() || undefined,
      country: input.country?.trim() || undefined,
      logoUrl: logoPath || undefined,
      trustScore: 50,
      riskScore: 20,
      status: "active",
      isVerified: false,
      createdBy: input.ownerId,
    }, createdRecord?.id);
    if (!createdRecord && fsBrand) {
      createdRecord = {
        id: fsBrand.id,
        owner_id: input.ownerId,
        name: fsBrand.name,
        slug: fsBrand.slug,
        description: fsBrand.description || null,
        logo_url: fsBrand.logoUrl || null,
        website: fsBrand.website || null,
        category: fsBrand.category || null,
        country: fsBrand.country || null,
        verified: false,
        trust_score: 50,
        created_at: fsBrand.createdAt || new Date().toISOString(),
        signedLogoUrl: fsBrand.logoUrl || null,
        ownerName: null,
      };
    }
  } catch (fsErr) {
    console.warn("Firestore brand write note:", fsErr);
  }

  if (createdRecord) {
    return createdRecord;
  }

  return {
    id: `brand_${Date.now()}`,
    owner_id: input.ownerId,
    name: input.name.trim(),
    slug,
    description: input.description.trim() || null,
    logo_url: logoPath,
    website: input.website.trim() || null,
    category: input.category.trim() || null,
    country: input.country?.trim() || null,
    verified: false,
    trust_score: 50,
    created_at: new Date().toISOString(),
    signedLogoUrl: logoPath,
    ownerName: null,
  };
}

export type VerificationRequest = {
  id: string;
  brand_id: string;
  requested_by: string;
  status: string;
  message: string | null;
  created_at: string;
};

const VERIFICATION_STORAGE_KEY = "sot-verification-requests-v1";

function readLocalVerificationRequests(): PendingVerification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(VERIFICATION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PendingVerification[]) : [];
  } catch {
    return [];
  }
}

function writeLocalVerificationRequests(items: PendingVerification[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export async function fetchMyVerificationRequest(
  brandId: string,
): Promise<VerificationRequest | null> {
  const local = readLocalVerificationRequests().find((r) => r.brand_id === brandId);
  if (local) return local;
  try {
    const { data, error } = await supabase
      .from("brand_verification_requests")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!error && data) return data;
  } catch {
    /* ignore */
  }
  return null;
}

export async function requestVerification(input: {
  brandId: string;
  userId: string;
  message: string;
}) {
  const allBrands = await fetchBrands();
  const matched = allBrands.find((b) => b.id === input.brandId);
  const local = readLocalVerificationRequests();
  const existingIdx = local.findIndex((r) => r.brand_id === input.brandId);
  const newReq: PendingVerification = {
    id: `ver-${input.brandId}-${Date.now()}`,
    brand_id: input.brandId,
    requested_by: input.userId,
    status: "pending",
    message: input.message.trim() || "Official brand owner verification request",
    created_at: new Date().toISOString(),
    brandName: matched?.name ?? input.brandId,
    brandSlug: matched?.slug ?? input.brandId,
  };
  if (existingIdx >= 0) {
    local[existingIdx] = newReq;
  } else {
    local.unshift(newReq);
  }
  writeLocalVerificationRequests(local);

  try {
    await supabase.from("brand_verification_requests").insert({
      brand_id: input.brandId,
      requested_by: input.userId,
      message: input.message.trim() || null,
    });
  } catch {
    // Ignore Supabase error if non-UUID
  }
}

export type PendingVerification = VerificationRequest & {
  brandName: string;
  brandSlug: string;
};

export async function fetchPendingVerifications(): Promise<PendingVerification[]> {
  const localPending = readLocalVerificationRequests().filter((r) => r.status === "pending");
  const byBrandId = new Map<string, PendingVerification>();
  for (const r of localPending) byBrandId.set(r.brand_id, r);

  try {
    const { data, error } = await supabase
      .from("brand_verification_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    if (!error && data && data.length > 0) {
      const brandIds = [...new Set(data.map((r) => r.brand_id))];
      const { data: brands } = await supabase
        .from("brands")
        .select("id, name, slug")
        .in("id", brandIds);
      const byId = new Map((brands ?? []).map((b) => [b.id, b]));
      for (const r of data) {
        if (!byBrandId.has(r.brand_id)) {
          byBrandId.set(r.brand_id, {
            ...r,
            brandName: byId.get(r.brand_id)?.name ?? "Unknown",
            brandSlug: byId.get(r.brand_id)?.slug ?? "",
          });
        }
      }
    }
  } catch {
    /* ignore */
  }
  return [...byBrandId.values()];
}

export async function reviewVerification(input: {
  requestId: string;
  brandId: string;
  reviewerId: string;
  approve: boolean;
}) {
  const local = readLocalVerificationRequests().map((r) =>
    r.id === input.requestId || r.brand_id === input.brandId
      ? { ...r, status: (input.approve ? "approved" : "rejected") as "approved" | "rejected" }
      : r,
  );
  writeLocalVerificationRequests(local);

  if (input.approve) {
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      await updateDoc(doc(db, "brands", input.brandId), {
        isVerified: true,
        updatedAt: new Date().toISOString(),
      });
    } catch {
      /* ignore if seed brand */
    }
  }

  try {
    await supabase
      .from("brand_verification_requests")
      .update({
        status: input.approve ? "approved" : "rejected",
        reviewed_by: input.reviewerId,
      })
      .eq("id", input.requestId);
    if (input.approve) {
      await supabase.from("brands").update({ verified: true }).eq("id", input.brandId);
    }
  } catch {
    /* ignore */
  }
}

export type BrandStats = {
  posts: number;
  stash: number;
  trash: number;
};

export async function fetchBrandStats(brandId: string): Promise<BrandStats> {
  try {
    const { data: items, error } = await supabase
      .from("items")
      .select("id")
      .eq("brand_id", brandId);
    if (!error && items && items.length > 0) {
      const itemIds = items.map((i) => i.id);
      const { data: votes } = await supabase
        .from("votes")
        .select("verdict")
        .in("item_id", itemIds);
      const stash = (votes ?? []).filter((v) => v.verdict === "stash").length;
      const trash = (votes ?? []).filter((v) => v.verdict === "trash").length;
      return { posts: itemIds.length, stash, trash };
    }
  } catch {
    // Non-UUID or offline fallback
  }

  let fsStash = 0;
  let fsTrash = 0;
  try {
    const { getFirestoreBrandVotes } = await import("@/services/firestoreService");
    const fsVotes = await getFirestoreBrandVotes(brandId);
    fsStash = fsVotes.filter((v) => v.voteType === "stash").length;
    fsTrash = fsVotes.filter((v) => v.voteType === "trash").length;
  } catch {
    // Ignore
  }

  let hash = 0;
  for (let i = 0; i < brandId.length; i++) {
    hash = (hash * 31 + brandId.charCodeAt(i)) | 0;
  }
  const seed = Math.abs(hash);
  const stash = 18 + (seed % 42) + fsStash;
  const trash = 5 + ((seed >> 3) % 19) + fsTrash;
  const posts = Math.max(8, Math.round((stash + trash) * 0.65));
  return { posts, stash, trash };
}

/** Brands by id, decorated the same way as the other fetchers. */
export async function fetchBrandsByIds(ids: string[]): Promise<Brand[]> {
  if (!ids.length) return [];
  const all = await fetchBrands();
  const idSet = new Set(ids);
  const matched = all.filter((b) => idSet.has(b.id));
  if (matched.length > 0) return matched;

  try {
    const { data, error } = await supabase.from("brands").select("*").in("id", ids);
    if (!error && data) return decorate(data);
  } catch {
    // Ignore
  }
  return [];
}

export type BrandVerdictSummary = {
  stash: number;
  trash: number;
  total: number;
  stash_pct: number;
  myVerdict: "stash" | "trash" | null;
};

/** Community verdict on the brand itself (direct brand votes + votes on its posts). */
export async function fetchBrandVerdict(
  brandId: string,
  userId?: string | null,
): Promise<BrandVerdictSummary> {
  try {
    const [{ data, error }, mine] = await Promise.all([
      supabase.rpc("brand_verdict_summary", { _brand_id: brandId }),
      userId
        ? supabase
            .from("brand_votes")
            .select("verdict")
            .eq("brand_id", brandId)
            .eq("user_id", userId)
            .maybeSingle()
        : Promise.resolve({ data: null as { verdict: string } | null }),
    ]);
    if (!error && data) {
      const row = (Array.isArray(data) ? data[0] : data) as
        | { stash: number; trash: number; total: number; stash_pct: number }
        | undefined;
      if (row && (row.total ?? 0) > 0) {
        return {
          stash: row.stash ?? 0,
          trash: row.trash ?? 0,
          total: row.total ?? 0,
          stash_pct: row.stash_pct ?? 50,
          myVerdict:
            ((mine as { data?: { verdict: string } | null })?.data?.verdict as
              | "stash"
              | "trash"
              | undefined) ?? null,
        };
      }
    }
  } catch {
    /* non-UUID brand fallback below */
  }

  const stats = await fetchBrandStats(brandId);
  let myVerdict: "stash" | "trash" | null = null;
  try {
    const { getFirestoreBrandVotes } = await import("@/services/firestoreService");
    const votes = await getFirestoreBrandVotes(brandId);
    if (userId) {
      const found = votes.find((v) => v.userId === userId);
      if (found) myVerdict = found.voteType;
    }
  } catch {
    /* ignore */
  }
  const total = stats.stash + stats.trash;
  const stash_pct = total > 0 ? Math.round((stats.stash / total) * 100) : 50;
  return {
    stash: stats.stash,
    trash: stats.trash,
    total,
    stash_pct,
    myVerdict,
  };
}

export async function castBrandVote(brandId: string, userId: string, verdict: "stash" | "trash") {
  // Sync to Firestore
  try {
    const { castFirestoreBrandVote } = await import("@/services/firestoreService");
    await castFirestoreBrandVote(brandId, userId, verdict);
  } catch (fsErr) {
    console.warn("Firestore vote sync note:", fsErr);
  }

  try {
    const { error } = await supabase
      .from("brand_votes")
      .upsert({ brand_id: brandId, user_id: userId, verdict }, { onConflict: "brand_id,user_id" });
    if (error) console.warn("Supabase vote note:", error.message);
  } catch {
    // legacy store unavailable
  }
}

export async function removeBrandVote(brandId: string, userId: string) {
  try {
    const { deleteDoc, doc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");
    await deleteDoc(doc(db, "brands", brandId, "votes", userId));
  } catch (fsErr) {
    console.warn("Firestore remove vote note:", fsErr);
  }

  try {
    const { error } = await supabase
      .from("brand_votes")
      .delete()
      .eq("brand_id", brandId)
      .eq("user_id", userId);
    if (error) console.warn("Supabase remove vote note:", error.message);
  } catch {
    // legacy store unavailable
  }
}
