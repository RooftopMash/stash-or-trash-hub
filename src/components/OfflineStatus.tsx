import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CloudOff } from "lucide-react";

export function OfflineStatus() {
  const [offline, setOffline] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    const handleOnline = () => {
      update();
      void queryClient.refetchQueries({ type: "active" });
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;
  return <div role="status" className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 border-t border-amber-500/30 bg-amber-950 px-4 py-2 text-xs font-medium text-amber-100"><CloudOff className="h-4 w-4" /> You are offline. Changes will not be submitted until your connection returns.</div>;
}
