/**
 * International Multi-Region & Multi-Currency ROI Engine
 * Powers Crack #5 globally across North America, Europe, Africa, Middle East,
 * Asia-Pacific, and Latin America with regional consumer protection benchmarks.
 */

export type GlobalRegionCode =
  | "GLOBAL"
  | "US"
  | "GB"
  | "EU"
  | "CH"
  | "ZA"
  | "NG"
  | "KE"
  | "AE"
  | "JP"
  | "AU"
  | "IN"
  | "BR";

export interface GlobalRegionConfig {
  code: GlobalRegionCode;
  label: string;
  currencyCode: string;
  currencySymbol: string;
  fxPerUsd: number;
  regulatorName: string;
  regulationShort: string;
  avgPenaltyPerEscalationUsd: number;
  avgCartSaveUsd: number;
  majorHubs: string[];
}

export const GLOBAL_REGIONS: Record<GlobalRegionCode, GlobalRegionConfig> = {
  GLOBAL: {
    code: "GLOBAL",
    label: "Global Consolidated (USD)",
    currencyCode: "USD",
    currencySymbol: "$",
    fxPerUsd: 1,
    regulatorName: "Cross-Border Consumer & IP Protection",
    regulationShort: "OECD / ISO-10002",
    avgPenaltyPerEscalationUsd: 2950,
    avgCartSaveUsd: 1180,
    majorHubs: ["New York", "London", "Zurich", "Johannesburg", "Tokyo"],
  },
  US: {
    code: "US",
    label: "United States (USD)",
    currencyCode: "USD",
    currencySymbol: "$",
    fxPerUsd: 1,
    regulatorName: "FTC / CPSC / State AG",
    regulationShort: "FTC Act §5",
    avgPenaltyPerEscalationUsd: 4200,
    avgCartSaveUsd: 1450,
    majorHubs: ["New York", "Los Angeles", "Chicago", "Austin", "Miami"],
  },
  GB: {
    code: "GB",
    label: "United Kingdom (GBP)",
    currencyCode: "GBP",
    currencySymbol: "£",
    fxPerUsd: 0.79,
    regulatorName: "CMA / Trading Standards",
    regulationShort: "DMCC Act 2024",
    avgPenaltyPerEscalationUsd: 3800,
    avgCartSaveUsd: 1320,
    majorHubs: ["London", "Manchester", "Birmingham", "Edinburgh"],
  },
  EU: {
    code: "EU",
    label: "European Union (EUR)",
    currencyCode: "EUR",
    currencySymbol: "€",
    fxPerUsd: 0.92,
    regulatorName: "EC CPC Network / National Consumer Authorities",
    regulationShort: "EU GPSR / Omnibus",
    avgPenaltyPerEscalationUsd: 4100,
    avgCartSaveUsd: 1380,
    majorHubs: ["Paris", "Berlin", "Milan", "Amsterdam", "Madrid"],
  },
  CH: {
    code: "CH",
    label: "Switzerland (CHF)",
    currencyCode: "CHF",
    currencySymbol: "CHF ",
    fxPerUsd: 0.88,
    regulatorName: "SECO / Swiss Federal Customs IP",
    regulationShort: "UWG / LCD",
    avgPenaltyPerEscalationUsd: 4600,
    avgCartSaveUsd: 2400,
    majorHubs: ["Geneva", "Zurich", "Basel", "Lucerne"],
  },
  ZA: {
    code: "ZA",
    label: "South Africa (ZAR)",
    currencyCode: "ZAR",
    currencySymbol: "R",
    fxPerUsd: 18.2,
    regulatorName: "CGSO / National Consumer Commission",
    regulationShort: "CPA §61",
    avgPenaltyPerEscalationUsd: 2740,
    avgCartSaveUsd: 1090,
    majorHubs: ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
  },
  NG: {
    code: "NG",
    label: "Nigeria (NGN)",
    currencyCode: "NGN",
    currencySymbol: "₦",
    fxPerUsd: 1580,
    regulatorName: "FCCPC / NAFDAC / SON",
    regulationShort: "FCCPA 2018",
    avgPenaltyPerEscalationUsd: 2100,
    avgCartSaveUsd: 890,
    majorHubs: ["Lagos", "Abuja", "Port Harcourt", "Kano"],
  },
  KE: {
    code: "KE",
    label: "Kenya (KES)",
    currencyCode: "KES",
    currencySymbol: "KSh ",
    fxPerUsd: 129,
    regulatorName: "CAK / Anti-Counterfeit Authority (ACA)",
    regulationShort: "ACA / Consumer Protection Act",
    avgPenaltyPerEscalationUsd: 2200,
    avgCartSaveUsd: 920,
    majorHubs: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
  },
  AE: {
    code: "AE",
    label: "United Arab Emirates (AED)",
    currencyCode: "AED",
    currencySymbol: "AED ",
    fxPerUsd: 3.67,
    regulatorName: "Ministry of Economy / DED Consumer Protection",
    regulationShort: "UAE Law No. 15",
    avgPenaltyPerEscalationUsd: 3600,
    avgCartSaveUsd: 1950,
    majorHubs: ["Dubai", "Abu Dhabi", "Sharjah"],
  },
  JP: {
    code: "JP",
    label: "Japan (JPY)",
    currencyCode: "JPY",
    currencySymbol: "¥",
    fxPerUsd: 153,
    regulatorName: "Consumer Affairs Agency (CAA) / METI",
    regulationShort: "Consumer Contract Act",
    avgPenaltyPerEscalationUsd: 3900,
    avgCartSaveUsd: 1650,
    majorHubs: ["Tokyo", "Osaka", "Nagoya", "Yokohama"],
  },
  AU: {
    code: "AU",
    label: "Australia (AUD)",
    currencyCode: "AUD",
    currencySymbol: "A$",
    fxPerUsd: 1.53,
    regulatorName: "ACCC / Fair Trading",
    regulationShort: "Australian Consumer Law",
    avgPenaltyPerEscalationUsd: 3750,
    avgCartSaveUsd: 1410,
    majorHubs: ["Sydney", "Melbourne", "Brisbane", "Perth"],
  },
  IN: {
    code: "IN",
    label: "India (INR)",
    currencyCode: "INR",
    currencySymbol: "₹",
    fxPerUsd: 84.4,
    regulatorName: "Central Consumer Protection Authority (CCPA)",
    regulationShort: "CPA 2019",
    avgPenaltyPerEscalationUsd: 1850,
    avgCartSaveUsd: 760,
    majorHubs: ["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad"],
  },
  BR: {
    code: "BR",
    label: "Brazil (BRL)",
    currencyCode: "BRL",
    currencySymbol: "R$",
    fxPerUsd: 5.75,
    regulatorName: "SENACON / PROCON",
    regulationShort: "CDC Law 8.078",
    avgPenaltyPerEscalationUsd: 2450,
    avgCartSaveUsd: 980,
    majorHubs: ["São Paulo", "Rio de Janeiro", "Brasília", "Curitiba"],
  },
};

