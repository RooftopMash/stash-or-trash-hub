import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { en } from "./locale-en";
import { translations } from "./locales";
import { socialTranslations } from "./locale-social";
import { extraTranslations } from "./locales-extra";
import { appTranslations } from "./locale-app";
import { COUNTRY_FLAGSHIP_APP_BUNDLES } from "./country-languages";

// Full list of 52 selectable launch languages (native names & RTL metadata)
export const LANGUAGES: { code: string; label: string; native?: string; direction?: "ltr" | "rtl" }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "it", label: "Italiano" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "ro", label: "Română" },
  { code: "sv", label: "Svenska" },
  { code: "no", label: "Norsk" },
  { code: "da", label: "Dansk" },
  { code: "fi", label: "Suomi" },
  { code: "cs", label: "Čeština" },
  { code: "hu", label: "Magyar" },
  { code: "el", label: "Ελληνικά" },
  { code: "uk", label: "Українська" },
  { code: "ru", label: "Русский" },
  { code: "tr", label: "Türkçe" },
  { code: "ar", label: "العربية", direction: "rtl" },
  { code: "he", label: "עברית", direction: "rtl" },
  { code: "fa", label: "فارسی", direction: "rtl" },
  { code: "ur", label: "اردو", direction: "rtl" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "th", label: "ไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "fil", label: "Filipino" },
  { code: "zh-CN", label: "简体中文（中国大陆）" },
  { code: "zh-TW", label: "繁體中文（台灣）" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "sw", label: "Kiswahili" },
  { code: "am", label: "አማርኛ" },
  { code: "zu", label: "isiZulu" },
  { code: "xh", label: "isiXhosa" },
  { code: "st", label: "Sesotho" },
  { code: "tn", label: "Setswana" },
  { code: "af", label: "Afrikaans" },
  { code: "ha", label: "Hausa" },
  { code: "yo", label: "Yorùbá" },
  { code: "ig", label: "Igbo" },
  { code: "nso", label: "Sepedi" },
  { code: "sk", label: "Slovenčina" },
  { code: "bg", label: "Български" },
];

export const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];

export const LANGUAGE_COUNT = LANGUAGES.length;

const resources: Record<string, { translation: typeof en }> = { en: { translation: en } };
const allCodes = new Set([
  ...LANGUAGES.map((l) => l.code),
  ...Object.keys(translations),
  ...Object.keys(socialTranslations),
  ...Object.keys(extraTranslations),
  ...Object.keys(appTranslations),
  ...Object.keys(COUNTRY_FLAGSHIP_APP_BUNDLES),
]);

