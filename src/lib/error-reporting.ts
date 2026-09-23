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

  console.error("[Application Error]", error, enrichedContext);
  window.__sentryBridge?.captureException?.(error, enrichedContext);
}

export function installSentryBridge(bridge: SentryBridge) {
  if (typeof window !== "undefined") window.__sentryBridge = bridge;
}
