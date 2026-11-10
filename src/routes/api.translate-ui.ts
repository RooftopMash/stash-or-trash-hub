import { createFileRoute } from "@tanstack/react-router";

const MAX_TEXTS = 80;
const MAX_CHARACTERS = 18_000;
const RATE_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 40;
const requestWindows = new Map<string, { startedAt: number; count: number }>();

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isAllowed(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return false;

  const key = getClientKey(request);
  const now = Date.now();
  const window = requestWindows.get(key);
  if (!window || now - window.startedAt >= RATE_WINDOW_MS) {
    requestWindows.set(key, { startedAt: now, count: 1 });
    return true;
  }
  if (window.count >= MAX_REQUESTS_PER_WINDOW) return false;
  window.count += 1;
  return true;
}

export const Route = createFileRoute("/api/translate-ui")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        if (!isAllowed(request)) {
          return Response.json({ error: "Translation request is not allowed or rate limit was reached." }, { status: 429 });
        }

        const apiKey = process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY;
        if (!apiKey) {
          return Response.json({ error: "Google Cloud Translation is not configured on the server." }, { status: 503 });
        }

        const body = await request.json().catch(() => null);
        const texts = body?.texts;
        const targetLang = body?.targetLang;
        if (
          !Array.isArray(texts) || texts.length === 0 || texts.length > MAX_TEXTS ||
          typeof targetLang !== "string" || !/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(targetLang) ||
          texts.some((text: unknown) => typeof text !== "string" || text.length > 5000)
        ) {
          return Response.json({ error: "Provide up to 80 text strings and a valid target language code." }, { status: 400 });
        }

        const totalCharacters = texts.reduce((total: number, text: string) => total + text.length, 0);
        if (totalCharacters > MAX_CHARACTERS) {
          return Response.json({ error: "Translation request is too large." }, { status: 413 });
        }

        try {
          const googleTarget = targetLang === "fil" ? "tl" : targetLang;
          const response = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ q: texts, target: googleTarget, format: "text" }),
            },
          );
          if (!response.ok) {
            console.error("Google Cloud Translation request failed:", response.status);
            return Response.json({ error: "Google translation is temporarily unavailable." }, { status: 502 });
          }

          const payload = await response.json();
          const translations = payload?.data?.translations;
          if (!Array.isArray(translations) || translations.length !== texts.length) {
            return Response.json({ error: "Google returned an incomplete translation." }, { status: 502 });
          }
          return Response.json({ translations: translations.map((item: { translatedText?: string }) => item.translatedText ?? "") });
        } catch (error) {
          console.error("Google Cloud Translation error:", error);
          return Response.json({ error: "Google translation is temporarily unavailable." }, { status: 502 });
        }
      },
    },
  },
});