for (const code of allCodes) {
  const primaryBundle: Record<string, any> = { ...(translations[code] ?? {}) };
  const extraBundle = extraTranslations[code];
  const social = socialTranslations[code];
  const appBundle = appTranslations[code];
  const flagshipBundle = COUNTRY_FLAGSHIP_APP_BUNDLES[code];

  if (social) primaryBundle.social = { ...(primaryBundle.social as object), ...social };
  if (extraBundle) {
    for (const [sec, val] of Object.entries(extraBundle)) {
      primaryBundle[sec] = { ...(primaryBundle[sec] as object), ...(val as object) };
    }
  }
  if (appBundle) {
    for (const [sec, val] of Object.entries(appBundle)) {
      primaryBundle[sec] = { ...(primaryBundle[sec] as object), ...(val as object) };
    }
  }
  if (flagshipBundle) {
    for (const [sec, val] of Object.entries(flagshipBundle)) {
      primaryBundle[sec] = { ...(primaryBundle[sec] as object), ...(val as object) };
    }
  }

  const merged: Record<string, any> = { ...en };
  for (const [section, values] of Object.entries(primaryBundle)) {
    merged[section] = { ...(en as Record<string, any>)[section], ...(values as object) };
  }

  // Ensure every non-English locale has complete native Hero, Feed & Nav strings
  // derived from its native vocabulary if not already overridden
  if (code !== "en") {
    const stashWord = merged.vote?.stash || "Stash";
    const trashWord = merged.vote?.trash || "Trash";
    const brandsWord = merged.brand?.title || merged.nav?.brands || "Brands";
    const trustWord = merged.brand?.trustScore || "Trust score";
    const awardsTitle = merged.awards?.title || "SOT Awards";
    const dashboardTitle = merged.dashboard?.title || merged.nav?.dashboard || "Dashboard";
    const feedWord = merged.nav?.feed || "Feed";
    const homeSubtitle = merged.home?.subtitle || en.home.subtitle;
    const homeHook = merged.home?.hook || en.home.hook;

    merged.nav = {
      ...merged.nav,
      home: merged.nav?.home && merged.nav.home !== "Home" ? merged.nav.home : feedWord,
      scan: merged.nav?.scan || "Scan",
    };

    const existingHero = (primaryBundle.hero ?? {}) as Record<string, string>;
    merged.hero = {
      ...(en as any).hero,
      ...(appTranslations.en.hero ?? {}),
      badge: existingHero.badge || `${brandsWord} · ${trustWord}`,
      headlineBlack: existingHero.headlineBlack || `${stashWord} · ${brandsWord}`,
      headlineGold: existingHero.headlineGold || `${trashWord} · ${trustWord}`,
      subtitle: existingHero.subtitle || homeSubtitle,
      tagline: existingHero.tagline || homeHook,
      tapCoin: existingHero.tapCoin || `🪙 ${stashWord}`,
      tapBin: existingHero.tapBin || `🗑️ ${trashWord}`,
      trustScore: existingHero.trustScore || trustWord,
      liveSentiment: existingHero.liveSentiment || `${brandsWord} — ${trustWord}`,
      liveSentimentDesc: existingHero.liveSentimentDesc || homeSubtitle,
      searchOrBrowse: existingHero.searchOrBrowse || (merged.brand?.searchPlaceholder ?? "Search..."),
      gettingStashed: existingHero.gettingStashed || `🪙 ${stashWord}`,
      gettingTrashed: existingHero.gettingTrashed || `🗑️ ${trashWord}`,
      sotAwards: existingHero.sotAwards || awardsTitle,
      crowningBrand: existingHero.crowningBrand || (merged.awards?.tagline ?? ""),
      seeStandings: existingHero.seeStandings || (merged.awards?.leaderboard ?? ""),
      goToDashboard: existingHero.goToDashboard || dashboardTitle,
      exploreFeed: existingHero.exploreFeed || feedWord,
      stashes: existingHero.stashes || stashWord,
      trashes: existingHero.trashes || trashWord,
      ...existingHero,
    };

    const existingFeed = (primaryBundle.feed ?? {}) as Record<string, string>;
    merged.feed = {
      ...(appTranslations.es.feed ?? {}),
      pulse: existingFeed.pulse || brandsWord,
      title: "Stash Or Trash",
      subtitle: existingFeed.subtitle || homeSubtitle,
      hook: existingFeed.hook || homeHook,
      searchPlaceholder: existingFeed.searchPlaceholder || (merged.brand?.searchPlaceholder ?? "Search..."),
      allVerdicts: existingFeed.allVerdicts || `${stashWord} / ${trashWord}`,
      stashesOfDay: existingFeed.stashesOfDay || `🪙 ${stashWord}`,
      trashesOfDay: existingFeed.trashesOfDay || `🗑️ ${trashWord}`,
      ...existingFeed,
    };
  }

  resources[code] = { translation: merged as typeof en };
}

// Regional Chinese variants
resources["zh-CN"] = resources.zh ?? { translation: en };
resources["zh-TW"] = resources["zh-TW"] ?? resources.zh ?? { translation: en };

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: LANGUAGES.map((l) => l.code),
      nonExplicitSupportedLngs: true,
      interpolation: { escapeValue: false },
      initImmediate: false,
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "sot-lang",
      },
    });
}

export default i18n;
