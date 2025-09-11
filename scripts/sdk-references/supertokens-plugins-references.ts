import { Application } from "typedoc";
import "typedoc-plugin-markdown";

import { $ } from "bun";
import { rm, mkdir, exists } from "node:fs/promises";
import { join } from "node:path";

export type Repository = {
  url: string;
  version: string;
  files: {
    path: string;
    title: string;
    sidebarPosition: number;
    packageName: string;
    generatedFilePath: string;
  }[];
  outputDir: string;
  name: string;
  language: "typescript";
  categoryJSON: { label: string; position: number };
};

async function generateMarkdownFiles() {
  const app = await Application.bootstrapWithPlugins({
    name: "SuperTokens Plugins",
    entryPointStrategy: "expand",
    entryPoints: ["tmp/supertokens-plugins/packages/*/src/**/*.ts", "tmp/supertokens-plugins/packages/*/src/**/*.tsx"],
    out: "docs/references/plugins/references",
    plugin: [
      "typedoc-plugin-markdown",
      "typedoc-plugin-frontmatter",
      "./scripts/sdk-references/typedoc-merge-modules.mjs",
      "./scripts/sdk-references/typedoc-text-replace-plugin.mjs",
      "typedoc-plugin-mdn-links",
      "typedoc-plugin-inline-sources",
    ],
    skipErrorChecking: true,
    useCodeBlocks: true,
    router: "module",
    flattenOutputFiles: true,
    hidePageHeader: true,
    hideBreadcrumbs: true,
    excludeExternals: true,
    searchInComments: true,
    expandObjects: true,
    expandParameters: true,
    commentStyle: "all",
    fileExtension: ".mdx",
    parametersFormat: "table",
    interfacePropertiesFormat: "table",
    tsconfig: "tsconfig.json",
    classPropertiesFormat: "table",
    typeAliasPropertiesFormat: "table",
    enumMembersFormat: "table",
    propertyMembersFormat: "table",
    typeDeclarationFormat: "table",
    frontmatterGlobals: {
      page_type: "plugin-reference",
    },
    theme: "default",
    includeVersion: true,
    excludePrivate: true,
    excludeProtected: false,
    hideGenerator: false,
    cleanOutputDir: true,
    categorizeByGroup: true,
    readme: "none",
    navigation: {
      includeCategories: true,
      includeGroups: true,
    },
    gitRevision: "main",
    gitRemote: "origin",
    sourceLinkTemplate: "https://github.com/supertokens/supertokens-plugins/blob/{gitRevision}/{path}#L{line}",
    exclude: ["**/node_modules/**", "**/auth-ui/**", "**/dist/**", "**/*css.d.ts", "**/*.test.*", "**/*.spec.*"],
    compilerOptions: {
      skipLibCheck: true,
      jsx: "react",
      target: "ES2022",
      lib: ["ES2022", "DOM"],
      module: "ESNext",
      moduleResolution: "node",
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: false,
    },
  } as any);
  const project = await app.convert();
  if (!project) {
    throw new Error("Failed to convert TypeScript project");
  }
  app.validate(project);
  await app.generateOutputs(project);
}

async function cloneRepository(repository: { url: string; branch: string; name: string }): Promise<void> {
  const repositoryDirectoryPath = `./tmp/${repository.name}`;
  const repositoryDirectoryExists = await exists(repositoryDirectoryPath);
  if (repositoryDirectoryExists) {
    return;
  }
  console.log(`Cloning ${repository.name}`);
  await $`git clone ${repository.url} -b ${repository.branch} ${repository.name} --depth 1`.cwd("./tmp");
}

(async () => {
  const tmpDirPath = "./tmp";
  const tmpDirExists = await exists(tmpDirPath);
  if (!tmpDirExists) {
    mkdir(tmpDirPath);
  }
  const repository = {
    url: "https://github.com/supertokens/supertokens-plugins",
    branch: "main",
    name: "supertokens-plugins",
  };

  const localDirectoryPath = join(tmpDirPath, repository.name);
  if (await exists(localDirectoryPath)) {
    await rm(localDirectoryPath, { recursive: true });
  }
  await cloneRepository(repository);

  await generateMarkdownFiles();

  await $`cp -v $(find docs/references/plugins/references -type f ! -name "README.mdx") docs/references/plugins`;
  await $`rm -rf docs/references/plugins/references`;
})();
