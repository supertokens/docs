import { promises as fs } from "node:fs";
import path from "node:path";

import yaml from "js-yaml";

const root = path.resolve(import.meta.dirname, "../..");
const docsRoot = path.join(root, "docs");
const manifest = JSON.parse(await fs.readFile(path.join(root, "scripts/blume/route-manifest.json"), "utf8"));

const placeholders = {
  "appInfo.appName": "<YOUR_APP_NAME>",
  "appInfo.apiDomain": "<YOUR_API_DOMAIN>",
  "appInfo.apiBasePath": "/auth",
  "appInfo.websiteDomain": "<YOUR_WEBSITE_DOMAIN>",
  "appInfo.websiteBasePath": "/auth",
  "appInfo.websiteBasePath_withoutForwardSlash": "auth",
  "coreInfo.uri": "<CORE_API_ENDPOINT>",
  "coreInfo.key": "<YOUR_API_KEY>",
  "derived.appIdPathname": "",
  "derived.goPasswordlessContactMethodMethod": "ContactMethodEmailConfig",
  "derived.pythonContactMethodImport": "from supertokens_python.recipe.passwordless import ContactEmailOnlyConfig",
  "derived.pythonContactMethodMethod": "ContactEmailOnlyConfig",
  docker_version_postgresql: "",
  form_websiteBasePath: "",
  jsdeliver_prebuiltui: "https://cdn.jsdelivr.net/gh/supertokens/prebuiltui@vX.Y.Z/build/static/js/main.test.js",
  prebuiltUIVersion: "https://cdn.jsdelivr.net/gh/supertokens/prebuiltui@vX.Y.Z/build/static/js/main.test.js",
  recipeNameCapitalLetters: "<RECIPE_NAME>",
  "recipes.passwordless.contactMethod": "EMAIL",
  "recipes.passwordless.flowType": "MAGIC_LINK",
  rid: "<RECIPE_ID>",
  "webJsVersions.emailpassword":
    "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/emailpassword.test.js",
  "webJsVersions.emailverification":
    "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/emailverification.test.js",
  "webJsVersions.passwordless":
    "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/passwordless.test.js",
  "webJsVersions.session": "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/session.test.js",
  "webJsVersions.supertokens":
    "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/supertokens.test.js",
  "webJsVersions.thirdparty":
    "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/thirdparty.test.js",
  "webJsVersions.webauthn": "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/webauthn.test.js",
  "webJsVersions.website": "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/website.test.js",
};

const tabLabels = {
  node: "Node.js",
  nodejs: "Node.js",
  go: "Go",
  "go-http": "Go",
  golang: "Go",
  python: "Python",
  java: "Java",
  kotlin: "Kotlin",
  swift: "Swift",
  dart: "Dart",
  csharp: "C#",
  php: "PHP",
  react: "React",
  angular: "Angular",
  vue: "Vue",
  next: "Next.js",
  nextjs: "Next.js",
  express: "Express",
  fastify: "Fastify",
  hapi: "Hapi",
  koa: "Koa",
  loopback: "LoopBack",
  flask: "Flask",
  django: "Django",
  fastapi: "FastAPI",
  npm: "npm",
  yarn: "Yarn",
  pnpm: "pnpm",
  script: "Script tag",
  scripts: "Script tag",
  prebuilt: "Prebuilt UI",
  custom: "Custom UI",
  "prebuilt-ui": "Prebuilt UI",
  "custom-ui": "Custom UI",
  "app-router": "App Router",
  "pages-router": "Pages Router",
  single: "Single tenant",
  multi: "Multi-tenant",
  ms: "Managed service",
  ss: "Self-hosted",
  curl: "cURL",
  dashboard: "Dashboard",
};

const tabFamilies = [
  "BackendTabs",
  "FrontendPrebuiltUITabs",
  "FrontendCustomUITabs",
  "FrontendTabs",
  "SelfHostingTabs",
  "RowndFrontendTabs",
  "ReactRouterVersionTabs",
  "ReactRouterVersionsTabs",
  "OSTabs",
  "DatabaseTabs",
  "NodeFrameworksCard",
  "NpmOrScriptsCard",
  "PythonSyncAsyncCard",
  "MobileFrameworksCard",
  "PythonFrameworksCard",
  "GoFrameworksCard",
  "NodePackageManagerCard",
  "JavascriptHttpLibraryCard",
  "PythonPackageManagerCard",
  "AccountTypeCard",
  "PasswordlessConfigCard",
  "ThirdPartyBuiltinProvidersCard",
  "HTTPRequestCard",
];

