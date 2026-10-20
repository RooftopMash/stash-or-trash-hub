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

const DEV_OVERRIDE_KEY = "sot_developer_code_inspect_v1";

export function isDeveloperCodeInspectionActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(DEV_OVERRIDE_KEY) === "true";
  } catch {
    return false;
  }
}

export function toggleDeveloperCodeInspection(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (enabled) {
      window.localStorage.setItem(DEV_OVERRIDE_KEY, "true");
    } else {
      window.localStorage.removeItem(DEV_OVERRIDE_KEY);
    }
  } catch {
    // Ignore storage errors
  }
}

export function installProductionSecurityShield(): void {
  if (typeof window === "undefined" || shieldInstalled) return;
  shieldInstalled = true;

  const metaEnv = (typeof import.meta !== "undefined" && (import.meta as any).env) ? (import.meta as any).env : {};
  const isProd = metaEnv.PROD ?? false;

  // 1. Console & Debugger Scrubbing in Production
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

  // 2. F12 and Code Viewing Options / Anti-Inspection Shield
  const handleKeyDown = (e: KeyboardEvent) => {
    if (isDeveloperCodeInspectionActive()) return;

    // F12 key (DevTools shortcut)
    if (e.key === "F12" || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Ctrl+Shift+I / Cmd+Opt+I (Inspect Element)
    // Ctrl+Shift+J / Cmd+Opt+J (Console)
    // Ctrl+Shift+C / Cmd+Opt+C (Element picker)
    if (
      (e.ctrlKey || e.metaKey) &&
      e.shiftKey &&
      ["I", "i", "J", "j", "C", "c"].includes(e.key)
    ) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Ctrl+U / Cmd+U (View Page Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Ctrl+S / Cmd+S (Save Page HTML)
    if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  };

  window.addEventListener("keydown", handleKeyDown, { capture: true });

  // 3. Mobile Anti-Screen Grab & Touch Callout Protection
  try {
    document.documentElement.classList.add("sot-shield-active");
    if (document.body) {
      document.body.classList.add("sot-shield-active");
    }
  } catch {
    // Ignore DOM exception
  }

  // Prevent right-click and mobile long-press context menu (blocks "Inspect Element", "View Source", "Save Image As")
  const handleContextMenu = (e: MouseEvent) => {
    if (isDeveloperCodeInspectionActive()) return;
    // Allow right click inside text input fields for copy/paste
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
      return;
    }
    e.preventDefault();
  };
  window.addEventListener("contextmenu", handleContextMenu, { capture: true });

  // Prevent drag-to-save on mobile and desktop
  const handleDragStart = (e: DragEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === "IMG" || target.tagName === "VIDEO")) {
      e.preventDefault();
    }
  };
  window.addEventListener("dragstart", handleDragStart, { capture: true });

  // 4. Privacy Shield on Mobile Screen Capture / App Switcher
  // When mobile OS captures snapshot for app switcher or screen-recording is active,
  // apply a blur veil to protect personal conversations and proprietary brand analytics
  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      document.body?.classList.add("sot-privacy-blur");
    } else {
      document.body?.classList.remove("sot-privacy-blur");
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  window.addEventListener("blur", () => {
    document.body?.classList.add("sot-privacy-blur");
  });

  window.addEventListener("focus", () => {
    document.body?.classList.remove("sot-privacy-blur");
  });
}
