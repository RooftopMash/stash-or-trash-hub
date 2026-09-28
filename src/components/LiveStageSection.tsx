import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Radio,
  Rocket,
  Video,
  Eye,
  Gift,
  Coins,
  Recycle,
  Check,
  BellRing,
  Sparkles,
  MapPin,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LiveBroadcastModal } from "@/components/LiveBroadcastModal";
import { playCoinSpinSound, playTrashSound } from "@/lib/verdict-sounds";
import {
  BRAND_BROADCAST_CATEGORIES,
  CONSUMER_BROADCAST_CATEGORIES,
  getLiveBroadcastSessions,
  voteOnLiveBroadcast,
  getUserLiveVote,
  claimLiveLaunchPerk,
  getClaimedLaunchPerks,
  type LiveBroadcastSession,
  type BroadcastPersona,
  type BrandBroadcastCategory,
} from "@/lib/live-broadcasts";
import { cn } from "@/lib/utils";

interface LiveStageSectionProps {
  compact?: boolean;
  defaultFilter?: "all" | "brand_owner" | "consumer";
  brandNameFilter?: string;
}

export function LiveStageSection({
  compact = false,
  defaultFilter = "all",
  brandNameFilter,
}: LiveStageSectionProps) {
  const [sessions, setSessions] = useState<LiveBroadcastSession[]>(() => getLiveBroadcastSessions());
  const [filter, setFilter] = useState<"all" | "brand_owner" | "consumer">(defaultFilter);
  const [claimedIds, setClaimedIds] = useState<Record<string, boolean>>({});
  const [votedMap, setVotedMap] = useState<Record<string, "stash" | "trash" | null>>({});

  // Studio Modal state
  const [studioOpen, setStudioOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<LiveBroadcastSession | null>(null);
  const [launchPersona, setLaunchPersona] = useState<BroadcastPersona>("brand_owner");
  const [launchCategory, setLaunchCategory] = useState<BrandBroadcastCategory>("product_launch");

  const refreshStage = () => {
    const list = getLiveBroadcastSessions();
    setSessions(list);
    const claims = getClaimedLaunchPerks();
    const claimMap: Record<string, boolean> = {};
    for (const c of claims) {
      claimMap[c.broadcastId] = true;
    }
    setClaimedIds(claimMap);

    const votes: Record<string, "stash" | "trash" | null> = {};
    for (const s of list) {
      votes[s.id] = getUserLiveVote(s.id);
    }
    setVotedMap(votes);
  };

  useEffect(() => {
    refreshStage();
    const onUpdate = () => refreshStage();
    window.addEventListener("sot-live-broadcasts-changed", onUpdate);
    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel("sot-live-broadcasts-sync");
        bc.onmessage = () => refreshStage();
      } catch {
        // ignore
      }
    }
    return () => {
      window.removeEventListener("sot-live-broadcasts-changed", onUpdate);
      bc?.close();
    };
  }, []);

  const visibleSessions = sessions.filter((s) => {
    if (filter !== "all" && s.persona !== filter) return false;
    if (
      brandNameFilter &&
      s.brandName.toLowerCase() !== brandNameFilter.toLowerCase()
    ) {
      return false;
    }
    return true;
  });

  const handleVote = (session: LiveBroadcastSession, verdict: "stash" | "trash") => {
    if (verdict === "stash") playCoinSpinSound();
    else playTrashSound();

    voteOnLiveBroadcast(session.id, verdict);
    refreshStage();
    toast.success(
      verdict === "stash"
        ? `🪙 Stashed "${session.title}"! Live market pulse updated.`
        : `🗑️ Trashed "${session.title}". Live market pulse updated.`,
    );
  };

  const handleClaimPerk = async (session: LiveBroadcastSession) => {
    if (!session.launchPerk) return;
    const res = claimLiveLaunchPerk(session.id);
    refreshStage();
    try {
      await navigator.clipboard?.writeText(session.launchPerk.promoCode);
    } catch {
      // ignore
    }
    toast.success(
      res.alreadyClaimed
        ? `🎁 Promo code ${session.launchPerk.promoCode} copied again! View all perks in your Consumer Profile Wallet.`
        : `🎁 Claimed "${session.launchPerk.title}"! Code ${session.launchPerk.promoCode} copied & saved to your Consumer Profile Wallet.`,
    );
  };

  const openHostStudio = (persona: BroadcastPersona, category: BrandBroadcastCategory = "product_launch") => {
    setSelectedSession(null);
    setLaunchPersona(persona);
    setLaunchCategory(category);
    setStudioOpen(true);
  };

  const openWatchSession = (session: LiveBroadcastSession) => {
    setSelectedSession(session);
    setLaunchPersona(session.persona);
    if (session.brandCategory) setLaunchCategory(session.brandCategory);
    setStudioOpen(true);
  };

  return (
    <section
      aria-label="Live Brand Launches, Relaunches and Consumer Broadcasts"
      className="rounded-3xl border-2 border-[#d6a928]/50 bg-slate-950 p-5 text-white shadow-lg sm:p-7"
    >
      {/* Top Stage Header */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              LIVE STAGE
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6a928]/50 bg-[#d6a928]/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#f5d061]">
              <Rocket className="h-3.5 w-3.5 text-[#d6a928]" />
              Brand Product Launches, Relaunches &amp; Consumer Cams
            </span>
          </div>
          <h2 className="mt-2.5 font-display text-xl font-black tracking-tight text-white sm:text-2xl">
            Watch Live Brand Reveals, Vote Stash or Trash &amp; Claim Instant Launch Perks
          </h2>
          <p className="mt-1 max-w-3xl text-xs text-slate-300 sm:text-sm">
            Brand Owners broadcast product launches, relaunches, and factory tours directly to clients &amp; prospects — while consumers stream real-time store and batch situations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => openHostStudio("brand_owner", "product_launch")}
            className="gap-1.5 bg-[#d6a928] font-black text-slate-950 hover:bg-[#e5b935]"
          >
            <Rocket className="h-4 w-4" />
            Host Brand Launch / Relaunch
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => openHostStudio("consumer")}
            className="gap-1.5 border-rose-500/60 bg-rose-600/15 font-bold text-rose-300 hover:bg-rose-600/25 hover:text-white"
          >
            <Video className="h-4 w-4" />
            Consumer Situation Cam
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-extrabold transition cursor-pointer",
              filter === "all"
                ? "bg-[#d6a928] text-slate-950"
                : "text-slate-300 hover:text-white",
            )}
          >
            All Live Streams ({sessions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("brand_owner")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-extrabold transition cursor-pointer",
              filter === "brand_owner"
                ? "bg-[#d6a928] text-slate-950"
                : "text-slate-300 hover:text-white",
            )}
          >
            🚀 Official Brand Launches &amp; Relaunches (
            {sessions.filter((s) => s.persona === "brand_owner").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("consumer")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-extrabold transition cursor-pointer",
              filter === "consumer"
                ? "bg-rose-600 text-white"
                : "text-slate-300 hover:text-white",
            )}
          >
            📹 Consumer Situation Cams (
            {sessions.filter((s) => s.persona === "consumer").length})
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <BellRing className="h-3.5 w-3.5 text-[#d6a928]" />
          <span>Followers are auto-alerted when a Brand goes live</span>
        </div>
      </div>

      {/* Broadcast Cards Grid */}
      <div
        className={cn(
          "mt-5 grid gap-4",
          compact ? " sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-2",
        )}
      >
        {visibleSessions.slice(0, compact ? 2 : 4).map((session) => {
          const totalVotes = Math.max(1, session.stashVotes + session.trashVotes);
          const stashPct = Math.round((session.stashVotes / totalVotes) * 100);
          const userVote = votedMap[session.id];
          const isClaimed = !!claimedIds[session.id];

          const brandCatInfo = session.brandCategory
            ? BRAND_BROADCAST_CATEGORIES.find((c) => c.id === session.brandCategory)
            : null;
          const consumerCatInfo = session.consumerCategory
            ? CONSUMER_BROADCAST_CATEGORIES.find((c) => c.id === session.consumerCategory)
            : null;

          return (
            <div
              key={session.id}
              className={cn(
                "flex flex-col justify-between rounded-2xl border p-4 transition-all",
                session.persona === "brand_owner"
                  ? "border-[#d6a928]/40 bg-slate-900/90 hover:border-[#d6a928]"
                  : "border-slate-800 bg-slate-900/60 hover:border-rose-500/50",
              )}
            >
              <div>
                {/* Card Top Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                      LIVE
                    </span>
                    {session.persona === "brand_owner" ? (
                      <span className="rounded-md bg-[#d6a928] px-2 py-0.5 text-[10px] font-black text-slate-950">
                        {brandCatInfo?.shortBadge || "🚀 Brand Broadcast"}
                      </span>
                    ) : (
                      <span className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                        {consumerCatInfo?.shortBadge || "📹 Consumer Cam"}
                      </span>
                    )}
                    {session.brandSlug ? (
                      <Link
                        to="/brands/$slug"
                        params={{ slug: session.brandSlug }}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-[#f5d061] hover:underline"
                      >
                        <Building2 className="h-3 w-3" />
                        {session.brandName}
                      </Link>
                    ) : (
                      <span className="text-xs font-extrabold text-[#f5d061]">
                        {session.brandName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300 tabular-nums">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-emerald-400" />
                      {session.viewerCount}
                    </span>
                    {session.followersNotified ? (
                      <span className="text-[10px] text-slate-400">
                        · 🔔 {session.followersNotified.toLocaleString()} alerted
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="mt-2.5 font-display text-base font-extrabold text-white leading-snug">
                  {session.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {session.subtitle}
                </p>

                {/* Host & Location Metadata */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-200">{session.hostName}</span>
                  <span>·</span>
                  <span>{session.hostRoleLabel}</span>
                  {session.storeLocation && (
                    <>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 text-slate-300">
                        <MapPin className="h-3 w-3 text-[#d6a928]" />
                        {session.storeLocation}
                      </span>
                    </>
                  )}
                </div>

                {/* Claimable Launch Perk Banner (if Brand attached a voucher) */}
                {session.launchPerk && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#d6a928]/50 bg-[#d6a928]/10 p-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d6a928] text-slate-950">
                        <Gift className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#f5d061]">
                            {session.launchPerk.discountLabel}
                          </span>
                          <span className="text-[10px] text-slate-400 tabular-nums">
                            ({session.launchPerk.totalAvailable - session.launchPerk.claimedCount} left)
                          </span>
                        </div>
                        <p className="truncate text-xs font-bold text-white">
                          {session.launchPerk.title}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void handleClaimPerk(session)}
                      className={cn(
                        "h-8 px-3 text-xs font-black shrink-0",
                        isClaimed
                          ? "bg-emerald-600 text-white hover:bg-emerald-500"
                          : "bg-[#d6a928] text-slate-950 hover:bg-[#e5b935]",
                      )}
                    >
                      {isClaimed ? (
                        <>
                          <Check className="mr-1 h-3.5 w-3.5" /> {session.launchPerk.promoCode}
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-1 h-3.5 w-3.5" /> Claim Launch Perk
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Bottom Bar: Live Stash/Trash Launch Pulse + Watch Stream CTA */}
              <div className="mt-4 border-t border-slate-800 pt-3">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#f5d061] tabular-nums">
                    🪙 {stashPct}% Stash ({session.stashVotes})
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">
                    {session.persona === "brand_owner" ? "Live Launch Pulse" : "Live Community Verdict"}
                  </span>
                  <span className="text-rose-400 tabular-nums">
                    🗑️ {100 - stashPct}% Trash ({session.trashVotes})
                  </span>
                </div>
                <div className="mt-1.5 flex h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-[#d6a928] transition-all duration-500"
                    style={{ width: `${stashPct}%` }}
                  />
                  <div
                    className="bg-rose-600 transition-all duration-500"
                    style={{ width: `${100 - stashPct}%` }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleVote(session, "stash")}
                      className={cn(
                        "h-8 gap-1 px-2.5 text-xs font-black",
                        userVote === "stash"
                          ? "bg-[#d6a928] text-slate-950 ring-2 ring-white"
                          : "bg-slate-800 text-[#f5d061] hover:bg-[#d6a928] hover:text-slate-950",
                      )}
                    >
                      <Coins className="h-3.5 w-3.5" /> Stash ({session.stashVotes})
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleVote(session, "trash")}
                      className={cn(
                        "h-8 gap-1 px-2.5 text-xs font-black",
                        userVote === "trash"
                          ? "bg-rose-600 text-white ring-2 ring-white"
                          : "bg-slate-800 text-slate-300 hover:bg-rose-600 hover:text-white",
                      )}
                    >
                      <Recycle className="h-3.5 w-3.5" /> Trash ({session.trashVotes})
                    </Button>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => openWatchSession(session)}
                    className="h-8 gap-1.5 bg-white px-3 text-xs font-black text-slate-950 hover:bg-slate-200"
                  >
                    <Radio className="h-3.5 w-3.5 text-rose-600 animate-pulse" />
                    Watch &amp; Engage Live
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <LiveBroadcastModal
        open={studioOpen}
        onOpenChange={setStudioOpen}
        brandName={selectedSession?.brandName || brandNameFilter || "SOT Brand Showcase"}
        brandSlug={selectedSession?.brandSlug}
        brandOwner={selectedSession?.brandOwner || "Verified Brand Owner"}
        productName={selectedSession?.title || "Live Product Launch & Client Q&A"}
        defaultMode="broadcast"
        customRoomChannel={selectedSession?.roomChannel}
        initialPersona={launchPersona}
        initialBrandCategory={launchCategory}
        activeBroadcastId={selectedSession?.id}
      />
    </section>
  );
}
