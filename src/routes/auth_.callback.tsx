import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth_/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function completeAuth() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          toast.error("We could not complete sign in. Please try again.");
          return;
        }
      }
      if (!cancelled) window.location.replace("/auth");
    }

    void completeAuth();
    return () => { cancelled = true; };
  }, []);

  return <main className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Completing sign in…</main>;
}
