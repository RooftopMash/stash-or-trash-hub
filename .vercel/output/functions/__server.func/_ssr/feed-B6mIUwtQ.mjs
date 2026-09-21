import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { F as MapPin, L as LocateFixed, S as Search, ot as Coins, u as TrendingUp, v as ShieldCheck, w as Recycle } from "../_libs/lucide-react.mjs";
import { c as Route$15, l as useAuth } from "./router-Ymvu7mB_.mjs";
import { i as cn } from "./label-1cB10GDW.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { b as fetchFeed, c as Header } from "./Header-BKSLqlsv.mjs";
import { a as matchesCategory, i as categoryOptions, n as brandCategory } from "./categories-CjnOH3FO.mjs";
import { t as Skeleton } from "./skeleton-pwfjuIjm.mjs";
import { a as normalizeCountryCode, i as detectCountry, r as countryOptions, t as countryLabel } from "./geo-CLO0oqry.mjs";
import { p as getTrendingHashtags } from "./social-CNdxEfFV.mjs";
import { t as ItemCard } from "./ItemCard-mRZy7nQp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/feed-B6mIUwtQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$2 = "/app/applet/src/components/LocationAwareFeed.tsx";
function LocationAwareFeed({ selectedCountry, onCountryChange, availableCountries }) {
	const [state, setState] = (0, import_react.useState)("detecting");
	const [requested, setRequested] = (0, import_react.useState)(false);
	const detected = (0, import_react.useMemo)(() => normalizeCountryCode(detectCountry()), []);
	(0, import_react.useEffect)(() => {
		if (requested || typeof navigator === "undefined" || !navigator.geolocation) {
			if (!requested) setState("fallback");
			return;
		}
		setRequested(true);
		navigator.geolocation.getCurrentPosition(() => {
			setState("gps");
			if (detected && availableCountries.includes(detected)) onCountryChange(detected);
		}, () => {
			setState(detected ? "fallback" : "unavailable");
			if (detected && availableCountries.includes(detected)) onCountryChange(detected);
		}, {
			enableHighAccuracy: true,
			timeout: 8e3,
			maximumAge: 3e5
		});
	}, [
		availableCountries,
		detected,
		onCountryChange,
		requested
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "flex flex-col gap-2 rounded-xl border border-border bg-background/80 p-3 sm:flex-row sm:items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "flex min-w-0 flex-1 items-center gap-2",
				children: [
					state === "gps" ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LocateFixed, { className: "h-4 w-4 shrink-0 text-stash" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 49,
						columnNumber: 11
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(MapPin, { className: "h-4 w-4 shrink-0 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 51,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "truncate text-xs font-semibold",
							children: ["Local feed: ", countryLabel(selectedCountry)]
						}, void 0, true, {
							fileName: _jsxFileName$2,
							lineNumber: 54,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "text-[11px] text-muted-foreground",
							children: state === "gps" ? "Location permission granted; coordinates are not stored." : state === "detecting" ? "Checking your location preference…" : "Using your profile, locale, or timezone country."
						}, void 0, false, {
							fileName: _jsxFileName$2,
							lineNumber: 57,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$2,
						lineNumber: 53,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ShieldCheck, {
						className: "ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground",
						"aria-label": "Privacy-safe location"
					}, void 0, false, {
						fileName: _jsxFileName$2,
						lineNumber: 65,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$2,
				lineNumber: 47,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
				className: "sr-only",
				htmlFor: "feed-country",
				children: "Choose country"
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 70,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
				id: "feed-country",
				value: selectedCountry,
				onChange: (event) => {
					setState("manual");
					onCountryChange(event.target.value);
				},
				className: cn("h-9 rounded-lg border border-border bg-card px-3 text-sm font-medium outline-none", "sm:w-44"),
				children: availableCountries.map((code) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
					value: code,
					suppressHydrationWarning: true,
					children: countryLabel(code)
				}, code, false, {
					fileName: _jsxFileName$2,
					lineNumber: 86,
					columnNumber: 11
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$2,
				lineNumber: 73,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$2,
		lineNumber: 46,
		columnNumber: 5
	}, this);
}
var _jsxFileName$1 = "/app/applet/src/components/TrendingHashtags.tsx";
function TrendingHashtags() {
	const { t } = useTranslation();
	const { data: hashtags, isLoading } = useQuery({
		queryKey: ["trending-hashtags"],
		queryFn: () => getTrendingHashtags(10)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-2xl border border-border bg-card p-4 space-y-2",
		children: [
			0,
			1,
			2,
			3
		].map((i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "h-8 w-full rounded" }, i, false, {
			fileName: _jsxFileName$1,
			lineNumber: 20,
			columnNumber: 11
		}, this))
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 18,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "rounded-2xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
			className: "font-display font-bold text-lg flex items-center gap-2 mb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TrendingUp, { className: "h-5 w-5 text-stash" }, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 29,
					columnNumber: 9
				}, this),
				" ",
				t("social.trending")
			]
		}, void 0, true, {
			fileName: _jsxFileName$1,
			lineNumber: 28,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
			className: "space-y-2",
			children: hashtags && hashtags.length > 0 ? hashtags.map((tag) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
				to: "/hashtags/$tag",
				params: { tag: tag.tag },
				className: "flex items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors group",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "font-semibold text-sm group-hover:text-primary",
					children: ["#", tag.tag]
				}, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 41,
					columnNumber: 17
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
					className: "text-xs text-muted-foreground",
					children: t("social.postsCount", { count: tag.use_count })
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 42,
					columnNumber: 17
				}, this)] }, void 0, true, {
					fileName: _jsxFileName$1,
					lineNumber: 40,
					columnNumber: 15
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
					className: "text-xs text-muted-foreground",
					children: tag.use_count.toLocaleString()
				}, void 0, false, {
					fileName: _jsxFileName$1,
					lineNumber: 46,
					columnNumber: 15
				}, this)]
			}, tag.id, true, {
				fileName: _jsxFileName$1,
				lineNumber: 34,
				columnNumber: 13
			}, this)) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "text-sm text-muted-foreground text-center py-4",
				children: t("social.noTrending")
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 52,
				columnNumber: 11
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName$1,
			lineNumber: 31,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 27,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/feed.tsx?tsr-split=component";
