import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Recycle } from "lucide-react";
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

export const Route = createFileRoute("/feed")({ component: Feed });

function Feed() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("ZA");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["feed", user?.id ?? "anon"],
    queryFn: () => fetchFeed(user?.id ?? null),
  });
  const countries = useMemo(() => countryOptions((data ?? []).map((item) => item.brandCountry)), [data]);
  const localFeed = useMemo(() => (data ?? []).filter((item) => normalizeCountryCode(item.brandCountry) === selectedCountry), [data, selectedCountry]);
  const categories = useMemo(() => categoryOptions(localFeed.map((item) => brandCategory(item.brandName, item.category))), [localFeed]);
  const filteredFeed = useMemo(() => {
    const term = query.trim().toLowerCase();
    return localFeed.filter((item) => {
      const category = brandCategory(item.brandName, item.category);
      const searchable = `${item.title} ${item.description ?? ""} ${item.brandName ?? ""} ${category}`.toLowerCase();
      return (!term || searchable.includes(term)) && matchesCategory(category, selectedCategory);
    });
  }, [localFeed, query, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header onPosted={() => void refetch()} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-stash">Community pulse</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">Feed</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Explore concerns, compliments, ideas, and conversations from people and brands across your markets.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <section className="mb-5 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <LocationAwareFeed selectedCountry={selectedCountry} availableCountries={countries} onCountryChange={(country) => { setSelectedCountry(country); setSelectedCategory("All categories"); }} />
                <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-background px-3 md:max-w-sm"><Search className="h-4 w-4 text-muted-foreground" /><span className="sr-only">Search feed</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts or brands" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" /></label>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{categories.map((category) => <button key={category} onClick={() => setSelectedCategory(category)} className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold", selectedCategory === category ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground")}>{category}</button>)}</div>
            </section>
            {isLoading ? <div className="space-y-4">{[0, 1, 2].map((item) => <Skeleton key={item} className="h-64 w-full rounded-2xl" />)}</div> : filteredFeed.length ? <div className="space-y-4">{filteredFeed.map((item) => <ItemCard key={item.id} item={item} onChange={() => void refetch()} />)}</div> : <div className="rounded-2xl border border-dashed border-border py-16 text-center"><Recycle className="mx-auto h-10 w-10 text-muted-foreground" /><p className="mt-4 font-display text-lg font-semibold">No conversations found</p><p className="mt-1 text-sm text-muted-foreground">Try another country, category, or search term.</p></div>}
          </div>
          <aside className="hidden lg:block"><div className="sticky top-20"><TrendingHashtags /></div></aside>
        </div>
      </main>
    </div>
  );
}
