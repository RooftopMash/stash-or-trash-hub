/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
import * as React from "react";

function is(x: any, y: any) {
  return (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);
}

const objectIs = typeof Object.is === "function" ? Object.is : is;

export function useSyncExternalStoreWithSelector<Snapshot, Selection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => Snapshot,
  getServerSnapshot: undefined | null | (() => Snapshot),
  selector: (snapshot: Snapshot) => Selection,
  isEqual?: (a: Selection, b: Selection) => boolean,
): Selection {
  const instRef = React.useRef<{
    hasValue: boolean;
    value: Selection;
  } | null>(null);

  if (instRef.current === null) {
    instRef.current = {
      hasValue: false,
      value: undefined as any,
    };
  }
  const inst = instRef.current;

  const [getSelection, getServerSelection] = React.useMemo(() => {
    let hasMemo = false;
    let memoizedSnapshot: Snapshot;
    let memoizedSelection: Selection;

    const memoizedSelector = (nextSnapshot: Snapshot): Selection => {
      if (!hasMemo) {
        hasMemo = true;
        memoizedSnapshot = nextSnapshot;
        const nextSelection = selector(nextSnapshot);
        if (isEqual !== undefined && inst.hasValue) {
          if (isEqual(inst.value, nextSelection)) {
            return (memoizedSelection = inst.value);
          }
        }
        return (memoizedSelection = nextSelection);
      }
      if (objectIs(memoizedSnapshot, nextSnapshot)) {
        return memoizedSelection;
      }
      const nextSelection = selector(nextSnapshot);
      if (isEqual !== undefined && isEqual(memoizedSelection, nextSelection)) {
        memoizedSnapshot = nextSnapshot;
        return memoizedSelection;
      }
      memoizedSnapshot = nextSnapshot;
      return (memoizedSelection = nextSelection);
    };

    const maybeGetServerSnapshot =
      getServerSnapshot === undefined ? null : getServerSnapshot;

    return [
      () => memoizedSelector(getSnapshot()),
      maybeGetServerSnapshot === null
        ? undefined
        : () => memoizedSelector(maybeGetServerSnapshot()),
    ];
  }, [getSnapshot, getServerSnapshot, selector, isEqual]);

  let value: Selection;
  try {
    value = React.useSyncExternalStore(subscribe, getSelection, getServerSelection);
  } catch {
    value = getServerSelection ? getServerSelection() : getSelection();
  }

  React.useEffect(() => {
    inst.hasValue = true;
    inst.value = value;
  }, [value]);

  React.useDebugValue(value);
  return value;
}

export default { useSyncExternalStoreWithSelector };
