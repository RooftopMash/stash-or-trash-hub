import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import {
  ArrowRight,
  BadgeCheck,
  Coins,
  Handshake,
  Lightbulb,
  Recycle,
  Rocket,
  ShieldCheck,
  Trophy,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Layers,
  Gauge,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchFeed } from "@/lib/stash";
import { fetchBrands } from "@/lib/brands";
import {
  BRAND_TIERS,
  type BrandTierFilter,
  getBrandTier,
  getTierInfo,
  matchesTier,
  compareBrandTiers,
} from "@/lib/brandTiers";
import { BrandLogo } from "@/components/BrandLogo";
import { LiveStageSection } from "@/components/LiveStageSection";
import { HeroInteractiveStage } from "@/components/HeroInteractiveStage";
import { VerdictSuccess, triggerVerdictSuccess } from "@/components/VerdictSuccess";
import { useRoles } from "@/hooks/useRoles";
import { playCoinSpinSound, playTrashSound } from "@/lib/verdict-sounds";
import { cn } from "@/lib/utils";
import coinIcon from "@/assets/icon-coin.webp";
import coinsWatermark from "@/assets/watermark-coins.webp";
import binsWatermark from "@/assets/watermark-bins.webp";

interface FallingCoinSpec {
  id: string;
  leftPct: number;
  sizePx: number;
  animationName: string;
  durationSec: number;
  delaySec: number;
  opacity: number;
}

const BASE_CHAOTIC_COINS: FallingCoinSpec[] = [
  // Horizontal flat-spinning coins catching air drag (15-24px smaller than Option A bins)
  {
    id: "h-1",
    leftPct: 5,
    sizePx: 22,
    animationName: "sot-fall-coin-horiz-cw",
    durationSec: 9.8,
    delaySec: -1.7,
    opacity: 0.96,
  },
  {
    id: "h-2",
    leftPct: 67,
    sizePx: 18,
    animationName: "sot-fall-coin-horiz-ccw",
    durationSec: 8.7,
    delaySec: -4.9,
    opacity: 0.92,
  },
  {
    id: "h-3",
    leftPct: 35,
    sizePx: 20,
    animationName: "sot-fall-coin-horiz-cw",
    durationSec: 11.1,
    delaySec: -6.1,
    opacity: 0.94,
  },
  {
    id: "h-4",
    leftPct: 86,
    sizePx: 17,
    animationName: "sot-fall-coin-horiz-ccw",
    durationSec: 9.9,
    delaySec: -2.3,
    opacity: 0.88,
  },
  {
    id: "h-5",
    leftPct: 51,
    sizePx: 19,
    animationName: "sot-fall-coin-horiz-cw",
    durationSec: 10.4,
    delaySec: -7.9,
    opacity: 0.92,
  },
  {
    id: "h-6",
    leftPct: 19,
    sizePx: 16,
    animationName: "sot-fall-coin-horiz-ccw",
    durationSec: 9.2,
    delaySec: -3.8,
    opacity: 0.86,
  },
  // Irregular unpatterned off-axis 3D tumblers
  {
    id: "e-1",
    leftPct: 44,
    sizePx: 17,
    animationName: "sot-fall-coin-erratic-a",
    durationSec: 9.1,
    delaySec: -7.2,
    opacity: 0.88,
  },
  {
    id: "e-2",
    leftPct: 12,
    sizePx: 24,
    animationName: "sot-fall-coin-erratic-b",
    durationSec: 11.7,
    delaySec: -3.4,
    opacity: 0.98,
  },
  {
    id: "e-3",
    leftPct: 76,
    sizePx: 16,
    animationName: "sot-fall-coin-erratic-c",
    durationSec: 7.9,
    delaySec: -0.8,
    opacity: 0.85,
  },
  {
    id: "e-4",
    leftPct: 56,
    sizePx: 23,
    animationName: "sot-fall-coin-erratic-b",
    durationSec: 12.3,
    delaySec: -9.5,
    opacity: 0.96,
  },
  {
    id: "e-5",
    leftPct: 39,
    sizePx: 18,
    animationName: "sot-fall-coin-erratic-c",
    durationSec: 7.5,
    delaySec: -4.1,
    opacity: 0.88,
  },
  {
    id: "e-6",
    leftPct: 17,
    sizePx: 16,
    animationName: "sot-fall-coin-erratic-a",
    durationSec: 10.9,
    delaySec: -8.3,
    opacity: 0.85,
  },
  {
    id: "e-7",
    leftPct: 92,
    sizePx: 21,
    animationName: "sot-fall-coin-erratic-a",
    durationSec: 9.5,
    delaySec: -2.9,
    opacity: 0.9,
  },
  {
    id: "e-8",
    leftPct: 29,
    sizePx: 22,
    animationName: "sot-fall-coin-erratic-c",
    durationSec: 11.4,
    delaySec: -5.6,
    opacity: 0.94,
  },
  {
    id: "e-9",
    leftPct: 72,
    sizePx: 17,
    animationName: "sot-fall-coin-erratic-b",
    durationSec: 8.6,
    delaySec: -1.3,
    opacity: 0.88,
  },
  {
    id: "e-10",
    leftPct: 8,
    sizePx: 18,
    animationName: "sot-fall-coin-erratic-c",
    durationSec: 10.1,
    delaySec: -5.2,
    opacity: 0.9,
  },
  {
    id: "e-11",
    leftPct: 81,
    sizePx: 22,
    animationName: "sot-fall-coin-erratic-b",
    durationSec: 11.8,
    delaySec: -6.9,
    opacity: 0.94,
  },
  {
    id: "e-12",
    leftPct: 48,
    sizePx: 15,
    animationName: "sot-fall-coin-erratic-a",
    durationSec: 8.2,
    delaySec: -2.7,
    opacity: 0.84,
  },
  // Collision Pair 1: converge mid-air & ricochet apart
  {
    id: "c1-l",
    leftPct: 22,
    sizePx: 21,
    animationName: "sot-fall-collide-1-left",
    durationSec: 8.8,
    delaySec: -2.1,
    opacity: 0.98,
  },
  {
    id: "c1-r",
    leftPct: 28,
    sizePx: 20,
    animationName: "sot-fall-collide-1-right",
    durationSec: 8.8,
    delaySec: -2.1,
    opacity: 0.98,
  },
  // Collision Pair 2: converge lower-mid air & ricochet apart
  {
    id: "c2-l",
    leftPct: 59,
    sizePx: 20,
    animationName: "sot-fall-collide-2-left",
    durationSec: 10.6,
    delaySec: -6.4,
    opacity: 0.96,
  },
  {
    id: "c2-r",
    leftPct: 65,
    sizePx: 21,
    animationName: "sot-fall-collide-2-right",
    durationSec: 10.6,
    delaySec: -6.4,
    opacity: 0.96,
  },
];

