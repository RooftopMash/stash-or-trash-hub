import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation as useI18nextTranslation } from "react-i18next";
import { appTranslations } from "@/lib/locale-app";
import { BRAND_TRANSLATIONS } from "@/lib/locale-brand";

export type AppTranslationBundle = typeof appTranslations.en & { brand: typeof BRAND_TRANSLATIONS };
export type AppLocale = keyof typeof appTranslations | string;

/**
 * Custom `useTranslation` hook that reads the current selected locale from app state
 * and returns the corresponding translated object from the `appTranslations` records
 * for easy component text binding.
 *
 * Supports both direct object destructuring:
 *   const { hero, feed, scanner, locale, switchLocale } = useTranslation();
 *   <h1>{hero.headlineBlack}</h1>
 *
 * As well as standard i18next function binding:
 *   const { t } = useTranslation();
 *   <p>{t("hero.subtitle")}</p>
 */
export function useTranslation() {
  const { i18n, t: i18nextT } = useI18nextTranslation();

  // Read current locale from i18n or localStorage
  const getActiveLocaleCode = useCallback(() => {
    if (i18n?.language) {
      return i18n.language.split("-")[0].toLowerCase();
    }
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("sot-lang");
      if (stored) return stored.split("-")[0].toLowerCase();
    }
    if (typeof document !== "undefined" && document.documentElement.lang) {
      return document.documentElement.lang.split("-")[0].toLowerCase();
    }
    return "en";
  }, [i18n]);

  const [currentLocale, setCurrentLocale] = useState<string>(() => getActiveLocaleCode());

  // Subscribe to language changes in app state
  useEffect(() => {
    const handleLangChange = (lng: string) => {
      const normalized = (lng || "en").split("-")[0].toLowerCase();
      setCurrentLocale(normalized);
    };

    if (i18n && typeof i18n.on === "function") {
      i18n.on("languageChanged", handleLangChange);
      return () => {
        i18n.off("languageChanged", handleLangChange);
      };
    }
  }, [i18n]);

  // Keep in sync with i18n.language if it changes without event
  useEffect(() => {
    const active = getActiveLocaleCode();
    if (active !== currentLocale) {
      setCurrentLocale(active);
    }
  }, [i18n?.language, getActiveLocaleCode, currentLocale]);

  // Merge the locale translations with English fallback so no key is ever missing.
  // Brand identity is a canonical proper name and always comes from the invariant
  // appTranslations dictionary entry, never from a locale-specific translation.
  const translations = useMemo<AppTranslationBundle>(() => {
    const targetBundle = appTranslations[currentLocale] || appTranslations.en;
    const fallbackBundle = appTranslations.en;

    const mergedHero = {
      ...(fallbackBundle.hero || {}),
      ...(targetBundle.hero || {}),
    };

    const mergedFeed = {
      ...(fallbackBundle.feed || {}),
      ...(targetBundle.feed || {}),
    };

    const mergedScanner = {
      ...(fallbackBundle.scanner || {}),
      ...(targetBundle.scanner || {}),
    };

    const mergedLiveStage = {
      ...(fallbackBundle.liveStage || {}),
      ...(targetBundle.liveStage || {}),
    };

    return {
      hero: mergedHero,
      feed: mergedFeed,
      scanner: mergedScanner,
      liveStage: mergedLiveStage,
      brand: BRAND_TRANSLATIONS,
    } as AppTranslationBundle;
  }, [currentLocale]);

  // Convenience shortcuts for component text binding
  const hero = translations.hero;
  const feed = translations.feed;
  const scanner = translations.scanner;
  const liveStage = useMemo(() => (translations as any).liveStage || {}, [translations]);
  const brand = translations.brand;

  // Flexible translator function that checks appTranslations first, then falls back to i18next
  const t = useMemo(() => {
    const fn = (key: string, optionsOrDefault?: any) => {
      const parts = key.split(".");
      if (parts.length === 2) {
        const [section, subkey] = parts;
        const secObj = (translations as any)[section];
        if (secObj && secObj[subkey] !== undefined) {
          return secObj[subkey];
        }
      }
      return i18nextT(key, optionsOrDefault);
    };

    // Attach nested objects directly to `t` for easy `t.hero.headlineBlack` access
    fn.hero = hero;
    fn.feed = feed;
    fn.scanner = scanner;
    fn.liveStage = liveStage;
    fn.brand = brand;

    return fn;
  }, [translations, hero, feed, scanner, liveStage, brand, i18nextT]);

  // Quick switch locale helper
  const switchLocale = useCallback(
    async (code: string) => {
      if (i18n?.changeLanguage) {
        await i18n.changeLanguage(code);
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem("sot-lang", code);
      }
      if (typeof document !== "undefined") {
        document.documentElement.lang = code;
        document.documentElement.dir = ["ar", "he", "fa", "ur"].includes(code) ? "rtl" : "ltr";
      }
      setCurrentLocale(code.split("-")[0].toLowerCase());
      try {
        const { applyGoogleDomTranslation } = await import("@/lib/google-translate");
        applyGoogleDomTranslation(code);
      } catch {
        // Non-blocking fallback
      }
    },
    [i18n],
  );

  return {
    locale: currentLocale,
    translations,
    hero,
    feed,
    scanner,
    liveStage,
    brand,
    t,
    i18n,
    switchLocale,
  };
}

export default useTranslation;