export function getRegionConfig(code?: string | null): GlobalRegionConfig {
  const normalized = String(code || "GLOBAL").trim().toUpperCase() as GlobalRegionCode;
  return GLOBAL_REGIONS[normalized] || GLOBAL_REGIONS.GLOBAL;
}

export function detectDefaultRegionFromBrowser(): GlobalRegionCode {
  if (typeof window === "undefined") return "GLOBAL";
  try {
    const saved = window.localStorage.getItem("sot_active_region_code");
    if (saved && saved in GLOBAL_REGIONS) return saved as GlobalRegionCode;
    const lang = (navigator.language || "").toUpperCase();
    const parts = lang.split("-");
    const cc = parts[1];
    if (cc && cc in GLOBAL_REGIONS) return cc as GlobalRegionCode;
    if (parts[0] === "JA") return "JP";
    if (parts[0] === "PT" && cc === "BR") return "BR";
    if (["FR", "DE", "IT", "ES", "NL"].includes(parts[0])) return "EU";
  } catch {
    // ignore storage errors
  }
  return "GLOBAL";
}

export function setActiveRegionPreference(code: GlobalRegionCode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("sot_active_region_code", code);
  } catch {
    // ignore
  }
}

export function formatRegionalCurrency(amountUsd: number, regionCode: GlobalRegionCode = "GLOBAL", compact = true): string {
  const cfg = getRegionConfig(regionCode);
  const converted = Math.max(0, Math.round(amountUsd * cfg.fxPerUsd));

  if (compact) {
    if (converted >= 1_000_000_000) {
      return `${cfg.currencySymbol}${(converted / 1_000_000_000).toFixed(1)}B`;
    }
    if (converted >= 1_000_000) {
      return `${cfg.currencySymbol}${(converted / 1_000_000).toFixed(1)}M`;
    }
    if (converted >= 10_000) {
      return `${cfg.currencySymbol}${Math.round(converted / 1000)}k`;
    }
  }
  return `${cfg.currencySymbol}${converted.toLocaleString()}`;
}

