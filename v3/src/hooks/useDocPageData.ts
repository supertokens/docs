import { useSyncExternalStore } from "react";
import { DocPageState, docPageStore, InferDotNotationKeys, InferDotNotationValue } from "../lib";

export function useDocPageData<T extends InferDotNotationKeys<DocPageState>>(path: T) {
  const selector = () => {
    return getObjectPropertyValue(docPageStore.getSnapshot(), path);
  };
  const value = useSyncExternalStore(docPageStore.subscribe.bind(docPageStore), selector);
  return value as InferDotNotationValue<DocPageState, T>;
}

function getObjectPropertyValue(obj: object, key: string): unknown {
  const keys = key.split(".");
  let current = obj;

  if (keys.length === 1) return obj[keys[0]];

  current = current[keys[0]];
  return getObjectPropertyValue(current, keys.slice(1).join("."));
}
