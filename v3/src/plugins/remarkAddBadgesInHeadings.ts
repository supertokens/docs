import { visit } from "unist-util-visit";

const OptionalBadgeNode = {
  type: "mdxJsxFlowElement",
  name: "span",
  attributes: [
    {
      type: "mdxJsxAttribute",
      name: "class",
      value: "rt-reset rt-Badge rt-r-size-3 rt-variant-soft rt-high-contrast",
    },
    {
      type: "mdxJsxAttribute",
      name: "data-accent-color",
      value: "gray",
    },
    {
      type: "mdxJsxAttribute",
      name: "data-radius",
      value: "full",
    },
    // {
    //   type: "mdxJsxAttribute",
    //   name: "style",
    //   value: { verticalAlign: "middle", marginLeft: "var(--space-1)" },
    // },
  ],
  children: [
    {
      type: "text",
      value: "Optional",
    },
  ],
  data: {
    _mdxExplicitJsx: true,
  },
};

const PaidFeatureBadgeNode = {
  type: "mdxJsxFlowElement",
  name: "PaidFeatureBadge",
  attributes: [],
  children: [],
  data: {
    _mdxExplicitJsx: true,
  },
};

/**
 * Adds an optional badge to headings that have the {{optional}} property
 */
export default function remarkAddBadgesInHeadings() {
  return (tree, file) => {
    visit(tree, "heading", (node, index, parent) => {
      node.children = node.children.map((child) => {
        if (child.type === "mdxTextExpression" && child.value === "{optional}") {
          child = OptionalBadgeNode;
        }
        if (child.type === "mdxTextExpression" && child.value === "{paidFeature}") {
          child = PaidFeatureBadgeNode;
        }
        return child;
      });
    });
  };
}
