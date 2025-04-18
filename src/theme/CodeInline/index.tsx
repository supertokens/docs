import React, { useContext } from "react";
import { Code } from "@radix-ui/themes";

import { DocItemContext, getContextValue } from "@site/src/context";
import { DOC_STORE_DEFAULT_VALUES } from "@site/src/lib/constants";

// Simple component used to render inline code blocks
// its purpose is to be swizzled and customized
// MDX 1 used to have a inlineCode comp, see https://mdxjs.com/migrating/v2/
export default function CodeInline(props: React.ComponentProps<typeof Code>) {
  const { children, color = "gray", ...rest } = props;

  const context = useContext(DocItemContext);
  const dynamicValuesRegex = /\^\{([^}]+)\}/g;

  let parsedChildren = children;
  if (typeof children === "string") {
    parsedChildren = children.replaceAll(dynamicValuesRegex, (match, key) => {
      const value = getContextValue(context, key, DOC_STORE_DEFAULT_VALUES[key]);
      return (value as string) || "";
    });
  }

  // Use a span because docusaurus default code styles conflict with radix-ui styles
  return (
    <Code {...rest} color={color} asChild>
      <span>{parsedChildren}</span>
    </Code>
  );
}
