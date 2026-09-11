import { z } from "zod";

export const publishReviewRequestSchema = z.object({
  assetType: z.enum(["photo", "video", "product", "text"]),
  content: z.string().trim().min(1).max(50_000),
  assetUrl: z.string().url().optional(),
});

export const publishReviewResponseSchema = z.object({
  reviewId: z.string().uuid(),
  decision: z.enum(["approved", "needs_review", "blocked"]),
  riskScore: z.number().min(0).max(1),
  findings: z.array(z.string()),
});

export type PublishReviewRequest = z.infer<typeof publishReviewRequestSchema>;
export type PublishReviewResponse = z.infer<typeof publishReviewResponseSchema>;

export function canPublishAfterReview(decision: PublishReviewResponse["decision"]): boolean {
  return decision === "approved";
}
