import { supabase } from "@/integrations/supabase/client";
import { analyzeImage, hamming, type MediaAuditReport } from "@/lib/media-forensics";
import { triggerWebhookDelivery } from "@/lib/webhooks";

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
  audit?: MediaAuditReport | null;
  phash?: string | null;
};

export const BUCKET = "item-images";

const ITEM_SELECT =
  "id, user_id, title, description, image_url, created_at, brand_id, category, audit, phash";
const ITEM_SELECT_FALLBACK =
  "id, user_id, title, description, image_url, created_at, brand_id, category";

function colError(e: unknown): boolean {
  const msg = String((e as { message?: string })?.message ?? "");
  return /audit|phash|column|42703/i.test(msg);
}

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
  const q = supabase
    .from("items")
    .select(ITEM_SELECT)
    .order("created_at", { ascending: false });
  const first = await (opts?.brandId ? q.eq("brand_id", opts.brandId) : q);
  let items: any[] | null = first.data;
  let error: any = first.error;
  if (error && colError(error)) {
    const fb = supabase
      .from("items")
      .select(ITEM_SELECT_FALLBACK)
      .order("created_at", { ascending: false });
    const second = await (opts?.brandId ? fb.eq("brand_id", opts.brandId) : fb);
    items = second.data;
    error = second.error;
  }
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
      audit: (item.audit as MediaAuditReport | null | undefined) ?? null,
      phash: (item.phash as string | null | undefined) ?? null,
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
  const { error } = await supabase.from("votes").delete().eq("item_id", itemId).eq("user_id", userId);
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
  let audit: MediaAuditReport | null = null;
  let phash: string | null = null;

  if (input.file) {
    const ext = input.file.name.split(".").pop() ?? "jpg";
    const path = `${input.userId}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, input.file, { upsert: false });
    if (upErr) throw upErr;
    imagePath = path;

    audit = await analyzeImage(input.file).catch(() => null);
    phash = audit?.phash ?? null;

    if (phash && audit) {
      const myPhash: string = phash;
      const baseAudit = audit;
      try {
        const { data: recent } = await supabase
          .from("items")
          .select("phash")
          .not("phash", "is", null)
          .order("created_at", { ascending: false })
          .limit(200);
        const dup = (recent ?? []).find(
          (r) => typeof r.phash === "string" && hamming(myPhash, r.phash) <= 4,
        );
        if (dup) {
          audit = {
            ...baseAudit,
            tier: "reused",
            flags: [...baseAudit.flags, "Near-duplicate of an existing post detected"],
          };
        }
      } catch {
        /* dedup is best-effort; never block posting */
      }
    }
  }

  const base = {
    user_id: input.userId,
    title: input.title.trim(),
    description: input.description.trim() || null,
    image_url: imagePath,
    brand_id: input.brandId || null,
    category: input.category?.trim() || null,
  };

  let { error } = await supabase
    .from("items")
    .insert({ ...base, audit, phash } as never);
  if (error && colError(error)) {
    ({ error } = await supabase.from("items").insert(base as never));
  }
  if (error) throw error;

  if (input.brandId) {
    void triggerWebhookDelivery(input.brandId, "new_post", {
      title: input.title,
      description: input.description,
      category: base.category,
    });
  }
}

export async function deleteItem(itemId: string) {
  const { error } = await supabase.from("items").delete().eq("id", itemId);
  if (error) throw error;
}

/** Single post with its verdict counts (public read). */
export async function fetchItem(
  itemId: string,
  currentUserId: string | null,
): Promise<FeedItem | null> {
  const q1 = await supabase
    .from("items")
    .select(ITEM_SELECT)
    .eq("id", itemId)
    .maybeSingle();
  let item: any = q1.data;
  let error: any = q1.error;
  if (error && colError(error)) {
    const q2 = await supabase
      .from("items")
      .select(ITEM_SELECT_FALLBACK)
      .eq("id", itemId)
      .maybeSingle();
    item = q2.data;
    error = q2.error;
  }
  if (error) throw error;
  if (!item) return null;

  const [{ data: votes }, { data: profile }, brandRes, signed] = await Promise.all([
    supabase.from("votes").select("item_id, user_id, verdict").eq("item_id", itemId),
    supabase.from("profiles").select("id, display_name").eq("id", item.user_id).maybeSingle(),
    item.brand_id
      ? supabase.from("brands").select("id, name, slug").eq("id", item.brand_id).maybeSingle()
      : Promise.resolve({ data: null as { id: string; name: string; slug: string } | null }),
    signImages([item.image_url]),
  ]);

  const itemVotes = votes ?? [];
  return {
    ...item,
    authorName: profile?.display_name ?? "Anonymous",
    brandName: brandRes.data?.name ?? null,
    brandSlug: brandRes.data?.slug ?? null,
    stashCount: itemVotes.filter((v) => v.verdict === "stash").length,
    trashCount: itemVotes.filter((v) => v.verdict === "trash").length,
    myVerdict:
      (currentUserId
        ? (itemVotes.find((v) => v.user_id === currentUserId)?.verdict as Verdict | undefined)
        : undefined) ?? null,
    signedImageUrl: item.image_url ? (signed.get(item.image_url) ?? null) : null,
    audit: (item.audit as MediaAuditReport | null | undefined) ?? null,
    phash: (item.phash as string | null | undefined) ?? null,
  };
}

/** Posts authored by one user. */
export async function fetchUserItems(
  userId: string,
  currentUserId: string | null,
): Promise<FeedItem[]> {
  const all = await fetchFeed(currentUserId);
  return all.filter((i) => i.user_id === userId);
}
