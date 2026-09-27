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

    // 2. Check legacy session if present
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        return { user: data.user };
      }
    } catch {
      // Ignore network errors
    }

    // Allow dashboard and brand creation to load without redirect loops
    if (
      location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/brands/new") ||
      location.pathname.startsWith("/admin")
    ) {
      return { user: null };
    }

    // Redirect unauthenticated visitors on private user routes
    throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});
