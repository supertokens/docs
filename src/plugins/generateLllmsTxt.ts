import fs from "fs";
import path from "path";
import matter from "gray-matter";

async function getAllMdxFiles(dir: string) {
  const allFiles: { title: string; content: string; path: string; description: string }[] = [];
  if (dir.includes("_blocks")) return [];

  let orderedItems = [];

  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (fullPath.includes("_blocks")) {
      continue;
    }
    if (entry.isDirectory()) {
      const categoryJsonPath = path.join(fullPath, "_category_.json");
      let categoryOrder = 1;
      if (fs.existsSync(categoryJsonPath)) {
        const categoryJson = JSON.parse(fs.readFileSync(categoryJsonPath, "utf8"));
        categoryOrder = categoryJson.position;
      }

      orderedItems.push({ directory: true, order: categoryOrder, path: fullPath });
    }
    if (entry.name.endsWith(".mdx")) {
      const mdxFileContent = await fs.promises.readFile(fullPath, "utf8");
      const { data } = matter(mdxFileContent);
      const filePosition = data.sidebar_position || 1;
      orderedItems.push({ directory: false, order: filePosition, path: fullPath });
    }
  }

  orderedItems.sort((a, b) => a.order - b.order);

  for (const item of orderedItems) {
    if (item.directory) {
      const mdxFiles = await getAllMdxFiles(item.path);
      allFiles.push(...mdxFiles);
    } else if (item.path.endsWith(".mdx")) {
      const mdxFileContent = await fs.promises.readFile(item.path, "utf8");
      const { data, content } = matter(mdxFileContent);
      if (data.skip_llms_txt) continue;
      // Skip nextjs until we update the docs
      if (item.path.includes("/integrations/nextjs")) continue;
      const title = data.llms_txt_title || data.title;
      allFiles.push({ title, content, path: item.path, description: data.description });
    }
  }
  return allFiles;
}

function buildContent(files: { path: string; description?: string; title: string }[]) {
  return files
    .map((file) => {
      const regex = /\/docs\/(.+)\.mdx$/;
      const match = file.path.match(regex);

      const src = `https://supertokens.com/${match[1]}`;
      const parsedDescription = file.description ? `: ${file.description}` : "";
      return `- [${file.title}](${src})${parsedDescription}`;
    })
    .join("\n");
}

export default function createLLMfiles(context) {
  return {
    name: "generate-llms-txt",
    loadContent: async () => {
      const { siteDir } = context;
      const contentDir = path.join(siteDir, "docs");
      const allFiles: { title: string; content: string; path: string; description: string }[] = [];

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
        const mdxFiles = await getAllMdxFiles(fullPath);
        allFiles.push(...mdxFiles);
      }

      return { files: allFiles };
    },
    postBuild: async ({ content, routes, outDir }) => {
      const llmsTxt = `
# SuperTokens 

## Docs

### Quickstart
${buildContent(content.files.filter((file) => file.path.includes("/quickstart")))}

### Email/Password Login
${buildContent(content.files.filter((file) => file.path.includes("/authentication/email-password")))}

### Passwordless Login
${buildContent(content.files.filter((file) => file.path.includes("/authentication/passwordless")))}

### Social Login
${buildContent(content.files.filter((file) => file.path.includes("/authentication/social")))}

### Enterprise Login
${buildContent(content.files.filter((file) => file.path.includes("/authentication/enterprise")))}

### Unified Login
${buildContent(content.files.filter((file) => file.path.includes("/authentication/unified-login")))}

### Machine to Machine Authentication
${buildContent(content.files.filter((file) => file.path.includes("/authentication/m2m")))}

### Passkeys Authentication
${buildContent(content.files.filter((file) => file.path.includes("/authentication/passkeys")))}

### Multi-factor Authentication
${buildContent(content.files.filter((file) => file.path.includes("/additional-verification/mfa")))}

### Session Verification
${buildContent(content.files.filter((file) => file.path.includes("/additional-verification/session-verification")))}

### Email Verification
${buildContent(content.files.filter((file) => file.path.includes("/additional-verification/email-verification")))}

### Attack Protection Suite
${buildContent(content.files.filter((file) => file.path.includes("/additional-verification/attack-protection-suite")))}

### User Roles
${buildContent(content.files.filter((file) => file.path.includes("/additional-verification/user-roles")))}

### Account Linking
${buildContent(content.files.filter((file) => file.path.includes("/post-authentication/account-linking")))}

### Session Management
${buildContent(content.files.filter((file) => file.path.includes("/post-authentication/session-management")))}

### User Management
${buildContent(content.files.filter((file) => file.path.includes("/post-authentication/user-management")))}

### Dashboard
${buildContent(content.files.filter((file) => file.path.includes("/post-authentication/dashboard")))}

### Migration
${buildContent(content.files.filter((file) => file.path.includes("/migration") && !file.path.includes("/mfa")))}

### References
${buildContent(content.files.filter((file) => file.path.includes("/deployment")))}
${buildContent(content.files.filter((file) => file.path.includes("/platform-configuration")))}
${buildContent(content.files.filter((file) => file.path.includes("/references")))}


`;

      fs.writeFileSync(path.join(outDir, "llms.txt"), llmsTxt);
    },
  };
}
