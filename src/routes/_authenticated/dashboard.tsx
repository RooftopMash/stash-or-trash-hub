import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { fetchBrandStats, requestVerification, type Brand } from "@/lib/brands";
import {
  fetchAllUserBrands,
  fetchDashboardKPIs,
  fetchCrisisAlerts,
  acknowledgeCrisisAlert,
  resolvePendingInvites,
  type BrandRole,
} from "@/lib/brand-platform";
import { getFollowerCount } from "@/lib/social";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BrandTeamManager } from "@/components/BrandTeamManager";
import { BrandWebhookManager } from "@/components/BrandWebhookManager";
import {
  BadgeCheck,
  MessageSquare,
  Plus,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  HelpCircle,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
  },
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Resolve pending invites on page load
  useEffect(() => {
    if (user?.id && user?.email) {
      void resolvePendingInvites(user.id, user.email);
    }
  }, [user]);

  // Fetch all brands user owns or is a team member on
  const { data: userBrands, isLoading: brandsLoading, refetch } = useQuery({
    queryKey: ["user-brands", user?.id],
    queryFn: () => (user ? fetchAllUserBrands(user.id) : []),
    enabled: !!user,
  });

  const brandIds = (userBrands ?? []).map((b) => b.id);

  // Fetch aggregate KPIs for user's brands
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["dashboard-kpis", brandIds],
    queryFn: () => fetchDashboardKPIs(brandIds),
    enabled: brandIds.length > 0,
  });

  // Fetch crisis alerts
  const { data: crisisAlerts, refetch: refetchAlerts } = useQuery({
    queryKey: ["crisis-alerts", brandIds],
    queryFn: () => fetchCrisisAlerts(brandIds),
    enabled: brandIds.length > 0,
    refetchInterval: 10000,
  });

  const ackMutation = useMutation({
    mutationFn: (alertId: string) => acknowledgeCrisisAlert(alertId),
    onSuccess: () => {
      toast.success("Crisis alert acknowledged.");
      void refetchAlerts();
    },
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold">{t("dashboard.title")}</h1>
            <p className="mt-1 text-muted-foreground">
              Enterprise Dashboard & Multi-Brand Workspace
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="gap-1.5">
              <Link to="/analytics">
                <BarChart3 className="h-4 w-4" /> Analytics
              </Link>
            </Button>
            <Button onClick={() => navigate({ to: "/brands/new" })} className="gap-1.5">
              <Plus className="h-4 w-4" /> {t("dashboard.newBrand")}
            </Button>
          </div>
        </div>

        {/* Crisis Alert Banner */}
        {crisisAlerts && crisisAlerts.length > 0 && (
          <div className="mt-6 space-y-3">
            {crisisAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-destructive"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive text-destructive-foreground">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">
                      Crisis Alert — {alert.brandName}
                    </h4>
                    <p className="text-xs opacity-90">{alert.message}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => ackMutation.mutate(alert.id)}
                  disabled={ackMutation.isPending}
                  className="gap-1"
                >
                  <CheckCircle2 className="h-4 w-4" /> Acknowledge
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Aggregate KPIs Summary Card */}
        {brandIds.length > 0 && (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Key Performance Indicators (KPIs)
            </h2>

            {kpisLoading ? (
              <Skeleton className="h-24 w-full rounded-xl" />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div className="rounded-xl bg-secondary/50 p-3 text-center">
                  <span className="block text-xs font-medium text-muted-foreground">Post Volume</span>
                  <span className="font-display text-2xl font-extrabold text-foreground">
                    {kpis?.postVolume ?? 0}
                  </span>
                </div>

                <div className="rounded-xl bg-secondary/50 p-3 text-center">
                  <span className="block text-xs font-medium text-muted-foreground">Stash %</span>
                  <span className="font-display text-2xl font-extrabold text-stash">
                    {kpis?.stashPct ?? 0}%
                  </span>
                </div>

                <div className="rounded-xl bg-secondary/50 p-3 text-center">
                  <span className="block text-xs font-medium text-muted-foreground">Sentiment Split</span>
                  <div className="mt-1 flex items-center justify-center gap-2 text-xs font-bold">
                    <span className="text-stash flex items-center gap-0.5">
                      <Smile className="h-3.5 w-3.5" /> {kpis?.sentimentSplit.positive ?? 0}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-0.5">
                      <Meh className="h-3.5 w-3.5" /> {kpis?.sentimentSplit.neutral ?? 0}
                    </span>
                    <span className="text-trash flex items-center gap-0.5">
                      <Frown className="h-3.5 w-3.5" /> {kpis?.sentimentSplit.negative ?? 0}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-secondary/50 p-3 text-center">
                  <span className="block text-xs font-medium text-muted-foreground">Unanswered</span>
                  <span className="font-display text-2xl font-extrabold text-amber-500 flex items-center justify-center gap-1">
                    <HelpCircle className="h-4 w-4" />
                    {kpis?.unansweredCount ?? 0}
                  </span>
                </div>

                <div className="rounded-xl bg-secondary/50 p-3 text-center">
                  <span className="block text-xs font-medium text-muted-foreground">Median Response</span>
                  <span className="font-display text-2xl font-extrabold text-foreground flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4 text-primary" />
                    {kpis?.medianResponseTimeHours !== null ? `${kpis?.medianResponseTimeHours}h` : "N/A"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Brand List */}
        <div className="mt-8 space-y-4">
          <h2 className="font-display text-xl font-bold">Your Brands & Team Workspaces</h2>

          {brandsLoading ? (
            [0, 1].map((i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
          ) : (userBrands ?? []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="font-display text-lg font-semibold">{t("dashboard.noBrands")}</p>
              <Button className="mt-4 gap-1.5" onClick={() => navigate({ to: "/brands/new" })}>
                <Plus className="h-4 w-4" /> {t("dashboard.createFirst")}
              </Button>
            </div>
          ) : (
            (userBrands ?? []).map((b) => (
              <BrandRow key={b.id} brand={b} userRole={b.userRole} onVerify={() => refetch()} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function BrandRow({
  brand,
  userRole,
  onVerify,
}: {
  brand: Brand;
  userRole?: BrandRole;
  onVerify: () => void;
}) {
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
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary text-lg font-bold">
          {brand.signedLogoUrl ? (
            <img src={brand.signedLogoUrl} alt={brand.name} className="h-full w-full object-cover" />
          ) : (
            brand.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-bold">{brand.name}</h3>
            {brand.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                <BadgeCheck className="h-3.5 w-3.5" /> {t("dashboard.verified")}
              </span>
            ) : (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {t("dashboard.unverified")}
              </span>
            )}
            {userRole && (
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                Role: {userRole}
              </Badge>
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

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/brands/$slug" params={{ slug: brand.slug }}>
                {t("dashboard.view")}
              </Link>
            </Button>
            <BrandTeamManager brandId={brand.id} brandName={brand.name} userRole={userRole} />
            {userRole === "admin" && (
              <BrandWebhookManager brandId={brand.id} brandName={brand.name} />
            )}
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
