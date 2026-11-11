import "./lib/react-bridge";
import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

startTransition(() => {
  try {
    hydrateRoot(document, <StartClient />);
  } catch {
    // Graceful fallback for hydration transition
  }
});
