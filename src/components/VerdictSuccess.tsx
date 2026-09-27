import { useEffect, useMemo, useState, useCallback } from "react";
import { Coins, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import coinIcon from "@/assets/icon-coin.png";

export interface VerdictSuccessEventDetail {
  label?: string;
  sublabel?: string;
  originX?: number;
  originY?: number;
  duration?: number;
}

const VERDICT_SUCCESS_EVENT = "sot:verdict-success";

/**
 * Imperatively trigger the celebratory gold-dust VerdictSuccess animation
 * from any Stash action across the app.
 */
export function triggerVerdictSuccess(detail: VerdictSuccessEventDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<VerdictSuccessEventDetail>(VERDICT_SUCCESS_EVENT, { detail }));
}

export interface VerdictSuccessProps {
  /** Whether the gold-dust celebration is currently active */
  active?: boolean;
  /** Optional callback fired when the celebration animation finishes */
  onComplete?: () => void;
  /** Headline displayed in the black & gold celebratory crest */
  label?: string;
  /** Subtitle displayed beneath the headline */
  sublabel?: string;
  /** Duration in ms before auto-completing (default: 2400ms) */
  duration?: number;
  /** Render inline inside a card/container instead of a fixed viewport overlay */
  inline?: boolean;
  /** Listen to global `triggerVerdictSuccess` events (used by root instance) */
  listenGlobal?: boolean;
  className?: string;
}

interface GoldDustParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
  duration: number;
  shade: string;
  shape: "circle" | "diamond" | "spark";
  driftX: number;
  fallY: number;
}

const GOLD_SHADES = [
  "#FFE885", // bright specular gold highlight
  "#F5D061", // warm champagne gold
  "#D6A928", // signature SOT brand gold
  "#B8860B", // deep burnished bullion gold
  "#FFF6CC", // white-gold glint
  "#111115", // jet-black contrast fleck
];

