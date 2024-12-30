import { readFile, writeFile } from "fs/promises";
import { ensureDir, emptyDir } from "fs-extra";
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
	csharp: "csharp",
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
			block.languageFolder,
			"snippets",
			relativePath,
			`${index}/code-block.${block.extension}`,
		);

		await ensureDir(path.dirname(codeBlockFilePath));

		let parsedBlockValue = block.value;
		if (block.language === "go") {
			const cleanPath = relativePath.replace(/\/+$/, "");
			const segments = cleanPath.split("/");
			const lastFolderName = segments[segments.length - 1] || "";
			const nextToLastFolderName = segments[segments.length - 2] || "";
			const packageName = `${nextToLastFolderName.replaceAll("-", "_")}_${lastFolderName.replaceAll("-", "_").replace(".mdx", "")}`;
			parsedBlockValue = `package ${packageName}\n${parsedBlockValue}`;
		}
		await writeFile(codeBlockFilePath, parsedBlockValue);
	}
}

(async () => {
	await writeCodeBlocks();
})();

// Removes custom header ids {#header-id} from the content
function cleanMarkdownHeaders(markdown: string): string {
	return markdown.replace(/^(#{1,6}\s+.*?)\s*(\{#[\w-]+\})?$/gm, "$1");
}

async function removeExistingSnippets() {
	for (const languageFolder of Object.values(LanguageFoldersMap)) {
		const folderPath = `./scripts/code-type-checking/${languageFolder}/snippets`;
		await emptyDir(folderPath);
	}
}
