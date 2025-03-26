import { useDocPageData } from "@site/src/hooks";
import { InferDotNotationKeys, DocPageState } from "../lib";

export function ConditionalContent({
  propertyName,
  condition,
  children,
}: React.PropsWithChildren<{ propertyName: InferDotNotationKeys<DocPageState>; condition: string }>) {
  const value = useDocPageData(propertyName);

  const meetsCondition = value === condition;
  if (!meetsCondition) return null;
  return <>{children}</>;
}
