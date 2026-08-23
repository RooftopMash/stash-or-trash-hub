import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { EngagementBar } from "@/components/EngagementBar";
import { TrendingHashtags } from "@/components/TrendingHashtags";
import { SotWordmark } from "@/components/SotWordmark";
import { useAuth } from "@/hooks/useAuth";
import { fetchFeed } from "@/lib/stash";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SubmitDialog } from "@/components/SubmitDialog";
import { Recycle, Search, Filter, X } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["feed", user?.id ?? "anon"],
    queryFn: () => fetchFeed(user?.id ?? null),
  });

  const categories = useMemo(() => {
    if (!data) return [];
    const set = new Set<string>();
    data.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [data]);

  const filteredFeed = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.brandName && item.brandName.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));

      const matchesCategory =
        !selectedCategory ||
        (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen">
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
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <EngagementBar />

            {/* Search & Category Quick Filter */}
            <div className="mb-6 space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search brands, products, or reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 rounded-xl border-border bg-card pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {categories.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="mr-1 flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <Filter className="h-3 w-3" /> Filter:
                  </span>
                  <Badge
                    variant={selectedCategory === null ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Badge>
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                ))}
              </div>
            ) : filteredFeed && filteredFeed.length > 0 ? (
              <div className="space-y-4">
                {filteredFeed.map((item) => (
                  <ItemCard key={item.id} item={item} onChange={() => refetch()} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border py-16 text-center">
                <Recycle className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-4 font-display text-lg font-semibold">
                  {searchQuery || selectedCategory
                    ? "No brand reviews found matching search"
                    : t("home.emptyTitle")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchQuery || selectedCategory
                    ? "Be the first to post a Stash or Trash verdict for this!"
                    : user
                      ? t("home.emptyBodyUser")
                      : t("home.emptyBodyGuest")}
                </p>
                {(searchQuery || selectedCategory) && (
                  <div className="mt-5 flex justify-center">
                    <SubmitDialog onPosted={() => refetch()} />
                  </div>
                )}
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