function Feed() {
	const { user } = useAuth();
	const search = Route$15.useSearch();
	const [verdictFilter, setVerdictFilter] = (0, import_react.useState)(search.filter ?? "all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [selectedCountry, setSelectedCountry] = (0, import_react.useState)("ZA");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("All categories");
	(0, import_react.useEffect)(() => {
		if (search.filter) setVerdictFilter(search.filter);
	}, [search.filter]);
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["feed", user?.id ?? "anon"],
		queryFn: () => fetchFeed(user?.id ?? null)
	});
	const countries = (0, import_react.useMemo)(() => countryOptions((data ?? []).map((item) => item.brandCountry)), [data]);
	const localFeed = (0, import_react.useMemo)(() => (data ?? []).filter((item) => normalizeCountryCode(item.brandCountry) === selectedCountry), [data, selectedCountry]);
	const categories = (0, import_react.useMemo)(() => categoryOptions(localFeed.map((item) => brandCategory(item.brandName, item.category))), [localFeed]);
	const stashCountTotal = (0, import_react.useMemo)(() => localFeed.filter((item) => (item.stashCount || 0) >= (item.trashCount || 0) && (item.stashCount || 0) > 0).length, [localFeed]);
	const trashCountTotal = (0, import_react.useMemo)(() => localFeed.filter((item) => (item.trashCount || 0) >= (item.stashCount || 0) && (item.trashCount || 0) > 0).length, [localFeed]);
	const filteredFeed = (0, import_react.useMemo)(() => {
		const term = query.trim().toLowerCase();
		return localFeed.filter((item) => {
			const category = brandCategory(item.brandName, item.category);
			const searchable = `${item.title} ${item.description ?? ""} ${item.brandName ?? ""} ${category}`.toLowerCase();
			const matchesSearch = !term || searchable.includes(term);
			const matchesCat = matchesCategory(category, selectedCategory);
			let matchesVerdict = true;
			if (verdictFilter === "stash") matchesVerdict = (item.stashCount || 0) >= (item.trashCount || 0) && (item.stashCount || 0) > 0;
			else if (verdictFilter === "trash") matchesVerdict = (item.trashCount || 0) >= (item.stashCount || 0) && (item.trashCount || 0) > 0;
			return matchesSearch && matchesCat && matchesVerdict;
		}).sort((a, b) => {
			if (verdictFilter === "stash") return (b.stashCount || 0) - (b.trashCount || 0) - ((a.stashCount || 0) - (a.trashCount || 0));
			if (verdictFilter === "trash") return (b.trashCount || 0) - (b.stashCount || 0) - ((a.trashCount || 0) - (a.stashCount || 0));
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
		});
	}, [
		localFeed,
		query,
		selectedCategory,
		verdictFilter
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, { onPosted: () => void refetch() }, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 67,
			columnNumber: 7
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto max-w-6xl px-4 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "text-xs font-bold uppercase tracking-[0.2em] text-stash",
						children: "Community pulse"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 70,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
						className: "mt-2 font-display text-4xl font-extrabold tracking-tight",
						children: "Stash Or Trash"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 71,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 max-w-3xl text-lg font-semibold leading-7 text-foreground",
						children: "The Brand Barometer. Post anything about a brand and let the community deliver its verdict in real time — the CX & PR signal that matters."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 74,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-2 max-w-2xl text-muted-foreground",
						children: "Every verdict brings brands closer to the people they serve. Cast yours."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 78,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 69,
				columnNumber: 9
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]",
				children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
						className: "mb-5 rounded-2xl border border-border bg-card p-4 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(LocationAwareFeed, {
									selectedCountry,
									availableCountries: countries,
									onCountryChange: (country) => {
										setSelectedCountry(country);
										setSelectedCategory("All categories");
									}
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 86,
									columnNumber: 17
								}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
									className: "flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-background px-3 md:max-w-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 91,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
											className: "sr-only",
											children: "Search feed"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 92,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
											value: query,
											onChange: (event) => setQuery(event.target.value),
											placeholder: "Search posts or brands",
											className: "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 93,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 90,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 85,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-4 flex gap-2 overflow-x-auto pb-1",
								children: categories.map((category) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
									onClick: () => setSelectedCategory(category),
									className: cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold", selectedCategory === category ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"),
									children: category
								}, category, false, {
									fileName: _jsxFileName,
									lineNumber: 97,
									columnNumber: 45
								}, this))
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 96,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
									className: "flex items-center gap-1.5 overflow-x-auto pb-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => setVerdictFilter("all"),
											className: cn("flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all", verdictFilter === "all" ? "bg-foreground text-background shadow-xs" : "bg-secondary text-muted-foreground hover:text-foreground"),
											children: [
												"All verdicts (",
												localFeed.length,
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 103,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => setVerdictFilter("stash"),
											className: cn("flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all", verdictFilter === "stash" ? "bg-stash text-black shadow-xs ring-2 ring-stash/40" : "bg-stash/10 text-stash hover:bg-stash/20"),
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Coins, { className: "h-3.5 w-3.5" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 107,
													columnNumber: 21
												}, this),
												"Stashes of the Day (",
												stashCountTotal,
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 106,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
											type: "button",
											onClick: () => setVerdictFilter("trash"),
											className: cn("flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all", verdictFilter === "trash" ? "bg-trash text-white shadow-xs ring-2 ring-trash/40" : "bg-trash/10 text-trash hover:bg-trash/20"),
											children: [
												/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Recycle, { className: "h-3.5 w-3.5" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 111,
													columnNumber: 21
												}, this),
												"Trashes of the Day (",
												trashCountTotal,
												")"
											]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 110,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 102,
									columnNumber: 17
								}, this), verdictFilter !== "all" && /* @__PURE__ */ (void 0)("button", {
									type: "button",
									onClick: () => setVerdictFilter("all"),
									className: "text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-4",
									children: "Reset filter"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 115,
									columnNumber: 45
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 101,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 84,
						columnNumber: 13
					}, this),
					verdictFilter === "stash" && /* @__PURE__ */ (void 0)("div", {
						className: "mb-4 flex items-center justify-between rounded-xl border border-stash/30 bg-stash/10 px-4 py-2.5 text-xs font-semibold text-stash",
						children: [/* @__PURE__ */ (void 0)("span", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (void 0)(Coins, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 123,
									columnNumber: 19
								}, this),
								"Showing ",
								/* @__PURE__ */ (void 0)("strong", { children: "Stashes of the Day" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 124,
									columnNumber: 27
								}, this),
								" — Brands and products with positive community momentum"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 122,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("span", {
							className: "text-[11px] font-normal opacity-80",
							children: "Sorted by highest stash margins"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 126,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 121,
						columnNumber: 43
					}, this),
					verdictFilter === "trash" && /* @__PURE__ */ (void 0)("div", {
						className: "mb-4 flex items-center justify-between rounded-xl border border-trash/30 bg-trash/10 px-4 py-2.5 text-xs font-semibold text-trash",
						children: [/* @__PURE__ */ (void 0)("span", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (void 0)(Recycle, { className: "h-4 w-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 131,
									columnNumber: 19
								}, this),
								"Showing ",
								/* @__PURE__ */ (void 0)("strong", { children: "Trashes of the Day" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 132,
									columnNumber: 27
								}, this),
								" — Public complaints, issues, and calls for accountability"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 130,
							columnNumber: 17
						}, this), /* @__PURE__ */ (void 0)("span", {
							className: "text-[11px] font-normal opacity-80",
							children: "Sorted by highest trash margins"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 134,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 129,
						columnNumber: 43
					}, this),
					isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4",
						children: [
							0,
							1,
							2
						].map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "h-64 w-full rounded-2xl" }, item, false, {
							fileName: _jsxFileName,
							lineNumber: 137,
							columnNumber: 40
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 136,
						columnNumber: 26
					}, this) : filteredFeed.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "space-y-4",
						children: filteredFeed.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(ItemCard, {
							item,
							onChange: () => void refetch()
						}, item.id, false, {
							fileName: _jsxFileName,
							lineNumber: 139,
							columnNumber: 43
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 138,
						columnNumber: 46
					}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "rounded-2xl border border-dashed border-border py-16 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Recycle, { className: "mx-auto h-10 w-10 text-muted-foreground" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 141,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-4 font-display text-lg font-semibold",
								children: "No conversations found"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 142,
								columnNumber: 17
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Try another country, category, or search term."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 143,
								columnNumber: 17
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 140,
						columnNumber: 24
					}, this)
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 83,
					columnNumber: 11
				}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("aside", {
					className: "hidden lg:block",
					children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "sticky top-20",
						children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(TrendingHashtags, {}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 150,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 149,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 148,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 82,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 68,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 66,
		columnNumber: 10
	}, this);
}
//#endregion
export { Feed as component };
