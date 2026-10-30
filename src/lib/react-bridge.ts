/**
 * React 19 Instance Bridge for Vite Dev & SSR Hydration
 * Unifies ReactSharedInternals across module instances in case Vite re-optimizes
 * dependencies during dev crawl, preventing "Invalid hook call" and dual-React errors.
 */
import * as React from "react";

const g = globalThis as any;

if (!g.__REACT_INTERNALS_STORAGE__) {
  g.__REACT_INTERNALS_STORAGE__ = {
    H: null,
    A: null,
    T: null,
    S: null,
  };
}

const storage = g.__REACT_INTERNALS_STORAGE__;

export function bridgeReactInternals(target: any) {
  if (!target || typeof target !== "object") return;

  // Preserve existing active dispatcher if target has one
  if (target.H && !storage.H) storage.H = target.H;
  if (target.A && !storage.A) storage.A = target.A;
  if (target.T && !storage.T) storage.T = target.T;
  if (target.S && !storage.S) storage.S = target.S;

  try {
    Object.defineProperties(target, {
      H: {
        get() {
          return storage.H;
        },
        set(val) {
          storage.H = val;
        },
        configurable: true,
        enumerable: true,
      },
      A: {
        get() {
          return storage.A;
        },
        set(val) {
          storage.A = val;
        },
        configurable: true,
        enumerable: true,
      },
      T: {
        get() {
          return storage.T;
        },
        set(val) {
          storage.T = val;
        },
        configurable: true,
        enumerable: true,
      },
      S: {
        get() {
          return storage.S;
        },
        set(val) {
          storage.S = val;
        },
        configurable: true,
        enumerable: true,
      },
    });
  } catch {
    // Ignore if properties already locked
  }
}

const internalsKey = "__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE";
const reactObj: any = React;
const directInternals = reactObj[internalsKey] || reactObj.default?.[internalsKey];
if (directInternals) {
  bridgeReactInternals(directInternals);
}

// Keep direct pointer in global in case secondary instances load later
g.__SOT_BRIDGE_REACT_INTERNALS__ = bridgeReactInternals;
