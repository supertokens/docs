// remarkVariableNames.js
import { visit } from "unist-util-visit";

export default function remarkDocItemContextValues() {
  return (tree) => {
    // console.log(tree);
    visit(tree, "mdxJsxFlowElement", (node) => {
      console.log(node);
    });
    visit(tree, "mdxFlowExpression", (node) => {
      // regex to match {^property.path} pattern
      console.log(node);
      node.type = "mdxJsxFlowElement";
      node.name = "DocItemContextValue";
      const [, propertyPath] = node.value.split("props.");
      console.log(propertyPath);
      node.attributes = [
        { type: "mdxJsxAttribute", name: "propertyPath", value: propertyPath },
      ];
      node.data = { _mdxExplicitJsx: true };
      node.children = [];
      console.log(node);
      // const variableRegex = /\{\^([^}]+)\}/g;
      // const parts = [];
      // let lastIndex = 0;
      // let match;
      //
      // // Find all matches in the text node
      // while ((match = variableRegex.exec(node.value)) !== null) {
      //   // Add text before the match
      //   if (match.index > lastIndex) {
      //     parts.push({
      //       type: "text",
      //       value: node.value.slice(lastIndex, match.index),
      //     });
      //   }
      //
      //   // Add the MDX component node
      //   parts.push({
      //     type: "mdxJsxTextElement",
      //     name: "DocItemContextValue",
      //     attributes: [
      //       {
      //         type: "mdxJsxAttribute",
      //         name: "propertyPath",
      //         value: match[1],
      //       },
      //     ],
      //     children: [],
      //   });
      //
      //   lastIndex = match.index + match[0].length;
      // }
      //
      // // Add any remaining text
      // if (lastIndex < node.value.length) {
      //   parts.push({
      //     type: "text",
      //     value: node.value.slice(lastIndex),
      //   });
      // }
      //
      // // Only replace the node if we found any variables
      // if (parts.length > 0) {
      //   node.type = "mdxJsxTextElement";
      //   node.name = "fragment";
      //   node.attributes = [];
      //   node.children = parts;
      // }
    });
  };
}