const newBadges = new Set([
  "/quickstart/build-with-ai-tools",
  "/additional-verification/captcha",
  "/post-authentication/user-management/user-banning",
  "/authentication/enterprise/tenant-discovery",
  "/authentication/enterprise/tenant-management-plugin",
  "/deployment/telemetry",
  "/authentication/enterprise/saml",
  "/post-authentication/user-management/progressive-profiling",
]);

const betaBadges = new Set(["/authentication/ai-authentication"]);

const escapeAttribute = (value) => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;");
const humanize = (value) =>
  String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
const tabLabel = (value) => tabLabels[value] || humanize(value);

const walk = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(entryPath)));
    } else if (/\.mdx?$/.test(entry.name) && !entry.name.startsWith("_")) {
      files.push(entryPath);
    }
  }
  return files;
};

const splitFrontmatter = (source) => {
  if (!source.startsWith("---\n")) {
    return { data: {}, body: source };
  }
  const end = source.indexOf("\n---", 4);
  if (end === -1) {
    throw new Error("Unclosed frontmatter");
  }
  return {
    data: yaml.load(source.slice(4, end)) || {},
    body: source.slice(end + 4).replace(/^\n/, ""),
  };
};

const stripFrontmatter = (source) => splitFrontmatter(source).body;

const expandPartials = async (source, sourceFile, stack = []) => {
  const imports = [];
  const lines = source.split("\n");
  let inFence = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^import\s+([A-Za-z][A-Za-z0-9_]*)\s+from\s+["']([^"']+\.mdx)["'];?\s*$/);
    if (match) {
      imports.push({ line: index, name: match[1], specifier: match[2] });
    }
  }

  for (const imported of imports.reverse()) {
    let partialPath;
    if (imported.specifier.startsWith("/docs/")) {
      partialPath = path.resolve(docsRoot, imported.specifier.slice("/docs/".length));
    } else if (path.isAbsolute(imported.specifier)) {
      throw new Error(`Unsupported absolute MDX import "${imported.specifier}" in ${sourceFile}; expected /docs/...`);
    } else {
      partialPath = path.resolve(path.dirname(sourceFile), imported.specifier);
    }
    if (stack.includes(partialPath)) {
      throw new Error(`Circular MDX partial import: ${[...stack, partialPath].join(" -> ")}`);
    }
    let partial = stripFrontmatter(await fs.readFile(partialPath, "utf8"));
    partial = await expandPartials(partial, partialPath, [...stack, partialPath]);
    const usage = new RegExp(`<${imported.name}(?:\\s[^>]*)?\\s*/>`, "g");
    source = source.replace(usage, partial.trim());
    source = source.replace(new RegExp(`^import\\s+${imported.name}\\s+from\\s+["'][^"']+["'];?\\s*$`, "m"), "");
  }

  return source;
};

const transformCodeBlocks = (source) => {
  const lines = source.split("\n");
  const output = [];
  for (let index = 0; index < lines.length; index += 1) {
    const opener = lines[index].match(/^(\s*)```([^`]*)$/);
    if (!opener) {
      output.push(lines[index]);
      continue;
    }

    const indent = opener[1];
    let info = opener[2]
      .replace(/\s+showAppTypeSelect\b/g, "")
      .replace(/\s+preview=(?:"[^"]*"|'[^']*')/g, "")
      .replace(/\s+previewAlt=(?:"[^"]*"|'[^']*')/g, "")
      .replace(/\bshowLineNumbers\b/g, "lineNumbers")
      .trimEnd();
    const code = [];
    const highlights = new Set();
    let inHighlight = false;
    let highlightNext = false;

    index += 1;
    while (
      index < lines.length &&
      !new RegExp(`^${indent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\`\`\`\\s*$`).test(lines[index])
    ) {
      const line = lines[index];
      if (line.includes("highlight-start")) {
        inHighlight = true;
      } else if (line.includes("highlight-end")) {
        inHighlight = false;
      } else if (line.includes("highlight-next-line")) {
        highlightNext = true;
      } else if (
        !line.includes("REMOVE_FROM_OUTPUT") &&
        !line.includes("@ts-expect-error") &&
        !line.includes("@ts-nocheck") &&
        !line.includes("@ts-ignore") &&
        !line.includes("// typecheck-only") &&
        !line.includes("supertokens-web-js-script") &&
        !line.includes("supertokens-auth-react-script")
      ) {
        code.push(line.replaceAll("# type: ignore", ""));
        if (inHighlight || highlightNext) highlights.add(code.length);
        highlightNext = false;
      }
      index += 1;
    }

    if (highlights.size > 0 && !/\{[^}]+\}/.test(info)) {
      info = `${info} {${[...highlights].join(",")}}`;
    }
    output.push(`${indent}\`\`\`${info}`, ...code, lines[index] || `${indent}\`\`\``);
  }
  return output.join("\n");
};

