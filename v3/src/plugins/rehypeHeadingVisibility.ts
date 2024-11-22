import { visit } from "unist-util-visit";

/**
 * Rehype plugin that removes headings with data-attribute-visible="false"
 */
export default function rehypeHeadingVisibility() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      // Check if it's a heading element (h1-h6)
      if (
        node.tagName.match(/^h[1-6]$/)
        //   &&
        // node.properties &&
        // node.properties['data-attribute-visible'] === 'false'
      ) {
        console.log(node);
      }
    });
  };
}
