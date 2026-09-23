import { t as supabase } from "./client-O8e5E0JR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/social-CNdxEfFV.js
async function likePost(itemId, userId) {
	const { error } = await supabase.from("post_likes").insert({
		item_id: itemId,
		user_id: userId
	});
	if (error && error.code !== "23505") throw error;
}
async function unlikePost(itemId, userId) {
	const { error } = await supabase.from("post_likes").delete().eq("item_id", itemId).eq("user_id", userId);
	if (error) throw error;
}
async function userLikedPost(itemId, userId) {
	const { data } = await supabase.from("post_likes").select("id").eq("item_id", itemId).eq("user_id", userId).maybeSingle();
	return !!data;
}
async function getPostLikeCount(itemId) {
	const { count } = await supabase.from("post_likes").select("id", {
		count: "exact",
		head: true
	}).eq("item_id", itemId);
	return count ?? 0;
}
async function repostItem(itemId, userId) {
	const { error } = await supabase.from("reposts").insert({
		item_id: itemId,
		user_id: userId
	});
	if (error && error.code !== "23505") throw error;
}
async function unrepostItem(itemId, userId) {
	const { error } = await supabase.from("reposts").delete().eq("item_id", itemId).eq("user_id", userId);
	if (error) throw error;
}
async function userReposted(itemId, userId) {
	const { data } = await supabase.from("reposts").select("id").eq("item_id", itemId).eq("user_id", userId).maybeSingle();
	return !!data;
}
async function getRepostCount(itemId) {
	const { count } = await supabase.from("reposts").select("id", {
		count: "exact",
		head: true
	}).eq("item_id", itemId);
	return count ?? 0;
}
async function getComments(itemId, currentUserId) {
	const { data, error } = await supabase.from("post_comments").select("id, item_id, user_id, parent_id, body, created_at").eq("item_id", itemId).order("created_at", { ascending: true });
	if (error) throw error;
	const rows = data ?? [];
	if (rows.length === 0) return [];
	const ids = rows.map((r) => r.id);
	const authorIds = [...new Set(rows.map((r) => r.user_id))];
	const [{ data: profiles }, { data: likes }] = await Promise.all([supabase.from("profiles").select("id, display_name").in("id", authorIds), supabase.from("comment_likes").select("comment_id, user_id").in("comment_id", ids)]);
	const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
	return rows.map((r) => {
		const rowLikes = (likes ?? []).filter((l) => l.comment_id === r.id);
		return {
			...r,
			authorName: nameById.get(r.user_id) ?? "Anonymous",
			likeCount: rowLikes.length,
			userLiked: !!currentUserId && rowLikes.some((l) => l.user_id === currentUserId)
		};
	});
}
async function createComment(itemId, userId, body, parentId) {
	const { error } = await supabase.from("post_comments").insert({
		item_id: itemId,
		user_id: userId,
		body: body.trim(),
		parent_id: parentId ?? null
	});
	if (error) throw error;
}
async function deleteComment(commentId) {
	const { error } = await supabase.from("post_comments").delete().eq("id", commentId);
	if (error) throw error;
}
async function likeComment(commentId, userId) {
	const { error } = await supabase.from("comment_likes").insert({
		comment_id: commentId,
		user_id: userId
	});
	if (error && error.code !== "23505") throw error;
}
async function unlikeComment(commentId, userId) {
	const { error } = await supabase.from("comment_likes").delete().eq("comment_id", commentId).eq("user_id", userId);
	if (error) throw error;
}
async function followUser(followerId, followeeId) {
	const { error } = await supabase.from("follows").insert({
		follower_id: followerId,
		followee_id: followeeId
	});
	if (error && error.code !== "23505") throw error;
}
async function unfollowUser(followerId, followeeId) {
	const { error } = await supabase.from("follows").delete().eq("follower_id", followerId).eq("followee_id", followeeId);
	if (error) throw error;
}
async function followBrand(followerId, brandId) {
	const { error } = await supabase.from("follows").insert({
		follower_id: followerId,
		followee_id: null,
		brand_id: brandId
	});
	if (error && error.code !== "23505") throw error;
}
async function unfollowBrand(followerId, brandId) {
	const { error } = await supabase.from("follows").delete().eq("follower_id", followerId).eq("brand_id", brandId);
	if (error) throw error;
}
async function isFollowingBrand(followerId, brandId) {
	const { data } = await supabase.from("follows").select("id").eq("follower_id", followerId).eq("brand_id", brandId).maybeSingle();
	return !!data;
}
async function isFollowingUser(followerId, followeeId) {
	const { data } = await supabase.from("follows").select("id").eq("follower_id", followerId).eq("followee_id", followeeId).maybeSingle();
	return !!data;
}
async function getFollowerCount(opts) {
	let q = supabase.from("follows").select("id", {
		count: "exact",
		head: true
	});
	if (opts.userId) q = q.eq("followee_id", opts.userId);
	if (opts.brandId) q = q.eq("brand_id", opts.brandId);
	const { count } = await q;
	return count ?? 0;
}
async function getTrendingHashtags(limit = 10) {
	const { data, error } = await supabase.from("hashtags").select("id, tag, use_count").gt("use_count", 0).order("use_count", { ascending: false }).limit(limit);
	if (error) throw error;
	return data ?? [];
}
/** item ids tagged with a hashtag */
async function getItemsByHashtag(tag) {
	const { data: hashtag } = await supabase.from("hashtags").select("id").eq("tag", tag.toLowerCase()).maybeSingle();
	if (!hashtag) return [];
	const { data } = await supabase.from("post_hashtags").select("item_id").eq("hashtag_id", hashtag.id);
	return data ?? [];
}
async function getNotifications(userId) {
	const { data, error } = await supabase.from("notifications").select("id, user_id, actor_id, type, item_id, comment_id, read_at, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(100);
	if (error) throw error;
	const rows = data ?? [];
	if (rows.length === 0) return [];
	const actorIds = [...new Set(rows.map((r) => r.actor_id).filter((v) => !!v))];
	const { data: profiles } = actorIds.length ? await supabase.from("profiles").select("id, display_name").in("id", actorIds) : { data: [] };
	const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
	return rows.map((r) => ({
		...r,
		actorName: (r.actor_id ? nameById.get(r.actor_id) : null) ?? "Someone"
	}));
}
async function getUnreadNotificationCount(userId) {
	const { count } = await supabase.from("notifications").select("id", {
		count: "exact",
		head: true
	}).eq("user_id", userId).is("read_at", null);
	return count ?? 0;
}
async function markNotificationsRead(userId) {
	await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("user_id", userId).is("read_at", null);
}
async function getPublicProfile(userId) {
	const { data, error } = await supabase.from("profiles").select("id, display_name, bio, avatar_url, trust_score").eq("id", userId).maybeSingle();
	if (error) throw error;
	return data ?? null;
}
/** Public activity counters for a member profile (all from publicly readable tables). */
async function getProfileStats(userId) {
	const [posts, votes, following] = await Promise.all([
		supabase.from("items").select("id", {
			count: "exact",
			head: true
		}).eq("user_id", userId),
		supabase.from("votes").select("verdict").eq("user_id", userId),
		supabase.from("follows").select("id", {
			count: "exact",
			head: true
		}).eq("follower_id", userId)
	]);
	const rows = votes.data ?? [];
	return {
		posts: posts.count ?? 0,
		stash: rows.filter((v) => v.verdict === "stash").length,
		trash: rows.filter((v) => v.verdict === "trash").length,
		following: following.count ?? 0
	};
}
async function updateMyProfile(input) {
	const { error } = await supabase.from("profiles").update({
		display_name: input.display_name.trim() || "Anonymous",
		bio: input.bio.trim() || null,
		avatar_url: input.avatar_url.trim() || null
	}).eq("id", input.userId);
	if (error) throw error;
}
//#endregion
export { unlikeComment as C, userLikedPost as D, updateMyProfile as E, userReposted as O, unfollowUser as S, unrepostItem as T, likeComment as _, getComments as a, repostItem as b, getNotifications as c, getPublicProfile as d, getRepostCount as f, isFollowingUser as g, isFollowingBrand as h, followUser as i, getPostLikeCount as l, getUnreadNotificationCount as m, deleteComment as n, getFollowerCount as o, getTrendingHashtags as p, followBrand as r, getItemsByHashtag as s, createComment as t, getProfileStats as u, likePost as v, unlikePost as w, unfollowBrand as x, markNotificationsRead as y };
