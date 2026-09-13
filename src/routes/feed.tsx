import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Recycle } from "lucide-react";
import { Header } from "@/components/Header";
import { ItemCard } from "@/components/ItemCard";
import { LocationAwareFeed } from "@/components/LocationAwareFeed";
import { TrendingHashtags } from "@/components/TrendingHashtags";
import { EngagementBar } from "@/components/EngagementBar";
import { LiveIncidents } from "@/components/LiveIncidents";
import { QuickBrands } from "@/components/QuickBrands";
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
        <section className="mb-8 overflow-hidden rounded-3xl border-2 border-foreground/10 bg-card shadow-md">
          <div className="bg-foreground px-6 py-5 text-background sm:px-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-stash">For brands, enterprises &amp; investors</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">SaaS &amp; Enterprise Data Subscriptions</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-background/75">Free consumer participation powers a subscription data business for brands that need campaign valuation, CX benchmarking, and real-time sentiment intelligence.</p>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-3">
            <div className="bg-card p-5"><p className="text-xs font-extrabold uppercase tracking-wider text-stash">01 · B2B SaaS</p><p className="mt-2 font-display font-bold text-foreground">Monthly &amp; annual campaign valuation tiers</p></div>
            <div className="bg-card p-5"><p className="text-xs font-extrabold uppercase tracking-wider text-trash">02 · Enterprise intelligence</p><p className="mt-2 font-display font-bold text-foreground">Custom CX reports and live sentiment diagnostics</p></div>
            <div className="bg-card p-5"><p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">03 · Free consumers</p><p className="mt-2 font-display font-bold text-foreground">Gamified opinions that create the live data layer</p></div>
          </div>
        </section>
        <EngagementBar />
        <LiveIncidents />
        <QuickBrands country={selectedCountry} />
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
