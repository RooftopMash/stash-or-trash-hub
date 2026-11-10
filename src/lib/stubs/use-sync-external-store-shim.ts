import * as React from "react";

export function useSyncExternalStore<Snapshot>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot?: () => Snapshot,
): Snapshot {
  try {
    return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  } catch {
    return typeof getServerSnapshot === "function" ? getServerSnapshot() : getSnapshot();
  }
}

export default { useSyncExternalStore };
