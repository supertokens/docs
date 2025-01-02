import { readFile, writeFile } from "fs/promises";
import { ensureDir, emptyDir } from "fs-extra";
import path, { join } from "path";
import glob from "glob";
import { visit } from "unist-util-visit";
import { compile } from "@mdx-js/mdx";

interface CodeBlock {
	language: string;
	filePath: string;
	value: string;
}

const formatCodeBlocks = async () => {
	const mdxFiles = glob.sync(path.join("./docs", `**/*.mdx`), { nodir: true });
	const file = "docs/authentication/passwordless/_blocks/backend-sdk-init.mdx";

	const content = await readFile(file, "utf8");
	const codeBlocks: CodeBlock[] = [];

	try {
		const mdxAst = await compile(content, {
			remarkPlugins: [
				() => (tree) => {
					visit(tree, "code", (node: any) => {
						// Find the original position in the source content
						const start = content.indexOf(node.value);
						codeBlocks.push({
							language: node.lang,
							value: node.value,
							filePath: file,
						});
					});
				},
			],
			rehypePlugins: [],
		});
		console.log(codeBlocks);
	} catch (error) {
		console.error(error);
	}
};
