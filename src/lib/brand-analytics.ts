import { supabase } from "@/integrations/supabase/client";

export type TimeWindow = 7 | 30 | 90;

export type AnalyticsDayData = {
  date: string;
  volume: number;
  stashPct: number;
  positive: number;
  neutral: number;
  negative: number;
};

export type Influencer = {
  userId: string;
  displayName: string;
  trustScore: number;
  followerCount: number;
  postsCount: number;
  totalStash: number;
  engagementScore: number;
};

export async function fetchAnalyticsData(
  brandIds: string[],
  days: TimeWindow,
): Promise<AnalyticsDayData[]> {
  if (brandIds.length === 0) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: items, error } = await supabase
    .from("items")
    .select("id, created_at, sentiment")
    .in("brand_id", brandIds)
    .gte("created_at", startDate.toISOString());

  if (error) throw error;
  const itemList = items ?? [];
  const itemIds = itemList.map((i) => i.id);

  let votes: { item_id: string; verdict: string }[] = [];
  if (itemIds.length > 0) {
    const { data: voteData } = await supabase
      .from("votes")
      .select("item_id, verdict")
      .in("item_id", itemIds);
    votes = voteData ?? [];
  }

  // Group by date YYYY-MM-DD
  const dayMap = new Map<string, { volume: number; stash: number; totalVotes: number; pos: number; neu: number; neg: number }>();

  // Initialize all days in date range so charts render continuous timeline
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    dayMap.set(dateStr, { volume: 0, stash: 0, totalVotes: 0, pos: 0, neu: 0, neg: 0 });
  }

  for (const item of itemList) {
    const dateStr = item.created_at.split("T")[0];
    let entry = dayMap.get(dateStr);
    if (!entry) {
      entry = { volume: 0, stash: 0, totalVotes: 0, pos: 0, neu: 0, neg: 0 };
      dayMap.set(dateStr, entry);
    }

    entry.volume++;

    const s = item.sentiment;
    if (s === "positive") entry.pos++;
    else if (s === "negative") entry.neg++;
    else entry.neu++;

    const itemVotes = votes.filter((v) => v.item_id === item.id);
    entry.totalVotes += itemVotes.length;
    entry.stash += itemVotes.filter((v) => v.verdict === "stash").length;
  }

  const result: AnalyticsDayData[] = [];
  for (const [date, val] of dayMap.entries()) {
    const stashPct = val.totalVotes > 0 ? Math.round((val.stash / val.totalVotes) * 100) : 50;
    result.push({
      date: date.slice(5), // MM-DD
      volume: val.volume,
      stashPct,
      positive: val.pos,
      neutral: val.neu,
      negative: val.neg,
    });
  }

  return result;
}

export async function fetchInfluencerRankings(
  brandIds: string[],
  limit = 10,
): Promise<Influencer[]> {
  if (brandIds.length === 0) return [];

  // Fetch posts about these brands
  const { data: items } = await supabase
    .from("items")
    .select("id, user_id")
    .in("brand_id", brandIds);

  if (!items || items.length === 0) return [];

  const authorPostsCount = new Map<string, number>();
  for (const item of items) {
    authorPostsCount.set(item.user_id, (authorPostsCount.get(item.user_id) ?? 0) + 1);
  }

  const userIds = [...authorPostsCount.keys()];

  // Fetch profiles, followers, and votes on their posts
  const itemIds = items.map((i) => i.id);
  const [{ data: profiles }, { data: votes }, { data: follows }] = await Promise.all([
    supabase.from("profiles").select("id, display_name, trust_score").in("id", userIds),
    supabase.from("votes").select("item_id, verdict").in("item_id", itemIds),
    supabase.from("follows").select("followee_id").in("followee_id", userIds),
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const itemToUserMap = new Map(items.map((i) => [i.id, i.user_id]));

  const userStashCount = new Map<string, number>();
  for (const v of votes ?? []) {
    if (v.verdict === "stash") {
      const u = itemToUserMap.get(v.item_id);
      if (u) {
        userStashCount.set(u, (userStashCount.get(u) ?? 0) + 1);
      }
    }
  }

  const userFollowerCount = new Map<string, number>();
  for (const f of follows ?? []) {
    if (f.followee_id) {
      userFollowerCount.set(f.followee_id, (userFollowerCount.get(f.followee_id) ?? 0) + 1);
    }
  }

  const influencers: Influencer[] = userIds.map((uid) => {
    const prof = profileMap.get(uid);
    const postsCount = authorPostsCount.get(uid) ?? 0;
    const totalStash = userStashCount.get(uid) ?? 0;
    const followerCount = userFollowerCount.get(uid) ?? 0;
    const trustScore = prof?.trust_score ?? 10;

    // Engagement score formula
    const engagementScore = Math.round(trustScore * 2 + followerCount * 5 + totalStash * 3 + postsCount * 4);

    return {
      userId: uid,
      displayName: prof?.display_name ?? "Anonymous User",
      trustScore,
      followerCount,
      postsCount,
      totalStash,
      engagementScore,
    };
  });

  influencers.sort((a, b) => b.engagementScore - a.engagementScore);
  return influencers.slice(0, limit);
}

export function exportAnalyticsCSV(data: AnalyticsDayData[], filename = "brand-cx-analytics.csv") {
  if (data.length === 0) return;

  const headers = ["Date", "Post Volume", "Stash %", "Positive Sentiment", "Neutral Sentiment", "Negative Sentiment"];
  const rows = data.map((d) => [d.date, d.volume, `${d.stashPct}%`, d.positive, d.neutral, d.negative]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