// Keep 7 distinct falling coins (horizontal, erratic tumblers, collision pair) across 4 staggered bands = 28 DOM nodes (down from 660!)
const CHAOTIC_FALLING_COINS: FallingCoinSpec[] = [
  { id: "h-1", leftPct: 8, sizePx: 22, animationName: "sot-fall-coin-horiz-cw", durationSec: 9.8, delaySec: -1.7, opacity: 0.95 },
  { id: "h-2", leftPct: 68, sizePx: 19, animationName: "sot-fall-coin-horiz-ccw", durationSec: 8.9, delaySec: -4.9, opacity: 0.92 },
  { id: "e-1", leftPct: 44, sizePx: 18, animationName: "sot-fall-coin-erratic-a", durationSec: 9.4, delaySec: -6.2, opacity: 0.88 },
  { id: "e-2", leftPct: 24, sizePx: 23, animationName: "sot-fall-coin-erratic-b", durationSec: 11.4, delaySec: -3.4, opacity: 0.96 },
  { id: "e-3", leftPct: 84, sizePx: 18, animationName: "sot-fall-coin-erratic-c", durationSec: 8.3, delaySec: -1.1, opacity: 0.88 },
  { id: "c1-l", leftPct: 32, sizePx: 21, animationName: "sot-fall-collide-1-left", durationSec: 9.2, delaySec: -2.1, opacity: 0.98 },
  { id: "c1-r", leftPct: 38, sizePx: 20, animationName: "sot-fall-collide-1-right", durationSec: 9.2, delaySec: -2.1, opacity: 0.98 },
];

