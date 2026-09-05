import { supabase } from "@/integrations/supabase/client";

export type BrandRole = "admin" | "analyst" | "viewer";

export type BrandMember = {
  id: string;
  brand_id: string;
  user_id: string | null;
  invited_email: string | null;
  role: BrandRole;
  accepted_at: string | null;
  created_at: string;
  displayName: string | null;
};

export type BrandResponse = {
  id: string;
  item_id: string;
  brand_id: string;
  user_id: string;
  body: string;
  created_at: string;
  brandName: string | null;
  brandSlug: string | null;
  brandVerified: boolean;
  authorName: string | null;
};

export type BrandKpis = {
  posts: number;
  stash: number;
  trash: number;
  stash_pct: number;
  positive: number;
  neutral: number;
  negative: number;
  unanswered: number;
  median_response_minutes: number;
};

/** Brands the signed-in user can act on (owned or team membership). */
export async function fetchManagedBrandIds(userId: string): Promise<Set<string>> {
  const [owned, member] = await Promise.all([
    supabase.from("brands").select("id").eq("owner_id", userId),
    supabase
      .from("brand_members")
      .select("brand_id, accepted_at, role")
      .eq("user_id", userId)
      .not("accepted_at", "is", null),
  ]);
  const ids = new Set<string>();
  (owned.data ?? []).forEach((b) => ids.add(b.id));
  (member.data ?? [])
    .filter((m) => m.role === "admin" || m.role === "analyst")
    .forEach((m) => ids.add(m.brand_id));
  return ids;
}

export async function fetchBrandKpis(brandId: string, days = 30): Promise<BrandKpis> {
  const { data, error } = await supabase.rpc("brand_kpis", {
    _brand_id: brandId,
    _days: days,
  });
  if (error) throw error;
  const row = (data as BrandKpis[] | null)?.[0];
  return (
    row ?? {
      posts: 0,
      stash: 0,
      trash: 0,
      stash_pct: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      unanswered: 0,
      median_response_minutes: 0,
    }
  );
}

export async function fetchBrandMembers(brandId: string): Promise<BrandMember[]> {
  const { data, error } = await supabase
    .from("brand_members")
    .select("*")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  const rows = data ?? [];
  const userIds = rows.map((r) => r.user_id).filter((id): id is string => !!id);
  const names = new Map<string, string>();
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);
    (profiles ?? []).forEach((p) => names.set(p.id, p.display_name));
  }
  return rows.map((r) => ({
    ...(r as any),
    displayName: r.user_id ? (names.get(r.user_id) ?? null) : null,
  }));
}

export async function inviteBrandMember(input: {
  brandId: string;
  email: string;
  role: BrandRole;
  invitedBy: string;
}) {
  const email = input.email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Enter a valid email address.");
  const { error } = await supabase.from("brand_members").insert({
    brand_id: input.brandId,
    invited_email: email,
    role: input.role,
    invited_by: input.invitedBy,
  });
  if (error) throw error;
}

export async function updateBrandMemberRole(memberId: string, role: BrandRole) {
  const { error } = await supabase.from("brand_members").update({ role }).eq("id", memberId);
  if (error) throw error;
}

export async function removeBrandMember(memberId: string) {
  const { error } = await supabase.from("brand_members").delete().eq("id", memberId);
  if (error) throw error;
}

