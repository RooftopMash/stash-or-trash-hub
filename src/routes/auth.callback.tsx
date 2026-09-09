import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const destination = `/auth${window.location.search}${window.location.hash}`;
    navigate({ to: destination, replace: true });
  }, [navigate]);

  return <main className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Completing sign in…</main>;
}
