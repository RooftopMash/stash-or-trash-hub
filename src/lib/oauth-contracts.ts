export const OAUTH_PROVIDERS = {
  instagram: {
    label: "Instagram",
    scopes: ["user_profile", "user_media"],
    credentialKeys: ["INSTAGRAM_CLIENT_ID", "INSTAGRAM_CLIENT_SECRET"],
    callbackPath: "/auth/providers/instagram/callback",
  },
  tiktok: {
    label: "TikTok",
    scopes: ["user.info.basic", "video.list"],
    credentialKeys: ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET"],
    callbackPath: "/auth/providers/tiktok/callback",
  },
  x: {
    label: "X",
    scopes: ["users.read", "tweet.read", "offline.access"],
    credentialKeys: ["X_CLIENT_ID", "X_CLIENT_SECRET"],
    callbackPath: "/auth/providers/x/callback",
  },
  google: {
    label: "Google verification",
    scopes: ["openid", "email", "profile"],
    credentialKeys: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
    callbackPath: "/auth/providers/google/callback",
  },
} as const;

export type OAuthProvider = keyof typeof OAUTH_PROVIDERS;

export function getOAuthCallbackUrl(provider: OAuthProvider, origin: string) {
  return new URL(OAUTH_PROVIDERS[provider].callbackPath, origin).toString();
}

export function isOAuthProvider(value: string): value is OAuthProvider {
  return value in OAUTH_PROVIDERS;
}

export function assertOAuthState(expected: string | null, received: string | null) {
  if (!expected || !received || expected.length < 16 || expected !== received) {
    throw new Error("OAuth state validation failed");
  }
}
