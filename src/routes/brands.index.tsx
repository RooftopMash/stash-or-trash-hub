import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { fetchBrands } from "@/lib/brands";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandLogo } from "@/components/BrandLogo";
import { BadgeCheck, Plus, Search, TrendingUp } from "lucide-react";
import { brandCategory, categoryClass, categoryOptions, matchesCategory } from "@/lib/categories";
import { countryLabel, countryName, countryOptions, normalizeCountryCode } from "@/lib/geo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/brands/")({
  head: () => ({
    meta: [
      { title: "Brands — Stash or Trash" },
      {
        name: "description",
        content: "Browse brands on the Brand Barometer and see the community's live trust score.",
      },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({ queryKey: ["brands"], queryFn: fetchBrands });
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [selectedCountry, setSelectedCountry] = useState("ZA");
  const countries = useMemo(() => {
    const available = countryOptions((data ?? []).map((brand) => brand.country));
    return available.includes("ZA") ? available : ["ZA", ...available];
  }, [data]);
  const localBrands = useMemo(
    () => (data ?? []).filter((brand) => normalizeCountryCode(brand.country) === selectedCountry),
    [data, selectedCountry],
  );
  const categories = useMemo(
    () => categoryOptions(localBrands.map((brand) => brandCategory(brand.name, brand.category))),
    [localBrands],
  );
  const filteredBrands = useMemo(() => {
    const term = query.trim().toLowerCase();
    return localBrands.filter((brand) => {
      const normalized = brandCategory(brand.name, brand.category);
      const searchable =
        `${brand.name} ${brand.country ?? ""} ${brand.category ?? ""} ${normalized}`.toLowerCase();
      return (!term || searchable.includes(term)) && matchesCategory(normalized, selectedCategory);
    });
  }, [localBrands, query, selectedCategory]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{t("brand.title")}</h1>
            <p className="mt-2 max-w-lg text-muted-foreground">{t("brand.subtitle")}</p>
          </div>
          <Button
            onClick={() => navigate({ to: user ? "/brands/new" : "/auth" })}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" /> {t("brand.create")}
          </Button>
        </div>

        {!isLoading && data && data.length > 0 && (
          <section className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-display text-sm font-bold">Explore by category</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {filteredBrands.length} brands in {countryLabel(selectedCountry)} · target 100 verified brands per country
                  </p>
              </div>
              <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-background px-3 md:max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Search brands</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search brands or countries"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="brand-country">
                Country
              </label>
              <select
                id="brand-country"
                value={selectedCountry}
                onChange={(event) => {
                  setSelectedCountry(event.target.value);
                  setSelectedCategory("All categories");
                }}
                className="h-9 rounded-lg border border-border bg-background px-3 text-sm font-medium outline-none"
              >
                {countries.map((code) => (
                  <option key={code} value={code}>
                    {countryLabel(code)}
                  </option>
                ))}
              </select>
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
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredBrands.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredBrands.map((b) => (
              <Link
                key={b.id}
                to="/brands/$slug"
                params={{ slug: b.slug }}
                className="group flex gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
              >
                <BrandLogo
                  name={b.name}
                  url={b.signedLogoUrl}
                  className="h-14 w-14 rounded-xl text-lg"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="truncate font-display text-lg font-bold">{b.name}</h2>
                    {b.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "mt-1 text-[10px]",
                      categoryClass(brandCategory(b.name, b.category)),
                    )}
                  >
                    {brandCategory(b.name, b.category)}
                  </Badge>
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <TrendingUp className="h-4 w-4 text-stash" />
                    <span className="font-semibold">{b.trust_score}</span>
                    <span className="text-muted-foreground">
                      / 100 {t("brand.trustScore").toLowerCase()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
            <p className="font-display font-semibold">No brands match these filters</p>
            <p className="mt-1 text-sm">Try another country, category, or search term.</p>
          </div>
        )}
      </main>
    </div>
  );
}
