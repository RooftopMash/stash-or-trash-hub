/**
 * Brand Tier Classification Interface & Metadata
 *
 * Categorizes consumer brands into defined market tiers:
 * - Luxury: Haute couture, supercars, fine horlogerie, ateliers ($$$$)
 * - Premium: High-end consumer tech, aspirational apparel, gourmet retail ($$$)
 * - Mass Market: Commercial giants, everyday staples, supermarkets, telcos ($$)
 * - Budget: Value-first retailers, discount fast-casual, affordable essentials ($)
 *
 * Enhances the Brand Barometer UX by enabling level-playing-field sentiment,
 * fair award leaderboards, and meaningful comparative CX analytics.
 */

export type BrandTierLevel = "Luxury" | "Premium" | "Mass Market" | "Budget";

export const BRAND_TIERS = [
  "All tiers",
  "Luxury",
  "Premium",
  "Mass Market",
  "Budget",
] as const;

export type BrandTierFilter = (typeof BRAND_TIERS)[number];

/**
 * BrandTier Interface
 * Represents the structured metadata, display properties, and economic segment of a brand tier.
 */
export interface BrandTier {
  id: BrandTierLevel;
  name: BrandTierLevel;
  label: string;
  shortName: string;
  description: string;
  pricePoint: string; // e.g. "$$$$", "$$$", "$$", "$"
  marketSegment: string;
  badgeClass: string;
  borderClass: string;
  dotColor: string;
  priority: number; // 1 = Luxury, 2 = Premium, 3 = Mass Market, 4 = Budget (used for sorting)
  examples: string[];
}

/** Backward compatibility alias for existing consumers expecting TierInfo */
export type TierInfo = BrandTier;

export const TIER_METADATA: Record<BrandTierLevel, BrandTier> = {
  Luxury: {
    id: "Luxury",
    name: "Luxury",
    label: "Luxury & Haute Horlogerie",
    shortName: "Luxury",
    description:
      "Elite heritage maisons, bespoke couturiers, exotic automakers, and prestigious jewelers with exclusive distribution and top-of-market pricing.",
    pricePoint: "$$$$",
    marketSegment: "High-net-worth & aspirational luxury",
    badgeClass:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    borderClass: "border-purple-300 dark:border-purple-800",
    dotColor: "bg-purple-500",
    priority: 1,
    examples: [
      "Louis Vuitton",
      "Chanel",
      "Gucci",
      "Rolex",
      "Prada",
      "Dior",
      "Hermes",
      "Cartier",
      "Ferrari",
      "Porsche",
      "MaXhosa",
    ],
  },
  Premium: {
    id: "Premium",
    name: "Premium",
    label: "Premium & Aspirational",
    shortName: "Premium",
    description:
      "High-end consumer technology, aspirational sportswear, upscale automotive, and gourmet retail delivering elevated craftsmanship at an accessible premium.",
    pricePoint: "$$$",
    marketSegment: "Upper-middle & lifestyle consumers",
    badgeClass:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    borderClass: "border-blue-300 dark:border-blue-800",
    dotColor: "bg-blue-500",
    priority: 2,
    examples: [
      "Apple",
      "Nike",
      "Starbucks",
      "Tesla",
      "BMW",
      "Mercedes-Benz",
      "L'Oréal",
      "Woolworths",
      "Sony",
      "Nespresso",
      "Discovery",
    ],
  },
  "Mass Market": {
    id: "Mass Market",
    name: "Mass Market",
    label: "Mass Market & Commercial Giants",
    shortName: "Mass Market",
    description:
      "Everyday consumer staples, national supermarket chains, telecoms, mainstream fast-food leaders, and high-volume commercial powerhouses.",
    pricePoint: "$$",
    marketSegment: "General public & mainstream consumer base",
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    borderClass: "border-emerald-300 dark:border-emerald-800",
    dotColor: "bg-emerald-500",
    priority: 3,
    examples: [
      "Coca-Cola",
      "McDonald's",
      "KFC",
      "Toyota",
      "Zara",
      "Adidas",
      "MTN",
      "Vodacom",
      "Shoprite",
      "Capitec",
      "Shell",
      "KOO",
    ],
  },
  Budget: {
    id: "Budget",
    name: "Budget",
    label: "Budget & Value First",
    shortName: "Budget",
    description:
      "Discount retailers, fast-value essentials, bargain fashion, low-cost logistics, and entry-level consumer goods focused on maximum affordability.",
    pricePoint: "$",
    marketSegment: "Price-sensitive & value-focused consumer",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    borderClass: "border-amber-300 dark:border-amber-800",
    dotColor: "bg-amber-500",
    priority: 4,
    examples: [
      "Subway",
      "Burger King",
      "Shein",
      "Temu",
      "Pep",
      "Ackermans",
      "Mr Price",
      "Primark",
      "Dollar General",
      "Chappies",
    ],
  },
};

