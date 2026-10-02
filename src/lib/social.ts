import { supabase } from "@/integrations/supabase/client";
import { auth } from "@/lib/firebase";
import {
  getCanonicalFriendId,
  getFirestoreFriendshipBetween,
  getFirestoreFriends,
  sendFirestoreFriendRequest,
  updateFirestoreFriendStatus,
  deleteFirestoreFriend,
  getFirestoreUserProfile,
  updateFirestoreUserProfile,
  type FirestoreFriend,
} from "@/services/firestoreService";

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
  try {
    let q = supabase.from("follows").select("id", { count: "exact", head: true });
    if (opts.userId) q = q.eq("followee_id", opts.userId);
    if (opts.brandId) q = q.eq("brand_id", opts.brandId);
    const { count, error } = await q;
    if (!error && typeof count === "number" && count > 0) return count;
  } catch {
    // Fallback for non-UUID brandId
  }
  const key = opts.brandId || opts.userId || "sot";
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return 140 + (Math.abs(hash) % 860);
}

/* ------------------ friends (mutual connection requests) ------------------ */

export type FriendshipStatus = "pending" | "accepted" | "blocked";

export type FriendRecord = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendshipStatus;
  bond_tag: string;
  created_at: string;
  updated_at: string;
};

const FRIENDS_STORAGE_KEY = "sot_friends_table_v1";

function mapFirestoreToFriendRecord(f: FirestoreFriend): FriendRecord {
  return {
    id: f.id,
    requester_id: f.requesterId,
    addressee_id: f.addresseeId,
    status: f.status,
    bond_tag: f.bondTag ?? "stranger",
    created_at: f.createdAt,
    updated_at: f.updatedAt ?? f.createdAt,
  };
}

function readLocalFriends(): FriendRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FRIENDS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FriendRecord[]) : [];
  } catch {
    return [];
  }
}

function writeLocalFriends(records: FriendRecord[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore storage errors
  }
}

export async function getFriendshipBetween(
  userA: string,
  userB: string,
): Promise<FriendRecord | null> {
  if (!userA || !userB || userA === userB) return null;
  if (auth.currentUser) {
    try {
      const fsRecord = await getFirestoreFriendshipBetween(userA, userB);
      if (fsRecord) return mapFirestoreToFriendRecord(fsRecord);
    } catch {
      // continue to fallback
    }
  }
  try {
    const { data, error } = await supabase
      .from("friends")
      .select("id, requester_id, addressee_id, status, bond_tag, created_at, updated_at")
      .or(
        `and(requester_id.eq.${userA},addressee_id.eq.${userB}),and(requester_id.eq.${userB},addressee_id.eq.${userA})`,
      )
      .maybeSingle();
    if (!error && data) return data as FriendRecord;
  } catch {
    // fallback to local store
  }

  const local = readLocalFriends();
  return (
    local.find(
      (r) =>
        (r.requester_id === userA && r.addressee_id === userB) ||
        (r.requester_id === userB && r.addressee_id === userA),
    ) ?? null
  );
}

export async function sendFriendRequest(
  requesterId: string,
  addresseeId: string,
  bondTag = "stranger",
): Promise<FriendRecord> {
  const now = new Date().toISOString();
  const existing = await getFriendshipBetween(requesterId, addresseeId);
  if (existing) {
    if (existing.status === "pending" && existing.addressee_id === requesterId) {
      return acceptFriendRequest(requesterId, addresseeId);
    }
    return existing;
  }

  if (auth.currentUser?.uid === requesterId) {
    try {
      const fsCreated = await sendFirestoreFriendRequest(requesterId, addresseeId, bondTag, "pending");
      const mapped = mapFirestoreToFriendRecord(fsCreated);
      const local = readLocalFriends().filter((r) => r.id !== mapped.id);
      writeLocalFriends([mapped, ...local]);
      return mapped;
    } catch {
      // fallback
    }
  }

  try {
    const { data, error } = await supabase
      .from("friends")
      .insert({
        requester_id: requesterId,
        addressee_id: addresseeId,
        status: "pending",
        bond_tag: bondTag,
      })
      .select()
      .maybeSingle();
    if (!error && data) {
      const local = readLocalFriends().filter((r) => r.id !== data.id);
      writeLocalFriends([data as FriendRecord, ...local]);
      return data as FriendRecord;
    }
  } catch {
    // fallback to local store
  }

  const record: FriendRecord = {
    id: getCanonicalFriendId(requesterId, addresseeId),
    requester_id: requesterId,
    addressee_id: addresseeId,
    status: "pending",
    bond_tag: bondTag,
    created_at: now,
    updated_at: now,
  };
  const local = readLocalFriends().filter((r) => r.id !== record.id);
  writeLocalFriends([record, ...local]);
  return record;
}

