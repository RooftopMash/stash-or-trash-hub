import { useEffect } from "react";
import { reportLovableError } from "@/lib/lovable-error-reporting";

export function ProductionMonitoring() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      reportLovableError(event.error ?? new Error(event.message), { mechanism: "window_error", filename: event.filename, line: event.lineno });
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
