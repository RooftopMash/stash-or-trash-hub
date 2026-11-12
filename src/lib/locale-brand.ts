import { APP_SUPPORTED_LOCALES, appTranslations } from "@/lib/locale-app";

/**
 * Canonical SOT brand identity. These are proper names, not translatable UI copy.
 * Keep one source of truth and install it in every app locale bundle so locale
 * changes (including languages without a complete app bundle) cannot localize it.
 */
export const BRAND_TRANSLATIONS = {
  acronym: "SOrT",
  stash: "Stash",
  conjunction: "Or",
  trash: "Trash",
  name: "Stash Or Trash",
  logoLabel: "SOrT — Stash Or Trash logo",
} as const;

const bundles = appTranslations as Record<string, Record<string, unknown>>;
const localeCodes = new Set([
  ...Object.keys(bundles),
  ...APP_SUPPORTED_LOCALES.map(({ code }) => code),
]);

for (const code of localeCodes) {
  bundles[code] ??= {};
  bundles[code].brand = BRAND_TRANSLATIONS;
}
