export interface ZwepeCoinRainConfig {
  /** Number of live 3D tumbling & colliding Zwepe coins rendered on the left hero sky (0 - 660) */
  count: number;
  /** Fall tempo multiplier: < 1 slows down, > 1 speeds up (0.25x - 3.0x) */
  speed: number;
  /** Gravitational pull: controls both downward acceleration curve and drop velocity (0.3g - 2.5g) */
  gravity: number;
  /** Opacity of the repeating GPU background coin depth rain layers (0 - 1) */
  depthLayerOpacity: number;
}

export const ZWEPE_COIN_DEFAULTS: ZwepeCoinRainConfig = {
  count: 660,
  speed: 1.5,
  gravity: 1.65,
  depthLayerOpacity: 0.85,
};

export const ZWEPE_COIN_LIMITS = {
  count: { min: 0, max: 660, step: 1 },
  speed: { min: 0.25, max: 3.0, step: 0.05 },
  gravity: { min: 0.3, max: 2.5, step: 0.05 },
  depthLayerOpacity: { min: 0, max: 1.0, step: 0.05 },
} as const;

export const ZWEPE_COIN_PRESETS: Array<{
  id: string;
  label: string;
  config: ZwepeCoinRainConfig;
}> = [
  {
    id: "subtle",
    label: "Subtle",
    config: { count: 88, speed: 0.85, gravity: 0.8, depthLayerOpacity: 0.35 },
  },
  {
    id: "balanced",
    label: "Balanced",
    config: { count: 308, speed: 1.0, gravity: 1.0, depthLayerOpacity: 0.55 },
  },
  {
    id: "dense",
    label: "Dense",
    config: { count: 484, speed: 1.2, gravity: 1.25, depthLayerOpacity: 0.7 },
  },
  {
    id: "storm",
    label: "Gold Storm",
    config: { ...ZWEPE_COIN_DEFAULTS },
  },
];

export const ZWEPE_CONFIG_STORAGE_KEY = "sot-zwepe-rain-config-v2";

export function clampNumber(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function sanitizeZwepeConfig(
  partial?: Partial<ZwepeCoinRainConfig> | null,
): ZwepeCoinRainConfig {
  if (!partial) return { ...ZWEPE_COIN_DEFAULTS };
  return {
    count: Math.round(
      clampNumber(
        Number(partial.count),
        ZWEPE_COIN_LIMITS.count.min,
        ZWEPE_COIN_LIMITS.count.max,
        ZWEPE_COIN_DEFAULTS.count,
      ),
    ),
    speed: Number(
      clampNumber(
        Number(partial.speed),
        ZWEPE_COIN_LIMITS.speed.min,
        ZWEPE_COIN_LIMITS.speed.max,
        ZWEPE_COIN_DEFAULTS.speed,
      ).toFixed(2),
    ),
    gravity: Number(
      clampNumber(
        Number(partial.gravity),
        ZWEPE_COIN_LIMITS.gravity.min,
        ZWEPE_COIN_LIMITS.gravity.max,
        ZWEPE_COIN_DEFAULTS.gravity,
      ).toFixed(2),
    ),
    depthLayerOpacity: Number(
      clampNumber(
        Number(partial.depthLayerOpacity),
        ZWEPE_COIN_LIMITS.depthLayerOpacity.min,
        ZWEPE_COIN_LIMITS.depthLayerOpacity.max,
        ZWEPE_COIN_DEFAULTS.depthLayerOpacity,
      ).toFixed(2),
    ),
  };
}

export function loadSavedZwepeConfig(): ZwepeCoinRainConfig {
  if (typeof window === "undefined") return { ...ZWEPE_COIN_DEFAULTS };
  try {
    const raw = window.localStorage.getItem(ZWEPE_CONFIG_STORAGE_KEY);
    if (!raw) return { ...ZWEPE_COIN_DEFAULTS };
    return sanitizeZwepeConfig(JSON.parse(raw) as Partial<ZwepeCoinRainConfig>);
  } catch {
    return { ...ZWEPE_COIN_DEFAULTS };
  }
}

export function saveZwepeConfig(config: ZwepeCoinRainConfig): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ZWEPE_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore storage quota issues
  }
}

/**
 * Physical gravity timing function:
 * - Low gravity (< 0.95g): soft air-buoyant deceleration feel
 * - 1.0g baseline: steady terminal velocity fall
 * - High gravity (> 1.05g): accelerating free-fall curve (slower release at top, steep drop speed)
 */
export function resolveGravityTimingFunction(gravity: number): string {
  const g = clampNumber(
    gravity,
    ZWEPE_COIN_LIMITS.gravity.min,
    ZWEPE_COIN_LIMITS.gravity.max,
    1.0,
  );
  if (g < 0.95) {
    // Light air-floating curve
    const t = (0.95 - g) / 0.65; // 0..1 as g drops toward 0.3
    const y1 = (0.28 + t * 0.24).toFixed(2);
    const y2 = (0.85 + t * 0.1).toFixed(2);
    return `cubic-bezier(0.28, ${y1}, 0.58, ${y2})`;
  }
  if (g <= 1.05) {
    return "linear";
  }
  // Free-fall gravitational acceleration curve: steepens downward velocity progressively
  const t = (g - 1.05) / 1.45; // 0..1 as g rises toward 2.5
  const x1 = (0.36 + t * 0.26).toFixed(2);
  const y1 = Math.max(0.02, 0.16 - t * 0.13).toFixed(2);
  const x2 = (0.86 + t * 0.08).toFixed(2);
  const y2 = Math.max(0.35, 0.72 - t * 0.32).toFixed(2);
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

/**
 * Free-fall time scales inversely with speed and sqrt(gravity): t ∝ 1 / (speed * sqrt(g)).
 */
export function resolveEffectiveDurationSec(
  baseDurationSec: number,
  speed: number,
  gravity: number,
): number {
  const s = clampNumber(speed, ZWEPE_COIN_LIMITS.speed.min, ZWEPE_COIN_LIMITS.speed.max, 1.0);
  const g = clampNumber(
    gravity,
    ZWEPE_COIN_LIMITS.gravity.min,
    ZWEPE_COIN_LIMITS.gravity.max,
    1.0,
  );
  return Number(Math.max(1.2, baseDurationSec / (s * Math.sqrt(g))).toFixed(2));
}
