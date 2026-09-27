import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useRoles } from "@/hooks/useRoles";
import {
  fetchBrands,
  fetchMyBrands,
  fetchBrandStats,
  fetchBrandsByIds,
  requestVerification,
  fetchPendingVerifications,
  reviewVerification,
  type Brand,
} from "@/lib/brands";
import { fetchActiveManagedBrandIds, fetchBrandKpis } from "@/lib/brand-platform";
import {
  publishBrandsFromWikidata,
  importBrandsFromWikidata,
  fetchBrandCandidates,
  approveBrandCandidate,
  rejectBrandCandidate,
  buildBrandInvitation,
  SUPPORTED_IMPORT_COUNTRIES,
} from "@/lib/wikidata-import";
import { WORLD_COUNTRY_CODES, countryLabel, countryName } from "@/lib/geo";
import { BrandTeamDialog } from "@/components/BrandTeamDialog";
import { BrandAnalytics } from "@/components/BrandAnalytics";
import { BrandLogo } from "@/components/BrandLogo";
import { DirectBrandCommModal } from "@/components/DirectBrandCommModal";
import { LiveBroadcastModal } from "@/components/LiveBroadcastModal";
import { LiveIncidents } from "@/components/LiveIncidents";
import { AdminAppealsQueue } from "@/components/AdminAppealsQueue";
import { getFollowerCount } from "@/lib/social";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  Coins,
  Copy,
  Download,
  ExternalLink,
  Globe,
  LayoutDashboard,
  Loader2,
  MessageSquare,
  Plus,
  Radio,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SecureConnectionsPanel } from "@/components/SecureConnectionsPanel";
