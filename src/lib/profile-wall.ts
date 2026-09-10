import { supabase } from "@/integrations/supabase/client";

export type WallPostType = "experience" | "idea" | "concept" | "invention" | "innovation";

export type ProfileWallPost = {
  id: string;
  author_id: string;
  body: string;
  post_type: WallPostType;
  status: "published" | "hidden" | "removed";
  created_at: string;
};

const wallTable = () => supabase.from("profile_wall_posts" as never);

export async function fetchProfileWallPosts(authorId: string) {
  const { data, error } = await wallTable()
    .select("id, author_id, body, post_type, status, created_at")
    .eq("author_id", authorId)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as ProfileWallPost[];
}

export async function createProfileWallPost(input: {
  authorId: string;
  body: string;
  postType: WallPostType;
}) {
  const { error } = await wallTable().insert({
    author_id: input.authorId,
    body: input.body.trim(),
    post_type: input.postType,
    status: "published",
  });

  if (error) throw error;
}
