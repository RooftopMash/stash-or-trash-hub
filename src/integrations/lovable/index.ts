import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import { supabase } from "../supabase/client";

const lovableAuth = createLovableAuth();

type SignInOptions = {
  redirect_uri?: string;
  extraParams?: Record<string, string>;
};

function generateOAuthState(): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return [...crypto.getRandomValues(new Uint8Array(16))]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const lovable = {
  auth: {
    signInWithOAuth: async (
      provider: "google" | "apple" | "microsoft" | "lovable",
      opts?: SignInOptions
    ) => {
      if (typeof window === "undefined") {
        return { error: new Error("Window is not defined") };
      }

      const host = window.location.hostname;
      const isNativeLovableHost =
        host === "stash-or-trash-hub.lovable.app" ||
        host.endsWith(".lovable.app") ||
        host.endsWith(".lovableproject.com");

      // 1. If running natively on Lovable domains, use standard Lovable cloud-auth
      if (isNativeLovableHost) {
        const result = await lovableAuth.signInWithOAuth(provider, opts);
        if (result.redirected) return result;
        if (result.error) return result;
        if (result.tokens) {
          try {
            await supabase.auth.setSession(result.tokens);
          } catch (e) {
            return { error: e instanceof Error ? e : new Error(String(e)) };
          }
        }
        return result;
      }

      // 2. When running on AI Studio / custom domain / localhost:
      // Open a web_message OAuth popup to Lovable's OAuth broker.
      // Lovable broker handles Google Client ID/Secret and posts tokens back to window.opener.
      const state = generateOAuthState();
      const redirectUri = "https://stash-or-trash-hub.lovable.app/auth/callback";
      const brokerUrl = "/~oauth/initiate";

      const params = new URLSearchParams({
        ...opts?.extraParams,
        provider,
        redirect_uri: redirectUri,
        state,
        response_mode: "web_message",
      });

      const url = `${brokerUrl}?${params.toString()}`;
      const width = Math.min(520, window.outerWidth || 500);
      const height = Math.min(640, window.outerHeight || 600);
      const left = window.screenX + ((window.outerWidth || 500) - width) / 2;
      const top = window.screenY + ((window.outerHeight || 600) - height) / 2;

      let resolvePromise: (value: {
        access_token?: string;
        refresh_token?: string;
        error?: string;
        error_description?: string;
        state?: string;
      }) => void;

      const messagePromise = new Promise<{
        access_token?: string;
        refresh_token?: string;
        error?: string;
        error_description?: string;
        state?: string;
      }>((resolve) => {
        resolvePromise = resolve;
      });

      const allowedOrigins = [
        "https://oauth.lovable.app",
        "https://lovable.dev",
        "https://stash-or-trash-hub.lovable.app",
        window.location.origin,
      ];

      const onMessage = (e: MessageEvent) => {
        if (!allowedOrigins.includes(e.origin)) return;
        const data = e.data;
        if (!data || typeof data !== "object") return;
        if (data.type !== "authorization_response") return;
        resolvePromise(data.response || data);
      };

      window.addEventListener("message", onMessage);

      const popup = window.open(
        url,
        "oauth",
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );

      if (!popup) {
        window.removeEventListener("message", onMessage);
        return {
          error: new Error(
            "Popup was blocked. Please allow popups to sign in with Google."
          ),
        };
      }

      const popupClosedPromise = new Promise<null>((_, reject) => {
        const interval = setInterval(() => {
          if (popup.closed) {
            clearInterval(interval);
            reject(new Error("Sign in was cancelled"));
          }
        }, 500);
      });

      try {
        const response = await Promise.race([messagePromise, popupClosedPromise]);
        if (!response) throw new Error("No response received");
        if (response.state && response.state !== state) {
          throw new Error("Invalid OAuth state");
        }
        if (response.error) {
          throw new Error(response.error_description || response.error);
        }
        if (!response.access_token || !response.refresh_token) {
          throw new Error("No authentication tokens received");
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: response.access_token,
          refresh_token: response.refresh_token,
        });

        if (sessionError) throw sessionError;

        return {
          tokens: {
            access_token: response.access_token,
            refresh_token: response.refresh_token,
          },
          error: null,
        };
      } catch (err) {
        return { error: err instanceof Error ? err : new Error(String(err)) };
      } finally {
        window.removeEventListener("message", onMessage);
        try {
          popup?.close();
        } catch {
          // ignore popup close errors
        }
      }
    },
  },
};
