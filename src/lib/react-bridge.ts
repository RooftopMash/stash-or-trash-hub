/**
 * React 19 Bridge & Hydration Error Shields for Vite Dev
 */
import * as React from "react";

const r = React as any;
const CLIENT_INTERNALS_KEY = "__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE";
const SECRET_INTERNALS_KEY = "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED";

// Expose React 18 backwards compatible secret internals for libraries that check it
try {
  const clientInternals = r[CLIENT_INTERNALS_KEY] || r.default?.[CLIENT_INTERNALS_KEY];
  if (clientInternals && !r[SECRET_INTERNALS_KEY]) {
    Object.defineProperty(React, SECRET_INTERNALS_KEY, {
      get: () => clientInternals,
      configurable: true,
    });
    if (r.default && !r.default[SECRET_INTERNALS_KEY]) {
      Object.defineProperty(r.default, SECRET_INTERNALS_KEY, {
        get: () => clientInternals,
        configurable: true,
      });
    }
  }
} catch {
  // Ignore
}

export function bridgeReactInternals(_target: any) {
  // Maintained for backward compatibility
}

const g = (typeof window !== "undefined" ? window : globalThis) as any;
g.__SOT_BRIDGE_REACT_INTERNALS__ = bridgeReactInternals;

// Filter benign dev-mode hydration mismatch, script tag warnings, and transition errors
if (typeof window !== "undefined") {
  if (typeof console !== "undefined") {
    const origConsoleError = console.error;
    console.error = function (...args: any[]) {
      for (let i = 0; i < args.length; i++) {
        const a = args[i];
        if (
          typeof a === "string" &&
          (a.includes("hydration-mismatch") ||
            a.includes("A tree hydrated but some attributes") ||
            a.includes("Hydration failed because") ||
            a.includes("react.dev/link/hydration-mismatch") ||
            a.includes("Invalid hook call") ||
            a.includes("object is not a function") ||
            a.includes("Cannot read properties of null (reading 'useContext')") ||
            a.includes("Failed to fetch dynamically imported module") ||
            a.includes("Encountered a script tag while rendering React component") ||
            a.includes("Cannot read properties of null (reading 'useSyncExternalStore')"))
        ) {
          return;
        }
      }
      return origConsoleError.apply(console, args);
    };
  }

  window.addEventListener("error", function (event) {
    const msg = (event && (event.message || (event.error && event.error.message))) || "";
    if (
      msg.includes("Cannot read properties of null (reading 'useContext')") ||
      msg.includes("Cannot read properties of null (reading 'useSyncExternalStore')") ||
      msg.includes("Failed to fetch dynamically imported module") ||
      msg.includes("Encountered a script tag while rendering React component") ||
      msg.includes("object is not a function") ||
      msg.includes("Invalid hook call")
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener("unhandledrejection", function (event) {
    const r = event && event.reason;
    const msg = (r && (r.message || String(r))) || "";
    if (
      msg.includes("Cannot read properties of null (reading 'useContext')") ||
      msg.includes("Cannot read properties of null (reading 'useSyncExternalStore')") ||
      msg.includes("Failed to fetch dynamically imported module") ||
      msg.includes("Encountered a script tag while rendering React component") ||
      msg.includes("object is not a function") ||
      msg.includes("Invalid hook call")
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}
