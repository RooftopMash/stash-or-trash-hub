import { supabase } from "@/integrations/supabase/client";

/* ---------------------------------- likes --------------------------------- */

export async function likePost(itemId: string, userId: string) {
  const { error } = await supabase.from("post_likes").insert({ item_id: itemId, user_id: userId });
  if (error && error.code !== "23505") throw error;
}

export async function unlikePost(itemId: string, userId: string) {
  const { error } = await supabase
    .from("post_likes")
    .delete()
    .eq("item_id", itemId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function userLikedPost(itemId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("post_likes")
    .select("id")
    .eq("item_id", itemId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

export async function getPostLikeCount(itemId: string): Promise<number> {
  const { count } = await supabase
    .from("post_likes")
    .select("id", { count: "exact", head: true })
    .eq("item_id", itemId);
  return count ?? 0;
}

/* --------------------------------- reposts -------------------------------- */

export async function repostItem(itemId: string, userId: string) {
  const { error } = await supabase.from("reposts").insert({ item_id: itemId, user_id: userId });
  if (error && error.code !== "23505") throw error;
}

export async function unrepostItem(itemId: string, userId: string) {
  const { error } = await supabase
    .from("reposts")
    .delete()
    .eq("item_id", itemId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function userReposted(itemId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("reposts")
    .select("id")
    .eq("item_id", itemId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

export async function getRepostCount(itemId: string): Promise<number> {
  const { count } = await supabase
    .from("reposts")
    .select("id", { count: "exact", head: true })
    .eq("item_id", itemId);
  return count ?? 0;
}

/* -------------------------------- comments -------------------------------- */

export type Comment = {
  id: string;
  item_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  created_at: string;
  authorName: string;
  likeCount: number;
  userLiked: boolean;
};

export async function getComments(itemId: string, currentUserId?: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("post_comments")
    .select("id, item_id, user_id, parent_id, body, created_at")
    .eq("item_id", itemId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  const rows = data ?? [];
  if (rows.length === 0) return [];

  const ids = rows.map((r) => r.id);
  const authorIds = [...new Set(rows.map((r) => r.user_id))];

  const [{ data: profiles }, { data: likes }] = await Promise.all([
    supabase.from("profiles").select("id, display_name").in("id", authorIds),
    supabase.from("comment_likes").select("comment_id, user_id").in("comment_id", ids),
  ]);

  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));

  return rows.map((r) => {
    const rowLikes = (likes ?? []).filter((l) => l.comment_id === r.id);
    return {
      ...r,
      authorName: nameById.get(r.user_id) ?? "Anonymous",
      likeCount: rowLikes.length,
      userLiked: !!currentUserId && rowLikes.some((l) => l.user_id === currentUserId),
    };
  });
}

export async function createComment(
  itemId: string,
  userId: string,
  body: string,
  parentId?: string | null,
) {
  const { error } = await supabase.from("post_comments").insert({
    item_id: itemId,
    user_id: userId,
    body: body.trim(),
    parent_id: parentId ?? null,
  });
  if (error) throw error;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase.from("post_comments").delete().eq("id", commentId);
  if (error) throw error;
}

export async function likeComment(commentId: string, userId: string) {
  const { error } = await supabase
    .from("comment_likes")
    .insert({ comment_id: commentId, user_id: userId });
  if (error && error.code !== "23505") throw error;
}

export async function unlikeComment(commentId: string, userId: string) {
  const { error } = await supabase
    .from("comment_likes")
    .delete()
    .eq("comment_id", commentId)
    .eq("user_id", userId);
  if (error) throw error;
}

/* --------------------------------- follows -------------------------------- */

export async function followUser(followerId: string, followeeId: string) {
  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: followerId, followee_id: followeeId });
  if (error && error.code !== "23505") throw error;
}

export async function unfollowUser(followerId: string, followeeId: string) {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId);
  if (error) throw error;
}

export async function followBrand(followerId: string, brandId: string) {
  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: followerId, followee_id: null, brand_id: brandId } as never);
  if (error && error.code !== "23505") throw error;
}

export async function unfollowBrand(followerId: string, brandId: string) {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("brand_id", brandId);
  if (error) throw error;
}

export async function isFollowingBrand(followerId: string, brandId: string): Promise<boolean> {
  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("brand_id", brandId)
    .maybeSingle();
  return !!data;
}

export async function isFollowingUser(followerId: string, followeeId: string): Promise<boolean> {
  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("followee_id", followeeId)
    .maybeSingle();
  return !!data;
}

/** ids the user follows: people + brands */
export async function getFollowing(
  followerId: string,
): Promise<{ userIds: string[]; brandIds: string[] }> {
  const { data } = await supabase
    .from("follows")
    .select("followee_id, brand_id")
    .eq("follower_id", followerId);
  const rows = data ?? [];
  return {
    userIds: rows.map((r) => r.followee_id).filter((v): v is string => !!v),
    brandIds: rows.map((r) => r.brand_id).filter((v): v is string => !!v),
  };
}

export async function getFollowerCount(opts: {
  userId?: string;
  brandId?: string;
}): Promise<number> {
  let q = supabase.from("follows").select("id", { count: "exact", head: true });
  if (opts.userId) q = q.eq("followee_id", opts.userId);
  if (opts.brandId) q = q.eq("brand_id", opts.brandId);
  const { count } = await q;
  return count ?? 0;
}

/* -------------------------------- hashtags -------------------------------- */

export type Hashtag = { id: string; tag: string; use_count: number };

export async function getTrendingHashtags(limit = 10): Promise<Hashtag[]> {
  const { data, error } = await supabase
    .from("hashtags")
    .select("id, tag, use_count")
    .gt("use_count", 0)
    .order("use_count", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/** item ids tagged with a hashtag */
export async function getItemsByHashtag(tag: string): Promise<{ item_id: string }[]> {
  const { data: hashtag } = await supabase
    .from("hashtags")
    .select("id")
    .eq("tag", tag.toLowerCase())
    .maybeSingle();
  if (!hashtag) return [];
  const { data } = await supabase
    .from("post_hashtags")
    .select("item_id")
    .eq("hashtag_id", hashtag.id);
  return data ?? [];
}

/* ------------------------------ notifications ----------------------------- */

export type AppNotification = {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: string;
  item_id: string | null;
  comment_id: string | null;
  read_at: string | null;
  created_at: string;
  actorName: string;
};

export async function getNotifications(userId: string): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("id, user_id, actor_id, type, item_id, comment_id, read_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  const rows = data ?? [];
  if (rows.length === 0) return [];

  const actorIds = [...new Set(rows.map((r) => r.actor_id).filter((v): v is string => !!v))];
  const { data: profiles } = actorIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", actorIds)
    : { data: [] as { id: string; display_name: string }[] };
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));

  return rows.map((r) => ({
    ...r,
    actorName: (r.actor_id ? nameById.get(r.actor_id) : null) ?? "Someone",
  }));
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);
  return count ?? 0;
}

export async function markNotificationsRead(userId: string) {
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);
}

