/**
 * Google Website Translation Engine Integration
 *
 * Implements Layer 2 of the Hybrid Translation Architecture:
 * - Automatically hooks into the top language switcher.
 * - Sets Google Translate engine cookies (`googtrans=/en/${lang}`).
 * - Injects Google's website translation element into the DOM if not present.
 * - Triggers full DOM sweeps so 100% of visible texts, feed posts, reviews,
 *   cards, and descriptions translate seamlessly into any selected language.
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
  zu: "zu", // isiZulu
  xh: "xh", // isiXhosa
  af: "af", // Afrikaans
  st: "st", // Sesotho
  tn: "tn", // Setswana
  nso: "nso", // Sepedi
  sw: "sw", // Swahili
  es: "es", // Spanish
  fr: "fr", // French
  de: "de", // German
  pt: "pt", // Portuguese
  it: "it", // Italian
  nl: "nl", // Dutch
  ru: "ru", // Russian
  zh: "zh-CN",
  "zh-cn": "zh-CN",
  "zh-tw": "zh-TW",
  ja: "ja",
  ko: "ko",
  ar: "ar",
  hi: "hi",
  el: "el",
  tr: "tr",
  pl: "pl",
};

/**
 * Ensures Google Translate engine cookie is set across the domain and path.
 */
function setGoogleTranslateCookie(langCode: string) {
  if (typeof document === "undefined") return;

  if (langCode === "en" || !langCode) {
    // Clear cookie to return to native English
    const past = "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans${past}`;
    if (typeof window !== "undefined") {
      document.cookie = `googtrans${past} domain=${window.location.hostname};`;
      document.cookie = `googtrans${past} domain=.${window.location.hostname};`;
    }
    return;
  }

  const target = SUPPORTED_GOOGLE_LANGS[langCode.toLowerCase()] || langCode.toLowerCase();
  const value = `/en/${target}`;

  document.cookie = `googtrans=${value}; path=/;`;
  if (typeof window !== "undefined") {
    document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname};`;
    // also fallback for apex domain
    const hostParts = window.location.hostname.split(".");
    if (hostParts.length > 1) {
      const apex = hostParts.slice(-2).join(".");
      document.cookie = `googtrans=${value}; path=/; domain=.${apex};`;
    }
  }
}

/**
 * Injects Google Translate script if not yet loaded.
 */
export function ensureGoogleTranslateLoaded(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Ensure mount point exists
  let mount = document.getElementById("google_translate_element");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "google_translate_element";
    mount.style.display = "none";
    mount.setAttribute("aria-hidden", "true");
    document.body.appendChild(mount);
  }

  // Register the global init callback
  window.googleTranslateElementInit = () => {
    try {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages:
              "en,zu,xh,af,st,tn,nso,sw,es,fr,de,pt,it,nl,ru,zh-CN,zh-TW,ja,ko,ar,hi,el,tr,pl",
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

  // Check if script tag is already injected
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

  const normalized = (langCode || "en").split("-")[0].toLowerCase();
  setGoogleTranslateCookie(normalized);

  // If selecting English, restore original page DOM
  if (normalized === "en") {
    // If the combo exists, reset it to empty or 'en'
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (combo && combo.value !== "") {
      combo.value = "";
      combo.dispatchEvent(new Event("change"));
    }
    return;
  }

  // Ensure the script is initialized
  ensureGoogleTranslateLoaded();

  const targetLang = SUPPORTED_GOOGLE_LANGS[normalized] || normalized;

  // Attempt to select language on Google's combo element
  const fireCombo = () => {
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
    // Retry shortly in case script is still booting
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (fireCombo() || attempts > 15) {
        clearInterval(interval);
      }
    }, 250);
  }
}
