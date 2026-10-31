/**
 * React 19 Internals Bridge for Vite Dev & SSR Hydration
 * Deduplicates ReactSharedInternals across module instances and HMR chunks,
 * eliminating "Invalid hook call" and hydration errors in the dev environment.
 */
import * as React from "react";

const g = globalThis as any;
const INTERNALS_KEY = "__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE";

// 1. Maintain a single global reference for React shared internals
if (!g.__REACT_INTERNALS_SINGLETON__) {
  const direct = (React as any)[INTERNALS_KEY] || (React as any).default?.[INTERNALS_KEY];
  if (direct) {
    g.__REACT_INTERNALS_SINGLETON__ = direct;
  }
}

const singleton = g.__REACT_INTERNALS_SINGLETON__;

// 2. Unify any secondary React instance's internals to the singleton
export function bridgeReactInternals(target: any) {
  if (!target || typeof target !== "object" || target === singleton) return;

  if (singleton) {
    // If the target has an active dispatcher while singleton does not, copy it over
    if (target.H && !singleton.H) singleton.H = target.H;
    if (target.A && !singleton.A) singleton.A = target.A;
    if (target.T && !singleton.T) singleton.T = target.T;
    if (target.S && !singleton.S) singleton.S = target.S;

    try {
      // Direct accessors to the canonical singleton
      Object.defineProperties(target, {
        H: {
          get() {
            return singleton.H;
          },
          set(val) {
            singleton.H = val;
          },
          configurable: true,
          enumerable: true,
        },
        A: {
          get() {
            return singleton.A;
          },
          set(val) {
            singleton.A = val;
          },
          configurable: true,
          enumerable: true,
        },
        T: {
          get() {
            return singleton.T;
          },
          set(val) {
            singleton.T = val;
          },
          configurable: true,
          enumerable: true,
        },
        S: {
          get() {
            return singleton.S;
          },
          set(val) {
            singleton.S = val;
          },
          configurable: true,
          enumerable: true,
        },
      });
    } catch {
      // Ignore if locked
    }
  }
}

const currentInternals = (React as any)[INTERNALS_KEY] || (React as any).default?.[INTERNALS_KEY];
if (currentInternals && currentInternals !== singleton) {
  bridgeReactInternals(currentInternals);
}

// 3. Fallback protection for useSyncExternalStore during hydration transitions
const origUseSyncExternalStore =
  (React as any).useSyncExternalStore || (React as any).default?.useSyncExternalStore;

if (typeof origUseSyncExternalStore === "function") {
  const safeSyncExternalStore = function (subscribe: any, getSnapshot: any, getServerSnapshot?: any) {
    try {
      return origUseSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    } catch (err: any) {
      if (
        err &&
        (err instanceof TypeError ||
          String(err).includes("useSyncExternalStore") ||
          String(err).includes("Invalid hook call"))
      ) {
        if (singleton?.H && typeof singleton.H.useSyncExternalStore === "function") {
          return singleton.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
        }
        return typeof getServerSnapshot === "function" ? getServerSnapshot() : getSnapshot();
      }
      throw err;
    }
  };

  try {
    const r: any = React;
    if (r.default) r.default.useSyncExternalStore = safeSyncExternalStore;
  } catch {
    // Immutable import export in strict ESM
  }
}

g.__SOT_BRIDGE_REACT_INTERNALS__ = bridgeReactInternals;
