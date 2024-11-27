// remarkVariableNames.js
import { visit } from "unist-util-visit";

/**
 * Replaces {props.propName} value
 * with <DocItemContextValue propertyPath="propName" />
 * This way we can render dyanmic values that are set in DocItemContext
 */
export default function remarkDocItemContextValues() {
  return (tree) => {
    visit(tree, "mdxFlowExpression", (node) => {
      node.type = "mdxJsxFlowElement";
      node.name = "DocItemContextValue";
      const [, propertyPath] = node.value.split("props.");
      const propertyPathWithDotNotation = propertyPath.replaceAll(/_/g, ".");
      console.log(propertyPathWithDotNotation, propertyPath);

      node.attributes = [
        {
          type: "mdxJsxAttribute",
          name: "propertyPath",
          value: propertyPathWithDotNotation,
        },
      ];
      node.data = { _mdxExplicitJsx: true };
      node.children = [];
    });
  };
}
