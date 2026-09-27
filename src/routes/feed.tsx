import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Recycle,
  Coins,
  X,
  BadgeCheck,
  Globe2,
  Building2,
  FileText,
  Layers,
  Filter,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  Video,
  Radio,
  Phone,
} from "lucide-react";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { BrandLogo } from "@/components/BrandLogo";
import { LocationAwareFeed } from "@/components/LocationAwareFeed";
import { TrendingHashtags } from "@/components/TrendingHashtags";
import { LiveBroadcastModal } from "@/components/LiveBroadcastModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { fetchFeed } from "@/lib/stash";
import { fetchBrands } from "@/lib/brands";
import { brandCategory, categoryOptions, matchesCategory } from "@/lib/categories";
import { countryFlag, countryName, countryOptions, normalizeCountryCode } from "@/lib/geo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/feed")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { filter?: "all" | "stash" | "trash"; q?: string; brand?: string } => ({
    filter:
      search.filter === "stash" || search.filter === "trash" || search.filter === "all"
        ? (search.filter as "all" | "stash" | "trash")
        : undefined,
    q: typeof search.q === "string" && search.q.trim() ? search.q : undefined,
    brand: typeof search.brand === "string" && search.brand.trim() ? search.brand : undefined,
  }),
  component: Feed,
});

