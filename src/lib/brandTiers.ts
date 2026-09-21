/**
 * Brand Tier Classification for Fair SOT Awards & Leaderboards
 * 
 * Ensures fair competition across scale, business models, and market reach.
 * "KFC can't compete with Nike" — fast-food retail operates on different
 * footfall, margins, customer loyalty mechanics, and brand archetypes than
 * global sportswear, luxury ateliers, tech ecosystems, or local challengers.
 */

export const BRAND_TIERS = [
  "All tiers",
  "Global Titans",
  "Industry Giants",
  "National Champions",
  "Emerging & Challengers",
  "Heritage & Local Icons",
] as const;

export type BrandTier = (typeof BRAND_TIERS)[number];

export type TierInfo = {
  name: BrandTier;
  shortName: string;
  description: string;
  example: string;
  badgeClass: string;
};

export const TIER_METADATA: Record<Exclude<BrandTier, "All tiers">, TierInfo> = {
  "Global Titans": {
    name: "Global Titans",
    shortName: "Titans",
    description: "Multi-continent mega-enterprises with billions in global revenue and ubiquitous cultural reach (e.g. Nike, Apple, Google, Coca-Cola).",
    example: "Nike, Apple, Coca-Cola, Toyota",
    badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
  },
  "Industry Giants": {
    name: "Industry Giants",
    shortName: "Giants",
    description: "Multinational market-cap leaders dominating distinct consumer verticals, quick-service, telecoms, and mass logistics (e.g. KFC, McDonald's, MTN, Shell).",
    example: "KFC, McDonald's, MTN, Vodacom, Shell",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
  "National Champions": {
    name: "National Champions",
    shortName: "Champions",
    description: "Market-leading institutions, banks, grocers, and utility powerhouses that anchor domestic and regional economies (e.g. Woolworths, Shoprite, Capitec).",
    example: "Woolworths, Shoprite, Capitec, Discovery",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
  "Heritage & Local Icons": {
    name: "Heritage & Local Icons",
    shortName: "Heritage",
    description: "Longstanding household names, beloved culinary staples, pantry essentials, and generational cultural trademarks (e.g. KOO, Mrs Ball's, Black Cat).",
    example: "KOO, Mrs Ball's, Black Cat, Jungle Oats, Savanna",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  },
  "Emerging & Challengers": {
    name: "Emerging & Challengers",
    shortName: "Challengers",
    description: "Fast-growing insurgent brands, direct-to-consumer innovators, designer labels, and indie makers disrupting established categories.",
    example: "Bathu, Drip Footwear, MaXhosa, TSHEPO Denim",
    badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
  },
};

// Explicit mappings for known global & local brands to guarantee high-accuracy tier placement
const explicitTierMap: Record<string, Exclude<BrandTier, "All tiers">> = {
  // Global Titans
  nike: "Global Titans",
  adidas: "Global Titans",
  apple: "Global Titans",
  google: "Global Titans",
  microsoft: "Global Titans",
  amazon: "Global Titans",
  "coca-cola": "Global Titans",
  cocacola: "Global Titans",
  toyota: "Global Titans",
  samsung: "Global Titans",
  sony: "Global Titans",
  lvmh: "Global Titans",
  zara: "Global Titans",
  ikea: "Global Titans",
  "l'oréal": "Global Titans",
  loreal: "Global Titans",

  // Industry Giants (Quick-Service Food Chains, Telco conglomerates, Energy majors)
  kfc: "Industry Giants",
  "mcdonald's": "Industry Giants",
  mcdonalds: "Industry Giants",
  burgerking: "Industry Giants",
  "burger king": "Industry Giants",
  subway: "Industry Giants",
  dominos: "Industry Giants",
  "domino's": "Industry Giants",
  starbucks: "Industry Giants",
  mtn: "Industry Giants",
  vodacom: "Industry Giants",
  telkom: "Industry Giants",
  safaricom: "Industry Giants",
  shell: "Industry Giants",
  bp: "Industry Giants",
  totalenergies: "Industry Giants",
  dangote: "Industry Giants",
  emirates: "Industry Giants",
  "qatar airways": "Industry Giants",
  uber: "Industry Giants",
  netflix: "Industry Giants",
  spotify: "Industry Giants",
  angloamerican: "Industry Giants",
  "anglo american": "Industry Giants",
  sasol: "Industry Giants",

  // National Champions
  woolworths: "National Champions",
  shoprite: "National Champions",
  "pick n pay": "National Champions",
  checkers: "National Champions",
  spar: "National Champions",
  capitec: "National Champions",
  "standard bank": "National Champions",
  standardbank: "National Champions",
  fnb: "National Champions",
  nedbank: "National Champions",
  discovery: "National Champions",
  sanlam: "National Champions",
  oldmutual: "National Champions",
  "old mutual": "National Champions",
  takealot: "National Champions",
  jumia: "National Champions",
  "ethiopian airlines": "National Champions",
  mercadona: "National Champions",
  carrefour: "National Champions",
  "cape union mart": "National Champions",

  // Heritage & Local Icons (Generational staples)
  koo: "Heritage & Local Icons",
  "black cat": "Heritage & Local Icons",
  "jungle oats": "Heritage & Local Icons",
  "all gold": "Heritage & Local Icons",
  "mrs ball's": "Heritage & Local Icons",
  "mrs balls": "Heritage & Local Icons",
  tastic: "Heritage & Local Icons",
  beacon: "Heritage & Local Icons",
  oros: "Heritage & Local Icons",
  ceres: "Heritage & Local Icons",
  amarula: "Heritage & Local Icons",
  "castle lager": "Heritage & Local Icons",
  "savanna cider": "Heritage & Local Icons",
  savanna: "Heritage & Local Icons",
  chappies: "Heritage & Local Icons",
  niknaks: "Heritage & Local Icons",
  clover: "Heritage & Local Icons",
  eskort: "Heritage & Local Icons",
  "fatti's & moni's": "Heritage & Local Icons",
  doom: "Heritage & Local Icons",
  kwv: "Heritage & Local Icons",
  "bos iced tea": "Heritage & Local Icons",

  // Emerging & Challengers
  bathu: "Emerging & Challengers",
  "drip footwear": "Emerging & Challengers",
  veldskoen: "Emerging & Challengers",
  galxboy: "Emerging & Challengers",
  "tshepo denim": "Emerging & Challengers",
  "s.p.c.c": "Emerging & Challengers",
  "freedom of movement": "Emerging & Challengers",
  "loxion kulca": "Emerging & Challengers",
  "maxhosa africa": "Emerging & Challengers",
  maxhosa: "Emerging & Challengers",
  "rich mnisi": "Emerging & Challengers",
  "thebe magugu": "Emerging & Challengers",
  pichulik: "Emerging & Challengers",
  "kirsten goss": "Emerging & Challengers",
  "devil's peak beer": "Emerging & Challengers",
  africology: "Emerging & Challengers",
  "portia m": "Emerging & Challengers",
  "native child": "Emerging & Challengers",
  afrobotanics: "Emerging & Challengers",
  ardmore: "Emerging & Challengers",
  "inverroche gin": "Emerging & Challengers",
  "musgrave gin": "Emerging & Challengers",
};

/**
 * Derives the fair competition tier for a brand based on its name, category, and scale.
 */
export function getBrandTier(
  brandName: string | null | undefined,
  category?: string | null | undefined
): Exclude<BrandTier, "All tiers"> {
  if (!brandName?.trim()) return "Emerging & Challengers";
  const normalized = brandName.trim().toLowerCase();

  // 1. Direct dictionary match
  if (explicitTierMap[normalized]) {
    return explicitTierMap[normalized];
  }

  // 2. Substring match for compound brand names
  for (const [key, tier] of Object.entries(explicitTierMap)) {
    if (normalized.includes(key) && key.length >= 4) {
      return tier;
    }
  }

  // 3. Category heuristics
  const cat = (category || "").toLowerCase();
  if (cat.includes("food service") || cat.includes("restaurant") || cat.includes("fast food")) {
    return "Industry Giants";
  }
  if (cat.includes("telecom") || cat.includes("logistics") || cat.includes("energy")) {
    return "Industry Giants";
  }
  if (cat.includes("banking") || cat.includes("insurance") || cat.includes("retail")) {
    return "National Champions";
  }
  if (cat.includes("luxury") || cat.includes("creator") || cat.includes("influencer")) {
    return "Emerging & Challengers";
  }

  return "Emerging & Challengers";
}

/**
 * Filter matcher for tiers
 */
export function matchesTier(
  brandTier: Exclude<BrandTier, "All tiers">,
  selectedTier: BrandTier
): boolean {
  if (selectedTier === "All tiers") return true;
  return brandTier === selectedTier;
}

/**
 * Returns the tier metadata object
 */
export function getTierInfo(tier: Exclude<BrandTier, "All tiers">): TierInfo {
  return TIER_METADATA[tier] ?? TIER_METADATA["Emerging & Challengers"];
}
