import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenAI, Type } from "@google/genai";

const PRIMARY_TEXT_MODEL = "gemini-4-hydrogen";
const FALLBACK_TEXT_MODEL = "gemini-3.1-flash-lite";

export type ReceiptVerificationData = {
  isReceiptOrInvoice: boolean;
  storeName?: string;
  purchaseDate?: string;
  totalAmount?: string;
  currency?: string;
  itemsDetected?: string[];
  authenticityScore: number; // 0 - 100
  status: "VERIFIED_PURCHASE" | "LIKELY_VALID" | "TAMPERED_OR_UNREADABLE" | "NO_RECEIPT_DETECTED";
  verificationHash: string;
  notes: string;
};

export type BrandBarometerSummary = {
  brandName: string;
  ratingGrade: "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC";
  ratingLabel: string;
  cxOutlook: "POSITIVE" | "STABLE" | "VOLATILE" | "CRITICAL_DEFICIT";
  topStashes: string[];
  topTrashes: string[];
  executiveBrief: string;
  consumerRecommendation: string;
  brandActionPriority: string;
};

export type ContentScreeningResult = {
  isApproved: boolean;
  safetyScore: number; // 0 - 100 (100 is completely safe)
  flags: Array<"DEFAMATION_RISK" | "PERSONAL_DOXXING" | "HATE_OR_HARASSMENT" | "BOT_SPAM_PATTERN" | "CLEAN">;
  reason?: string;
  constructiveTip?: string;
};

export type TranslationResult = {
  originalText: string;
  detectedSourceLang: string;
  translatedText: string;
  targetLang: string;
};

export type BrandReplyDraft = {
  empatheticOpening: string;
  acknowledgment: string;
  correctiveAction: string;
  escalationChannel: string;
  fullDraft: string;
};

const getGenAI = () => {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: { "User-Agent": "aistudio-build" },
    },
  });
};