function Feed() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const search = Route.useSearch();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [verdictFilter, setVerdictFilter] = useState<"all" | "stash" | "trash">(
    search.filter ?? "all",
  );
  const [query, setQuery] = useState(search.q ?? "");
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string | null>(search.brand ?? null);
  const [selectedCountry, setSelectedCountry] = useState("ZA");
  const [searchAllCountries, setSearchAllCountries] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [resultScope, setResultScope] = useState<"all" | "brands" | "posts">("all");
  const [showAllMatchingBrands, setShowAllMatchingBrands] = useState(false);
  const [feedBroadcastOpen, setFeedBroadcastOpen] = useState(false);

  useEffect(() => {
    if (search.filter) {
      setVerdictFilter(search.filter);
    }
    if (typeof search.q === "string") {
      setQuery(search.q);
    }
    if (typeof search.brand === "string") {
      setSelectedBrandSlug(search.brand);
    }
  }, [search.filter, search.q, search.brand]);

  // Press "/" to focus the top search bar quickly
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        !(document.activeElement as HTMLElement | null)?.isContentEditable
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const { data: feedData, isLoading: feedLoading, refetch } = useQuery({
    queryKey: ["feed", user?.id ?? "anon"],
    queryFn: () => fetchFeed(user?.id ?? null),
  });

  const { data: brandsData, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const isSearching = query.trim().length > 0;

  const countries = useMemo(() => {
    const feedCountries = (feedData ?? []).map((item) => item.brandCountry);
    const brandCountries = (brandsData ?? []).map((brand) => brand.country);
    return countryOptions([...feedCountries, ...brandCountries]);
  }, [feedData, brandsData]);

  // Country-scoped posts (or all countries when searching with global toggle enabled)
  const countryScopedFeed = useMemo(() => {
    const allItems = feedData ?? [];
    if (isSearching && searchAllCountries) {
      return allItems;
    }
    return allItems.filter(
      (item) => normalizeCountryCode(item.brandCountry) === selectedCountry,
    );
  }, [feedData, selectedCountry, isSearching, searchAllCountries]);

  // Country-scoped brands (or all countries when searching with global toggle enabled)
  const countryScopedBrands = useMemo(() => {
    const allBrands = brandsData ?? [];
    if (isSearching && searchAllCountries) {
      return allBrands;
    }
    return allBrands.filter(
      (brand) => normalizeCountryCode(brand.country) === selectedCountry,
    );
  }, [brandsData, selectedCountry, isSearching, searchAllCountries]);

  const categories = useMemo(() => {
    const postCats = countryScopedFeed.map((item) =>
      brandCategory(item.brandName, item.category),
    );
    const brandCats = countryScopedBrands.map((brand) =>
      brandCategory(brand.name, brand.category),
    );
    return categoryOptions([...postCats, ...brandCats]);
  }, [countryScopedFeed, countryScopedBrands]);

  // Real-time filtered brands as the user types
  const filteredBrands = useMemo(() => {
    const term = query.trim().toLowerCase();
    return countryScopedBrands
      .filter((brand) => {
        const category = brandCategory(brand.name, brand.category);
        const cCode = normalizeCountryCode(brand.country);
        const cName = countryName(cCode);
        const searchable =
          `${brand.name} ${brand.slug} ${brand.description ?? ""} ${category} ${cCode} ${cName}`.toLowerCase();
        const matchesSearch = !term || searchable.includes(term);
        const matchesCat = matchesCategory(category, selectedCategory);
        const matchesSelectedBrand =
          !selectedBrandSlug || brand.slug === selectedBrandSlug;
        return matchesSearch && matchesCat && matchesSelectedBrand;
      })
      .sort((a, b) => {
        if (term) {
          const aStarts = a.name.toLowerCase().startsWith(term) ? 1 : 0;
          const bStarts = b.name.toLowerCase().startsWith(term) ? 1 : 0;
          if (aStarts !== bStarts) return bStarts - aStarts;
        }
        return (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0);
      });
  }, [countryScopedBrands, query, selectedCategory, selectedBrandSlug]);

  const stashCountTotal = useMemo(
    () =>
      countryScopedFeed.filter(
        (item) =>
          (item.stashCount || 0) >= (item.trashCount || 0) && (item.stashCount || 0) > 0,
      ).length,
    [countryScopedFeed],
  );

  const trashCountTotal = useMemo(
    () =>
      countryScopedFeed.filter(
        (item) =>
          (item.trashCount || 0) >= (item.stashCount || 0) && (item.trashCount || 0) > 0,
      ).length,
    [countryScopedFeed],
  );

  // Real-time filtered posts as the user types
  const filteredFeed = useMemo(() => {
    const term = query.trim().toLowerCase();
    return countryScopedFeed
      .filter((item) => {
        const category = brandCategory(item.brandName, item.category);
        const cCode = normalizeCountryCode(item.brandCountry);
        const cName = countryName(cCode);
        const searchable =
          `${item.title} ${item.description ?? ""} ${item.brandName ?? ""} ${item.brandSlug ?? ""} ${category} ${item.authorName ?? ""} ${cCode} ${cName}`.toLowerCase();
        const matchesSearch = !term || searchable.includes(term);
        const matchesCat = matchesCategory(category, selectedCategory);
        const matchesSelectedBrand =
          !selectedBrandSlug ||
          item.brandSlug === selectedBrandSlug ||
          (item.brandName &&
            item.brandName.toLowerCase() ===
              selectedBrandSlug.replace(/-/g, " ").toLowerCase());

        let matchesVerdict = true;
        if (verdictFilter === "stash") {
          matchesVerdict =
            (item.stashCount || 0) >= (item.trashCount || 0) &&
            (item.stashCount || 0) > 0;
        } else if (verdictFilter === "trash") {
          matchesVerdict =
            (item.trashCount || 0) >= (item.stashCount || 0) &&
            (item.trashCount || 0) > 0;
        }

        return matchesSearch && matchesCat && matchesSelectedBrand && matchesVerdict;
      })
      .sort((a, b) => {
        if (verdictFilter === "stash") {
          return (
            (b.stashCount || 0) -
            (b.trashCount || 0) -
            ((a.stashCount || 0) - (a.trashCount || 0))
          );
        }
        if (verdictFilter === "trash") {
          return (
            (b.trashCount || 0) -
            (b.stashCount || 0) -
            ((a.trashCount || 0) - (a.stashCount || 0))
          );
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [
    countryScopedFeed,
    query,
    selectedCategory,
    selectedBrandSlug,
    verdictFilter,
  ]);

  const activeBrandObj = useMemo(
    () =>
      selectedBrandSlug
        ? (brandsData ?? []).find((b) => b.slug === selectedBrandSlug) ?? null
        : null,
    [brandsData, selectedBrandSlug],
  );

  // Compute sentiment trend ("up" or "down") and trust score for each brand in the feed
  const brandSentimentBySlug = useMemo(() => {
    const map = new Map<
      string,
      { stash: number; trash: number; trust: number; trend: "up" | "down" }
    >();
    for (const brand of brandsData ?? []) {
      const trust = Number(brand.trust_score) || 0;
      map.set(brand.slug, {
        stash: 0,
        trash: 0,
        trust,
        trend: trust >= 60 ? "up" : "down",
      });
    }
    for (const item of feedData ?? []) {
      const slug = item.brandSlug;
      if (!slug) continue;
      const existing = map.get(slug) ?? {
        stash: 0,
        trash: 0,
        trust: typeof item.brandTrustScore === "number" ? item.brandTrustScore : 70,
        trend: "up" as const,
      };
      existing.stash += item.stashCount || 0;
      existing.trash += item.trashCount || 0;
      if (existing.stash !== existing.trash) {
        existing.trend = existing.stash > existing.trash ? "up" : "down";
      } else {
        existing.trend = existing.trust >= 60 ? "up" : "down";
      }
      map.set(slug, existing);
    }
    return map;
  }, [brandsData, feedData]);

  const visibleBrands = useMemo(() => {
    if (resultScope === "brands" || showAllMatchingBrands) {
      return filteredBrands.slice(0, 24);
    }
    if (isSearching) {
      return filteredBrands.slice(0, 8);
    }
    return filteredBrands.slice(0, 6);
  }, [filteredBrands, resultScope, showAllMatchingBrands, isSearching]);

  const hasActiveFilters =
    isSearching ||
    selectedCategory !== "All categories" ||
    verdictFilter !== "all" ||
    selectedBrandSlug !== null;

  const resetAllFilters = () => {
    setQuery("");
    setSelectedCategory("All categories");
    setVerdictFilter("all");
    setSelectedBrandSlug(null);
    setResultScope("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onPosted={() => void refetch()} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stash">
              {t("feed.pulse", { defaultValue: "Community pulse" })}
            </p>
            <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">
              {t("feed.title", { defaultValue: "Stash Or Trash" })}
            </h1>
            <p className="mt-2 max-w-3xl text-lg font-semibold leading-7 text-foreground">
              {t("feed.subtitle", {
                defaultValue:
                  "The Brand Barometer. Post anything about a brand and let the community deliver its verdict in real time — the CX & PR signal that matters.",
              })}
            </p>
            <p className="mt-1.5 max-w-2xl text-muted-foreground">
              {t("feed.hook", {
                defaultValue:
                  "Every verdict brings brands closer to the people they serve. Cast yours.",
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => setFeedBroadcastOpen(true)}
              className="gap-1.5 bg-rose-600 text-white hover:bg-rose-700 font-bold shadow-sm"
            >
              <Video className="h-4 w-4" />
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              Video Cam / Broadcast Situation
            </Button>
            <Button
              size="sm"
              variant="outline"
              asChild
              className="gap-1.5 border-emerald-500/40 bg-emerald-500/10 font-bold text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400"
            >
              <Link to="/messages">
                <Phone className="h-3.5 w-3.5" /> Call Users / Brands (Messages)
              </Link>
            </Button>
          </div>
        </div>

        {/* PROMINENT REAL-TIME SEARCH BAR AT THE TOP OF THE FEED */}
        <section
          aria-label="Real-time brand and post search"
          className="mb-6 rounded-2xl border-2 border-border bg-card p-4 shadow-sm transition-colors focus-within:border-foreground/50"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("feed.realtimeSearchPlaceholder", {
                  defaultValue:
                    "Search brands, posts, categories, or keywords in real time...",
                })}
                aria-label={t("feed.searchPlaceholder", {
                  defaultValue: "Search posts or brands",
                })}
                className="h-12 w-full rounded-xl border border-border bg-background pr-24 pl-11 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-foreground"
              />
              <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-secondary/80 hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>{t("common.clear", { defaultValue: "Clear" })}</span>
                  </button>
                ) : (
                  <kbd className="hidden rounded border border-border bg-secondary/70 px-2 py-0.5 font-mono text-[11px] font-semibold text-muted-foreground sm:inline-block">
                    /
                  </kbd>
                )}
              </div>
            </div>

            {/* Real-time Result Scope Tabs (All / Brands / Posts) */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setResultScope("all")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition",
                  resultScope === "all"
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>{t("feed.allResults", { defaultValue: "All" })}</span>
                <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-[10px]">
                  {filteredBrands.length + filteredFeed.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setResultScope("brands")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition",
                  resultScope === "brands"
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>{t("nav.brands", { defaultValue: "Brands" })}</span>
                <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-[10px]">
                  {filteredBrands.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setResultScope("posts")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition",
                  resultScope === "posts"
                    ? "bg-foreground text-background shadow-xs"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{t("feed.posts", { defaultValue: "Posts" })}</span>
                <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-[10px]">
                  {filteredFeed.length}
                </span>
              </button>
            </div>
          </div>

          {/* Live status & Global Search toggle bar */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <span>
                {isSearching ? (
                  <>
                    {t("feed.liveFiltering", { defaultValue: "Live results for" })}{" "}
                    <strong className="text-foreground">“{query.trim()}”</strong>:{" "}
                    <strong className="text-foreground">{filteredBrands.length}</strong>{" "}
                    {filteredBrands.length === 1 ? "brand" : "brands"} &{" "}
                    <strong className="text-foreground">{filteredFeed.length}</strong>{" "}
                    {filteredFeed.length === 1 ? "post" : "posts"}
                  </>
                ) : (
                  <>
                    {t("feed.showingSummary", { defaultValue: "Showing" })}{" "}
                    <strong className="text-foreground">{filteredBrands.length}</strong>{" "}
                    {t("nav.brands", { defaultValue: "brands" }).toLowerCase()} &{" "}
                    <strong className="text-foreground">{filteredFeed.length}</strong>{" "}
                    {t("feed.posts", { defaultValue: "posts" }).toLowerCase()} in{" "}
                    <strong className="text-foreground">
                      {countryFlag(selectedCountry)} {countryName(selectedCountry)}
                    </strong>
                  </>
                )}
              </span>

              {activeBrandObj && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">
                  <Filter className="h-3 w-3" />
                  Brand: {activeBrandObj.name}
                  <button
                    type="button"
                    onClick={() => setSelectedBrandSlug(null)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
                    aria-label="Remove brand filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isSearching && (
                <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
                  <input
                    type="checkbox"
                    checked={searchAllCountries}
                    onChange={(e) => setSearchAllCountries(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border accent-foreground"
                  />
                  <Globe2 className="h-3.5 w-3.5" />
                  <span>
                    {t("feed.searchAllCountries", {
                      defaultValue: "Search across all countries",
                    })}
                  </span>
                </label>
              )}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  {t("feed.resetAllFilters", { defaultValue: "Reset all filters" })}
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            {/* Country, Category & Verdict Filter Controls */}
            <section className="mb-5 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <LocationAwareFeed
                  selectedCountry={selectedCountry}
                  availableCountries={countries}
                  onCountryChange={(country) => {
                    setSelectedCountry(country);
                    setSelectedCategory("All categories");
                  }}
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>
                    {countryScopedBrands.length} {t("nav.brands", { defaultValue: "Brands" })} ·{" "}
                    {countryScopedFeed.length} {t("feed.posts", { defaultValue: "Posts" })}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                      selectedCategory === category
                        ? "bg-foreground text-background"
                        : "bg-secondary text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setVerdictFilter("all")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
                      verdictFilter === "all"
                        ? "bg-foreground text-background shadow-xs"
                        : "bg-secondary text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t("feed.allVerdicts", { defaultValue: "All verdicts" })} (
                    {countryScopedFeed.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerdictFilter("stash")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
                      verdictFilter === "stash"
                        ? "bg-stash text-black shadow-xs ring-2 ring-stash/40"
                        : "bg-stash/10 text-stash hover:bg-stash/20",
                    )}
                  >
                    <Coins className="h-3.5 w-3.5" />
                    {t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" })} (
                    {stashCountTotal})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerdictFilter("trash")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
                      verdictFilter === "trash"
                        ? "bg-trash text-white shadow-xs ring-2 ring-trash/40"
                        : "bg-trash/10 text-trash hover:bg-trash/20",
                    )}
                  >
                    <Recycle className="h-3.5 w-3.5" />
                    {t("feed.trashesOfDay", { defaultValue: "Trashes of the Day" })} (
                    {trashCountTotal})
                  </button>
                </div>
                {verdictFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setVerdictFilter("all")}
                    className="text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
                  >
                    {t("feed.resetFilter", { defaultValue: "Reset filter" })}
                  </button>
                )}
              </div>
            </section>

            {/* REAL-TIME MATCHING BRANDS SECTION */}
            {resultScope !== "posts" && (
              <section className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-stash" />
                    <h2 className="font-display text-sm font-extrabold uppercase tracking-wider text-foreground">
                      {isSearching
                        ? t("feed.matchingBrands", {
                            defaultValue: `Matching Brands (${filteredBrands.length})`,
                          })
                        : t("feed.brandsInFeed", {
                            defaultValue: `Brands in ${countryName(selectedCountry)} (${filteredBrands.length})`,
                          })}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {filteredBrands.length > 6 && resultScope === "all" && (
                      <button
                        type="button"
                        onClick={() => setShowAllMatchingBrands((prev) => !prev)}
                        className="font-semibold text-muted-foreground hover:text-foreground"
                      >
                        {showAllMatchingBrands
                          ? t("common.showLess", { defaultValue: "Show fewer" })
                          : t("common.showMore", {
                              defaultValue: `Show all ${Math.min(24, filteredBrands.length)}`,
                            })}
                      </button>
                    )}
                    <Link
                      to="/brands"
                      className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                    >
                      {t("feed.browseAllBrands", { defaultValue: "Brand directory" })}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {brandsLoading ? (
                  <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                    {[0, 1, 2].map((idx) => (
                      <Skeleton key={idx} className="h-20 w-full rounded-xl" />
                    ))}
                  </div>
                ) : visibleBrands.length > 0 ? (
                  <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                    {visibleBrands.map((brand) => {
                      const trust = Number(brand.trust_score) || 0;
                      const sentimentInfo = brandSentimentBySlug.get(brand.slug);
                      const trend: "up" | "down" =
                        sentimentInfo?.trend ?? (trust >= 60 ? "up" : "down");
                      const isSelectedBrand = selectedBrandSlug === brand.slug;
                      const bCountry = normalizeCountryCode(brand.country);
                      return (
                        <div
                          key={brand.id}
                          className={cn(
                            "group flex flex-col justify-between rounded-xl border p-3 transition-all",
                            isSelectedBrand
                              ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                              : "border-border/80 bg-background/60 hover:border-border hover:bg-background",
                          )}
                        >
                          <div className="flex items-start justify-between gap-2.5">
                            <Link
                              to="/brands/$slug"
                              params={{ slug: brand.slug }}
                              className="flex min-w-0 flex-1 items-center gap-2.5"
                            >
                              <BrandLogo
                                name={brand.name}
                                url={brand.signedLogoUrl ?? brand.logo_url}
                                className="size-9 shrink-0 rounded-lg text-xs"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                  <span className="truncate font-display text-sm font-bold text-foreground group-hover:text-primary">
                                    {brand.name}
                                  </span>
                                  {brand.verified && (
                                    <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                                  )}
                                </div>
                                <p className="truncate text-[11px] text-muted-foreground">
                                  {countryFlag(bCountry)}{" "}
                                  {brandCategory(brand.name, brand.category)}
                                </p>
                              </div>
                            </Link>
                            <span
                              title={
                                trend === "up"
                                  ? `${trust}% trust score · Sentiment trending positively`
                                  : `${trust}% trust score · Sentiment trending negatively`
                              }
                              aria-label={
                                trend === "up"
                                  ? `Trust score ${trust} percent, trending positively`
                                  : `Trust score ${trust} percent, trending negatively`
                              }
                              className={cn(
                                "inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                                trust >= 75
                                  ? "bg-emerald-500/15 text-emerald-500"
                                  : trust >= 50
                                    ? "bg-amber-500/15 text-amber-500"
                                    : "bg-rose-500/15 text-rose-500",
                              )}
                            >
                              <span>{trust}%</span>
                              {trend === "up" ? (
                                <ArrowUp
                                  className="h-3 w-3 text-emerald-500 stroke-[2.75]"
                                  aria-hidden="true"
                                />
                              ) : (
                                <ArrowDown
                                  className="h-3 w-3 text-rose-500 stroke-[2.75]"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </div>

                          <div className="mt-2.5 flex items-center justify-between border-t border-border/50 pt-2 text-[11px]">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedBrandSlug(
                                  isSelectedBrand ? null : brand.slug,
                                )
                              }
                              className={cn(
                                "font-semibold transition-colors",
                                isSelectedBrand
                                  ? "text-primary"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              {isSelectedBrand
                                ? "✓ Filtering posts"
                                : "Filter feed posts"}
                            </button>
                            <Link
                              to="/brands/$slug"
                              params={{ slug: brand.slug }}
                              className="inline-flex items-center gap-0.5 font-bold text-foreground/80 hover:text-foreground hover:underline"
                            >
                              <span>Verdict</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                    {t("feed.noBrandsMatch", {
                      defaultValue: "No brands match your current search filter.",
                    })}
                  </div>
                )}
              </section>
            )}

            {/* REAL-TIME MATCHING POSTS SECTION */}
            {resultScope !== "brands" && (
              <>
                {verdictFilter === "stash" && (
                  <div className="mb-4 flex items-center justify-between rounded-xl border border-stash/30 bg-stash/10 px-4 py-2.5 text-xs font-semibold text-stash">
                    <span className="flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      <span>
                        {t("feed.showingStashes", {
                          defaultValue:
                            "Showing Stashes of the Day — Brands and products with positive community momentum",
                        })}
                      </span>
                    </span>
                    <span className="text-[11px] font-normal opacity-80">
                      {t("feed.sortedStashMargins", {
                        defaultValue: "Sorted by highest stash margins",
                      })}
                    </span>
                  </div>
                )}

                {verdictFilter === "trash" && (
                  <div className="mb-4 flex items-center justify-between rounded-xl border border-trash/30 bg-trash/10 px-4 py-2.5 text-xs font-semibold text-trash">
                    <span className="flex items-center gap-2">
                      <Recycle className="h-4 w-4" />
                      <span>
                        {t("feed.showingTrashes", {
                          defaultValue:
                            "Showing Trashes of the Day — Public complaints, issues, and calls for accountability",
                        })}
                      </span>
                    </span>
                    <span className="text-[11px] font-normal opacity-80">
                      {t("feed.sortedTrashMargins", {
                        defaultValue: "Sorted by highest trash margins",
                      })}
                    </span>
                  </div>
                )}

                {feedLoading ? (
                  <div className="space-y-4">
                    {[0, 1, 2].map((item) => (
                      <Skeleton key={item} className="h-64 w-full rounded-2xl" />
                    ))}
                  </div>
                ) : filteredFeed.length ? (
                  <div className="space-y-4">
                    {filteredFeed.map((item) => {
                      const bInfo = item.brandSlug
                        ? brandSentimentBySlug.get(item.brandSlug)
                        : undefined;
                      const itemTrend: "up" | "down" | undefined =
                        item.stashCount !== item.trashCount
                          ? item.stashCount > item.trashCount
                            ? "up"
                            : "down"
                          : bInfo?.trend;
                      return (
                        <ItemCard
                          key={item.id}
                          item={item}
                          brandTrustScore={bInfo?.trust ?? item.brandTrustScore}
                          sentimentTrend={itemTrend}
                          onChange={() => void refetch()}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border py-16 text-center">
                    <Recycle className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 font-display text-lg font-semibold">
                      {t("feed.emptyTitle", { defaultValue: "No conversations found" })}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t("feed.emptyBody", {
                        defaultValue:
                          "Try another country, category, or search term.",
                      })}
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-bold text-background transition hover:opacity-90"
                      >
                        <X className="h-3.5 w-3.5" />
                        {t("feed.resetAllFilters", {
                          defaultValue: "Reset all filters",
                        })}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <TrendingHashtags />
            </div>
          </aside>
        </div>
      </main>

      <LiveBroadcastModal
        open={feedBroadcastOpen}
        onOpenChange={setFeedBroadcastOpen}
        brandName={activeBrandObj?.name ?? "Community Feed Broadcast"}
        brandOwner="Public Consumer & Brand Feed"
        productName="Live Product / Service Situation Broadcast"
        defaultMode="broadcast"
      />
    </div>
  );
}
