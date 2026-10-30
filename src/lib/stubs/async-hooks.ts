/**
 * Browser-safe stub for node:async_hooks / async_hooks
 * Prevents "AsyncLocalStorage is not a constructor" when server-oriented
 * libraries or wrappers are evaluated in browser/client environments.
 */

export class AsyncLocalStorage<T = any> {
  private _store: T | undefined = undefined;

  getStore(): T | undefined {
    return this._store;
  }

  run<R>(store: T, fn: (...args: any[]) => R, ...args: any[]): R {
    const prev = this._store;
    this._store = store;
    try {
      return fn(...args);
    } finally {
      this._store = prev;
    }
  }

  exit<R>(fn: (...args: any[]) => R, ...args: any[]): R {
    const prev = this._store;
    this._store = undefined;
    try {
      return fn(...args);
    } finally {
      this._store = prev;
    }
  }

  enterWith(store: T): void {
    this._store = store;
  }

  disable(): void {
    this._store = undefined;
  }

  bind<F extends (...args: any[]) => any>(fn: F): F {
    return fn;
  }

  static bind<F extends (...args: any[]) => any>(fn: F): F {
    return fn;
  }

  static snapshot(): <R>(fn: (...args: any[]) => R, ...args: any[]) => R {
    return (fn, ...args) => fn(...args);
  }
}

export class AsyncResource {
  type: string;
  constructor(type: string) {
    this.type = type;
  }
  emitBefore() { return true; }
  emitAfter() { return true; }
  emitDestroy() { return this; }
  asyncId() { return 1; }
  triggerAsyncId() { return 0; }
  runInAsyncScope<R>(fn: (...args: any[]) => R, thisArg?: any, ...args: any[]): R {
    return fn.apply(thisArg, args);
  }
  bind<F extends (...args: any[]) => any>(fn: F): F {
    return fn;
  }
}

export function createHook() {
  return {
    enable() { return this; },
    disable() { return this; },
  };
}

export function executionAsyncId() { return 1; }
export function triggerAsyncId() { return 0; }
export function executionAsyncResource() { return {}; }

export default {
  AsyncLocalStorage,
  AsyncResource,
  createHook,
  executionAsyncId,
  triggerAsyncId,
  executionAsyncResource,
};