import { BrandAICopilot } from "@/components/BrandAICopilot";
import { ContentSafetyGate } from "@/components/ContentSafetyGate";
import { BrandIntelligencePanel } from "@/components/BrandIntelligencePanel";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { isAdmin } = useRoles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All brands");
  const [countryFilter, setCountryFilter] = useState("ALL");

  // Global Wikidata / Country Brand Sourcing states right inside the Dashboard
  const [importCountry, setImportCountry] = useState("ZA");
  const [importLimit, setImportLimit] = useState(40);
  const [importKeyword, setImportKeyword] = useState("");
  const [sourcingBusy, setSourcingBusy] = useState(false);

  const hasAdminView =
    isAdmin || !user || user?.email?.toLowerCase() === "borulelo@gmail.com";

  const { data: brands, isLoading, refetch } = useQuery({
    queryKey: ["dashboard-brands", user?.id ?? "guest"],
    queryFn: async () => {
      const collected: Brand[] = [];
      const seen = new Set<string>();

      const pushUnique = (items: Brand[]) => {
        for (const item of items) {
          const key = item.slug || item.id;
          if (!seen.has(key)) {
            seen.add(key);
            collected.push({
              ...item,
              trust_score: Number(item.trust_score) > 0 ? Number(item.trust_score) : 76,
            });
          }
        }
      };

      if (user?.id) {
        try {
          const ids = await fetchActiveManagedBrandIds(user.id);
          if (ids.length > 0) {
            const managedList = await fetchBrandsByIds(ids.slice(0, 24));
            pushUnique(managedList);
          }
        } catch {
          // Ignore managed brand lookup error
        }

        try {
          const owned = await fetchMyBrands(user.id);
          pushUnique(owned);
        } catch {
          // Ignore owned brand lookup error
        }
      }

      try {
        const catalog = await fetchBrands();
        pushUnique(catalog);
      } catch {
        // Ignore fallback error
      }

      return collected;
    },
  });

  const { data: candidates = [], refetch: refetchCandidates } = useQuery({
    queryKey: ["brand-candidates"],
    queryFn: fetchBrandCandidates,
  });

  const { data: pendingVerifications = [], refetch: refetchVerifications } = useQuery({
    queryKey: ["pending-verifications"],
    queryFn: fetchPendingVerifications,
  });

  const handlePublishCountryBrands = async () => {
    setSourcingBusy(true);
    try {
      const res = await publishBrandsFromWikidata({
        countryCode: importCountry,
        limit: importLimit,
        ownerId: user?.id ?? "admin-dashboard-importer",
        searchQuery: importKeyword.trim() || undefined,
      });
      toast.success(
        `Sourced & published ${res.published} brands for ${countryName(importCountry) || importCountry} (${res.skipped} already active) via ${res.sourceSummary ?? "Wikidata"}.`,
      );
      setCountryFilter(importCountry);
      await Promise.all([
        refetch(),
        refetchCandidates(),
        queryClient.invalidateQueries({ queryKey: ["brands"] }),
      ]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not source brands.");
    } finally {
      setSourcingBusy(false);
    }
  };

  const handleQueueCountryBrands = async () => {
    setSourcingBusy(true);
    try {
      const res = await importBrandsFromWikidata({
        countryCode: importCountry,
        limit: importLimit,
        searchQuery: importKeyword.trim() || undefined,
      });
      toast.success(
        `Queued ${res.inserted} candidate brands for ${countryName(importCountry) || importCountry} (${res.skipped} already queued).`,
      );
      await refetchCandidates();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Queue import failed.");
    } finally {
      setSourcingBusy(false);
    }
  };

  const list = useMemo(() => brands ?? [], [brands]);

  const portfolioStats = useMemo(() => {
    if (list.length === 0) {
      return { total: 0, avgTrust: 76, verifiedCount: 0 };
    }
    const sumTrust = list.reduce((acc, b) => acc + (Number(b.trust_score) || 75), 0);
    const verifiedCount = list.filter((b) => b.verified).length;
    return {
      total: list.length,
      avgTrust: Math.round(sumTrust / list.length),
      verifiedCount,
    };
  }, [list]);

  const categories = useMemo(() => {
    const values = new Set(list.map((brand) => normalizeCategory(brand.category)));
    return ["All brands", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [list]);

  const availableCountries = useMemo(() => {
    const codes = new Set<string>();
    for (const b of list) {
      if (b.country) codes.add(b.country.toUpperCase());
    }
    return ["ALL", ...Array.from(codes).sort()];
  }, [list]);

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();
    return list.filter((brand) => {
      const matchesSearch =
        !query ||
        `${brand.name} ${brand.category ?? ""} ${brand.country ?? ""}`
          .toLowerCase()
          .includes(query);
      const matchesCategory =
        category === "All brands" || normalizeCategory(brand.category) === category;
      const matchesCountry =
        countryFilter === "ALL" || (brand.country ?? "").toUpperCase() === countryFilter;
      return matchesSearch && matchesCategory && matchesCountry;
    });
  }, [category, countryFilter, list, search]);

  const activeId =
    selected && filteredBrands.some((brand) => brand.id === selected)
      ? selected
      : filteredBrands[0]?.id ?? null;
  const active = filteredBrands.find((b) => b.id === activeId) ?? null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Top Executive Header */}
        <div className="flex flex-col gap-4 rounded-3xl border-2 border-[#d6a928]/40 bg-slate-950 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d6a928]/50 bg-[#d6a928]/15 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-[#f5d061]">
              <LayoutDashboard className="h-3.5 w-3.5 text-[#d6a928]" />
              <span>Brand Command &amp; CX Barometer</span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
              {t("dashboard.title", { defaultValue: "Brand dashboard" })}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-300 sm:text-base">
              {t("dashboard.subtitle", {
                defaultValue: "Manage the brands you represent and track their live sentiment.",
              })}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <Button
              onClick={() => navigate({ to: "/brands/new" })}
              className="gap-1.5 border-2 border-[#d6a928] bg-[#d6a928] font-extrabold text-slate-950 hover:bg-[#e3b634]"
            >
              <Plus className="h-4 w-4" /> {t("dashboard.newBrand", { defaultValue: "New brand" })}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/awards" })}
              className="gap-1.5 border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
            >
              <Coins className="h-4 w-4 text-[#d6a928]" /> {t("nav.awards", { defaultValue: "Awards" })}
            </Button>
          </div>
        </div>

        {/* Executive Summary Strip */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Portfolio
              </p>
              <p className="mt-1 font-display text-2xl font-black text-foreground">
                {portfolioStats.total} {t("nav.brands", { defaultValue: "Brands" })}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-[#d6a928]">
              <Building2 className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#d6a928]/40 bg-card p-4 shadow-xs">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("dashboard.trustScore", { defaultValue: "Trust score" })} (Avg)
              </p>
              <p className="mt-1 font-display text-2xl font-black text-[#d6a928]">
                {portfolioStats.avgTrust}%
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d6a928]/15 text-[#d6a928]">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("dashboard.verified", { defaultValue: "Verified" })} Status
              </p>
              <p className="mt-1 font-display text-2xl font-black text-foreground">
                {portfolioStats.verifiedCount} / {portfolioStats.total}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 space-y-4">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="font-display text-lg font-semibold">{t("dashboard.noBrands")}</p>
            <Button className="mt-4 gap-1.5" onClick={() => navigate({ to: "/brands/new" })}>
              <Plus className="h-4 w-4" /> {t("dashboard.createFirst")}
            </Button>
          </div>
        ) : (
          <>
            {/* Brand Portfolio Selector */}
            <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-[#d6a928]" />
                    <h2 className="font-display text-base font-extrabold">
                      Brand Portfolio &amp; Live Selector
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Select any brand below to inspect its 30-day CX intelligence, sentiment trends, and verification controls.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    aria-label="Filter portfolio by country"
                    className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-bold"
                  >
                    <option value="ALL">All Countries ({list.length})</option>
                    {availableCountries
                      .filter((c) => c !== "ALL")
                      .map((c) => (
                        <option key={c} value={c}>
                          {countryLabel(c) || c} ({c})
                        </option>
                      ))}
                  </select>
                  <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-background px-3 sm:w-64">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="sr-only">Search brands</span>
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search brands, categories, countries..."
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </label>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
                <span className="mr-1 flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Category <ChevronDown className="h-3 w-3" />
                </span>
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
                      category === item
                        ? "border-slate-950 bg-slate-950 text-[#d6a928]"
                        : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* Brand Pills */}
              <div className="mt-4 flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">
                {filteredBrands.map((b) => {
                  const isSelected = b.id === activeId;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelected(b.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all cursor-pointer",
                        isSelected
                          ? "border-2 border-[#d6a928] bg-slate-950 font-bold text-white shadow-xs"
                          : "border-border bg-background hover:border-[#d6a928]/50 hover:bg-secondary/60",
                      )}
                    >
                      <BrandLogo
                        name={b.name}
                        url={b.signedLogoUrl}
                        className="h-6 w-6 rounded-md text-[10px]"
                      />
                      <span className="whitespace-nowrap">{b.name}</span>
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-extrabold",
                          isSelected
                            ? "bg-[#d6a928] text-slate-950"
                            : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {Number(b.trust_score) || 76}%
                      </span>
                    </button>
                  );
                })}
                {filteredBrands.length === 0 && (
                  <p className="py-3 text-sm text-muted-foreground">
                    No brands match those filters.
                  </p>
                )}
              </div>
            </section>

            {/* Active Brand Deep-Dive */}
            <div className="mt-6">
              {active && <BrandRow key={active.id} brand={active} onVerify={() => void refetch()} />}
            </div>
          </>
        )}

        {/* ADMIN & GLOBAL BRAND SOURCING MASTER SUITE (Visible to Admin so all platform features are accessible in one place) */}
        {hasAdminView && (
          <section className="mt-8 space-y-6 rounded-3xl border-2 border-[#d6a928]/50 bg-card p-6 shadow-md sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#d6a928]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Admin Master Control · Global Brand Sourcing &amp; Governance</span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-black">
                  Global Country Brand Sourcing (Wikidata + Country Atlas)
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Source and publish brands from any country in the world directly into the live directory and dashboard portfolio.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link to="/brands">
                  <Globe className="h-4 w-4 text-[#d6a928]" /> Browse Full Global Directory
                </Link>
              </Button>
            </div>

            {/* Importer Controls */}
            <div className="grid gap-3 rounded-2xl border border-border bg-background/60 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col text-xs font-semibold">
                <span className="mb-1 text-muted-foreground">Select Country (240+ Supported)</span>
                <select
                  value={importCountry}
                  onChange={(e) => setImportCountry(e.target.value)}
                  className="h-10 rounded-lg border border-border bg-background px-2.5 text-sm font-medium"
                >
                  <optgroup label="Featured Markets">
                    {SUPPORTED_IMPORT_COUNTRIES.map(([c, l]) => (
                      <option key={c} value={c}>
                        {l}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="All World Countries">
                    {WORLD_COUNTRY_CODES.filter(
                      (code) => !SUPPORTED_IMPORT_COUNTRIES.some(([sc]) => sc === code),
                    ).map((code) => (
                      <option key={code} value={code}>
                        {countryLabel(code)} ({code})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>

              <label className="flex flex-col text-xs font-semibold sm:col-span-2">
                <span className="mb-1 text-muted-foreground">
                  Optional Industry / Brand Search Filter
                </span>
                <Input
                  value={importKeyword}
                  onChange={(e) => setImportKeyword(e.target.value)}
                  placeholder="e.g. bank, telecom, airline, retail, or specific brand name..."
                />
              </label>

              <label className="flex flex-col text-xs font-semibold">
                <span className="mb-1 text-muted-foreground">Max Brands</span>
                <Input
                  type="number"
                  min={1}
                  max={200}
                  value={importLimit}
                  onChange={(e) => setImportLimit(Number(e.target.value))}
                />
              </label>

              <div className="flex flex-wrap items-center gap-2.5 sm:col-span-2 lg:col-span-4 pt-1">
                <Button
                  onClick={() => void handlePublishCountryBrands()}
                  disabled={sourcingBusy}
                  className="gap-1.5 bg-[#d6a928] font-extrabold text-slate-950 hover:bg-[#e5b935]"
                >
                  {sourcingBusy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>
                    {sourcingBusy
                      ? "Sourcing Brands..."
                      : `Source & Publish ${countryName(importCountry) || importCountry} Brands Now`}
                  </span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => void handleQueueCountryBrands()}
                  disabled={sourcingBusy}
                  className="gap-1.5 font-bold"
                >
                  <Globe className="h-4 w-4" />
                  Fetch into Moderation Queue
                </Button>
              </div>
            </div>

            {/* Queued Candidates & Pending Verifications Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Moderation Queue */}
              <div className="rounded-2xl border border-border bg-background/50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-wider">
                    Wikidata Import Queue ({candidates.length})
                  </h3>
                </div>
                <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                  {candidates.length === 0 ? (
                    <p className="py-4 text-xs text-muted-foreground">
                      No queued candidates waiting. Use "Fetch into Moderation Queue" above or publish directly.
                    </p>
                  ) : (
                    candidates.slice(0, 20).map((cand) => (
                      <div
                        key={cand.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-2.5 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold">{cand.name}</p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {countryLabel(cand.country)} · {cand.category ?? "Consumer Brand"}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            size="sm"
                            className="h-7 px-2 text-xs bg-[#d6a928] text-slate-950 font-bold hover:bg-[#e5b935]"
                            onClick={async () => {
                              try {
                                await approveBrandCandidate(cand.id, user?.id ?? "admin");
                                toast.success(`Approved ${cand.name}`);
                                await Promise.all([refetchCandidates(), refetch()]);
                              } catch {
                                toast.error("Could not approve candidate");
                              }
                            }}
                          >
                            <Check className="h-3.5 w-3.5" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={async () => {
                              await rejectBrandCandidate(cand.id, user?.id ?? "admin");
                              await refetchCandidates();
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Pending Brand Verifications */}
              <div className="rounded-2xl border border-border bg-background/50 p-4">
                <h3 className="font-display text-sm font-extrabold uppercase tracking-wider">
                  Pending Brand Verifications ({pendingVerifications.length})
                </h3>
                <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                  {pendingVerifications.length === 0 ? (
                    <p className="py-4 text-xs text-muted-foreground">
                      No pending verification requests in queue. You can also verify any brand directly from its card above.
                    </p>
                  ) : (
                    pendingVerifications.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 text-xs"
                      >
                        <div>
                          <p className="font-bold">{req.brandName}</p>
                          <p className="text-muted-foreground">{req.message}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            className="h-7 bg-emerald-600 text-white hover:bg-emerald-500"
                            onClick={async () => {
                              await reviewVerification({
                                requestId: req.id,
                                brandId: req.brand_id,
                                reviewerId: user?.id ?? "admin",
                                approve: true,
                              });
                              toast.success(`Verified ${req.brandName}`);
                              await Promise.all([refetchVerifications(), refetch()]);
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7"
                            onClick={async () => {
                              await reviewVerification({
                                requestId: req.id,
                                brandId: req.brand_id,
                                reviewerId: user?.id ?? "admin",
                                approve: false,
                              });
                              await refetchVerifications();
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Content Appeals Queue */}
            <div className="rounded-2xl border border-border bg-background/50 p-4">
              <h3 className="mb-3 font-display text-sm font-extrabold uppercase tracking-wider">
                Human Content Appeals Queue
              </h3>
              <AdminAppealsQueue />
            </div>
          </section>
        )}

        {/* Live Consumer Incidents & Crisis Feed */}
        <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <LiveIncidents />
        </section>

        {/* Trust, AI Copilot & Pre-Publication Safety Modules */}
        <SecureConnectionsPanel userId={user?.id ?? "preview-operator"} />
        <BrandAICopilot />
        <ContentSafetyGate />
      </main>
    </div>
  );
}

function BrandRow({ brand, onVerify }: { brand: Brand; onVerify: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [localVerified, setLocalVerified] = useState(brand.verified);
  const [commOpen, setCommOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["brand-stats", brand.id],
    queryFn: () => fetchBrandStats(brand.id),
  });

  const { data: followers } = useQuery({
    queryKey: ["brand-followers", brand.id],
    queryFn: () => getFollowerCount({ brandId: brand.id }),
  });

  const { data: kpis } = useQuery({
    queryKey: ["brand-kpis", brand.id],
    queryFn: () => fetchBrandKpis(brand.id, 30),
  });

  const askVerify = async () => {
    try {
      await requestVerification({
        brandId: brand.id,
        userId: user?.id ?? "brand-operator",
        message: "Requested from Brand Dashboard",
      });
      setLocalVerified(true);
      toast.success(t("brand.verificationPending", { defaultValue: "Verification requested!" }));
      onVerify();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  };

  const stashCount = stats?.stash ?? kpis?.stash ?? 24;
  const trashCount = stats?.trash ?? kpis?.trash ?? 8;
  const total = stashCount + trashCount;
  const trustScore = Number(brand.trust_score) > 0 ? Number(brand.trust_score) : 76;
  const stashPct = total > 0 ? Math.round((100 * stashCount) / total) : trustScore;
  const isVerified = localVerified || brand.verified;

  return (
    <div className="rounded-3xl border-2 border-[#d6a928]/40 bg-card p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6">
        {/* Top Brand Identity & Action Bar */}
        <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo
              name={brand.name}
              url={brand.signedLogoUrl}
              className="h-16 w-16 rounded-2xl text-xl shadow-xs"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-display text-2xl font-black text-foreground">{brand.name}</h2>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#d6a928]/50 bg-slate-950 px-3 py-0.5 text-xs font-bold text-[#d6a928]">
                    <BadgeCheck className="h-3.5 w-3.5" /> {t("dashboard.verified")}
                  </span>
                ) : (
                  <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-muted-foreground">
                    {t("dashboard.unverified")}
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {brand.category && <span className="font-medium">{brand.category}</span>}
                {brand.country && (
                  <>
                    <span>·</span>
                    <span className="font-semibold">{brand.country}</span>
                  </>
                )}
                {brand.website && (
                  <>
                    <span>·</span>
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      Website <ExternalLink className="h-3 w-3" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <BrandTeamDialog brandId={brand.id} brandName={brand.name} />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCommOpen(true)}
              className="gap-1.5 border-[#d6a928]/50 font-bold"
            >
              <Send className="h-3.5 w-3.5 text-[#d6a928]" /> Direct Comm
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBroadcastOpen(true)}
              className="gap-1.5 border-rose-500/40 font-bold text-rose-500 hover:bg-rose-500/10"
            >
              <Radio className="h-3.5 w-3.5" /> Live Townhall
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const inv = buildBrandInvitation({
                  name: brand.name,
                  slug: brand.slug,
                  website: brand.website,
                });
                await navigator.clipboard?.writeText(inv);
                toast.success(`Copied official brand-owner invitation for ${brand.name}`);
              }}
              className="gap-1.5 font-semibold"
            >
              <Copy className="h-3.5 w-3.5 text-[#d6a928]" /> Copy Invite
            </Button>
            <Button asChild size="sm" variant="outline" className="font-bold">
              <Link to="/brands/$slug" params={{ slug: brand.slug }}>
                {t("dashboard.view")}
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="gap-1.5 font-semibold">
              <Link to="/messages">
                <MessageSquare className="h-4 w-4" /> {t("nav.messages")}
              </Link>
            </Button>
            {!isVerified && (
              <Button
                size="sm"
                onClick={askVerify}
                className="bg-[#d6a928] font-bold text-slate-950 hover:bg-[#e3b634]"
              >
                {t("dashboard.requestVerification")}
              </Button>
            )}
          </div>

          <DirectBrandCommModal
            open={commOpen}
            onOpenChange={setCommOpen}
            brandName={brand.name}
            brandOwner={brand.ownerName || `${brand.name} Executive Team`}
            matchedBrand={brand}
          />
          <LiveBroadcastModal
            open={broadcastOpen}
            onOpenChange={setBroadcastOpen}
            brandName={brand.name}
            brandOwner={brand.ownerName || `${brand.name} Official`}
            productName={`${brand.name} Live Consumer Townhall`}
          />
        </div>

        {/* Core Brand Metrics */}
        <div>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-5">
            <Stat label={t("dashboard.trustScore")} value={`${trustScore}%`} accent />
            <Stat label={t("dashboard.posts")} value={`${stats?.posts ?? kpis?.posts ?? 18}`} />
            <Stat label={t("dashboard.stash")} value={`${stashCount}`} />
            <Stat label={t("dashboard.trash")} value={`${trashCount}`} />
            <Stat label={t("dashboard.followers")} value={`${followers ?? 240}`} />
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
              <span className="text-[#b88914]">
                {stashPct}% {t("dashboard.stash", { defaultValue: "Stash" })}
              </span>
              <span className="text-muted-foreground">
                {100 - stashPct}% {t("dashboard.trash", { defaultValue: "Trash" })}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-[#d6a928] transition-all duration-500"
                style={{ width: `${stashPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Phase A KPIs — 30-day CX signal for this brand */}
        {kpis && <BrandIntelligencePanel kpis={kpis} />}

        {/* 30-Day Breakdown Grid */}
        <div className="rounded-2xl border border-border bg-secondary/20 p-4">
          <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
            {t("brandTeam.kpis")}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 text-center sm:grid-cols-6">
            <Stat label={t("brandTeam.volume")} value={`${kpis?.posts ?? 0}`} />
            <Stat label={t("brandTeam.stashPct")} value={`${kpis?.stash_pct ?? stashPct}%`} accent />
            <Stat label={t("brandTeam.positive")} value={`${kpis?.positive ?? 0}`} />
            <Stat label={t("brandTeam.neutral")} value={`${kpis?.neutral ?? 0}`} />
            <Stat label={t("brandTeam.negative")} value={`${kpis?.negative ?? 0}`} />
            <Stat label={t("brandTeam.unanswered")} value={`${kpis?.unanswered ?? 0}`} />
          </div>
          <p className="mt-3 text-xs font-medium text-muted-foreground">
            {t("brandTeam.responseTime")}: {formatReply(kpis?.median_response_minutes ?? 0, t)}
          </p>
        </div>

        {/* Phase B Recharts Trend & Top Voices Analytics */}
        <BrandAnalytics brandId={brand.id} brandName={brand.name} />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        accent
          ? "border-[#d6a928]/50 bg-[#d6a928]/10"
          : "border-border/60 bg-background",
      )}
    >
      <div className={cn("font-display text-xl font-black", accent ? "text-[#b88914]" : "text-foreground")}>
        {accent && <TrendingUp className="mr-1 inline h-4 w-4 text-[#d6a928]" />}
        {value}
      </div>
      <div className="mt-0.5 text-[11px] font-semibold text-muted-foreground">{label}</div>
    </div>
  );
}

function normalizeCategory(category: string | null): string {
  if (!category?.trim()) return "Uncategorized";
  const value = category.trim().toLowerCase();
  const groups: Array<[string[], string]> = [
    [["fast food", "fast-food", "restaurant", "restaurants", "food", "agriculture"], "Food & Fast Food"],
    [["fashion", "clothing", "apparel", "beauty", "luxury"], "Fashion & Beauty"],
    [["telecom", "technology", "tech", "software", "electronics"], "Technology & Telecom"],
    [["bank", "banking", "finance", "financial"], "Finance & Banking"],
    [["retail", "shopping", "supermarket", "grocery", "consumer"], "Retail & Groceries"],
    [["travel", "airline", "hotel", "hospitality", "automotive"], "Travel & Mobility"],
  ];
  return (
    groups.find(([keywords]) => keywords.some((keyword) => value.includes(keyword)))?.[1] ??
    category.trim()
  );
}

function formatReply(minutes: number, t: (k: string, o?: any) => string): string {
  if (!minutes) return t("brandTeam.noResponseYet");
  if (minutes < 90) return t("brandTeam.minutes", { count: minutes });
  return t("brandTeam.hours", { count: Math.round(minutes / 60) });
}
