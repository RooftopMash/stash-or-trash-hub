export const BRAND_CATEGORIES = [
  "All categories",
  "Food & Fast Food",
  "Fashion & Beauty",
  "Technology & Telecom",
  "Finance & Banking",
  "Retail & Groceries",
  "Travel & Hospitality",
  "Entertainment & Media",
  "Health & Wellness",
  "Home & Lifestyle",
  "Other",
] as const;

export type BrandCategory = (typeof BRAND_CATEGORIES)[number];

const aliases: Record<string, BrandCategory> = {
  food: "Food & Fast Food",
  restaurant: "Food & Fast Food",
  restaurants: "Food & Fast Food",
  "fast food": "Food & Fast Food",
  "fast-food": "Food & Fast Food",
  fashion: "Fashion & Beauty",
  clothing: "Fashion & Beauty",
  apparel: "Fashion & Beauty",
  beauty: "Fashion & Beauty",
  technology: "Technology & Telecom",
  tech: "Technology & Telecom",
  telecom: "Technology & Telecom",
  electronics: "Technology & Telecom",
  software: "Technology & Telecom",
  banking: "Finance & Banking",
  bank: "Finance & Banking",
  finance: "Finance & Banking",
  financial: "Finance & Banking",
  retail: "Retail & Groceries",
  shopping: "Retail & Groceries",
  supermarket: "Retail & Groceries",
  grocery: "Retail & Groceries",
  travel: "Travel & Hospitality",
  airline: "Travel & Hospitality",
  hotel: "Travel & Hospitality",
  hospitality: "Travel & Hospitality",
  entertainment: "Entertainment & Media",
  media: "Entertainment & Media",
  health: "Health & Wellness",
  wellness: "Health & Wellness",
  home: "Home & Lifestyle",
  lifestyle: "Home & Lifestyle",
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
  nike: "Fashion & Beauty",
  adidas: "Fashion & Beauty",
  zara: "Fashion & Beauty",
  woolworths: "Retail & Groceries",
  shoprite: "Retail & Groceries",
  "pick n pay": "Retail & Groceries",
  netflix: "Entertainment & Media",
  showmax: "Entertainment & Media",
  mtn: "Technology & Telecom",
  telkom: "Technology & Telecom",
  uber: "Travel & Hospitality",
  kfc: "Food & Fast Food",
  "mcdonald's": "Food & Fast Food",
};

export function categoryLabel(value: string | null | undefined): BrandCategory {
  return normalizeCategory(value);
}

export function brandCategory(name: string | null | undefined, value: string | null | undefined): BrandCategory {
  const override = name && brandNameOverrides[name.trim().toLowerCase()];
  return override ?? normalizeCategory(value);
}

export function matchesCategory(value: string | null | undefined, selected: string): boolean {
  return selected === "All categories" || normalizeCategory(value) === selected;
}

export function categoryOptions(values: Array<string | null | undefined>): BrandCategory[] {
  const present = new Set(values.map(normalizeCategory));
  return ["All categories", ...BRAND_CATEGORIES.filter((category) => category !== "All categories" && present.has(category))];
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