export interface RegionalBrandRoiInput {
  regionCode: GlobalRegionCode;
  deflectedComplaintsCount: number;
  suspectedCounterfeitScansCount: number;
  turnaroundCount: number;
  directRetainedUsd?: number;
}

export interface RegionalBrandRoiMetrics {
  region: GlobalRegionConfig;
  revenueSavedUsd: number;
  revenueSavedFormatted: string;
  regulatoryPenaltiesAvoidedUsd: number;
  regulatoryPenaltiesAvoidedFormatted: string;
  deflectedComplaintsCount: number;
  suspectedCounterfeitScansCount: number;
  counterfeitHeadline: string;
  deflectionHeadline: string;
}

export function calculateRegionalBrandRoi(
  brandName: string,
  input: RegionalBrandRoiInput,
): RegionalBrandRoiMetrics {
  const region = getRegionConfig(input.regionCode);
  const directUsd = Math.max(0, Number(input.directRetainedUsd || 0));
  const intercepts = Math.max(0, Number(input.suspectedCounterfeitScansCount || 0));
  const deflected = Math.max(0, Number(input.deflectedComplaintsCount || 0));
  const turnarounds = Math.max(0, Number(input.turnaroundCount || 0));

  const revenueSavedUsd =
    directUsd +
    intercepts * region.avgCartSaveUsd +
    turnarounds * Math.round(region.avgCartSaveUsd * 0.65);

  const regulatoryPenaltiesAvoidedUsd = deflected * region.avgPenaltyPerEscalationUsd;

  const revenueSavedFormatted = formatRegionalCurrency(revenueSavedUsd, region.code, true);
  const regulatoryPenaltiesAvoidedFormatted = formatRegionalCurrency(
    regulatoryPenaltiesAvoidedUsd,
    region.code,
    true,
  );

  const hubPreview = region.majorHubs[0] || "Authorized Hubs";

  return {
    region,
    revenueSavedUsd,
    revenueSavedFormatted,
    regulatoryPenaltiesAvoidedUsd,
    regulatoryPenaltiesAvoidedFormatted,
    deflectedComplaintsCount: deflected,
    suspectedCounterfeitScansCount: intercepts,
    counterfeitHeadline:
      intercepts > 0
        ? `${intercepts} suspicious ${brandName} batch/grey-market scan${intercepts === 1 ? "" : "s"} intercepted across ${hubPreview} & regional hubs — est. ${revenueSavedFormatted} protected by routing buyers to authorized dealers.`
        : `Zero unverified ${brandName} batch leaks detected in ${region.label}; real-time OEM & authorized dealer shield active across ${region.majorHubs.slice(0, 3).join(", ")}.`,
    deflectionHeadline:
      deflected > 0
        ? `${deflected} potential ${region.regulatorName} (${region.regulationShort}) escalation${deflected === 1 ? "" : "s"} deflected via private resolution inside 48h — avoiding ~${regulatoryPenaltiesAvoidedFormatted} in statutory penalties.`
        : `Zero open ${region.regulatorName} (${region.regulationShort}) SLA breaches — private resolution queue actively protecting ${brandName} compliance.`,
  };
}
