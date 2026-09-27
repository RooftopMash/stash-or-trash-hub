import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as cn, n as Button, o as useAuth } from "./label-BlRLLIBM.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Search, Gt as BadgeCheck, R as Plus, Z as LoaderCircle, bt as Earth, j as Scan, nt as Layers, x as Sparkles, xt as Download } from "../_libs/lucide-react.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { A as Badge, O as ProductScannerModal, W as fetchBrands, _ as categoryClass, _t as countryOptions, at as SUPPORTED_IMPORT_COUNTRIES, b as Skeleton, d as getBrandTier, f as getTierInfo, g as brandCategory, gt as countryName, l as BRAND_TIERS, p as matchesTier, u as compareBrandTiers, ut as publishBrandsFromWikidata, v as categoryOptions, x as Header, y as matchesCategory, yt as normalizeCountryCode } from "./router-BjpvJuyR.mjs";
import { t as BrandLogo } from "./BrandLogo-Nd6kylYm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brands.index-C-aYxtdu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fallbackCountries = countryOptions([]).map((cca2) => ({
	cca2,
	name: { common: countryName(cca2) },
	flags: {}
}));
async function fetchCountries() {
	const response = await fetch("https://restcountries.com/v3.1/all?fields=cca2,name,flags");
	if (!response.ok) throw new Error("Country service unavailable");
	return response.json();
}
function Flag$1({ country, className }) {
	const flags = country?.flags;
	const source = flags?.svg ?? flags?.png;
	if (!source) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": "true",
		className: cn("text-lg", className),
		children: "🌐"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: source,
		alt: "",
		className: cn("size-6 rounded-sm object-cover", className),
		onError: (event) => {
			event.currentTarget.style.display = "none";
		}
	});
}
function logoDomain(brand) {
	if (brand.website) try {
		return new URL(brand.website.startsWith("http") ? brand.website : `https://${brand.website}`).hostname;
	} catch {
		return null;
	}
	return null;
}
function BrandDirectory({ brands, user }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [scannerOpen, setScannerOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [countryCode, setCountryCode] = (0, import_react.useState)("ALL");
	const [category, setCategory] = (0, import_react.useState)("All categories");
	const [tier, setTier] = (0, import_react.useState)("All tiers");
	const [sortBy, setSortBy] = (0, import_react.useState)("tier");
	const [sourcingCountry, setSourcingCountry] = (0, import_react.useState)("ZA");
	const [sourcing, setSourcing] = (0, import_react.useState)(false);
	const handleSourceCountryBrands = async (targetCountry, searchKeyword) => {
		const code = (targetCountry && targetCountry !== "ALL" ? targetCountry : sourcingCountry).toUpperCase();
		setSourcing(true);
		try {
			const ownerId = user?.id ?? "admin-wikidata-importer";
			const res = await publishBrandsFromWikidata({
				countryCode: code,
				limit: 40,
				ownerId,
				searchQuery: searchKeyword?.trim() || void 0
			});
			await queryClient.invalidateQueries({ queryKey: ["brands"] });
			await queryClient.invalidateQueries({ queryKey: ["local-brands"] });
			setCountryCode(code);
			toast.success(res.published > 0 ? `Sourced ${res.published} brands for ${countryName(code) || code} (${res.sourceSummary ?? "Wikidata"}).` : `Loaded verified ${countryName(code) || code} brands (${res.skipped} already in directory).`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not source brands for country.");
		} finally {
			setSourcing(false);
		}
	};
	const countriesQuery = useQuery({
		queryKey: ["countries"],
		queryFn: fetchCountries,
		staleTime: 864e5,
		retry: 1
	});
	const countries = countriesQuery.data?.filter((item) => item.cca2).sort((a, b) => a.name.common.localeCompare(b.name.common)) ?? fallbackCountries;
	const countryMap = (0, import_react.useMemo)(() => new Map(countries.map((country) => [country.cca2, country])), [countries]);
	const categories = (0, import_react.useMemo)(() => categoryOptions(brands.map((brand) => brandCategory(brand.name, brand.category))), [brands]);
	const filtered = (0, import_react.useMemo)(() => {
		const term = query.trim().toLowerCase();
		return brands.filter((brand) => {
			const code = normalizeCountryCode(brand.country);
			const brandTier = getBrandTier(brand.name, brand.category);
			const text = `${brand.name} ${brand.category ?? ""} ${countryName(code)} ${brandTier}`.toLowerCase();
			return (!term || text.includes(term)) && (countryCode === "ALL" || code === countryCode) && matchesCategory(brandCategory(brand.name, brand.category), category) && (tier === "All tiers" || matchesTier(brandTier, tier));
		}).sort((a, b) => {
			if (sortBy === "tier") {
				const tierComp = compareBrandTiers(getBrandTier(a.name, a.category), getBrandTier(b.name, b.category));
				if (tierComp !== 0) return tierComp;
				return (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0);
			}
			if (sortBy === "trust") return (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0);
			return a.name.localeCompare(b.name);
		});
	}, [
		brands,
		category,
		countryCode,
		tier,
		query,
		sortBy
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-bold uppercase tracking-[0.18em] text-primary",
								children: "Global directory"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-2xl font-bold",
								children: "Find a brand anywhere"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [
									"Browse ",
									countries.length,
									"+ countries and discover companies by origin."
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => setScannerOpen(true),
								className: "gap-1.5 border-primary/30 text-primary hover:bg-primary/5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scan, { className: "size-4" }), " Scan Product / QR"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => navigate({ to: user ? "/brands/new" : "/auth" }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { "data-icon": "inline-start" }), " Add a brand"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-3 lg:grid-cols-[1fr_280px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Search brands"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: query,
									onChange: (event) => setQuery(event.target.value),
									placeholder: "Search brands, industries, or countries",
									className: "min-w-0 flex-1 bg-transparent text-sm outline-none"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "size-4 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Filter by country"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: countryCode,
									onChange: (event) => {
										setCountryCode(event.target.value);
										setCategory("All categories");
									},
									className: "min-w-0 flex-1 bg-transparent text-sm outline-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ALL",
										children: "All countries"
									}), countries.map((country) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: country.cca2,
										children: [
											country.name.common,
											" (",
											country.cca2,
											")"
										]
									}, country.cca2))]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex gap-2 overflow-x-auto pb-1",
						children: categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCategory(item),
							className: cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold", category === item ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"),
							children: item
						}, item))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 overflow-x-auto pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-3.5 text-primary" }), " Tier:"]
							}), BRAND_TIERS.map((item) => {
								const info = item !== "All tiers" ? getTierInfo(item) : null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setTier(item),
									className: cn("flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors", tier === item ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary/70 text-muted-foreground hover:text-foreground"),
									children: [info?.pricePoint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] opacity-75",
										children: info.pricePoint
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
								}, item);
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-muted-foreground",
								children: "Sort:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: sortBy,
								onChange: (e) => setSortBy(e.target.value),
								className: "rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "tier",
										children: "By Tier (Luxury → Budget)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "trust",
										children: "Highest Trust Score"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "name",
										children: "Brand Name (A-Z)"
									})
								]
							})]
						})]
					}),
					tier !== "All tiers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-xl border border-border/80 bg-secondary/30 p-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-foreground",
								children: [
									getTierInfo(tier).label,
									" (",
									getTierInfo(tier).pricePoint,
									"):"
								]
							}),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: getTierInfo(tier).description
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col gap-3 rounded-2xl border border-[#d6a928]/40 bg-slate-950/90 p-4 text-white sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#d6a928]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Global Brand Sourcing Engine · Wikidata + Country Atlas" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-slate-300",
								children: "Source and publish verified national & global brands from any country directly into the live directory."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: countryCode !== "ALL" ? countryCode : sourcingCountry,
								onChange: (e) => {
									setSourcingCountry(e.target.value);
									setCountryCode(e.target.value);
								},
								"aria-label": "Select country to source brands",
								className: "h-9 rounded-lg border border-[#d6a928]/40 bg-slate-900 px-2.5 text-xs font-semibold text-white outline-none",
								children: [SUPPORTED_IMPORT_COUNTRIES.map(([code, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: code,
									children: label
								}, code)), countries.filter((c) => !SUPPORTED_IMPORT_COUNTRIES.some(([sc]) => sc === c.cca2)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: c.cca2,
									children: [
										c.name.common,
										" (",
										c.cca2,
										")"
									]
								}, c.cca2))]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								disabled: sourcing,
								onClick: () => void handleSourceCountryBrands(countryCode !== "ALL" ? countryCode : sourcingCountry, query),
								className: "h-9 gap-1.5 bg-[#d6a928] font-bold text-slate-950 hover:bg-[#e5b935]",
								children: [sourcing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sourcing ? "Sourcing Brands..." : `Source ${countryName(countryCode !== "ALL" ? countryCode : sourcingCountry) || "Country"} Brands` })]
							})]
						})]
					})
				]
			}),
			countriesQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					1,
					2,
					3,
					4,
					5,
					6
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-2xl" }, item))
			}) : filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: filtered.map((brand) => {
					const code = normalizeCountryCode(brand.country);
					const country = code ? countryMap.get(code) : void 0;
					const domain = logoDomain(brand);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/brands/$slug",
						params: { slug: brand.slug },
						className: "group flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {
								name: brand.name,
								url: brand.signedLogoUrl ?? (domain ? `https://logo.clearbit.com/${domain}` : null),
								className: "size-14 rounded-2xl text-lg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag$1, {
								country,
								className: "size-8"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "truncate font-display text-lg font-bold",
									children: brand.name
								}), brand.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "size-4 shrink-0 text-primary" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: cn("text-[10px]", categoryClass(brandCategory(brand.name, brand.category))),
									children: brandCategory(brand.name, brand.category)
								}), (() => {
									const bTier = getBrandTier(brand.name, brand.category);
									const tierInfo = getTierInfo(bTier);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold leading-none", tierInfo.badgeClass),
										title: `${tierInfo.name} (${tierInfo.pricePoint}): ${tierInfo.description}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[9px] opacity-75",
											children: tierInfo.pricePoint
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tierInfo.shortName })]
									});
								})()]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2.5 flex items-center justify-between border-t border-border/50 pt-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-medium",
									children: "Barometer:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-foreground",
									children: [brand.trust_score ?? 0, "% Trust"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 flex items-center gap-2 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag$1, { country: true }),
									country?.name.common ?? countryName(code) ?? "Global",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: code
									})
								]
							})
						] })]
					}, brand.id);
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border py-16 text-center px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "mx-auto size-8 text-[#d6a928]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 font-display text-lg font-bold",
						children: ["No brands loaded yet for ", countryCode !== "ALL" ? countryName(countryCode) : "this filter"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"Pull live brands for ",
							countryCode !== "ALL" ? countryName(countryCode) : "any country",
							" from Wikidata & our Global Country Atlas in one click."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: sourcing,
							onClick: () => void handleSourceCountryBrands(countryCode !== "ALL" ? countryCode : sourcingCountry, query),
							className: "gap-1.5 bg-[#d6a928] font-bold text-slate-950 hover:bg-[#e5b935]",
							children: [sourcing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sourcing ? "Fetching from Wikidata..." : `Fetch ${countryCode !== "ALL" ? countryName(countryCode) : countryName(sourcingCountry)} Brands Now` })]
						}), countryCode !== "ALL" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setCountryCode("ALL"),
							children: "Show All Countries"
						})]
					})
				]
			}),
			countriesQuery.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Country data could not be refreshed, so a starter country list is being shown."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductScannerModal, {
				open: scannerOpen,
				onOpenChange: setScannerOpen
			})
		]
	});
}
function BrandsPage() {
	const { t } = useTranslation();
	const { user } = useAuth();
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["brands"],
		queryFn: fetchBrands,
		retry: 1
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-extrabold sm:text-4xl",
				children: t("brand.title")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-muted-foreground",
				children: t("brand.subtitle")
			})] }), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					1,
					2,
					3,
					4,
					5,
					6
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-2xl" }, item))
			}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-bold",
						children: "The brand directory is temporarily unavailable"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-lg text-sm text-muted-foreground",
						children: "We could not load live brand records. Try again, or continue with the public catalog while the service recovers."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => refetch(),
							className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
							children: "Try again"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/",
							className: "rounded-md border border-input px-4 py-2 text-sm font-medium",
							children: "Go home"
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandDirectory, {
				brands: data ?? [],
				user
			})]
		})]
	});
}
//#endregion
export { BrandsPage as component };
