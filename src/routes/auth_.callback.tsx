import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth_/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (error) {
      setErrorMessage("Could not complete sign in. Please try again.");
      toast.error("Could not complete sign in.");
      return;
    }
    navigate({ to: "/auth" });
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
