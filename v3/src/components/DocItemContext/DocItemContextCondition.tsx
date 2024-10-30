import { useContext } from "react";
import { DocItemContext } from "./DocItemContext";
import { DocsItemStateType } from "./DocItemStore";

export function ContextCondition({
  condition,
  children,
}: {
  condition: (state: DocsItemStateType) => boolean;
  children: React.ReactNode;
}) {
  const state = useContext(DocItemContext);
  const matches = condition(state);

  if (!matches) return null;
  return <>{children}</>;
}
