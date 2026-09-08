/**
 * Best-effort, privacy-friendly guess of the visitor's country (ISO-3166 alpha-2).
 * Uses the browser locale region first, then a timezone→country hint. No network
 * calls, no permissions prompts.
 */
const TZ_COUNTRY: Record<string, string> = {
  "Africa/Johannesburg": "ZA",
  "Africa/Lagos": "NG",
  "Africa/Nairobi": "KE",
  "Africa/Cairo": "EG",
  "Africa/Accra": "GH",
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL",
  "Europe/Lisbon": "PT",
  "Europe/Warsaw": "PL",
  "Europe/Moscow": "RU",
  "Europe/Istanbul": "TR",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
  "America/Mexico_City": "MX",
  "America/Sao_Paulo": "BR",
  "America/Argentina/Buenos_Aires": "AR",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "Asia/Shanghai": "CN",
  "Asia/Kolkata": "IN",
  "Asia/Jakarta": "ID",
  "Asia/Dubai": "AE",
  "Australia/Sydney": "AU",
};

export function detectCountry(): string | null {
  if (typeof navigator === "undefined") return null;

  for (const tag of navigator.languages ?? [navigator.language]) {
    const region = tag?.split("-")[1];
    if (region && /^[A-Za-z]{2}$/.test(region)) return region.toUpperCase();
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TZ_COUNTRY[tz]) return TZ_COUNTRY[tz];
  } catch {
    /* ignore */
  }
  return null;
}

const NAMES: Record<string, string> = {
  ZA: "South Africa",
  NG: "Nigeria",
  KE: "Kenya",
  EG: "Egypt",
  GH: "Ghana",
  GB: "United Kingdom",
  FR: "France",
  DE: "Germany",
  ES: "Spain",
  IT: "Italy",
  NL: "Netherlands",
  PT: "Portugal",
  PL: "Poland",
  RU: "Russia",
  TR: "Türkiye",
  US: "United States",
  CA: "Canada",
  MX: "Mexico",
  BR: "Brazil",
  AR: "Argentina",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  IN: "India",
  ID: "Indonesia",
  AE: "United Arab Emirates",
  AU: "Australia",
};

const COUNTRY_ALIASES: Record<string, string> = {
  "south africa": "ZA", "za": "ZA", "nigeria": "NG", "ng": "NG", "kenya": "KE", "ke": "KE",
  "united states": "US", "us": "US", "united kingdom": "GB", "uk": "GB", "great britain": "GB",
  "canada": "CA", "ca": "CA", "australia": "AU", "au": "AU", "india": "IN", "in": "IN",
};

export function normalizeCountryCode(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const raw = value.trim().toLowerCase().replace(/[._-]+/g, " ").replace(/\s+/g, " ");
  if (/^[a-z]{2}$/.test(raw)) return raw.toUpperCase();
  if (COUNTRY_ALIASES[raw]) return COUNTRY_ALIASES[raw];
  const byName = Object.entries(NAMES).find(([, name]) => name.toLowerCase() === raw)?.[0];
  return byName ?? null;
}

export function countryOptions(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.map(normalizeCountryCode).filter((value): value is string => Boolean(value))))
    .sort((a, b) => countryName(a).localeCompare(countryName(b)));
}

export function countryName(code: string | null, locale?: string): string {
  if (!code) return "";
  try {
    const dn = new Intl.DisplayNames([locale ?? "en"], { type: "region" });
    return dn.of(code) ?? NAMES[code] ?? code;
  } catch {
    return NAMES[code] ?? code;
  }
}
