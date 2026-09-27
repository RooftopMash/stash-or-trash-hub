/**
 * Production Frontend Security Shield
 * - Silences console logs, warnings, traces, and raw stack dumps in production builds
 * - Scrubs sensitive tokens, stack traces, and internal file paths from any runtime error messages
 * - Prevents accidental exposure of internal state on global window properties
 */

const SENSITIVE_PATTERNS = [
  /AIza[0-9A-Za-z_-]{35}/g,
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
  /(?:postgres|postgresql|mysql|mongodb(?:\+srv)?):\/\/[^\s"']+/gi,
  /(?:file|webpack|vite|rolldown):\/\/\/[^\s)]+/gi,
  /\bat\s+[^\n]+?\([^)]+:\d+:\d+\)/g,
];

export function sanitizePublicMessage(input: unknown): string {
  const raw =
    input instanceof Error
      ? input.message
      : typeof input === "string"
        ? input
        : "An unexpected error occurred.";

  let cleaned = raw;
  for (const pattern of SENSITIVE_PATTERNS) {
    cleaned = cleaned.replace(pattern, "[redacted]");
  }
  return cleaned.slice(0, 240);
}

let shieldInstalled = false;

export function installProductionSecurityShield(): void {
  if (typeof window === "undefined" || shieldInstalled) return;
  shieldInstalled = true;

  const isProd = import.meta.env.PROD;

  if (isProd) {
    const noop = () => undefined;
    try {
      window.console.log = noop;
      window.console.debug = noop;
      window.console.info = noop;
      window.console.warn = noop;
      window.console.trace = noop;
      window.console.table = noop;
      window.console.dir = noop;
      window.console.error = () => undefined;
    } catch {
      // Ignore read-only console descriptors in restricted environments
    }

    // Remove any dev/bundler global hooks if present
    try {
      const win = window as unknown as Record<string, unknown>;
      delete win.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      delete win.__TANSTACK_ROUTER_DEVTOOLS__;
    } catch {
      // Ignore non-configurable globals
    }
  }
}
