import { useEffect } from "react";
import { installSentryBridge, reportLovableError } from "@/lib/lovable-error-reporting";

export function ProductionMonitoring() {
  useEffect(() => {
    const sentry = (window as Window & { Sentry?: { captureException?: (error: unknown, context?: Record<string, unknown>) => void } }).Sentry;
    if (sentry?.captureException) installSentryBridge({ captureException: sentry.captureException.bind(sentry) });

    const onError = (event: ErrorEvent) => {
      // Resource-load events are plain Events with `isTrusted`, not application errors.
      // Reporting them as exceptions produces the unhelpful {"isTrusted":true} preview error.
      if (!(event.error instanceof Error) && !event.message) return;
      reportLovableError(event.error ?? new Error(event.message), {
        mechanism: "window_error",
        filename: event.filename,
        line: event.lineno,
      });
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      reportLovableError(event.reason, { mechanism: "unhandledrejection" });
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
