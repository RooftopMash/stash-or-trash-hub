import { supabase } from "@/integrations/supabase/client";
import { BUCKET, signImages } from "@/lib/stash";

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
      ? (/^https?:\/\//i.test(b.logo_url) ? b.logo_url : (signed.get(b.logo_url) ?? null))
      : null,
    ownerName: nameById.get(b.owner_id) ?? null,
  }));
}

export async function fetchBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("trust_score", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return decorate(data ?? []);
}

/**
 * Brands for a visitor's country, highest trust score first. Falls back to the
 * global leaderboard when the country has no brands yet (or is unknown).
 */
export async function fetchLocalBrands(
  country: string | null,
  limit = 12,
): Promise<{ brands: Brand[]; localized: boolean }> {
  if (country) {
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("country", country)
      .order("trust_score", { ascending: false })
      .limit(limit);
    if (error) throw error;
    if (data && data.length > 0) {
      return { brands: await decorate(data), localized: true };
    }
  }
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("trust_score", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return { brands: await decorate(data ?? []), localized: false };
}

export async function fetchMyBrands(ownerId: string): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return decorate(data ?? []);
}

export async function fetchBrandBySlug(slug: string): Promise<Brand | null> {
  const { data, error } = await supabase.from("brands").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return (await decorate([data]))[0] ?? null;
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
    .from("brands").select("*").ilike("name", `%${q}%`)
    .order("trust_score", { ascending: false }).limit(limit);
  if (nameErr) throw nameErr;

  const { data: bySlug, error: slugErr } = await supabase
    .from("brands").select("*").ilike("slug", `%${q}%`)
    .order("trust_score", { ascending: false }).limit(limit);
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
    const { data: existing } = await supabase.from("brands").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    slug = `${base}-${Math.floor(Math.random() * 10000)}`;
  }

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
  if (error) throw error;
  return (await decorate([data]))[0];
}

export type VerificationRequest = {
  id: string;
  brand_id: string;
  requested_by: string;
  status: string;
  message: string | null;
  created_at: string;
};

export async function fetchMyVerificationRequest(brandId: string): Promise<VerificationRequest | null> {
  const { data, error } = await supabase
    .from("brand_verification_requests")
    .select("*")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function requestVerification(input: {
  brandId: string;
  userId: string;
  message: string;
}) {
  const { error } = await supabase.from("brand_verification_requests").insert({
    brand_id: input.brandId,
    requested_by: input.userId,
    message: input.message.trim() || null,
  });
  if (error) throw error;
}

export type PendingVerification = VerificationRequest & {
  brandName: string;
  brandSlug: string;
};

export async function fetchPendingVerifications(): Promise<PendingVerification[]> {
  const { data, error } = await supabase
    .from("brand_verification_requests")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  const rows = data ?? [];
  if (!rows.length) return [];
  const brandIds = [...new Set(rows.map((r) => r.brand_id))];
  const { data: brands } = await supabase.from("brands").select("id, name, slug").in("id", brandIds);
  const byId = new Map((brands ?? []).map((b) => [b.id, b]));
  return rows.map((r) => ({
    ...r,
    brandName: byId.get(r.brand_id)?.name ?? "Unknown",
    brandSlug: byId.get(r.brand_id)?.slug ?? "",
  }));
}

export async function reviewVerification(input: {
  requestId: string;
  brandId: string;
  reviewerId: string;
  approve: boolean;
}) {
  const { error } = await supabase
    .from("brand_verification_requests")
    .update({
      status: input.approve ? "approved" : "rejected",
      reviewed_by: input.reviewerId,
    })
    .eq("id", input.requestId);
  if (error) throw error;
  if (input.approve) {
    const { error: bErr } = await supabase.from("brands").update({ verified: true }).eq("id", input.brandId);
    if (bErr) throw bErr;
  }
}

export type BrandStats = {
  posts: number;
  stash: number;
  trash: number;
};

export async function fetchBrandStats(brandId: string): Promise<BrandStats> {
  const { data: items } = await supabase.from("items").select("id").eq("brand_id", brandId);
  const itemIds = (items ?? []).map((i) => i.id);
  if (itemIds.length === 0) return { posts: 0, stash: 0, trash: 0 };
  const { data: votes } = await supabase.from("votes").select("verdict").in("item_id", itemIds);
  const stash = (votes ?? []).filter((v) => v.verdict === "stash").length;
  const trash = (votes ?? []).filter((v) => v.verdict === "trash").length;
  return { posts: itemIds.length, stash, trash };
}
