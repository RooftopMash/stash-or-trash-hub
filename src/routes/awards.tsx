import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { fetchBrands } from "@/lib/brands";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  CalendarClock,
  CheckCircle2,
  Crown,
  Filter,
  Heart,
  Layers,
  Map,
  Search,
  Sparkles,
  TrendingUp,
  Trophy,
  Car,
  Utensils,
  Laptop,
  ShoppingBag,
  Shirt,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { brandCategory, categoryOptions } from "@/lib/categories";
import { countryName, countryOptions, normalizeCountryCode } from "@/lib/geo";
import { cn } from "@/lib/utils";
import { PeopleTrustFactorLink } from "@/components/PeopleTrustFactor";
import { BRAND_TIERS, type BrandTierFilter, getBrandTier, getTierInfo, matchesTier } from "@/lib/brandTiers";

export const Route = createFileRoute("/awards")({
  head: () => ({
    meta: [
      { title: "The SOT Awards | Stash Or Trash — The Brand Barometer" },
      {
        name: "description",
        content:
          "The annual SOT Awards crown the world's most trusted brands — decided entirely by real verdicts from real people. See the live leaderboard.",
      },
      { property: "og:title", content: "The SOT Awards — The People's Verdict, Made Official" },
      {
        property: "og:description",
        content:
          "The most trusted brands, crowned by the crowd. Explore the live leaderboard powering this year's SOT Awards.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AwardsPage,
});

type LeaderboardView = "industries" | "tiers" | "search";

export function AwardsPage() {
  const { t } = useTranslation();
  const { data: brands, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const [viewMode, setViewMode] = useState<LeaderboardView>("industries");
  const [country, setCountry] = useState("All countries");
  const [category, setCategory] = useState("All categories");
  const [tier, setTier] = useState<BrandTierFilter>("All tiers");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("Live season");
  const snapshotTime = useMemo(() => new Date(), []);

  const countries = useMemo(() => ["All countries", ...countryOptions((brands ?? []).map((brand) => brand.country))], [brands]);
  const categories = useMemo(() => categoryOptions((brands ?? []).map((brand) => brandCategory(brand.name, brand.category))), [brands]);

  // Scoped list
  const filteredBrands = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (brands ?? []).filter((brand) => {
      const normalizedCountry = normalizeCountryCode(brand.country);
      const normalizedCategory = brandCategory(brand.name, brand.category);
      const brandTier = getBrandTier(brand.name, brand.category);
      const searchable = `${brand.name} ${countryName(normalizedCountry)} ${normalizedCategory} ${brandTier}`.toLowerCase();
      return (country === "All countries" || normalizedCountry === country)
        && (category === "All categories" || normalizedCategory === category)
        && (tier === "All tiers" || matchesTier(brandTier, tier))
        && (!term || searchable.includes(term));
    }).sort((a, b) => (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0));
  }, [brands, category, country, tier, query]);

  const top = filteredBrands.slice(0, 15);
  const regionLabel = country === "All countries" ? "Global awards" : `${countryName(country)} awards`;

  // Industry sectors (guaranteeing food never competes with cars)
  const industrySectors = useMemo(() => {
    const sectors = [
      {
        id: "automotive",
        title: "Automotive & Mobility",
        icon: Car,
        description: "Passenger vehicles, mobility tech, and electric transport. Cars compete strictly with cars.",
        match: (cat: string) => cat.toLowerCase().includes("auto") || cat.toLowerCase().includes("cars") || cat.toLowerCase().includes("mobility"),
      },
      {
        id: "food",
        title: "Food, Grocery & Dining",
        icon: Utensils,
        description: "Restaurants, supermarkets, packaged staples, and beverage makers. Judged on taste, hygiene & value.",
        match: (cat: string) => cat.toLowerCase().includes("food") || cat.toLowerCase().includes("restaurant") || cat.toLowerCase().includes("staple") || cat.toLowerCase().includes("agriculture"),
      },
      {
        id: "tech",
        title: "Technology & Software",
        icon: Laptop,
        description: "Consumer electronics, personal computing, web platforms, and essential digital apps.",
        match: (cat: string) => cat.toLowerCase().includes("tech") || cat.toLowerCase().includes("software") || cat.toLowerCase().includes("telecom"),
      },
      {
        id: "retail",
        title: "Retail & E-Commerce",
        icon: ShoppingBag,
        description: "Department stores, online marketplaces, and home essentials providing reliable customer service.",
        match: (cat: string) => cat.toLowerCase().includes("retail") || cat.toLowerCase().includes("e-commerce") || cat.toLowerCase().includes("marketplace") || cat.toLowerCase().includes("store"),
      },
      {
        id: "fashion",
        title: "Fashion & Apparel",
        icon: Shirt,
        description: "Everyday streetwear, sports apparel, footwear, and bespoke attire.",
        match: (cat: string) => cat.toLowerCase().includes("fashion") || cat.toLowerCase().includes("apparel") || cat.toLowerCase().includes("clothing") || cat.toLowerCase().includes("beauty"),
      },
      {
        id: "finance",
        title: "Banking & Financial Services",
        icon: Building2,
        description: "Retail banking, fintech wallets, and insurance protecting consumer security.",
        match: (cat: string) => cat.toLowerCase().includes("bank") || cat.toLowerCase().includes("finance") || cat.toLowerCase().includes("insurance"),
      },
    ];

    return sectors.map((sec) => {
      const sectorBrands = (brands ?? []).filter((b) => {
        const cat = brandCategory(b.name, b.category);
        const matchesCountry = country === "All countries" || normalizeCountryCode(b.country) === country;
        return matchesCountry && sec.match(cat);
      }).sort((a, b) => (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0));

      return {
        ...sec,
        leaders: sectorBrands.slice(0, 4),
        totalCount: sectorBrands.length,
      };
    });
  }, [brands, country]);

  // Market Tiers (Luxury, Premium, Mass Market, Budget)
  const tierSegments = useMemo(() => {
    const tierKeys: ("Budget" | "Mass Market" | "Premium" | "Luxury")[] = ["Budget", "Mass Market", "Premium", "Luxury"];
    return tierKeys.map((tk) => {
      const info = getTierInfo(tk);
      const tierBrands = (brands ?? []).filter((b) => {
        const matchesCountry = country === "All countries" || normalizeCountryCode(b.country) === country;
        const bTier = getBrandTier(b.name, b.category);
        return matchesCountry && bTier === tk;
      }).sort((a, b) => (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0));

      return {
        tierKey: tk,
        info,
        leaders: tierBrands.slice(0, 5),
        totalCount: tierBrands.length,
      };
    });
  }, [brands, country]);

  const awardTypes = [
    { icon: Crown, title: t("awards.cat1") || "Most Trusted Brand", desc: t("awards.cat1d") || "Highest positive ratio of community verdicts" },
    { icon: Heart, title: t("awards.cat2") || "People's Champion", desc: t("awards.cat2d") || "Unmatched grassroots advocacy across social signals" },
    { icon: TrendingUp, title: t("awards.cat3") || "Biggest Turnaround", desc: t("awards.cat3d") || "Largest upward sentiment recovery post-crisis" },
    { icon: Sparkles, title: t("awards.cat4") || "Rising Star", desc: t("awards.cat4d") || "Fastest growing newcomer winning customer loyalty" },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Hero */}
        <section className="rounded-3xl border border-border bg-gradient-to-b from-secondary/60 to-card p-8 text-center shadow-sm">
          <Trophy className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">{t("awards.title") || "The SOT Awards"}</h1>
          <p className="mt-2 font-display text-lg font-semibold text-primary">
            {t("awards.tagline") || "The Brand Barometer — The People's Verdict, Made Official"}
          </p>
          <div className="mt-3 flex justify-center">
            <PeopleTrustFactorLink />
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground text-sm sm:text-base leading-relaxed">
            Every crown is decided purely by verifiable public consumer sentiment. Fair standards ensure
            like-for-like comparisons so food never competes with cars, and luxury conglomerates never overshadow budget champions.
          </p>

          {/* Standard Banner */}
          <div className="mt-6 mx-auto max-w-2xl rounded-2xl border border-primary/25 bg-primary/5 p-4 text-left">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Fair Directory & Competition Standard</span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
              Every country is discoverable, and brands are classified across defined market tiers (Luxury, Premium, Mass Market, Budget). Luxury maisons and premium tech giants never crowd out mass-market essentials or budget champions.
            </p>
          </div>
        </section>

        {/* View Mode Switcher */}
        <section className="mt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-display text-2xl font-bold">{t("awards.leaderboard") || "Annual Leaderboard"}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Classified competition standard: Explore sector-by-sector and tier-by-tier rankings.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-secondary/60 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("industries")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  viewMode === "industries"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                By Industry Sector
              </button>
              <button
                type="button"
                onClick={() => setViewMode("tiers")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  viewMode === "tiers"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                By Market Tier
              </button>
              <button
                type="button"
                onClick={() => setViewMode("search")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  viewMode === "search"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Custom Scoped Search
              </button>
            </div>
          </div>

          {/* Country & Period Filter Header */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-medium text-muted-foreground">
              <Map className="h-4 w-4 text-primary" />
              <span>Region:</span>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-bold text-foreground outline-none"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c === "All countries" ? "Global (All Countries)" : countryName(c)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <CalendarClock className="h-3.5 w-3.5 text-primary" />
              <span>{period}</span>
              <span>· Snapshot {snapshotTime.toLocaleDateString()}</span>
            </div>
          </div>

          {/* VIEW 1: BY INDUSTRY SECTORS (FOOD VS CARS SEPARATION) */}
          {viewMode === "industries" && (
            <div className="mt-6 space-y-6">
              <div className="rounded-xl border border-border/80 bg-card p-4 text-xs text-muted-foreground">
                <span className="font-bold text-foreground">Strict Vertical Segmentation: </span>
                Automotive brands compete exclusively against automotive mobility; food and dining compete against food. A fast-food chain never loses an award to a supercar atelier.
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {industrySectors.map((sector) => {
                  const Icon = sector.icon;
                  return (
                    <div key={sector.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <h3 className="font-display text-base font-bold">{sector.title}</h3>
                            <p className="text-[11px] text-muted-foreground">{sector.totalCount} nominated brands</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">{sector.description}</p>

                        <div className="space-y-2">
                          {sector.leaders.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-4 text-center">No nominees for this country yet.</p>
                          ) : (
                            sector.leaders.map((b, idx) => {
                              const bTier = getBrandTier(b.name, b.category);
                              const tInfo = getTierInfo(bTier);
                              return (
                                <Link
                                  key={b.id}
                                  to="/brands/$slug"
                                  params={{ slug: b.slug }}
                                  className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/30 px-3 py-2 text-xs transition-colors hover:bg-secondary"
                                >
                                  <div className="flex items-center gap-2.5 truncate">
                                    <span className="w-5 font-display font-extrabold text-muted-foreground text-center">
                                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}`}
                                    </span>
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-secondary font-bold text-[11px]">
                                      {b.signedLogoUrl ? (
                                        <img src={b.signedLogoUrl} alt={b.name} className="h-full w-full object-cover rounded" />
                                      ) : (
                                        b.name.charAt(0)
                                      )}
                                    </div>
                                    <div className="truncate">
                                      <p className="font-bold truncate text-foreground">{b.name}</p>
                                      <span className={cn("text-[9px] font-semibold border rounded px-1", tInfo.badgeClass)}>
                                        {tInfo.pricePoint} {tInfo.shortName}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 font-display font-bold text-stash shrink-0 ml-2">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>{b.trust_score}%</span>
                                  </div>
                                </Link>
                              );
                            })
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/50 text-right">
                        <Link
                          to="/brands"
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          View all in {sector.title} →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 2: BY MARKET TIERS (LUXURY, PREMIUM, MASS MARKET, BUDGET) */}
          {viewMode === "tiers" && (
            <div className="mt-6 space-y-6">
              <div className="rounded-xl border border-border/80 bg-card p-4 text-xs text-muted-foreground">
                <span className="font-bold text-foreground">Equal Stature Across Tiers: </span>
                Budget champions and everyday mass-market essentials are celebrated with equal prestige alongside luxury maisons and premium innovators.
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {tierSegments.map((segment) => {
                  return (
                    <div
                      key={segment.tierKey}
                      className={cn(
                        "rounded-2xl border bg-card p-4 shadow-sm flex flex-col justify-between",
                        segment.info.borderClass
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={cn("rounded-md border px-2 py-0.5 text-xs font-bold", segment.info.badgeClass)}>
                            {segment.info.pricePoint} {segment.tierKey}
                          </span>
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            {segment.totalCount} brands
                          </span>
                        </div>
                        <h3 className="font-display text-sm font-bold text-foreground">{segment.info.label}</h3>
                        <p className="text-[11px] text-muted-foreground mt-1 mb-4 leading-normal">{segment.info.description}</p>

                        <div className="space-y-2">
                          {segment.leaders.length === 0 ? (
                            <p className="text-xs text-muted-foreground py-4 text-center">No nominees yet.</p>
                          ) : (
                            segment.leaders.map((b, idx) => (
                              <Link
                                key={b.id}
                                to="/brands/$slug"
                                params={{ slug: b.slug }}
                                className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-2 text-xs transition-colors hover:bg-secondary"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="w-4 font-bold text-muted-foreground text-center text-[11px]">
                                    {idx + 1}
                                  </span>
                                  <div className="truncate">
                                    <p className="font-bold truncate text-foreground">{b.name}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{brandCategory(b.name, b.category)}</p>
                                  </div>
                                </div>
                                <span className="font-display font-extrabold text-stash shrink-0 ml-1 text-xs">
                                  {b.trust_score}%
                                </span>
                              </Link>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-2 border-t border-border/40 text-center">
                        <Link
                          to="/brands"
                          className="text-[11px] font-semibold text-primary hover:underline"
                        >
                          Explore all {segment.tierKey} →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 3: CUSTOM FILTERED SEARCH & DETAILED TABLE */}
          {viewMode === "search" && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px]">
                  <label className="flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search brands or industries"
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-medium outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as BrandTierFilter)}
                    className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-medium outline-none"
                  >
                    {BRAND_TIERS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                {isLoading ? (
                  <div className="space-y-px">
                    {[0, 1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-14 w-full rounded-none" />
                    ))}
                  </div>
                ) : top.length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">No brands match this scope.</p>
                ) : (
                  top.map((b, i) => {
                    const bTier = getBrandTier(b.name, b.category);
                    const tierInfo = getTierInfo(bTier);
                    return (
                      <Link
                        key={b.id}
                        to="/brands/$slug"
                        params={{ slug: b.slug }}
                        className="flex items-center gap-4 border-b border-border bg-card px-4 py-3 transition-colors last:border-0 hover:bg-secondary/50"
                      >
                        <span className="w-8 text-center font-display text-lg font-extrabold text-muted-foreground">
                          {i < 3 ? ["1st", "2nd", "3rd"][i] : i + 1}
                        </span>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary text-sm font-bold">
                          {b.signedLogoUrl ? (
                            <img src={b.signedLogoUrl} alt={b.name} className="h-full w-full object-cover" />
                          ) : (
                            b.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="flex-1 truncate font-semibold">
                          <span className="flex items-center gap-2">
                            <span className="truncate">{b.name}</span>
                            <span
                              className={cn(
                                "hidden sm:inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold leading-none",
                                tierInfo.badgeClass
                              )}
                            >
                              <span className="font-mono text-[9px] opacity-75">{tierInfo.pricePoint}</span>
                              <span>{tierInfo.shortName}</span>
                            </span>
                          </span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {countryName(normalizeCountryCode(b.country))} · {brandCategory(b.name, b.category)}
                          </span>
                        </span>
                        <span className="flex items-center gap-1.5 font-display font-extrabold text-stash">
                          <TrendingUp className="h-4 w-4" />
                          {b.trust_score}%
                        </span>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Standard Explainer Footer */}
          <div className="mt-8 rounded-2xl border border-stash/20 bg-stash/5 p-5">
            <h3 className="font-display text-lg font-bold">Our Fairness and Accuracy Standard</h3>
            <div className="mt-3 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <p>
                <strong className="text-foreground">Category Separation.</strong> Food products and supermarkets never compete against automotive brands or tech giants. Every industry has dedicated recognition.
              </p>
              <p>
                <strong className="text-foreground">Tiered Competition.</strong> Brands are classified across defined market tiers (Luxury, Premium, Mass Market, Budget). Luxury maisons and tech titans never crowd out mass-market essentials or budget champions.
              </p>
              <p>
                <strong className="text-foreground">Universal Discoverability.</strong> Every country is discoverable, and local independent brands compete on a level playing field within their own scope.
              </p>
              <p>
                <strong className="text-foreground">Evidence Before Authority.</strong> Rankings are an honest community signal powered by direct user verdicts, timestamped and transparently auditable.
              </p>
            </div>
          </div>
        </section>

        {/* Ceremony Process */}
        <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="font-display text-xl font-bold">The Road to the Live Ceremony</h2>
              <p className="mt-1 text-sm text-muted-foreground">A transparent process built from real-time community verdicts.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {["Nominees open", "Public voting", "Snapshot locked", "Live ceremony"].map((stage, index) => (
              <div key={stage} className="rounded-2xl border border-border p-4">
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", index === 0 ? "bg-stash text-stash-foreground" : "bg-secondary text-muted-foreground")}>{index + 1}</div>
                <p className="mt-3 font-display text-sm font-bold">{stage}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{index === 0 ? "Live now across each market and category." : index === 1 ? "Community verdicts will decide the shortlist." : index === 2 ? "Scores freeze with an auditable timestamp." : "Winners are celebrated in the real world."}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Awards categories */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">{t("awards.categoryTitle") || "Official Award Categories"}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {awardTypes.map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-card p-5">
                <c.icon className="h-7 w-7 text-primary" />
                <h3 className="mt-3 font-display text-lg font-bold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-10 rounded-3xl border border-border bg-card p-8 text-center">
          <Award className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-3 font-display text-2xl font-bold">{t("awards.cta") || "Make Your Verdict Count"}</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">{t("awards.ctaNote") || "Every vote influences the annual standings."}</p>
          <Link
            to="/brands"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("nav.brands") || "Explore Brand Directory"}
          </Link>
        </section>
      </main>
    </div>
  );
}
