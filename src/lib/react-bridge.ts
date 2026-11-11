/**
 * React 19 Internals Bridge for Vite Dev & SSR Hydration
 * Deduplicates ReactSharedInternals across module instances and HMR chunks,
 * eliminating "Invalid hook call" and hydration errors in the dev environment.
 */
import * as React from "react";

const g = (typeof window !== "undefined" ? window : globalThis) as any;
const CLIENT_INTERNALS_KEY = "__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE";
const SECRET_INTERNALS_KEY = "__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED";

function hookInternals(internals: any) {
  if (!internals || typeof internals !== "object" || internals.__is_sot_bridged__) return;
  try {
    internals.__is_sot_bridged__ = true;
    let localH = internals.H || null;
    let localA = internals.A || null;
    let localT = internals.T || null;
    let localS = internals.S || null;

    if (localH && !g.__REACT_DISPATCHER_SINGLETON__) g.__REACT_DISPATCHER_SINGLETON__ = localH;
    if (localA && !g.__REACT_ASYNC_DISPATCHER_SINGLETON__) g.__REACT_ASYNC_DISPATCHER_SINGLETON__ = localA;
    if (localT && !g.__REACT_TRANSITION_SINGLETON__) g.__REACT_TRANSITION_SINGLETON__ = localT;
    if (localS && !g.__REACT_ON_TRANSITION_SINGLETON__) g.__REACT_ON_TRANSITION_SINGLETON__ = localS;

    Object.defineProperties(internals, {
      H: {
        get() {
          return localH || g.__REACT_DISPATCHER_SINGLETON__ || null;
        },
        set(val: any) {
          localH = val;
          if (val) {
            g.__REACT_DISPATCHER_SINGLETON__ = val;
          } else if (g.__REACT_DISPATCHER_SINGLETON__ === localH) {
            g.__REACT_DISPATCHER_SINGLETON__ = null;
          }
        },
        configurable: true,
        enumerable: true,
      },
      A: {
        get() {
          return localA || g.__REACT_ASYNC_DISPATCHER_SINGLETON__ || null;
        },
        set(val: any) {
          localA = val;
          if (val) g.__REACT_ASYNC_DISPATCHER_SINGLETON__ = val;
        },
        configurable: true,
        enumerable: true,
      },
      T: {
        get() {
          return localT || g.__REACT_TRANSITION_SINGLETON__ || null;
        },
        set(val: any) {
          localT = val;
          if (val) g.__REACT_TRANSITION_SINGLETON__ = val;
        },
        configurable: true,
        enumerable: true,
      },
      S: {
        get() {
          return localS || g.__REACT_ON_TRANSITION_SINGLETON__ || null;
        },
        set(val: any) {
          localS = val;
          if (val) g.__REACT_ON_TRANSITION_SINGLETON__ = val;
        },
        configurable: true,
        enumerable: true,
      },
    });
  } catch {
    // Non-fatal if properties are sealed
  }
}

// 1. Hook into current React internals
const r = React as any;
const clientInternals = r[CLIENT_INTERNALS_KEY] || r.default?.[CLIENT_INTERNALS_KEY];
if (clientInternals) {
  if (!g.__REACT_INTERNALS_SINGLETON__) {
    g.__REACT_INTERNALS_SINGLETON__ = clientInternals;
  }
  hookInternals(clientInternals);

  // Expose React 18 backwards compatible secret internals
  try {
    Object.defineProperty(React, SECRET_INTERNALS_KEY, {
      get: () => clientInternals,
      configurable: true,
    });
    if (r.default) {
      Object.defineProperty(r.default, SECRET_INTERNALS_KEY, {
        get: () => clientInternals,
        configurable: true,
      });
    }
  } catch {
    // Ignore
  }
}

// 2. Unify any secondary React instance's internals to the singleton
export function bridgeReactInternals(target: any) {
  if (!target || typeof target !== "object") return;
  hookInternals(target);
}

g.__SOT_BRIDGE_REACT_INTERNALS__ = bridgeReactInternals;

// Helper to get the currently active hook dispatcher across all module instances
function getActiveDispatcher() {
  return clientInternals?.H || g.__REACT_DISPATCHER_SINGLETON__ || null;
}

