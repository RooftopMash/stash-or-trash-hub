import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Award,
  Lock,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBrandBarometer } from "@/lib/ai-services";
import {
  calculateMoodysTrustRating,
  fetchOrLockMonthlySnapshots,
  type BrandRatingSnapshotRecord,
} from "@/lib/moodys-engine";
import { cn } from "@/lib/utils";

export function BrandMoodyRatingCard({
  brandName,
  brandSlug,
  stashPct = 50,
  totalVerdicts = 0,
  proofVerifiedVotes = 0,
  resolvedWithin14dSla = 0,
  unresolvedPast14dSla = 0,
  activeOemBatchRules = 2,
  authorizedDealerCount = 2,
  suspectedLeaksIntercepted = 0,
  corporateDomainVerified = true,
  sampleReviews = [],
  className,
}: {
  brandName: string;
  brandSlug?: string;
  stashPct?: number;
  totalVerdicts?: number;
  proofVerifiedVotes?: number;
  resolvedWithin14dSla?: number;
  unresolvedPast14dSla?: number;
  activeOemBatchRules?: number;
  authorizedDealerCount?: number;
  suspectedLeaksIntercepted?: number;
  corporateDomainVerified?: boolean;
  sampleReviews?: string[];
  className?: string;
}) {
  const [manualRefreshKey, setManualRefreshKey] = useState(0);
  const [snapshots, setSnapshots] = useState<BrandRatingSnapshotRecord[]>([]);
  const [snapshotsInPostgres, setSnapshotsInPostgres] = useState(false);

  const normalizedSlug =
    brandSlug ||
    brandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") ||
    "brand";

  const effectiveTotal = Math.max(totalVerdicts, 8);
  const effectiveProofVotes = Math.max(proofVerifiedVotes, Math.round(effectiveTotal * 0.25));
  const standardTotal = Math.max(0, effectiveTotal - effectiveProofVotes);
  const ratio = Math.max(0, Math.min(1, stashPct / 100));

  const sovereignRating = useMemo(
    () =>
      calculateMoodysTrustRating({
        brandSlug: normalizedSlug,
        brandName,
        proofVerifiedStashes: Math.round(effectiveProofVotes * ratio),
        proofVerifiedTrashes: Math.max(0, effectiveProofVotes - Math.round(effectiveProofVotes * ratio)),
        standardStashes: Math.round(standardTotal * ratio),
        standardTrashes: Math.max(0, standardTotal - Math.round(standardTotal * ratio)),
        resolvedWithin14dSla: Math.max(resolvedWithin14dSla, 3),
        unresolvedPast14dSla,
        totalComplaints: Math.max(resolvedWithin14dSla + unresolvedPast14dSla, 3),
        medianResolutionHours: 14,
        activeOemBatchRules,
        authorizedDealerCount,
        suspectedLeaksIntercepted,
        confirmedValidScans: effectiveProofVotes,
        corporateDomainVerified,
      }),
    [
      normalizedSlug,
      brandName,
      effectiveProofVotes,
      ratio,
      standardTotal,
      resolvedWithin14dSla,
      unresolvedPast14dSla,
      activeOemBatchRules,
      authorizedDealerCount,
      suspectedLeaksIntercepted,
      corporateDomainVerified,
    ],
  );

  useEffect(() => {
    let active = true;
    fetchOrLockMonthlySnapshots(normalizedSlug, sovereignRating).then((res) => {
      if (!active) return;
      setSnapshots(res.snapshots);
      setSnapshotsInPostgres(res.syncedToPostgres);
    });
    return () => {
      active = false;
    };
  }, [normalizedSlug, sovereignRating]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["brand-barometer", brandName, stashPct, totalVerdicts, manualRefreshKey],
    queryFn: () => fetchBrandBarometer(brandName, stashPct, totalVerdicts, sampleReviews),
    staleTime: 1000 * 60 * 10,
  });

  const getGradeColor = (grade?: string) => {
    const base = (grade || "").replace(/[+-]/g, "");
    switch (base) {
      case "AAA":
        return "from-amber-400 to-yellow-600 text-amber-950 border-amber-300 shadow-amber-500/20";
      case "AA":
        return "from-emerald-400 to-teal-600 text-emerald-950 border-emerald-300 shadow-emerald-500/20";
      case "A":
        return "from-blue-400 to-indigo-600 text-blue-950 border-blue-300 shadow-blue-500/20";
      case "BBB":
        return "from-slate-200 to-zinc-400 text-zinc-900 border-zinc-300 shadow-zinc-500/10";
      case "BB":
        return "from-orange-400 to-amber-600 text-orange-950 border-orange-300 shadow-orange-500/20";
      case "B":
        return "from-rose-400 to-red-600 text-rose-950 border-rose-300 shadow-rose-500/20";
      default:
        return "from-red-600 to-rose-900 text-white border-red-500 shadow-red-500/30";
    }
  };

  const displayGrade = sovereignRating.letterGrade;
  const latestSnapshot = snapshots[snapshots.length - 1];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Award className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {sovereignRating.methodologyVersion} · Sovereign Brand Credit Rating
            </span>
          </div>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-foreground">
            <span translate="no" className="notranslate">
              {brandName}
            </span>{" "}
            Moody&apos;s Trust Audit
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Proof-weighted consensus (5× verified scan/receipt vs 1× standard) · 14-day cure SLA ·
            OEM counterfeit shield.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setManualRefreshKey((k) => k + 1);
              void refetch();
            }}
            disabled={isFetching}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
            <span>Update Audit</span>
          </Button>

          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-xl bg-gradient-to-br px-4 py-2 border-2 min-w-24",
              getGradeColor(displayGrade),
            )}
          >
            <span className="text-2xl font-black font-mono tabular-nums tracking-tight leading-none">
              {displayGrade}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider mt-0.5 opacity-90">
              {sovereignRating.outlook} · {sovereignRating.compositeScore}
            </span>
          </div>
        </div>
      </div>

      {/* Deterministic Moody's 3-Pillar Breakdown Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        <div className="rounded-xl border border-border bg-background/60 p-3.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Proof-Weighted Trust</span>
            <span className="font-mono text-primary">5× VS 1×</span>
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-foreground mt-1">
            {sovereignRating.proofWeightedTrustScore.toFixed(1)}%
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {sovereignRating.proofVerifiedVotesTotal} receipt/scan proof ·{" "}
            {sovereignRating.standardVotesTotal} standard
            {sovereignRating.antiBrigadeDampingApplied ? " (Brigade-Damped)" : ""}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-3.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>14-Day Cure SLA</span>
            <Clock className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-foreground mt-1">
            {sovereignRating.slaResponseSpeedScore.toFixed(1)}
            <span className="text-xs font-normal text-muted-foreground"> / 100</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Cure Impact:{" "}
            <span
              className={cn(
                "font-mono font-semibold",
                sovereignRating.cureWindowAdjustment >= 0 ? "text-emerald-500" : "text-rose-500",
              )}
            >
              {sovereignRating.cureWindowAdjustment >= 0 ? "+" : ""}
              {sovereignRating.cureWindowAdjustment} pts
            </span>{" "}
            ({sovereignRating.slaResolutionRatePct}% SLA)
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background/60 p-3.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Counterfeit Shield</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-xl font-bold font-mono tabular-nums text-foreground mt-1">
            {sovereignRating.counterfeitInterceptScore.toFixed(1)}
            <span className="text-xs font-normal text-muted-foreground"> / 100</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {activeOemBatchRules} OEM prefix rules · {authorizedDealerCount} authorized hubs
          </p>
        </div>
      </div>

      {/* Immutable Monthly Trajectory Strip */}
      {snapshots.length > 0 && (
        <div className="mt-4 rounded-xl border border-border bg-background/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" />
              Immutable Monthly Credit Trajectory ({snapshots.length}-Month Lock)
            </span>
            {latestSnapshot && (
              <span className="text-[11px] font-mono text-muted-foreground">
                SHA-256 Lock: {latestSnapshot.locked_hash.slice(0, 14)}…{" "}
                {snapshotsInPostgres ? "(Postgres Verified)" : "(Local Audit Lock)"}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {snapshots.slice(-6).map((snap) => (
              <div
                key={snap.id}
                className="rounded-lg border border-border/80 bg-card px-2.5 py-2 text-center"
              >
                <p className="text-[10px] font-mono text-muted-foreground">{snap.snapshot_month}</p>
                <p className="text-sm font-black font-mono text-foreground mt-0.5">
                  {snap.letter_grade}
                </p>
                <p className="text-[10px] font-mono tabular-nums text-muted-foreground">
                  {Number(snap.composite_rating).toFixed(1)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verdict Summary + AI Sentiment Insights */}
      <div className="mt-4 rounded-xl border border-border/80 bg-secondary/20 p-4 text-xs">
        <p className="font-semibold text-foreground">{sovereignRating.summaryVerdict}</p>
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ) : data ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-border/80 bg-secondary/30 p-4">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Executive CX Sentiment Intelligence</span>
              </div>
              <Badge
                variant={data.cxOutlook === "POSITIVE" ? "default" : "secondary"}
                className={cn(
                  "gap-1 text-[11px]",
                  data.cxOutlook === "POSITIVE" && "bg-emerald-600 text-white",
                  data.cxOutlook === "CRITICAL_DEFICIT" && "bg-rose-600 text-white",
                )}
              >
                {data.cxOutlook === "POSITIVE" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{data.cxOutlook}</span>
              </Badge>
            </div>
            <p className="text-sm font-medium leading-relaxed text-foreground">
              {data.executiveBrief}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Top Stashes · Proof Signals</span>
              </div>
              <ul className="space-y-2">
                {data.topStashes.map((stash, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-medium text-foreground">
                    <span className="font-mono text-[11px] text-emerald-600 font-bold">
                      {idx + 1}.
                    </span>
                    <span>{stash}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-2.5">
                <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>Top Trashes · Cure SLA Focus</span>
              </div>
              <ul className="space-y-2">
                {data.topTrashes.map((trash, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-medium text-foreground">
                    <span className="font-mono text-[11px] text-rose-600 font-bold">{idx + 1}.</span>
                    <span>{trash}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
