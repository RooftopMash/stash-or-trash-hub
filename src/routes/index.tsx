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
import { useAuth } from "@/hooks/useAuth";
import { fetchFeed } from "@/lib/stash";
import { Skeleton } from "@/components/ui/skeleton";
import { Recycle, Search } from "lucide-react";
import { categoryOptions, matchesCategory, normalizeCategory } from "@/lib/categories";
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
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["feed", user?.id ?? "anon"],
    queryFn: () => fetchFeed(user?.id ?? null),
  });

  const categories = useMemo(() => categoryOptions((data ?? []).map((item) => item.category)), [data]);
  const filteredFeed = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (data ?? []).filter((item) => {
      const searchable = `${item.title} ${item.description ?? ""} ${item.brandName ?? ""} ${item.category ?? ""} ${normalizeCategory(item.category)}`.toLowerCase();
      return (!term || searchable.includes(term)) && matchesCategory(item.category, selectedCategory);
    });
  }, [data, query, selectedCategory]);

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
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            {t("home.subtitle")}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-foreground">
            {t("home.hook")}
          </p>
          <div className="mx-auto mt-6 max-w-xl">
            <BrandSearch />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <EngagementBar />

            <LiveIncidents />
            <QuickBrands />

            <section className="mb-5 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-display text-sm font-bold">Browse the conversation</p>
                  <p className="mt-1 text-xs text-muted-foreground">Filter community posts by brand category.</p>
                </div>
                <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-background px-3 md:max-w-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Search feed</span>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts or brands" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                </label>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => (
                  <button key={category} onClick={() => setSelectedCategory(category)} className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors", selectedCategory === category ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground")}>
                    {category}
                  </button>
                ))}
              </div>
            </section>

            {isLoading ? (
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                ))}
              </div>
            ) : data && data.length > 0 ? (
              <div className="space-y-4">
                {filteredFeed.map((item) => (
                  <ItemCard key={item.id} item={item} onChange={() => refetch()} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border py-16 text-center">
                <Recycle className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-4 font-display text-lg font-semibold">{t("home.emptyTitle")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {user ? t("home.emptyBodyUser") : t("home.emptyBodyGuest")}
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
    </div>
  );
}
