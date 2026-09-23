import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth_/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function completeAuth() {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(
          window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash,
        );

        // Check if OAuth provider returned an error in search or hash
        const errorDesc =
          searchParams.get("error_description") ||
          hashParams.get("error_description") ||
          searchParams.get("error") ||
          hashParams.get("error");

        if (errorDesc) {
          throw new Error(decodeURIComponent(errorDesc));
        }

        // 1. PKCE Authorization Code flow
        const code = searchParams.get("code");
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          if (data.session && active) {
            if (window.opener && !window.opener.closed) {
              window.opener.postMessage(
                {
                  type: "authorization_response",
                  response: {
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token,
                  },
                },
                "*"
              );
              window.close();
              return;
            }
            toast.success("Welcome back!");
            navigate({ to: "/" });
            return;
          }
        }

        // 2. Implicit hash grant flow (access_token & refresh_token in URL hash)
        const accessToken = hashParams.get("access_token") || searchParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token") || searchParams.get("refresh_token");
        if (accessToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });
          if (error) throw error;
          if (data.session && active) {
            if (window.opener && !window.opener.closed) {
              window.opener.postMessage(
                {
                  type: "authorization_response",
                  response: {
                    access_token: accessToken,
                    refresh_token: refreshToken || "",
                  },
                },
                "*"
              );
              window.close();
              return;
            }
            toast.success("Welcome back!");
            navigate({ to: "/" });
            return;
          }
        }

        // 3. Fallback: check if session already exists
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session && active) {
          navigate({ to: "/" });
          return;
        }

        // If no code, no token, and no session, redirect to /auth
        if (active) {
          navigate({ to: "/auth" });
        }
      } catch (err: unknown) {
        if (!active) return;
        const msg = err instanceof Error ? err.message : "Could not complete sign in.";
        setErrorMessage(msg);
        toast.error(msg);
      }
    }

    void completeAuth();
    return () => {
      active = false;
    };
  }, [navigate]);

  if (errorMessage) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md space-y-4 rounded-2xl border border-destructive/20 bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold text-destructive">Sign in incomplete</h2>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
          <button
            type="button"
            onClick={() => navigate({ to: "/auth" })}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Back to Sign In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p>Completing sign in…</p>
    </main>
  );
}
