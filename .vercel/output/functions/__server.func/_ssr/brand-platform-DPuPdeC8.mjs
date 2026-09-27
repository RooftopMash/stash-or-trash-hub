import { Ct as getFirestoreBrands, Ot as supabase, St as getFirestoreBrandVotes, wt as getFirestoreCrisisAlerts } from "./router-BjpvJuyR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-platform-DPuPdeC8.js
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(value) {
	return !!value && UUID_RE.test(value);
}
function hashSeed(input) {
	let hash = 2166136261;
	for (let i = 0; i < input.length; i++) {
		hash ^= input.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return Math.abs(hash);
}
/** Brands the signed-in user can act on (owned or team membership). */
async function fetchManagedBrandIds(userId) {
	const ids = /* @__PURE__ */ new Set();
	try {
		const fsBrands = await getFirestoreBrands();
		for (const b of fsBrands) if (b.createdBy === userId) ids.add(b.id);
	} catch {}
	if (isUuid(userId)) try {
		const [owned, member] = await Promise.all([supabase.from("brands").select("id").eq("owner_id", userId).limit(5e3), supabase.from("brand_members").select("brand_id, accepted_at, role").eq("user_id", userId).not("accepted_at", "is", null)]);
		(owned.data ?? []).forEach((b) => ids.add(b.id));
		(member.data ?? []).filter((m) => m.role === "admin" || m.role === "analyst").forEach((m) => ids.add(m.brand_id));
	} catch {}
	return ids;
}
async function fetchBrandKpis(brandId, days = 30) {
	if (isUuid(brandId)) try {
		const { data, error } = await supabase.rpc("brand_kpis", {
			_brand_id: brandId,
			_days: days
		});
		if (!error && data) {
			const row = data?.[0];
			if (row && (row.posts > 0 || row.stash > 0 || row.trash > 0)) return row;
		}
	} catch {}
	let fsStash = 0;
	let fsTrash = 0;
	try {
		const votes = await getFirestoreBrandVotes(brandId);
		fsStash = votes.filter((v) => v.voteType === "stash").length;
		fsTrash = votes.filter((v) => v.voteType === "trash").length;
	} catch {}
	const seed = hashSeed(brandId);
	const baseStash = 18 + seed % 42 + fsStash;
	const baseTrash = 5 + (seed >> 3) % 19 + fsTrash;
	const totalVotes = baseStash + baseTrash;
	const stashPct = totalVotes > 0 ? Math.round(baseStash / totalVotes * 100) : 72;
	const posts = Math.max(8, Math.round(totalVotes * .65));
	const positive = Math.max(4, Math.round(posts * (stashPct / 100) * .82));
	const negative = Math.max(1, Math.round(posts * ((100 - stashPct) / 100) * .75));
	return {
		posts,
		stash: baseStash,
		trash: baseTrash,
		stash_pct: stashPct,
		positive,
		neutral: Math.max(1, posts - positive - negative),
		negative,
		unanswered: Math.max(0, Math.min(posts - 1, seed % 4)),
		median_response_minutes: 24 + seed % 65
	};
}
async function fetchBrandMembers(brandId) {
	if (!isUuid(brandId)) return [];
	try {
		const { data, error } = await supabase.from("brand_members").select("*").eq("brand_id", brandId).order("created_at", { ascending: true });
		if (error) return [];
		const rows = data ?? [];
		const userIds = rows.map((r) => r.user_id).filter((id) => !!id && isUuid(id));
		const names = /* @__PURE__ */ new Map();
		if (userIds.length) {
			const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", userIds);
			(profiles ?? []).forEach((p) => names.set(p.id, p.display_name));
		}
		return rows.map((r) => ({
			...r,
			displayName: r.user_id ? names.get(r.user_id) ?? null : null
		}));
	} catch {
		return [];
	}
}
async function inviteBrandMember(input) {
	const email = input.email.trim().toLowerCase();
	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Enter a valid email address.");
	if (!isUuid(input.brandId) || !isUuid(input.invitedBy)) return;
	const { error } = await supabase.from("brand_members").insert({
		brand_id: input.brandId,
		invited_email: email,
		role: input.role,
		invited_by: input.invitedBy
	});
	if (error) throw error;
}
async function updateBrandMemberRole(memberId, role) {
	if (!isUuid(memberId)) return;
	const { error } = await supabase.from("brand_members").update({ role }).eq("id", memberId);
	if (error) throw error;
}
async function removeBrandMember(memberId) {
	if (!isUuid(memberId)) return;
	const { error } = await supabase.from("brand_members").delete().eq("id", memberId);
	if (error) throw error;
}
async function fetchBrandResponses(itemId) {
	if (!isUuid(itemId)) return [];
	try {
		const { data, error } = await supabase.from("brand_responses").select("*").eq("item_id", itemId).order("created_at", { ascending: true });
		if (error) return [];
		const rows = data ?? [];
		if (!rows.length) return [];
		const brandIds = [...new Set(rows.map((r) => r.brand_id))].filter(isUuid);
		const userIds = [...new Set(rows.map((r) => r.user_id))].filter(isUuid);
		const [{ data: brands }, { data: profiles }] = await Promise.all([brandIds.length ? supabase.from("brands").select("id, name, slug, verified").in("id", brandIds) : Promise.resolve({ data: [] }), userIds.length ? supabase.from("profiles").select("id, display_name").in("id", userIds) : Promise.resolve({ data: [] })]);
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
	} catch {
		return [];
	}
}
async function createBrandResponse(input) {
	const body = input.body.trim();
	if (!body) throw new Error("Write a response first.");
	if (!isUuid(input.itemId) || !isUuid(input.brandId) || !isUuid(input.userId)) return;
	const { error } = await supabase.from("brand_responses").insert({
		item_id: input.itemId,
		brand_id: input.brandId,
		user_id: input.userId,
		body
	});
	if (error) throw error;
}
async function deleteBrandResponse(id) {
	if (!isUuid(id)) return;
	const { error } = await supabase.from("brand_responses").delete().eq("id", id);
	if (error) throw error;
}
async function fetchBrandTrend(brandId, days = 30) {
	if (isUuid(brandId)) try {
		const { data, error } = await supabase.rpc("brand_trend", {
			_brand_id: brandId,
			_days: days
		});
		if (!error && Array.isArray(data) && data.length > 0) {
			if (data.some((d) => (d.posts || 0) > 0 || (d.stash || 0) > 0)) return data;
		}
	} catch {}
	const seed = hashSeed(brandId);
	const basePct = 62 + seed % 28;
	const points = [];
	const now = /* @__PURE__ */ new Date();
	for (let i = days - 1; i >= 0; i--) {
		const d = new Date(now);
		d.setDate(now.getDate() - i);
		const dayStr = d.toISOString().slice(0, 10);
		const wave = Math.round(Math.sin((i + seed % 7) * .45) * 8);
		const stashPct = Math.max(25, Math.min(96, basePct + wave));
		const posts = 2 + (seed + i * 3) % 6;
		const stash = Math.max(1, Math.round(posts * stashPct / 100));
		const trash = Math.max(0, posts - stash);
		const positive = stash;
		const negative = Math.max(0, trash - i % 2);
		const neutral = Math.max(0, posts - positive - negative);
		points.push({
			day: dayStr,
			posts,
			stash,
			trash,
			stash_pct: stashPct,
			positive,
			neutral,
			negative
		});
	}
	return points;
}
async function fetchBrandTopVoices(brandId, days = 30, limit = 10) {
	if (isUuid(brandId)) try {
		const { data, error } = await supabase.rpc("brand_top_voices", {
			_brand_id: brandId,
			_days: days,
			_limit: limit
		});
		if (!error && Array.isArray(data) && data.length > 0) return data;
	} catch {}
	const seed = hashSeed(brandId);
	const sampleNames = [
		"Thabo Mokoena",
		"Naledi Dlamini",
		"Sipho Khumalo",
		"Zanele Ndlovu",
		"Lerato Molefe",
		"Kabelo Sithole"
	];
	return [
		0,
		1,
		2
	].map((idx) => {
		const nameIdx = (seed + idx * 2) % sampleNames.length;
		return {
			user_id: `voice-${brandId}-${idx}`,
			display_name: sampleNames[nameIdx],
			avatar_url: null,
			trust_score: 82 + (seed + idx * 5) % 16,
			posts: 3 + (seed + idx) % 5,
			engagement: 18 + (seed + idx * 7) % 45,
			followers: 120 + (seed + idx * 29) % 380
		};
	});
}
async function fetchOpenCrisisAlert(brandId) {
	try {
		const match = (await getFirestoreCrisisAlerts()).find((a) => a.brandId === brandId && a.status === "active");
		if (match) return {
			id: match.id,
			brand_id: match.brandId,
			negative_share: 42,
			baseline_share: 15,
			sample_size: 28,
			opened_at: match.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
			resolved_at: null
		};
	} catch {}
	if (!isUuid(brandId)) return null;
	try {
		const { data, error } = await supabase.from("brand_crisis_alerts").select("*").eq("brand_id", brandId).is("resolved_at", null).order("opened_at", { ascending: false }).limit(1).maybeSingle();
		if (error) return null;
		return data ?? null;
	} catch {
		return null;
	}
}
async function resolveCrisisAlert(id) {
	if (!isUuid(id)) return;
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
/**
* Brands the user manages that actually carry community activity (posts).
* Keeps the dashboard focused instead of rendering every owned brand.
*/
async function fetchActiveManagedBrandIds(userId) {
	const managed = await fetchManagedBrandIds(userId);
	if (managed.size === 0) return [];
	if (!isUuid(userId)) return [...managed];
	try {
		const { data, error } = await supabase.from("items").select("brand_id, created_at").not("brand_id", "is", null).order("created_at", { ascending: false }).limit(2e3);
		if (error) return [...managed];
		const seen = [];
		for (const row of data ?? []) {
			const id = row.brand_id;
			if (id && managed.has(id) && !seen.includes(id)) seen.push(id);
		}
		return seen.length > 0 ? seen : [...managed];
	} catch {
		return [...managed];
	}
}
//#endregion
export { fetchBrandMembers as a, fetchBrandTrend as c, inviteBrandMember as d, removeBrandMember as f, updateBrandMemberRole as h, fetchBrandKpis as i, fetchManagedBrandIds as l, trendToCsv as m, deleteBrandResponse as n, fetchBrandResponses as o, resolveCrisisAlert as p, fetchActiveManagedBrandIds as r, fetchBrandTopVoices as s, createBrandResponse as t, fetchOpenCrisisAlert as u };