export async function acceptFriendRequest(
  currentUserId: string,
  otherUserId: string,
): Promise<FriendRecord> {
  const now = new Date().toISOString();
  const canonicalId = getCanonicalFriendId(currentUserId, otherUserId);
  if (auth.currentUser) {
    try {
      await updateFirestoreFriendStatus(canonicalId, "accepted");
    } catch {
      // fallback
    }
  }
  try {
    const { data, error } = await supabase
      .from("friends")
      .update({ status: "accepted", updated_at: now })
      .or(
        `and(requester_id.eq.${otherUserId},addressee_id.eq.${currentUserId}),and(requester_id.eq.${currentUserId},addressee_id.eq.${otherUserId})`,
      )
      .select()
      .maybeSingle();
    if (!error && data) {
      const local = readLocalFriends().filter((r) => r.id !== data.id);
      writeLocalFriends([data as FriendRecord, ...local]);
      return data as FriendRecord;
    }
  } catch {
    // fallback
  }

  const local = readLocalFriends();
  const idx = local.findIndex(
    (r) =>
      (r.requester_id === otherUserId && r.addressee_id === currentUserId) ||
      (r.requester_id === currentUserId && r.addressee_id === otherUserId),
  );
  if (idx >= 0) {
    local[idx] = { ...local[idx], status: "accepted", updated_at: now };
    writeLocalFriends(local);
    return local[idx];
  }
  const created: FriendRecord = {
    id: canonicalId,
    requester_id: otherUserId,
    addressee_id: currentUserId,
    status: "accepted",
    bond_tag: "stranger",
    created_at: now,
    updated_at: now,
  };
  writeLocalFriends([created, ...local]);
  return created;
}

export async function blockFriendConnection(
  currentUserId: string,
  otherUserId: string,
): Promise<FriendRecord> {
  const now = new Date().toISOString();
  const existing = await getFriendshipBetween(currentUserId, otherUserId);
  const canonicalId = getCanonicalFriendId(currentUserId, otherUserId);
  if (auth.currentUser) {
    try {
      if (existing) {
        await updateFirestoreFriendStatus(canonicalId, "blocked");
      } else if (auth.currentUser.uid === currentUserId) {
        await sendFirestoreFriendRequest(currentUserId, otherUserId, "stranger", "blocked");
      }
    } catch {
      // fallback
    }
  }
  try {
    if (existing) {
      const { data, error } = await supabase
        .from("friends")
        .update({ status: "blocked", updated_at: now })
        .eq("id", existing.id)
        .select()
        .maybeSingle();
      if (!error && data) return data as FriendRecord;
    } else {
      const { data, error } = await supabase
        .from("friends")
        .insert({
          requester_id: currentUserId,
          addressee_id: otherUserId,
          status: "blocked",
          bond_tag: "stranger",
        })
        .select()
        .maybeSingle();
      if (!error && data) return data as FriendRecord;
    }
  } catch {
    // fallback
  }

  const local = readLocalFriends().filter(
    (r) =>
      !(
        (r.requester_id === currentUserId && r.addressee_id === otherUserId) ||
        (r.requester_id === otherUserId && r.addressee_id === currentUserId)
      ),
  );
  const blocked: FriendRecord = {
    id: existing?.id ?? canonicalId,
    requester_id: currentUserId,
    addressee_id: otherUserId,
    status: "blocked",
    bond_tag: existing?.bond_tag ?? "stranger",
    created_at: existing?.created_at ?? now,
    updated_at: now,
  };
  writeLocalFriends([blocked, ...local]);
  return blocked;
}

