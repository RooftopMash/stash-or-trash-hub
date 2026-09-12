type LovableErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type LovableEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: LovableErrorOptions,
  ) => void;
};

type SentryBridge = {
  captureException?: (error: unknown, context?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    __lovableEvents?: LovableEvents;
    __sentryBridge?: SentryBridge;
  }
}

export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const enrichedContext = {
    source: "react_error_boundary",
    route: window.location.pathname,
    ...context,
  };

  window.__lovableEvents?.captureException?.(error, enrichedContext, {
    mechanism: "react_error_boundary",
    handled: false,
    severity: "error",
  });
  window.__sentryBridge?.captureException?.(error, enrichedContext);
}

export function installSentryBridge(bridge: SentryBridge) {
  if (typeof window !== "undefined") window.__sentryBridge = bridge;
}
EOF
