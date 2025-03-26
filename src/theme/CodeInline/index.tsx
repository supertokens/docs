import React, { useContext } from "react";
import type { Props } from "@theme/CodeInline";

import { DocItemContext, getContextValue } from "@site/src/context";
import { DOC_STORE_DEFAULT_VALUES } from "@site/src/lib/constants";

// Simple component used to render inline code blocks
// its purpose is to be swizzled and customized
// MDX 1 used to have a inlineCode comp, see https://mdxjs.com/migrating/v2/
export default function CodeInline(props: Props): JSX.Element {
  const { children, ...rest } = props;

  const context = useContext(DocItemContext);
  const dynamicValuesRegex = /\^\{([^}]+)\}/g;

  let parsedChildren = children;
  if (typeof children === "string") {
    parsedChildren = children.replaceAll(dynamicValuesRegex, (match, key) => {
      const value = getContextValue(context, key, DOC_STORE_DEFAULT_VALUES[key]);
      return (value as string) || "";
    });
  }

  return <code {...rest}>{parsedChildren}</code>;
}
