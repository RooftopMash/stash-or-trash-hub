import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
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
import { fetchAccessibleBrandIds, fetchBrandKpis } from "@/lib/brand-platform";
import { BrandTeamDialog } from "@/components/BrandTeamDialog";
import { BrandAnalytics } from "@/components/BrandAnalytics";
import { BrandLogo } from "@/components/BrandLogo";
import { getFollowerCount } from "@/lib/social";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck, MessageSquare, Plus, TrendingUp } from "lucide-react";
import { toast } from "sonner";

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
  const activeId = selected ?? list[0]?.id ?? null;
  const active = list.find((b) => b.id === activeId) ?? null;

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
            <div className="mt-6 flex flex-wrap gap-2">
              {list.map((b) => (
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
                  {b.name}
                </button>
              ))}
            </div>

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

function formatReply(minutes: number, t: (k: string, o?: any) => string): string {
  if (!minutes) return t("brandTeam.noResponseYet");
  if (minutes < 90) return t("brandTeam.minutes", { count: minutes });
  return t("brandTeam.hours", { count: Math.round(minutes / 60) });
}
