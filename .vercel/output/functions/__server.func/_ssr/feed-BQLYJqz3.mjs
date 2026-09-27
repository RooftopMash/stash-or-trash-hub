import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as cn, o as useAuth } from "./label-BlRLLIBM.mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as Search, E as ShieldCheck, Gt as BadgeCheck, J as MapPin, Jt as ArrowUp, P as Recycle, Qt as ArrowDown, Vt as Building2, X as LocateFixed, Yt as ArrowUpRight, bt as Earth, dt as Funnel, i as X, m as TrendingUp, mt as FileText, nt as Layers, wt as Coins } from "../_libs/lucide-react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { W as fetchBrands, _t as countryOptions, b as Skeleton, c as Route$17, g as brandCategory, gt as countryName, ht as countryLabel, mt as countryFlag, tt as fetchFeed, v as categoryOptions, vt as detectCountry, x as Header, y as matchesCategory, yt as normalizeCountryCode } from "./router-BjpvJuyR.mjs";
import { t as BrandLogo } from "./BrandLogo-Nd6kylYm.mjs";
import { p as getTrendingHashtags } from "./social-CSxIyKrD.mjs";
import { t as ItemCard } from "./ItemCard-CHTXjOhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/feed-BQLYJqz3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2 rounded-xl border border-border bg-background/80 p-3 sm:flex-row sm:items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 items-center gap-2",
				children: [
					state === "gps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocateFixed, { className: "h-4 w-4 shrink-0 text-stash" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs font-semibold",
							children: ["Local feed: ", countryLabel(selectedCountry)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: state === "gps" ? "Location permission granted; coordinates are not stored." : state === "detecting" ? "Checking your location preference…" : "Using your profile, locale, or timezone country."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
						className: "ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground",
						"aria-label": "Privacy-safe location"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "sr-only",
				htmlFor: "feed-country",
				children: "Choose country"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				id: "feed-country",
				value: selectedCountry,
				onChange: (event) => {
					setState("manual");
					onCountryChange(event.target.value);
				},
				className: cn("h-9 rounded-lg border border-border bg-card px-3 text-sm font-medium outline-none", "sm:w-44"),
				children: availableCountries.map((code) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: code,
					suppressHydrationWarning: true,
					children: countryLabel(code)
				}, code))
			})
		]
	});
}
function TrendingHashtags() {
	const { t } = useTranslation();
	const { data: hashtags, isLoading } = useQuery({
		queryKey: ["trending-hashtags"],
		queryFn: () => getTrendingHashtags(10)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card p-4 space-y-2",
		children: [
			0,
			1,
			2,
			3
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-full rounded" }, i))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "font-display font-bold text-lg flex items-center gap-2 mb-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-5 w-5 text-stash" }),
				" ",
				t("social.trending")
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: hashtags && hashtags.length > 0 ? hashtags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/hashtags/$tag",
				params: { tag: tag.tag },
				className: "flex items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-semibold text-sm group-hover:text-primary",
					children: ["#", tag.tag]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: t("social.postsCount", { count: tag.use_count })
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: tag.use_count.toLocaleString()
				})]
			}, tag.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground text-center py-4",
				children: t("social.noTrending")
			})
		})]
	});
}
function Feed() {
	const { user } = useAuth();
	const { t } = useTranslation();
	const search = Route$17.useSearch();
	const searchInputRef = (0, import_react.useRef)(null);
	const [verdictFilter, setVerdictFilter] = (0, import_react.useState)(search.filter ?? "all");
	const [query, setQuery] = (0, import_react.useState)(search.q ?? "");
	const [selectedBrandSlug, setSelectedBrandSlug] = (0, import_react.useState)(search.brand ?? null);
	const [selectedCountry, setSelectedCountry] = (0, import_react.useState)("ZA");
	const [searchAllCountries, setSearchAllCountries] = (0, import_react.useState)(true);
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("All categories");
	const [resultScope, setResultScope] = (0, import_react.useState)("all");
	const [showAllMatchingBrands, setShowAllMatchingBrands] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (search.filter) setVerdictFilter(search.filter);
		if (typeof search.q === "string") setQuery(search.q);
		if (typeof search.brand === "string") setSelectedBrandSlug(search.brand);
	}, [
		search.filter,
		search.q,
		search.brand
	]);
	(0, import_react.useEffect)(() => {
		const onKeyDown = (e) => {
			if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA" && !document.activeElement?.isContentEditable) {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);
	const { data: feedData, isLoading: feedLoading, refetch } = useQuery({
		queryKey: ["feed", user?.id ?? "anon"],
		queryFn: () => fetchFeed(user?.id ?? null)
	});
	const { data: brandsData, isLoading: brandsLoading } = useQuery({
		queryKey: ["brands"],
		queryFn: fetchBrands
	});
	const isSearching = query.trim().length > 0;
	const countries = (0, import_react.useMemo)(() => {
		const feedCountries = (feedData ?? []).map((item) => item.brandCountry);
		const brandCountries = (brandsData ?? []).map((brand) => brand.country);
		return countryOptions([...feedCountries, ...brandCountries]);
	}, [feedData, brandsData]);
	const countryScopedFeed = (0, import_react.useMemo)(() => {
		const allItems = feedData ?? [];
		if (isSearching && searchAllCountries) return allItems;
		return allItems.filter((item) => normalizeCountryCode(item.brandCountry) === selectedCountry);
	}, [
		feedData,
		selectedCountry,
		isSearching,
		searchAllCountries
	]);
	const countryScopedBrands = (0, import_react.useMemo)(() => {
		const allBrands = brandsData ?? [];
		if (isSearching && searchAllCountries) return allBrands;
		return allBrands.filter((brand) => normalizeCountryCode(brand.country) === selectedCountry);
	}, [
		brandsData,
		selectedCountry,
		isSearching,
		searchAllCountries
	]);
	const categories = (0, import_react.useMemo)(() => {
		const postCats = countryScopedFeed.map((item) => brandCategory(item.brandName, item.category));
		const brandCats = countryScopedBrands.map((brand) => brandCategory(brand.name, brand.category));
		return categoryOptions([...postCats, ...brandCats]);
	}, [countryScopedFeed, countryScopedBrands]);
	const filteredBrands = (0, import_react.useMemo)(() => {
		const term = query.trim().toLowerCase();
		return countryScopedBrands.filter((brand) => {
			const category = brandCategory(brand.name, brand.category);
			const cCode = normalizeCountryCode(brand.country);
			const cName = countryName(cCode);
			const searchable = `${brand.name} ${brand.slug} ${brand.description ?? ""} ${category} ${cCode} ${cName}`.toLowerCase();
			const matchesSearch = !term || searchable.includes(term);
			const matchesCat = matchesCategory(category, selectedCategory);
			const matchesSelectedBrand = !selectedBrandSlug || brand.slug === selectedBrandSlug;
			return matchesSearch && matchesCat && matchesSelectedBrand;
		}).sort((a, b) => {
			if (term) {
				const aStarts = a.name.toLowerCase().startsWith(term) ? 1 : 0;
				const bStarts = b.name.toLowerCase().startsWith(term) ? 1 : 0;
				if (aStarts !== bStarts) return bStarts - aStarts;
			}
			return (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0);
		});
	}, [
		countryScopedBrands,
		query,
		selectedCategory,
		selectedBrandSlug
	]);
	const stashCountTotal = (0, import_react.useMemo)(() => countryScopedFeed.filter((item) => (item.stashCount || 0) >= (item.trashCount || 0) && (item.stashCount || 0) > 0).length, [countryScopedFeed]);
	const trashCountTotal = (0, import_react.useMemo)(() => countryScopedFeed.filter((item) => (item.trashCount || 0) >= (item.stashCount || 0) && (item.trashCount || 0) > 0).length, [countryScopedFeed]);
	const filteredFeed = (0, import_react.useMemo)(() => {
		const term = query.trim().toLowerCase();
		return countryScopedFeed.filter((item) => {
			const category = brandCategory(item.brandName, item.category);
			const cCode = normalizeCountryCode(item.brandCountry);
			const cName = countryName(cCode);
			const searchable = `${item.title} ${item.description ?? ""} ${item.brandName ?? ""} ${item.brandSlug ?? ""} ${category} ${item.authorName ?? ""} ${cCode} ${cName}`.toLowerCase();
			const matchesSearch = !term || searchable.includes(term);
			const matchesCat = matchesCategory(category, selectedCategory);
			const matchesSelectedBrand = !selectedBrandSlug || item.brandSlug === selectedBrandSlug || item.brandName && item.brandName.toLowerCase() === selectedBrandSlug.replace(/-/g, " ").toLowerCase();
			let matchesVerdict = true;
			if (verdictFilter === "stash") matchesVerdict = (item.stashCount || 0) >= (item.trashCount || 0) && (item.stashCount || 0) > 0;
			else if (verdictFilter === "trash") matchesVerdict = (item.trashCount || 0) >= (item.stashCount || 0) && (item.trashCount || 0) > 0;
			return matchesSearch && matchesCat && matchesSelectedBrand && matchesVerdict;
		}).sort((a, b) => {
			if (verdictFilter === "stash") return (b.stashCount || 0) - (b.trashCount || 0) - ((a.stashCount || 0) - (a.trashCount || 0));
			if (verdictFilter === "trash") return (b.trashCount || 0) - (b.stashCount || 0) - ((a.trashCount || 0) - (a.stashCount || 0));
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
		});
	}, [
		countryScopedFeed,
		query,
		selectedCategory,
		selectedBrandSlug,
		verdictFilter
	]);
	const activeBrandObj = (0, import_react.useMemo)(() => selectedBrandSlug ? (brandsData ?? []).find((b) => b.slug === selectedBrandSlug) ?? null : null, [brandsData, selectedBrandSlug]);
	const brandSentimentBySlug = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const brand of brandsData ?? []) {
			const trust = Number(brand.trust_score) || 0;
			map.set(brand.slug, {
				stash: 0,
				trash: 0,
				trust,
				trend: trust >= 60 ? "up" : "down"
			});
		}
		for (const item of feedData ?? []) {
			const slug = item.brandSlug;
			if (!slug) continue;
			const existing = map.get(slug) ?? {
				stash: 0,
				trash: 0,
				trust: typeof item.brandTrustScore === "number" ? item.brandTrustScore : 70,
				trend: "up"
			};
			existing.stash += item.stashCount || 0;
			existing.trash += item.trashCount || 0;
			if (existing.stash !== existing.trash) existing.trend = existing.stash > existing.trash ? "up" : "down";
			else existing.trend = existing.trust >= 60 ? "up" : "down";
			map.set(slug, existing);
		}
		return map;
	}, [brandsData, feedData]);
	const visibleBrands = (0, import_react.useMemo)(() => {
		if (resultScope === "brands" || showAllMatchingBrands) return filteredBrands.slice(0, 24);
		if (isSearching) return filteredBrands.slice(0, 8);
		return filteredBrands.slice(0, 6);
	}, [
		filteredBrands,
		resultScope,
		showAllMatchingBrands,
		isSearching
	]);
	const hasActiveFilters = isSearching || selectedCategory !== "All categories" || verdictFilter !== "all" || selectedBrandSlug !== null;
	const resetAllFilters = () => {
		setQuery("");
		setSelectedCategory("All categories");
		setVerdictFilter("all");
		setSelectedBrandSlug(null);
		setResultScope("all");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { onPosted: () => void refetch() }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold uppercase tracking-[0.2em] text-stash",
							children: t("feed.pulse", { defaultValue: "Community pulse" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-4xl font-extrabold tracking-tight",
							children: t("feed.title", { defaultValue: "Stash Or Trash" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-3xl text-lg font-semibold leading-7 text-foreground",
							children: t("feed.subtitle", { defaultValue: "The Brand Barometer. Post anything about a brand and let the community deliver its verdict in real time — the CX & PR signal that matters." })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 max-w-2xl text-muted-foreground",
							children: t("feed.hook", { defaultValue: "Every verdict brings brands closer to the people they serve. Cast yours." })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-label": "Real-time brand and post search",
					className: "mb-6 rounded-2xl border-2 border-border bg-card p-4 shadow-sm transition-colors focus-within:border-foreground/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 lg:flex-row lg:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: searchInputRef,
									type: "search",
									value: query,
									onChange: (event) => setQuery(event.target.value),
									placeholder: t("feed.realtimeSearchPlaceholder", { defaultValue: "Search brands, posts, categories, or keywords in real time..." }),
									"aria-label": t("feed.searchPlaceholder", { defaultValue: "Search posts or brands" }),
									className: "h-12 w-full rounded-xl border border-border bg-background pr-24 pl-11 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-foreground"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5",
									children: query ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setQuery(""),
										"aria-label": "Clear search",
										className: "inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-secondary/80 hover:text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("common.clear", { defaultValue: "Clear" }) })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
										className: "hidden rounded border border-border bg-secondary/70 px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground sm:inline-block",
										children: "/"
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setResultScope("all"),
									className: cn("inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition", resultScope === "all" ? "bg-foreground text-background shadow-xs" : "bg-secondary text-muted-foreground hover:text-foreground"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("feed.allResults", { defaultValue: "All" }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-background/20 px-1.5 py-0.5 text-[10px]",
											children: filteredBrands.length + filteredFeed.length
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setResultScope("brands"),
									className: cn("inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition", resultScope === "brands" ? "bg-foreground text-background shadow-xs" : "bg-secondary text-muted-foreground hover:text-foreground"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("nav.brands", { defaultValue: "Brands" }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-background/20 px-1.5 py-0.5 text-[10px]",
											children: filteredBrands.length
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setResultScope("posts"),
									className: cn("inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition", resultScope === "posts" ? "bg-foreground text-background shadow-xs" : "bg-secondary text-muted-foreground hover:text-foreground"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("feed.posts", { defaultValue: "Posts" }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-background/20 px-1.5 py-0.5 text-[10px]",
											children: filteredFeed.length
										})
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isSearching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								t("feed.liveFiltering", { defaultValue: "Live results for" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-foreground",
									children: [
										"“",
										query.trim(),
										"”"
									]
								}),
								":",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: filteredBrands.length
								}),
								" ",
								filteredBrands.length === 1 ? "brand" : "brands",
								" &",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: filteredFeed.length
								}),
								" ",
								filteredFeed.length === 1 ? "post" : "posts"
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								t("feed.showingSummary", { defaultValue: "Showing" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: filteredBrands.length
								}),
								" ",
								t("nav.brands", { defaultValue: "brands" }).toLowerCase(),
								" &",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: filteredFeed.length
								}),
								" ",
								t("feed.posts", { defaultValue: "posts" }).toLowerCase(),
								" in",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "text-foreground",
									children: [
										countryFlag(selectedCountry),
										" ",
										countryName(selectedCountry)
									]
								})
							] }) }), activeBrandObj && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3 w-3" }),
									"Brand: ",
									activeBrandObj.name,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setSelectedBrandSlug(null),
										className: "ml-0.5 rounded-full p-0.5 hover:bg-primary/20",
										"aria-label": "Remove brand filter",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3",
							children: [isSearching && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: searchAllCountries,
										onChange: (e) => setSearchAllCountries(e.target.checked),
										className: "h-3.5 w-3.5 rounded border-border accent-foreground"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-3.5 w-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("feed.searchAllCountries", { defaultValue: "Search across all countries" }) })
								]
							}), hasActiveFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: resetAllFilters,
								className: "font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground",
								children: t("feed.resetAllFilters", { defaultValue: "Reset all filters" })
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mb-5 rounded-2xl border border-border bg-card p-4 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationAwareFeed, {
										selectedCountry,
										availableCountries: countries,
										onCountryChange: (country) => {
											setSelectedCountry(country);
											setSelectedCategory("All categories");
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											countryScopedBrands.length,
											" ",
											t("nav.brands", { defaultValue: "Brands" }),
											" ·",
											" ",
											countryScopedFeed.length,
											" ",
											t("feed.posts", { defaultValue: "Posts" })
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 flex gap-2 overflow-x-auto pb-1",
									children: categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setSelectedCategory(category),
										className: cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors", selectedCategory === category ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"),
										children: category
									}, category))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 overflow-x-auto pb-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setVerdictFilter("all"),
												className: cn("flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all", verdictFilter === "all" ? "bg-foreground text-background shadow-xs" : "bg-secondary text-muted-foreground hover:text-foreground"),
												children: [
													t("feed.allVerdicts", { defaultValue: "All verdicts" }),
													" (",
													countryScopedFeed.length,
													")"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setVerdictFilter("stash"),
												className: cn("flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all", verdictFilter === "stash" ? "bg-stash text-black shadow-xs ring-2 ring-stash/40" : "bg-stash/10 text-stash hover:bg-stash/20"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-3.5 w-3.5" }),
													t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" }),
													" (",
													stashCountTotal,
													")"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setVerdictFilter("trash"),
												className: cn("flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all", verdictFilter === "trash" ? "bg-trash text-white shadow-xs ring-2 ring-trash/40" : "bg-trash/10 text-trash hover:bg-trash/20"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Recycle, { className: "h-3.5 w-3.5" }),
													t("feed.trashesOfDay", { defaultValue: "Trashes of the Day" }),
													" (",
													trashCountTotal,
													")"
												]
											})
										]
									}), verdictFilter !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setVerdictFilter("all"),
										className: "text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground",
										children: t("feed.resetFilter", { defaultValue: "Reset filter" })
									})]
								})
							]
						}),
						resultScope !== "posts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex flex-wrap items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 text-stash" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-sm font-extrabold uppercase tracking-wider text-foreground",
										children: isSearching ? t("feed.matchingBrands", { defaultValue: `Matching Brands (${filteredBrands.length})` }) : t("feed.brandsInFeed", { defaultValue: `Brands in ${countryName(selectedCountry)} (${filteredBrands.length})` })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 text-xs",
									children: [filteredBrands.length > 6 && resultScope === "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowAllMatchingBrands((prev) => !prev),
										className: "font-semibold text-muted-foreground hover:text-foreground",
										children: showAllMatchingBrands ? t("common.showLess", { defaultValue: "Show fewer" }) : t("common.showMore", { defaultValue: `Show all ${Math.min(24, filteredBrands.length)}` })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/brands",
										className: "inline-flex items-center gap-1 font-bold text-primary hover:underline",
										children: [t("feed.browseAllBrands", { defaultValue: "Brand directory" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })]
									})]
								})]
							}), brandsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2.5 sm:grid-cols-2 md:grid-cols-3",
								children: [
									0,
									1,
									2
								].map((idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full rounded-xl" }, idx))
							}) : visibleBrands.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2.5 sm:grid-cols-2 md:grid-cols-3",
								children: visibleBrands.map((brand) => {
									const trust = Number(brand.trust_score) || 0;
									const trend = brandSentimentBySlug.get(brand.slug)?.trend ?? (trust >= 60 ? "up" : "down");
									const isSelectedBrand = selectedBrandSlug === brand.slug;
									const bCountry = normalizeCountryCode(brand.country);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("group flex flex-col justify-between rounded-xl border p-3 transition-all", isSelectedBrand ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border/80 bg-background/60 hover:border-border hover:bg-background"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/brands/$slug",
												params: { slug: brand.slug },
												className: "flex min-w-0 flex-1 items-center gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {
													name: brand.name,
													url: brand.signedLogoUrl ?? brand.logo_url,
													className: "size-9 shrink-0 rounded-lg text-xs"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "truncate font-display text-sm font-bold text-foreground group-hover:text-primary",
															children: brand.name
														}), brand.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "h-3.5 w-3.5 shrink-0 text-primary" })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "truncate text-[11px] text-muted-foreground",
														children: [
															countryFlag(bCountry),
															" ",
															brandCategory(brand.name, brand.category)
														]
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												title: trend === "up" ? `${trust}% trust score · Sentiment trending positively` : `${trust}% trust score · Sentiment trending negatively`,
												"aria-label": trend === "up" ? `Trust score ${trust} percent, trending positively` : `Trust score ${trust} percent, trending negatively`,
												className: cn("inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold", trust >= 75 ? "bg-emerald-500/15 text-emerald-500" : trust >= 50 ? "bg-amber-500/15 text-amber-500" : "bg-rose-500/15 text-rose-500"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [trust, "%"] }), trend === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
													className: "h-3 w-3 text-emerald-500 stroke-[2.75]",
													"aria-hidden": "true"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
													className: "h-3 w-3 text-rose-500 stroke-[2.75]",
													"aria-hidden": "true"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2.5 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setSelectedBrandSlug(isSelectedBrand ? null : brand.slug),
												className: cn("font-semibold transition-colors", isSelectedBrand ? "text-primary" : "text-muted-foreground hover:text-foreground"),
												children: isSelectedBrand ? "✓ Filtering posts" : "Filter feed posts"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/brands/$slug",
												params: { slug: brand.slug },
												className: "inline-flex items-center gap-0.5 font-bold text-foreground/80 hover:text-foreground hover:underline",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verdict" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3 w-3" })]
											})]
										})]
									}, brand.id);
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground",
								children: t("feed.noBrandsMatch", { defaultValue: "No brands match your current search filter." })
							})]
						}),
						resultScope !== "brands" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							verdictFilter === "stash" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-center justify-between rounded-xl border border-stash/30 bg-stash/10 px-4 py-2.5 text-xs font-semibold text-stash",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("feed.showingStashes", { defaultValue: "Showing Stashes of the Day — Brands and products with positive community momentum" }) })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-normal opacity-80",
									children: t("feed.sortedStashMargins", { defaultValue: "Sorted by highest stash margins" })
								})]
							}),
							verdictFilter === "trash" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-center justify-between rounded-xl border border-trash/30 bg-trash/10 px-4 py-2.5 text-xs font-semibold text-trash",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Recycle, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("feed.showingTrashes", { defaultValue: "Showing Trashes of the Day — Public complaints, issues, and calls for accountability" }) })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-normal opacity-80",
									children: t("feed.sortedTrashMargins", { defaultValue: "Sorted by highest trash margins" })
								})]
							}),
							feedLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: [
									0,
									1,
									2
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full rounded-2xl" }, item))
							}) : filteredFeed.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: filteredFeed.map((item) => {
									const bInfo = item.brandSlug ? brandSentimentBySlug.get(item.brandSlug) : void 0;
									const itemTrend = item.stashCount !== item.trashCount ? item.stashCount > item.trashCount ? "up" : "down" : bInfo?.trend;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, {
										item,
										brandTrustScore: bInfo?.trust ?? item.brandTrustScore,
										sentimentTrend: itemTrend,
										onChange: () => void refetch()
									}, item.id);
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-dashed border-border py-16 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Recycle, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-4 font-display text-lg font-semibold",
										children: t("feed.emptyTitle", { defaultValue: "No conversations found" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: t("feed.emptyBody", { defaultValue: "Try another country, category, or search term." })
									}),
									hasActiveFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: resetAllFilters,
										className: "mt-4 inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background transition hover:opacity-90",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }), t("feed.resetAllFilters", { defaultValue: "Reset all filters" })]
									})
								]
							})
						] })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "hidden lg:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sticky top-20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingHashtags, {})
						})
					})]
				})
			]
		})]
	});
}
//#endregion
export { Feed as component };
