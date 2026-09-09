import { supabase } from "@/integrations/supabase/client";

export const WALL_TYPES = ["experience", "idea", "concept", "invention", "innovation"] as const;
export type WallPostType = (typeof WALL_TYPES)[number];
export type WallPost = {
  id: string;
  author_id: string;
  body: string;
  post_type: WallPostType;
  brand_id: string | null;
  created_at: string;
};

const wallTable = () => (supabase as unknown as { from: (table: string) => ReturnType<typeof supabase.from> }).from("profile_wall_posts");

export async function getProfileWallPosts(authorId: string) {
  const { data, error } = await wallTable()
    .select("id, author_id, body, post_type, brand_id, created_at")
    .eq("author_id", authorId)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as WallPost[];
}

export async function createProfileWallPost(input: {
  authorId: string;
  body: string;
  postType: WallPostType;
  brandId?: string | null;
}) {
  const body = input.body.trim();
  if (!body || body.length > 5000) throw new Error("Write between 1 and 5000 characters.");
  const { error } = await wallTable().insert({
    author_id: input.authorId,
    body,
    post_type: input.postType,
    brand_id: input.brandId ?? null,
  });
  if (error) throw error;
}
