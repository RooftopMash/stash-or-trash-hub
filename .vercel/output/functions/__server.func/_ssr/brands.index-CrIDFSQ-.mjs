import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as require_jsx_dev_runtime } from "../_libs/react.mjs";
import { E as Plus, H as Layers, S as Search, nt as Earth, wt as BadgeCheck } from "../_libs/lucide-react.mjs";
import { l as useAuth } from "./router-I-3x-i8y.mjs";
import { i as cn, t as Button } from "./label-1cB10GDW.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { c as Header, v as fetchBrands } from "./Header-E8juhbIs.mjs";
import { a as matchesCategory, i as categoryOptions, n as brandCategory, r as categoryClass } from "./categories-CjnOH3FO.mjs";
import { t as Skeleton } from "./skeleton-pwfjuIjm.mjs";
import { a as normalizeCountryCode, n as countryName, r as countryOptions } from "./geo-CLO0oqry.mjs";
import { i as matchesTier, n as getBrandTier, r as getTierInfo, t as BRAND_TIERS } from "./brandTiers-B_KPABqh.mjs";
import { t as BrandLogo } from "./BrandLogo-C_F3Yd2U.mjs";
import { t as Badge } from "./badge-DAskHgZn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brands.index-CrIDFSQ-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_dev_runtime = require_jsx_dev_runtime();
var _jsxFileName$1 = "/app/applet/src/components/BrandDirectory.tsx";
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
	if (!source) return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
		"aria-hidden": "true",
		className: cn("text-lg", className),
		children: "🌐"
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 36,
		columnNumber: 7
	}, this);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("img", {
		src: source,
		alt: "",
		className: cn("size-6 rounded-sm object-cover", className),
		onError: (event) => {
			event.currentTarget.style.display = "none";
		}
	}, void 0, false, {
		fileName: _jsxFileName$1,
		lineNumber: 41,
		columnNumber: 5
	}, this);
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
	const [query, setQuery] = (0, import_react.useState)("");
	const [countryCode, setCountryCode] = (0, import_react.useState)("ALL");
	const [category, setCategory] = (0, import_react.useState)("All categories");
	const [tier, setTier] = (0, import_react.useState)("All tiers");
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
		});
	}, [
		brands,
		category,
		countryCode,
		tier,
		query
	]);
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("section", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "text-xs font-bold uppercase tracking-[0.18em] text-primary",
								children: "Global directory"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 108,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
								className: "mt-1 font-display text-2xl font-bold",
								children: "Find a brand anywhere"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 111,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [
									"Browse ",
									countries.length,
									"+ countries and discover companies by origin."
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 112,
								columnNumber: 13
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 107,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Button, {
							onClick: () => navigate({ to: user ? "/brands/new" : "/auth" }),
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Plus, { "data-icon": "inline-start" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 117,
								columnNumber: 13
							}, this), " Add a brand"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 116,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 106,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-5 grid gap-3 lg:grid-cols-[1fr_280px]",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Search, { className: "size-4 text-muted-foreground" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 122,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "sr-only",
									children: "Search brands"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 123,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", {
									value: query,
									onChange: (event) => setQuery(event.target.value),
									placeholder: "Search brands, industries, or countries",
									className: "min-w-0 flex-1 bg-transparent text-sm outline-none"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 124,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 121,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", {
							className: "flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Earth, { className: "size-4 text-muted-foreground" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 132,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
									className: "sr-only",
									children: "Filter by country"
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 133,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", {
									value: countryCode,
									onChange: (event) => {
										setCountryCode(event.target.value);
										setCategory("All categories");
									},
									className: "min-w-0 flex-1 bg-transparent text-sm outline-none",
									children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: "ALL",
										children: "All countries"
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 142,
										columnNumber: 15
									}, this), countries.map((country) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", {
										value: country.cca2,
										children: [
											country.name.common,
											" (",
											country.cca2,
											")"
										]
									}, country.cca2, true, {
										fileName: _jsxFileName$1,
										lineNumber: 144,
										columnNumber: 17
									}, this))]
								}, void 0, true, {
									fileName: _jsxFileName$1,
									lineNumber: 134,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 131,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 120,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-4 flex gap-2 overflow-x-auto pb-1",
						children: categories.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setCategory(item),
							className: cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold", category === item ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"),
							children: item
						}, item, false, {
							fileName: _jsxFileName$1,
							lineNumber: 153,
							columnNumber: 13
						}, this))
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 151,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-3 flex items-center gap-2 overflow-x-auto border-t border-border pt-3 pb-1",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
							className: "flex shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Layers, { className: "size-3.5 text-primary" }, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 169,
								columnNumber: 13
							}, this), " Tier:"]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 168,
							columnNumber: 11
						}, this), BRAND_TIERS.map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							onClick: () => setTier(item),
							className: cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-colors", tier === item ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary/70 text-muted-foreground hover:text-foreground"),
							children: item
						}, item, false, {
							fileName: _jsxFileName$1,
							lineNumber: 172,
							columnNumber: 13
						}, this))]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 167,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-5 rounded-2xl border border-stash/20 bg-stash/5 p-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "font-semibold text-foreground",
							children: "Fair directory & competition standard"
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 187,
							columnNumber: 11
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
							className: "mt-1 leading-relaxed text-muted-foreground",
							children: "Every country is discoverable, and brands are classified across distinct business tiers (Global Titans, Industry Giants, National Champions, Emerging Challengers, Heritage Icons). No enterprise budget can crowd out local artisans or emerging innovators."
						}, void 0, false, {
							fileName: _jsxFileName$1,
							lineNumber: 188,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName$1,
						lineNumber: 186,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 105,
				columnNumber: 7
			}, this),
			countriesQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					1,
					2,
					3,
					4,
					5,
					6
				].map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "h-48 rounded-2xl" }, item, false, {
					fileName: _jsxFileName$1,
					lineNumber: 196,
					columnNumber: 13
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 194,
				columnNumber: 9
			}, this) : filtered.length ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: filtered.map((brand) => {
					const code = normalizeCountryCode(brand.country);
					const country = code ? countryMap.get(code) : void 0;
					const domain = logoDomain(brand);
					return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, {
						to: "/brands/$slug",
						params: { slug: brand.slug },
						className: "group flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandLogo, {
								name: brand.name,
								url: brand.signedLogoUrl ?? (domain ? `https://logo.clearbit.com/${domain}` : null),
								className: "size-14 rounded-2xl text-lg"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 213,
								columnNumber: 19
							}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Flag$1, {
								country,
								className: "size-8"
							}, void 0, false, {
								fileName: _jsxFileName$1,
								lineNumber: 220,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 212,
							columnNumber: 17
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", {
									className: "truncate font-display text-lg font-bold",
									children: brand.name
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 224,
									columnNumber: 21
								}, this), brand.verified && /* @__PURE__ */ (void 0)(BadgeCheck, { className: "size-4 shrink-0 text-primary" }, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 225,
									columnNumber: 40
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 223,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
								className: "mt-2 flex flex-wrap items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Badge, {
									variant: "secondary",
									className: cn("text-[10px]", categoryClass(brandCategory(brand.name, brand.category))),
									children: brandCategory(brand.name, brand.category)
								}, void 0, false, {
									fileName: _jsxFileName$1,
									lineNumber: 228,
									columnNumber: 21
								}, this), (() => {
									const bTier = getBrandTier(brand.name, brand.category);
									const tierInfo = getTierInfo(bTier);
									return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: cn("inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium leading-none", tierInfo.badgeClass),
										children: tierInfo.shortName
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 241,
										columnNumber: 25
									}, this);
								})()]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 227,
								columnNumber: 19
							}, this),
							/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
								className: "mt-3 flex items-center gap-2 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Flag$1, { country: true }, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 253,
										columnNumber: 21
									}, this),
									country?.name.common ?? countryName(code) ?? "Global",
									/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", {
										className: "text-xs",
										children: code
									}, void 0, false, {
										fileName: _jsxFileName$1,
										lineNumber: 255,
										columnNumber: 21
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName$1,
								lineNumber: 252,
								columnNumber: 19
							}, this)
						] }, void 0, true, {
							fileName: _jsxFileName$1,
							lineNumber: 222,
							columnNumber: 17
						}, this)]
					}, brand.id, true, {
						fileName: _jsxFileName$1,
						lineNumber: 206,
						columnNumber: 15
					}, this);
				})
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 200,
				columnNumber: 9
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-2xl border border-dashed border-border py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Earth, { className: "mx-auto size-8 text-muted-foreground" }, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 264,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-3 font-display font-semibold",
						children: "No brands match these filters"
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 265,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Try another country, category, or search term."
					}, void 0, false, {
						fileName: _jsxFileName$1,
						lineNumber: 266,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName$1,
				lineNumber: 263,
				columnNumber: 9
			}, this),
			countriesQuery.isError && /* @__PURE__ */ (void 0)("p", {
				className: "text-xs text-muted-foreground",
				children: "Country data could not be refreshed, so a starter country list is being shown."
			}, void 0, false, {
				fileName: _jsxFileName$1,
				lineNumber: 272,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName$1,
		lineNumber: 104,
		columnNumber: 5
	}, this);
}
var _jsxFileName = "/app/applet/src/routes/brands.index.tsx?tsr-split=component";
function BrandsPage() {
	const { t } = useTranslation();
	const { user } = useAuth();
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["brands"],
		queryFn: fetchBrands,
		retry: 1
	});
	return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Header, {}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 25,
			columnNumber: 40
		}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", {
			className: "mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:py-10",
			children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", {
				className: "font-display text-3xl font-extrabold sm:text-4xl",
				children: t("brand.title")
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 25,
				columnNumber: 130
			}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
				className: "mt-2 max-w-2xl text-muted-foreground",
				children: t("brand.subtitle")
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 25,
				columnNumber: 218
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 25,
				columnNumber: 125
			}, this), isLoading ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					1,
					2,
					3,
					4,
					5,
					6
				].map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Skeleton, { className: "h-48 rounded-2xl" }, item, false, {
					fileName: _jsxFileName,
					lineNumber: 25,
					columnNumber: 404
				}, this))
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 25,
				columnNumber: 314
			}, this) : isError ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
				className: "rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", {
						className: "font-display text-xl font-bold",
						children: "The brand directory is temporarily unavailable"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 25,
						columnNumber: 572
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", {
						className: "mx-auto mt-2 max-w-lg text-sm text-muted-foreground",
						children: "We could not load live brand records. Try again, or continue with the public catalog while the service recovers."
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 25,
						columnNumber: 670
					}, this),
					/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", {
						className: "mt-5 flex justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", {
							type: "button",
							onClick: () => refetch(),
							className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
							children: "Try again"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 25,
							columnNumber: 901
						}, this), /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("a", {
							href: "/",
							className: "rounded-md border border-input px-4 py-2 text-sm font-medium",
							children: "Go home"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 25,
							columnNumber: 1055
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 25,
						columnNumber: 853
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 25,
				columnNumber: 477
			}, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(BrandDirectory, {
				brands: data ?? [],
				user
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 25,
				columnNumber: 1166
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 25,
			columnNumber: 50
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 25,
		columnNumber: 10
	}, this);
}
//#endregion
export { BrandsPage as component };
