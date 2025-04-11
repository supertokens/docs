import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllMdxFiles } from "./utils/getAllMdxFiles";

async function extractImportStatements(content: string): Promise<{ name: string; module: string; index: number }[]> {
  const imports: Array<{ name: string; module: string; index: number }> = [];
  const importPattern = /import\s+(?:(?:{[\s\S]*?})|(?:[\w*]+))\s+from\s+['"]([^'"]+)['"]/g;

  let match;
  while ((match = importPattern.exec(content)) !== null) {
    const importStatement = match[0];
    const modulePath = match[1];
    const index = match[2];

    if (importStatement.includes("{")) {
      const namedMatch = importStatement.match(/import\s+{([\s\S]*?)}\s+from/);
      if (namedMatch && namedMatch[1]) {
        const namedImportsText = namedMatch[1].replace(/\s*,\s*/g, ",").replace(/[\r\n]+\s*/g, "");

        const namedImports = namedImportsText
          .split(",")
          .map((name) => name.trim())
          .filter((name) => name.length > 0);

        for (const name of namedImports) {
          imports.push({
            name: name,
            module: modulePath,
            index,
          });
        }
      }
    } else {
      const defaultMatch = importStatement.match(/import\s+([\w*]+)\s+from/);
      if (defaultMatch && defaultMatch[1]) {
        const componentName = defaultMatch[1].trim();
        imports.push({
          name: componentName,
          module: modulePath,
          index,
        });
      }
    }
  }

  return imports.filter((item) => item.module.includes("src") || item.module.includes("_blocks"));
}

function extractMainTitle(mdxContent: string): {
  title: string;
  content: string;
} {
  const trimmedContent = mdxContent.trim();

  const h1Regex = /^#\s+(.+?)(?:\r?\n|$)/m;
  const h1Match = trimmedContent.match(h1Regex);

  if (h1Match) {
    const title = h1Match[1].trim();
    const content = trimmedContent.replace(h1Match[0], "").trim();

    return { title, content };
  }

  const lines = trimmedContent.split(/\r?\n/);
  let titleLine = "";
  let titleIndex = -1;
  const importRegex = /^import\s+.+from\s+['"].+['"];?$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || importRegex.test(line)) {
      continue;
    }

    titleLine = line;
    titleIndex = i;
    break;
  }

  let contentLines = [...lines];
  if (titleIndex >= 0) {
    contentLines.splice(titleIndex, 1);
  } else {
    titleLine = "Untitled Document";
  }

  return {
    title: titleLine,
    content: contentLines.join("\n").trim(),
  };
}

function removeImportStatements(content: string): string {
  const lines = content.split(/\r?\n/);
  let targetIndex = -1;
  const importRegex = /^import\s+.+from\s+['"].+['"];?$/;

  let insideMultilineImport = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      continue;
    }

    if (line.startsWith("import") && !line.includes(";")) {
      insideMultilineImport = true;
      continue;
    }

    if (insideMultilineImport && line.includes(";")) {
      insideMultilineImport = false;
      continue;
    }

    if (insideMultilineImport) {
      continue;
    }

    if (importRegex.test(line)) {
      continue;
    }

    targetIndex = i;
    break;
  }

  let contentLines = [...lines];
  if (targetIndex >= 0) {
    contentLines.splice(0, targetIndex);
  } else {
    console.warn("No import statements found in the MDX file. Returning the original content.");
  }

  return contentLines.join("\n").trim();
}

function removeReferences(content: string): string {
  const lines = content.split(/\r?\n/);

  const nextStepsIndex = lines.indexOf("## Next steps");
  if (nextStepsIndex >= 0) {
    lines.splice(nextStepsIndex, 1);
  }

  const seeAlsoIndex = lines.indexOf("## See also");
  if (seeAlsoIndex >= 0) {
    lines.splice(seeAlsoIndex, 1);
  }

  return lines.join("\n").trim();
}

