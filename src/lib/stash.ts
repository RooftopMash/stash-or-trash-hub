import { supabase } from "@/integrations/supabase/client";

export type Verdict = "stash" | "trash";

export type FeedItem = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  brand_id: string | null;
  category: string | null;
  authorName: string;
  brandName: string | null;
  brandSlug: string | null;
  stashCount: number;
  trashCount: number;
  myVerdict: Verdict | null;
  signedImageUrl: string | null;
};

export const BUCKET = "item-images";

export async function signImages(paths: (string | null)[]): Promise<Map<string, string>> {
  const unique = [...new Set(paths.filter((p): p is string => !!p))];
  const map = new Map<string, string>();
  if (unique.length === 0) return map;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(unique, 60 * 60 * 24 * 7);
  data?.forEach((entry) => {
    if (entry.signedUrl && entry.path) map.set(entry.path, entry.signedUrl);
  });
  return map;
}

export async function fetchFeed(
  currentUserId: string | null,
  opts?: { brandId?: string },
): Promise<FeedItem[]> {
  let query = supabase
    .from("items")
    .select("id, user_id, title, description, image_url, created_at, brand_id, category")
    .order("created_at", { ascending: false });
  if (opts?.brandId) query = query.eq("brand_id", opts.brandId);
  const { data: items, error } = await query;
  if (error) throw error;
  if (!items || items.length === 0) return [];

  const itemIds = items.map((i) => i.id);
  const authorIds = [...new Set(items.map((i) => i.user_id))];
  const brandIds = [...new Set(items.map((i) => i.brand_id).filter((b): b is string => !!b))];

  const [{ data: votes }, { data: profiles }, brandsRes, signed] = await Promise.all([
    supabase.from("votes").select("item_id, user_id, verdict").in("item_id", itemIds),
    supabase.from("profiles").select("id, display_name").in("id", authorIds),
    brandIds.length
      ? supabase.from("brands").select("id, name, slug").in("id", brandIds)
      : Promise.resolve({ data: [] as { id: string; name: string; slug: string }[] }),
    signImages(items.map((i) => i.image_url)),
  ]);

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
  const brandById = new Map((brandsRes.data ?? []).map((b) => [b.id, b]));

  return items.map((item) => {
    const itemVotes = (votes ?? []).filter((v) => v.item_id === item.id);
    const brand = item.brand_id ? brandById.get(item.brand_id) : null;
    return {
      ...item,
      authorName: nameById.get(item.user_id) ?? "Anonymous",
      brandName: brand?.name ?? null,
      brandSlug: brand?.slug ?? null,
      stashCount: itemVotes.filter((v) => v.verdict === "stash").length,
      trashCount: itemVotes.filter((v) => v.verdict === "trash").length,
      myVerdict:
        (currentUserId
          ? (itemVotes.find((v) => v.user_id === currentUserId)?.verdict as Verdict | undefined)
          : undefined) ?? null,
      signedImageUrl: item.image_url ? (signed.get(item.image_url) ?? null) : null,
    };
  });
}

export async function castVote(itemId: string, userId: string, verdict: Verdict) {
  const { error } = await supabase
    .from("votes")
    .upsert({ item_id: itemId, user_id: userId, verdict }, { onConflict: "item_id,user_id" });
  if (error) throw error;
}

export async function removeVote(itemId: string, userId: string) {
  const { error } = await supabase
    .from("votes")
    .delete()
    .eq("item_id", itemId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function createItem(input: {
  userId: string;
  title: string;
  description: string;
  file: File | null;
  brandId?: string | null;
  category?: string | null;
}) {
  let imagePath: string | null = null;
  if (input.file) {
    const ext = input.file.name.split(".").pop() ?? "jpg";
    const path = `${input.userId}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, input.file, { upsert: false });
    if (upErr) throw upErr;
    imagePath = path;
  }
  const { error } = await supabase.from("items").insert({
    user_id: input.userId,
    title: input.title.trim(),
    description: input.description.trim() || null,
    image_url: imagePath,
    brand_id: input.brandId || null,
    category: input.category?.trim() || null,
  });
  if (error) throw error;
}

export async function deleteItem(itemId: string) {
  const { error } = await supabase.from("items").delete().eq("id", itemId);
  if (error) throw error;
}
