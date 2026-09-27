import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Coins, Recycle, Trophy, AlertTriangle, Sparkles, TrendingUp, Layers, Gauge, ChevronRight } from "lucide-react";
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
import { VerdictSuccess, triggerVerdictSuccess } from "@/components/VerdictSuccess";
import { playCoinSpinSound, playTrashSound } from "@/lib/verdict-sounds";
import { cn } from "@/lib/utils";
import coinIcon from "@/assets/icon-coin.png";
import binIcon from "@/assets/icon-bin.png";

const cascade = [
  { letter: "S", className: "text-[#d6a928]" },
  { letter: "O", className: "text-slate-950" },
  { letter: "r", className: "text-[#e34b4b]" },
  { letter: "T", className: "text-[#2563eb]" },
];

export function SotHomeHero() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    setStatusMessage(t("hero.spinningZwepe", { defaultValue: "Spinning Zwepe... watching it lean, chatter and settle flat!" }));
    window.setTimeout(() => {
      navigate({ to: "/feed", search: { filter: "stash" } });
    }, 2800);
  };

  const handleTrashClick = () => {
    playTrashSound();
    setActiveObject("bin");
    setStatusMessage(t("hero.droppingBin", { defaultValue: "Randy the Hungry Trash Can chomps! Loading Trashes of the Day..." }));
    window.setTimeout(() => {
      navigate({ to: "/feed", search: { filter: "trash" } });
    }, 1150);
  };

  const getTierLabel = (tierOption: BrandTierFilter) => {
    switch (tierOption) {
      case "All tiers":
        return t("hero.allTiers", { defaultValue: "All tiers" });
      case "Super Brands":
        return t("hero.superBrands", { defaultValue: "Super Brands" });
      case "National Powerhouses":
        return t("hero.nationalPowerhouses", { defaultValue: "National Powerhouses" });
      case "Emerging Challengers":
        return t("hero.emergingChallengers", { defaultValue: "Emerging Challengers" });
      case "Local Heroes":
        return t("hero.localHeroes", { defaultValue: "Local Heroes" });
      default:
        return tierOption;
    }
  };

  return (
    <section className="relative isolate overflow-hidden border-b-2 border-[#d6a928]/30 bg-white text-slate-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <div className="absolute left-[10%] top-8 h-72 w-72 rounded-full border-[20px] border-[#d6a928]" />
        <div className="absolute right-[12%] top-16 h-60 w-48 rotate-6 rounded-[2.5rem] border-[14px] border-slate-900" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:py-16">
        {/* Top Header Text: Signature Black & Gold Two-Tone Contrast */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d6a928]/50 bg-slate-950 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#f5d061] shadow-sm">
            <Coins className="h-3.5 w-3.5 text-[#d6a928]" aria-hidden="true" />
            <span>{t("hero.badge", { defaultValue: "The Brand Barometer" })}</span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-black tracking-tight sm:text-6xl leading-[1.08]">
            <span className="block text-slate-950">
              {t("hero.headlineBlack", { defaultValue: "Keep what serves you." })}
            </span>
            <span className="mt-1 block text-[#d6a928] drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]">
              {t("hero.headlineGold", { defaultValue: "Challenge what does not." })}
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-bold leading-7 text-slate-900 sm:text-lg">
            {t("hero.subtitle", { defaultValue: "Vote Stash or Trash on your real brand experiences — the CX & PR signal that matters." })}
          </p>
          <p className="mx-auto mt-1.5 max-w-xl text-sm font-medium leading-6 text-slate-600 sm:text-base">
            {t("hero.tagline", { defaultValue: "Every verdict brings brands closer to the people they serve. Cast yours. 🔥" })}
          </p>
        </div>

        {/* Hero Interactive Objects: South African Spinning Coin (Left) & Randy Hungry Trash Can (Right) */}
        <div className="flex min-h-[320px] items-center justify-center lg:min-h-[400px]">
          <div className="mx-auto grid w-full max-w-4xl gap-8 sm:grid-cols-2 lg:max-w-4xl">
            {/* Left Object: Stash Gold Coin */}
            <div className="group relative flex flex-col items-center overflow-hidden rounded-3xl border-2 border-[#d6a928]/60 bg-gradient-to-b from-[#fffbeb] via-amber-50/40 to-white p-6 shadow-[0_12px_32px_-12px_rgba(214,169,40,0.35)] transition hover:border-[#d6a928] hover:shadow-[0_18px_40px_-10px_rgba(214,169,40,0.5)]">
              <VerdictSuccess
                active={activeObject === "coin"}
                inline
                label="STASHED!"
                sublabel="Keep what serves you · Gold standard"
              />
              <button
                type="button"
                aria-label={t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" })}
                onClick={handleCoinClick}
                onMouseEnter={() => {
                  if (activeObject !== "coin") {
                    setActiveObject("coin");
                    window.setTimeout(() => setActiveObject(null), 2900);
                  }
                }}
                className="relative flex w-full flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6a928] rounded-2xl p-2 cursor-pointer"
              >
                <div className="relative flex h-60 w-full items-center justify-center sm:h-72 [perspective:900px]">
                  {/* Tabletop contact surface shadow synchronized with Zwepe spin */}
                  <div
                    className={cn(
                      "sot-coin-shadow absolute bottom-5 h-8 w-44 rounded-full bg-slate-950/30 blur-md pointer-events-none",
                      activeObject === "coin" && "sot-object-active",
                    )}
                  />

                  {/* Original South African coin icon: spins upright on edge & precesses flat */}
                  <img
                    src={coinIcon}
                    alt="$OrT South African spinning gold coin"
                    className={cn(
                      "sot-coin-art relative z-10 w-full max-w-[210px] sm:max-w-[250px] drop-shadow-md transition-transform group-hover:scale-105",
                      activeObject === "coin" && "sot-object-active",
                    )}
                  />
                </div>
                <span className="sr-only">{t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" })}</span>
              </button>

              <div className="mt-3 flex flex-col items-center gap-1.5 text-center">
                <Link
                  to="/feed"
                  search={{ filter: "stash" }}
                  onClick={() =>
                    triggerVerdictSuccess({
                      label: "STASHES OF THE DAY",
                      sublabel: "Keep what serves you · Community Gold Standard",
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-full border-2 border-slate-950 bg-[#d6a928] px-5 py-2 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_4px_0_0_#0a0a0c] transition hover:bg-[#e3b634] active:translate-y-0.5"
                >
                  <Coins className="h-4 w-4" />
                  {t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" })} ({totalStashes})
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <p className="text-xs font-bold text-slate-700">
                  {t("hero.tapCoin", { defaultValue: "Tap the Gold Coin to spin & view Stashes" })}
                </p>
              </div>
            </div>

            {/* Right Object: Randy The Trash Can — Disconnected Free-Floating Lid & Squash-and-Stretch Barrel */}
            <div className="group relative flex flex-col items-center rounded-3xl border-2 border-slate-900/25 bg-gradient-to-b from-slate-100/90 via-slate-50/50 to-white p-6 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.22)] transition hover:border-slate-950 hover:shadow-[0_18px_40px_-10px_rgba(15,23,42,0.35)]">
              <button
                type="button"
                aria-label="Slam trash can for Trashes of the Day"
                onClick={handleTrashClick}
                onMouseEnter={() => {
                  if (activeObject !== "bin") {
                    setActiveObject("bin");
                    window.setTimeout(() => setActiveObject(null), 1350);
                  }
                }}
                className="relative flex w-full flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-2xl p-2 cursor-pointer"
              >
                <div className="relative flex h-60 w-full items-center justify-center sm:h-72">
                  {/* Grounded floor contact shadow */}
                  <div
                    aria-hidden="true"
                    className={cn(
                      "sot-bin-shadow pointer-events-none absolute bottom-2 h-7 w-40 rounded-full bg-slate-950/30 blur-md sm:w-44",
                      activeObject === "bin" && "sot-object-active",
                    )}
                  />

                  <div className="randy-can-stage relative flex h-56 w-48 items-center justify-center sm:h-64 sm:w-56">
                    {/* Dark 3D elliptical interior barrel mouth revealed when the loose lid pops up */}
                    <div
                      aria-hidden="true"
                      className={cn(
                        "randy-mouth-cavity pointer-events-none absolute top-[15.5%] left-[13%] right-[13%] z-5 h-9 rounded-[50%] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-[inset_0_6px_12px_rgba(0,0,0,0.95)] ring-2 ring-slate-400/40",
                        activeObject === "bin" && "randy-active",
                      )}
                    />

                    {/* Overflowing Junk inside Randy's barrel mouth */}
                    <div
                      className={cn(
                        "randy-junk-contents pointer-events-none absolute top-[10.5%] left-[14%] right-[14%] z-10 flex items-end justify-center select-none",
                        activeObject === "bin" && "randy-active",
                      )}
                    >
                      <svg
                        viewBox="0 0 160 55"
                        className="h-11 w-full overflow-visible drop-shadow-md"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Crumpled callout note */}
                        <g transform="translate(18, 6) rotate(-12)">
                          <polygon
                            points="0,0 26,-4 32,22 4,24"
                            fill="#f8fafc"
                            stroke="#94a3b8"
                            strokeWidth="1.4"
                          />
                          <line x1="4" y1="5" x2="22" y2="2" stroke="#94a3b8" strokeWidth="1" />
                          <line x1="5" y1="9" x2="24" y2="7" stroke="#94a3b8" strokeWidth="1" />
                          <rect
                            x="4"
                            y="14"
                            width="16"
                            height="5"
                            rx="1"
                            fill="#ef4444"
                            fillOpacity="0.25"
                            stroke="#ef4444"
                            strokeWidth="0.9"
                          />
                        </g>
                        {/* Crushed tin can */}
                        <g transform="translate(56, 9) rotate(10)">
                          <rect
                            x="0"
                            y="0"
                            width="18"
                            height="22"
                            rx="3"
                            fill="#dc2626"
                            stroke="#991b1b"
                            strokeWidth="1.2"
                          />
                          <ellipse
                            cx="9"
                            cy="0"
                            rx="7"
                            ry="2"
                            fill="#e2e8f0"
                            stroke="#94a3b8"
                            strokeWidth="0.8"
                          />
                        </g>
                        {/* Fishbone */}
                        <g transform="translate(86, 4) rotate(-18)">
                          <line
                            x1="0"
                            y1="12"
                            x2="32"
                            y2="12"
                            stroke="#f1f5f9"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <polygon
                            points="32,12 41,7 41,17"
                            fill="#f1f5f9"
                            stroke="#94a3b8"
                            strokeWidth="1"
                          />
                          <line x1="8" y1="6" x2="8" y2="18" stroke="#f1f5f9" strokeWidth="1.8" strokeLinecap="round" />
                          <line x1="16" y1="5" x2="16" y2="19" stroke="#f1f5f9" strokeWidth="1.8" strokeLinecap="round" />
                          <line x1="24" y1="6" x2="24" y2="18" stroke="#f1f5f9" strokeWidth="1.8" strokeLinecap="round" />
                        </g>
                      </svg>
                    </div>

                    {/* Randy Trash Can Barrel Body (3D curved elliptical rim cut + weighty squash-and-stretch) */}
                    <div
                      className={cn(
                        "randy-body absolute inset-0 z-15 drop-shadow-md",
                        activeObject === "bin" && "randy-active",
                      )}
                      style={{
                        clipPath:
                          "polygon(0% 17%, 12% 19.8%, 26% 21.8%, 42% 23%, 50% 23.3%, 58% 23%, 74% 21.8%, 88% 19.8%, 100% 17%, 100% 100%, 0% 100%)",
                      }}
                    >
                      <img
                        src={binIcon}
                        alt="SOrT solid stainless steel metallic trash can"
                        className="h-full w-full object-contain select-none"
                      />
                    </div>

                    {/* Randy Free-Floating Disconnected Metal Lid (pops vertically up & down, tilts, and jiggles on rim impact) */}
                    <div
                      className={cn(
                        "randy-lid absolute inset-0 z-20",
                        activeObject === "bin" && "randy-active",
                      )}
                      style={{
                        clipPath:
                          "polygon(0% 0%, 100% 0%, 100% 18.2%, 88% 21%, 74% 23%, 58% 24.2%, 50% 24.5%, 42% 24.2%, 26% 23%, 12% 21%, 0% 18.2%)",
                      }}
                    >
                      <img
                        src={binIcon}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-contain select-none"
                      />
                    </div>
                  </div>
                </div>
                <span className="sr-only">Slam trash can for Trashes of the Day</span>
              </button>

              <div className="mt-3 flex flex-col items-center gap-1.5 text-center">
                <Link
                  to="/feed"
                  search={{ filter: "trash" }}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
                >
                  <Recycle className="h-4 w-4" />
                  {t("feed.trashesOfDay", { defaultValue: "Trashes of the Day" })} ({totalTrashes})
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <p className="text-xs font-medium text-slate-500">
                  {t("hero.tapBin", { defaultValue: "Click the trash can to slam & review public callouts" })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transition Toast when clicked */}
        {statusMessage && (
          <div className="mx-auto flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-lg animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="h-4 w-4 text-[#d6a928]" />
            <span>{statusMessage}</span>
          </div>
        )}

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
              <span>{totalVotes.toLocaleString()} {t("hero.realPeopleVerdicts", { defaultValue: "Total Community Votes" })}</span>
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
                {stashPct}% {t("vote.stash", { defaultValue: "Stash" })} ({totalStashes.toLocaleString()})
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Recycle className="h-4 w-4 text-slate-500" />
                {trashPct}% {t("vote.trash", { defaultValue: "Trash" })} ({totalTrashes.toLocaleString()})
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
                    {t("hero.liveSentiment", { defaultValue: "Barometer Tier Segmentation" })}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {barometerBrands.length} {t("nav.brands", { defaultValue: "Brands" })}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {t("hero.liveSentimentDesc", { defaultValue: "Filter and compare brand sentiments within defined market tiers." })}
                </p>
              </div>

              {/* Sorting Control */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">{t("hero.sortBy", { defaultValue: "Sort Barometer:" })}</span>
                <select
                  value={barometerSort}
                  onChange={(e) => setBarometerSort(e.target.value as "trust" | "tier" | "name")}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 outline-none hover:bg-slate-100 transition-colors"
                >
                  <option value="trust">{t("hero.trustScore", { defaultValue: "Highest Trust Score" })}</option>
                  <option value="tier">{t("hero.brandTier", { defaultValue: "By Tier (Luxury → Budget)" })}</option>
                  <option value="name">{t("hero.alphabetical", { defaultValue: "Brand Name (A-Z)" })}</option>
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
                  <span className="text-slate-500 italic">
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
                    className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-xs"
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
                      <h4 className="mt-2.5 font-display text-sm font-bold text-slate-950 truncate group-hover:text-primary transition-colors">
                        {brand.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {brand.category || "Consumer Brand"}
                      </p>
                    </div>

                    <div className="mt-3 border-t border-slate-100 pt-2.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500">{t("hero.trustScore", { defaultValue: "Trust score" })}:</span>
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
              <span className="text-slate-500">
                {t("hero.realPeopleVerdicts", { defaultValue: "Real consumer verdicts shaping trust scores in real time." })}
              </span>
              <Link
                to="/brands"
                className="font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                {t("hero.searchOrBrowse", { defaultValue: "Search brands or browse below" })} <ChevronRight className="size-3.5" />
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
                    {t("hero.gettingStashed", { defaultValue: "Top Stashed of the Day" })}
                  </span>
                  <span className="font-display text-sm font-black text-amber-700">
                    +{topStashedItem?.stashCount ?? 0} {t("hero.stashes", { defaultValue: "Stashes" })}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-slate-950 line-clamp-1">
                  {topStashedItem?.title ?? "Community Favorite Brand"}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                  {topStashedItem?.description ?? "Consumers are celebrating exceptional service, product durability, and ethical practices."}
                </p>
                {topStashedItem?.brandName && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    {t("nav.brands", { defaultValue: "Brand" })}: <span className="text-slate-900 font-bold">{topStashedItem.brandName}</span>
                  </p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  to="/feed"
                  search={{ filter: "stash" }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline"
                >
                  {t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" })} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Top Trashed of the Day */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-300 bg-white p-5 shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-800">
                    <AlertTriangle className="h-3.5 w-3.5 text-slate-700" />
                    {t("hero.gettingTrashed", { defaultValue: "Top Trashed of the Day" })}
                  </span>
                  <span className="font-display text-sm font-black text-slate-900">
                    {topTrashedItem?.trashCount ?? 0} {t("hero.trashes", { defaultValue: "Trashed" })}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-slate-950 line-clamp-1">
                  {topTrashedItem?.title ?? "Critical Consumer Callout"}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                  {topTrashedItem?.description ?? "Public accountability on poor service delivery, pricing changes, or quality concerns."}
                </p>
                {topTrashedItem?.brandName && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    {t("nav.brands", { defaultValue: "Brand" })}: <span className="text-slate-900 font-bold">{topTrashedItem.brandName}</span>
                  </p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  to="/feed"
                  search={{ filter: "trash" }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 hover:underline"
                >
                  {t("feed.trashesOfDay", { defaultValue: "Trashes of the Day" })} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Cascading SOrT at the bottom of the home page */}
        <div
          aria-hidden="true"
          className="relative flex justify-center gap-4 overflow-hidden pt-4 pb-2 text-5xl font-black leading-none sm:gap-8 sm:text-7xl"
        >
          {cascade.map(({ letter, className }, index) => (
            <span
              key={`${letter}-${index}`}
              className={`${className} sot-letter-cascade`}
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

