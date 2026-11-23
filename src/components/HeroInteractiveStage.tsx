import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Coins, Recycle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { VerdictSuccess, triggerVerdictSuccess } from "@/components/VerdictSuccess";
import { cn } from "@/lib/utils";
import coinIcon from "@/assets/icon-coin.webp";
import type { FeedItem } from "@/lib/stash";

export type HeroTrashWindow = "hour" | "day" | "week";

const TRASH_WINDOW_META: Record<HeroTrashWindow, { shortLabel: string; capacity: number }> = {
  hour: { shortLabel: "Hour", capacity: 16 },
  day: { shortLabel: "Day", capacity: 80 },
  week: { shortLabel: "Week", capacity: 240 },
};

interface HeroInteractiveStageProps {
  activeObject: "coin" | "bin" | null;
  setActiveObject: (obj: "coin" | "bin" | null) => void;
  totalStashes: number;
  totalTrashes: number;
  feedItems?: FeedItem[];
  onCoinClick: () => void;
  onTrashClick: () => void;
}

export function HeroInteractiveStage({
  activeObject,
  setActiveObject,
  totalStashes,
  totalTrashes,
  feedItems = [],
  onCoinClick,
  onTrashClick,
}: HeroInteractiveStageProps) {
  const { t } = useTranslation();

  // Live Barometer Split connecting Coin (Stash) & Bin (Trash)
  const totalVotes = Math.max(1, totalStashes + totalTrashes);
  const stashPct = Math.round((totalStashes / totalVotes) * 100);
  const trashPct = 100 - stashPct;

  // =========================================================================
  // 1. SOrT KRUGERRAND COIN: True 3D World-Y Vertical Spin -> Euler Cone -> Flat
  // =========================================================================
  const COIN_SIZE = 188;
  const COIN_RADIUS = COIN_SIZE / 2;
  const COIN_THICKNESS = 10;
  const halfT = COIN_THICKNESS / 2;
  const rimSlices = useMemo(() => Array.from({ length: COIN_THICKNESS - 1 }, (_, i) => i + 1), []);

  const [coinPose, setCoinPose] = useState({
    phi: 0,
    leanDeg: 0,
    psi: 0,
    camPitch: 0,
    dropY: 0,
    glintX: -120,
    glintOpacity: 0,
    shadowScaleX: 0.92,
    shadowScaleY: 0.28,
  });
  const [coinSpinning, setCoinSpinning] = useState(false);
  const coinRafRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  const stopCoinSpin = useCallback(() => {
    if (coinRafRef.current !== null) {
      cancelAnimationFrame(coinRafRef.current);
      coinRafRef.current = null;
    }
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => stopCoinSpin(), [stopCoinSpin]);

  const runEulerSpin = useCallback(
    (holdFlatMs: number) => {
      stopCoinSpin();
      setCoinSpinning(true);

      const totalDuration = 2650;
      const startTime = performance.now();
      let lastTime = startTime;
      let phi = 0;
      let psi = 0;
      let leanDeg = 0;
      let lockedNetStart: number | null = null;
      let lockedNetTarget = 0;

      const step = (now: number) => {
        const dt = Math.min(0.04, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;
        const progress = Math.min(1, (now - startTime) / totalDuration);

        if (progress < 0.38) {
          const u = progress / 0.38;
          leanDeg = 4 * Math.pow(u, 4);
          const omegaPhi = 1140 - 380 * u;
          phi += omegaPhi * dt;
        } else if (progress < 0.88) {
          const u = (progress - 0.38) / 0.5;
          leanDeg = 4 + 84.5 * Math.pow(u, 0.82);
          const speedUp = 720 + 1380 * Math.pow(Math.min(1, u / 0.9), 1.15);
          const tailBrake = u > 0.9 ? 1 - ((u - 0.9) / 0.1) * 0.45 : 1;
          const dPhi = speedUp * tailBrake * dt;
          phi += dPhi;
          psi += Math.sin((leanDeg * Math.PI) / 180) * dPhi;
        } else {
          const w = (progress - 0.88) / 0.12;
          if (lockedNetStart === null) {
            lockedNetStart = phi - psi;
            lockedNetTarget = Math.round(lockedNetStart / 360) * 360;
          }
          const remOmega = 760 * Math.pow(1 - w, 2.2);
          phi += remOmega * dt;
          leanDeg = Math.min(90, 88.5 + 1.5 * (1 - Math.pow(1 - w, 2)));
          const easeNet = 1 - Math.pow(1 - w, 3);
          const currentNet = lockedNetStart + (lockedNetTarget - lockedNetStart) * easeNet;
          psi = phi - currentNet;
        }

        const leanRad = (leanDeg * Math.PI) / 180;
        const flatProgress = leanDeg / 90;
        const camPitch = -20 * Math.sin((flatProgress * Math.PI) / 2);
        const dropY = 18 * (1 - Math.cos(leanRad)) + COIN_RADIUS * 0.08 * flatProgress;
        const glintX = (((phi - psi) % 180) / 180) * 240 - 120;

        setCoinPose({
          phi,
          leanDeg,
          psi,
          camPitch,
          dropY,
          glintX,
          glintOpacity: progress < 0.92 ? 0.55 : 0,
          shadowScaleX: 0.78 + 0.34 * flatProgress,
          shadowScaleY: 0.22 + 0.22 * flatProgress,
        });

        if (progress < 1) {
          coinRafRef.current = requestAnimationFrame(step);
        } else {
          setCoinSpinning(false);
          setCoinPose({
            phi: 0,
            leanDeg: 90,
            psi: 0,
            camPitch: -20,
            dropY: 22,
            glintX: -120,
            glintOpacity: 0,
            shadowScaleX: 1.12,
            shadowScaleY: 0.44,
          });
          if (holdFlatMs > 0) {
            resetTimerRef.current = window.setTimeout(() => {
              setCoinPose({
                phi: 0,
                leanDeg: 0,
                psi: 0,
                camPitch: 0,
                dropY: 0,
                glintX: -120,
                glintOpacity: 0,
                shadowScaleX: 0.92,
                shadowScaleY: 0.28,
              });
              setActiveObject(null);
            }, holdFlatMs);
          }
        }
      };

      coinRafRef.current = requestAnimationFrame(step);
    },
    [COIN_RADIUS, setActiveObject, stopCoinSpin],
  );

  // =========================================================================
  // 2. OPTION A VINTAGE TRASH CAN: Flush Level Lid + Simultaneous Live Fill
  // =========================================================================
  const [trashWindow, setTrashWindow] = useState<HeroTrashWindow>("day");
  const [lidHovered, setLidHovered] = useState(false);
  const [droppingParcel, setDroppingParcel] = useState(false);
  const [binSlamming, setBinSlamming] = useState(false);

  const liveWindowCounts = useMemo(() => {
    const nowMs = Date.now();
    const hourMs = 60 * 60 * 1000;
    const dayMs = 24 * hourMs;
    const weekMs = 7 * dayMs;
    let hour = 0;
    let day = 0;
    let week = 0;

    for (const item of feedItems) {
      const c = Number(item.trashCount) || 0;
      if (c <= 0) continue;
      const age = nowMs - new Date(item.created_at).getTime();
      if (age <= hourMs) hour += c;
      if (age <= dayMs) day += c;
      if (age <= weekMs) week += c;
    }

    return {
      hour: hour > 0 ? hour : Math.max(2, Math.round(totalTrashes * 0.04)),
      day: day > 0 ? day : Math.max(12, Math.round(totalTrashes * 0.28)),
      week: week > 0 ? week : totalTrashes,
    };
  }, [feedItems, totalTrashes]);

  const activeWindowMeta = TRASH_WINDOW_META[trashWindow];
  const windowTrashCount = liveWindowCounts[trashWindow];
  const fillRatio = Math.max(0, Math.min(1.25, windowTrashCount / activeWindowMeta.capacity));
  const fillPct = Math.round((windowTrashCount / activeWindowMeta.capacity) * 100);
  const isOverflowing = fillRatio >= 1;

  const pileTranslateY =
    fillRatio <= 0 ? 22 : Math.max(-2, 18.5 - Math.min(1.05, fillRatio) * 18.5);
  const pileScaleX = 0.9 + Math.min(1, fillRatio) * 0.1;

  const lidOpenState = activeObject === "bin" || lidHovered || droppingParcel;
  const lidLiftY = droppingParcel
    ? -18
    : lidOpenState
      ? -15
      : fillRatio <= 0.35
        ? 0
        : -Math.min(7.5, (fillRatio - 0.35) * 8.2);
  const lidShiftX = lidOpenState
    ? 3
    : fillRatio > 0.95
      ? (Math.min(1.2, fillRatio) - 0.95) * 3.5
      : 0;
  const lidTiltDeg = lidOpenState
    ? -15
    : fillRatio <= 0.95
      ? 0
      : (Math.min(1.2, fillRatio) - 0.95) * 12;

  const handleTrashTrigger = () => {
    setDroppingParcel(true);
    window.setTimeout(() => {
      setDroppingParcel(false);
      setBinSlamming(true);
      window.setTimeout(() => setBinSlamming(false), 320);
    }, 480);
    onTrashClick();
  };

  return (
    <div
      data-testid="sot-verdict-stage"
      className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Unified Barometer Scale Bridge directly linking Coin (Stash) and Bin (Trash) */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold sm:text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <Coins className="h-3.5 w-3.5 text-[#d6a928]" aria-hidden="true" />
            <span className="tabular-nums">
              {stashPct}% {t("vote.stash", { defaultValue: "Stash" })}
            </span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="font-medium text-slate-600 hidden sm:inline">
              {t("hero.stashScaleLabel", { defaultValue: "Keep what serves you" })}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-600 tabular-nums hidden md:inline">
            {totalVotes.toLocaleString()}{" "}
            {t("hero.realPeopleVerdicts", { defaultValue: "Community Verdicts" })}
          </span>

          <div className="flex items-center gap-2 text-slate-900">
            <span className="font-medium text-slate-600 hidden sm:inline">
              {t("hero.trashScaleLabel", { defaultValue: "Challenge what fails" })}
            </span>
            <span aria-hidden="true" className="text-slate-300 hidden sm:inline">
              ·
            </span>
            <span className="tabular-nums">
              {trashPct}% {t("vote.trash", { defaultValue: "Trash" })}
            </span>
            <Recycle className="h-3.5 w-3.5 text-rose-600" aria-hidden="true" />
          </div>
        </div>

        <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="bg-gradient-to-r from-[#f5d061] to-[#d6a928] transition-all duration-700"
            style={{ width: `${stashPct}%` }}
          />
          <div
            className="bg-gradient-to-r from-slate-700 to-slate-950 transition-all duration-700"
            style={{ width: `${trashPct}%` }}
          />
        </div>
      </div>

      {/* Symmetrical Split Stage: Grounded Horizon Pedestal for Coin & Bin */}
      <div className="grid grid-cols-2 items-stretch divide-x divide-slate-200/80">
        {/* LEFT HALF: SOrT 22k Gold Krugerrand Coin (STASH) */}
        <div className="group relative flex flex-col justify-between bg-gradient-to-b from-[#fffdf7] via-white to-[#fdf5dc]/60">
          <VerdictSuccess
            active={activeObject === "coin"}
            inline
            label={t("hero.stashedSuccessLabel", { defaultValue: "STASHED!" })}
            sublabel={t("hero.stashedSuccessSub", {
              defaultValue: "Keep what serves you · Gold standard",
            })}
          />

          {/* Stage Label */}
          <div className="px-2 pt-3 text-center sm:px-6 sm:pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900 whitespace-nowrap sm:text-xs">
              {t("hero.stashSideTitle", { defaultValue: "Stash · Gold Standard" })}
            </p>
          </div>

          {/* Grounded Interactive Coin Canvas */}
          <button
            type="button"
            aria-label={t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" })}
            onClick={() => {
              runEulerSpin(0);
              onCoinClick();
            }}
            onMouseEnter={() => {
              if (!coinSpinning && activeObject !== "coin") {
                setActiveObject("coin");
                runEulerSpin(950);
              }
            }}
            className="relative flex w-full cursor-pointer flex-col items-center justify-end px-2 pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d6a928]"
          >
            <div className="relative flex h-40 w-full items-end justify-center pb-3 sm:h-60 sm:pb-4 [perspective:1050px]">
              {/* Grounded elliptical contact shadow resting directly on the pedestal surface */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-2 sm:bottom-3 h-4 sm:h-5 w-24 sm:w-40 rounded-full bg-amber-950/25 blur-md transition-transform duration-100"
                style={{
                  transform: `scale(${coinPose.shadowScaleX}, ${coinPose.shadowScaleY})`,
                }}
              />

              {/* 3D Milled SOrT Krugerrand Coin */}
              <div
                className={cn(
                  "origin-bottom transition-transform duration-200",
                  !coinSpinning && "sot-coin-art group-hover:scale-105",
                )}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="origin-bottom scale-[0.66] sm:scale-100"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: `${COIN_SIZE}px`,
                      height: `${COIN_SIZE}px`,
                      transformStyle: "preserve-3d",
                      transform: `rotateX(${coinPose.camPitch}deg) translateY(${coinPose.dropY}px)`,
                    }}
                  >
                    <div
                      className="relative h-full w-full"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: `rotateY(${coinPose.phi}deg) rotateX(${coinPose.leanDeg}deg) rotateZ(${coinPose.psi}deg)`,
                      }}
                    >
                      {rimSlices.map((idx) => {
                        const zOffset = halfT - idx;
                        return (
                          <div
                            key={idx}
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-[2%] rounded-full"
                            style={{
                              transform: `translateZ(${zOffset}px)`,
                              background:
                                idx % 2 === 0
                                  ? "linear-gradient(90deg, #5e3807 0%, #b8841c 22%, #f0c954 48%, #9b6a12 76%, #4e2d05 100%)"
                                  : "linear-gradient(90deg, #4b2b04 0%, #996911 26%, #d9ad38 52%, #7e520a 80%, #3d2203 100%)",
                            }}
                          />
                        );
                      })}

                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-[2%] overflow-hidden rounded-full border-2 border-[#b4831a]"
                        style={{
                          transform: `translateZ(${-halfT}px) rotateY(180deg)`,
                          backfaceVisibility: "hidden",
                          background:
                            "radial-gradient(circle at 35% 32%, #f8db7a 0%, #d4a12a 48%, #9b6910 85%, #6d4607 100%)",
                        }}
                      >
                        <img
                          src={coinIcon}
                          alt=""
                          className="h-full w-full object-contain opacity-85 mix-blend-multiply select-none"
                        />
                      </div>

                      {coinPose.glintOpacity > 0 ? (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-[2%] z-20 overflow-hidden rounded-full"
                          style={{ transform: `translateZ(${halfT + 0.5}px)` }}
                        >
                          <div
                            className="h-full w-14 -skew-x-12 bg-gradient-to-r from-transparent via-amber-100/65 to-transparent"
                            style={{
                              transform: `translateX(${coinPose.glintX}px)`,
                              opacity: coinPose.glintOpacity,
                            }}
                          />
                        </div>
                      ) : null}

                      <img
                        src={coinIcon}
                        alt="SOrT 22k Gold Krugerrand Coin"
                        translate="no"
                        width={220}
                        height={220}
                        fetchPriority="high"
                        style={{
                          transform: `translateZ(${halfT}px)`,
                          backfaceVisibility: "hidden",
                        }}
                        className="h-full w-full object-contain drop-shadow-[0_10px_18px_rgba(68,32,4,0.22)] select-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span className="sr-only">
              {t("feed.stashesOfDay", { defaultValue: "Stashes of the Day" })}
            </span>
          </button>

          {/* Architectural Horizon Pedestal Shelf + Baseline-Aligned CTA */}
          <div className="border-t border-amber-200/80 bg-gradient-to-b from-amber-50/75 to-white px-2.5 py-3 sm:px-6 sm:py-4">
            <div className="flex min-h-[28px] items-center justify-center text-center">
              <p className="text-[11px] font-medium text-slate-600 sm:text-xs">
                {t("hero.tapCoin", { defaultValue: "Tap coin to spin & view Stashes" })}
              </p>
            </div>
            <div className="mt-2.5">
              <Link
                to="/feed"
                search={{ filter: "stash" }}
                onClick={() =>
                  triggerVerdictSuccess({
                    label: t("feed.stashesOfDay", { defaultValue: "STASHES OF THE DAY" }),
                    sublabel: t("hero.stashesOfDaySub", {
                      defaultValue: "Keep what serves you · Community Gold Standard",
                    }),
                  })
                }
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-950 bg-[#d6a928] px-3 py-2.5 text-xs font-extrabold text-slate-950 shadow-xs transition hover:brightness-105 whitespace-nowrap sm:px-5 sm:text-sm"
              >
                <Coins className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span className="tabular-nums">
                  {t("vote.stash", { defaultValue: "Stash" })} ({totalStashes})
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 hidden sm:inline" />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT HALF: Option A Vintage Galvanized Trash Can (TRASH) */}
        <div className="group relative flex flex-col justify-between bg-gradient-to-b from-slate-50/50 via-white to-slate-100/75">
          {/* Stage Label */}
          <div className="px-2 pt-3 text-center sm:px-6 sm:pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap sm:text-xs">
              {t("hero.trashSideTitle", { defaultValue: "Trash · Callout Bin" })}
            </p>
          </div>

          {/* Grounded Interactive Galvanized Bin Canvas */}
          <button
            type="button"
            aria-label={t("hero.slamTrashAria", {
              defaultValue: "Slam trash can for Trashes of the Day",
            })}
            onClick={handleTrashTrigger}
            onMouseEnter={() => {
              setLidHovered(true);
              if (activeObject !== "bin") {
                setActiveObject("bin");
                window.setTimeout(() => setActiveObject(null), 1250);
              }
            }}
            onMouseLeave={() => setLidHovered(false)}
            className="relative flex w-full cursor-pointer flex-col items-center justify-end px-2 pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-900"
          >
            <div
              className={cn(
                "relative flex h-40 w-full items-end justify-center pb-3 sm:h-60 sm:pb-4 transition-transform duration-150",
                binSlamming && "translate-y-1 scale-x-[1.03] scale-y-[0.97]",
              )}
            >
              {/* Grounded elliptical contact shadow resting on matching pedestal horizon */}
              <div
                aria-hidden="true"
                className={cn(
                  "sot-bin-shadow pointer-events-none absolute bottom-2 sm:bottom-3 h-4 sm:h-5 w-24 sm:w-40 rounded-full bg-slate-950/30 blur-md transition-transform duration-200",
                  (activeObject === "bin" || binSlamming) && "scale-x-110 opacity-45",
                )}
              />

              {/* Layered Progressive Option A Vintage Galvanized Can */}
              <div className="relative h-36 w-36 sm:h-52 sm:w-52">
                {/* Crumpled trash dropping inside on click */}
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute left-1/2 top-4 z-15 -ml-3.5 flex h-7 w-7 items-center justify-center rounded-full border border-slate-400 bg-amber-50 text-xs shadow-sm transition-all duration-400",
                    droppingParcel
                      ? "translate-y-12 scale-75 opacity-100 rotate-45"
                      : "-translate-y-4 scale-50 opacity-0",
                  )}
                >
                  🗞️
                </div>

                {/* Layer 1: Open barrel */}
                <img
                  src="/assets/candidates/trash_can_a_open.webp"
                  alt="SOrT Option A Vintage Galvanized Trash Can"
                  translate="no"
                  width={208}
                  height={208}
                  decoding="async"
                  fetchPriority="high"
                  className="pointer-events-none absolute inset-0 z-10 h-full w-full object-contain drop-shadow-[0_10px_18px_rgba(15,23,42,0.22)] select-none"
                />

                {/* Layer 2: Rising inner trash pile synced to timeframe */}
                <img
                  src="/assets/candidates/trash_can_a_pile.webp"
                  alt=""
                  aria-hidden="true"
                  width={208}
                  height={208}
                  decoding="async"
                  className="pointer-events-none absolute inset-0 z-15 h-full w-full object-contain select-none transition-all duration-500 ease-out"
                  style={{
                    opacity: windowTrashCount <= 0 ? 0 : Math.min(1, 0.35 + fillRatio * 0.8),
                    transform: `translateY(${pileTranslateY}%) scaleX(${pileScaleX})`,
                  }}
                />

                {/* Layer 3: Front curved rim lip */}
                <img
                  src="/assets/candidates/trash_can_a_front_lip.webp"
                  alt=""
                  aria-hidden="true"
                  width={208}
                  height={208}
                  decoding="async"
                  className="pointer-events-none absolute inset-0 z-20 h-full w-full object-contain select-none"
                />

                {/* Layer 4: Domed galvanized steel lid seated squarely & lifting straight */}
                <img
                  src="/assets/candidates/trash_can_a_lid.webp"
                  alt=""
                  aria-hidden="true"
                  width={208}
                  height={208}
                  decoding="async"
                  fetchPriority="high"
                  className="pointer-events-none absolute inset-0 z-30 h-full w-full object-contain select-none transition-all duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)]"
                  style={{
                    transform: `translateY(${lidLiftY}%) translateX(${lidShiftX}%) rotate(${lidTiltDeg}deg)`,
                  }}
                />
              </div>
            </div>
            <span className="sr-only">
              {t("hero.slamTrashAria", {
                defaultValue: "Slam trash can for Trashes of the Day",
              })}
            </span>
          </button>

          {/* Architectural Horizon Pedestal Shelf + Baseline-Aligned CTA */}
          <div className="border-t border-slate-200 bg-gradient-to-b from-slate-100/80 to-white px-2.5 py-3 sm:px-6 sm:py-4">
            <div className="flex min-h-[28px] flex-wrap items-center justify-center gap-1.5">
              <div
                role="group"
                aria-label="Choose Trash timeframe volume"
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-[10px] font-bold sm:text-[11px]"
              >
                {(["hour", "day", "week"] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setTrashWindow(w)}
                    className={cn(
                      "rounded-md px-1.5 sm:px-2.5 py-0.5 cursor-pointer transition-colors whitespace-nowrap",
                      trashWindow === w
                        ? "bg-rose-600 text-white"
                        : "text-slate-600 hover:text-slate-950",
                    )}
                  >
                    {TRASH_WINDOW_META[w].shortLabel}
                  </button>
                ))}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold tabular-nums sm:text-[11px]",
                  isOverflowing ? "text-rose-600" : "text-slate-600",
                )}
              >
                {fillPct}%{isOverflowing ? " · Full" : ""}
              </span>
            </div>

            <div className="mt-2.5">
              <Link
                to="/feed"
                search={{ filter: "trash" }}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-extrabold text-white shadow-xs transition hover:bg-slate-800 whitespace-nowrap sm:px-5 sm:text-sm"
              >
                <Recycle className="h-3.5 w-3.5 shrink-0 text-rose-400 sm:h-4 sm:w-4" />
                <span className="tabular-nums">
                  {t("vote.trash", { defaultValue: "Trash" })} ({totalTrashes})
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 hidden sm:inline" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