const transformHeadingContainer = (source, component, item, headingPattern) =>
  source.replace(new RegExp(`<${component}(?:\\s[^>]*)?>([\\s\\S]*?)</${component}>`, "g"), (full, content) => {
    const heading = new RegExp(`^${headingPattern}\\s+(.+)$`, "gm");
    const matches = [...content.matchAll(heading)];
    if (matches.length === 0) return full.replace(new RegExp(`<${component}(?:\\s[^>]*)?>`), `<${component}>`);

    const sections = matches.map((match, index) => {
      const start = match.index + match[0].length;
      const end = matches[index + 1]?.index ?? content.length;
      return `<${item} title="${escapeAttribute(match[1].replace(/[*_`\[\]]/g, ""))}">\n${content
        .slice(start, end)
        .trim()}\n</${item}>`;
    });
    return `<${component}>\n${sections.join("\n")}\n</${component}>`;
  });

const transformReferenceCards = (source) => {
  source = source
    .replace(/<ReferenceCard\.Grid(?:\s[^>]*)?>/g, "<CardGroup cols={3}>")
    .replace(/<\/ReferenceCard\.Grid>/g, "</CardGroup>")
    .replace(/\s*<ReferenceCard\.GridHelper\s*\/>/g, "")
    .replace(/<ReferenceCard\s+([^>]*?)\s*\/>/g, (full, attributes) => {
      const href = attributes.match(/href=["']([^"']+)["']/)?.[1];
      const label = attributes.match(/label=["']([^"']+)["']/)?.[1];
      return href && label ? `<Card title="${escapeAttribute(label)}" href="${href}" />` : full;
    });

  return source.replace(/<ReferenceCard\s+([^>]*?)>([\s\S]*?)<\/ReferenceCard>/g, (full, attributes, content) => {
    const href = attributes.match(/href=["']([^"']+)["']/)?.[1];
    if (!href) return full;
    const title = content.match(/<ReferenceCard\.Title>([\s\S]*?)<\/ReferenceCard\.Title>/)?.[1]?.trim();
    const description = content
      .match(/<ReferenceCard\.Description>([\s\S]*?)<\/ReferenceCard\.Description>/)?.[1]
      ?.trim();
    const avatar = content.match(/<ReferenceCard\.Avatar\s+[^>]*icon=["']([^"']+)["'][^>]*\/>/)?.[1];
    const icon = content.match(/<ReferenceCard\.Icon\s+[^>]*icon=["']([^"']+)["'][^>]*\/>/)?.[1];
    const titleText = title?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ") || humanize(path.basename(href));
    const iconValue = avatar
      ? `/img/icons/${avatar}.svg`
      : icon
        ? icon.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
        : null;
    return `<Card title="${escapeAttribute(titleText)}" href="${href}"${iconValue ? ` icon="${iconValue}"` : ""}>\n${
      description || ""
    }\n</Card>`;
  });
};

const transformTabs = (source) => {
  for (const family of tabFamilies) {
    source = source
      .replace(new RegExp(`<${family}(?:\\s[^>]*)?>`, "g"), `<Tabs dropdown param="${family.toLowerCase()}">`)
      .replace(new RegExp(`</${family}>`, "g"), "</Tabs>")
      .replace(new RegExp(`<${family}\\.(?:TabItem|Tab|Content)\\s+([^>]*?)>`, "g"), (full, attributes) => {
        const value = attributes.match(/value=["']([^"']+)["']/)?.[1];
        const label = attributes.match(/label=["']([^"']+)["']/)?.[1];
        return `<Tab title="${escapeAttribute(label || tabLabel(value || "Option"))}">`;
      })
      .replace(new RegExp(`</${family}\\.(?:TabItem|Tab|Content)>`, "g"), "</Tab>");
  }

  source = source
    .replace(/<Tabs(?:\s[^>]*)?>/g, "<Tabs>")
    .replace(/<TabItem\s+([^>]*?)>/g, (full, attributes) => {
      const value = attributes.match(/value=["']([^"']+)["']/)?.[1];
      const label = attributes.match(/label=["']([^"']+)["']/)?.[1];
      return `<Tab title="${escapeAttribute(label || tabLabel(value || "Option"))}">`;
    })
    .replace(/<\/TabItem>/g, "</Tab>");
  return source;
};

const transformVariants = (source) =>
  source
    .replace(/<UIType\.Switch\s*\/>/g, "<UITypeSwitch />")
    .replace(/<UIType\.PrebuiltUIContent>/g, '<VariantContent storageKey="ui-type" value="prebuilt">')
    .replace(/<\/UIType\.PrebuiltUIContent>/g, "</VariantContent>")
    .replace(/<UIType\.CustomUIContent>/g, '<VariantContent storageKey="ui-type" value="custom">')
    .replace(/<\/UIType\.CustomUIContent>/g, "</VariantContent>")
    .replace(/<TenantType\.Switch\s*\/>/g, "<TenantTypeSwitch />")
    .replace(/<TenantType\.SingleTenantContent>/g, '<VariantContent storageKey="tenant-type" value="single">')
    .replace(/<\/TenantType\.SingleTenantContent>/g, "</VariantContent>")
    .replace(/<TenantType\.MultiTenantContent>/g, '<VariantContent storageKey="tenant-type" value="multi">')
    .replace(/<\/TenantType\.MultiTenantContent>/g, "</VariantContent>")
    .replace(/<Question(?:\s[^>]*)?>/g, "<Tabs>")
    .replace(/<\/Question>/g, "</Tabs>")
    .replace(/<Answer\s+[^>]*title=["']([^"']+)["'][^>]*>/g, '<Tab title="$1">')
    .replace(/<\/Answer>/g, "</Tab>");

const removeBodyH1s = (source) => {
  const lines = source.split("\n");
  let inFence = false;
  return lines
    .filter((line) => {
      if (/^\s*```/.test(line)) inFence = !inFence;
      return inFence || !/^#\s+/.test(line);
    })
    .join("\n");
};

