import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { fetchBrands } from "@/lib/brands";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, CalendarClock, CheckCircle2, Crown, Filter, Heart, Map, Search, Sparkles, TrendingUp, Trophy } from "lucide-react";
import { brandCategory, categoryOptions } from "@/lib/categories";
import { countryName, countryOptions, normalizeCountryCode } from "@/lib/geo";
import { cn } from "@/lib/utils";

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

function AwardsPage() {
  const { t } = useTranslation();
  const { data: brands, isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const [country, setCountry] = useState("All countries");
  const [category, setCategory] = useState("All categories");
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("Live season");
  const snapshotTime = useMemo(() => new Date(), []);
  const countries = useMemo(() => ["All countries", ...countryOptions((brands ?? []).map((brand) => brand.country))], [brands]);
  const categories = useMemo(() => categoryOptions((brands ?? []).map((brand) => brandCategory(brand.name, brand.category))), [brands]);
  const filteredBrands = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (brands ?? []).filter((brand) => {
      const normalizedCountry = normalizeCountryCode(brand.country);
      const normalizedCategory = brandCategory(brand.name, brand.category);
      const searchable = `${brand.name} ${countryName(normalizedCountry)} ${normalizedCategory}`.toLowerCase();
      return (country === "All countries" || normalizedCountry === country)
        && (category === "All categories" || normalizedCategory === category)
        && (!term || searchable.includes(term));
    }).sort((a, b) => (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0));
  }, [brands, category, country, query]);
  const top = filteredBrands.slice(0, 10);
  const regionLabel = country === "All countries" ? "Global awards" : `${countryName(country)} awards`;

  const awardTypes = [
    { icon: Crown, title: t("awards.cat1"), desc: t("awards.cat1d") },
    { icon: Heart, title: t("awards.cat2"), desc: t("awards.cat2d") },
    { icon: TrendingUp, title: t("awards.cat3"), desc: t("awards.cat3d") },
    { icon: Sparkles, title: t("awards.cat4"), desc: t("awards.cat4d") },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero */}
        <section className="rounded-3xl border border-border bg-gradient-to-b from-secondary/60 to-card p-8 text-center">
          <Trophy className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">{t("awards.title")}</h1>
          <p className="mt-2 font-display text-lg font-semibold text-primary">{t("awards.tagline")}</p>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("awards.intro")}</p>
        </section>

        {/* Leaderboard */}
        <section className="mt-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">{t("awards.leaderboard")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("awards.leaderboardNote")} Rankings stay inside the selected market and category.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary"><Map className="h-4 w-4" />{regionLabel}</div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm md:col-span-2">
              <div className="flex flex-col gap-3 lg:flex-row">
                <label className="flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Award period</span>
                  <select value={period} onChange={(event) => setPeriod(event.target.value)} className="bg-transparent text-sm font-medium outline-none">
                    <option>Live season</option>
                    <option>Last 90 days</option>
                    <option>Last 12 months</option>
                  </select>
                </label>
                <label className="flex h-10 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Search awards</span>
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search brands or markets" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                </label>
                <label className="flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-3">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Award country</span>
                  <select value={country} onChange={(event) => setCountry(event.target.value)} className="bg-transparent text-sm font-medium outline-none">
                    {countries.map((item) => <option key={item} value={item}>{item === "All countries" ? item : countryName(item)}</option>)}
                  </select>
                </label>
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors", category === item ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground")}>{item}</button>)}
              </div>
            </div>
            <div className="rounded-2xl border border-stash/30 bg-stash/5 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stash"><CheckCircle2 className="h-4 w-4" /> Live snapshot</div>
              <p className="mt-2 font-display text-sm font-bold">{period}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Updated {snapshotTime.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}. Scores remain scoped to {regionLabel.toLowerCase()} and {category === "All categories" ? "all categories" : category}.</p>
            </div>
          </div>


          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            {isLoading ? (
              <div className="space-y-px">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-none" />
                ))}
              </div>
            ) : top.length === 0 ? (
              <p className="p-8 text-center text-sm text-muted-foreground">{t("brand.noBrands")}</p>
            ) : (
              top.map((b, i) => (
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
                  <span className="flex-1 truncate font-semibold"><span className="block">{b.name}</span><span className="text-xs font-normal text-muted-foreground">{countryName(normalizeCountryCode(b.country))} · {brandCategory(b.name, b.category)}</span></span>
                  <span className="flex items-center gap-1.5 font-display font-extrabold text-stash">
                    <TrendingUp className="h-4 w-4" />
                    {b.trust_score}
                  </span>
                </Link>
              ))
            )}
          </div>
          {top.length === 0 && !isLoading && <p className="mt-4 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No brands match this award market and category yet. Expand the filters to explore more nominees.</p>}
          <p className="mt-3 text-xs text-muted-foreground">Live eligibility: every listed brand may appear. Final ceremony editions will publish a timestamped snapshot of these country and category rankings.</p>
          <div className="mt-6 rounded-2xl border border-stash/20 bg-stash/5 p-5">
            <h3 className="font-display text-lg font-bold">Our fairness and accuracy standard</h3>
            <div className="mt-3 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              <p><strong className="text-foreground">Comparable scope.</strong> Rankings are calculated only within the selected country and category, so smaller markets are not silently compared with global totals.</p>
              <p><strong className="text-foreground">Evidence before authority.</strong> A score is a community signal, not a government or regulatory finding. Published evidence, methodology version, and timestamp remain visible.</p>
              <p><strong className="text-foreground">Coverage is not performance.</strong> Countries and brands without enough data remain discoverable but are not penalized for missing participation.</p>
              <p><strong className="text-foreground">Review and correction.</strong> Conflicts, manipulation reports, and material corrections should create a review record rather than silently changing history.</p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="font-display text-xl font-bold">The road to the live ceremony</h2>
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

        {/* Categories */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">{t("awards.categoryTitle")}</h2>
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
          <h2 className="mt-3 font-display text-2xl font-bold">{t("awards.cta")}</h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">{t("awards.ctaNote")}</p>
          <Link
            to="/brands"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("nav.brands")}
          </Link>
        </section>
      </main>
    </div>
  );
}
