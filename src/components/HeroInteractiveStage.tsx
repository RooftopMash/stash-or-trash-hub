import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Coins, Recycle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { VerdictSuccess, triggerVerdictSuccess } from "@/components/VerdictSuccess";
import { cn } from "@/lib/utils";
import coinIcon from "@/assets/icon-coin.webp";
import type { FeedItem } from "@/lib/stash";

export type HeroTrashWindow = "hour" | "day" | "week";

const TRASH_WINDOW_META: Record<
  HeroTrashWindow,
  { shortLabel: string; capacity: number }
> = {
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

  // =========================================================================
  // 1. SOrT KRUGERRAND COIN: True 3D World-Y Vertical Spin -> Euler Cone -> Flat
  //    Uses rotateX(camPitch) -> translateY(dropY) -> rotateY(phi) -> rotateX(leanDeg) -> rotateZ(psi)
  //    So phi ALWAYS spins cleanly around vertical world Y (zero pinwheel twist!)
  // =========================================================================
  const COIN_SIZE = 196;
  const COIN_RADIUS = COIN_SIZE / 2;
  const COIN_THICKNESS = 10;
  const halfT = COIN_THICKNESS / 2;
  const rimSlices = useMemo(
    () => Array.from({ length: COIN_THICKNESS - 1 }, (_, i) => i + 1),
    [],
  );

  const [coinPose, setCoinPose] = useState({
    phi: 0, // vertical Y-axis spin / Euler cone precession (deg)
    leanDeg: 0, // 0deg = dead 90deg perpendicular upright, 90deg = flat horizontal on table
    psi: 0, // no-slip counter-rotation as coin leans into cone (+sin(lean)*dPhi)
    camPitch: 0, // 0deg straight-on at idle -> -20deg elevated view as coin cones & lies flat
    dropY: 0, // lowers center smoothly onto bottom rim height as coin settles flat
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
          // Phase 1: Pure 90deg upright vertical spin around world Y (initial ~3 full spins)
          const u = progress / 0.38;
          leanDeg = 4 * Math.pow(u, 4); // Holds strictly upright before leaning begins
          const omegaPhi = 1140 - 380 * u;
          phi += omegaPhi * dt;
        } else if (progress < 0.88) {
          // Phase 2: Realistic Euler's Disk cone while rolling rim buzzes faster
          const u = (progress - 0.38) / 0.5;
          leanDeg = 4 + 84.5 * Math.pow(u, 0.82); // 4deg upright -> 88.5deg nearly table-flat
          const speedUp = 720 + 1380 * Math.pow(Math.min(1, u / 0.9), 1.15);
          const tailBrake = u > 0.9 ? 1 - ((u - 0.9) / 0.1) * 0.45 : 1;
          const dPhi = speedUp * tailBrake * dt;
          phi += dPhi;
          // Exact no-slip counter-rotation cancels out planar twist as lean reaches 90deg
          psi += Math.sin((leanDeg * Math.PI) / 180) * dPhi;
        } else {
          // Phase 3: Settling dead 90deg-lean (0deg flat) with SOrT aligned neatly forward
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
        const dropY = 18 * (1 - Math.cos(leanRad)) + (COIN_RADIUS * 0.08) * flatProgress;
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
  const fillRatio = Math.max(
    0,
    Math.min(1.25, windowTrashCount / activeWindowMeta.capacity),
  );
  const fillPct = Math.round((windowTrashCount / activeWindowMeta.capacity) * 100);
  const isOverflowing = fillRatio >= 1;

  // Inner trash pile height synced cleanly to selected timeframe's Trash volume
  const pileTranslateY =
    fillRatio <= 0 ? 22 : Math.max(-2, 18.5 - Math.min(1.05, fillRatio) * 18.5);
  const pileScaleX = 0.9 + Math.min(1, fillRatio) * 0.1;

  // Steel lid sits straight & flush (0deg, 0px shift) until volume reaches high fill / overflow,
  // lifting cleanly vertically on fill or tilting open only when hovered/tapped.
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
    <div className="flex min-h-[225px] items-center justify-center sm:min-h-[355px]">
      {/* Strictly Side-by-Side (grid-cols-2) on BOTH Mobile and Desktop */}
      <div className="mx-auto grid w-full max-w-4xl grid-cols-2 items-end gap-2 sm:gap-8">
        {/* LEFT COLUMN: SOrT 22k Gold Krugerrand Coin (STASH) — NO surface plane underneath */}
        <div className="group relative flex flex-col items-center p-1 sm:p-4">
          <VerdictSuccess
            active={activeObject === "coin"}
            inline
            label={t("hero.stashedSuccessLabel", { defaultValue: "STASHED!" })}
            sublabel={t("hero.stashedSuccessSub", {
              defaultValue: "Keep what serves you · Gold standard",
            })}
          />
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
            className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl p-1 sm:p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6a928]"
          >
            <div className="relative flex h-40 w-full items-center justify-center sm:h-68 [perspective:1050px]">
              {/* Soft floating contact shadow ONLY (no surface plane / box underneath) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-2 sm:bottom-3 h-4 sm:h-6 w-24 sm:w-44 rounded-full bg-slate-950/28 blur-md transition-transform duration-100"
                style={{
                  transform: `scale(${coinPose.shadowScaleX}, ${coinPose.shadowScaleY})`,
                }}
              />

              {/* 3D Milled SOrT Krugerrand Coin */}
              <div
                className={cn(
                  "origin-center transition-transform duration-200",
                  !coinSpinning && "sot-coin-art group-hover:scale-105",
                )}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="scale-[0.62] sm:scale-100" style={{ transformStyle: "preserve-3d" }}>
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
                      {/* Solid 22k Copper-Gold Milled Edge Slices */}
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

                      {/* Reverse / Back Gold Face */}
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

                      {/* Specular Light Glint Across Face During Spin */}
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

                      {/* Front Obverse SOrT $ Krugerrand Face */}
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

          <div className="mt-1.5 sm:mt-3 flex w-full flex-col items-center gap-1 sm:gap-1.5 text-center">
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
              className="inline-flex w-full items-center justify-center gap-1 sm:gap-2 rounded-full border-2 border-slate-950 bg-[#d6a928] px-2 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_4px_18px_rgba(214,169,40,0.28)] transition hover:brightness-105"
            >
              <Coins className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="truncate">
                {t("feed.stashesOfDay", { defaultValue: "Stashes" })} ({totalStashes})
              </span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 hidden sm:inline" />
            </Link>
            <p className="text-[10px] sm:text-xs font-bold text-slate-700 hidden sm:block">
              {t("hero.tapCoin", { defaultValue: "Tap coin to spin & view Stashes" })}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Option A Vintage Galvanized Trash Can (TRASH) — NO surface plane underneath */}
        <div className="group relative flex flex-col items-center p-1 sm:p-4">
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
            className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl p-1 sm:p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <div
              className={cn(
                "relative flex h-40 w-full items-center justify-center sm:h-68 transition-transform duration-150",
                binSlamming && "translate-y-1 scale-x-[1.03] scale-y-[0.97]",
              )}
            >
              {/* Soft grounded elliptical contact shadow ONLY (no rectangular floor plane) */}
              <div
                aria-hidden="true"
                className={cn(
                  "sot-bin-shadow pointer-events-none absolute bottom-2 sm:bottom-3 h-4 sm:h-6 w-24 sm:w-44 rounded-full bg-slate-950/30 blur-md transition-transform duration-200",
                  (activeObject === "bin" || binSlamming) && "scale-x-110 opacity-45",
                )}
              />

              {/* Layered Progressive Option A Vintage Galvanized Can (Zero floor plane) */}
              <div className="relative h-36 w-36 sm:h-64 sm:w-64">
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
                  src="/assets/candidates/trash_can_a_open.png"
                  alt="SOrT Option A Vintage Galvanized Trash Can"
                  translate="no"
                  fetchPriority="high"
                  className="pointer-events-none absolute inset-0 z-10 h-full w-full object-contain drop-shadow-[0_10px_18px_rgba(15,23,42,0.22)] select-none"
                />

                {/* Layer 2: Rising inner trash pile synced to timeframe */}
                <img
                  src="/assets/candidates/trash_can_a_pile.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-15 h-full w-full object-contain select-none transition-all duration-500 ease-out"
                  style={{
                    opacity:
                      windowTrashCount <= 0 ? 0 : Math.min(1, 0.35 + fillRatio * 0.8),
                    transform: `translateY(${pileTranslateY}%) scaleX(${pileScaleX})`,
                  }}
                />

                {/* Layer 3: Front curved rim lip */}
                <img
                  src="/assets/candidates/trash_can_a_front_lip.png"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 h-full w-full object-contain select-none"
                />

                {/* Layer 4: Domed galvanized steel lid seated squarely & lifting straight */}
                <img
                  src="/assets/candidates/trash_can_a_lid.png"
                  alt=""
                  aria-hidden="true"
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

          <div className="mt-1.5 sm:mt-3 flex w-full flex-col items-center gap-1 sm:gap-1.5 text-center">
            <Link
              to="/feed"
              search={{ filter: "trash" }}
              className="inline-flex w-full items-center justify-center gap-1 sm:gap-2 rounded-full bg-slate-900 px-2 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shadow-sm transition hover:bg-slate-800"
            >
              <Recycle className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="truncate">
                {t("feed.trashesOfDay", { defaultValue: "Trashes" })} ({totalTrashes})
              </span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 hidden sm:inline" />
            </Link>

            {/* Compact timeframe selector driving the Option A bin pile & lid height live */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <div
                role="group"
                aria-label="Choose Trash timeframe volume"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 p-0.5 text-[9px] sm:text-[10px] font-bold"
              >
                {(["hour", "day", "week"] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setTrashWindow(w)}
                    className={cn(
                      "rounded-full px-1.5 sm:px-2 py-0.5 cursor-pointer transition-colors",
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
                  "text-[9px] sm:text-[10px] font-extrabold",
                  isOverflowing ? "text-rose-600" : "text-slate-500",
                )}
              >
                {fillPct}%{isOverflowing ? " · Overflow" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
