export const BRAND_CATEGORIES = [
  "All categories",
  "Agriculture & Food Production",
  "Automotive & Mobility",
  "Banking & Financial Services",
  "Beauty & Personal Care",
  "Business & Professional Services",
  "Construction & Engineering",
  "Consumer Goods",
  "Education & Training",
  "Energy & Utilities",
  "Entertainment, Arts & Culture",
  "Fashion & Apparel",
  "Food Service & Restaurants",
  "Government & Public Services",
  "Healthcare & Pharmaceuticals",
  "Home, Furniture & Living",
  "Insurance & Risk",
  "Legal & Advisory",
  "Logistics & Transportation",
  "Manufacturing & Industrial",
  "Media & Publishing",
  "Mining & Natural Resources",
  "Nonprofit & Social Impact",
  "Real Estate & Property",
  "Retail & E-commerce",
  "Sports & Recreation",
  "Technology & Software",
  "Telecommunications",
  "Travel, Tourism & Hospitality",
  "Luxury & Premium",
  "Personal, Creator & Influencer",
  "Place, City & Nation",
  "Platform & Marketplace",
  "Private Label & Store Brand",
  "Religious & Faith-Based",
  "Political & Civic",
  "Other",
] as const;

export type BrandCategory = (typeof BRAND_CATEGORIES)[number];

const aliases: Record<string, BrandCategory> = {
  agriculture: "Agriculture & Food Production",
  farming: "Agriculture & Food Production",
  food: "Agriculture & Food Production",
  automotive: "Automotive & Mobility",
  cars: "Automotive & Mobility",
  mobility: "Automotive & Mobility",
  banking: "Banking & Financial Services",
  bank: "Banking & Financial Services",
  finance: "Banking & Financial Services",
  financial: "Banking & Financial Services",
  beauty: "Beauty & Personal Care",
  cosmetics: "Beauty & Personal Care",
  consulting: "Business & Professional Services",
  professional: "Business & Professional Services",
  construction: "Construction & Engineering",
  engineering: "Construction & Engineering",
  consumer: "Consumer Goods",
  education: "Education & Training",
  university: "Education & Training",
  energy: "Energy & Utilities",
  utilities: "Energy & Utilities",
  entertainment: "Entertainment, Arts & Culture",
  arts: "Entertainment, Arts & Culture",
  culture: "Entertainment, Arts & Culture",
  fashion: "Fashion & Apparel",
  clothing: "Fashion & Apparel",
  apparel: "Fashion & Apparel",
  restaurant: "Food Service & Restaurants",
  restaurants: "Food Service & Restaurants",
  "fast food": "Food Service & Restaurants",
  government: "Government & Public Services",
  public: "Government & Public Services",
  health: "Healthcare & Pharmaceuticals",
  healthcare: "Healthcare & Pharmaceuticals",
  pharmaceutical: "Healthcare & Pharmaceuticals",
  pharma: "Healthcare & Pharmaceuticals",
  home: "Home, Furniture & Living",
  furniture: "Home, Furniture & Living",
  insurance: "Insurance & Risk",
  legal: "Legal & Advisory",
  logistics: "Logistics & Transportation",
  transport: "Logistics & Transportation",
  manufacturing: "Manufacturing & Industrial",
  industrial: "Manufacturing & Industrial",
  media: "Media & Publishing",
  publishing: "Media & Publishing",
  mining: "Mining & Natural Resources",
  nonprofit: "Nonprofit & Social Impact",
  ngo: "Nonprofit & Social Impact",
  property: "Real Estate & Property",
  realestate: "Real Estate & Property",
  real: "Real Estate & Property",
  retail: "Retail & E-commerce",
  ecommerce: "Retail & E-commerce",
  shopping: "Retail & E-commerce",
  supermarket: "Retail & E-commerce",
  grocery: "Retail & E-commerce",
  sport: "Sports & Recreation",
  sports: "Sports & Recreation",
  technology: "Technology & Software",
  tech: "Technology & Software",
  software: "Technology & Software",
  telecom: "Telecommunications",
  telecommunications: "Telecommunications",
  travel: "Travel, Tourism & Hospitality",
  tourism: "Travel, Tourism & Hospitality",
  hotel: "Travel, Tourism & Hospitality",
  hospitality: "Travel, Tourism & Hospitality",
  luxury: "Luxury & Premium",
  creator: "Personal, Creator & Influencer",
  influencer: "Personal, Creator & Influencer",
  city: "Place, City & Nation",
  nation: "Place, City & Nation",
  platform: "Platform & Marketplace",
  marketplace: "Platform & Marketplace",
  "private label": "Private Label & Store Brand",
  "store brand": "Private Label & Store Brand",
  religious: "Religious & Faith-Based",
  faith: "Religious & Faith-Based",
  political: "Political & Civic",
  civic: "Political & Civic",
};

