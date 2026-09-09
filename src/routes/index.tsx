import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { EngagementBar } from "@/components/EngagementBar";
import { QuickBrands } from "@/components/QuickBrands";
import { TrendingHashtags } from "@/components/TrendingHashtags";
import { SotWordmark } from "@/components/SotWordmark";
import { BrandSearch } from "@/components/BrandSearch";
import { LiveIncidents } from "@/components/LiveIncidents";
import { LocationAwareFeed } from "@/components/LocationAwareFeed";
import { useAuth } from "@/hooks/useAuth";
import { fetchFeed } from "@/lib/stash";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BarChart3, BriefcaseBusiness, Recycle, Search, Users } from "lucide-react";
import { brandCategory, categoryOptions, matchesCategory } from "@/lib/categories";
import { countryOptions, normalizeCountryCode } from "@/lib/geo";
import { cn } from "@/lib/utils";
import coinsWatermark from "@/assets/watermark-coins.png";
import binsWatermark from "@/assets/watermark-bins.png";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [selectedCountry, setSelectedCountry] = useState("ZA");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["feed", user?.id ?? "anon"],
    queryFn: () => fetchFeed(user?.id ?? null),
  });

  const countries = useMemo(
    () => countryOptions((data ?? []).map((item) => item.brandCountry)),
    [data],
  );
  const localFeed = useMemo(
    () =>
      (data ?? []).filter((item) => normalizeCountryCode(item.brandCountry) === selectedCountry),
    [data, selectedCountry],
  );
  const categories = useMemo(
    () => categoryOptions(localFeed.map((item) => brandCategory(item.brandName, item.category))),
    [localFeed],
  );
  const filteredFeed = useMemo(() => {
    const term = query.trim().toLowerCase();
    return localFeed.filter((item) => {
      const normalizedCategory = brandCategory(item.brandName, item.category);
      const searchable =
        `${item.title} ${item.description ?? ""} ${item.brandName ?? ""} ${item.category ?? ""} ${normalizedCategory}`.toLowerCase();
      return (
        (!term || searchable.includes(term)) &&
        matchesCategory(normalizedCategory, selectedCategory)
      );
    });
  }, [localFeed, query, selectedCategory]);

  return (
    <div className="relative min-h-screen">
      {/* Split-screen brand watermark: gold coins (Stash) on the left, falling bins (Trash) on the right */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 w-1/2 opacity-[0.07]"
          style={{
            backgroundImage: `url(${coinsWatermark})`,
            backgroundSize: "320px 320px",
            backgroundRepeat: "repeat",
            maskImage: "linear-gradient(to right, black 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, black 55%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2 opacity-[0.07]"
          style={{
            backgroundImage: `url(${binsWatermark})`,
            backgroundSize: "320px 320px",
            backgroundRepeat: "repeat",
            maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to left, black 55%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10">
        <Header onPosted={() => refetch()} />

        <main className="mx-auto max-w-6xl px-4 py-8">
          <section className="mb-8 text-center">
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
              <SotWordmark size="lg" />
            </h1>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t("home.subtitle")}</p>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-foreground">
              {t("home.hook")}
            </p>
            <div className="mx-auto mt-6 max-w-xl">
              <BrandSearch />
            </div>
            <div className="mx-auto mt-4 max-w-4xl rounded-2xl border border-border/70 bg-card/90 p-3 text-left shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Categories
                </span>
                {categories.map((category) => (
                  <button
                    key={`hero-${category}`}
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
                {categories.length <= 1 && (
                  <span className="text-xs text-muted-foreground">
                    Local categories will appear as activity is added.
                  </span>
                )}
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <EngagementBar />

              <LiveIncidents />
              <QuickBrands country={selectedCountry} />

              <section className="mb-5 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-display text-sm font-bold">Browse the conversation</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {categories.length > 1
                        ? "Filter community posts by brand category."
                        : "Categories will appear as local brand activity is added."}
                    </p>
                  </div>
                  <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-background px-3 md:max-w-sm">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Search feed</span>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search posts or brands"
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </label>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <LocationAwareFeed
                    selectedCountry={selectedCountry}
                    availableCountries={countries}
                    onCountryChange={(country) => {
                      setSelectedCountry(country);
                      setSelectedCategory("All categories");
                    }}
                  />
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {categories.map((category) => (
                      <button
                        key={category}
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
                </div>
              </section>

              {isLoading ? (
                <div className="space-y-4">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                  ))}
                </div>
              ) : filteredFeed.length > 0 ? (
                <div className="space-y-4">
                  {filteredFeed.map((item) => (
                    <ItemCard key={item.id} item={item} onChange={() => refetch()} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border py-16 text-center">
                  <Recycle className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-4 font-display text-lg font-semibold">
                    {data && data.length > 0 ? "No local conversations yet" : t("home.emptyTitle")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {data && data.length > 0
                      ? "Try another country or category, or start the first conversation for this market."
                      : user
                        ? t("home.emptyBodyUser")
                        : t("home.emptyBodyGuest")}
                  </p>
                </div>
              )}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <TrendingHashtags />
              </div>
            </aside>
          </div>

          <section className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-secondary/40 px-6 py-8 sm:px-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-stash">Business model</p>
                  <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    SaaS &amp; Enterprise Data Subscriptions
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                    A two-sided platform: free, high-engagement consumer participation creates the live CX signal that brands and enterprise teams subscribe to understand.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <span className="rounded-full bg-foreground px-3 py-1.5 text-background">Built for scale</span>
                  <ArrowRight className="h-4 w-4 text-trash" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="grid gap-px bg-border md:grid-cols-3">
              <article className="bg-card p-6 sm:p-7">
                <BriefcaseBusiness className="h-6 w-6 text-stash" aria-hidden="true" />
                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">01 · B2B SaaS platform</p>
                <h3 className="mt-2 font-display text-xl font-bold text-foreground">Campaign valuation intelligence</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Monthly and annual tiers help brands run active campaign valuations, measure reputation movement, and turn customer verdicts into action.</p>
              </article>
              <article className="bg-card p-6 sm:p-7">
                <BarChart3 className="h-6 w-6 text-trash" aria-hidden="true" />
                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">02 · Custom CX intelligence</p>
                <h3 className="mt-2 font-display text-xl font-bold text-foreground">Premium reports for enterprise</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Benchmarking and real-time sentiment diagnostics give corporate clients a sharper view of service quality, demand, and emerging risk.</p>
              </article>
              <article className="bg-card p-6 sm:p-7">
                <Users className="h-6 w-6 text-foreground" aria-hidden="true" />
                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground">03 · Free consumer access</p>
                <h3 className="mt-2 font-display text-xl font-bold text-foreground">A network people want to use</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Everyday users get a free, gamified entry point to voice real opinions on service quality—fueling the data layer without putting participation behind a paywall.</p>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
