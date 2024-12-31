import { visit } from "unist-util-visit";

/**
 * Removes *-web-js-script and *-auth-react-script imports from ts files
 * Also adds window.* to specific lines in Angular and Vue code samples
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
			let filteredLines = lines.filter((line) => {
				return (
					!line.includes("supertokens-web-js-script") &&
					!line.includes("supertokens-auth-react-script")
				);
			});

			const mappedLines = filteredLines.map((line) => {
				if (
					line.startsWith("supertokensUIInit") ||
					line.startsWith("supertokensUIThirdParty") ||
					line.startsWith("supertokensUIEmailPassword") ||
					line.startsWith("supertokensUIPasswordless") ||
					line.startsWith("supertokensUIOAuth2Provider") ||
					line.startsWith("supertokensUISession")
				)
					return `(window as any).${line}`;

				return line;
			});

			node.value = mappedLines.join("\n");
		});
	};
}