// Explicit lookup map for brand slugs/names to guarantee high-accuracy tier placement
const explicitTierMap: Record<string, BrandTierLevel> = {
  // Luxury ($$$$)
  "louis vuitton": "Luxury",
  louisvuitton: "Luxury",
  lvmh: "Luxury",
  chanel: "Luxury",
  gucci: "Luxury",
  rolex: "Luxury",
  prada: "Luxury",
  dior: "Luxury",
  hermes: "Luxury",
  cartier: "Luxury",
  ferrari: "Luxury",
  porsche: "Luxury",
  lamborghini: "Luxury",
  bentley: "Luxury",
  rollsroyce: "Luxury",
  "rolls-royce": "Luxury",
  balenciaga: "Luxury",
  burberry: "Luxury",
  versace: "Luxury",
  armani: "Luxury",
  "giorgio armani": "Luxury",
  maxhosa: "Luxury",
  "maxhosa africa": "Luxury",
  "thebe magugu": "Luxury",
  "rich mnisi": "Luxury",
  ardmore: "Luxury",
  "kirsten goss": "Luxury",
  pichulik: "Luxury",

  // Premium ($$$)
  nike: "Premium",
  apple: "Premium",
  starbucks: "Premium",
  tesla: "Premium",
  bmw: "Premium",
  mercedes: "Premium",
  "mercedes-benz": "Premium",
  audi: "Premium",
  volvo: "Premium",
  "l'oréal": "Premium",
  loreal: "Premium",
  woolworths: "Premium",
  nespresso: "Premium",
  bose: "Premium",
  sony: "Premium",
  discovery: "Premium",
  sanlam: "Premium",
  "old mutual": "Premium",
  oldmutual: "Premium",
  google: "Premium",
  microsoft: "Premium",
  amazon: "Premium",
  samsung: "Premium",
  "cape union mart": "Premium",
  bathu: "Premium",
  "drip footwear": "Premium",
  galxboy: "Premium",
  veldskoen: "Premium",
  "freedom of movement": "Premium",
  "tshepo denim": "Premium",
  "s.p.c.c": "Premium",
  "devil's peak beer": "Premium",
  "inverroche gin": "Premium",
  "musgrave gin": "Premium",
  "bos iced tea": "Premium",
  amarula: "Premium",
  kwv: "Premium",

  // Mass Market ($$)
  kfc: "Mass Market",
  "mcdonald's": "Mass Market",
  mcdonalds: "Mass Market",
  "coca-cola": "Mass Market",
  cocacola: "Mass Market",
  toyota: "Mass Market",
  zara: "Mass Market",
  "h&m": "Mass Market",
  hm: "Mass Market",
  adidas: "Mass Market",
  ikea: "Mass Market",
  mtn: "Mass Market",
  vodacom: "Mass Market",
  telkom: "Mass Market",
  safaricom: "Mass Market",
  shell: "Mass Market",
  bp: "Mass Market",
  totalenergies: "Mass Market",
  dangote: "Mass Market",
  emirates: "Mass Market",
  "qatar airways": "Mass Market",
  uber: "Mass Market",
  netflix: "Mass Market",
  spotify: "Mass Market",
  shoprite: "Mass Market",
  checkers: "Mass Market",
  "pick n pay": "Mass Market",
  spar: "Mass Market",
  capitec: "Mass Market",
  "standard bank": "Mass Market",
  standardbank: "Mass Market",
  fnb: "Mass Market",
  nedbank: "Mass Market",
  mercadona: "Mass Market",
  carrefour: "Mass Market",
  koo: "Mass Market",
  "black cat": "Mass Market",
  "jungle oats": "Mass Market",
  "all gold": "Mass Market",
  "mrs ball's": "Mass Market",
  "mrs balls": "Mass Market",
  tastic: "Mass Market",
  beacon: "Mass Market",
  oros: "Mass Market",
  ceres: "Mass Market",
  "castle lager": "Mass Market",
  "savanna cider": "Mass Market",
  savanna: "Mass Market",
  clover: "Mass Market",
  eskort: "Mass Market",
  "fatti's & moni's": "Mass Market",
  doom: "Mass Market",
  sasol: "Mass Market",
  "anglo american": "Mass Market",
  angloamerican: "Mass Market",

  // Budget ($)
  subway: "Budget",
  burgerking: "Budget",
  "burger king": "Budget",
  dominos: "Budget",
  "domino's": "Budget",
  shein: "Budget",
  temu: "Budget",
  pep: "Budget",
  ackermans: "Budget",
  "mr price": "Budget",
  mrprice: "Budget",
  primark: "Budget",
  "dollar general": "Budget",
  dollargeneral: "Budget",
  chappies: "Budget",
  niknaks: "Budget",
  "portia m": "Budget",
  afrobotanics: "Budget",
  "native child": "Budget",
  africology: "Budget",
  takealot: "Budget",
  jumia: "Budget",
};