export async function removeFriendConnection(
  currentUserId: string,
  otherUserId: string,
): Promise<void> {
  const canonicalId = getCanonicalFriendId(currentUserId, otherUserId);
  if (auth.currentUser) {
    try {
      await deleteFirestoreFriend(canonicalId);
    } catch {
      // fallback
    }
  }
  try {
    await supabase
      .from("friends")
      .delete()
      .or(
        `and(requester_id.eq.${currentUserId},addressee_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},addressee_id.eq.${currentUserId})`,
      );
  } catch {
    // fallback
  }
  const local = readLocalFriends().filter(
    (r) =>
      !(
        (r.requester_id === currentUserId && r.addressee_id === otherUserId) ||
        (r.requester_id === otherUserId && r.addressee_id === currentUserId)
      ),
  );
  writeLocalFriends(local);
}

export async function getMyFriendsAndRequests(userId: string): Promise<FriendRecord[]> {
  if (!userId) return [];
  if (auth.currentUser?.uid === userId) {
    try {
      const fsFriends = await getFirestoreFriends(userId);
      if (fsFriends.length > 0) {
        return fsFriends.map(mapFirestoreToFriendRecord);
      }
    } catch {
      // fallback
    }
  }
  try {
    const { data, error } = await supabase
      .from("friends")
      .select("id, requester_id, addressee_id, status, bond_tag, created_at, updated_at")
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .order("updated_at", { ascending: false });
    if (!error && data && data.length > 0) return data as FriendRecord[];
  } catch {
    // fallback
  }
  return readLocalFriends().filter(
    (r) => r.requester_id === userId || r.addressee_id === userId,
  );
}

export async function updateFriendBondTag(
  currentUserId: string,
  otherUserId: string,
  bondTag: string,
): Promise<void> {
  const now = new Date().toISOString();
  const canonicalId = getCanonicalFriendId(currentUserId, otherUserId);
  if (auth.currentUser) {
    try {
      const existing = await getFirestoreFriendshipBetween(currentUserId, otherUserId);
      if (existing) {
        await updateFirestoreFriendStatus(canonicalId, existing.status, bondTag);
      }
    } catch {
      // fallback
    }
  }
  try {
    await supabase
      .from("friends")
      .update({ bond_tag: bondTag, updated_at: now })
      .or(
        `and(requester_id.eq.${currentUserId},addressee_id.eq.${otherUserId}),and(requester_id.eq.${otherUserId},addressee_id.eq.${currentUserId})`,
      );
  } catch {
    // fallback
  }
  const local = readLocalFriends();
  const idx = local.findIndex(
    (r) =>
      (r.requester_id === currentUserId && r.addressee_id === otherUserId) ||
      (r.requester_id === otherUserId && r.addressee_id === currentUserId),
  );
  if (idx >= 0) {
    local[idx] = { ...local[idx], bond_tag: bondTag, updated_at: now };
    writeLocalFriends(local);
  }
}

export type FriendWithProfile = FriendRecord & {
  peerId: string;
  peerName: string;
  peerAvatar: string | null;
  direction: "incoming" | "outgoing";
};

export async function getMyFriendsWithProfiles(userId: string): Promise<FriendWithProfile[]> {
  const records = await getMyFriendsAndRequests(userId);
  if (records.length === 0) return [];

  const peerIds = [
    ...new Set(records.map((r) => (r.requester_id === userId ? r.addressee_id : r.requester_id))),
  ];

  let profileMap = new Map<string, { display_name: string; avatar_url: string | null }>();
  try {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", peerIds);
    profileMap = new Map(
      (profiles ?? []).map((p) => [
        p.id,
        { display_name: p.display_name, avatar_url: p.avatar_url },
      ]),
    );
  } catch {
    // fallback for offline/non-UUID
  }

  return records.map((r) => {
    const peerId = r.requester_id === userId ? r.addressee_id : r.requester_id;
    const p = profileMap.get(peerId);
    return {
      ...r,
      peerId,
      peerName: p?.display_name ?? `Member ${peerId.slice(0, 6)}`,
      peerAvatar: p?.avatar_url ?? null,
      direction: r.requester_id === userId ? "outgoing" : "incoming",
    };
  });
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
  username?: string | null;
  bio: string | null;
  avatar_url: string | null;
  trust_score: number;
};

const LOCAL_PROFILES_KEY = "sot_user_profiles_v1";

function readLocalProfileMap(): Record<string, PublicProfile> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_PROFILES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, PublicProfile>) : {};
  } catch {
    return {};
  }
}

