import { useSyncExternalStore } from "react";

/**
 * Data store that is used to syncronize
 * the state of different selection components across the app.
 * Example: <NpmOrScriptsCard />
 *
 * If you want to also syncronize the state to local storage
 * keep in mind that you will have to use string values.
 */
type SelectionStoreValue = {
  subscribers: Set<() => void>;
  value: unknown;
};

const LocalStorageKeyPrefix = "selection-store";
const SelectionStore: Map<string, SelectionStoreValue> = new Map();

const getLocalStorageKey = (selectionName: string) => `${LocalStorageKeyPrefix}-${selectionName}`;
const subscribe =
  (selectionName: string, initialValue: unknown, useLocalStorage: boolean) => (callback: () => void) => {
    if (!SelectionStore.has(selectionName)) {
      let value = initialValue;
      if (useLocalStorage) {
        const localStorageValue = localStorage.getItem(getLocalStorageKey(selectionName));
        if (localStorageValue !== undefined) value = localStorageValue;
      }
      SelectionStore.set(selectionName, {
        subscribers: new Set(),
        value: value,
      });
    } else {
      SelectionStore.get(selectionName).subscribers.add(callback);
    }
    return () => {
      SelectionStore.get(selectionName).subscribers.delete(callback);
    };
  };

const getSnapshot = (selectionName: string) => () => {
  if (!SelectionStore.has(selectionName)) {
    return undefined;
  }
  return SelectionStore.get(selectionName).value;
};

export function useSelectionStore<T>(selectionName: string, initialValue: T, useLocalStorage = false) {
  const store = useSyncExternalStore(
    subscribe(selectionName, initialValue, useLocalStorage),
    getSnapshot(selectionName),
    () => initialValue,
  );

  const set = (value: T) => {
    if (!SelectionStore.has(selectionName)) {
      throw new Error("Selection does not exist");
    }
    SelectionStore.get(selectionName).value = value;
    localStorage.setItem(getLocalStorageKey(selectionName), JSON.stringify(value));
    SelectionStore.get(selectionName).subscribers.forEach((callback) => callback());
  };

  return [store, set] as [T, (value: T) => void];
}
