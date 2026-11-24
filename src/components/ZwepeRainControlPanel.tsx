import { useState } from "react";
import { Check, Copy, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import {
  ZWEPE_COIN_DEFAULTS,
  ZWEPE_COIN_LIMITS,
  ZWEPE_COIN_PRESETS,
  type ZwepeCoinRainConfig,
} from "@/lib/zwepe-coin-config";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ZwepeRainControlPanelProps {
  config: ZwepeCoinRainConfig;
  onChange: (next: ZwepeCoinRainConfig) => void;
  onReset: () => void;
}

export function ZwepeRainControlPanel({
  config,
  onChange,
  onReset,
}: ZwepeRainControlPanelProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isDefault =
    config.count === ZWEPE_COIN_DEFAULTS.count &&
    config.speed === ZWEPE_COIN_DEFAULTS.speed &&
    config.gravity === ZWEPE_COIN_DEFAULTS.gravity &&
    config.depthLayerOpacity === ZWEPE_COIN_DEFAULTS.depthLayerOpacity;

  const handleCopyConfig = async () => {
    const snippet = `export const ZWEPE_COIN_DEFAULTS = ${JSON.stringify(config, null, 2)};`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      toast.success("Zwepe coin config copied to clipboard");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.info(`count: ${config.count}, speed: ${config.speed}x, gravity: ${config.gravity}g`);
    }
  };

  return (
    <div className="relative z-30 flex justify-end">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="zwepe-rain-controls-panel"
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold shadow-xs transition-colors cursor-pointer",
            open
              ? "border-[#d6a928] bg-slate-950 text-[#f5d061]"
              : "border-slate-300 bg-white/95 text-slate-800 hover:border-[#d6a928] hover:bg-amber-50/70",
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#b88914]" />
          <span>Coin Intensity</span>
          <span
            className={cn(
              "font-mono text-[11px] font-extrabold tabular-nums",
              open ? "text-[#f5d061]" : "text-[#855e00]",
            )}
          >
            {config.count} · {config.speed.toFixed(2)}× · {config.gravity.toFixed(2)}g
          </span>
        </button>

        {open && (
          <div
            id="zwepe-rain-controls-panel"
            role="dialog"
            aria-label="Falling Zwepe Coin Intensity Controls"
            className="absolute right-0 top-full mt-2 w-[310px] sm:w-[340px] rounded-2xl border border-[#d6a928]/45 bg-slate-950 p-4 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f5d061]">
                  Zwepe Rain Physics
                </p>
                <h3 className="font-display text-sm font-black text-white">
                  Coin Count, Speed &amp; Gravity
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close coin controls"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Intensity Presets */}
            <div className="mt-3">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Intensity Presets
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {ZWEPE_COIN_PRESETS.map((preset) => {
                  const active =
                    config.count === preset.config.count &&
                    config.speed === preset.config.speed &&
                    config.gravity === preset.config.gravity;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onChange({ ...preset.config })}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 text-[11px] font-bold transition-colors cursor-pointer",
                        active
                          ? "border-[#d6a928] bg-[#d6a928] text-slate-950"
                          : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:bg-slate-800",
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders */}
            <div className="mt-4 space-y-3.5">
              {/* Count */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="zwepe-count-slider" className="font-bold text-slate-200">
                    Falling Coins Count
                  </label>
                  <span className="font-mono font-extrabold tabular-nums text-[#f5d061]">
                    {config.count} / {ZWEPE_COIN_LIMITS.count.max}
                  </span>
                </div>
                <input
                  id="zwepe-count-slider"
                  type="range"
                  min={ZWEPE_COIN_LIMITS.count.min}
                  max={ZWEPE_COIN_LIMITS.count.max}
                  step={ZWEPE_COIN_LIMITS.count.step}
                  value={config.count}
                  onChange={(e) =>
                    onChange({ ...config, count: Number(e.target.value) })
                  }
                  className="mt-1.5 h-2 w-full accent-[#d6a928] cursor-pointer"
                />
              </div>

              {/* Speed */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="zwepe-speed-slider" className="font-bold text-slate-200">
                    Fall Speed
                  </label>
                  <span className="font-mono font-extrabold tabular-nums text-[#f5d061]">
                    {config.speed.toFixed(2)}×
                  </span>
                </div>
                <input
                  id="zwepe-speed-slider"
                  type="range"
                  min={ZWEPE_COIN_LIMITS.speed.min}
                  max={ZWEPE_COIN_LIMITS.speed.max}
                  step={ZWEPE_COIN_LIMITS.speed.step}
                  value={config.speed}
                  onChange={(e) =>
                    onChange({ ...config, speed: Number(e.target.value) })
                  }
                  className="mt-1.5 h-2 w-full accent-[#d6a928] cursor-pointer"
                />
              </div>

              {/* Gravity */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="zwepe-gravity-slider" className="font-bold text-slate-200">
                    Gravity Acceleration
                  </label>
                  <span className="font-mono font-extrabold tabular-nums text-[#f5d061]">
                    {config.gravity.toFixed(2)}g
                  </span>
                </div>
                <input
                  id="zwepe-gravity-slider"
                  type="range"
                  min={ZWEPE_COIN_LIMITS.gravity.min}
                  max={ZWEPE_COIN_LIMITS.gravity.max}
                  step={ZWEPE_COIN_LIMITS.gravity.step}
                  value={config.gravity}
                  onChange={(e) =>
                    onChange({ ...config, gravity: Number(e.target.value) })
                  }
                  className="mt-1.5 h-2 w-full accent-[#d6a928] cursor-pointer"
                />
                <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
                  <span>0.3g Float</span>
                  <span>1.0g Steady</span>
                  <span>2.5g Heavy Drop</span>
                </div>
              </div>

              {/* Background Watermark Depth */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="zwepe-depth-slider" className="font-bold text-slate-200">
                    Background Rain Depth
                  </label>
                  <span className="font-mono font-extrabold tabular-nums text-[#f5d061]">
                    {Math.round(config.depthLayerOpacity * 100)}%
                  </span>
                </div>
                <input
                  id="zwepe-depth-slider"
                  type="range"
                  min={ZWEPE_COIN_LIMITS.depthLayerOpacity.min}
                  max={ZWEPE_COIN_LIMITS.depthLayerOpacity.max}
                  step={ZWEPE_COIN_LIMITS.depthLayerOpacity.step}
                  value={config.depthLayerOpacity}
                  onChange={(e) =>
                    onChange({ ...config, depthLayerOpacity: Number(e.target.value) })
                  }
                  className="mt-1.5 h-2 w-full accent-[#d6a928] cursor-pointer"
                />
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={onReset}
                disabled={isDefault}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 disabled:opacity-45 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
              <button
                type="button"
                onClick={() => void handleCopyConfig()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#d6a928] px-3 py-1.5 text-xs font-black text-slate-950 hover:bg-[#e5b935] cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Config"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
