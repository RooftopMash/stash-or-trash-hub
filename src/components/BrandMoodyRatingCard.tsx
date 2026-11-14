import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Building2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBrandBarometer, type BrandBarometerSummary } from "@/lib/ai-services";
import { cn } from "@/lib/utils";

export function BrandMoodyRatingCard({
  brandName,
  stashPct = 50,
  totalVerdicts = 0,
  sampleReviews = [],
  className,
}: {
  brandName: string;
  stashPct?: number;
  totalVerdicts?: number;
  sampleReviews?: string[];
  className?: string;
}) {
  const [manualRefreshKey, setManualRefreshKey] = useState(0);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["brand-barometer", brandName, stashPct, totalVerdicts, manualRefreshKey],
    queryFn: () => fetchBrandBarometer(brandName, stashPct, totalVerdicts, sampleReviews),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  const getGradeColor = (grade?: string) => {
    switch (grade) {
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
      case "CCC":
      default:
        return "from-red-600 to-rose-900 text-white border-red-500 shadow-red-500/30";
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-md transition-all",
        className
      )}
    >
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Award className="h-4 w-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              Moody's Brand Barometer · CX Credit Rating
            </span>
          </div>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-foreground">
            <span translate="no" className="notranslate">{brandName}</span> Trust & Sentiment Audit
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Independent consumer credit analysis based on {totalVerdicts} verified community verdicts.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

          {/* Grade Badge */}
          {isLoading ? (
            <Skeleton className="h-14 w-24 rounded-xl" />
          ) : (
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-xl bg-gradient-to-br px-4 py-2 border-2 shadow-lg min-w-24",
                getGradeColor(data?.ratingGrade)
              )}
            >
              <span className="text-2xl font-black tracking-tight leading-none">
                {data?.ratingGrade || "BBB"}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider mt-0.5 opacity-90">
                {data?.cxOutlook || "STABLE"}
              </span>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      ) : data ? (
        <div className="mt-5 space-y-5">
          {/* Executive Brief */}
          <div className="rounded-xl border border-border/80 bg-secondary/30 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1.5">
              <Sparkles className="h-4 w-4" />
              <span>Executive CX Rating Brief</span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-foreground">
              {data.executiveBrief}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="outline" className="font-semibold text-[11px]">
                Rating: {data.ratingLabel}
              </Badge>
              <Badge
                variant={data.cxOutlook === "POSITIVE" ? "default" : "secondary"}
                className={cn(
                  "gap-1 text-[11px]",
                  data.cxOutlook === "POSITIVE" && "bg-emerald-600 hover:bg-emerald-700 text-white",
                  data.cxOutlook === "CRITICAL_DEFICIT" && "bg-rose-600 hover:bg-rose-700 text-white"
                )}
              >
                {data.cxOutlook === "POSITIVE" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>Outlook: {data.cxOutlook}</span>
              </Badge>
            </div>
          </div>

          {/* Top Stashes vs Top Trashes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Stashes */}
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>Top Stashes · What Consumers Love</span>
              </div>
              <ul className="space-y-2">
                {data.topStashes.map((stash, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-medium text-foreground">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{stash}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Trashes */}
            <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-2.5">
                <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>Top Trashes · Core Consumer Friction</span>
              </div>
              <ul className="space-y-2">
                {data.topTrashes.map((trash, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-medium text-foreground">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-[10px] font-bold text-rose-700 dark:text-rose-300 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{trash}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Priorities & Consumer Guidance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
            <div className="rounded-xl border border-border p-3 bg-card">
              <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block mb-1">
                Consumer Purchasing Guidance
              </span>
              <p className="text-foreground">{data.consumerRecommendation}</p>
            </div>
            <div className="rounded-xl border border-border p-3 bg-card">
              <span className="font-bold text-primary uppercase text-[10px] tracking-wider block mb-1">
                #1 Brand Strategic Imperative
              </span>
              <p className="text-foreground">{data.brandActionPriority}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
