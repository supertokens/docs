import React, { useContext } from "react";
import type { Props } from "@theme/CodeInline";
import {
  DocItemContext,
  getContextValue,
} from "@site/src/components/DocItemContext";

// Simple component used to render inline code blocks
// its purpose is to be swizzled and customized
// MDX 1 used to have a inlineCode comp, see https://mdxjs.com/migrating/v2/
export default function CodeInline({ children, ...rest }: Props): JSX.Element {
  const context = useContext(DocItemContext);
  const dynamicValuesRegex = /\^\{([^}]+)\}/g;

  let parsedChildren = children;
  if (typeof children === "string") {
    parsedChildren = children.replaceAll(dynamicValuesRegex, (match, key) => {
      const value = getContextValue(context, key);
      return value as string;
    });
  }
  return <code {...rest}>{parsedChildren}</code>;
}
