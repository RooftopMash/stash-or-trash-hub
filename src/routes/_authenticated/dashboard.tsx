import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchMyBrands,
  fetchBrandStats,
  fetchBrandsByIds,
  requestVerification,
  type Brand,
} from "@/lib/brands";
import { fetchBrandKpis } from "@/lib/brand-platform";
import { BrandTeamDialog } from "@/components/BrandTeamDialog";
import { BrandAnalytics } from "@/components/BrandAnalytics";
import { BrandLogo } from "@/components/BrandLogo";
import { getFollowerCount } from "@/lib/social";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck, ChevronDown, MessageSquare, Plus, Search, SlidersHorizontal, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SecureConnectionsPanel } from "@/components/SecureConnectionsPanel";
import { BrandAICopilot } from "@/components/BrandAICopilot";
import { ContentSafetyGate } from "@/components/ContentSafetyGate";

export const Route = createFileRoute("/_authenticated/dashboard")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const [{ data: roles }, { data: memberships }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", data.user.id),
      supabase
        .from("brand_members")
        .select("id")
        .eq("user_id", data.user.id)
        .not("accepted_at", "is", null)
        .limit(1),
    ]);
    const canManage =
      (roles ?? []).some((r) => r.role === "brand" || r.role === "admin") ||
      (memberships ?? []).length > 0;
    if (!canManage) throw redirect({ to: "/profile" });
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All brands");

  const { data: brands, isLoading, refetch } = useQuery({
    queryKey: ["dashboard-brands", user?.id],
    queryFn: async () => {
      const ids = await fetchActiveManagedBrandIds(user!.id);
      if (ids.length > 0) {
        const list = await fetchBrandsByIds(ids.slice(0, 24));
        return ids
          .slice(0, 24)
          .map((id) => list.find((b) => b.id === id))
          .filter((b): b is Brand => !!b);
      }
      const owned = await fetchMyBrands(user!.id);
      return owned.slice(0, 12);
    },
    enabled: !!user,
  });

  const list = brands ?? [];
  const categories = useMemo(() => {
    const values = new Set(list.map((brand) => normalizeCategory(brand.category)));
    return ["All brands", ...Array.from(values).sort((a, b) => a.localeCompare(b))];
  }, [list]);
  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();
    return list.filter((brand) => {
      const matchesSearch = !query || `${brand.name} ${brand.category ?? ""} ${brand.country ?? ""}`.toLowerCase().includes(query);
      const matchesCategory = category === "All brands" || normalizeCategory(brand.category) === category;
      return matchesSearch && matchesCategory;
    });
  }, [category, list, search]);
  const activeId = selected && filteredBrands.some((brand) => brand.id === selected)
    ? selected
    : filteredBrands[0]?.id ?? null;
  const active = filteredBrands.find((b) => b.id === activeId) ?? null;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold">{t("dashboard.title")}</h1>
            <p className="mt-1 text-muted-foreground">{t("dashboard.subtitle")}</p>
          </div>
          <Button onClick={() => navigate({ to: "/brands/new" })} className="gap-1.5">
            <Plus className="h-4 w-4" /> {t("dashboard.newBrand")}
          </Button>
        </div>

        {user && <SecureConnectionsPanel userId={user.id} />}
        <BrandAICopilot />
        <ContentSafetyGate />

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
            <section className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-stash" />
                    <h2 className="font-display text-sm font-bold">Your brand portfolio</h2>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Search and filter your active brands without loading the full catalog.
                  </p>
                </div>
                <label className="flex h-10 w-full items-center gap-2 rounded-xl border border-border bg-background px-3 lg:max-w-xs">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="sr-only">Search brands</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search brands, categories, countries"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </label>
              </div>
              <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
                <span className="mr-1 flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Category <ChevronDown className="h-3 w-3" />
                </span>
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      category === item
                        ? "border-stash bg-stash/10 text-foreground"
                        : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {filteredBrands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelected(b.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                      b.id === activeId
                        ? "border-stash bg-stash/10 font-semibold"
                        : "border-border hover:bg-secondary",
                    )}
                  >
                    <BrandLogo name={b.name} url={b.signedLogoUrl} className="h-6 w-6 rounded-md text-[10px]" />
                    <span>{b.name}</span>
                  </button>
                ))}
                {filteredBrands.length === 0 && (
                  <p className="py-3 text-sm text-muted-foreground">No brands match those filters.</p>
                )}
              </div>
            </section>

            <div className="mt-6">
              {active && <BrandRow key={active.id} brand={active} onVerify={() => refetch()} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function BrandRow({ brand, onVerify }: { brand: Brand; onVerify: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
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
    if (!user) return;
    try {
      await requestVerification({ brandId: brand.id, userId: user.id, message: "" });
      toast.success(t("brand.verificationPending"));
      onVerify();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    }
  };

  const total = (stats?.stash ?? 0) + (stats?.trash ?? 0);
  const stashPct = total > 0 ? Math.round((100 * (stats?.stash ?? 0)) / total) : 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <BrandLogo name={brand.name} url={brand.signedLogoUrl} className="h-14 w-14 rounded-xl text-lg" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold">{brand.name}</h2>
            {brand.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                <BadgeCheck className="h-3.5 w-3.5" /> {t("dashboard.verified")}
              </span>
            ) : (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {t("dashboard.unverified")}
              </span>
            )}
          </div>
          {brand.category && <p className="text-sm text-muted-foreground">{brand.category}</p>}

          <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-5">
            <Stat label={t("dashboard.trustScore")} value={`${brand.trust_score}`} accent />
            <Stat label={t("dashboard.posts")} value={`${stats?.posts ?? 0}`} />
            <Stat label={t("dashboard.stash")} value={`${stats?.stash ?? 0}`} />
            <Stat label={t("dashboard.trash")} value={`${stats?.trash ?? 0}`} />
            <Stat label={t("dashboard.followers")} value={`${followers ?? 0}`} />
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-stash transition-all" style={{ width: `${stashPct}%` }} />
          </div>

          {/* Phase A KPIs — 30-day CX signal for this brand */}
          <div className="mt-4 rounded-xl border border-border p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("brandTeam.kpis")}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3 text-center sm:grid-cols-6">
              <Stat label={t("brandTeam.volume")} value={`${kpis?.posts ?? 0}`} />
              <Stat label={t("brandTeam.stashPct")} value={`${kpis?.stash_pct ?? 0}%`} accent />
              <Stat label={t("brandTeam.positive")} value={`${kpis?.positive ?? 0}`} />
              <Stat label={t("brandTeam.neutral")} value={`${kpis?.neutral ?? 0}`} />
              <Stat label={t("brandTeam.negative")} value={`${kpis?.negative ?? 0}`} />
              <Stat label={t("brandTeam.unanswered")} value={`${kpis?.unanswered ?? 0}`} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("brandTeam.responseTime")}: {formatReply(kpis?.median_response_minutes ?? 0, t)}
            </p>
          </div>

          <BrandAnalytics brandId={brand.id} brandName={brand.name} />

          <div className="mt-4 flex flex-wrap gap-2">
            <BrandTeamDialog brandId={brand.id} brandName={brand.name} />
            <Button asChild size="sm" variant="outline">
              <Link to="/brands/$slug" params={{ slug: brand.slug }}>
                {t("dashboard.view")}
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost" className="gap-1.5">
              <Link to="/messages">
                <MessageSquare className="h-4 w-4" /> {t("nav.messages")}
              </Link>
            </Button>
            {!brand.verified && (
              <Button size="sm" variant="ghost" onClick={askVerify}>
                {t("dashboard.requestVerification")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-secondary/50 p-2">
      <div className={`font-display text-xl font-extrabold ${accent ? "text-stash" : ""}`}>
        {accent && <TrendingUp className="mr-1 inline h-4 w-4" />}
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function normalizeCategory(category: string | null): string {
  if (!category?.trim()) return "Uncategorized";
  const value = category.trim().toLowerCase();
  const groups: Array<[string[], string]> = [
    [["fast food", "fast-food", "restaurant", "restaurants", "food"], "Food & Fast Food"],
    [["fashion", "clothing", "apparel", "beauty"], "Fashion & Beauty"],
    [["telecom", "technology", "tech", "software", "electronics"], "Technology & Telecom"],
    [["bank", "banking", "finance", "financial"], "Finance & Banking"],
    [["retail", "shopping", "supermarket", "grocery"], "Retail & Groceries"],
    [["travel", "airline", "hotel", "hospitality"], "Travel & Hospitality"],
  ];
  return groups.find(([keywords]) => keywords.some((keyword) => value.includes(keyword)))?.[1] ?? category.trim();
}

function formatReply(minutes: number, t: (k: string, o?: any) => string): string {
  if (!minutes) return t("brandTeam.noResponseYet");
  if (minutes < 90) return t("brandTeam.minutes", { count: minutes });
  return t("brandTeam.hours", { count: Math.round(minutes / 60) });
}
