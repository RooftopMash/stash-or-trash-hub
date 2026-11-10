import type {
  ReceiptVerificationData,
  BrandBarometerSummary,
  ContentScreeningResult,
  TranslationResult,
  BrandReplyDraft,
} from "@/routes/api.ai-services";

export type {
  ReceiptVerificationData,
  BrandBarometerSummary,
  ContentScreeningResult,
  TranslationResult,
  BrandReplyDraft,
};

/**
 * Authenticates a photo of a receipt, invoice, till slip, or order confirmation.
 */
export async function authenticateReceipt(
  base64OrDataUrl: string,
  targetBrand?: string,
  mimeType = "image/jpeg"
): Promise<ReceiptVerificationData> {
  const res = await fetch("/api/ai-services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "authenticate-receipt",
      image: base64OrDataUrl,
      mimeType,
      targetBrand,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to authenticate receipt");
  }

  const json = await res.json();
  return json.data;
}

/**
 * Generates a Moody's / S&P grade Brand Barometer report for any brand.
 */
export async function fetchBrandBarometer(
  brandName: string,
  stashPct = 50,
  totalVerdicts = 0,
  sampleVerdicts: string[] = []
): Promise<BrandBarometerSummary> {
  const res = await fetch("/api/ai-services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "brand-barometer",
      brandName,
      stashPct,
      totalVerdicts,
      sampleVerdicts,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate brand barometer");
  }

  const json = await res.json();
  return json.data;
}

/**
 * Screens review content pre-publication to protect from legal defamation and doxxing.
 */
export async function screenContentSafety(
  title: string,
  description = ""
): Promise<ContentScreeningResult> {
  const res = await fetch("/api/ai-services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "screen-content",
      title,
      description,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Content safety check failed");
  }

  const json = await res.json();
  return json.data;
}

/**
 * Performs high-accuracy 1-tap multilingual translation on consumer reviews.
 */
export async function translateReviewText(
  text: string,
  targetLang = "en"
): Promise<TranslationResult> {
  const res = await fetch("/api/ai-services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "translate",
      text,
      targetLang,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Translation request failed");
  }

  const json = await res.json();
  return json.data;
}

/**
 * Generates an empathetic, de-escalating executive response for Brand Suite managers.
 */
export async function generateBrandAutoReply(
  brandName: string,
  customerReview: string,
  verdict: "stash" | "trash" = "trash"
): Promise<BrandReplyDraft> {
  const res = await fetch("/api/ai-services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "brand-auto-reply",
      brandName,
      customerReview,
      verdict,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to generate brand response");
  }

  const json = await res.json();
  return json.data;
}
