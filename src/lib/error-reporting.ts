import { sanitizePublicMessage } from "./security-shield";

type SentryBridge = {
  captureException?: (error: unknown, context?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    __sentryBridge?: SentryBridge;
  }
}

export function reportApplicationError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const enrichedContext = {
    source: "react_error_boundary",
    route: window.location.pathname,
    ...context,
  };

  const msg = error instanceof Error ? error.message : String(error);
  if (
    msg.includes("hydration-mismatch") ||
    msg.includes("Hydration failed") ||
    msg.includes("object is not a function") ||
    msg.includes("Cannot read properties of null (reading 'useContext')") ||
    msg.includes("Failed to fetch dynamically imported module")
  ) {
    return;
  }

  if (import.meta.env.DEV) {
    console.error("[Application Error]", error, enrichedContext);
  }

  const safeError = new Error(sanitizePublicMessage(error));
  window.__sentryBridge?.captureException?.(safeError, enrichedContext);
}

export function installSentryBridge(bridge: SentryBridge) {
  if (typeof window !== "undefined") window.__sentryBridge = bridge;
}
