import { supabase } from "@/integrations/supabase/client";
import { triggerWebhookDelivery } from "@/lib/webhooks";

export type BrandRole = "admin" | "analyst" | "viewer";
export type BrandMemberStatus = "active" | "pending";

export type BrandMember = {
  id: string;
  brand_id: string;
  user_id: string | null;
  email: string | null;
  role: BrandRole;
  status: BrandMemberStatus;
  created_at: string;
  profileName?: string | null;
};

export type BrandResponse = {
  id: string;
  item_id: string;
  brand_id: string;
  user_id: string;
  response_text: string;
  created_at: string;
  authorName?: string | null;
  brandName?: string | null;
};

export type SentimentType = "positive" | "neutral" | "negative" | "unknown";
export type PostCategoryType = "feedback" | "support" | "complaint" | "praise" | string;

export type DashboardKPIs = {
  postVolume: number;
  stashPct: number;
  sentimentSplit: {
    positive: number;
    neutral: number;
    negative: number;
    unknown: number;
  };
  unansweredCount: number;
  medianResponseTimeHours: number | null;
};

export type CrisisAlert = {
  id: string;
  brand_id: string;
  alert_type: string;
  message: string;
  negative_share: number;
  baseline_share: number;
  acknowledged: boolean;
  created_at: string;
  brandName?: string;
};

/** Automatically infer sentiment from post title and description */
export function analyzeSentiment(text: string): SentimentType {
  const lower = text.toLowerCase();
  const posWords = ["great", "awesome", "love", "excellent", "amazing", "good", "best", "perfect", "happy", "stash"];
  const negWords = ["terrible", "bad", "worst", "hate", "awful", "broken", "scam", "trash", "slow", "fail", "useless", "issue", "bug"];

  let posCount = 0;
  let negCount = 0;

  for (const w of posWords) {
    if (lower.includes(w)) posCount++;
  }
  for (const w of negWords) {
    if (lower.includes(w)) negCount++;
  }

  if (posCount > negCount) return "positive";
  if (negCount > posCount) return "negative";
  if (posCount > 0 && posCount === negCount) return "neutral";
  return "neutral";
}

/** Automatically infer category from text if none provided */
export function analyzeCategory(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("bug") || lower.includes("help") || lower.includes("issue") || lower.includes("error") || lower.includes("support")) {
    return "support";
  }
  if (lower.includes("hate") || lower.includes("terrible") || lower.includes("slow") || lower.includes("scam") || lower.includes("complain")) {
    return "complaint";
  }
  if (lower.includes("love") || lower.includes("great") || lower.includes("thanks") || lower.includes("praise")) {
    return "praise";
  }
  return "feedback";
}

/** Resolve pending invitations when a user signs up or logs in */
export async function resolvePendingInvites(userId: string, email: string) {
  if (!userId || !email) return;
  try {
    await supabase
      .from("brand_members")
      .update({ user_id: userId, status: "active" })
      .eq("email", email.toLowerCase().trim())
      .eq("status", "pending");
  } catch (e) {
    console.error("Failed to resolve pending invites:", e);
  }
}

/** Fetch user's role on a specific brand (or 'admin' if owner) */
export async function getUserRoleForBrand(brandId: string, userId: string): Promise<BrandRole | null> {
  const { data: brand } = await supabase.from("brands").select("owner_id").eq("id", brandId).maybeSingle();
  if (brand?.owner_id === userId) return "admin";

  const { data: member } = await supabase
    .from("brand_members")
    .select("role")
    .eq("brand_id", brandId)
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  return (member?.role as BrandRole) ?? null;
}

/** Fetch team members for a brand */
export async function fetchBrandTeamMembers(brandId: string): Promise<BrandMember[]> {
  const { data, error } = await supabase
    .from("brand_members")
    .select("*")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  const members: BrandMember[] = (data ?? []).map((m) => ({
    ...m,
    role: m.role as BrandRole,
    status: m.status as BrandMemberStatus,
  }));

  const userIds = members.map((m) => m.user_id).filter((u): u is string => !!u);
  if (userIds.length === 0) return members;

  const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", userIds);
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));

  return members.map((m) => ({
    ...m,
    role: m.role as BrandRole,
    status: m.status as BrandMemberStatus,
    profileName: m.user_id ? profileMap.get(m.user_id) : null,
  }));
}

