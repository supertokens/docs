import { writeFile } from "node:fs/promises";
import path from "node:path";

import { emptyDir, ensureDir } from "fs-extra";

import { isExcludedFromTypeChecking } from "./code-blocks/exclusions";
import { scanCodeBlocks, type ExtractedCodeBlock } from "./code-blocks/extract";
import { compilableLanguageFolders } from "./code-blocks/languages";

const replacements: Array<[string, string]> = [
  ["^{derived.pythonContactMethodImport}", "from supertokens_python.recipe.passwordless import ContactEmailOnlyConfig"],
  ["^{derived.pythonContactMethodMethod}", "ContactEmailOnlyConfig"],
  ["^{derived.goPasswordlessContactMethodMethod}", "ContactMethodEmailConfig"],
  ["^{recipes.passwordless.contactMethod}", "EMAIL"],
  ["^{recipes.passwordless.flowType}", "MAGIC_LINK"],
];

export interface WriteCodeBlocksOptions {
  docsRoot?: string;
  outputRoot?: string;
}

export function isExcluded(block: ExtractedCodeBlock): boolean {
  return isExcludedFromTypeChecking(block.value);
}

export function transformCodeBlock(block: ExtractedCodeBlock, relativePath: string, blockIndex: number): string {
  if (block.definition.kind !== "compilable") {
    throw new Error(`Cannot transform render-only ${block.language} block at ${block.sourcePath}:${block.sourceLine}`);
  }

  let value = block.value;

  if (block.language === "go") {
    const segments = relativePath.replace(/\/+$/, "").split("/");
    const lastFolderName = segments.at(-1) ?? "";
    const nextToLastFolderName = segments.at(-2) ?? "";
    const packageName = `${nextToLastFolderName.replaceAll("-", "_")}_${lastFolderName
      .replaceAll("-", "_")
      .replace(/\.mdx?$/, "")}`;
    value = `package ${packageName}\n${value}`;
  }

  if (block.definition.folder === "javascript" && value.includes('<script lang="ts">')) {
    value = value.replace('<script lang="ts">', "");
    value = value.replace("</script>", "");
    value = value.replace("<template>", "");
    value = value.replace("</template>", "");
    value = value.replace('<div id="supertokensui" />', "");
  }

  if (block.definition.folder === "javascript") {
    value = `${value}\nexport {}`;
    value = value.replace(/supertokens-web-js-script/g, "supertokens-web-js");
    value = value.replace(/supertokens-website-script/g, "supertokens-website");
    value = value.replace(/supertokens-auth-react-script/g, "supertokens-auth-react");
  }

  if (block.language === "kotlin") {
    value = value.replace("NetworkManager", `NetworkManager${blockIndex}`);
    value = value.replace("MainApplication", `MainApplication${blockIndex}`);
  }

  for (const replacement of replacements) {
    value = value.replaceAll(replacement[0], replacement[1]);
  }

  return value;
}

export async function writeCodeBlocks(options: WriteCodeBlocksOptions = {}): Promise<void> {
  const docsRoot = options.docsRoot ?? path.join(process.cwd(), "docs");
  const outputRoot = options.outputRoot ?? path.join(process.cwd(), "scripts/code-type-checking");
  const codeBlocks = await scanCodeBlocks(docsRoot);

  await Promise.all(compilableLanguageFolders.map((folder) => emptyDir(path.join(outputRoot, folder, "snippets"))));

  const counts: Record<string, number> = {};
  let blockIndex = 0;

  for (const block of codeBlocks) {
    if (block.definition.kind !== "compilable") continue;
    if (isExcluded(block)) continue;

    blockIndex += 1;
    const relativePath = path.relative(docsRoot, block.sourcePath);
    const key = `${relativePath}/${block.definition.folder}`;
    const count = (counts[key] ?? 0) + 1;
    counts[key] = count;

    const codeBlockFilePath = path.join(
      outputRoot,
      block.definition.folder,
      "snippets",
      relativePath,
      `${count}-line-${block.sourceLine}`,
      `code-block.${block.definition.extension}`,
    );

    await ensureDir(path.dirname(codeBlockFilePath));
    await writeFile(codeBlockFilePath, transformCodeBlock(block, relativePath, blockIndex));
  }
}

if (import.meta.main) {
  await writeCodeBlocks();
}
