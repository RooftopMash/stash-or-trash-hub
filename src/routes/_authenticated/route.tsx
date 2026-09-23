import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { auth } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
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
      // Ignore network errors and redirect to auth
    }

    // Redirect unauthenticated visitors
    throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});