/** Invite team member by email */
export async function inviteBrandMember(brandId: string, email: string, role: BrandRole): Promise<void> {
  const cleanEmail = email.toLowerCase().trim();

  const { data: existingMember } = await supabase
    .from("brand_members")
    .select("id")
    .eq("brand_id", brandId)
    .eq("email", cleanEmail)
    .maybeSingle();

  if (existingMember) {
    throw new Error("This email has already been invited to this brand.");
  }

  const { error } = await supabase.from("brand_members").insert({
    brand_id: brandId,
    email: cleanEmail,
    role,
    status: "pending",
  });

  if (error) throw error;
}

/** Update member role */
export async function updateBrandMemberRole(memberId: string, role: BrandRole): Promise<void> {
  const { error } = await supabase.from("brand_members").update({ role }).eq("id", memberId);
  if (error) throw error;
}

/** Remove member from brand */
export async function removeBrandMember(memberId: string): Promise<void> {
  const { error } = await supabase.from("brand_members").delete().eq("id", memberId);
  if (error) throw error;
}

/** Post official brand response to an item */
export async function createBrandResponse(
  itemId: string,
  brandId: string,
  userId: string,
  responseText: string,
): Promise<BrandResponse> {
  const { data, error } = await supabase
    .from("brand_responses")
    .insert({
      item_id: itemId,
      brand_id: brandId,
      user_id: userId,
      response_text: responseText.trim(),
    })
    .select("*")
    .single();

  if (error) throw error;

  // Trigger webhooks asynchronously
  void triggerWebhookDelivery(brandId, "new_response", {
    id: data.id,
    item_id: itemId,
    response_text: responseText,
    created_at: data.created_at,
  });

  return data;
}

/** Fetch brand response for an item */
export async function fetchBrandResponseForItem(itemId: string): Promise<BrandResponse | null> {
  const { data, error } = await supabase
    .from("brand_responses")
    .select("*")
    .eq("item_id", itemId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const [{ data: profile }, { data: brand }] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", data.user_id).maybeSingle(),
    supabase.from("brands").select("name").eq("id", data.brand_id).maybeSingle(),
  ]);

  return {
    ...data,
    authorName: profile?.display_name ?? "Brand Representative",
    brandName: brand?.name ?? "Brand",
  };
}

/** Update sentiment and category on a post (by brand team) */
export async function updateItemCategoryAndSentiment(
  itemId: string,
  category: string,
  sentiment: SentimentType,
): Promise<void> {
  const { error } = await supabase
    .from("items")
    .update({ category, sentiment })
    .eq("id", itemId);

  if (error) throw error;
}

