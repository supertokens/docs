import { createHash } from "node:crypto";
import { realpath, writeFile } from "node:fs/promises";
import path from "node:path";

import { emptyDir, ensureDir } from "fs-extra";

import { getFenceMetadataViolations, isExcludedFromChecking } from "./code-blocks/exclusions";
import { extractCodeBlocksFromPaths, resolveMarkdownSourcePaths, type ExtractedCodeBlock } from "./code-blocks/extract";
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
  inputs?: readonly string[];
}

export function transformCodeBlock(block: ExtractedCodeBlock, relativePath: string): string {
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
    const sourceIdentity = `${relativePath.split(path.sep).join("/")}:${block.sourceLine}`;
    const suffix = createHash("sha256").update(sourceIdentity).digest("hex").slice(0, 12);
    value = value.replace("NetworkManager", `NetworkManager${suffix}`);
    value = value.replace("MainApplication", `MainApplication${suffix}`);
  }

  for (const replacement of replacements) {
    value = value.replaceAll(replacement[0], replacement[1]);
  }

  return value;
}

export async function writeCodeBlocks(options: WriteCodeBlocksOptions = {}): Promise<void> {
  if (options.inputs?.length === 0) return;

  const docsRoot = await realpath(path.resolve(options.docsRoot ?? path.join(process.cwd(), "docs")));
  const outputRoot = options.outputRoot ?? path.join(process.cwd(), "scripts/code-type-checking");
  const sourcePaths = await resolveMarkdownSourcePaths(options.inputs ?? [docsRoot]);
  const relativePaths = new Map<string, string>();

  for (const sourcePath of sourcePaths) {
    const relativePath = path.relative(docsRoot, sourcePath);
    if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
      throw new Error(`${sourcePath}: source must be inside ${docsRoot}`);
    }
    relativePaths.set(sourcePath, relativePath);
  }

  const codeBlocks = await extractCodeBlocksFromPaths(sourcePaths);

  for (const block of codeBlocks) {
    const [metadataViolation] = getFenceMetadataViolations(block.meta);
    if (metadataViolation) throw new Error(`${block.sourcePath}:${block.sourceLine}: ${metadataViolation}`);
  }

  await Promise.all(compilableLanguageFolders.map((folder) => emptyDir(path.join(outputRoot, folder, "snippets"))));

  const counts: Record<string, number> = {};
  for (const block of codeBlocks) {
    if (block.definition.kind !== "compilable") continue;
    if (isExcludedFromChecking(block)) continue;

    const relativePath = relativePaths.get(block.sourcePath);
    if (relativePath === undefined) throw new Error(`${block.sourcePath}: source path was not resolved`);
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
    await writeFile(codeBlockFilePath, transformCodeBlock(block, relativePath));
  }
}

if (import.meta.main) {
  const inputs = process.argv.slice(2);
  await writeCodeBlocks(inputs.length === 0 ? {} : { inputs });
}
