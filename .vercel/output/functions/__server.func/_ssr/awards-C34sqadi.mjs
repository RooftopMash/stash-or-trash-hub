import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { G as Heart, H as Layers, P as Map, S as Search, Tt as Award, Y as Funnel, bt as CalendarClock, c as Trophy, dt as CircleCheck, h as Sparkles, it as Crown, u as TrendingUp } from "../_libs/lucide-react.mjs";
import { i as cn } from "./label-1cB10GDW.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { c as Header, v as fetchBrands } from "./Header-E8juhbIs.mjs";
import { i as categoryOptions, n as brandCategory } from "./categories-CjnOH3FO.mjs";
import { t as Skeleton } from "./skeleton-pwfjuIjm.mjs";
import { n as PeopleTrustFactorLink } from "./PeopleTrustFactor-Cldphfb0.mjs";
import { a as normalizeCountryCode, n as countryName, r as countryOptions } from "./geo-CLO0oqry.mjs";
import { i as matchesTier, n as getBrandTier, r as getTierInfo, t as BRAND_TIERS } from "./brandTiers-B_KPABqh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/awards-C34sqadi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName = "/app/applet/src/routes/awards.tsx?tsr-split=component";
function AwardsPage() {
	const { t } = useTranslation();
	const { data: brands, isLoading } = useQuery({
		queryKey: ["brands"],
		queryFn: fetchBrands
	});
	const [country, setCountry] = (0, import_react.useState)("All countries");
	const [category, setCategory] = (0, import_react.useState)("All categories");
	const [tier, setTier] = (0, import_react.useState)("All tiers");
	const [query, setQuery] = (0, import_react.useState)("");
	const [period, setPeriod] = (0, import_react.useState)("Live season");
	const snapshotTime = (0, import_react.useMemo)(() => /* @__PURE__ */ new Date(), []);
	const countries = (0, import_react.useMemo)(() => ["All countries", ...countryOptions((brands ?? []).map((brand) => brand.country))], [brands]);
	const categories = (0, import_react.useMemo)(() => categoryOptions((brands ?? []).map((brand) => brandCategory(brand.name, brand.category))), [brands]);
	const top = (0, import_react.useMemo)(() => {
		const term = query.trim().toLowerCase();
		return (brands ?? []).filter((brand) => {
			const normalizedCountry = normalizeCountryCode(brand.country);
			const normalizedCategory = brandCategory(brand.name, brand.category);
			const brandTier = getBrandTier(brand.name, brand.category);
			const searchable = `${brand.name} ${countryName(normalizedCountry)} ${normalizedCategory} ${brandTier}`.toLowerCase();
			return (country === "All countries" || normalizedCountry === country) && (category === "All categories" || normalizedCategory === category) && (tier === "All tiers" || matchesTier(brandTier, tier)) && (!term || searchable.includes(term));
		}).sort((a, b) => (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0));
	}, [
		brands,
		category,
		country,
		tier,
		query
	]).slice(0, 10);
	const regionLabel = country === "All countries" ? "Global awards" : `${countryName(country)} awards`;
	const awardTypes = [
		{
			icon: Crown,
			title: t("awards.cat1"),
			desc: t("awards.cat1d")
		},
		{
			icon: Heart,
			title: t("awards.cat2"),
			desc: t("awards.cat2d")
		},
		{
			icon: TrendingUp,
			title: t("awards.cat3"),
			desc: t("awards.cat3d")
		},
		{
			icon: Sparkles,
			title: t("awards.cat4"),
			desc: t("awards.cat4d")
		}
	];
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 63,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-4xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "rounded-3xl border border-border bg-gradient-to-b from-secondary/60 to-card p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Trophy, { className: "mx-auto h-12 w-12 text-primary" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 67,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
							className: "mt-4 font-display text-4xl font-extrabold sm:text-5xl",
							children: t("awards.title")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 68,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-2 font-display text-lg font-semibold text-primary",
							children: t("awards.tagline")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-3 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(PeopleTrustFactorLink, {}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 70,
								columnNumber: 53
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 70,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mx-auto mt-4 max-w-xl text-muted-foreground",
							children: t("awards.intro")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 71,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 66,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "font-display text-2xl font-bold",
								children: t("awards.leaderboard")
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 78,
								columnNumber: 15
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [t("awards.leaderboardNote"), " Rankings stay inside the selected market and category."]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 79,
								columnNumber: 15
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 77,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-2 text-xs font-semibold text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Map, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 81,
									columnNumber: 89
								}, this), regionLabel]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 81,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 76,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-5 grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_280px]",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "grid gap-3 lg:grid-cols-[minmax(140px,0.75fr)_minmax(180px,1.4fr)_minmax(150px,0.9fr)]",
										children: [
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
												className: "flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarClock, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 88,
														columnNumber: 19
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "sr-only",
														children: "Award period"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 89,
														columnNumber: 19
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
														value: period,
														onChange: (event) => setPeriod(event.target.value),
														className: "bg-transparent text-sm font-medium outline-none",
														children: [
															/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { children: "Live season" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 91,
																columnNumber: 21
															}, this),
															/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { children: "Last 90 days" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 92,
																columnNumber: 21
															}, this),
															/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { children: "Last 12 months" }, void 0, false, {
																fileName: _jsxFileName,
																lineNumber: 93,
																columnNumber: 21
															}, this)
														]
													}, void 0, true, {
														fileName: _jsxFileName,
														lineNumber: 90,
														columnNumber: 19
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 87,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
												className: "flex h-10 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 97,
														columnNumber: 19
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "sr-only",
														children: "Search awards"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 98,
														columnNumber: 19
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
														value: query,
														onChange: (event) => setQuery(event.target.value),
														placeholder: "Search brands or markets",
														className: "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 99,
														columnNumber: 19
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 96,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
												className: "flex h-10 min-w-0 items-center gap-2 rounded-xl border border-border bg-background px-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Funnel, { className: "h-4 w-4 shrink-0 text-muted-foreground" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 102,
														columnNumber: 19
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
														className: "sr-only",
														children: "Award country"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 103,
														columnNumber: 19
													}, this),
													/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
														value: country,
														onChange: (event) => setCountry(event.target.value),
														className: "min-w-0 w-full bg-transparent text-sm font-medium outline-none",
														children: countries.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
															value: item,
															children: item === "All countries" ? item : countryName(item)
														}, item, false, {
															fileName: _jsxFileName,
															lineNumber: 105,
															columnNumber: 44
														}, this))
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 104,
														columnNumber: 19
													}, this)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 101,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 86,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-3 flex gap-2 overflow-x-auto pb-1",
										children: categories.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											onClick: () => setCategory(item),
											className: cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors", category === item ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"),
											children: item
										}, item, false, {
											fileName: _jsxFileName,
											lineNumber: 110,
											columnNumber: 41
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 109,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "mt-3 border-t border-border pt-3",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "mb-2 flex items-center justify-between text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "flex items-center gap-1.5 font-semibold text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layers, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 115,
													columnNumber: 21
												}, this), " Fair Competition Tiers"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 114,
												columnNumber: 19
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: tier === "All tiers" ? "Showing all scale tiers" : `Tier: ${tier}` }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 117,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 113,
											columnNumber: 17
										}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex gap-2 overflow-x-auto pb-1",
											children: BRAND_TIERS.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
												onClick: () => setTier(item),
												className: cn("shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors", tier === item ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "bg-secondary/70 text-muted-foreground hover:text-foreground"),
												children: item
											}, item, false, {
												fileName: _jsxFileName,
												lineNumber: 120,
												columnNumber: 44
											}, this))
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 119,
											columnNumber: 17
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 112,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 85,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "rounded-2xl border border-stash/30 bg-stash/5 p-5 shadow-sm md:min-h-[148px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
										className: "flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stash",
										children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CircleCheck, { className: "h-4 w-4" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 127,
											columnNumber: 109
										}, this), " Live snapshot"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 127,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-2 font-display text-sm font-bold",
										children: period
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 128,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
										className: "mt-1 text-xs leading-relaxed text-muted-foreground",
										children: [
											"Updated ",
											snapshotTime.toLocaleString(void 0, {
												dateStyle: "medium",
												timeStyle: "short"
											}),
											". Scoped to ",
											regionLabel.toLowerCase(),
											", ",
											category === "All categories" ? "all categories" : category,
											", and ",
											tier === "All tiers" ? "all competitive tiers" : tier,
											"."
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 129,
										columnNumber: 15
									}, this),
									tier !== "All tiers" && /* @__PURE__ */ (void 0)("div", {
										className: "mt-3 rounded-lg border border-border/60 bg-background/80 p-2.5 text-xs",
										children: [/* @__PURE__ */ (void 0)("p", {
											className: "font-semibold text-foreground",
											children: tier
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 134,
											columnNumber: 19
										}, this), /* @__PURE__ */ (void 0)("p", {
											className: "mt-0.5 text-muted-foreground",
											children: getTierInfo(tier).description
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 135,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 133,
										columnNumber: 40
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 126,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 84,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-4 overflow-hidden rounded-2xl border border-border",
							children: isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "space-y-px",
								children: [
									0,
									1,
									2,
									3
								].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "h-14 w-full rounded-none" }, i, false, {
									fileName: _jsxFileName,
									lineNumber: 143,
									columnNumber: 40
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 142,
								columnNumber: 26
							}, this) : top.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "p-8 text-center text-sm text-muted-foreground",
								children: t("brand.noBrands")
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 144,
								columnNumber: 43
							}, this) : top.map((b, i) => {
								const bTier = getBrandTier(b.name, b.category);
								const tierInfo = getTierInfo(bTier);
								return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
									to: "/brands/$slug",
									params: { slug: b.slug },
									className: "flex items-center gap-4 border-b border-border bg-card px-4 py-3 transition-colors last:border-0 hover:bg-secondary/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "w-8 text-center font-display text-lg font-extrabold text-muted-foreground",
											children: i < 3 ? [
												"1st",
												"2nd",
												"3rd"
											][i] : i + 1
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 150,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
											className: "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-sm font-bold",
											children: b.signedLogoUrl ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
												src: b.signedLogoUrl,
												alt: b.name,
												className: "h-full w-full object-cover"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 154,
												columnNumber: 42
											}, this) : b.name.charAt(0).toUpperCase()
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 153,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "flex-1 truncate font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: "truncate",
													children: b.name
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 158,
													columnNumber: 25
												}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
													className: cn("hidden sm:inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium leading-none", tierInfo.badgeClass),
													children: tierInfo.shortName
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 159,
													columnNumber: 25
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 157,
												columnNumber: 23
											}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
												className: "text-xs font-normal text-muted-foreground",
												children: [
													countryName(normalizeCountryCode(b.country)),
													" · ",
													brandCategory(b.name, b.category)
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 163,
												columnNumber: 23
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 156,
											columnNumber: 21
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "flex items-center gap-1.5 font-display font-extrabold text-stash",
											children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TrendingUp, { className: "h-4 w-4" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 168,
												columnNumber: 23
											}, this), b.trust_score]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 167,
											columnNumber: 21
										}, this)
									]
								}, b.id, true, {
									fileName: _jsxFileName,
									lineNumber: 147,
									columnNumber: 20
								}, this);
							})
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 141,
							columnNumber: 11
						}, this),
						top.length === 0 && !isLoading && /* @__PURE__ */ (void 0)("p", {
							className: "mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
							children: "No brands match this award market and category yet. Expand the filters to explore more nominees."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 174,
							columnNumber: 46
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: "Live eligibility: every listed brand may appear. Final ceremony editions will publish a timestamped snapshot of these country and category rankings."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 175,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "mt-6 rounded-2xl border border-stash/20 bg-stash/5 p-5",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
								className: "font-display text-lg font-bold",
								children: "Our fairness and accuracy standard"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 177,
								columnNumber: 13
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-3 grid gap-3 text-sm text-muted-foreground md:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
										className: "text-foreground",
										children: "Tiered competition."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 179,
										columnNumber: 18
									}, this), " Brands are grouped into clear market tiers (Global Titans, Industry Giants, National Champions, Emerging Challengers, and Heritage Icons) so enterprise reach never eclipses local craft or specialized verticals."] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 179,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
										className: "text-foreground",
										children: "Comparable scope."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 180,
										columnNumber: 18
									}, this), " Rankings are calculated only within the selected country, category, and tier, ensuring honest, like-for-like comparisons."] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 180,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
										className: "text-foreground",
										children: "Evidence before authority."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 181,
										columnNumber: 18
									}, this), " A score is a community signal, not a government or regulatory finding. Published evidence, methodology version, and timestamp remain visible."] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 181,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", {
										className: "text-foreground",
										children: "Coverage is not performance."
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 182,
										columnNumber: 18
									}, this), " Emerging brands without massive budgets remain fully discoverable and compete on equal footing within their tier."] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 182,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 178,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 176,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 75,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(CalendarClock, { className: "mt-1 h-6 w-6 shrink-0 text-primary" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 189,
							columnNumber: 13
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "font-display text-xl font-bold",
							children: "The road to the live ceremony"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 191,
							columnNumber: 15
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "A transparent process built from real-time community verdicts."
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 192,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 190,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 188,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-6 grid gap-3 md:grid-cols-4",
						children: [
							"Nominees open",
							"Public voting",
							"Snapshot locked",
							"Live ceremony"
						].map((stage, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-2xl border border-border p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", index === 0 ? "bg-stash text-stash-foreground" : "bg-secondary text-muted-foreground"),
									children: index + 1
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 197,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-3 font-display text-sm font-bold",
									children: stage
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 198,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted-foreground",
									children: index === 0 ? "Live now across each market and category." : index === 1 ? "Community verdicts will decide the shortlist." : index === 2 ? "Scores freeze with an auditable timestamp." : "Winners are celebrated in the real world."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 199,
									columnNumber: 17
								}, this)
							]
						}, stage, true, {
							fileName: _jsxFileName,
							lineNumber: 196,
							columnNumber: 107
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 195,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 187,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-display text-2xl font-bold",
						children: t("awards.categoryTitle")
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 206,
						columnNumber: 11
					}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-4 grid gap-4 sm:grid-cols-2",
						children: awardTypes.map((c) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "rounded-2xl border border-border bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(c.icon, { className: "h-7 w-7 text-primary" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 209,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "mt-3 font-display text-lg font-bold",
									children: c.title
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 210,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: c.desc
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 211,
									columnNumber: 17
								}, this)
							]
						}, c.title, true, {
							fileName: _jsxFileName,
							lineNumber: 208,
							columnNumber: 34
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 207,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 205,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
					className: "mt-10 rounded-3xl border border-border bg-card p-8 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Award, { className: "mx-auto h-10 w-10 text-primary" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 218,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
							className: "mt-3 font-display text-2xl font-bold",
							children: t("awards.cta")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 219,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mx-auto mt-2 max-w-md text-muted-foreground",
							children: t("awards.ctaNote")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 220,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
							to: "/brands",
							className: "mt-5 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90",
							children: t("nav.brands")
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 221,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 217,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 64,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 62,
		columnNumber: 10
	}, this);
}
//#endregion
export { AwardsPage as component };
