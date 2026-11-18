import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  Clock,
  Coins,
  Eye,
  Flame,
  Minus,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  Trash2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { fetchFeed } from "@/lib/stash";
import { playCoinSpinSound, playTrashSound } from "@/lib/verdict-sounds";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/asset-candidates")({
  ssr: false,
  component: AssetCandidatesPage,
});

type TrashWindow = "hour" | "day" | "week";

const WINDOW_CONFIG: Record<
  TrashWindow,
  { label: string; shortLabel: string; capacity: number; maxSlider: number; defaultPreview: number }
> = {
  hour: {
    label: "Trashes of the Hour",
    shortLabel: "Hour",
    capacity: 12,
    maxSlider: 16,
    defaultPreview: 3,
  },
  day: {
    label: "Trashes of the Day",
    shortLabel: "Day",
    capacity: 40,
    maxSlider: 52,
    defaultPreview: 19,
  },
  week: {
    label: "Trashes of the Week",
    shortLabel: "Week",
    capacity: 120,
    maxSlider: 150,
    defaultPreview: 82,
  },
};

function AssetCandidatesPage() {
  const [darkBg, setDarkBg] = useState(false);

  // =========================================================================
  // 1. REAL EULER-DISK CONE PRECESSION PHYSICS FOR SOrT KRUGERRAND COIN
  //    Starts strictly 90deg upright -> 3.5 upright spins -> overhead CONE -> flat standstill
  // =========================================================================
  const COIN_STAGE_SIZE = 200; // px square canvas
  const COIN_VISIBLE_RADIUS = 82; // px visible coin radius inside 200px PNG (~82% diameter)
  const COIN_THICKNESS = 11; // px solid milled 22k gold rim thickness
  const TABLE_VIEW_TILT_X = 72; // deg tabletop viewing angle (18deg above horizontal: crisp 90deg upright + sleek table-flat)

  const computeCoinCenterZ = (alphaDeg: number) => {
    const rad = (alphaDeg * Math.PI) / 180;
    return COIN_VISIBLE_RADIUS * Math.sin(rad) + (COIN_THICKNESS / 2) * Math.cos(rad);
  };

  const FLAT_CENTER_Z = COIN_THICKNESS / 2;

  const [isSpinning, setIsSpinning] = useState(false);
  const [isSettledFlat, setIsSettledFlat] = useState(false);
  const [stackedCoins, setStackedCoins] = useState<number>(0); // Extra coins stacked on top (0..4)
  const [spinPhaseLabel, setSpinPhaseLabel] = useState<string>(
    "Standing 90° upright · launching rim spin",
  );
  const [coinTransform, setCoinTransform] = useState({
    phi: 0, // precession / azimuth sweep around vertical table axis (deg)
    alpha: 90, // 90deg = dead vertical upright perpendicular to tabletop, 0deg = dead table-flat
    psi: 0, // no-slip counter-rotation around coin face normal (deg)
    centerZ: computeCoinCenterZ(90),
    glintX: -120,
    glintOpacity: 0,
  });
  const coinRafRef = useRef<number | null>(null);
  const hasAutoSpunRef = useRef(false);

  const stopCoinAnimation = useCallback(() => {
    if (coinRafRef.current !== null) {
      cancelAnimationFrame(coinRafRef.current);
      coinRafRef.current = null;
    }
  }, []);

  const triggerCoinSpin = useCallback(() => {
    stopCoinAnimation();
    setStackedCoins(0);
    setIsSettledFlat(false);
    try {
      playCoinSpinSound();
    } catch {
      /* audio unlocked after gesture */
    }

    setIsSpinning(true);
    setSpinPhaseLabel("90° upright spin · initial full turns…");

    const startTime = performance.now();
    // 6.3s complete realistic sequence:
    //  0.00..0.42 (~2.6s): Strictly 90deg perpendicular upright for the initial 3–4 full spins
    //  0.42..0.90 (~3.0s): Slowing drops coin into overhead EULER CONE while rolling edges speed up
    //  0.90..1.00 (~0.7s): Final edge buzz down to 0deg table-flat standstill
    const totalDuration = 6300;
    let lastTime = startTime;
    let phi = 0;
    let psi = 0;
    let alpha = 90;
    let omegaPhi = 920; // initial 90deg upright spin speed (deg/s)
    let lockedNetStart: number | null = null;
    let lockedNetTarget = 0;

    const step = (now: number) => {
      const dt = Math.min(0.04, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDuration);

      if (progress < 0.42) {
        // Phase 1: Pure 90deg vertical upright initial 3–4 spins before leaning begins
        const t = progress / 0.42;
        alpha = 90 - 4 * Math.pow(t, 4); // Holds ~90deg upright cleanly, nudging just to 86deg right before tipping
        omegaPhi = 920 - 380 * t; // Natural initial slowdown across ~3.5 full upright spins
        const dPhi = omegaPhi * dt;
        phi += dPhi;
        setSpinPhaseLabel("90° upright spin on milled edge…");
      } else if (progress < 0.9) {
        // Phase 2: Conish overhead precession as coin leans down & rolling rim speeds up (Euler's Disk)
        const u = (progress - 0.42) / 0.48;
        // Lean drops smoothly from 86deg -> 1.5deg
        alpha = 86 * Math.pow(1 - u, 1.45) + 1.5 * (1 - u);
        // Classic Euler's Disk cone acceleration: precession sweeps faster as lean angle drops, then brakes at very end
        const speedUp = 540 + 1420 * Math.pow(Math.min(1, u / 0.92), 1.15);
        const tailBrake = u > 0.92 ? 1 - ((u - 0.92) / 0.08) * 0.45 : 1;
        omegaPhi = speedUp * tailBrake;

        const dPhi = omegaPhi * dt;
        phi += dPhi;
        // Engage no-slip rolling smoothly so face slows down while cone edges buzz rapidly
        const rollEngage = Math.min(1, u / 0.16);
        psi -= rollEngage * Math.cos((alpha * Math.PI) / 180) * dPhi;

        setSpinPhaseLabel(
          u < 0.55
            ? "Leaning into overhead Euler cone…"
            : "Cone tightening · edges buzzing to standstill…",
        );
      } else {
        // Phase 3: Final edge buzz & clean upright alignment down to dead 0deg table-flat standstill
        const w = (progress - 0.9) / 0.1;
        if (lockedNetStart === null) {
          lockedNetStart = phi + psi;
          lockedNetTarget = Math.round(lockedNetStart / 360) * 360;
        }
        const remOmega = 850 * Math.pow(1 - w, 2.2);
        phi += remOmega * dt;
        alpha = Math.max(0, 2.2 * Math.pow(1 - w, 2.0));

        const easeNet = 1 - Math.pow(1 - w, 3);
        const currentNet = lockedNetStart + (lockedNetTarget - lockedNetStart) * easeNet;
        psi = currentNet - phi;
        setSpinPhaseLabel("Settling 0° table-flat…");
      }

      const centerZ = computeCoinCenterZ(alpha);
      const glintCycle = (((phi + psi) % 180) / 180) * 240 - 120;

      setCoinTransform({
        phi,
        alpha,
        psi,
        centerZ,
        glintX: glintCycle,
        glintOpacity: progress < 0.92 ? 0.55 : 0,
      });

      if (progress < 1) {
        coinRafRef.current = requestAnimationFrame(step);
      } else {
        setCoinTransform({
          phi: 0,
          alpha: 0,
          psi: 0,
          centerZ: FLAT_CENTER_Z,
          glintX: -120,
          glintOpacity: 0,
        });
        setIsSpinning(false);
        setIsSettledFlat(true);
        setSpinPhaseLabel("Table-flat standstill · Ready to stack another coin on top");
      }
    };

    coinRafRef.current = requestAnimationFrame(step);
  }, [FLAT_CENTER_Z, stopCoinAnimation]);

  const handleStackCoinOnTop = useCallback(() => {
    stopCoinAnimation();
    setIsSpinning(false);
    setIsSettledFlat(true);
    setCoinTransform({
      phi: 0,
      alpha: 0,
      psi: 0,
      centerZ: FLAT_CENTER_Z,
      glintX: -120,
      glintOpacity: 0,
    });
    setStackedCoins((prev) => {
      const next = Math.min(4, prev + 1);
      setSpinPhaseLabel(`${next + 1} flat SOrT Krugerrands stacked flush on the table`);
      return next;
    });
  }, [FLAT_CENTER_Z, stopCoinAnimation]);

  // Brief 500ms pause showing 90deg upright start position, then auto-launches full spin
  useEffect(() => {
    if (!hasAutoSpunRef.current) {
      hasAutoSpunRef.current = true;
      const timer = window.setTimeout(() => {
        triggerCoinSpin();
      }, 500);
      return () => {
        window.clearTimeout(timer);
        stopCoinAnimation();
      };
    }
    return () => stopCoinAnimation();
  }, [stopCoinAnimation, triggerCoinSpin]);

  // =========================================================================
  // 2. REACTIVE OPTION A VINTAGE TRASH CAN
  //    Simultaneous progressive fill (0%..100%+) driven by user-chosen Hour / Day / Week
  // =========================================================================
  const [trashWindow, setTrashWindow] = useState<TrashWindow>("day");
  const { data: feedItems = [] } = useQuery({
    queryKey: ["feed", "anon"],
    queryFn: () => fetchFeed(null),
  });

  // Live community Trashes counted inside each selectable window
  const liveWindowTrashes = useMemo(() => {
    const nowMs = Date.now();
    const hourMs = 60 * 60 * 1000;
    const dayMs = 24 * hourMs;
    const weekMs = 7 * dayMs;
    let hour = 0;
    let day = 0;
    let week = 0;
    for (const item of feedItems) {
      const trashes = Number(item.trashCount) || 0;
      if (trashes <= 0) continue;
      const age = nowMs - new Date(item.created_at).getTime();
      if (age <= hourMs) hour += trashes;
      if (age <= dayMs) day += trashes;
      if (age <= weekMs) week += trashes;
    }
    return { hour, day, week };
  }, [feedItems]);

  const [windowOverrides, setWindowOverrides] = useState<Record<TrashWindow, number | null>>({
    hour: null,
    day: null,
    week: null,
  });

  const activeConfig = WINDOW_CONFIG[trashWindow];
  const liveCountForWindow = liveWindowTrashes[trashWindow];
  const activeTrashCount =
    windowOverrides[trashWindow] !== null
      ? (windowOverrides[trashWindow] as number)
      : liveCountForWindow > 0
        ? liveCountForWindow
        : activeConfig.defaultPreview;

  const fillRatio = Math.max(0, Math.min(1.25, activeTrashCount / activeConfig.capacity));
  const fillPercent = Math.round((activeTrashCount / activeConfig.capacity) * 100);
  const isOverflowing = fillRatio >= 1;

  // Simultaneous Trash Pile height inside the bin (hidden low at 0%, steadily rising through rim up to overflow)
  const pileTranslateY =
    fillRatio <= 0 ? 22 : Math.max(-2, 18.5 - Math.min(1.05, fillRatio) * 18.5);
  const pileScaleX = 0.9 + Math.min(1, fillRatio) * 0.1;

  // Simultaneous Domed Lid Kinematics: sits flush when 0%, lifts & tilts progressively as fill climbs
  const [lidOpen, setLidOpen] = useState(false);
  const [binSlamming, setBinSlamming] = useState(false);
  const [droppingTrash, setDroppingTrash] = useState(false);

  const lidLiftY = lidOpen
    ? -16.5
    : fillRatio <= 0.35
      ? 0
      : -Math.min(7.5, (fillRatio - 0.35) * 8.2);
  const lidShiftX = lidOpen ? 3 : fillRatio > 0.9 ? (Math.min(1.2, fillRatio) - 0.9) * 3.5 : 0;
  const lidTiltDeg = lidOpen ? -15 : fillRatio <= 0.9 ? 0 : (Math.min(1.2, fillRatio) - 0.9) * 14;

  const setActiveCount = useCallback(
    (updater: number | ((prev: number) => number)) => {
      setWindowOverrides((prev) => {
        const current =
          prev[trashWindow] !== null
            ? (prev[trashWindow] as number)
            : liveCountForWindow > 0
              ? liveCountForWindow
              : WINDOW_CONFIG[trashWindow].defaultPreview;
        const nextVal = Math.max(0, typeof updater === "function" ? updater(current) : updater);
        return { ...prev, [trashWindow]: nextVal };
      });
    },
    [liveCountForWindow, trashWindow],
  );

  const triggerTrashDrop = useCallback(
    (incrementCount = true) => {
      if (incrementCount) {
        setActiveCount((c) => c + 1);
      }
      setLidOpen(true);
      setDroppingTrash(true);

      window.setTimeout(() => {
        setDroppingTrash(false);
        setBinSlamming(true);
        setLidOpen(false);
        try {
          playTrashSound();
        } catch {
          /* ignore */
        }
        window.setTimeout(() => setBinSlamming(false), 320);
      }, 560);
    },
    [setActiveCount],
  );

  // Micro-offsets per stacked coin so a pile of table-flat coins looks natural
  const stackOffsets = [
    { x: 2.5, zRot: -7 },
    { x: -2, zRot: 6 },
    { x: 1.5, zRot: -4 },
    { x: -1, zRot: 9 },
  ];

  // Solid 3D milled-edge coin renderer centered around Z=0 (-T/2 to +T/2)
  const renderSolidKrugerrand = (options?: {
    glintX?: number;
    glintOpacity?: number;
    isStackedLayer?: boolean;
  }) => {
    const halfT = COIN_THICKNESS / 2;
    const rimSlices = Array.from({ length: COIN_THICKNESS - 1 }, (_, i) => i + 1);
    return (
      <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        {/* Solid 22k Copper-Gold Milled Edge Slices (+4.5px down to -4.5px around coin center) */}
        {rimSlices.map((idx) => {
          const zOffset = halfT - idx;
          return (
            <div
              key={idx}
              aria-hidden="true"
              className="pointer-events-none absolute inset-[9%] rounded-full"
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

        {/* Reverse / Back Gold Face (-T/2 depth, rotated 180deg so visible during upright spins) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[9%] overflow-hidden rounded-full border-2 border-[#b4831a]"
          style={{
            transform: `translateZ(${-halfT}px) rotateY(180deg)`,
            backfaceVisibility: "hidden",
            background:
              "radial-gradient(circle at 35% 32%, #f8db7a 0%, #d4a12a 48%, #9b6910 85%, #6d4607 100%)",
          }}
        >
          <img
            src="/assets/candidates/krugerrand_sort_final.png"
            alt=""
            referrerPolicy="no-referrer"
            className="h-full w-full scale-[1.22] object-contain opacity-85 mix-blend-multiply select-none"
          />
        </div>

        {/* Specular Light Glint Across Obverse Face */}
        {options?.glintOpacity ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[9%] z-20 overflow-hidden rounded-full"
            style={{ transform: `translateZ(${halfT + 0.5}px)` }}
          >
            <div
              className="h-full w-14 -skew-x-12 bg-gradient-to-r from-transparent via-amber-100/65 to-transparent"
              style={{
                transform: `translateX(${options.glintX ?? -120}px)`,
                opacity: options.glintOpacity,
              }}
            />
          </div>
        ) : null}

        {/* Front / Top Krugerrand Obverse Face (+T/2 Z) */}
        <img
          src="/assets/candidates/krugerrand_sort_final.png"
          alt="SOrT 22k Gold Krugerrand Coin with $ engraving"
          referrerPolicy="no-referrer"
          style={{
            transform: `translateZ(${halfT}px)`,
            backfaceVisibility: "hidden",
          }}
          className={cn(
            "h-full w-full object-contain select-none",
            options?.isStackedLayer
              ? "drop-shadow-[0_3px_5px_rgba(38,18,2,0.5)]"
              : "drop-shadow-[0_6px_12px_rgba(68,32,4,0.28)]",
          )}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Top Bar */}
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 px-2.5 py-1 text-xs font-bold text-[#f5d061]">
              <Eye className="h-3.5 w-3.5 text-[#d6a928]" />
              Interactive Preview Studio · Live App Icons Untouched
            </span>
            <h1 className="mt-2 font-display text-3xl font-black tracking-tight">
              Refined SOrT Krugerrand &amp; Reactive Option A Trash Can
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Test both brought-to-life hero assets right here before we apply them across the app:
              exact{" "}
              <strong translate="no" className="notranslate">
                SOrT
              </strong>{" "}
              casing, Option B/C gold blend spinning continuously to a{" "}
              <strong>table-flat stackable rest</strong>, and Option A&apos;s lifting lid &amp;
              daily overflow state.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDarkBg((v) => !v)}
              className="gap-1.5 font-bold"
            >
              {darkBg ? <Sun className="h-4 w-4 text-[#d6a928]" /> : <Moon className="h-4 w-4" />}
              {darkBg ? "Light Surface" : "Dark Surface"}
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5 font-bold">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Interactive Side-by-Side Live Stage (Strictly Left=Stash vs Right=Trash on BOTH Mobile & Web) */}
        <section
          className={cn(
            "mt-8 grid grid-cols-2 gap-2.5 sm:gap-6 rounded-3xl border-2 border-[#d6a928]/45 p-2.5 sm:p-8 transition-colors",
            darkBg
              ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white"
              : "bg-gradient-to-b from-amber-50/40 via-white to-slate-50/80 text-slate-950",
          )}
        >
          {/* LEFT STAGE: REFINED KRUGERRAND COIN WITH CONTINUOUS SPIN TO TABLE-FLAT STACKING */}
          <div className="min-w-0 flex flex-col justify-between rounded-2xl border border-border/50 bg-background/10 p-2.5 sm:p-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-950 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-extrabold text-[#f5d061]">
                  <Coins className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#d6a928] shrink-0" />
                  <span className="sm:hidden">STASH · C+</span>
                  <span className="hidden sm:inline">Option C+ Refined · Solid 3D Milled Rim</span>
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-[#b88914] dark:text-[#f5d061]">
                  {isSpinning
                    ? "Spinning…"
                    : isSettledFlat
                      ? `Flat (${stackedCoins + 1})`
                      : "Ready"}
                </span>
              </div>
              <h2 className="mt-2 sm:mt-3 font-display text-sm sm:text-xl font-black leading-tight">
                SOrT 22k Krugerrand
              </h2>
              <p className="mt-1 hidden sm:block text-xs opacity-75">
                Starts with 3–4 clean upright rim spins, slows into a top-down{" "}
                <strong>Euler cone</strong> as its edges buzz rapidly, and settles{" "}
                <strong>table-flat</strong> to a standstill so coins stack flush on top.
              </p>
            </div>

            {/* Interactive Tabletop Coin Stage (Scaled cleanly on mobile without breaking preserve-3d) */}
            <div className="relative my-3 sm:my-5 flex h-44 sm:h-80 flex-col items-center justify-end overflow-hidden rounded-2xl pb-2 sm:pb-3">
              <div className="origin-bottom scale-[0.54] sm:scale-100 [perspective:1050px]">
                <button
                  type="button"
                  onClick={triggerCoinSpin}
                  aria-label="Spin SOrT Krugerrand gold coin on tabletop"
                  className="group relative flex h-60 w-60 cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6a928]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Shared Tabletop Camera Frame: XY plane is horizontal table surface, +Z points straight UP */}
                  <div
                    className="relative flex items-center justify-center"
                    style={{
                      width: `${COIN_STAGE_SIZE}px`,
                      height: `${COIN_STAGE_SIZE}px`,
                      transformStyle: "preserve-3d",
                      transform: `translateY(28px) rotateX(${TABLE_VIEW_TILT_X}deg)`,
                    }}
                  >
                    {/* Clean floating stage at z = 0 (no rectangular surface plane) */}

                    {/* Subtle circular cone sweep reflection ring while coning */}
                    {isSpinning && coinTransform.alpha > 2 && coinTransform.alpha < 68 ? (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-[8%] rounded-full border border-[#d6a928]/35 bg-[#d6a928]/10 blur-[2px]"
                        style={{ transform: "translateZ(0.5px)" }}
                      />
                    ) : null}

                    {/* Grounded Contact Shadow right on the z=0 table plane, aligned with precession azimuth phi */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-[9%] rounded-full bg-slate-950/65 blur-md"
                      style={{
                        transform: `translateZ(0.5px) rotateZ(${coinTransform.phi}deg) scaleY(${Math.max(0.22, Math.cos((coinTransform.alpha * Math.PI) / 180))})`,
                        opacity: 0.34 + 0.14 * Math.cos((coinTransform.alpha * Math.PI) / 180),
                      }}
                    />

                    {/* Base Coin: Precession Cone Sweep (rotateZ(phi)) -> Lean Off Table (rotateX(-alpha)) -> No-Slip Spin (rotateZ(psi)) */}
                    <div
                      className="relative"
                      style={{
                        width: `${COIN_STAGE_SIZE}px`,
                        height: `${COIN_STAGE_SIZE}px`,
                        transformStyle: "preserve-3d",
                        transform: `translateZ(${coinTransform.centerZ}px) rotateZ(${coinTransform.phi}deg) rotateX(${-coinTransform.alpha}deg) rotateZ(${coinTransform.psi}deg)`,
                      }}
                    >
                      {renderSolidKrugerrand({
                        glintX: coinTransform.glintX,
                        glintOpacity: coinTransform.glintOpacity,
                      })}
                    </div>

                    {/* Extra Table-Flat Stacked Coins Sitting Directly On Top in +Z */}
                    {isSettledFlat &&
                      Array.from({ length: stackedCoins }, (_, idx) => {
                        const stackLevel = idx + 1;
                        const offset = stackOffsets[idx] ?? { x: 0, zRot: 0 };
                        const stackZ = FLAT_CENTER_Z + stackLevel * COIN_THICKNESS;
                        return (
                          <div
                            key={stackLevel}
                            aria-hidden="true"
                            className="pointer-events-none absolute animate-in fade-in duration-200"
                            style={{
                              width: `${COIN_STAGE_SIZE}px`,
                              height: `${COIN_STAGE_SIZE}px`,
                              transformStyle: "preserve-3d",
                              transform: `translate3d(${offset.x}px, 0px, ${stackZ}px) rotateZ(${offset.zRot}deg)`,
                            }}
                          >
                            {renderSolidKrugerrand({ isStackedLayer: true })}
                          </div>
                        );
                      })}
                  </div>
                </button>
              </div>

              <p className="relative z-10 mt-1 text-center text-[10px] sm:text-xs font-bold tracking-wide text-[#b88914] dark:text-[#f5d061] line-clamp-2">
                {spinPhaseLabel}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-border/40 pt-3 sm:pt-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  onClick={triggerCoinSpin}
                  className="h-8 gap-1 bg-[#d6a928] px-2.5 sm:px-3 text-[11px] sm:text-xs font-black text-slate-950 hover:bg-[#e5b935]"
                >
                  <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {isSpinning ? "Re-Spin" : "Spin"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleStackCoinOnTop}
                  disabled={stackedCoins >= 4}
                  className="h-8 gap-1 border-[#d6a928]/60 px-2 sm:px-3 text-[11px] sm:text-xs font-bold hover:bg-[#d6a928]/15"
                >
                  <Coins className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#d6a928]" />
                  {stackedCoins >= 4 ? "Max (5)" : "Stack (+1)"}
                </Button>
                {stackedCoins > 0 ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setStackedCoins(0);
                      setSpinPhaseLabel(
                        "Table-flat standstill · Ready to stack another coin on top",
                      );
                    }}
                    className="h-8 px-2 text-[11px] sm:text-xs font-bold"
                  >
                    Clear
                  </Button>
                ) : null}
              </div>
              <span className="hidden sm:inline text-[11px] font-semibold opacity-75">
                Engraved:{" "}
                <strong translate="no" className="notranslate">
                  SOrT
                </strong>{" "}
                + <strong>$</strong>
              </span>
            </div>
          </div>

          {/* RIGHT STAGE: OPTION A TRASH CAN MOVING SIMULTANEOUSLY WITH HOUR / DAY / WEEK TRASHES */}
          <div className="min-w-0 flex flex-col justify-between rounded-2xl border border-border/50 bg-background/10 p-2.5 sm:p-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-extrabold text-white">
                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  <span className="sm:hidden">TRASH · Bin A</span>
                  <span className="hidden sm:inline">
                    Option A Vintage Bin · Live Progressive Volume
                  </span>
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold",
                    isOverflowing
                      ? "bg-rose-500/20 text-rose-500 ring-1 ring-rose-500/40"
                      : fillRatio === 0
                        ? "bg-slate-500/15 text-muted-foreground"
                        : "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                  )}
                >
                  {isOverflowing ? (
                    <Flame className="h-3 w-3 shrink-0" />
                  ) : (
                    <Clock className="h-3 w-3 shrink-0" />
                  )}
                  {activeTrashCount}/{activeConfig.capacity} ({fillPercent}%)
                </span>
              </div>

              <div className="mt-2 sm:mt-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-sm sm:text-xl font-black leading-tight">
                  {activeConfig.label}
                </h2>
                {/* User Choice: Hour / Day / Week Timeframe Selector */}
                <div
                  role="group"
                  aria-label="Choose Trash timeframe window"
                  className="inline-flex rounded-lg border border-border bg-background/80 p-0.5"
                >
                  {(["hour", "day", "week"] as const).map((win) => (
                    <button
                      key={win}
                      type="button"
                      onClick={() => {
                        setTrashWindow(win);
                        setLidOpen(false);
                      }}
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10px] sm:text-xs font-extrabold transition-colors cursor-pointer",
                        trashWindow === win
                          ? "bg-rose-600 text-white"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {WINDOW_CONFIG[win].shortLabel}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-1 hidden sm:block text-xs opacity-75">
                Rubbish level &amp; steel lid move simultaneously as{" "}
                <strong>{activeConfig.label.toLowerCase()}</strong> climb from 0% empty through
                mid-fill to 100%+ overflow.
              </p>
            </div>

            {/* Interactive Progressive Layered Trash Can Stage */}
            <div className="relative my-3 sm:my-5 flex h-44 sm:h-72 flex-col items-center justify-center">
              {/* Grounded tabletop contact shadow */}
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute bottom-6 sm:bottom-5 h-4 sm:h-6 w-24 sm:w-44 rounded-full bg-slate-950/45 blur-md transition-transform duration-200",
                  binSlamming && "scale-x-110",
                )}
              />

              <button
                type="button"
                onClick={() => triggerTrashDrop(true)}
                onMouseEnter={() => {
                  if (!isOverflowing) setLidOpen(true);
                }}
                onMouseLeave={() => {
                  if (!droppingTrash) setLidOpen(false);
                }}
                aria-label="Drop trash into Option A bin and test progressive fill"
                className={cn(
                  "relative flex h-36 w-36 sm:h-64 sm:w-64 cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-2xl transition-transform duration-150",
                  binSlamming && "translate-y-1 scale-x-[1.03] scale-y-[0.97]",
                )}
              >
                {/* Animated Crumpled Trash Parcel Dropping Inside */}
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-400 bg-amber-50 text-xs shadow-sm transition-all duration-500",
                    droppingTrash
                      ? "translate-y-14 scale-75 opacity-100 rotate-45"
                      : "-translate-y-4 scale-50 opacity-0",
                  )}
                >
                  🗞️
                </div>

                {/* LAYER 1 (z-10): Empty Open Galvanized Barrel & Dark Interior */}
                <img
                  src="/assets/candidates/trash_can_a_open.png"
                  alt="Option A galvanized trash can interior and body"
                  referrerPolicy="no-referrer"
                  className="pointer-events-none absolute inset-0 z-10 h-full w-full object-contain drop-shadow-[0_10px_18px_rgba(15,23,42,0.28)] select-none"
                />

                {/* LAYER 2 (z-15): Progressive Rising Rubbish Heap Seated Inside Barrel */}
                <img
                  src="/assets/candidates/trash_can_a_pile.png"
                  alt=""
                  aria-hidden="true"
                  referrerPolicy="no-referrer"
                  className="pointer-events-none absolute inset-0 z-15 h-full w-full object-contain select-none transition-all duration-500 ease-out"
                  style={{
                    opacity: activeTrashCount <= 0 ? 0 : Math.min(1, 0.35 + fillRatio * 0.8),
                    transform: `translateY(${pileTranslateY}%) scaleX(${pileScaleX})`,
                  }}
                />

                {/* LAYER 3 (z-20): Front Curved Steel Rim Lip Mask (Keeps Rising Trash Inside the Can) */}
                <img
                  src="/assets/candidates/trash_can_a_front_lip.png"
                  alt=""
                  aria-hidden="true"
                  referrerPolicy="no-referrer"
                  className="pointer-events-none absolute inset-0 z-20 h-full w-full object-contain select-none"
                />

                {/* LAYER 4 (z-30): Domed Steel Lid Moving Simultaneously With Fill Ratio */}
                <img
                  src="/assets/candidates/trash_can_a_lid.png"
                  alt="Option A galvanized steel domed lid"
                  referrerPolicy="no-referrer"
                  className="pointer-events-none absolute inset-0 z-30 h-full w-full object-contain select-none transition-all duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)]"
                  style={{
                    transform: `translateY(${lidLiftY}%) translateX(${lidShiftX}%) rotate(${lidTiltDeg}deg)`,
                  }}
                />
              </button>

              <p className="mt-1 text-center text-[10px] sm:text-xs font-bold text-rose-600 dark:text-rose-400 line-clamp-2">
                {activeTrashCount <= 0
                  ? `Empty (0%) · Lid sealed flat`
                  : isOverflowing
                    ? `Overflow (${fillPercent}%) · ${activeConfig.shortLabel} pile pushing lid crooked`
                    : fillRatio >= 0.7
                      ? `High Volume (${fillPercent}%) · Mound pushing lid up`
                      : fillRatio >= 0.35
                        ? `Half Full (${fillPercent}%) · Rubbish rising inside rim`
                        : `Light Volume (${fillPercent}%) · Starting to fill`}
              </p>
            </div>

            {/* Interactive Fill Slider + Simultaneous Controls */}
            <div className="space-y-2.5 border-t border-border/40 pt-3">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={activeConfig.maxSlider}
                  value={activeTrashCount}
                  aria-label={`Adjust ${activeConfig.label} volume`}
                  onChange={(e) => {
                    setLidOpen(false);
                    setActiveCount(Number(e.target.value));
                  }}
                  className="h-1.5 w-full cursor-pointer accent-rose-600"
                />
                <span className="shrink-0 text-[10px] sm:text-xs font-black tabular-nums">
                  {fillPercent}%
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => triggerTrashDrop(true)}
                    className="h-8 gap-1 bg-rose-600 px-2 sm:px-3 text-[11px] sm:text-xs font-bold text-white hover:bg-rose-500"
                  >
                    <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Drop (+1)
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setLidOpen(false);
                      setActiveCount((c) => Math.max(0, c - 1));
                    }}
                    disabled={activeTrashCount <= 0}
                    className="h-8 px-2 text-[11px] sm:text-xs font-bold"
                    aria-label="Remove one trash from count"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setLidOpen((v) => !v)}
                    className="h-8 px-2 sm:px-3 text-[11px] sm:text-xs font-bold"
                  >
                    {lidOpen ? "Close" : "Lift Lid"}
                  </Button>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setLidOpen(false);
                    setActiveCount(0);
                  }}
                  className="h-7 sm:h-8 px-2 text-[10px] sm:text-xs font-bold"
                >
                  Empty (0%)
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Future Krugerrand Award Showcase & Button Size Scale Check */}
        <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-xs">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
            <div>
              <h2 className="font-display text-xl font-black flex items-center gap-2">
                <Award className="h-5 w-5 text-[#d6a928]" />
                Actual Size &amp; Future SOrT Krugerrand Award Preview
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                How your chosen Option C+ SOrT Krugerrand and Option A Vintage Bin scale across
                Stash/Trash vote pills and the Annual Krugerrand Honour trophy.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-extrabold text-[#b88914]">
              <Sparkles className="h-3.5 w-3.5" /> Preview Only · Ready on Your Go-Ahead
            </span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {/* Strictly side-by-side Stash Coin (Left) vs Trash Can (Right) on BOTH mobile & desktop */}
            <div className="grid grid-cols-2 gap-3 lg:col-span-2 lg:gap-5">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-3.5 sm:p-5 text-center">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Feed Vote Coin (56px)
                </span>
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <img
                    src="/assets/candidates/krugerrand_sort_final.png"
                    alt="SOrT Krugerrand small icon"
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 sm:h-14 sm:w-14 object-contain drop-shadow-sm"
                  />
                  <span className="font-display text-lg sm:text-xl font-black text-[#d6a928]">
                    STASH
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-3.5 sm:p-5 text-center">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Feed Trash Can (56px)
                </span>
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <img
                    src={
                      isOverflowing
                        ? "/assets/candidates/trash_can_a_overflow.png"
                        : fillRatio >= 0.45
                          ? "/assets/candidates/trash_can_a_open.png"
                          : "/assets/candidates/trash_can_a_closed.png"
                    }
                    alt="Option A trash small icon"
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 sm:h-14 sm:w-14 object-contain drop-shadow-sm"
                  />
                  <span className="font-display text-lg sm:text-xl font-black text-rose-500">
                    TRASH
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#d6a928]/50 bg-slate-950 p-5 text-center text-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#f5d061]">
                Future Krugerrand Award Honour
              </span>
              <div className="mt-3 flex flex-col items-center gap-2">
                <img
                  src="/assets/candidates/krugerrand_sort_final.png"
                  alt="SOrT Annual Krugerrand Award"
                  referrerPolicy="no-referrer"
                  className="h-24 w-24 object-contain drop-shadow-[0_0_20px_rgba(214,169,40,0.45)]"
                />
                <span translate="no" className="notranslate text-xs font-extrabold text-[#f5d061]">
                  SOrT Krugerrand Gold Standard Award
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