export function normalizeCategory(value: string | null | undefined): BrandCategory {
  if (!value?.trim()) return "Other";
  const raw = value.trim().toLowerCase();
  if (BRAND_CATEGORIES.includes(value as BrandCategory)) return value as BrandCategory;
  const exact = aliases[raw];
  if (exact) return exact;
  const match = Object.entries(aliases).find(([alias]) => raw.includes(alias));
  return match?.[1] ?? "Other";
}

const brandNameOverrides: Record<string, BrandCategory> = {
  nike: "Fashion & Apparel",
  adidas: "Fashion & Apparel",
  zara: "Fashion & Apparel",
  woolworths: "Retail & E-commerce",
  shoprite: "Retail & E-commerce",
  "pick n pay": "Retail & E-commerce",
  netflix: "Entertainment, Arts & Culture",
  showmax: "Entertainment, Arts & Culture",
  mtn: "Telecommunications",
  telkom: "Telecommunications",
  vodacom: "Telecommunications",
  uber: "Logistics & Transportation",
  kfc: "Food Service & Restaurants",
  "mcdonald's": "Food Service & Restaurants",
  toyota: "Automotive & Mobility",
  ford: "Automotive & Mobility",
  shell: "Energy & Utilities",
  angloamerican: "Mining & Natural Resources",
  "anglo american": "Mining & Natural Resources",
  standardbank: "Banking & Financial Services",
  "standard bank": "Banking & Financial Services",
  capitec: "Banking & Financial Services",
  discovery: "Insurance & Risk",
  microsoft: "Technology & Software",
  google: "Technology & Software",
  amazon: "Platform & Marketplace",
};

export function categoryLabel(value: string | null | undefined): BrandCategory {
  return normalizeCategory(value);
}

export function brandCategory(
  name: string | null | undefined,
  value: string | null | undefined,
): BrandCategory {
  const override = name && brandNameOverrides[name.trim().toLowerCase()];
  return override ?? normalizeCategory(value);
}

export function matchesCategory(value: string | null | undefined, selected: string): boolean {
  return selected === "All categories" || normalizeCategory(value) === selected;
}

export function categoryOptions(_values: Array<string | null | undefined> = []): BrandCategory[] {
  return [...BRAND_CATEGORIES];
}

export function categoryClass(category: string | null | undefined): string {
  const styles: Partial<Record<BrandCategory, string>> = {
    "Food & Fast Food": "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    "Fashion & Beauty": "bg-pink-500/10 text-pink-700 dark:text-pink-300",
    "Technology & Telecom": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    "Finance & Banking": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    "Retail & Groceries": "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    "Travel & Hospitality": "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    "Entertainment & Media": "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  };
  return styles[normalizeCategory(category)] ?? "bg-secondary text-secondary-foreground";
}

export function searchableCategoryText(value: string | null | undefined): string {
  return `${value ?? ""} ${normalizeCategory(value)}`.toLowerCase();
}
