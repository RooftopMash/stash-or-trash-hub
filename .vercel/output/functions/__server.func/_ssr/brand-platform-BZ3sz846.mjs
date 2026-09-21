import { t as supabase } from "./client-O8e5E0JR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-platform-BZ3sz846.js
/** Brands the signed-in user can act on (owned or team membership). */
async function fetchManagedBrandIds(userId) {
	const [owned, member] = await Promise.all([supabase.from("brands").select("id").eq("owner_id", userId).limit(5e3), supabase.from("brand_members").select("brand_id, accepted_at, role").eq("user_id", userId).not("accepted_at", "is", null)]);
	const ids = /* @__PURE__ */ new Set();
	(owned.data ?? []).forEach((b) => ids.add(b.id));
	(member.data ?? []).filter((m) => m.role === "admin" || m.role === "analyst").forEach((m) => ids.add(m.brand_id));
	return ids;
}
async function fetchBrandKpis(brandId, days = 30) {
	const { data, error } = await supabase.rpc("brand_kpis", {
		_brand_id: brandId,
		_days: days
	});
	if (error) throw error;
	return data?.[0] ?? {
		posts: 0,
		stash: 0,
		trash: 0,
		stash_pct: 0,
		positive: 0,
		neutral: 0,
		negative: 0,
		unanswered: 0,
		median_response_minutes: 0
	};
}
async function fetchBrandMembers(brandId) {
	const { data, error } = await supabase.from("brand_members").select("*").eq("brand_id", brandId).order("created_at", { ascending: true });
	if (error) throw error;
	const rows = data ?? [];
	const userIds = rows.map((r) => r.user_id).filter((id) => !!id);
	const names = /* @__PURE__ */ new Map();
	if (userIds.length) {
		const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", userIds);
		(profiles ?? []).forEach((p) => names.set(p.id, p.display_name));
	}
	return rows.map((r) => ({
		...r,
		displayName: r.user_id ? names.get(r.user_id) ?? null : null
	}));
}
async function inviteBrandMember(input) {
	const email = input.email.trim().toLowerCase();
	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Enter a valid email address.");
	const { error } = await supabase.from("brand_members").insert({
		brand_id: input.brandId,
		invited_email: email,
		role: input.role,
		invited_by: input.invitedBy
	});
	if (error) throw error;
}
async function updateBrandMemberRole(memberId, role) {
	const { error } = await supabase.from("brand_members").update({ role }).eq("id", memberId);
	if (error) throw error;
}
async function removeBrandMember(memberId) {
	const { error } = await supabase.from("brand_members").delete().eq("id", memberId);
	if (error) throw error;
}
async function fetchBrandResponses(itemId) {
	const { data, error } = await supabase.from("brand_responses").select("*").eq("item_id", itemId).order("created_at", { ascending: true });
	if (error) throw error;
	const rows = data ?? [];
	if (!rows.length) return [];
	const brandIds = [...new Set(rows.map((r) => r.brand_id))];
	const userIds = [...new Set(rows.map((r) => r.user_id))];
	const [{ data: brands }, { data: profiles }] = await Promise.all([supabase.from("brands").select("id, name, slug, verified").in("id", brandIds), supabase.from("profiles").select("id, display_name").in("id", userIds)]);
	const byBrand = new Map((brands ?? []).map((b) => [b.id, b]));
	const byUser = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));
	return rows.map((r) => {
		const b = byBrand.get(r.brand_id);
		return {
			...r,
			brandName: b?.name ?? null,
			brandSlug: b?.slug ?? null,
			brandVerified: b?.verified ?? false,
			authorName: byUser.get(r.user_id) ?? null
		};
	});
}
async function createBrandResponse(input) {
	const body = input.body.trim();
	if (!body) throw new Error("Write a response first.");
	const { error } = await supabase.from("brand_responses").insert({
		item_id: input.itemId,
		brand_id: input.brandId,
		user_id: input.userId,
		body
	});
	if (error) throw error;
}
async function deleteBrandResponse(id) {
	const { error } = await supabase.from("brand_responses").delete().eq("id", id);
	if (error) throw error;
}
async function fetchBrandTrend(brandId, days = 30) {
	const { data, error } = await supabase.rpc("brand_trend", {
		_brand_id: brandId,
		_days: days
	});
	if (error) throw error;
	return data ?? [];
}
async function fetchBrandTopVoices(brandId, days = 30, limit = 10) {
	const { data, error } = await supabase.rpc("brand_top_voices", {
		_brand_id: brandId,
		_days: days,
		_limit: limit
	});
	if (error) throw error;
	return data ?? [];
}
async function fetchOpenCrisisAlert(brandId) {
	const { data, error } = await supabase.from("brand_crisis_alerts").select("*").eq("brand_id", brandId).is("resolved_at", null).order("opened_at", { ascending: false }).limit(1).maybeSingle();
	if (error) throw error;
	return data ?? null;
}
async function resolveCrisisAlert(id) {
	const { error } = await supabase.from("brand_crisis_alerts").update({ resolved_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
	if (error) throw error;
}
/** Build a CSV string from the current analytics window. */
function trendToCsv(rows) {
	return `day,posts,stash,trash,stash_pct,positive,neutral,negative\n${rows.map((r) => [
		r.day,
		r.posts,
		r.stash,
		r.trash,
		r.stash_pct,
		r.positive,
		r.neutral,
		r.negative
	].join(",")).join("\n")}\n`;
}
//#endregion
export { fetchBrandResponses as a, fetchManagedBrandIds as c, removeBrandMember as d, resolveCrisisAlert as f, fetchBrandMembers as i, fetchOpenCrisisAlert as l, updateBrandMemberRole as m, deleteBrandResponse as n, fetchBrandTopVoices as o, trendToCsv as p, fetchBrandKpis as r, fetchBrandTrend as s, createBrandResponse as t, inviteBrandMember as u };
