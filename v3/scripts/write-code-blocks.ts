import { readFile, writeFile } from "fs/promises";
import { ensureDir, copy } from "fs-extra";
import path, { join } from "path";
import glob from "glob";
import { visit } from "unist-util-visit";
import { compile } from "@mdx-js/mdx";

interface CodeBlock {
	language: string;
	languageFolder: string;
	extension: string;
	filePath: string;
	value: string;
}

const LanguageFoldersMap = {
	ts: "javascript",
	tsx: "javascript",
	typescript: "javascript",
	js: "javascript",
	javascript: "javascript",
	go: "go",
	py: "python",
	python: "python",
	kotlin: "kotlin",
	swift: "swift",
	dart: "dart",
	php: "php",
	java: "java",
	csharp: "c#",
};

const LanguageExtensionsMap = {
	ts: "ts",
	tsx: "tsx",
	typescript: "ts",
	js: "js",
	go: "go",
	py: "py",
	python: "py",
	kotlin: "kt",
	swift: "swift",
	dart: "kt",
	php: "php",
	java: "java",
	csharp: "cs",
};

const SkipLanguages = ["text", "json", "bash", "html", "yaml", "sql", "batch"];

async function writeCodeBlocks() {
	const mdxFiles = glob.sync(path.join("./docs", `**/*.mdx`), { nodir: true });

	const codeBlocks: CodeBlock[] = [];
	for (const file of mdxFiles) {
		const content = await readFile(file, "utf8");
		const parsedContent = cleanMarkdownHeaders(content);

		try {
			await compile(parsedContent, {
				remarkPlugins: [
					() => (tree) => {
						visit(tree, "code", (node: any) => {
							const languageFolder = LanguageFoldersMap[node.lang];
							const extension = LanguageExtensionsMap[node.lang];
							if (SkipLanguages.includes(node.lang)) return;
							if (!languageFolder || !extension) {
								console.error(node.value);
								throw new Error(`${node.lang} language not found`);
							}
							codeBlocks.push({
								language: node.lang,
								languageFolder,
								extension,
								value: node.value,
								filePath: file,
							});
						});
					},
				],
				rehypePlugins: [],
			});
		} catch (e) {
			console.error(`Unable to process ${file}`);
			console.error(e);
		}
	}

	const countOfSameLanguageBlocksInAFile: Record<string, number> = {};

	for (const block of codeBlocks) {
		const relativePath = path.relative("./docs", block.filePath);
		let index = 1;
		const key = `${relativePath}/${block.languageFolder}`;
		if (countOfSameLanguageBlocksInAFile[key]) {
			index += 1;
		}
		countOfSameLanguageBlocksInAFile[key] = index;
		const codeBlockFilePath = path.join(
			"./scripts/code-type-checking/",
			block.language,
			"snippets",
			relativePath,
			`${index}.${block.extension}`,
		);

		await ensureDir(path.dirname(codeBlockFilePath));

		await writeFile(codeBlockFilePath, block.value);
	}
}

(async () => {
	await writeCodeBlocks();
})();

// Removes custom header ids {#header-id} from the content
function cleanMarkdownHeaders(markdown: string): string {
	return markdown.replace(/^(#{1,6}\s+.*?)\s*(\{#[\w-]+\})?$/gm, "$1");
}