const COIN_SKY_BANDS = [
  { id: "band-top", topPct: -10, phaseShiftSec: -4.2, shiftPct: 3 },
  { id: "band-mid1", topPct: 18, phaseShiftSec: -1.6, shiftPct: -4 },
  { id: "band-mid2", topPct: 48, phaseShiftSec: -5.1, shiftPct: 5 },
  { id: "band-low", topPct: 76, phaseShiftSec: -2.8, shiftPct: -3 },
];

const cascade = [
  { letter: "S", className: "text-[#d6a928]" },
  { letter: "O", className: "text-slate-950" },
  { letter: "r", className: "text-[#e34b4b]" },
  { letter: "T", className: "text-[#2563eb]" },
];

export function SotHomeHero() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { persona } = useRoles();
  const [activeObject, setActiveObject] = useState<"coin" | "bin" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const { data: feedItems } = useQuery({
    queryKey: ["feed", "anon"],
    queryFn: () => fetchFeed(null),
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: fetchBrands,
  });

  const [barometerTier, setBarometerTier] = useState<BrandTierFilter>("All tiers");
  const [barometerSort, setBarometerSort] = useState<"trust" | "tier" | "name">("trust");

  const barometerBrands = useMemo(() => {
    const list = brands.filter((b) => {
      const bTier = getBrandTier(b.name, b.category);
      return matchesTier(bTier, barometerTier);
    });

    return list.sort((a, b) => {
      if (barometerSort === "trust") {
        return (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0);
      }
      if (barometerSort === "tier") {
        const comp = compareBrandTiers(
          getBrandTier(a.name, a.category),
          getBrandTier(b.name, b.category),
        );
        if (comp !== 0) return comp;
        return (Number(b.trust_score) || 0) - (Number(a.trust_score) || 0);
      }
      return a.name.localeCompare(b.name);
    });
  }, [brands, barometerTier, barometerSort]);

  const rawStashes = useMemo(
    () => (feedItems ?? []).reduce((sum, item) => sum + (item.stashCount || 0), 0),
    [feedItems],
  );

  const rawTrashes = useMemo(
    () => (feedItems ?? []).reduce((sum, item) => sum + (item.trashCount || 0), 0),
    [feedItems],
  );

  const totalStashes = rawStashes > 0 ? rawStashes : 221;
  const totalTrashes = rawTrashes > 0 ? rawTrashes : 165;
  const totalVotes = totalStashes + totalTrashes;
  const stashPct = Math.round((totalStashes / totalVotes) * 100);
  const trashPct = 100 - stashPct;

  const topStashedItem = useMemo(() => {
    if (feedItems && feedItems.length > 0) {
      const sorted = [...feedItems].sort((a, b) => (b.stashCount || 0) - (a.stashCount || 0));
      if (sorted[0] && sorted[0].stashCount > 0) return sorted[0];
    }
    return {
      title: "Pricing at Woolworths is getting hard to justify",
      description: "Same basket, R180 more than last month. No explanation on the shelf. #Pricing",
      brandName: "Woolworths",
      stashCount: 4,
    };
  }, [feedItems]);

  const topTrashedItem = useMemo(() => {
    if (feedItems && feedItems.length > 0) {
      const sorted = [...feedItems].sort((a, b) => (b.trashCount || 0) - (a.trashCount || 0));
      if (sorted[0] && sorted[0].trashCount > 0) return sorted[0];
    }
    return {
      title: "Telkom refund finally cleared",
      description: "Nine days for a refund that was promised in three. #Refunds",
      brandName: "Telkom",
      trashCount: 4,
    };
  }, [feedItems]);

  const handleCoinClick = () => {
    playCoinSpinSound();
    setActiveObject("coin");
    triggerVerdictSuccess({
      label: "STASHED!",
      sublabel: "Keep what serves you · Loading Stashes of the Day",
      duration: 2600,
    });
    setStatusMessage(
      t("hero.spinningZwepe", {
        defaultValue: "Spinning Zwepe... watching it lean, chatter and settle flat!",
      }),
    );
    window.setTimeout(() => {
      navigate({ to: "/feed", search: { filter: "stash" } });
    }, 2800);
  };

  const handleTrashClick = () => {
    playTrashSound();
    setActiveObject("bin");
    setStatusMessage(
      t("hero.droppingBin", {
        defaultValue: "Randy the Hungry Trash Can chomps! Loading Trashes of the Day...",
      }),
    );
    window.setTimeout(() => {
      navigate({ to: "/feed", search: { filter: "trash" } });
    }, 1150);
  };

  const getTierLabel = (tierOption: BrandTierFilter) => {
    switch (tierOption) {
      case "All tiers":
        return t("hero.allTiers", { defaultValue: "All tiers" });
      case "Luxury":
        return t("hero.luxury", { defaultValue: "Luxury" });
      case "Premium":
        return t("hero.premium", { defaultValue: "Premium" });
      case "Mass Market":
        return t("hero.massMarket", { defaultValue: "Mass Market" });
      case "Budget":
        return t("hero.budget", { defaultValue: "Budget" });
      default:
        return tierOption;
    }
  };

  return (
    <section
      suppressHydrationWarning
      className="relative isolate overflow-hidden border-b border-slate-200 bg-white text-slate-950 pb-20 sm:pb-8"
    >
      {/* Full Split-Screen Falling Watermarks (Left: Falling 3D Coins · Right: Steel Trash Bins) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* Reduced-motion fallback coin watermark */}
        <div
          className="hidden motion-reduce:block absolute inset-y-0 left-0 w-1/2 opacity-[0.22]"
          style={{
            backgroundImage: `url(${coinsWatermark})`,
            backgroundSize: "140px 140px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Left Half: Live Falling 3D SOrT Gold Coins */}
        <div
          className="motion-reduce:hidden absolute inset-y-0 left-0 w-1/2 overflow-hidden opacity-[0.42] sm:opacity-[0.5] [perspective:900px]"
          style={{
            filter: "sepia(0.22) saturate(1.45) contrast(1.06)",
          }}
        >
          {COIN_SKY_BANDS.map((band) => (
            <div key={band.id} className="absolute inset-x-0" style={{ top: `${band.topPct}%` }}>
              {CHAOTIC_FALLING_COINS.map((coin) => {
                const shiftedLeft = Math.max(3, Math.min(93, coin.leftPct + band.shiftPct));
                return (
                    <img
                      key={`${band.id}-${coin.id}`}
                      src={coinIcon}
                      alt=""
                      aria-hidden="true"
                      width={coin.sizePx}
                      height={coin.sizePx}
                      decoding="async"
                      className="sot-falling-coin-item absolute top-0 select-none"
                      style={{
                        left: `${shiftedLeft}%`,
                        width: `${coin.sizePx}px`,
                        height: `${coin.sizePx}px`,
                        opacity: coin.opacity,
                        animation: `${coin.animationName} ${coin.durationSec}s linear ${coin.delaySec + band.phaseShiftSec}s infinite`,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Right Half: Steel Trash Can Watermark Rain (GPU-composited translate3d layer) */}
          <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden opacity-[0.18] sm:opacity-[0.24]">
            <div
              className="sot-watermark-rain-bins absolute inset-x-0 -top-[188px] bottom-0"
              style={{
                backgroundImage: `url(${binsWatermark})`,
                backgroundSize: "188px 188px",
                backgroundRepeat: "repeat",
              }}
            />
          </div>
          {/* Subtle split ambient tint matching Left Gold / Right Chrome */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-b from-amber-50/35 via-transparent to-amber-50/35 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-b from-slate-100/40 via-transparent to-slate-100/40 pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 lg:py-12">
          {/* Top Header Text: Crisp Editorial Kicker + Signature Black & Gold Contrast */}
          <div className="mx-auto max-w-3xl rounded-3xl bg-white/80 px-4 py-3 text-center backdrop-blur-[2px] sm:px-8 sm:py-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#855e00]">
              {t("hero.badge", { defaultValue: "The Brand Barometer" })}
            </p>

            <h1 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[1.08]">
              <span className="block text-slate-950">
                {t("hero.headlineBlack", { defaultValue: "Keep what serves you." })}
              </span>
              <span className="mt-1 block text-[#9c7205]">
                {t("hero.headlineGold", { defaultValue: "Challenge what does not." })}
              </span>
            </h1>

            <p className="mx-auto mt-3.5 max-w-2xl text-sm font-semibold leading-6 text-slate-800 sm:text-base">
              {t("hero.subtitle", {
                defaultValue:
                  "Vote Stash or Trash on your real brand experiences — the CX & PR signal that matters.",
              })}
            </p>
            <p className="mx-auto mt-1 max-w-xl text-xs font-medium leading-5 text-slate-600 sm:text-sm">
            {t("hero.tagline", {
              defaultValue:
                "Every verdict brings brands closer to the people they serve. Cast yours.",
            })}
          </p>
        </div>

        {/* Unified SOT Verdict Stage: Coin (Left) & Bin (Right) Anchored on Shared Barometer Card */}
        <HeroInteractiveStage
          activeObject={activeObject}
          setActiveObject={setActiveObject}
          totalStashes={totalStashes}
          totalTrashes={totalTrashes}
          feedItems={feedItems}
          onCoinClick={handleCoinClick}
          onTrashClick={handleTrashClick}
        />

        {/* Transition Toast when clicked */}
        {statusMessage && (
          <div className="mx-auto flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2 text-xs font-bold text-white shadow-lg animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="h-4 w-4 text-[#d6a928]" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* LIVE BRAND LAUNCHES, RELAUNCHES & CONSUMER BROADCAST STAGE */}
        <div className="mx-auto w-full max-w-5xl">
          <LiveStageSection />
        </div>

        {/* FULL PLATFORM ECOSYSTEM QUICK-LAUNCH STRIP (NO IMAGES MODIFIED) */}
        <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#855e00]">
                More Than Stash Or Trash · Complete Brand-Consumer Ecosystem
              </p>
              <h2 className="mt-0.5 font-display text-xl font-black text-slate-950">
                Releases, Authenticity, Innovation Pitches &amp; B2C Collaborations
              </h2>
            </div>
            <Link
              to="/discover"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-black text-[#f5d061] hover:bg-slate-900 whitespace-nowrap shrink-0"
            >
              Open Full Ecosystem Hub <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/discover"
              search={{ tab: "releases" }}
              className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-[#d6a928] hover:bg-amber-50/40"
            >
              <div className="flex items-center justify-between">
                <Rocket className="h-5 w-5 text-[#b88914]" />
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-950 transition-colors" />
              </div>
              <h3 className="mt-2.5 font-display text-sm font-black text-slate-950">
                New Releases &amp; Drops
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Explore upcoming launches, limited drops, and official product rollouts.
              </p>
            </Link>

            <Link
              to="/scan"
              className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-emerald-500 hover:bg-emerald-50/40"
            >
              <div className="flex items-center justify-between">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-950 transition-colors" />
              </div>
              <h3 className="mt-2.5 font-display text-sm font-black text-slate-950">
                Verify Authenticity &amp; Origin
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Scan barcodes/seals and check official domain-verified brand ownership.
              </p>
            </Link>

            <Link
              to="/discover"
              search={{ tab: "innovations" }}
              className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-indigo-500 hover:bg-indigo-50/40"
            >
              <div className="flex items-center justify-between">
                <Lightbulb className="h-5 w-5 text-indigo-600" />
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-950 transition-colors" />
              </div>
              <h3 className="mt-2.5 font-display text-sm font-black text-slate-950">
                Innovations &amp; C2B Pitches
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Watch brand R&amp;D demos or pitch your own consumer-to-brand innovations.
              </p>
            </Link>

            <Link
              to="/discover"
              search={{ tab: "events_collabs" }}
              className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-blue-500 hover:bg-blue-50/40"
            >
              <div className="flex items-center justify-between">
                <Handshake className="h-5 w-5 text-blue-600" />
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-950 transition-colors" />
              </div>
              <h3 className="mt-2.5 font-display text-sm font-black text-slate-950">
                B2C / C2B Events &amp; Collabs
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                RSVP to customer townhalls and apply for brand-creator collaborations.
              </p>
            </Link>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <BadgeCheck className="h-4 w-4 text-[#d6a928]" />
              Represent an auto-sourced brand? Claim &amp; verify ownership using your official
              company email domain.
            </span>
            <Link to="/brands" className="font-extrabold text-slate-950 hover:underline">
              Find &amp; Claim Your Brand →
            </Link>
          </div>
        </div>

        {/* STRICT ACCOUNT-SCOPED CALLOUT: PERSONAL USERS ONLY SEE CONSUMER TOOLS; BRAND ACCOUNTS ONLY SEE BRAND SUITE */}
        <div className="mx-auto w-full max-w-5xl">
          {persona === "brand_owner" ? (
            <div className="flex flex-col justify-between rounded-3xl border-2 border-[#d6a928] bg-slate-950 p-6 text-white shadow-md sm:flex-row sm:items-center gap-6">
              <div>
                <span className="inline-block text-xs font-black uppercase tracking-[0.16em] text-[#f5d061]">
                  {t("hero.brandAccountActive", {
                    defaultValue: "🏛️ Official Registered Brand Account Active",
                  })}
                </span>
                <h3 className="mt-2 font-display text-2xl font-black text-white">
                  {t("hero.brandSuiteTitle", {
                    defaultValue: "Open Your Dedicated Brand Command & Launch Suite",
                  })}
                </h3>
                <p className="mt-1.5 max-w-2xl text-xs font-medium leading-relaxed text-slate-300 sm:text-sm">
                  {t("hero.brandSuiteDesc", {
                    defaultValue:
                      "Access your single-brand intelligence barometer, host live product launches & relaunches, manage corporate desk operator seats, and resolve customer issues within the CPA with your chosen teams.",
                  })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#d6a928] px-4 py-2.5 text-xs font-black text-slate-950 transition hover:bg-[#e5b935] cursor-pointer"
                >
                  {t("hero.openBrandSuite", { defaultValue: "Open Brand Command Suite" })}{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/profile" })}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  {t("hero.openBrandDesk", { defaultValue: "Open Corporate Brand Desk" })}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between rounded-3xl border-2 border-[#d6a928]/60 bg-gradient-to-b from-[#fffbeb] to-white p-6 shadow-sm sm:flex-row sm:items-center gap-6">
              <div>
                <span className="inline-block text-xs font-black uppercase tracking-[0.16em] text-amber-800">
                  {t("hero.consumerFreeBadge", {
                    defaultValue: "🎉 100% Free Forever for Everyday Consumers & Voters",
                  })}
                </span>
                <h3 className="mt-2 font-display text-2xl font-black text-slate-950">
                  {t("hero.consumerFreeTitle", {
                    defaultValue: "Vote Stash or Trash, Scan Barcodes & Claim Live Launch Perks",
                  })}
                </h3>
                <p className="mt-1.5 max-w-2xl text-xs font-medium leading-relaxed text-slate-700 sm:text-sm">
                  {t("hero.consumerFreeDesc", {
                    defaultValue:
                      "Spin the South African Zwepe Gold Coin, slam Randy the Hungry Trash Can, scan product barcodes before you buy, connect with mutual Friends, and claim instant promo vouchers.",
                  })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-[#f5d061] transition hover:bg-slate-900"
                >
                  {t("hero.openMyProfile", { defaultValue: "Open My Personal Profile" })}{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/scan"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 hover:bg-slate-50"
                >
                  {t("hero.scanBarcodeBtn", { defaultValue: "Scan Product Barcode" })}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* LIVE RESULTS & DATA */}
        <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
              <h2 className="font-display text-lg font-black uppercase tracking-wide text-slate-950">
                {t("hero.liveSentiment", { defaultValue: "Live Brand Barometer & Daily Verdicts" })}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <span>
                {totalVotes.toLocaleString()}{" "}
                {t("hero.realPeopleVerdicts", { defaultValue: "Total Community Votes" })}
              </span>
              <span className="h-3 w-px bg-slate-300" />
              <Link to="/awards" className="text-slate-950 hover:underline">
                {t("hero.seeStandings", { defaultValue: "View Awards Leaderboard →" })}
              </Link>
            </div>
          </div>

          {/* Ratio Bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-amber-700">
                <Coins className="h-4 w-4 text-[#d6a928]" />
                {stashPct}% {t("vote.stash", { defaultValue: "Stash" })} (
                {totalStashes.toLocaleString()})
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Recycle className="h-4 w-4 text-slate-500" />
                {trashPct}% {t("vote.trash", { defaultValue: "Trash" })} (
                {totalTrashes.toLocaleString()})
              </span>
            </div>
            <div className="mt-2 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-200 p-0.5 shadow-inner">
              <div
                className="rounded-l-full bg-gradient-to-r from-amber-400 to-[#d6a928] transition-all duration-700"
                style={{ width: `${stashPct}%` }}
              />
              <div
                className="rounded-r-full bg-gradient-to-r from-slate-700 to-slate-900 transition-all duration-700"
                style={{ width: `${trashPct}%` }}
              />
            </div>
          </div>

          {/* Brand Barometer Interactive Tier Matrix & Pulse */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-slate-950">
                    {t("hero.barometerSegmentation", {
                      defaultValue: "Barometer Tier Segmentation",
                    })}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {barometerBrands.length} {t("nav.brands", { defaultValue: "Brands" })}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {t("hero.liveSentimentDesc", {
                    defaultValue:
                      "Filter and compare brand sentiments within defined market tiers.",
                  })}
                </p>
              </div>

              {/* Sorting Control */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="barometer-sort-select"
                  className="text-xs font-semibold text-slate-500"
                >
                  {t("hero.sortBy", { defaultValue: "Sort Barometer:" })}
                </label>
                <select
                  id="barometer-sort-select"
                  aria-label={t("hero.sortBy", { defaultValue: "Sort Barometer:" })}
                  value={barometerSort}
                  onChange={(e) => setBarometerSort(e.target.value as "trust" | "tier" | "name")}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 outline-none hover:bg-slate-100 transition-colors"
                >
                  <option value="trust">
                    {t("hero.trustScore", { defaultValue: "Highest Trust Score" })}
                  </option>
                  <option value="tier">
                    {t("hero.brandTier", { defaultValue: "By Tier (Luxury → Budget)" })}
                  </option>
                  <option value="name">
                    {t("hero.alphabetical", { defaultValue: "Brand Name (A-Z)" })}
                  </option>
                </select>
              </div>
            </div>

            {/* Tier Filter Pills */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
              {BRAND_TIERS.map((tierOption) => {
                const info = tierOption !== "All tiers" ? getTierInfo(tierOption) : null;
                const isSelected = barometerTier === tierOption;
                return (
                  <button
                    key={tierOption}
                    onClick={() => setBarometerTier(tierOption)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                      isSelected
                        ? "bg-slate-950 text-white shadow-xs scale-[1.02]"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950",
                    )}
                  >
                    {info?.pricePoint && (
                      <span className="font-mono text-[10px] opacity-75">{info.pricePoint}</span>
                    )}
                    <span>{getTierLabel(tierOption)}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Tier Description Banner */}
            {barometerTier !== "All tiers" && (
              <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs">
                <span className="mt-0.5 inline-block size-2 rounded-full shrink-0 bg-primary" />
                <div className="text-slate-600">
                  <span className="font-bold text-slate-900">
                    {getTierInfo(barometerTier).label} ({getTierInfo(barometerTier).pricePoint}):
                  </span>{" "}
                  {getTierInfo(barometerTier).description}{" "}
                  <span translate="no" className="notranslate text-slate-500 italic">
                    {getTierInfo(barometerTier).examples.slice(0, 4).join(", ")}.
                  </span>
                </div>
              </div>
            )}

            {/* Top Brands in this Barometer Tier */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {barometerBrands.slice(0, 4).map((brand) => {
                const tierInfo = getTierInfo(getBrandTier(brand.name, brand.category));
                const trust = Number(brand.trust_score) || 0;
                return (
                  <Link
                    key={brand.id}
                    to="/brands/$slug"
                    params={{ slug: brand.slug }}
                    className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <BrandLogo
                          name={brand.name}
                          url={brand.signedLogoUrl}
                          className="size-8 rounded-lg text-xs"
                        />
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold leading-none",
                            tierInfo.badgeClass,
                          )}
                        >
                          <span className="font-mono text-[9px]">{tierInfo.pricePoint}</span>
                          <span>{tierInfo.shortName}</span>
                        </span>
                      </div>
                      <h4
                        translate="no"
                        className="notranslate mt-2.5 font-display text-sm font-bold text-slate-950 truncate group-hover:text-primary transition-colors"
                      >
                        {brand.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {brand.category || "Consumer Brand"}
                      </p>
                    </div>

                    <div className="mt-3 border-t border-slate-100 pt-2.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500">
                          {t("hero.trustScore", { defaultValue: "Trust score" })}:
                        </span>
                        <span
                          className={
                            trust >= 75
                              ? "text-emerald-600"
                              : trust >= 50
                                ? "text-amber-600"
                                : "text-rose-600"
                          }
                        >
                          {trust}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            trust >= 75
                              ? "bg-emerald-500"
                              : trust >= 50
                                ? "bg-amber-500"
                                : "bg-rose-500",
                          )}
                          style={{ width: `${Math.max(5, Math.min(100, trust))}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Action link */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="text-slate-600">
                {t("hero.realPeopleVerdicts", {
                  defaultValue: "Real consumer verdicts shaping trust scores in real time.",
                })}
              </span>
              <Link
                to="/brands"
                className="font-bold text-amber-900 hover:underline inline-flex items-center gap-1"
              >
                {t("hero.searchOrBrowse", { defaultValue: "Search brands or browse below" })}{" "}
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Top Stash & Top Trash Preview Cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {/* Top Stashed of the Day */}
            <div className="flex flex-col justify-between rounded-2xl border border-amber-200 bg-white p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-900">
                    <Trophy className="h-3.5 w-3.5 text-amber-700" />
                    {t("hero.topStashedTitle", { defaultValue: "Top Stashed of the Day" })}
                  </span>
                  <span className="font-display text-sm font-black text-amber-700">
                    +{topStashedItem?.stashCount ?? 0}{" "}
                    {t("hero.stashes", { defaultValue: "Stashes" })}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-slate-950 line-clamp-1">
                  {topStashedItem?.title ??
                    t("hero.communityFavoriteFallback", {
                      defaultValue: "Community Favorite Brand",
                    })}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                  {topStashedItem?.description ??
                    t("hero.communityFavoriteDesc", {
                      defaultValue:
                        "Consumers are celebrating exceptional service, product durability, and ethical practices.",
                    })}
                </p>
                {topStashedItem?.brandName && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    {t("hero.brandLabel", { defaultValue: "Brand" })}:{" "}
                    <span translate="no" className="notranslate text-slate-900 font-bold">
                      {topStashedItem.brandName}
                    </span>
                  </p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  to="/feed"
                  search={{ filter: "stash" }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline"
                >
                  {t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" })}{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Top Trashed of the Day */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-300 bg-white p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-800">
                    <AlertTriangle className="h-3.5 w-3.5 text-slate-700" />
                    {t("hero.topTrashedTitle", { defaultValue: "Top Trashed of the Day" })}
                  </span>
                  <span className="font-display text-sm font-black text-slate-900">
                    {topTrashedItem?.trashCount ?? 0}{" "}
                    {t("hero.trashes", { defaultValue: "Trashed" })}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-slate-950 line-clamp-1">
                  {topTrashedItem?.title ??
                    t("hero.criticalCalloutFallback", {
                      defaultValue: "Critical Consumer Callout",
                    })}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                  {topTrashedItem?.description ??
                    t("hero.criticalCalloutDesc", {
                      defaultValue:
                        "Public accountability on poor service delivery, pricing changes, or quality concerns.",
                    })}
                </p>
                {topTrashedItem?.brandName && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    {t("hero.brandLabel", { defaultValue: "Brand" })}:{" "}
                    <span translate="no" className="notranslate text-slate-900 font-bold">
                      {topTrashedItem.brandName}
                    </span>
                  </p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  to="/feed"
                  search={{ filter: "trash" }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 hover:underline"
                >
                  {t("feed.trashesOfDay", { defaultValue: "Trashes of the Day" })}{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Cascading SOrT at the bottom of the home page */}
        <div
          translate="no"
          aria-hidden="true"
          data-sot-brand="cascade"
          className="notranslate relative flex justify-center gap-4 overflow-hidden pt-4 pb-2 text-5xl font-black leading-none sm:gap-8 sm:text-7xl"
        >
          {cascade.map(({ letter, className }, index) => (
            <span
              key={`${letter}-${index}`}
              translate="no"
              className={`notranslate ${className} sot-letter-cascade`}
              style={{ animationDelay: `${index * 180}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
