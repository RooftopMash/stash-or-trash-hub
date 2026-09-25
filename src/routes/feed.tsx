import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Search, Recycle, Coins, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { LocationAwareFeed } from "@/components/LocationAwareFeed";
import { TrendingHashtags } from "@/components/TrendingHashtags";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { fetchFeed } from "@/lib/stash";
import { brandCategory, categoryOptions, matchesCategory } from "@/lib/categories";
import { countryOptions, normalizeCountryCode } from "@/lib/geo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/feed")({
  validateSearch: (search: Record<string, unknown>): { filter?: "all" | "stash" | "trash" } => ({
    filter:
      search.filter === "stash" || search.filter === "trash" || search.filter === "all"
        ? (search.filter as "all" | "stash" | "trash")
        : undefined,
  }),
  component: Feed,
});

function Feed() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const search = Route.useSearch();
  const [verdictFilter, setVerdictFilter] = useState<"all" | "stash" | "trash">(
    search.filter ?? "all",
  );
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("ZA");
  const [selectedCategory, setSelectedCategory] = useState("All categories");

  useEffect(() => {
    if (search.filter) {
      setVerdictFilter(search.filter);
    }
  }, [search.filter]);

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

  const stashCountTotal = useMemo(
    () => localFeed.filter((item) => (item.stashCount || 0) >= (item.trashCount || 0) && (item.stashCount || 0) > 0).length,
    [localFeed],
  );
  const trashCountTotal = useMemo(
    () => localFeed.filter((item) => (item.trashCount || 0) >= (item.stashCount || 0) && (item.trashCount || 0) > 0).length,
    [localFeed],
  );

  const filteredFeed = useMemo(() => {
    const term = query.trim().toLowerCase();
    return localFeed
      .filter((item) => {
        const category = brandCategory(item.brandName, item.category);
        const searchable =
          `${item.title} ${item.description ?? ""} ${item.brandName ?? ""} ${category}`.toLowerCase();
        const matchesSearch = !term || searchable.includes(term);
        const matchesCat = matchesCategory(category, selectedCategory);

        let matchesVerdict = true;
        if (verdictFilter === "stash") {
          matchesVerdict = (item.stashCount || 0) >= (item.trashCount || 0) && (item.stashCount || 0) > 0;
        } else if (verdictFilter === "trash") {
          matchesVerdict = (item.trashCount || 0) >= (item.stashCount || 0) && (item.trashCount || 0) > 0;
        }

        return matchesSearch && matchesCat && matchesVerdict;
      })
      .sort((a, b) => {
        if (verdictFilter === "stash") {
          return ((b.stashCount || 0) - (b.trashCount || 0)) - ((a.stashCount || 0) - (a.trashCount || 0));
        }
        if (verdictFilter === "trash") {
          return ((b.trashCount || 0) - (b.stashCount || 0)) - ((a.trashCount || 0) - (a.stashCount || 0));
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [localFeed, query, selectedCategory, verdictFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header onPosted={() => void refetch()} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-stash">{t("feed.pulse", { defaultValue: "Community pulse" })}</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">
            {t("feed.title", { defaultValue: "Stash Or Trash" })}
          </h1>
          <p className="mt-2 max-w-3xl text-lg font-semibold leading-7 text-foreground">
            {t("feed.subtitle", { defaultValue: "The Brand Barometer. Post anything about a brand and let the community deliver its verdict in real time — the CX & PR signal that matters." })}
          </p>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {t("feed.hook", { defaultValue: "Every verdict brings brands closer to the people they serve. Cast yours." })}
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
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
                <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-background px-3 md:max-w-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">{t("feed.searchPlaceholder", { defaultValue: "Search posts or brands" })}</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t("feed.searchPlaceholder", { defaultValue: "Search posts or brands" })}
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </label>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold",
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
                    {t("feed.allVerdicts", { defaultValue: "All verdicts" })} ({localFeed.length})
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
                    {t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" })} ({stashCountTotal})
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
                    {t("feed.trashesOfDay", { defaultValue: "Trashes of the Day" })} ({trashCountTotal})
                  </button>
                </div>
                {verdictFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setVerdictFilter("all")}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-4"
                  >
                    {t("feed.resetFilter", { defaultValue: "Reset filter" })}
                  </button>
                )}
              </div>
            </section>

            {verdictFilter === "stash" && (
              <div className="mb-4 flex items-center justify-between rounded-xl border border-stash/30 bg-stash/10 px-4 py-2.5 text-xs font-semibold text-stash">
                <span className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  <span>{t("feed.showingStashes", { defaultValue: "Showing Stashes of the Day — Brands and products with positive community momentum" })}</span>
                </span>
                <span className="text-[11px] font-normal opacity-80">{t("feed.sortedStashMargins", { defaultValue: "Sorted by highest stash margins" })}</span>
              </div>
            )}

            {verdictFilter === "trash" && (
              <div className="mb-4 flex items-center justify-between rounded-xl border border-trash/30 bg-trash/10 px-4 py-2.5 text-xs font-semibold text-trash">
                <span className="flex items-center gap-2">
                  <Recycle className="h-4 w-4" />
                  <span>{t("feed.showingTrashes", { defaultValue: "Showing Trashes of the Day — Public complaints, issues, and calls for accountability" })}</span>
                </span>
                <span className="text-[11px] font-normal opacity-80">{t("feed.sortedTrashMargins", { defaultValue: "Sorted by highest trash margins" })}</span>
              </div>
            )}
            {isLoading ? (
              <div className="space-y-4">
                {[0, 1, 2].map((item) => (
                  <Skeleton key={item} className="h-64 w-full rounded-2xl" />
                ))}
              </div>
            ) : filteredFeed.length ? (
              <div className="space-y-4">
                {filteredFeed.map((item) => (
                  <ItemCard key={item.id} item={item} onChange={() => void refetch()} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border py-16 text-center">
                <Recycle className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-4 font-display text-lg font-semibold">{t("feed.emptyTitle", { defaultValue: "No conversations found" })}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("feed.emptyBody", { defaultValue: "Try another country, category, or search term." })}
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
      </main>
    </div>
  );
}
