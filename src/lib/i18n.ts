import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { en } from "./locale-en";
import { translations } from "./locales";
import { socialTranslations } from "./locale-social";

// Full list of selectable languages (native names). UI strings fall back to
// English until a full translation bundle exists for a given code.
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
  { code: "ar", label: "العربية" },
  { code: "he", label: "עברית" },
  { code: "fa", label: "فارسی" },
  { code: "ur", label: "اردو" },
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
const codes = new Set([...Object.keys(translations), ...Object.keys(socialTranslations)]);
for (const code of codes) {
  const bundle: Record<string, unknown> = { ...(translations[code] ?? {}) };
  const social = socialTranslations[code];
  if (social) bundle.social = { ...(bundle.social as object), ...social };
  const merged: Record<string, unknown> = { ...en };
  for (const [section, values] of Object.entries(bundle)) {
    merged[section] = { ...(en as Record<string, any>)[section], ...(values as object) };
  }
  resources[code] = { translation: merged as typeof en };
}

// Regional Chinese variants share the complete Simplified/Traditional UI bundles
// while remaining separately selectable for future region-specific translations.
resources["zh-CN"] = resources.zh ?? { translation: en };
resources["zh-TW"] = resources["zh-TW"] ?? resources.zh ?? { translation: en };
resources.nso = {
  translation: {
    ...en,
    nav: { ...en.nav, feed: "Dikagare", brands: "Mabrande", awards: "Difofane", signIn: "Tsena" },
    vote: { ...en.vote, stash: "Boloka", trash: "Lahla", signInPrompt: "Tsena go fana ka kahlolo ya gago." },
    auth: { ...en.auth, signIn: "Tsena", signUp: "Ingwadise", email: "Imeile", password: "Phasewete", continueGoogle: "Tsena ka Google" },
  } as typeof en,
};

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