/* -------------------------------- profiles -------------------------------- */

export type PublicProfile = {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  trust_score: number;
};

export async function getPublicProfile(userId: string): Promise<PublicProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, bio, avatar_url, trust_score")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export type ProfileStats = {
  posts: number;
  stash: number;
  trash: number;
  following: number;
};

/** Public activity counters for a member profile (all from publicly readable tables). */
export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const [posts, votes, following] = await Promise.all([
    supabase.from("items").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("votes").select("verdict").eq("user_id", userId),
    supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("follower_id", userId),
  ]);
  const rows = votes.data ?? [];
  return {
    posts: posts.count ?? 0,
    stash: rows.filter((v) => v.verdict === "stash").length,
    trash: rows.filter((v) => v.verdict === "trash").length,
    following: following.count ?? 0,
  };
}

export async function updateMyProfile(input: {
  userId: string;
  display_name: string;
  bio: string;
  avatar_url: string;
}) {
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: input.display_name.trim() || "Anonymous",
      bio: input.bio.trim() || null,
      avatar_url: input.avatar_url.trim() || null,
    })
    .eq("id", input.userId);
  if (error) throw error;
}

/* ----------------------------- user media storage ---------------------------- */

export type UserMediaItem = {
  id: string;
  user_id: string;
  media_url: string;
  media_type: "photo" | "video" | "audio";
  caption: string | null;
  created_at: string;
  signedUrl?: string;
};

