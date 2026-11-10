import "./lib/react-bridge";
import "./lib/google-page-translation";
import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

startTransition(() => {
  hydrateRoot(document, <StartClient />);
});
