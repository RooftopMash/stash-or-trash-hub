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

  if (import.meta.env.DEV) {
    console.error("[Application Error]", error, enrichedContext);
  }

  const safeError = new Error(sanitizePublicMessage(error));
  window.__sentryBridge?.captureException?.(safeError, enrichedContext);
}

export function installSentryBridge(bridge: SentryBridge) {
  if (typeof window !== "undefined") window.__sentryBridge = bridge;
}
