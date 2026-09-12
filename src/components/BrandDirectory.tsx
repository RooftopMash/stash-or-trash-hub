"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, Globe2, BadgeCheck, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandLogo } from "@/components/BrandLogo";
import { brandCategory, categoryClass, categoryOptions, matchesCategory } from "@/lib/categories";
import { countryName, normalizeCountryCode } from "@/lib/geo";
import type { Brand } from "@/lib/brands";
import { cn } from "@/lib/utils";

type Country = { cca2: string; name: { common: string }; flags: { png?: string; svg?: string } };

const fallbackCountries: Country[] = [
  ["ZA", "South Africa"], ["NG", "Nigeria"], ["KE", "Kenya"], ["GH", "Ghana"], ["EG", "Egypt"],
  ["US", "United States"], ["CA", "Canada"], ["BR", "Brazil"], ["MX", "Mexico"], ["GB", "United Kingdom"],
  ["FR", "France"], ["DE", "Germany"], ["ES", "Spain"], ["IT", "Italy"], ["TR", "Türkiye"],
  ["IN", "India"], ["CN", "China"], ["JP", "Japan"], ["KR", "South Korea"], ["AU", "Australia"],
].map(([cca2, common]) => ({ cca2, name: { common }, flags: {} }));

async function fetchCountries(): Promise<Country[]> {
  const response = await fetch("https://restcountries.com/v3.1/all?fields=cca2,name,flags");
  if (!response.ok) throw new Error("Country service unavailable");
  return response.json();
}

function Flag({ country, className }: { country?: Country; className?: string }) {
  const flags = country?.flags;
  const source = flags?.svg ?? flags?.png;
  if (!source) return <span aria-hidden="true" className={cn("text-lg", className)}>🌐</span>;
  return <img src={source} alt="" className={cn("size-6 rounded-sm object-cover", className)} onError={(event) => { event.currentTarget.style.display = "none"; }} />;
}

function logoDomain(brand: Brand) {
  if (brand.website) {
    try { return new URL(brand.website.startsWith("http") ? brand.website : `https://${brand.website}`).hostname; } catch { return null; }
  }
  return null;
}

export function BrandDirectory({ brands, user }: { brands: Brand[]; user: unknown }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [countryCode, setCountryCode] = useState("ALL");
  const [category, setCategory] = useState("All categories");
  const countriesQuery = useQuery({ queryKey: ["countries"], queryFn: fetchCountries, staleTime: 86_400_000, retry: 1 });
  const countries = countriesQuery.data?.filter((item) => item.cca2).sort((a, b) => a.name.common.localeCompare(b.name.common)) ?? fallbackCountries;
  const countryMap = useMemo(() => new Map(countries.map((country) => [country.cca2, country])), [countries]);
  const categories = useMemo(() => categoryOptions(brands.map((brand) => brandCategory(brand.name, brand.category))), [brands]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return brands.filter((brand) => {
      const code = normalizeCountryCode(brand.country);
      const text = `${brand.name} ${brand.category ?? ""} ${countryName(code)}`.toLowerCase();
      return (!term || text.includes(term)) && (countryCode === "ALL" || code === countryCode) && matchesCategory(brandCategory(brand.name, brand.category), category);
    });
  }, [brands, category, countryCode, query]);

  return <section className="flex flex-col gap-6">
    <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Global directory</p><h2 className="mt-1 font-display text-2xl font-bold">Find a brand anywhere</h2><p className="mt-1 text-sm text-muted-foreground">Browse {countries.length}+ countries and discover companies by origin.</p></div>
        <Button onClick={() => navigate({ to: user ? "/brands/new" : "/auth" })}><Plus data-icon="inline-start" /> Add a brand</Button>
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_280px]">
        <label className="flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-3"><Search className="size-4 text-muted-foreground" /><span className="sr-only">Search brands</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search brands, industries, or countries" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
        <label className="flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-3"><Globe2 className="size-4 text-muted-foreground" /><span className="sr-only">Filter by country</span><select value={countryCode} onChange={(event) => { setCountryCode(event.target.value); setCategory("All categories"); }} className="min-w-0 flex-1 bg-transparent text-sm outline-none"><option value="ALL">All countries</option>{countries.map((country) => <option key={country.cca2} value={country.cca2}>{country.name.common} ({country.cca2})</option>)}</select></label>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold", category === item ? "bg-foreground text-background" : "bg-secondary text-muted-foreground")}>{item}</button>)}</div>
    </div>
    {countriesQuery.isLoading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <Skeleton key={item} className="h-48 rounded-2xl" />)}</div> : filtered.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((brand) => { const code = normalizeCountryCode(brand.country); const country = code ? countryMap.get(code) : undefined; const domain = logoDomain(brand); return <Link key={brand.id} to="/brands/$slug" params={{ slug: brand.slug }} className="group flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"><div className="flex items-start justify-between gap-3"><BrandLogo name={brand.name} url={brand.signedLogoUrl ?? (domain ? `https://logo.clearbit.com/${domain}` : null)} className="size-14 rounded-2xl text-lg" /><Flag country={country} className="size-8" /></div><div><div className="flex items-center gap-1.5"><h3 className="truncate font-display text-lg font-bold">{brand.name}</h3>{brand.verified && <BadgeCheck className="size-4 shrink-0 text-primary" />}</div><Badge variant="secondary" className={cn("mt-2 text-[10px]", categoryClass(brandCategory(brand.name, brand.category)))}>{brandCategory(brand.name, brand.category)}</Badge><p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Flag country />{country?.name.common ?? countryName(code) ?? "Global"}<span className="text-xs">{code}</span></p></div></Link>; })}</div> : <div className="rounded-2xl border border-dashed border-border py-16 text-center"><Globe2 className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 font-display font-semibold">No brands match these filters</p><p className="mt-1 text-sm text-muted-foreground">Try another country, category, or search term.</p></div>}
    {countriesQuery.isError && <p className="text-xs text-muted-foreground">Country data could not be refreshed, so a starter country list is being shown.</p>}
  </section>;
}