export async function fetchBrandResponses(itemId: string): Promise<BrandResponse[]> {
  const { data, error } = await supabase
    .from("brand_responses")
    .select("*")
    .eq("item_id", itemId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  const rows = data ?? [];
  if (!rows.length) return [];
  const brandIds = [...new Set(rows.map((r) => r.brand_id))];
  const userIds = [...new Set(rows.map((r) => r.user_id))];
  const [{ data: brands }, { data: profiles }] = await Promise.all([
    supabase.from("brands").select("id, name, slug, verified").in("id", brandIds),
    supabase.from("profiles").select("id, display_name").in("id", userIds),
  ]);
  const byBrand = new Map((brands ?? []).map((b) => [b.id, b]));
  const byUser = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
  return rows.map((r) => {
    const b = byBrand.get(r.brand_id);
    return {
      ...(r as any),
      brandName: b?.name ?? null,
      brandSlug: b?.slug ?? null,
      brandVerified: b?.verified ?? false,
      authorName: byUser.get(r.user_id) ?? null,
    };
  });
}

export async function createBrandResponse(input: {
  itemId: string;
  brandId: string;
  userId: string;
  body: string;
}) {
  const body = input.body.trim();
  if (!body) throw new Error("Write a response first.");
  const { error } = await supabase.from("brand_responses").insert({
    item_id: input.itemId,
    brand_id: input.brandId,
    user_id: input.userId,
    body,
  });
  if (error) throw error;
}

export async function deleteBrandResponse(id: string) {
  const { error } = await supabase.from("brand_responses").delete().eq("id", id);
  if (error) throw error;
}

/** Brand-team override of a post's sentiment / category tags. */
export async function tagItem(
  itemId: string,
  patch: { sentiment?: string; category?: string },
) {
  const { error } = await supabase.from("items").update(patch).eq("id", itemId);
  if (error) throw error;
}

export async function fetchUnansweredPosts(brandId: string, limit = 10) {
  const { data, error } = await supabase
    .from("items")
    .select("id, title, created_at, sentiment")
    .eq("brand_id", brandId)
    .is("responded_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/** Every brand the user can manage: owned brands plus team memberships. */
export async function fetchAccessibleBrandIds(userId: string): Promise<string[]> {
  return [...(await fetchManagedBrandIds(userId))];
}

// ---------------- Phase B: CX intelligence ----------------

export type BrandTrendPoint = {
  day: string;
  posts: number;
  stash: number;
  trash: number;
  stash_pct: number;
  positive: number;
  neutral: number;
  negative: number;
};

export async function fetchBrandTrend(brandId: string, days = 30): Promise<BrandTrendPoint[]> {
  const { data, error } = await supabase.rpc("brand_trend", {
    _brand_id: brandId,
    _days: days,
  });
  if (error) throw error;
  return (data ?? []) as BrandTrendPoint[];
}

export type BrandVoice = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  trust_score: number | null;
  posts: number;
  engagement: number;
  followers: number;
};

export async function fetchBrandTopVoices(
  brandId: string,
  days = 30,
  limit = 10,
): Promise<BrandVoice[]> {
  const { data, error } = await supabase.rpc("brand_top_voices", {
    _brand_id: brandId,
    _days: days,
    _limit: limit,
  });
  if (error) throw error;
  return (data ?? []) as BrandVoice[];
}

export type CrisisAlert = {
  id: string;
  brand_id: string;
  negative_share: number;
  baseline_share: number;
  sample_size: number;
  opened_at: string;
  resolved_at: string | null;
};

export async function fetchOpenCrisisAlert(brandId: string): Promise<CrisisAlert | null> {
  const { data, error } = await supabase
    .from("brand_crisis_alerts")
    .select("*")
    .eq("brand_id", brandId)
    .is("resolved_at", null)
    .order("opened_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as CrisisAlert | null) ?? null;
}

export async function resolveCrisisAlert(id: string) {
  const { error } = await supabase
    .from("brand_crisis_alerts")
    .update({ resolved_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/** Build a CSV string from the current analytics window. */
export function trendToCsv(rows: BrandTrendPoint[]): string {
  const header = "day,posts,stash,trash,stash_pct,positive,neutral,negative";
  const body = rows
    .map((r) =>
      [r.day, r.posts, r.stash, r.trash, r.stash_pct, r.positive, r.neutral, r.negative].join(","),
    )
    .join("\n");
  return `${header}\n${body}\n`;
}
