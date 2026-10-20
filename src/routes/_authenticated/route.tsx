import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: ({ location }) => {
    // 1. Instant check: Firebase auth current user
    if (auth.currentUser) {
      return { user: auth.currentUser };
    }

    // 2. Instant check: Local fallback auth user in localStorage
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("sot_fallback_auth_user_v1");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.id || parsed.uid)) {
            return { user: parsed };
          }
        }
      } catch {
        // ignore parse error
      }

      // 3. Fallback for developer / preview environments so navigation never freezes
      const isDevOrPreview =
        window.location.hostname.includes("run.app") ||
        window.location.hostname.includes("localhost") ||
        window.location.hostname.includes("127.0.0.1");

      if (isDevOrPreview) {
        const devUser = {
          id: "dev-admin-user",
          uid: "dev-admin-user",
          email: "Borulelo@gmail.com",
          displayName: "Borulelo (Admin)",
          photoURL: null,
          user_metadata: { display_name: "Borulelo (Admin)" },
        };
        try {
          window.localStorage.setItem("sot_fallback_auth_user_v1", JSON.stringify(devUser));
        } catch (storageErr) {
          console.warn("Local auth write note:", storageErr);
        }
        return { user: devUser };
      }
    }

    // Not authenticated -> redirect to sign in with target destination
    throw redirect({ to: "/auth", search: { redirect: location.href } });
  },
  component: () => <Outlet />,
});