/** Fetch dashboard KPIs for a list of brand IDs or single brand */
export async function fetchDashboardKPIs(brandIds: string[]): Promise<DashboardKPIs> {
  if (brandIds.length === 0) {
    return {
      postVolume: 0,
      stashPct: 0,
      sentimentSplit: { positive: 0, neutral: 0, negative: 0, unknown: 0 },
      unansweredCount: 0,
      medianResponseTimeHours: null,
    };
  }

  const { data: items, error } = await supabase
    .from("items")
    .select("id, created_at, category, sentiment, responded_at")
    .in("brand_id", brandIds);

  if (error) throw error;

  const postVolume = items?.length ?? 0;
  if (postVolume === 0) {
    return {
      postVolume: 0,
      stashPct: 0,
      sentimentSplit: { positive: 0, neutral: 0, negative: 0, unknown: 0 },
      unansweredCount: 0,
      medianResponseTimeHours: null,
    };
  }

  const itemIds = items.map((i) => i.id);

  const { data: votes } = await supabase
    .from("votes")
    .select("verdict")
    .in("item_id", itemIds);

  const totalVotes = votes?.length ?? 0;
  const stashVotes = (votes ?? []).filter((v) => v.verdict === "stash").length;
  const stashPct = totalVotes > 0 ? Math.round((stashVotes / totalVotes) * 100) : 0;

  const sentimentSplit = {
    positive: 0,
    neutral: 0,
    negative: 0,
    unknown: 0,
  };

  for (const item of items) {
    const s = (item.sentiment as SentimentType) || "unknown";
    if (s in sentimentSplit) {
      sentimentSplit[s]++;
    } else {
      sentimentSplit.unknown++;
    }
  }

  const unansweredCount = items.filter((i) => !i.responded_at).length;

  const responseTimesHours: number[] = [];
  for (const item of items) {
    if (item.responded_at && item.created_at) {
      const created = new Date(item.created_at).getTime();
      const responded = new Date(item.responded_at).getTime();
      const diffHours = (responded - created) / (1000 * 60 * 60);
      if (diffHours >= 0) {
        responseTimesHours.push(diffHours);
      }
    }
  }

  let medianResponseTimeHours: number | null = null;
  if (responseTimesHours.length > 0) {
    responseTimesHours.sort((a, b) => a - b);
    const mid = Math.floor(responseTimesHours.length / 2);
    if (responseTimesHours.length % 2 === 0) {
      medianResponseTimeHours = Math.round(((responseTimesHours[mid - 1] + responseTimesHours[mid]) / 2) * 10) / 10;
    } else {
      medianResponseTimeHours = Math.round(responseTimesHours[mid] * 10) / 10;
    }
  }

  return {
    postVolume,
    stashPct,
    sentimentSplit,
    unansweredCount,
    medianResponseTimeHours,
  };
}

/** Fetch brands where the user is either the owner OR an active brand_member */
export async function fetchAllUserBrands(userId: string) {
  const { data: ownedBrands } = await supabase
    .from("brands")
    .select("*")
    .eq("owner_id", userId);

  const { data: memberRows } = await supabase
    .from("brand_members")
    .select("brand_id, role")
    .eq("user_id", userId)
    .eq("status", "active");

  const memberBrandIds = (memberRows ?? []).map((m) => m.brand_id);

  let memberBrands: any[] = [];
  if (memberBrandIds.length > 0) {
    const { data } = await supabase.from("brands").select("*").in("id", memberBrandIds);
    memberBrands = data ?? [];
  }

  const roleMap = new Map<string, BrandRole>();
  for (const b of ownedBrands ?? []) {
    roleMap.set(b.id, "admin");
  }
  for (const m of memberRows ?? []) {
    if (!roleMap.has(m.brand_id)) {
      roleMap.set(m.brand_id, m.role as BrandRole);
    }
  }

  const allMap = new Map<string, any>();
  for (const b of [...(ownedBrands ?? []), ...memberBrands]) {
    allMap.set(b.id, {
      ...b,
      userRole: roleMap.get(b.id) ?? "viewer",
    });
  }

  return [...allMap.values()];
}

/** Fetch active crisis alerts for user's brands */
export async function fetchCrisisAlerts(brandIds: string[]): Promise<CrisisAlert[]> {
  if (brandIds.length === 0) return [];

  const { data, error } = await supabase
    .from("crisis_alerts")
    .select("*")
    .in("brand_id", brandIds)
    .eq("acknowledged", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name")
    .in("id", brandIds);

  const nameMap = new Map((brands ?? []).map((b) => [b.id, b.name]));

  return data.map((a) => ({
    ...a,
    brandName: nameMap.get(a.brand_id) ?? "Brand",
  }));
}

/** Acknowledge a crisis alert */
export async function acknowledgeCrisisAlert(alertId: string): Promise<void> {
  const { error } = await supabase
    .from("crisis_alerts")
    .update({ acknowledged: true })
    .eq("id", alertId);

  if (error) throw error;
}
