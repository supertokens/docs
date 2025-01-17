import { visit } from "unist-util-visit";

/**
 * Removes additional rows that are used only for code type checking
 * Things like: # type: ignore
 *
 */
export default function remarkRemoveCodeTypeCheckingCommentsAndRows() {
	return (tree) => {
		visit(tree, "code", (node) => {
			const lines = node.value.split("\n");
			const filteredLines = lines.filter((line) => {
				return (
					!line.includes("REMOVE_FROM_OUTPUT") &&
					!line.includes("@ts-expect-error") &&
					!line.includes("@ts-ignore")
				);
			});
			const parsedLines = filteredLines.map((line) => {
				return line.replaceAll("# type: ignore", "");
			});

			node.value = parsedLines.join("\n");
		});
	};
}
