import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ location }) => {
    // 1. Check: Firebase auth current user
    if (auth.currentUser) {
      return { user: auth.currentUser };
    }

    // 2. Check: Local fallback auth user in localStorage
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
    }

    // Not authenticated -> redirect to /auth with target destination
    throw redirect({ to: "/auth", search: { redirect: location.href } });
  },
  component: () => <Outlet />,
});
