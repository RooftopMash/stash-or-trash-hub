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

    // Every route in this layout is private. Do not render authenticated
    // surfaces with a null user when auth initialization or the network fails.
    throw redirect({ to: "/auth", search: { redirect: location.href } });
  },
  component: () => <Outlet />,
});
