import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-O8e5E0JR.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { J as Gavel, K as Globe, _t as Check, at as Copy, n as X, rt as Download } from "../_libs/lucide-react.mjs";
import { l as useAuth } from "./router-I-3x-i8y.mjs";
import { n as Input, t as Button } from "./label-1cB10GDW.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { I as useRoles, P as reviewVerification, c as Header, u as Textarea, w as fetchPendingVerifications } from "./Header-E8juhbIs.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-C6Tvt94Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BiiRubvx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var ISO_TO_QID = {
	ZA: "Q258",
	US: "Q30",
	GB: "Q145",
	FR: "Q142",
	DE: "Q183",
	IT: "Q38",
	ES: "Q29",
	PT: "Q45",
	NL: "Q55",
	BR: "Q155",
	IN: "Q668",
	CN: "Q148",
	JP: "Q17",
	KR: "Q884",
	MX: "Q96",
	CA: "Q16",
	AU: "Q408",
	NG: "Q1033",
	KE: "Q114",
	EG: "Q79",
	MA: "Q1028",
	GH: "Q117",
	SN: "Q1041",
	ET: "Q115"
};
var SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";
function slugify(name) {
	return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}
function buildBrandInvitation(input) {
	const brandUrl = `${typeof window === "undefined" ? "https://stash-or-trash-hub.lovable.app" : window.location.origin}/brands/${input.slug}`;
	return `Subject: ${input.name} is now on SOT — Stash Or Trash\n\nHello ${input.name} team,\n\nWe have opened a live brand-rating page for ${input.name} on SOT — Stash Or Trash, the Consumer Brand Revolution built to turn everyday customer feedback into a credible reputation signal.\n\nYour page: ${brandUrl}\n${input.website ? `Website we found: ${input.website}\n` : ""}\nConsumers can now Stash or Trash brand experiences in public, and verified brand owners can claim their page, monitor sentiment, and respond directly through the platform.\n\nPlease create an account with your official company email, open the page above, and choose “Claim this brand” so our team can verify your ownership.\n\nRegards,\nSOT — Stash Or Trash\nThe Brand Barometer`;
}
var BRAND_CLASSES = [
	"Q4830453",
	"Q891723",
	"Q431289",
	"Q6881511",
	"Q783794"
];
function buildQuery(cls, qid, path, limit) {
	return `
    SELECT ?item ?itemLabel ?desc ?logo ?website ?industryLabel ?sitelinks WHERE {
      { SELECT ?item ?sitelinks WHERE {
          ?item wdt:P31 wd:${cls} ;
                ${path === "P17" ? "wdt:P17" : "wdt:P159/wdt:P17"} wd:${qid} ;
                wikibase:sitelinks ?sitelinks .
        } ORDER BY DESC(?sitelinks) LIMIT ${limit} }
      OPTIONAL { ?item wdt:P154 ?logo }
      OPTIONAL { ?item wdt:P856 ?website }
      OPTIONAL { ?item wdt:P452 ?industry . ?industry rdfs:label ?industryLabel FILTER(LANG(?industryLabel)="en") }
      OPTIONAL { ?item schema:description ?desc FILTER(LANG(?desc)="en") }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    }
    ORDER BY DESC(?sitelinks)
  `;
}
async function runQuery(query, attempts = 3) {
	const url = `${SPARQL_ENDPOINT}?origin=*&format=json&query=${encodeURIComponent(query)}`;
	let lastError;
	for (let attempt = 0; attempt < attempts; attempt += 1) try {
		const res = await fetch(url, { headers: {
			Accept: "application/sparql-results+json",
			"Api-User-Agent": "StashOrTrashHub/1.0 (https://stash-or-trash-hub.lovable.app; contact@stash-or-trash-hub.lovable.app)"
		} });
		if (!res.ok) throw new Error(`Wikidata returned ${res.status}`);
		return (await res.json()).results?.bindings ?? [];
	} catch (error) {
		lastError = error;
		await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
	}
	throw lastError instanceof Error ? lastError : /* @__PURE__ */ new Error("Wikidata request failed");
}
async function resolveCountryQid(countryCode) {
	const known = ISO_TO_QID[countryCode];
	if (known) return known;
	return (await runQuery(`SELECT ?country WHERE { ?country wdt:P297 "${countryCode}". } LIMIT 1`))[0]?.country?.value?.split("/").pop() ?? null;
}
async function importBrandsFromWikidata(input) {
	const countryCode = input.countryCode.toUpperCase();
	const limit = Math.max(1, Math.min(200, input.limit));
	const qid = await resolveCountryQid(countryCode);
	if (!qid) throw new Error(`Country ${countryCode} could not be resolved by ISO code.`);
	const queries = [];
	for (const cls of BRAND_CLASSES) {
		queries.push(buildQuery(cls, qid, "P17", limit));
		queries.push(buildQuery(cls, qid, "P159/wdt:P17", limit));
	}
	const bindings = (await Promise.allSettled(queries.map(runQuery))).flatMap((r) => r.status === "fulfilled" ? r.value : []);
	if (!bindings.length) throw new Error("Wikidata did not respond in time. Please try again with a smaller limit.");
	const byId = /* @__PURE__ */ new Map();
	for (const b of bindings) {
		const sourceId = (b.item?.value ?? "").split("/").pop() ?? "";
		const name = b.itemLabel?.value ?? "";
		if (!sourceId || !name || /^Q\d+$/.test(name)) continue;
		const slug = slugify(name);
		if (!slug) continue;
		const existing = byId.get(sourceId);
		if (existing) {
			existing.category ??= b.industryLabel?.value ?? null;
			existing.description ??= b.desc?.value ?? null;
			existing.website ??= b.website?.value ?? null;
			existing.logo_url ??= b.logo?.value ?? null;
			continue;
		}
		byId.set(sourceId, {
			source: "wikidata",
			source_id: sourceId,
			name,
			slug,
			country: countryCode,
			category: b.industryLabel?.value ?? null,
			description: b.desc?.value ?? null,
			website: b.website?.value ?? null,
			logo_url: b.logo?.value ?? null,
			status: "pending",
			sitelinks: Number(b.sitelinks?.value ?? 0)
		});
	}
	const rows = [...byId.values()].sort((a, b) => b.sitelinks - a.sitelinks).slice(0, limit).map(({ sitelinks: _s, ...row }) => row);
	if (!rows.length) return {
		inserted: 0,
		skipped: 0
	};
	const { data, error } = await supabase.from("brand_import_candidates").upsert(rows, {
		onConflict: "source,source_id",
		ignoreDuplicates: true
	}).select("id");
	if (error) throw error;
	return {
		inserted: data?.length ?? 0,
		skipped: rows.length - (data?.length ?? 0)
	};
}
async function approveBrandCandidate(id, reviewerId) {
	const { data: cand, error: candidateError } = await supabase.from("brand_import_candidates").select("*").eq("id", id).maybeSingle();
	if (candidateError) throw candidateError;
	if (!cand) throw new Error("Candidate not found.");
	let slug = cand.slug;
	for (let i = 0; i < 5; i += 1) {
		const { data: existing } = await supabase.from("brands").select("id").eq("slug", slug).maybeSingle();
		if (!existing) break;
		slug = `${cand.slug}-${Math.floor(Math.random() * 1e4)}`;
	}
	const { data: brand, error: brandError } = await supabase.from("brands").insert({
		owner_id: reviewerId,
		name: cand.name,
		slug,
		description: cand.description,
		website: cand.website,
		category: cand.category,
		country: cand.country,
		logo_url: cand.logo_url
	}).select("id, name, slug, website").single();
	if (brandError) throw brandError;
	const { error: updateError } = await supabase.from("brand_import_candidates").update({
		status: "approved",
		imported_brand_id: brand.id,
		reviewed_by: reviewerId
	}).eq("id", id);
	if (updateError) throw updateError;
	return {
		brandId: brand.id,
		name: brand.name,
		slug: brand.slug,
		website: brand.website
	};
}
async function rejectBrandCandidate(id, reviewerId) {
	const { error } = await supabase.from("brand_import_candidates").update({
		status: "rejected",
		reviewed_by: reviewerId
	}).eq("id", id);
	if (error) throw error;
}
async function publishBrandsFromWikidata(input) {
	const countryCode = input.countryCode.toUpperCase();
	const limit = Math.max(1, Math.min(200, input.limit));
	const qid = ISO_TO_QID[countryCode];
	if (!qid) throw new Error("Country " + countryCode + " is not supported yet.");
	const queries = [];
	for (const cls of BRAND_CLASSES) {
		queries.push(buildQuery(cls, qid, "P17", limit));
		queries.push(buildQuery(cls, qid, "P159/wdt:P17", limit));
	}
	const bindings = (await Promise.allSettled(queries.map(runQuery))).flatMap((r) => r.status === "fulfilled" ? r.value : []);
	if (!bindings.length) throw new Error("Wikidata did not respond in time. Please try again with a smaller limit.");
	const byId = /* @__PURE__ */ new Map();
	for (const b of bindings) {
		const sourceId = (b.item?.value ?? "").split("/").pop() ?? "";
		const name = b.itemLabel?.value ?? "";
		if (!sourceId || !name || /^Q[0-9]+$/.test(name)) continue;
		const slug = slugify(name);
		if (!slug) continue;
		const existing = byId.get(sourceId);
		if (existing) {
			existing.category ??= b.industryLabel?.value ?? null;
			existing.description ??= b.desc?.value ?? null;
			existing.website ??= b.website?.value ?? null;
			existing.logo_url ??= b.logo?.value ?? null;
			continue;
		}
		byId.set(sourceId, {
			source: "wikidata",
			source_id: sourceId,
			name,
			slug,
			country: countryCode,
			category: b.industryLabel?.value ?? null,
			description: b.desc?.value ?? null,
			website: b.website?.value ?? null,
			logo_url: b.logo?.value ?? null,
			status: "approved",
			sitelinks: Number(b.sitelinks?.value ?? 0)
		});
	}
	const candidates = [...byId.values()].sort((a, b) => b.sitelinks - a.sitelinks).slice(0, limit);
	if (!candidates.length) return {
		published: 0,
		skipped: 0
	};
	const { data: existingRows, error: existingErr } = await supabase.from("brands").select("slug").in("slug", candidates.map((c) => c.slug));
	if (existingErr) throw existingErr;
	const used = new Set((existingRows ?? []).map((r) => r.slug));
	const rows = [];
	for (const c of candidates) {
		let slug = c.slug;
		for (let i = 0; i < 5; i += 1) {
			if (!used.has(slug)) break;
			slug = c.slug + "-" + Math.floor(Math.random() * 1e4);
		}
		if (used.has(slug)) continue;
		used.add(slug);
		rows.push({
			owner_id: input.ownerId,
			name: c.name,
			slug,
			description: c.description,
			website: c.website,
			category: c.category,
			country: c.country,
			logo_url: c.logo_url
		});
	}
	if (!rows.length) return {
		published: 0,
		skipped: candidates.length
	};
	const { data, error } = await supabase.from("brands").insert(rows).select("id");
	if (error) throw error;
	return {
		published: data?.length ?? 0,
		skipped: rows.length - (data?.length ?? 0)
	};
}
async function publishPendingCandidates(ownerId) {
	const { data: pending, error: qErr } = await supabase.from("brand_import_candidates").select("*").eq("status", "pending").order("created_at", { ascending: true }).limit(500);
	if (qErr) throw qErr;
	if (!pending?.length) return {
		published: 0,
		skipped: 0
	};
	const { data: existingRows, error: existingErr } = await supabase.from("brands").select("slug").in("slug", pending.map((c) => c.slug));
	if (existingErr) throw existingErr;
	const used = new Set((existingRows ?? []).map((r) => r.slug));
	const rows = [];
	for (const c of pending) {
		let slug = c.slug;
		for (let i = 0; i < 5; i += 1) {
			if (!used.has(slug)) break;
			slug = c.slug + "-" + Math.floor(Math.random() * 1e4);
		}
		if (used.has(slug)) continue;
		used.add(slug);
		rows.push({
			owner_id: ownerId,
			name: c.name,
			slug,
			description: c.description,
			website: c.website,
			category: c.category,
			country: c.country,
			logo_url: c.logo_url
		});
	}
	if (rows.length) {
		const { error } = await supabase.from("brands").insert(rows);
		if (error) throw error;
	}
	const { error: updErr } = await supabase.from("brand_import_candidates").update({
		status: "approved",
		reviewed_by: ownerId
	}).in("id", pending.map((c) => c.id));
	if (updErr) throw updErr;
	return {
		published: rows.length,
		skipped: pending.length - rows.length
	};
}
var _jsxFileName$1 = "/app/applet/src/components/AdminAppealsQueue.tsx";
function AdminAppealsQueue() {
	const { data: appeals, refetch } = useQuery({
		queryKey: ["admin-content-appeals"],
		queryFn: async () => {
			const { data, error } = await supabase.from("content_appeals").select("id, review_id, appellant_id, reason, status, created_at").in("status", ["open", "reviewing"]).order("created_at", { ascending: true });
			if (error) throw error;
			return data ?? [];
		}
	});
	async function resolve(id, status) {
		const { error } = await supabase.from("content_appeals").update({
			status,
			resolved_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) {
			toast.error("Could not resolve this appeal");
			return;
		}
		toast.success(status === "overturned" ? "Appeal overturned" : "Appeal upheld");
		refetch();
	}
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "space-y-3",
		children: !appeals?.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
			className: "text-sm text-muted-foreground",
			children: "No open appeals."
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 45,
			columnNumber: 9
		}, this) : appeals.map((appeal) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("article", {
			className: "rounded-2xl border border-border bg-card p-4",
			children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Gavel, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 50,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Review ",
								appeal.review_id,
								" · User ",
								appeal.appellant_id
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 52,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-2 whitespace-pre-wrap text-sm",
							children: appeal.reason
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 55,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Textarea, {
							className: "mt-3",
							placeholder: "Optional reviewer note",
							"aria-label": "Reviewer note"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 56,
							columnNumber: 17
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								onClick: () => resolve(appeal.id, "overturned"),
								className: "gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 67,
									columnNumber: 21
								}, this), " Overturn"]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 62,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => resolve(appeal.id, "upheld"),
								className: "gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 75,
									columnNumber: 21
								}, this), " Uphold"]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 69,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 61,
							columnNumber: 17
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 51,
					columnNumber: 15
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 49,
				columnNumber: 13
			}, this)
		}, appeal.id, false, {
			fileName: _jsxFileName$1,
			lineNumber: 48,
			columnNumber: 11
		}, this))
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 43,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/_authenticated/admin.tsx?tsr-split=component";
var COUNTRIES = [
	["ZA", "🇿🇦 South Africa"],
	["US", "🇺🇸 United States"],
	["GB", "🇬🇧 United Kingdom"],
	["FR", "🇫🇷 France"],
	["DE", "🇩🇪 Germany"],
	["IT", "🇮🇹 Italy"],
	["ES", "🇪🇸 Spain"],
	["PT", "🇵🇹 Portugal"],
	["NL", "🇳🇱 Netherlands"],
	["BR", "🇧🇷 Brazil"],
	["IN", "🇮🇳 India"],
	["CN", "🇨🇳 China"],
	["JP", "🇯🇵 Japan"],
	["KR", "🇰🇷 South Korea"],
	["MX", "🇲🇽 Mexico"],
	["CA", "🇨🇦 Canada"],
	["AU", "🇦🇺 Australia"],
	["NG", "🇳🇬 Nigeria"],
	["KE", "🇰🇪 Kenya"],
	["EG", "🇪🇬 Egypt"],
	["MA", "🇲🇦 Morocco"],
	["GH", "🇬🇭 Ghana"],
	["SN", "🇸🇳 Senegal"],
	["ET", "🇪🇹 Ethiopia"]
];
function AdminPage() {
	const { t } = useTranslation();
	const { user } = useAuth();
	const { isAdmin, loading } = useRoles();
	const { data: verifications, refetch: refetchVer } = useQuery({
		queryKey: ["pending-verifications"],
		queryFn: fetchPendingVerifications,
		enabled: isAdmin
	});
	const { data: candidates, refetch: refetchCand } = useQuery({
		queryKey: ["brand-candidates"],
		queryFn: async () => {
			const { data, error } = await supabase.from("brand_import_candidates").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(100);
			if (error) throw error;
			return data ?? [];
		},
		enabled: isAdmin
	});
	const [country, setCountry] = (0, import_react.useState)("ZA");
	const [limit, setLimit] = (0, import_react.useState)(50);
	const [importing, setImporting] = (0, import_react.useState)(false);
	const [invitation, setInvitation] = (0, import_react.useState)("");
	const [publishing, setPublishing] = (0, import_react.useState)(false);
	const runImport = async () => {
		setImporting(true);
		try {
			const r = await importBrandsFromWikidata({
				countryCode: country,
				limit
			});
			toast.success(`Imported ${r.inserted} new brands (${r.skipped} already queued).`);
			refetchCand();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Import failed.");
		} finally {
			setImporting(false);
		}
	};
	const runPublish = async () => {
		if (!user) return;
		setPublishing(true);
		try {
			const r = await publishBrandsFromWikidata({
				countryCode: country,
				limit,
				ownerId: user.id
			});
			toast.success("Published " + r.published + " brands (" + r.skipped + " already present).");
			refetchCand();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Publish failed.");
		} finally {
			setPublishing(false);
		}
	};
	const publishAll = async () => {
		if (!user) return;
		setPublishing(true);
		try {
			const r = await publishPendingCandidates(user.id);
			toast.success("Published " + r.published + " queued brands (" + r.skipped + " skipped).");
			refetchCand();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Publish failed.");
		} finally {
			setPublishing(false);
		}
	};
	const review = async (requestId, brandId, approve) => {
		if (!user) return;
		try {
			await reviewVerification({
				requestId,
				brandId,
				reviewerId: user.id,
				approve
			});
			toast.success(approve ? t("admin.approved") : t("admin.rejected"));
			refetchVer();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Action failed.");
		}
	};
	const approveCandidate = async (id) => {
		if (!user) return;
		try {
			const text = buildBrandInvitation(await approveBrandCandidate(id, user.id));
			setInvitation(text);
			await navigator.clipboard?.writeText(text);
			toast.success("Brand added and invitation copied.");
			refetchCand();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Approve failed.");
		}
	};
	const rejectCandidate = async (id) => {
		if (!user) return;
		try {
			await rejectBrandCandidate(id, user.id);
			toast.success("Rejected.");
			refetchCand();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Reject failed.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 143,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-4xl px-4 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "mb-6 font-display text-3xl font-extrabold",
				children: t("admin.title")
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 145,
				columnNumber: 9
			}, this), loading ? null : !isAdmin ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-muted-foreground",
				children: "You don't have access to this page."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 146,
				columnNumber: 38
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Tabs, {
				defaultValue: "importer",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
							value: "importer",
							children: "Brand Importer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 148,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
							value: "queue",
							children: ["Import Queue", candidates?.length ? ` (${candidates.length})` : ""]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 149,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
							value: "verifications",
							children: ["Verifications", verifications?.length ? ` (${verifications.length})` : ""]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 152,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsTrigger, {
							value: "appeals",
							children: "Appeals"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 155,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 147,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "importer",
						className: "mt-6 space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-2xl border border-border bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
									className: "font-display text-lg font-bold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Globe, { className: "h-5 w-5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 161,
										columnNumber: 19
									}, this), " Wikidata Brand Importer"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 160,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Free, CC0-licensed. Pulls companies (with logos where available) for the selected country into the moderation queue."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 163,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "mt-4 flex flex-wrap items-end gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "flex flex-col text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "mb-1 text-muted-foreground",
												children: "Country"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 169,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
												value: country,
												onChange: (e) => setCountry(e.target.value),
												className: "h-10 rounded-md border border-border bg-background px-2",
												children: COUNTRIES.map(([c, l]) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
													value: c,
													children: l
												}, c, false, {
													fileName: _jsxFileName,
													lineNumber: 171,
													columnNumber: 50
												}, this))
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 170,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 168,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
											className: "flex flex-col text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "mb-1 text-muted-foreground",
												children: "Limit"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 175,
												columnNumber: 21
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Input, {
												type: "number",
												min: 1,
												max: 200,
												className: "w-24",
												value: limit,
												onChange: (e) => setLimit(Number(e.target.value))
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 176,
												columnNumber: 21
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 174,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											onClick: runImport,
											disabled: importing,
											className: "gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Download, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 179,
												columnNumber: 21
											}, this), importing ? "Importing…" : "Fetch from Wikidata"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 178,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
											onClick: runPublish,
											disabled: publishing || importing,
											variant: "secondary",
											className: "gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 183,
												columnNumber: 21
											}, this), publishing ? "Publishing…" : "Fetch + publish now"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 182,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 167,
									columnNumber: 17
								}, this),
								invitation && /* @__PURE__ */ (void 0)("div", {
									className: "mt-5 space-y-2",
									children: [/* @__PURE__ */ (void 0)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (void 0)("p", {
											className: "text-sm font-semibold",
											children: "Latest brand-owner invitation"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 189,
											columnNumber: 23
										}, this), /* @__PURE__ */ (void 0)(Button, {
											size: "sm",
											variant: "outline",
											className: "gap-1.5",
											onClick: () => navigator.clipboard?.writeText(invitation),
											children: [/* @__PURE__ */ (void 0)(Copy, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 191,
												columnNumber: 25
											}, this), " Copy"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 190,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 188,
										columnNumber: 21
									}, this), /* @__PURE__ */ (void 0)(Textarea, {
										value: invitation,
										readOnly: true,
										className: "min-h-48 text-xs"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 194,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 187,
									columnNumber: 32
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 159,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 158,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "queue",
						className: "mt-6 space-y-2",
						children: [candidates?.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: publishAll,
								disabled: publishing,
								className: "gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 202,
									columnNumber: 21
								}, this), " Publish all queued"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 201,
								columnNumber: 19
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 200,
							columnNumber: 37
						}, this) : null, !candidates?.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-muted-foreground",
							children: "Queue is empty. Run the importer."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 206,
							columnNumber: 38
						}, this) : candidates.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-4",
							children: [
								c.logo_url ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
									src: c.logo_url,
									alt: c.name,
									className: "h-10 w-10 rounded object-contain bg-white"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 207,
									columnNumber: 33
								}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "h-10 w-10 rounded bg-secondary flex items-center justify-center font-bold",
									children: c.name.charAt(0)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 207,
									columnNumber: 127
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "font-semibold truncate",
										children: c.name
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 211,
										columnNumber: 21
									}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "text-xs text-muted-foreground truncate",
										children: [
											c.country,
											" · ",
											c.category ?? "—",
											" · ",
											c.website ?? "no site"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 212,
										columnNumber: 21
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 210,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									onClick: () => approveCandidate(c.id),
									className: "gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Check, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 216,
										columnNumber: 94
									}, this), "Approve"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 216,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => {
										const text = buildBrandInvitation({
											name: c.name,
											slug: c.slug,
											website: c.website
										});
										setInvitation(text);
										navigator.clipboard?.writeText(text);
										toast.success("Invitation copied.");
									},
									className: "gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Copy, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 227,
										columnNumber: 21
									}, this), "Invite"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 217,
									columnNumber: 19
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => rejectCandidate(c.id),
									className: "gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(X, { className: "h-4 w-4" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 229,
										columnNumber: 111
									}, this), "Reject"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 229,
									columnNumber: 19
								}, this)
							]
						}, c.id, true, {
							fileName: _jsxFileName,
							lineNumber: 206,
							columnNumber: 135
						}, this))]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 199,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "appeals",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-2xl border border-border bg-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "mb-4 font-display text-lg font-bold",
								children: "Human content appeals"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 235,
								columnNumber: 17
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(AdminAppealsQueue, {}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 236,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 234,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 233,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TabsContent, {
						value: "verifications",
						className: "mt-6 space-y-3",
						children: (verifications ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-muted-foreground",
							children: t("admin.empty")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 241,
							columnNumber: 53
						}, this) : (verifications ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "font-display text-lg font-bold",
								children: r.brandName
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 243,
								columnNumber: 21
							}, this), r.message && /* @__PURE__ */ (void 0)("p", {
								className: "text-sm text-muted-foreground",
								children: r.message
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 244,
								columnNumber: 35
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 242,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									onClick: () => review(r.id, r.brand_id, true),
									children: t("admin.approve")
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 247,
									columnNumber: 21
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => review(r.id, r.brand_id, false),
									children: t("admin.reject")
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 248,
									columnNumber: 21
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 246,
								columnNumber: 19
							}, this)]
						}, r.id, true, {
							fileName: _jsxFileName,
							lineNumber: 241,
							columnNumber: 146
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 240,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 146,
				columnNumber: 117
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 144,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 142,
		columnNumber: 10
	}, this);
}
//#endregion
export { AdminPage as component };
