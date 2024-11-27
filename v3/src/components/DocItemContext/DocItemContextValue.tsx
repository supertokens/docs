import { createContext, PropsWithChildren, useContext, useState } from "react";
import { DocItemContext } from "./DocItemContext";

export function DocItemContextValue({
  propertyPath,
}: {
  propertyPath: string;
}) {
  const context = useContext(DocItemContext);

  return getContextValue(context, propertyPath);
}

export function getContextValue(
  obj: Record<string, unknown>,
  key: string,
  log = false,
): unknown {
  if (!key) return "";
  if (!obj) return "";
  const keys = key.split(".");
  let current = obj;

  if (keys.length === 1) return obj[keys[0]];

  // @ts-expect-error
  current = current[keys[0]];
  return getContextValue(current, keys.slice(1).join("."), log);
}
