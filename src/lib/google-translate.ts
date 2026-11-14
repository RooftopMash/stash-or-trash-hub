/**
 * Google Website Translation Engine Integration
 *
 * Implements Layer 2 of the Hybrid Translation Architecture:
 * - Automatically hooks into the top language switcher.
 * - Sets Google Translate engine cookies (`googtrans=/en/${lang}`).
 * - Injects Google's website translation element into the DOM if not present.
 * - Preserves `translate="no"` / `.notranslate` brand names, logos, and wordmarks
 *   across all 52 supported languages without distorting SOrT or brand identities.
 */

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
    __sotGoogleTranslateTrigger?: (code: string) => void;
  }
}

const SUPPORTED_GOOGLE_LANGS: Record<string, string> = {
  en: "en",
  es: "es",
  fr: "fr",
  de: "de",
  pt: "pt",
  it: "it",
  nl: "nl",
  pl: "pl",
  ro: "ro",
  sv: "sv",
  no: "no",
  da: "da",
  fi: "fi",
  cs: "cs",
  hu: "hu",
  el: "el",
  uk: "uk",
  ru: "ru",
  tr: "tr",
  ar: "ar",
  he: "iw",
  iw: "iw",
  fa: "fa",
  ur: "ur",
  hi: "hi",
  bn: "bn",
  ta: "ta",
  te: "te",
  mr: "mr",
  gu: "gu",
  pa: "pa",
  th: "th",
  vi: "vi",
  id: "id",
  ms: "ms",
  fil: "tl",
  tl: "tl",
  zh: "zh-CN",
  "zh-cn": "zh-CN",
  "zh-tw": "zh-TW",
  ja: "ja",
  ko: "ko",
  sw: "sw",
  am: "am",
  zu: "zu",
  xh: "xh",
  st: "st",
  tn: "tn",
  af: "af",
  ha: "ha",
  yo: "yo",
  ig: "ig",
  nso: "nso",
  sk: "sk",
  bg: "bg",
};

const INCLUDED_GOOGLE_LANGUAGES = Array.from(new Set(Object.values(SUPPORTED_GOOGLE_LANGS))).join(",");

export function resolveGoogleTargetLang(langCode: string): string {
  const cleaned = (langCode || "en").trim();
  const exactLower = cleaned.toLowerCase();
  if (SUPPORTED_GOOGLE_LANGS[exactLower]) {
    return SUPPORTED_GOOGLE_LANGS[exactLower];
  }
  const baseLower = exactLower.split("-")[0];
  return SUPPORTED_GOOGLE_LANGS[baseLower] || baseLower || "en";
}

/**
 * Ensures every brand mark, logo, and `[translate="no"]` element has both
 * `translate="no"` and `.notranslate` before Google Translate walks the DOM.
 */
function reinforceNotranslateElements(): void {
  if (typeof document === "undefined") return;
  try {
    const protectedNodes = document.querySelectorAll<HTMLElement>(
      '[translate="no"], .notranslate, [data-sot-brand]',
    );
    protectedNodes.forEach((node) => {
      if (node.getAttribute("translate") !== "no") {
        node.setAttribute("translate", "no");
      }
      if (!node.classList.contains("notranslate")) {
        node.classList.add("notranslate");
      }
    });
  } catch {
    // non-blocking
  }
}

/**
 * Ensures Google Translate engine cookie is set across the domain and path.
 */
function setGoogleTranslateCookie(targetLang: string) {
  if (typeof document === "undefined") return;

  if (targetLang === "en" || !targetLang) {
    const past = "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans${past}`;
    if (typeof window !== "undefined") {
      document.cookie = `googtrans${past} domain=${window.location.hostname};`;
      document.cookie = `googtrans${past} domain=.${window.location.hostname};`;
      const hostParts = window.location.hostname.split(".");
      if (hostParts.length > 1) {
        const apex = hostParts.slice(-2).join(".");
        document.cookie = `googtrans${past} domain=.${apex};`;
      }
    }
    return;
  }

  const value = `/en/${targetLang}`;
  document.cookie = `googtrans=${value}; path=/;`;
  if (typeof window !== "undefined") {
    document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname};`;
    const hostParts = window.location.hostname.split(".");
    if (hostParts.length > 1) {
      const apex = hostParts.slice(-2).join(".");
      document.cookie = `googtrans=${value}; path=/; domain=.${apex};`;
    }
  }
}

/**
 * Restores the original English DOM if Google Translate had previously translated it.
 */
function restoreOriginalEnglishDom(): void {
  if (typeof document === "undefined") return;

  try {
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo && combo.value !== "") {
      combo.value = "en";
      combo.dispatchEvent(new Event("change"));
      combo.value = "";
    }

    const bannerFrames = document.querySelectorAll<HTMLIFrameElement>(
      "iframe.goog-te-banner-frame, iframe.VIpgJd-ZVi9od-ORHb-OEVmcd",
    );
    bannerFrames.forEach((frame) => {
      try {
        const innerDoc = frame.contentDocument || frame.contentWindow?.document;
        const restoreBtn = innerDoc?.querySelector<HTMLElement>(
          'button[id$=".restore"], a[id$=".restore"]',
        );
        restoreBtn?.click();
      } catch {
        // ignore cross-origin restrictions
      }
    });

    document.documentElement.classList.remove("translated-ltr", "translated-rtl");
  } catch {
    // non-blocking
  }
}

/**
 * Injects Google Translate script if not yet loaded.
 */
export function ensureGoogleTranslateLoaded(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  reinforceNotranslateElements();

  let mount = document.getElementById("google_translate_element");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "google_translate_element";
    mount.className = "notranslate";
    mount.setAttribute("translate", "no");
    mount.style.display = "none";
    mount.setAttribute("aria-hidden", "true");
    document.body.appendChild(mount);
  }

  window.googleTranslateElementInit = () => {
    try {
      reinforceNotranslateElements();
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: INCLUDED_GOOGLE_LANGUAGES,
            layout: window.google.translate.TranslateElement.InlineLayout?.HORIZONTAL || 0,
            autoDisplay: false,
            multilanguagePage: true,
          },
          "google_translate_element",
        );
      }
    } catch {
      // ignore
    }
  };

  const SCRIPT_ID = "sot-google-translate-script";
  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      // Silently continue with native appTranslations if external CDN is blocked
    };
    document.head.appendChild(script);
  }
}

/**
 * Programmatically triggers Google Translate DOM translation for any language.
 */
export function applyGoogleDomTranslation(langCode: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const targetLang = resolveGoogleTargetLang(langCode);
  setGoogleTranslateCookie(targetLang);

  if (targetLang === "en") {
    restoreOriginalEnglishDom();
    return;
  }

  reinforceNotranslateElements();
  ensureGoogleTranslateLoaded();

  const fireCombo = () => {
    reinforceNotranslateElements();
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo) {
      if (combo.value !== targetLang) {
        combo.value = targetLang;
        combo.dispatchEvent(new Event("change"));
      }
      return true;
    }
    return false;
  };

  if (!fireCombo()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (fireCombo() || attempts > 20) {
        clearInterval(interval);
      }
    }, 250);
  }
}
