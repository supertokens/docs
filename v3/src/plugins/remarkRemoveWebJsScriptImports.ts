import { visit } from "unist-util-visit";

/**
 * Removes *-web-js-script and *-auth-react-script imports from ts files
 * Also adds window.supertokensUIInit for Angular and Vue code samples
 *
 * For code snippets that use our JS SDK from scripts
 * we add custom imports in the docs CodeBlocks.
 * This is done to prevent errors in the code type checking process.
 */
export default function remarkRemoveWebJsScriptImports() {
	return (tree) => {
		visit(tree, "code", (node) => {
			const targetedLanguages = ["tsx", "ts", "typescript"];
			if (!targetedLanguages.includes(node.lang)) return;

			const lines = node.value.split("\n");
			const filteredLines = lines.filter((line) => {
				return (
					!line.includes("supertokens-web-js-script") &&
					!line.includes("supertokens-auth-react-script")
				);
			});

			const mappedLines = filteredLines.map((line) => {
				if (line.startsWith("supertokensUIInit"))
					return `(window as any).${line}`;
				return line;
			});

			node.value = mappedLines.join("\n");
		});
	};
}
