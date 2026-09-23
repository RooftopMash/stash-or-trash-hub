import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Radio, TrendingUp, TrendingDown, Minus, ThumbsUp, ThumbsDown } from "lucide-react";
import { fetchBrandVerdict, BrandVerdictSummary } from "@/lib/brands";
import { supabase } from "@/integrations/supabase/client";
import coinIcon from "@/assets/icon-coin.png";
import binIcon from "@/assets/icon-bin.png";
import { cn } from "@/lib/utils";

export interface VerdictTallyProps {
  brandId: string;
  brandName?: string;
  className?: string;
  compact?: boolean;
  showLivePulse?: boolean;
}

/**
 * Verdict Tally component
 * Displays the real-time total count of 'Stash' vs 'Trash' votes for the current brand
 * with a high-fidelity, accessible dual-track progress bar layout and live Supabase subscription.
 */
export function VerdictTally({
  brandId,
  brandName,
  className,
  compact = false,
  showLivePulse = true,
}: VerdictTallyProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isLiveActive, setIsLiveActive] = useState(false);

  const queryKey = ["brand-verdict-tally", brandId];

  const { data: verdict, isLoading } = useQuery<BrandVerdictSummary>({
    queryKey,
    queryFn: () => fetchBrandVerdict(brandId, null),
    staleTime: 10_000,
  });

  // Subscribe to real-time changes on brand_votes for this brand
  useEffect(() => {
    if (!brandId) return;

    const channelName = `verdict-tally-${brandId}-${Date.now().toString(36)}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "brand_votes",
          filter: `brand_id=eq.${brandId}`,
        },
        () => {
          setIsLiveActive(true);
          void queryClient.invalidateQueries({ queryKey: ["brand-verdict-tally", brandId] });
          // Flash live indicator
          setTimeout(() => setIsLiveActive(false), 2000);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsLiveActive(false);
        }
      });

    // Also listen to local in-app engagement/vote events
    const handleLocalEngagement = () => {
      void queryClient.invalidateQueries({ queryKey: ["brand-verdict-tally", brandId] });
    };
    window.addEventListener("sot:engagement-change", handleLocalEngagement);

    return () => {
      window.removeEventListener("sot:engagement-change", handleLocalEngagement);
      void supabase.removeChannel(channel);
    };
  }, [brandId, queryClient]);

  const stash = verdict?.stash ?? 0;
  const trash = verdict?.trash ?? 0;
  const total = verdict?.total ?? (stash + trash);

  // If no votes exist yet, show 50-50 neutral split in the bar layout
  const hasVotes = total > 0;
  const stashPct = hasVotes ? Math.round((stash / total) * 100) : 50;
  const trashPct = hasVotes ? 100 - stashPct : 50;

  const isStashLeading = stash > trash;
  const isTrashLeading = trash > stash;
  const isTied = stash === trash && hasVotes;

  if (compact) {
    return (
      <div
        id={`verdict-tally-${brandId}`}
        className={cn(
          "w-full rounded-xl border border-border bg-card p-3 shadow-xs space-y-2",
          className
        )}
      >
        <div className="flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-stash">
            <img src={coinIcon} alt="" aria-hidden className="h-4 w-4 object-contain" />
            <span>{t("vote.stash", "Stash")}: {stash.toLocaleString()}</span>
            <span className="text-[10px] font-normal text-muted-foreground">({hasVotes ? `${stashPct}%` : "—"})</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            {showLivePulse && (
              <span className="flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className={cn(
                    "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping bg-emerald-400",
                    !isLiveActive && "hidden"
                  )} />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span>Live</span>
              </span>
            )}
            <span>· {total.toLocaleString()} {t("brand.votes", "votes")}</span>
          </div>

          <div className="flex items-center gap-1.5 text-trash">
            <span className="text-[10px] font-normal text-muted-foreground">({hasVotes ? `${trashPct}%` : "—"})</span>
            <span>{t("vote.trash", "Trash")}: {trash.toLocaleString()}</span>
            <img src={binIcon} alt="" aria-hidden className="h-4 w-4 object-contain" />
          </div>
        </div>

        {/* Real-time Progress Bar */}
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary/80 flex shadow-inner">
          <div
            className="h-full bg-stash transition-all duration-500 ease-out"
            style={{ width: `${stashPct}%` }}
            title={`Stash: ${stashPct}% (${stash} votes)`}
          />
          <div
            className="h-full bg-trash transition-all duration-500 ease-out"
            style={{ width: `${trashPct}%` }}
            title={`Trash: ${trashPct}% (${trash} votes)`}
          />
        </div>
      </div>
    );
  }

  return (
    <section
      id={`verdict-tally-${brandId}`}
      aria-labelledby={`verdict-tally-heading-${brandId}`}
      className={cn(
        "relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-all",
        className
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Radio className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3
              id={`verdict-tally-heading-${brandId}`}
              className="text-base font-bold tracking-tight text-foreground"
            >
              Verdict Tally
            </h3>
            <p className="text-xs text-muted-foreground">
              {brandName ? `Community sentiment for ${brandName}` : "Aggregated public votes"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Status Pill */}
          {showLivePulse && (
            <div
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-all",
                isLiveActive
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "border-border/80 bg-secondary/60 text-muted-foreground"
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Real-Time</span>
            </div>
          )}

          {/* Total Badge */}
          <div className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-bold text-foreground">
            {isLoading ? "..." : `${total.toLocaleString()} ${total === 1 ? "vote" : "votes"}`}
          </div>
        </div>
      </div>

      {/* Primary Tally Counter Cards */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Stash Tally Card */}
        <div
          className={cn(
            "relative flex flex-col justify-between overflow-hidden rounded-xl border p-4 transition-all",
            isStashLeading
              ? "border-stash/40 bg-stash/10 shadow-xs"
              : "border-border bg-card/60"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/80 shadow-xs border border-border/50">
                <img src={coinIcon} alt="" aria-hidden className="h-6 w-6 object-contain" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stash">
                  {t("vote.stash", "Stash")}
                </span>
                <p className="text-[11px] text-muted-foreground">Keep / Approve</p>
              </div>
            </div>
            {isStashLeading && (
              <span className="inline-flex items-center gap-1 rounded-full bg-stash/20 px-2 py-0.5 text-[10px] font-extrabold text-stash">
                <TrendingUp className="h-3 w-3" /> Leading
              </span>
            )}
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-display text-2xl font-black tracking-tight text-foreground">
              {stash.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-stash">
              {hasVotes ? `${stashPct}%` : "50%"}
            </span>
          </div>
        </div>

        {/* Trash Tally Card */}
        <div
          className={cn(
            "relative flex flex-col justify-between overflow-hidden rounded-xl border p-4 transition-all",
            isTrashLeading
              ? "border-trash/40 bg-trash/10 shadow-xs"
              : "border-border bg-card/60"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/80 shadow-xs border border-border/50">
                <img src={binIcon} alt="" aria-hidden className="h-6 w-6 object-contain" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-trash">
                  {t("vote.trash", "Trash")}
                </span>
                <p className="text-[11px] text-muted-foreground">Dump / Reject</p>
              </div>
            </div>
            {isTrashLeading && (
              <span className="inline-flex items-center gap-1 rounded-full bg-trash/20 px-2 py-0.5 text-[10px] font-extrabold text-trash">
                <TrendingDown className="h-3 w-3" /> Leading
              </span>
            )}
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-display text-2xl font-black tracking-tight text-foreground">
              {trash.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-trash">
              {hasVotes ? `${trashPct}%` : "50%"}
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Progress Bar Layout */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1 text-stash">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>Stash Share: {hasVotes ? `${stashPct}%` : "No votes yet"}</span>
          </span>
          <span className="flex items-center gap-1 text-trash">
            <span>Trash Share: {hasVotes ? `${trashPct}%` : "No votes yet"}</span>
            <ThumbsDown className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* Dual-Track Visual Progress Bar */}
        <div
          role="progressbar"
          aria-valuenow={stashPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Verdict progress bar: ${stashPct}% Stash vs ${trashPct}% Trash`}
          className="relative h-4 w-full overflow-hidden rounded-full bg-secondary/80 flex p-0.5 shadow-inner"
        >
          {hasVotes ? (
            <>
              <div
                className="h-full rounded-l-full bg-stash transition-all duration-700 ease-out flex items-center justify-end pr-1 text-[10px] font-black text-white"
                style={{ width: `${stashPct}%` }}
              >
                {stashPct >= 15 && `${stashPct}%`}
              </div>
              <div
                className="h-full rounded-r-full bg-trash transition-all duration-700 ease-out flex items-center justify-start pl-1 text-[10px] font-black text-white"
                style={{ width: `${trashPct}%` }}
              >
                {trashPct >= 15 && `${trashPct}%`}
              </div>
            </>
          ) : (
            <div className="h-full w-full rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
              Waiting for first vote
            </div>
          )}
        </div>

        {/* Footer Summary / Outcome Indicator */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            {isStashLeading && (
              <span className="font-semibold text-stash">
                Community consensus favors Stashing this brand ({stashPct}% positive).
              </span>
            )}
            {isTrashLeading && (
              <span className="font-semibold text-trash">
                Community consensus warns Trashing this brand ({trashPct}% negative).
              </span>
            )}
            {isTied && (
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <Minus className="h-3.5 w-3.5" />
                Dead Heat: Exactly tied {stash} to {trash}.
              </span>
            )}
            {!hasVotes && (
              <span>Be the first community member to cast a Stash or Trash vote!</span>
            )}
          </div>

          {hasVotes && (
            <div className="text-[11px] font-medium text-muted-foreground whitespace-nowrap">
              Ratio: {trash > 0 ? (stash / trash).toFixed(1) : stash > 0 ? "∞" : "1.0"}:1
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
