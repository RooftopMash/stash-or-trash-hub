import { supabase } from "@/integrations/supabase/client";
import { publishReviewResponseSchema, type PublishReviewRequest } from "@/lib/publish-review-contract";

export async function reviewBeforePublish(request: PublishReviewRequest) {
  const { data, error } = await supabase.functions.invoke("review-before-publish", { body: request });
  if (error) return { data: null, error };
  const parsed = publishReviewResponseSchema.safeParse(data);
  if (!parsed.success) return { data: null, error: new Error("The moderation service returned an invalid decision") };
  return { data: parsed.data, error: null };
}
