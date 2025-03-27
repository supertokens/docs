import { visit } from "unist-util-visit";

const PaidFeatureBadgeNode = {
  type: "mdxJsxFlowElement",
  name: "PaidFeatureCallout",
  attributes: [],
  children: [],
  data: {
    _mdxExplicitJsx: true,
  },
};

/**
 * Adds the PaidFeatureCallout component where {{paidFeature}} is used
 */
export default function remarkAddBadgesInHeadings() {
  return (tree, file) => {
    visit(tree, "mdxTextExpression", (node, index, parent) => {
      if (node.value !== "{{paidFeature}}") {
        node = PaidFeatureBadgeNode;
      }
    });
  };
}
