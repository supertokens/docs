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

const Replacements: Array<[string, string]> = [
  ["^{derived.pythonContactMethodImport}", "from supertokens_python.recipe.passwordless import ContactEmailOnlyConfig"],
  ["^{derived.pythonContactMethodMethod}", "ContactEmailOnlyConfig"],
  ["^{derived.goPasswordlessContactMethodMethod}", "ContactMethodEmailConfig"],
  ["^{recipes.passwordless.contactMethod}", "EMAIL"],
  ["^{recipes.passwordless.flowType}", "MAGIC_LINK"],
];
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

  let blockIndex = 0;
  for (const block of codeBlocks) {
    if (
      block.value.startsWith("// exclude-from-type-checking") ||
      block.value.startsWith("# exclude-from-type-checking")
    )
      continue;
    blockIndex += 1;
    const relativePath = path.relative("./docs", block.filePath);
    const key = `${relativePath}/${block.languageFolder}`;
    let numberOfCodeBlocksFromTheSameLanguageInAFile = countOfSameLanguageBlocksInAFile[key] || 1;
    if (countOfSameLanguageBlocksInAFile[key]) {
      numberOfCodeBlocksFromTheSameLanguageInAFile += 1;
    }
    countOfSameLanguageBlocksInAFile[key] = numberOfCodeBlocksFromTheSameLanguageInAFile;
    const codeBlockFilePath = path.join(
      "./scripts/code-type-checking/",
      block.languageFolder,
      "snippets",
      relativePath,
      `${numberOfCodeBlocksFromTheSameLanguageInAFile}/code-block.${block.extension}`,
    );

    await ensureDir(path.dirname(codeBlockFilePath));

    // Generate unique package names for go folders
    let parsedBlockValue = block.value;
    if (block.language === "go") {
      const cleanPath = relativePath.replace(/\/+$/, "");
      const segments = cleanPath.split("/");
      const lastFolderName = segments[segments.length - 1] || "";
      const nextToLastFolderName = segments[segments.length - 2] || "";
      const packageName = `${nextToLastFolderName.replaceAll("-", "_")}_${lastFolderName.replaceAll("-", "_").replace(".mdx", "")}`;
      parsedBlockValue = `package ${packageName}\n${parsedBlockValue}`;
    }

    // Remove xml tags from vue files
    if (block.languageFolder === "javascript" && parsedBlockValue.includes('<script lang="ts">')) {
      parsedBlockValue = parsedBlockValue.replace('<script lang="ts">', "");
      parsedBlockValue = parsedBlockValue.replace("</script>", "");
      parsedBlockValue = parsedBlockValue.replace("<template>", "");
      parsedBlockValue = parsedBlockValue.replace("</template>", "");
      parsedBlockValue = parsedBlockValue.replace('<div id="supertokensui" />', "");
    }

    // Prevent typescript for complaining about vairables with the same name
    if (block.languageFolder === "javascript") {
      parsedBlockValue = `${parsedBlockValue}\nexport {}`;

      // Overwrite "script" imports
      parsedBlockValue = parsedBlockValue.replace(/supertokens-web-js-script/g, "supertokens-web-js");
      parsedBlockValue = parsedBlockValue.replace(/supertokens-website-script/g, "supertokens-website");
      parsedBlockValue = parsedBlockValue.replace(/supertokens-auth-react-script/g, "supertokens-auth-react");
    }

    // Generate unique class names for kotlin files
    if (block.language === "kotlin") {
      parsedBlockValue = parsedBlockValue.replace("NetworkManager", `NetworkManager${blockIndex}`);
      parsedBlockValue = parsedBlockValue.replace("MainApplication", `MainApplication${blockIndex}`);
    }

    for (const replacement of Replacements) {
      parsedBlockValue = parsedBlockValue.replaceAll(replacement[0], replacement[1]);
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
