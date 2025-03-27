import { visit } from "unist-util-visit";

/**
 * Renders the frontmatter description as a subtitle
 */
export default function remarkDocItemDescription() {
  return (tree, file) => {
    const renderDescription = file.data.frontMatter.renderDescription;
    if (renderDescription === false) return;
    const description = file.data.frontMatter.description;
    if (!description) return;
    const filePath = file.history[0];
    // TODO: Remove this after we go through all the docs
    const validPaths = [
      "authentication/email-password",
      "authentication/passwordless",
      "authentication/social",
      "authentication/enterprise",
    ];
    if (!validPaths.some((path) => filePath.includes(path))) return;
    visit(tree, "mdxJsxFlowElement", (node, index, parent) => {
      if (node.name !== "header") return;
      const descriptionNode = {
        type: "mdxJsxFlowElement",
        name: "p",
        attributes: [
          // {
          //   type: "mdxJsxAttribute",
          //   name: "data-accent-color",
          //   value: "gray",
          // },
          {
            type: "mdxJsxAttribute",
            name: "class",
            value: "rt-Text rt-r-size-5 page-subtitle",
          },
        ],
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                value: description,
              },
            ],
          },
        ],
        data: {
          _mdxExplicitJsx: true,
        },
      };

      const separatorNode = {
        type: "mdxJsxFlowElement",
        name: "span",
        attributes: [
          {
            type: "mdxJsxAttribute",
            name: "data-accent-color",
            value: "gray",
          },
          {
            type: "mdxJsxAttribute",
            name: "class",
            value: "rt-Separator rt-r-orientation-horizontal rt-r-size-4 rt-r-mt-2 rt-r-mb-6",
          },
        ],
        children: [],
        data: {
          _mdxExplicitJsx: true,
        },
      };

      node.children.push(descriptionNode, separatorNode);
    });
  };
}
