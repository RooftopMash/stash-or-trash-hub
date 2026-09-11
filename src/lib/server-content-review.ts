import { generateText } from "ai";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type ReviewDecision = "approved" | "needs_review" | "blocked";

export type ContentReviewResult = {
  decision: ReviewDecision;
  riskScore: number;
  findings: string[];
  requiresHumanReview: boolean;
};

const REVIEW_MODEL = "openai/gpt-oss-120b";

export async function reviewContent(input: {
  ownerId: string;
  assetType: "photo" | "video" | "product" | "text";
  text?: string;
  assetUrl?: string;
}): Promise<ContentReviewResult> {
  const prompt = [
    "You are a safety reviewer for a public consumer platform.",
    "Return exactly four lines in this format:",
    "DECISION: approved|needs_review|blocked",
    "RISK: 0.00 to 1.00",
    "FINDINGS: comma-separated concise findings or none",
    "HUMAN: yes|no",
    `Asset type: ${input.assetType}`,
    `User text: ${input.text ?? "(none)"}`,
    "Review for deception, undisclosed AI manipulation, unsafe prank products, harassment, illegal activity, privacy violations, and targeted abuse.",
  ].join("\n");

  const result = await generateText({ model: REVIEW_MODEL, prompt });
  const lines = result.text.split("\n").map((line) => line.trim());
  const decision = lines.find((line) => line.startsWith("DECISION:"))?.split(":")[1]?.trim();
  const risk = Number(lines.find((line) => line.startsWith("RISK:"))?.split(":")[1]?.trim());
  const findings = lines.find((line) => line.startsWith("FINDINGS:"))?.split(":").slice(1).join(":").trim();
  const human = lines.find((line) => line.startsWith("HUMAN:"))?.split(":")[1]?.trim();
  const parsedDecision: ReviewDecision = decision === "blocked" || decision === "needs_review" ? decision : "approved";
  const riskScore = Number.isFinite(risk) ? Math.min(1, Math.max(0, risk)) : parsedDecision === "approved" ? 0.1 : 0.8;
  const parsedFindings = findings && findings.toLowerCase() !== "none" ? findings.split(",").map((item) => item.trim()).filter(Boolean) : [];
  const requiresHumanReview = human === "yes" || parsedDecision === "needs_review";

  await supabaseAdmin.from("ai_content_reviews").insert({
    owner_id: input.ownerId,
    asset_type: input.assetType,
    asset_url: input.assetUrl ?? null,
    status: parsedDecision,
    risk_score: riskScore,
    findings: parsedFindings,
    reviewed_at: new Date().toISOString(),
  });

  return { decision: parsedDecision, riskScore, findings: parsedFindings, requiresHumanReview };
}