function writeLocalProfile(profile: PublicProfile) {
  if (typeof window === "undefined") return;
  try {
    const map = readLocalProfileMap();
    map[profile.id] = profile;
    window.localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("sot-profile-updated", { detail: profile }));
  } catch {
    // ignore storage errors
  }
}

export async function getPublicProfile(userId: string): Promise<PublicProfile | null> {
  if (!userId) return null;
  const localCached = readLocalProfileMap()[userId] ?? null;

  // 1. Check Firestore users/{userId}
  try {
    const fsProfile = await getFirestoreUserProfile(userId);
    if (fsProfile) {
      const merged: PublicProfile = {
        id: userId,
        display_name:
          (typeof fsProfile.displayName === "string" && fsProfile.displayName.trim()) ||
          localCached?.display_name ||
          "Verified Voter",
        username:
          (typeof fsProfile.username === "string" && fsProfile.username.trim()) ||
          localCached?.username ||
          null,
        bio:
          (typeof fsProfile.bio === "string" && fsProfile.bio.trim()) ||
          localCached?.bio ||
          null,
        avatar_url:
          (typeof fsProfile.avatarUrl === "string" && fsProfile.avatarUrl.trim()) ||
          localCached?.avatar_url ||
          null,
        trust_score: localCached?.trust_score ?? 88,
      };
      return merged;
    }
  } catch {
    // Fallback to Supabase / local cache
  }

  // 2. Check Supabase profiles table
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, bio, avatar_url, trust_score")
      .eq("id", userId)
      .maybeSingle();
    if (!error && data) {
      return {
        ...data,
        username: localCached?.username ?? null,
        avatar_url: data.avatar_url || localCached?.avatar_url || null,
      };
    }
  } catch {
    // Non-UUID or offline fallback
  }

  return localCached;
}

export type ProfileStats = {
  posts: number;
  stash: number;
  trash: number;
  following: number;
  friends: number;
};

/** Public activity counters for a member profile (all from publicly readable tables). */
export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const [posts, votes, following, myFriends] = await Promise.all([
    supabase
      .from("items")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .then((r) => r, () => ({ count: 0 })),
    supabase
      .from("votes")
      .select("verdict")
      .eq("user_id", userId)
      .then((r) => r, () => ({ data: [] as { verdict: string }[] })),
    supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("follower_id", userId)
      .then((r) => r, () => ({ count: 0 })),
    getMyFriendsAndRequests(userId),
  ]);
  const rows = votes.data ?? [];
  return {
    posts: posts.count ?? 0,
    stash: rows.filter((v) => v.verdict === "stash").length,
    trash: rows.filter((v) => v.verdict === "trash").length,
    following: following.count ?? 0,
    friends: myFriends.filter((f) => f.status === "accepted").length,
  };
}

export async function updateMyProfile(input: {
  userId: string;
  display_name: string;
  username?: string;
  bio: string;
  avatar_url: string;
}) {
  const cleanName = input.display_name.trim().slice(0, 100) || "Anonymous";
  const cleanUsername = (input.username ?? "")
    .trim()
    .replace(/^@+/, "")
    .replace(/[^a-zA-Z0-9_.-]/g, "")
    .slice(0, 50);
  const cleanBio = input.bio.trim().slice(0, 500);
  const cleanAvatar = input.avatar_url.trim().slice(0, 500);

  const existingLocal = readLocalProfileMap()[input.userId];
  const updatedLocal: PublicProfile = {
    id: input.userId,
    display_name: cleanName,
    username: cleanUsername || existingLocal?.username || null,
    bio: cleanBio || null,
    avatar_url: cleanAvatar || null,
    trust_score: existingLocal?.trust_score ?? 88,
  };
  writeLocalProfile(updatedLocal);

  if (auth.currentUser?.uid === input.userId) {
    try {
      await updateFirestoreUserProfile(input.userId, {
        displayName: cleanName,
        username: cleanUsername,
        bio: cleanBio,
        avatarUrl: cleanAvatar,
      });
    } catch {
      // Allow local/supabase fallback if Firestore rules/offline restrict write
    }
  }

  try {
    await supabase
      .from("profiles")
      .update({
        display_name: cleanName,
        bio: cleanBio || null,
        avatar_url: cleanAvatar || null,
      })
      .eq("id", input.userId);
  } catch {
    // Non-UUID or offline fallback
  }
}