const routeForFile = (file) => {
  const relative = path
    .relative(docsRoot, file)
    .replace(/\.mdx?$/, "")
    .split(path.sep);
  if (relative.at(-1) === "index") relative.pop();
  return `/${relative.join("/")}`.replace(/\/$/, "") || "/";
};

const mapFrontmatter = (data, body, route, file) => {
  const bodyTitle = body.match(/^#\s+(.+)$/m)?.[1]?.replace(/[*_`]/g, "");
  const filenameTitle = humanize(
    path.basename(file, path.extname(file)) === "index"
      ? path.basename(path.dirname(file))
      : path.basename(file, path.extname(file)),
  );
  const title = data.title || data.page_title || bodyTitle || filenameTitle;
  const mapped = {
    title,
    ...(data.description ? { description: data.description } : {}),
    ...(data.draft === true ? { draft: true } : {}),
    ...(data.last_update?.date ? { lastModified: data.last_update.date } : {}),
  };

  const sidebar = {};
  if (data.sidebar_label) sidebar.label = data.sidebar_label;
  if (typeof data.sidebar_position === "number") sidebar.order = data.sidebar_position;
  if (data.unlisted === true || route === "/legacy/core/v10/self-host-supertokens") sidebar.hidden = true;
  if (newBadges.has(route)) sidebar.badge = "New";
  if (betaBadges.has(route)) sidebar.badge = "Beta";
  if (Object.keys(sidebar).length > 0) mapped.sidebar = sidebar;

  const seo = {};
  if (data.image) seo.image = data.image;
  if (data.unlisted === true) seo.noindex = true;
  if (Object.keys(seo).length > 0) mapped.seo = seo;
  if (Array.isArray(data.tags) && data.tags.length > 0) mapped.search = { tags: data.tags };
  return mapped;
};

const rewriteLinks = (source) => {
  for (const redirect of manifest.openapi) {
    source = source.replaceAll(`/docs${redirect.from}`, redirect.to);
    source = source.replaceAll(redirect.from, redirect.to);
  }
  return source
    .replace(
      /\/docs\/authentication\/social\/built-in-providers(?=[#?/"')\s]|$)/g,
      "/authentication/social/built-in-providers-config",
    )
    .replaceAll(
      "/docs/additional-verification/mfa/webauthn-secondary-factor-setup",
      "/additional-verification/mfa/webauthn-setup",
    )
    .replace(/(["'(])\/docs(?=\/|["')#])/g, "$1")
    .replace(/(\bsrc\s*=\s*["'])\/img\//g, "$1/docs/img/")
    .replace(/(!\[[^\]]*\]\()\/img\//g, "$1/docs/img/")
    .replace(/\.mdx(?=([#?][^\s"')>]*)?["')>\s])/g, "")
    .replace(/\.md(?=([#?][^\s"')>]*)?["')>\s])/g, "");
};

const files = await walk(docsRoot);
let inlinedPartials = 0;

for (const file of files) {
  let source = await fs.readFile(file, "utf8");
  const importsBefore = (source.match(/^import\s+\w+\s+from\s+["'][.][^"']+\.mdx["'];?\s*$/gm) || []).length;
  source = await expandPartials(source, file);
  inlinedPartials += importsBefore;

  const { data, body: originalBody } = splitFrontmatter(source);
  const route = routeForFile(file);
  let body = originalBody;

  body = body
    .replace(/^import\s+.*(?:@theme|@site\/src\/components|\/src\/components|@radix-ui\/themes).*$/gm, "")
    .replace(
      /\^\{([^}]+)\}/g,
      (full, key) => placeholders[key] ?? `<${humanize(key).toUpperCase().replaceAll(" ", "_")}>`,
    )
    .replace(/\{\{optional\}\}|\{optional\}/g, "(optional)")
    .replace(/:::important\b/g, ":::note")
    .replace(/:::caution\b/g, ":::warning")
    .replace(/^(\s*):::(note|tip|info|warning|danger|success)\s+([^\n\[]+)$/gm, (full, indent, type, title) =>
      title.trim() === "no-title" ? `${indent}:::${type}` : `${indent}:::${type}[${title.trim()}]`,
    )
    .replace(/<AppInfoForm(?:\s[^>]*)?\s*\/?>/g, "")
    .replace(/<\/AppInfoForm>/g, "")
    .replace(
      /<PaidFeatureCallout(?:\s[^>]*)?\s*\/>/g,
      ":::info[Managed service feature]\nThis feature is available for managed SuperTokens deployments.\n:::",
    )
    .replace(/<RemoveForLLMs>/g, '<Visibility for="web">')
    .replace(/<\/RemoveForLLMs>/g, "</Visibility>")
    .replace(/<DescriptionText>/g, "")
    .replace(/<\/DescriptionText>/g, "")
    .replace(/\s*<Separator\s*\/>/g, "\n\n---\n")
    .replace(/<br\s*\/>/g, "<br />");

  body = transformCodeBlocks(body);
  body = transformReferenceCards(body);
  body = transformTabs(body);
  body = transformVariants(body);
  body = transformHeadingContainer(body, "Steps", "Step", "#{2,6}");
  body = transformHeadingContainer(body, "Accordion", "AccordionItem", "##");
  body = rewriteLinks(body);
  body = removeBodyH1s(body)
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

  const legacyData = readLegacyFrontmatter(file);
  const mapped = mapFrontmatter({ ...legacyData, ...data }, originalBody, route, file);
  const frontmatter = yaml.dump(mapped, { lineWidth: 120, noRefs: true, sortKeys: false }).trim();
  await fs.writeFile(file, `---\n${frontmatter}\n---\n\n${body}\n`);
}

console.log(`Converted ${files.length} pages and inlined ${inlinedPartials} partial imports`);
