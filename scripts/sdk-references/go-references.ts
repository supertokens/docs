import { $ } from "bun";
import { rm, writeFile, mkdir, exists, readFile } from "node:fs/promises";
import { join } from "node:path";

export type GoRepository = {
  url: string;
  version: string;
  packages: {
    path: string;
    title: string;
    sidebarPosition: number;
    packageName: string;
    generatedFilePath: string;
    subPackages?: string[];
  }[];
  outputDir: string;
  name: string;
  language: "go";
  categoryJSON: { label: string; position: number };
  moduleName: string;
};

async function generateMarkdownFromGoDoc(
  packages: GoRepository["packages"],
  outDir: string,
  repoPath: string,
  moduleName: string,
) {
  await mkdir(outDir, { recursive: true });

  for (const pkg of packages) {
    const packagePath = join(repoPath, pkg.path);
    const packageExists = await exists(packagePath);

    if (!packageExists) {
      console.warn(`Package path ${packagePath} does not exist, skipping...`);
      continue;
    }

    try {
      const godocOutput = await $`go doc -all ./${pkg.path}`.cwd(repoPath).text();

      let markdown = `---
title: "${pkg.title}"
sidebar_position: ${pkg.sidebarPosition}
---

# ${pkg.title}

\`\`\`go
import "${moduleName}/${pkg.path}"
\`\`\`

${convertGoDocToMarkdown(godocOutput)}
`;

      if (pkg.subPackages) {
        for (const subPkg of pkg.subPackages) {
          try {
            const subPkgPath = `${pkg.path}/${subPkg}`;
            const subPkgExists = await exists(join(repoPath, subPkgPath));

            if (subPkgExists) {
              const subGodocOutput = await $`go doc -all ./${subPkgPath}`.cwd(repoPath).text();
              markdown += `\n\n## ${subPkg}\n\n`;
              markdown += `\`\`\`go\nimport "${moduleName}/${subPkgPath}"\n\`\`\`\n\n`;
              markdown += convertGoDocToMarkdown(subGodocOutput);
            }
          } catch (error) {
            console.warn(`Failed to generate docs for subpackage ${subPkg}:`, error);
          }
        }
      }

      await writeFile(join(outDir, pkg.generatedFilePath), markdown);
      console.log(`Generated documentation for ${pkg.packageName}`);
    } catch (error) {
      console.error(`Failed to generate documentation for ${pkg.packageName}:`, error);
    }
  }
}

function convertGoDocToMarkdown(godocOutput: string): string {
  let markdown = godocOutput;

  markdown = markdown.replace(/^package\s+(\w+)/gm, "## Package $1");

  markdown = markdown.replace(/^(func|type|const|var)\s+([A-Z]\w*)/gm, "### $1 $2");

  markdown = markdown.replace(/^(\s{4,}.*$)/gm, "```go\n$1\n```");

  markdown = markdown.replace(/```go\n```go/g, "```go");
  markdown = markdown.replace(/```\n```go/g, "```go");

  return markdown;
}

const repositories: GoRepository[] = [
  {
    url: "https://github.com/supertokens/supertokens-golang",
    version: "0.22.0",
    moduleName: "github.com/supertokens/supertokens-golang",
    outputDir: "./docs/references/backend-sdks/supertokens-golang",
    name: "supertokens-golang",
    language: "go",
    packages: [
      {
        path: "supertokens",
        title: "SuperTokens Go",
        sidebarPosition: 1,
        packageName: "supertokens-golang",
        generatedFilePath: "index.mdx",
      },
      {
        path: "recipe/emailpassword",
        title: "EmailPassword",
        sidebarPosition: 2,
        packageName: "supertokens-golang/recipe/emailpassword",
        generatedFilePath: "recipe.emailpassword.mdx",
        subPackages: ["epmodels"],
      },
      {
        path: "recipe/passwordless",
        title: "Passwordless",
        sidebarPosition: 3,
        packageName: "supertokens-golang/recipe/passwordless",
        generatedFilePath: "recipe.passwordless.mdx",
        subPackages: ["plessmodels"],
      },
      {
        path: "recipe/thirdparty",
        title: "ThirdParty",
        sidebarPosition: 4,
        packageName: "supertokens-golang/recipe/thirdparty",
        generatedFilePath: "recipe.thirdparty.mdx",
        subPackages: ["tpmodels"],
      },
      {
        path: "recipe/session",
        title: "Session",
        sidebarPosition: 5,
        packageName: "supertokens-golang/recipe/session",
        generatedFilePath: "recipe.session.mdx",
        subPackages: ["sessmodels"],
      },
      {
        path: "recipe/emailverification",
        title: "EmailVerification",
        sidebarPosition: 6,
        packageName: "supertokens-golang/recipe/emailverification",
        generatedFilePath: "recipe.emailverification.mdx",
        subPackages: ["evmodels"],
      },
      {
        path: "recipe/jwt",
        title: "JWT",
        sidebarPosition: 7,
        packageName: "supertokens-golang/recipe/jwt",
        generatedFilePath: "recipe.jwt.mdx",
      },
      {
        path: "recipe/userroles",
        title: "UserRoles",
        sidebarPosition: 8,
        packageName: "supertokens-golang/recipe/userroles",
        generatedFilePath: "recipe.userroles.mdx",
        subPackages: ["userrolesmodels"],
      },
      {
        path: "recipe/usermetadata",
        title: "UserMetadata",
        sidebarPosition: 9,
        packageName: "supertokens-golang/recipe/usermetadata",
        generatedFilePath: "recipe.usermetadata.mdx",
      },
      {
        path: "recipe/dashboard",
        title: "Dashboard",
        sidebarPosition: 10,
        packageName: "supertokens-golang/recipe/dashboard",
        generatedFilePath: "recipe.dashboard.mdx",
      },
    ],
    categoryJSON: {
      label: "Go SDK Reference",
      position: 5,
    },
  },
];

async function cloneRepository(repository: GoRepository, branch: string): Promise<void> {
  const repositoryDirectoryPath = `./tmp/${repository.name}`;
  const repositoryDirectoryExists = await exists(repositoryDirectoryPath);
  if (repositoryDirectoryExists) {
    return;
  }
  console.log(`Cloning ${repository.url}`);
  await $`git clone ${repository.url} -b ${branch} ${repository.name} --depth 1`.cwd("./tmp");
}

(async () => {
  const tmpDirPath = "./tmp";
  const tmpDirExists = await exists(tmpDirPath);
  if (!tmpDirExists) {
    await mkdir(tmpDirPath);
  }

  for (const repository of repositories) {
    const localDirectoryPath = join(tmpDirPath, repository.name);
    if (await exists(localDirectoryPath)) {
      await rm(localDirectoryPath, { recursive: true });
    }
    await cloneRepository(repository, `v${repository.version}`);

    await generateMarkdownFromGoDoc(
      repository.packages,
      repository.outputDir,
      localDirectoryPath,
      repository.moduleName,
    );

    await writeFile(join(repository.outputDir, "_category_.json"), JSON.stringify(repository.categoryJSON));
  }
})();