/**
 * Derives the fair BrandTierLevel for a brand based on its name and category.
 */
export function getBrandTier(
  brandName: string | null | undefined,
  category?: string | null | undefined,
): BrandTierLevel {
  if (!brandName?.trim()) return "Mass Market";
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
  if (
    cat.includes("luxury") ||
    cat.includes("haute") ||
    cat.includes("jewelry") ||
    cat.includes("jewellery") ||
    cat.includes("couture") ||
    cat.includes("supercar")
  ) {
    return "Luxury";
  }

  if (
    cat.includes("automotive") ||
    cat.includes("technology") ||
    cat.includes("electronics") ||
    cat.includes("airline") ||
    cat.includes("lifestyle") ||
    cat.includes("gourmet")
  ) {
    return "Premium";
  }

  if (
    cat.includes("discount") ||
    cat.includes("budget") ||
    cat.includes("value") ||
    cat.includes("bargain") ||
    cat.includes("wholesale")
  ) {
    return "Budget";
  }

  // Default to Mass Market for consumer brands
  return "Mass Market";
}

/**
 * Returns the full BrandTier interface object for a given tier level.
 */
export function getTierInfo(tier: BrandTierLevel | string): BrandTier {
  if (tier in TIER_METADATA) {
    return TIER_METADATA[tier as BrandTierLevel];
  }
  return TIER_METADATA["Mass Market"];
}

/**
 * Convenience method to get the full BrandTier details directly from brand name & category.
 */
export function getBrandTierDetails(
  brandName: string | null | undefined,
  category?: string | null | undefined,
): BrandTier {
  const tierLevel = getBrandTier(brandName, category);
  return getTierInfo(tierLevel);
}

/**
 * Filter matcher for brand tiers.
 */
export function matchesTier(
  brandTier: BrandTierLevel | string,
  selectedTier: BrandTierFilter | string,
): boolean {
  if (!selectedTier || selectedTier === "All tiers") return true;
  return brandTier === selectedTier;
}

/**
 * Compares two brand tiers by economic priority (1 = Luxury ... 4 = Budget).
 * Useful for sorting brand lists.
 */
export function compareBrandTiers(
  tierA: BrandTierLevel | string,
  tierB: BrandTierLevel | string,
  ascending = true,
): number {
  const priorityA = getTierInfo(tierA).priority;
  const priorityB = getTierInfo(tierB).priority;
  return ascending ? priorityA - priorityB : priorityB - priorityA;
}
