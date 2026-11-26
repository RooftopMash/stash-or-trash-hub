export const SOT_DEFAULT_PRIMARY_DOMAIN =
  (import.meta.env.VITE_PRIMARY_DOMAIN as string | undefined)?.trim() ||
  "stash-or-trash-hub.vercel.app";

export const OFFICIAL_SOT_DOMAINS = [
  "stash-or-trash-hub.vercel.app",
] as const;

/**
 * Exclusive platform-only colored alphabet verification mark for Stash Or Trash (SOrT).
 * Preserves exact mixed casing: uppercase S, uppercase O, lowercase r, uppercase T.
 * Strictly reserved for SOrT's own official domain identity — never applied to external corporate brands.
 */
export const SOT_EXCLUSIVE_DOMAIN_LETTERS = [
  {
    letter: "S",
    dotClass: "bg-[#ef4444]",
    darkTextClass: "text-[#f87171]",
  },
  {
    letter: "O",
    dotClass: "bg-[#f97316]",
    darkTextClass: "text-[#fb923c]",
  },
  {
    letter: "r",
    dotClass: "bg-[#eab308]",
    darkTextClass: "text-[#facc15]",
  },
  {
    letter: "T",
    dotClass: "bg-[#22c55e]",
    darkTextClass: "text-[#4ade80]",
  },
] as const;

/**
 * If a secured platform domain is a SOrT short domain (e.g. set via VITE_PRIMARY_DOMAIN),
 * preserves uppercase S, uppercase O, lowercase r, uppercase T alongside the TLD.
 * Otherwise returns the exact secured hostname as-is without inventing unowned domains.
 */
export function formatBrandedSotDomain(rawDomain: string): {
  prefix: string;
  suffix: string;
  displayDomain: string;
  isSotShortDomain: boolean;
} {
  const trimmed = rawDomain.trim();
  const match = trimmed.match(/^(www\.)?sort(\.[a-z0-9.-]+)$/i);
  if (match) {
    const prefix = match[1] ? "www." : "";
    const suffix = match[2].toLowerCase();
    return {
      prefix,
      suffix,
      displayDomain: `${prefix}SOrT${suffix}`,
      isSotShortDomain: true,
    };
  }

  return {
    prefix: "",
    suffix: "",
    displayDomain: trimmed || "stash-or-trash-hub.vercel.app",
    isSotShortDomain: false,
  };
}

export function getActiveSotDomainInfo(): {
  displayDomain: string;
  prefix: string;
  suffix: string;
  isSotShortDomain: boolean;
  isOfficialHost: boolean;
} {
  const envDomain = (import.meta.env.VITE_PRIMARY_DOMAIN as string | undefined)?.trim();
  const defaultDomain = envDomain || "stash-or-trash-hub.vercel.app";

  if (typeof window === "undefined") {
    const formatted = formatBrandedSotDomain(defaultDomain);
    return {
      ...formatted,
      isOfficialHost: true,
    };
  }

  const rawHost = window.location.hostname;
  const hostLower = rawHost.toLowerCase();
  if (!hostLower || hostLower === "localhost" || hostLower === "127.0.0.1") {
    const formatted = formatBrandedSotDomain(defaultDomain);
    return {
      ...formatted,
      isOfficialHost: true,
    };
  }

  const matchesOfficial =
    (OFFICIAL_SOT_DOMAINS as readonly string[]).includes(hostLower) ||
    Boolean(envDomain && hostLower === envDomain.toLowerCase());

  if (matchesOfficial) {
    const formatted = formatBrandedSotDomain(envDomain || rawHost);
    return {
      ...formatted,
      isOfficialHost: true,
    };
  }

  const formatted = formatBrandedSotDomain(defaultDomain);
  return {
    ...formatted,
    isOfficialHost: hostLower.endsWith(".run.app") || hostLower.endsWith(".vercel.app"),
  };
}
