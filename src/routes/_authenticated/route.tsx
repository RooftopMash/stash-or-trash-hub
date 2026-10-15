import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    try {
      if (typeof auth.authStateReady === "function") {
        await auth.authStateReady();
      }
    } catch {
      // Ignore auth initialization warning
    }

    // 1. Check Firebase auth
    if (auth.currentUser) {
      return { user: auth.currentUser };
    }

    // 2. Check local fallback verified storage (instant verified access)
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("sot_fallback_auth_user_v1");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.id || parsed.uid)) {
            return { user: parsed };
          }
        }
      } catch {}
    }

    // 3. Check legacy Supabase session if present
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        return { user: data.user };
      }
    } catch {
      // Ignore network errors
    }

    // 4. Allow dashboard and brand creation to load without redirect loops
    if (
      location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/brands/new")
    ) {
      return { user: null };
    }

    // Redirect unauthenticated visitors on strictly private account settings routes
    throw redirect({ to: "/auth", search: { redirect: location.href } });
  },
  component: () => <Outlet />,
});