export function VerdictSuccess({
  active = false,
  onComplete,
  label = "STASHED!",
  sublabel = "Keep what serves you · Gold standard verdict recorded",
  duration = 2400,
  inline = false,
  listenGlobal = false,
  className,
}: VerdictSuccessProps) {
  const [isVisible, setIsVisible] = useState(active);
  const [burstKey, setBurstKey] = useState(0);
  const [dynamicLabel, setDynamicLabel] = useState(label);
  const [dynamicSublabel, setDynamicSublabel] = useState(sublabel);

  useEffect(() => {
    setDynamicLabel(label);
  }, [label]);

  useEffect(() => {
    setDynamicSublabel(sublabel);
  }, [sublabel]);

  useEffect(() => {
    if (active) {
      setIsVisible(true);
      setBurstKey((k) => k + 1);
      const timer = window.setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);
      return () => window.clearTimeout(timer);
    } else if (!listenGlobal) {
      setIsVisible(false);
    }
  }, [active, duration, onComplete, listenGlobal]);

  const handleGlobalTrigger = useCallback(
    (e: Event) => {
      const customEvent = e as CustomEvent<VerdictSuccessEventDetail>;
      const detail = customEvent.detail ?? {};
      if (detail.label) setDynamicLabel(detail.label);
      else setDynamicLabel(label);
      if (detail.sublabel) setDynamicSublabel(detail.sublabel);
      else setDynamicSublabel(sublabel);

      setIsVisible(true);
      setBurstKey((k) => k + 1);

      const activeDuration = detail.duration ?? duration;
      window.setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, activeDuration);
    },
    [duration, label, sublabel, onComplete],
  );

  useEffect(() => {
    if (!listenGlobal || typeof window === "undefined") return;
    window.addEventListener(VERDICT_SUCCESS_EVENT, handleGlobalTrigger);
    return () => {
      window.removeEventListener(VERDICT_SUCCESS_EVENT, handleGlobalTrigger);
    };
  }, [listenGlobal, handleGlobalTrigger]);

  // Deterministic yet rich 48-particle gold-dust cloud per burst
  const particles = useMemo<GoldDustParticle[]>(() => {
    return Array.from({ length: 48 }, (_, i) => {
      const seed = (i * 37 + burstKey * 13) % 100;
      const angle = (i / 48) * Math.PI * 2 + (seed % 7) * 0.08;
      const ring = i % 3; // inner, middle, outer radial rings
      const distance = 48 + ring * 55 + (seed % 45);
      const size = ring === 0 ? 4 + (seed % 4) : ring === 1 ? 6 + (seed % 5) : 3 + (seed % 4);
      const delay = (i % 8) * 28;
      const partDuration = 1100 + (seed % 900);
      const shade = GOLD_SHADES[i % GOLD_SHADES.length];
      const shape = i % 5 === 0 ? "spark" : i % 2 === 0 ? "diamond" : "circle";
      const driftX = Math.cos(angle) * distance;
      const fallY = Math.sin(angle) * distance + 28; // slight gravity settle

      return {
        id: i,
        angle,
        distance,
        size,
        delay,
        duration: partDuration,
        shade,
        shape,
        driftX,
        fallY,
      };
    });
  }, [burstKey]);

  if (!isVisible) return null;

  return (
    <div
      key={burstKey}
      role="status"
      aria-live="polite"
      data-testid="verdict-success"
      className={cn(
        "pointer-events-none z-50 flex items-center justify-center overflow-hidden select-none",
        inline ? "absolute inset-0 rounded-inherit" : "fixed inset-0",
        className,
      )}
    >
      {/* Subtle radial gold-and-black atmospheric vignette */}
      <div
        aria-hidden="true"
        className="verdict-gold-aura absolute inset-0"
      />

      {/* Central Gold-Dust Particle Burst Stage */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Expanding Gold Shockwave Rings */}
        <div
          aria-hidden="true"
          className="verdict-shockwave-ring absolute h-28 w-28 rounded-full border-2 border-[#d6a928]"
        />
        <div
          aria-hidden="true"
          className="verdict-shockwave-ring-delayed absolute h-40 w-40 rounded-full border border-[#ffe885]/70"
        />

        {/* Shimmering Gold-Dust Particles */}
        <div aria-hidden="true" className="relative h-0 w-0">
          {particles.map((p) => (
            <span
              key={p.id}
              className={cn(
                "verdict-gold-dust-particle absolute block",
                p.shape === "circle" && "rounded-full",
                p.shape === "diamond" && "rotate-45 rounded-[2px]",
                p.shape === "spark" && "rounded-full scale-x-150",
              )}
              style={
                {
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.shade,
                  boxShadow:
                    p.shade === "#111115"
                      ? "0 0 6px rgba(214, 169, 40, 0.85)"
                      : `0 0 ${p.size * 2}px ${p.shade}, 0 0 ${p.size}px #ffffff`,
                  "--tx": `${p.driftX.toFixed(1)}px`,
                  "--ty": `${p.fallY.toFixed(1)}px`,
                  animationDelay: `${p.delay}ms`,
                  animationDuration: `${p.duration}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Signature Black & Gold Celebratory Verdict Crest */}
        <div className="verdict-crest-pop relative z-10 flex items-center gap-3.5 rounded-2xl border-2 border-[#d6a928] bg-[#0b0b0f]/95 px-5 py-3.5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.55),0_0_30px_rgba(214,169,40,0.45)] backdrop-blur-md">
          {/* Gleaming Spinning Gold Coin Emblem */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffe885] via-[#d6a928] to-[#9a6f0a] p-1.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_4px_12px_rgba(214,169,40,0.5)]">
            <img
              src={coinIcon}
              alt=""
              aria-hidden="true"
              className="h-8 w-8 object-contain drop-shadow-sm animate-spin"
              style={{ animationDuration: "1.8s" }}
            />
            <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-[#ffe885] drop-shadow" />
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base font-black uppercase tracking-wider bg-gradient-to-r from-[#ffe885] via-[#f5d061] to-[#d6a928] bg-clip-text text-transparent">
                {dynamicLabel}
              </span>
              <CheckCircle2 className="h-4 w-4 text-[#d6a928]" />
            </div>
            <p className="text-[11px] font-semibold text-zinc-300">
              {dynamicSublabel}
            </p>
          </div>

          <Coins className="ml-1 h-5 w-5 text-[#d6a928]/80 hidden sm:block" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
