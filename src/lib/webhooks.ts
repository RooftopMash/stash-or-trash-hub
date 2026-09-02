import { supabase } from "@/integrations/supabase/client";

export type BrandWebhook = {
  id: string;
  brand_id: string;
  url: string;
  secret: string;
  events: string[];
  active: boolean;
  created_at: string;
};

/** Generate a random secret key for webhook HMAC signing */
export function generateWebhookSecret(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let secret = "whsec_";
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

/** Simple HMAC-SHA256 signature generator using SubtleCrypto (works in browser & Node / Cloudflare Workers) */
export async function generateHMACSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(payload);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, msgData);
  const hashArray = Array.from(new Uint8Array(signature));
  return "sha256=" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Verify HMAC signature */
export async function verifyHMACSignature(
  payload: string,
  providedSignature: string,
  secret: string,
): Promise<boolean> {
  const expected = await generateHMACSignature(payload, secret);
  return expected === providedSignature;
}

/** Fetch webhooks for a brand */
export async function fetchBrandWebhooks(brandId: string): Promise<BrandWebhook[]> {
  const { data, error } = await supabase
    .from("brand_webhooks")
    .select("*")
    .eq("brand_id", brandId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as BrandWebhook[];
}

/** Create a new webhook */
export async function createBrandWebhook(
  brandId: string,
  url: string,
  events: string[],
): Promise<BrandWebhook> {
  const secret = generateWebhookSecret();
  const { data, error } = await supabase
    .from("brand_webhooks")
    .insert({
      brand_id: brandId,
      url: url.trim(),
      secret,
      events,
      active: true,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as BrandWebhook;
}

/** Delete webhook */
export async function deleteBrandWebhook(webhookId: string): Promise<void> {
  const { error } = await supabase.from("brand_webhooks").delete().eq("id", webhookId);
  if (error) throw error;
}

/** Toggle active status */
export async function toggleBrandWebhook(webhookId: string, active: boolean): Promise<void> {
  const { error } = await supabase.from("brand_webhooks").update({ active }).eq("id", webhookId);
  if (error) throw error;
}

/** Trigger webhook delivery to configured endpoints */
export async function triggerWebhookDelivery(
  brandId: string,
  event: "new_post" | "crisis_alert" | "new_response",
  data: Record<string, any>,
) {
  try {
    const webhooks = await fetchBrandWebhooks(brandId);
    const active = webhooks.filter((w) => w.active && w.events.includes(event));
    if (active.length === 0) return;

    const payload = JSON.stringify({
      event,
      brand_id: brandId,
      timestamp: new Date().toISOString(),
      data,
    });

    for (const hook of active) {
      const signature = await generateHMACSignature(payload, hook.secret);
      fetch(hook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-sot-signature": signature,
          "x-sot-event": event,
        },
        body: payload,
      }).catch((e) => console.error(`Webhook delivery failed to ${hook.url}:`, e));
    }
  } catch (e) {
    console.error("Webhook trigger error:", e);
  }
}