async function parseMdxContent(filePath: string): Promise<string> {
  const mdxContent = await fs.promises.readFile(filePath, "utf8");
  const { content } = matter(mdxContent);
  const imports: Array<{ name: string; module: string }> = await extractImportStatements(content);

  const mdxBlocks = imports.filter((item) => item.module.includes("_blocks"));
  let processedContent = removeImportStatements(content);

  const dirPath = path.dirname(filePath);

  for (const block of mdxBlocks) {
    const blockPath = block.module.startsWith("/") ? `.${block.module}` : path.join(dirPath, block.module);
    const blockContent = await parseMdxContent(blockPath);
    processedContent = processedContent.replaceAll(`<${block.name} />`, blockContent);
  }

  const componentsToRemove: string[] = [
    "AppInfoForm",
    "UIType.Switch",
    "PaidFeatureCallout",
    "TokensCallout",
    "ExampleAppForm",
    "OAuthVerifyTokensCallout",
    "PasswordlessRecipeForm",
    "OAuthEmailVerificationCallout",
    "TokensCallout",
  ];
  const componentsToReplace: Record<string, string> = {
    "UIType.CustomUIContent": "CustomUIContent",
    "UIType.PrebuiltUIContent": "PrebuiltUIContent",
    FrontendCustomUITabs: "Tabs",
    FrontendPrebuiltUITabs: "Tabs",
    BackendTabs: "Tabs",
    NodePackageManagerCard: "Tabs",
    FrontendTabs: "Tabs",
    DatabaseTabs: "Tabs",
    JavascriptHttpLibraryCard: "Tabs",
    NpmOrScriptsCard: "Tabs",
    MobileFrameworksCard: "Tabs",
    CodeSampleCard: "Tabs",
    NodeFrameworksCard: "Tabs",
    GoFrameworksCard: "Tabs",
    PythonFrameworksCard: "Tabs",
    SelfHostingTabs: "Tabs",
    AccountTypeCard: "Tabs",
    PythonSyncAsyncCard: "Tabs",
  };

  for (const component in componentsToReplace) {
    processedContent = processedContent.replaceAll(component, componentsToReplace[component]);
  }

  processedContent = processedContent.replaceAll("Tabs.TabItem", "Tab");
  processedContent = processedContent.replaceAll("Tabs.Content", "Tab");

  for (const component in componentsToRemove) {
    processedContent = processedContent.replaceAll(`<${component} />`, "");
    processedContent = processedContent.replaceAll(`<${component}/>`, "");
  }

  processedContent = removeReferences(processedContent);
  processedContent = replaceVariables(processedContent);

  if (filePath.includes("_blocks")) {
    return processedContent.trim();
  }

  const { title, content: contentWithoutTitle } = extractMainTitle(processedContent);
  const filePathWithoutExtension = filePath.replace(/\.[^/.]+$/, "");
  const url = `https://supertokens.com/${filePathWithoutExtension}`;
  const parsedTitle = buildTitle(title, filePath);
  processedContent = `
# ${parsedTitle}
Source: ${url}

${contentWithoutTitle}
`;

  return processedContent.trim();
}

function replaceVariables(content: string): string {
  const variables = [
    ["^{appInfo.appName}", "<APP_NAME>"],
    ["^{appInfo.apiDomain}", "<API_DOMAIN>"],
    ["^{appInfo.websiteDomain}", "<WEBSITE_DOMAIN>"],
    ["^{appInfo.apiBasePath}", "<API_BASE_PATH>"],
    ["^{appInfo.websiteBasePath}", "<WEBSITE_BASE_PATH>"],
    ["^{coreInfo.uri}", "<CORE_URI>"],
    ["^{coreInfo.apiKey}", "<CORE_API_KEY>"],
  ];

  let processedContent = content;
  for (const [variable, value] of variables) {
    processedContent = processedContent.replaceAll(variable, value);
  }

  return processedContent;
}

function buildTitle(currentTitle: string, filePath: string): string {
  const [, relativePath] = filePath.split("/docs").filter(Boolean);
  const dirPath = path.dirname(relativePath);
  const pathComponents = dirPath.split("/").filter(Boolean);

  let title = "";
  let currentPath = `./docs`;
  for (const component of pathComponents) {
    const categoryJsonPath = path.join(currentPath, component, "_category_.json");
    currentPath = path.join(currentPath, component);
    const categoryJson = JSON.parse(fs.readFileSync(categoryJsonPath, "utf8"));
    title += `${categoryJson.label} - `;
  }

  if (!currentTitle) {
    console.warn("No title found for file", filePath);
  }

  return `${title} ${currentTitle}`;
}

export default function createLLMFullFile(context) {
  return {
    name: "generate-llms-full-txt",
    loadContent: async () => {
      const { siteDir } = context;
      const contentDir = path.join(siteDir, "docs");
      const allFiles: { title: string; content: string; path: string; description: string }[] = [];

      const skipFiles = [
        "docs/index.mdx",
        "docs/quickstart/example-apps/generate-example-app.mdx",
        "docs/quickstart/next-steps.mdx",
        "overview.mdx",
        "introduction.mdx",
        "compatibility-table.mdx",
      ];

      const mainDirectories = [
        "/quickstart",
        "/authentication",
        "/additional-verification",
        "/post-authentication",
        "/deployment",
        "/migration",
        "/platform-configuration",
        "/references",
      ];

      for (const dir of mainDirectories) {
        const fullPath = path.join(contentDir, dir);
        const mdxFiles = await getAllMdxFiles(fullPath, skipFiles);
        allFiles.push(...mdxFiles);
      }

      const filesWithoutReferences = allFiles.filter((file) => !file.path.includes("references"));

      return { files: filesWithoutReferences };
    },
    postBuild: async ({ content, outDir, routes }) => {
      const llmsFullTxt = (await Promise.all(content.files.map((file) => parseMdxContent(file.path)))).join("\n\n");

      fs.writeFileSync(path.join(outDir, "llms-full.txt"), llmsFullTxt);
    },
  };
}

