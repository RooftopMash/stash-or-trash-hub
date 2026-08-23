import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Live unread notification count for the signed-in user. */
export function useUnreadNotifications(userId: string | null | undefined) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setCount(0);
      return;
    }
    let mounted = true;

    const load = async () => {
      const { count: c } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .is("read_at", null);
      if (mounted) setCount(c ?? 0);
    };
    load();

    const channel = supabase
      .channel(`unread-notifs-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        () => load(),
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return count;
}
