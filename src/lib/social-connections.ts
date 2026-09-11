import { supabase } from "@/integrations/supabase/client";
import { OAUTH_PROVIDERS, getOAuthCallbackUrl, assertOAuthState, type OAuthProvider } from "@/lib/oauth-contracts";

export type SocialProvider = "facebook" | "linkedin" | "youtube";

export type SocialConnection = {
  id: string;
  provider: SocialProvider;
  status: "not_connected" | "pending" | "connected" | "revoked" | "error";
  display_name: string | null;
  scopes: string[];
  last_synced_at: string | null;
};

export async function getSocialConnections(userId: string): Promise<SocialConnection[]> {
  const { data, error } = await supabase
    .from("social_connections" as never)
    .select("id, provider, status, display_name, scopes, last_synced_at")
    .eq("user_id", userId)
    .order("provider") as { data: SocialConnection[] | null; error: { message: string } | null };
  if (error) throw error;
  return data ?? [];
}

export async function prepareSocialConnection(userId: string, provider: SocialProvider) {
  const { error } = await supabase.from("social_connections" as never).upsert(
    { user_id: userId, provider, status: "pending" },
    { onConflict: "user_id,provider" },
  );
  if (error) throw error;
}

export function getProviderCallbackConfig(provider: OAuthProvider, origin: string) {
  const config = OAUTH_PROVIDERS[provider];
  return { provider, label: config.label, scopes: [...config.scopes], callbackUrl: getOAuthCallbackUrl(provider, origin), credentialKeys: [...config.credentialKeys] };
}

export function validateProviderCallbackState(expectedState: string | null, receivedState: string | null) {
  assertOAuthState(expectedState, receivedState);
}

export async function disconnectSocialConnection(userId: string, provider: SocialProvider) {
  const { error } = await supabase
    .from("social_connections" as never)
    .update({ status: "revoked", updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("provider", provider);
  if (error) throw error;
}
