import "./lib/react-bridge";
import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

if (
  typeof window !== "undefined" &&
  (import.meta.env.DEV || window.location.hostname.startsWith("ais-dev-"))
) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => Promise.all(regs.map((r) => r.unregister())))
      .catch(() => {});
  }
  if ("caches" in window) {
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .catch(() => {});
  }
}

startTransition(() => {
  try {
    hydrateRoot(document, <StartClient />);
  } catch {
    // Graceful fallback for hydration transition
  }
});
