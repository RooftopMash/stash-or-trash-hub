import i18n from "./i18n";

const ENDPOINT = "/api/translate-ui";
const MAX_BATCH_SIZE = 80;
const MAX_BATCH_CHARACTERS = 18_000;
const CACHE_VERSION = "v1";
const inFlightLanguages = new Set<string>();

function flattenStrings(value: unknown, prefix = "", output: Array<{ key: string; source: string }> = []) {
  if (!value || typeof value !== "object") return output;
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof child === "string" && child.trim()) output.push({ key: path, source: child });
    else if (child && typeof child === "object" && !Array.isArray(child)) flattenStrings(child, path, output);
  }
  return output;
}

function assignPath(target: Record<string, any>, path: string, value: string) {
  const parts = path.split(".");
  let current = target;
  for (const part of parts.slice(0, -1)) current = current[part] ??= {};
  current[parts[parts.length - 1]] = value;
}

function cacheKey(language: string) {
  return `sot-google-i18n-${CACHE_VERSION}-${language}`;
}

function readCache(language: string): Record<string, string> {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(cacheKey(language)) ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeCache(language: string, values: Record<string, string>) {
  try {
    window.localStorage.setItem(cacheKey(language), JSON.stringify(values));
  } catch {
    // Quota/privacy settings may disable localStorage; translations still work this session.
  }
}

function protectPlaceholders(text: string) {
  const placeholders: string[] = [];
  const masked = text.replace(/\{\{\s*[^{}]+\s*\}\}/g, (match) => {
    const token = `SOTPH${placeholders.length}TOKEN`;
    placeholders.push(match);
    return token;
  });
  return {
    masked,
    restore(translated: string) {
      return translated.replace(/SOTPH(\d+)TOKEN/gi, (token, index: string) =>
        placeholders[Number(index)] ?? token,
      );
    },
  };
}

async function requestTranslations(texts: string[], language: string) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts, targetLang: language }),
  });
  if (!response.ok) throw new Error(`Google translation failed (${response.status})`);
  const result = (await response.json()) as { translations?: unknown };
  if (!Array.isArray(result.translations) || result.translations.length !== texts.length) {
    throw new Error("Google returned an incomplete translation batch");
  }
  return result.translations.map((value) => (typeof value === "string" ? value : ""));
}

async function translateMissingResources(language: string) {
  if (typeof window === "undefined" || !language || language === "en" || inFlightLanguages.has(language)) return;
  inFlightLanguages.add(language);

  try {
    const english = i18n.getResourceBundle("en", "translation");
    const localized = i18n.getResourceBundle(language, "translation") ?? {};
    const cache = readCache(language);
    const candidates = flattenStrings(english).filter(({ key, source }) => {
      const existing = i18n.getResource(language, "translation", key);
      // Preserve authored translations; Google fills only English fallback entries.
      return existing === source && !cache[key];
    });

    const generated: Record<string, string> = {};
    let batch: Array<{ key: string; source: string; restore: (value: string) => string }> = [];
    let batchLength = 0;

    const flush = async () => {
      if (!batch.length) return;
      try {
        const translated = await requestTranslations(batch.map((entry) => entry.source), language);
        translated.forEach((value, index) => {
          const entry = batch[index];
          const result = entry?.restore(value);
          if (entry && result?.trim() && result !== entry.source) {
            generated[entry.key] = result;
            cache[entry.key] = result;
          }
        });
      } catch (error) {
        console.warn("Google UI translation batch failed; retaining existing locale text.", error);
      }
      batch = [];
      batchLength = 0;
    };

    for (const item of candidates) {
      const protectedText = protectPlaceholders(item.source);
      if (batch.length && (batch.length >= MAX_BATCH_SIZE || batchLength + protectedText.masked.length > MAX_BATCH_CHARACTERS)) {
        await flush();
      }
      batch.push({ ...item, source: protectedText.masked, restore: protectedText.restore });
      batchLength += protectedText.masked.length;
    }
    await flush();

    const merged = { ...localized } as Record<string, any>;
    for (const [key, value] of Object.entries({ ...cache, ...generated })) {
      // Cached results are applied only where the current catalog still uses its English fallback.
      if (i18n.getResource(language, "translation", key) === i18n.getResource("en", "translation", key)) {
        assignPath(merged, key, value);
      }
    }

    if (Object.keys(cache).length) writeCache(language, cache);
    if (Object.keys(generated).length || Object.keys(cache).length) {
      i18n.addResourceBundle(language, "translation", merged, true, true);
      // Trigger react-i18next subscribers to render the newly added bundle immediately.
      await i18n.changeLanguage(language);
    }
  } finally {
    inFlightLanguages.delete(language);
  }
}

function onLanguageChanged(language: string) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
    document.documentElement.dir = ["ar", "he", "fa", "ur"].includes(language.split("-")[0]) ? "rtl" : "ltr";
  }
  void translateMissingResources(language);
}

if (typeof window !== "undefined") {
  i18n.on("languageChanged", onLanguageChanged);
  const initialLanguage = i18n.resolvedLanguage || i18n.language || "en";
  onLanguageChanged(initialLanguage);
}