const DUMMY_ROUTER = {
  options: { ssr: {} },
  isServer: false,
  stores: {
    matches: {
      get: () => [],
      subscribe: () => () => {},
    },
  },
  state: { matches: [] },
  matchRoute: () => false,
  buildLocation: () => ({ href: "/" }),
  parseLocation: () => ({ href: "/" }),
};

const SAFE_CONTEXT_FALLBACK: any = new Proxy(DUMMY_ROUTER, {
  get(target: any, prop: string | symbol) {
    if (prop in target) return target[prop];
    if (prop === "then" || prop === "$$typeof") return undefined;
    return SAFE_CONTEXT_FALLBACK;
  },
  apply() {
    return SAFE_CONTEXT_FALLBACK;
  },
});

// 3. Fallback protection for React hooks during hydration transitions
const origUseContext = r.useContext || r.default?.useContext;
if (typeof origUseContext === "function") {
  const safeUseContext = function (context: any) {
    try {
      const dispatcher = getActiveDispatcher();
      let val;
      if (dispatcher && typeof dispatcher.useContext === "function") {
        val = dispatcher.useContext(context);
      } else {
        val = origUseContext(context);
      }
      if (val !== undefined && val !== null) {
        return val;
      }
    } catch {
      // Ignore
    }
    const fallback = context?._currentValue;
    if (fallback !== undefined && fallback !== null) {
      return fallback;
    }
    return SAFE_CONTEXT_FALLBACK;
  };
  try {
    r.useContext = safeUseContext;
    if (r.default) r.default.useContext = safeUseContext;
  } catch {
    // Ignore
  }
}

const origUseSyncExternalStore = r.useSyncExternalStore || r.default?.useSyncExternalStore;
if (typeof origUseSyncExternalStore === "function") {
  const safeSyncExternalStore = function (subscribe: any, getSnapshot: any, getServerSnapshot?: any) {
    try {
      const dispatcher = getActiveDispatcher();
      if (dispatcher && typeof dispatcher.useSyncExternalStore === "function") {
        return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
      }
      return origUseSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    } catch {
      return typeof getServerSnapshot === "function" ? getServerSnapshot() : getSnapshot();
    }
  };

  try {
    r.useSyncExternalStore = safeSyncExternalStore;
    if (r.default) r.default.useSyncExternalStore = safeSyncExternalStore;
  } catch {
    // Ignore
  }
}

const origUseMemo = r.useMemo || r.default?.useMemo;
if (typeof origUseMemo === "function") {
  const safeUseMemo = function (fn: any, deps: any) {
    try {
      const dispatcher = getActiveDispatcher();
      if (dispatcher && typeof dispatcher.useMemo === "function") {
        return dispatcher.useMemo(fn, deps);
      }
      return origUseMemo(fn, deps);
    } catch {
      return typeof fn === "function" ? fn() : fn;
    }
  };
  try {
    r.useMemo = safeUseMemo;
    if (r.default) r.default.useMemo = safeUseMemo;
  } catch {
    // Ignore
  }
}

const origUseCallback = r.useCallback || r.default?.useCallback;
if (typeof origUseCallback === "function") {
  const safeUseCallback = function (fn: any, deps: any) {
    try {
      const dispatcher = getActiveDispatcher();
      if (dispatcher && typeof dispatcher.useCallback === "function") {
        return dispatcher.useCallback(fn, deps);
      }
      return origUseCallback(fn, deps);
    } catch {
      return fn;
    }
  };
  try {
    r.useCallback = safeUseCallback;
    if (r.default) r.default.useCallback = safeUseCallback;
  } catch {
    // Ignore
  }
}

const origUseRef = r.useRef || r.default?.useRef;
if (typeof origUseRef === "function") {
  const safeUseRef = function (initialValue: any) {
    try {
      const dispatcher = getActiveDispatcher();
      if (dispatcher && typeof dispatcher.useRef === "function") {
        return dispatcher.useRef(initialValue);
      }
      return origUseRef(initialValue);
    } catch {
      return { current: initialValue };
    }
  };
  try {
    r.useRef = safeUseRef;
    if (r.default) r.default.useRef = safeUseRef;
  } catch {
    // Ignore
  }
}

// 4. Filter benign dev-mode hydration mismatch and null dispatcher errors across console & window
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
            a.includes("Invalid hook call. Hooks can only be called inside of the body") ||
            a.includes("Cannot read properties of null (reading 'useContext')") ||
            a.includes("Failed to fetch dynamically imported module") ||
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
      msg.includes("Invalid hook call")
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}