async function generateWithFallback(
  ai: GoogleGenAI,
  contents: unknown,
  responseSchema: Record<string, unknown>,
) {
  let lastError: unknown = null;
  for (const model of [PRIMARY_TEXT_MODEL, FALLBACK_TEXT_MODEL]) {
    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model,
          contents: contents as any,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema as any,
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Gemini timeout (${model})`)), 12000),
        ),
      ]);
      const rawJson = response.text?.trim();
      if (rawJson) {
        return JSON.parse(rawJson);
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("Gemini service did not return a valid JSON response.");
}

export const Route = (createFileRoute("/api/ai-services") as any)({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json().catch(() => null);
          if (!body || !body.action) {
            return Response.json(
              {
                error:
                  "Action parameter is required ('authenticate-receipt', 'brand-barometer', 'screen-content', 'translate', 'brand-auto-reply').",
              },
              { status: 400 },
            );
          }

          const ai = getGenAI();
          const action = body.action;

          // -------------------------------------------------------------
          // 1. AI RECEIPT & PROOF AUTHENTICATOR
          // -------------------------------------------------------------
          if (action === "authenticate-receipt") {
            const { image, mimeType = "image/jpeg", targetBrand } = body;
            if (!image) {
              return Response.json({ error: "Receipt image is required." }, { status: 400 });
            }
            if (!ai) {
              return Response.json(
                {
                  error:
                    "Receipt verification requires GEMINI_API_KEY to be configured on the server.",
                  code: "GEMINI_UNAVAILABLE",
                },
                { status: 503 },
              );
            }

            let base64Clean = image;
            let detectedMime = mimeType;
            if (image.includes(",")) {
              const [meta, data] = image.split(",", 2);
              base64Clean = data;
              const mimeMatch = meta.match(/:(.*?);/);
              if (mimeMatch) detectedMime = mimeMatch[1];
            }

            const prompt = `
You are the Chief Forensic Auditor for SOT (Stash Or Trash — The Moody's of Brand CX).
Analyze this uploaded receipt, invoice, till slip, order confirmation, or warranty document.
Target Brand claimed by user: "${targetBrand || "Unknown"}"

Extract and inspect truthfully based only on what is visible in the document:
1. Whether this is a genuine receipt, invoice, or point-of-sale document.
2. Store / Merchant Name.
3. Purchase Date.
4. Total monetary amount and currency symbol/code.
5. Line items or product descriptions visible.
6. Authenticity score (0-100) based on font consistency, thermal printing artifacts, alignment, receipt headers, and layout.
7. Status: VERIFIED_PURCHASE | LIKELY_VALID | TAMPERED_OR_UNREADABLE | NO_RECEIPT_DETECTED.
8. Concise verification notes.
`;
            const receiptSchema = {
              type: Type.OBJECT,
              properties: {
                isReceiptOrInvoice: { type: Type.BOOLEAN },
                storeName: { type: Type.STRING },
                purchaseDate: { type: Type.STRING },
                totalAmount: { type: Type.STRING },
                currency: { type: Type.STRING },
                itemsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
                authenticityScore: { type: Type.NUMBER },
                status: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
              required: [
                "isReceiptOrInvoice",
                "authenticityScore",
                "status",
                "notes",
              ],
            };

            const parsed = await generateWithFallback(
              ai,
              {
                parts: [
                  { inlineData: { data: base64Clean, mimeType: detectedMime } },
                  { text: prompt },
                ],
              },
              receiptSchema,
            );
            const verificationHash = `SOT-TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

            return Response.json({
              success: true,
              data: {
                ...parsed,
                verificationHash,
              } as ReceiptVerificationData,
            });
          }

          // -------------------------------------------------------------
          // 2. AI BRAND BAROMETER & MOODY'S-STYLE INTELLIGENCE
          // -------------------------------------------------------------
          if (action === "brand-barometer") {
            const { brandName, stashPct = 50, totalVerdicts = 0, sampleVerdicts = [] } = body;
            if (!brandName) {
              return Response.json({ error: "brandName is required." }, { status: 400 });
            }
            if (!ai) {
              return Response.json(
                {
                  error:
                    "AI Brand Barometer briefing requires GEMINI_API_KEY to be configured on the server.",
                  code: "GEMINI_UNAVAILABLE",
                },
                { status: 503 },
              );
            }

            const prompt = `
You are the Chief Credit & CX Rating Analyst at SOT (Stash Or Trash).
Generate a Moody's / S&P grade rating report for "${brandName}" grounded strictly in the telemetry below:
- Community Stash Ratio: ${stashPct}%
- Total Consumer Verdicts Logged: ${totalVerdicts}
- Actual Consumer Review Titles: ${JSON.stringify(sampleVerdicts.slice(0, 15))}

Scale: AAA (>85%), AA (75-84%), A (65-74%), BBB (50-64%), BB (40-49%), B (30-39%), CCC (<30%).
If Actual Consumer Review Titles is empty, state transparently that qualitative themes await additional consumer submissions rather than inventing fake incidents.
`;
            const barometerSchema = {
              type: Type.OBJECT,
              properties: {
                brandName: { type: Type.STRING },
                ratingGrade: { type: Type.STRING },
                ratingLabel: { type: Type.STRING },
                cxOutlook: { type: Type.STRING },
                topStashes: { type: Type.ARRAY, items: { type: Type.STRING } },
                topTrashes: { type: Type.ARRAY, items: { type: Type.STRING } },
                executiveBrief: { type: Type.STRING },
                consumerRecommendation: { type: Type.STRING },
                brandActionPriority: { type: Type.STRING },
              },
              required: [
                "brandName",
                "ratingGrade",
                "ratingLabel",
                "cxOutlook",
                "topStashes",
                "topTrashes",
                "executiveBrief",
                "consumerRecommendation",
                "brandActionPriority",
              ],
            };

            const parsed = await generateWithFallback(ai, prompt, barometerSchema);
            return Response.json({ success: true, data: parsed as BrandBarometerSummary });
          }

          // -------------------------------------------------------------
          // 3. AUTOMATED FRAUD & DEFAMATION SCREENING
          // -------------------------------------------------------------
          if (action === "screen-content") {
            const { title = "", description = "" } = body;
            const fullText = `${title} ${description}`.trim();
            if (!fullText) {
              return Response.json({
                success: true,
                data: {
                  isApproved: true,
                  safetyScore: 100,
                  flags: ["CLEAN"],
                } as ContentScreeningResult,
              });
            }

            if (ai) {
              try {
                const prompt = `
You are the Pre-Publication Content Safety & Legal Defamation Guard for SOT (Stash Or Trash).
Evaluate this consumer review for DEFAMATION_RISK, PERSONAL_DOXXING, HATE_OR_HARASSMENT, BOT_SPAM_PATTERN, or CLEAN:
Text: """${fullText}"""
Set isApproved = true if safetyScore >= 60 and no hate/doxxing.
`;
                const screenSchema = {
                  type: Type.OBJECT,
                  properties: {
                    isApproved: { type: Type.BOOLEAN },
                    safetyScore: { type: Type.NUMBER },
                    flags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    reason: { type: Type.STRING },
                    constructiveTip: { type: Type.STRING },
                  },
                  required: ["isApproved", "safetyScore", "flags"],
                };

                const parsed = await generateWithFallback(ai, prompt, screenSchema);
                return Response.json({ success: true, data: parsed as ContentScreeningResult });
              } catch (err) {
                console.warn("AI moderation model failed; running deterministic PII pre-check:", err);
              }
            }

            // Deterministic PII / harassment pre-check (transparently labeled)
            const phoneRegex = /\b\d{3}[-.\s]??\d{3}[-.\s]??\d{4}\b/;
            const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;
            const isDoxx = phoneRegex.test(fullText) || emailRegex.test(fullText);
            const lower = fullText.toLowerCase();
            const profanity = ["kill", "bomb", "fraudster scum", "die"];
            const hasHate = profanity.some((w) => lower.includes(w));

            if (isDoxx || hasHate) {
              return Response.json({
                success: true,
                data: {
                  isApproved: false,
                  safetyScore: 35,
                  flags: isDoxx ? ["PERSONAL_DOXXING"] : ["HATE_OR_HARASSMENT"],
                  reason: isDoxx
                    ? "Private personal contact information detected by PII safety rule."
                    : "Aggressive or harassing language detected by safety rule.",
                  constructiveTip:
                    "Focus on your product or service experience without posting private contact details or abusive language.",
                } as ContentScreeningResult,
              });
            }

            return Response.json({
              success: true,
              data: {
                isApproved: true,
                safetyScore: 95,
                flags: ["CLEAN"],
                reason: ai
                  ? "Passed deterministic PII safety check after AI timeout."
                  : "Passed deterministic PII safety filter (semantic AI review requires GEMINI_API_KEY).",
              } as ContentScreeningResult,
            });
          }

          // -------------------------------------------------------------
          // 4. MULTILINGUAL AUTO-TRANSLATION
          // -------------------------------------------------------------
          if (action === "translate") {
            const { text, targetLang = "en" } = body;
            if (!text || !text.trim()) {
              return Response.json({ error: "Text is required for translation." }, { status: 400 });
            }
            if (!ai) {
              return Response.json(
                {
                  error:
                    "AI review translation requires GEMINI_API_KEY to be configured on the server.",
                  code: "GEMINI_UNAVAILABLE",
                },
                { status: 503 },
              );
            }

            const prompt = `
Translate this consumer review text into language code "${targetLang}".
Preserve exact brand names, product model names, hashtags, and authentic consumer tone.
Review: """${text}"""
`;
            const translateSchema = {
              type: Type.OBJECT,
              properties: {
                originalText: { type: Type.STRING },
                detectedSourceLang: { type: Type.STRING },
                translatedText: { type: Type.STRING },
                targetLang: { type: Type.STRING },
              },
              required: ["originalText", "detectedSourceLang", "translatedText", "targetLang"],
            };

            const parsed = await generateWithFallback(ai, prompt, translateSchema);
            return Response.json({ success: true, data: parsed as TranslationResult });
          }

          // -------------------------------------------------------------
          // 5. BRAND SUITE SMART AUTO-RESPONDER
          // -------------------------------------------------------------
          if (action === "brand-auto-reply") {
            const { brandName, customerReview = "", verdict = "trash" } = body;
            if (!brandName) {
              return Response.json({ error: "brandName is required." }, { status: 400 });
            }
            if (!ai) {
              return Response.json(
                {
                  error:
                    "AI Brand Auto-Responder requires GEMINI_API_KEY to be configured on the server.",
                  code: "GEMINI_UNAVAILABLE",
                },
                { status: 503 },
              );
            }

            const prompt = `
You are the Senior Vice President of Customer Experience for "${brandName}".
A customer posted the following ${String(verdict).toUpperCase()} review on SOT (Stash Or Trash):
Customer Review: """${customerReview}"""
Draft an empathetic, de-escalating, concrete response that proves ${brandName} takes accountability and routes the customer to SOT Brand Desk resolution.
`;
            const replySchema = {
              type: Type.OBJECT,
              properties: {
                empatheticOpening: { type: Type.STRING },
                acknowledgment: { type: Type.STRING },
                correctiveAction: { type: Type.STRING },
                escalationChannel: { type: Type.STRING },
                fullDraft: { type: Type.STRING },
              },
              required: [
                "empatheticOpening",
                "acknowledgment",
                "correctiveAction",
                "escalationChannel",
                "fullDraft",
              ],
            };

            const parsed = await generateWithFallback(ai, prompt, replySchema);
            return Response.json({ success: true, data: parsed as BrandReplyDraft });
          }

          return Response.json({ error: `Unknown action "${action}"` }, { status: 400 });
        } catch (error) {
          console.error("AI Services API Error:", error);
          const message =
            error instanceof Error
              ? error.message
              : "AI service encountered an unexpected error.";
          return Response.json({ error: message }, { status: 502 });
        }
      },
    },
  },
});
