import { useContext } from "react";
import { DocItemContext, getContextValue } from "@site/src/context";

export function DocItemContextValue({ propertyPath }: { propertyPath: string }) {
  const context = useContext(DocItemContext);

  return getContextValue(context, propertyPath);
}
