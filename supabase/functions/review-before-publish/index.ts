import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const requestShape = (value: unknown) => {
  if (!value || typeof value !== "object") throw new Error("Invalid request");
  const body = value as Record<string, unknown>;
  const assetType = body.assetType;
  const content = body.content;
  if (!["photo", "video", "product", "text"].includes(String(assetType))) throw new Error("Invalid asset type");
  if (typeof content !== "string" || content.trim().length < 1 || content.length > 50_000) throw new Error("Invalid content");
  return { assetType: String(assetType), content: content.trim(), assetUrl: typeof body.assetUrl === "string" ? body.assetUrl : null };
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const reviewEndpoint = Deno.env.get("AI_REVIEW_ENDPOINT");
    if (!supabaseUrl || !serviceRoleKey || !reviewEndpoint) throw new Error("Review service is not configured");

    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return new Response(JSON.stringify({ error: "Authentication required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    if (authError || !user) return new Response(JSON.stringify({ error: "Authentication required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const payload = requestShape(await request.json());
    const reviewResponse = await fetch(reviewEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${Deno.env.get("AI_REVIEW_ENDPOINT_TOKEN") ?? ""}` },
      body: JSON.stringify(payload),
    });
    if (!reviewResponse.ok) throw new Error("Review provider unavailable");
    const decision = await reviewResponse.json();
    if (!["approved", "needs_review", "blocked"].includes(decision.decision)) throw new Error("Invalid review decision");

    const { data: review, error: insertError } = await admin.from("ai_content_reviews").insert({
      owner_id: user.id,
      asset_type: payload.assetType,
      asset_url: payload.assetUrl,
      status: decision.decision,
      risk_score: Math.max(0, Math.min(1, Number(decision.riskScore) || 1)),
      findings: Array.isArray(decision.findings) ? decision.findings : [],
      reviewed_at: new Date().toISOString(),
    }).select("id, status, risk_score, findings").single();
    if (insertError) throw insertError;

    return new Response(JSON.stringify({ reviewId: review.id, decision: review.status, riskScore: review.risk_score, findings: review.findings }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Review failed" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