export async function fetchUserMedia(userId: string): Promise<UserMediaItem[]> {
  const { data, error } = await supabase
    .from("user_media")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  const rows = (data ?? []) as UserMediaItem[];

  // Sign URLs if stored as relative path
  const paths = rows.map((r) => r.media_url).filter((u) => !/^https?:\/\//i.test(u));
  if (paths.length === 0) return rows;

  const { data: signed } = await supabase.storage
    .from("user-media")
    .createSignedUrls(paths, 60 * 60 * 24 * 7);

  const signedMap = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  return rows.map((r) => ({
    ...r,
    signedUrl: /^https?:\/\//i.test(r.media_url)
      ? r.media_url
      : (signedMap.get(r.media_url) ?? r.media_url),
  }));
}

export async function uploadUserMedia(
  userId: string,
  file: File,
  caption?: string,
): Promise<UserMediaItem> {
  const ext = file.name.split(".").pop() ?? "file";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  let mediaType: "photo" | "video" | "audio" = "photo";
  if (file.type.startsWith("video/")) mediaType = "video";
  else if (file.type.startsWith("audio/")) mediaType = "audio";

  const { error: upErr } = await supabase.storage
    .from("user-media")
    .upload(path, file, { upsert: false });

  if (upErr) throw upErr;

  const { data, error } = await supabase
    .from("user_media")
    .insert({
      user_id: userId,
      media_url: path,
      media_type: mediaType,
      caption: caption?.trim() || null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as UserMediaItem;
}

export async function deleteUserMedia(mediaId: string): Promise<void> {
  const { error } = await supabase.from("user_media").delete().eq("id", mediaId);
  if (error) throw error;
}

/* ------------------------------- friends system ------------------------------ */

export type FriendRequest = {
  id: string;
  user_id: string;
  friend_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  profileName?: string;
  avatarUrl?: string | null;
};

export async function sendFriendRequest(userId: string, friendId: string): Promise<void> {
  const { error } = await supabase.from("friends").insert({
    user_id: userId,
    friend_id: friendId,
    status: "pending",
  });
  if (error) throw error;
}

export async function acceptFriendRequest(requestId: string): Promise<void> {
  const { error } = await supabase
    .from("friends")
    .update({ status: "accepted" })
    .eq("id", requestId);
  if (error) throw error;
}

export async function declineFriendRequest(requestId: string): Promise<void> {
  const { error } = await supabase.from("friends").delete().eq("id", requestId);
  if (error) throw error;
}

export async function getFriendshipStatus(
  userId: string,
  targetId: string,
): Promise<{ status: "none" | "pending_sent" | "pending_received" | "friends"; requestId?: string }> {
  const { data } = await supabase
    .from("friends")
    .select("id, user_id, friend_id, status")
    .or(`and(user_id.eq.${userId},friend_id.eq.${targetId}),and(user_id.eq.${targetId},friend_id.eq.${userId})`)
    .maybeSingle();

  if (!data) return { status: "none" };

  if (data.status === "accepted") return { status: "friends", requestId: data.id };

  if (data.user_id === userId) return { status: "pending_sent", requestId: data.id };
  return { status: "pending_received", requestId: data.id };
}

export async function getFriendsList(userId: string): Promise<PublicProfile[]> {
  const { data } = await supabase
    .from("friends")
    .select("user_id, friend_id")
    .eq("status", "accepted")
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

  if (!data || data.length === 0) return [];

  const friendUserIds = data.map((r) => (r.user_id === userId ? r.friend_id : r.user_id));

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, bio, avatar_url, trust_score")
    .in("id", friendUserIds);

  return profiles ?? [];
}

export async function getPendingFriendRequests(userId: string): Promise<FriendRequest[]> {
  const { data, error } = await supabase
    .from("friends")
    .select("*")
    .eq("friend_id", userId)
    .eq("status", "pending");

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const senderIds = data.map((r) => r.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", senderIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  return data.map((r) => ({
    ...r,
    status: r.status as "pending" | "accepted" | "declined",
    profileName: profileMap.get(r.user_id)?.display_name ?? "User",
    avatarUrl: profileMap.get(r.user_id)?.avatar_url ?? null,
  }));
}
