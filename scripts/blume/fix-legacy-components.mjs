import { promises as fs } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const docsRoot = path.join(root, "docs");

const families = [
  "AccountTypeCard",
  "GoFrameworksCard",
  "JavascriptHttpLibraryCard",
  "MobileFrameworksCard",
  "NodeFrameworksCard",
  "NpmOrScriptsCard",
  "PasswordlessConfigCard",
  "PythonFrameworksCard",
];

const labels = {
  node: "Node.js",
  nodejs: "Node.js",
  go: "Go",
  python: "Python",
  react: "React",
  angular: "Angular",
  vue: "Vue",
  express: "Express",
  fastify: "Fastify",
  hapi: "Hapi",
  koa: "Koa",
  loopback: "LoopBack",
  flask: "Flask",
  django: "Django",
  fastapi: "FastAPI",
  npm: "npm",
  script: "Script tag",
  scripts: "Script tag",
  axios: "Axios",
  fetch: "Fetch",
  single: "Single tenant",
  multi: "Multi-tenant",
  "with-docker": "Self-hosted with Docker",
  "without-docker": "Self-hosted without Docker",
};

const labelFor = (value) =>
  labels[value] ||
  String(value || "Option")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const replaceOpening = (source, name, replacement) => {
  let cursor = 0;
  let output = "";
  const needle = `<${name}`;
  while (cursor < source.length) {
    const start = source.indexOf(needle, cursor);
    if (start === -1) {
      output += source.slice(cursor);
      break;
    }
    const next = source[start + needle.length];
    if (!(next === ">" || /\s/.test(next || ""))) {
      output += source.slice(cursor, start + needle.length);
      cursor = start + needle.length;
      continue;
    }
    let quote = null;
    let escaped = false;
    let braces = 0;
    let end = start + needle.length;
    for (; end < source.length; end += 1) {
      const character = source[end];
      if (escaped) escaped = false;
      else if (quote && character === "\\") escaped = true;
      else if (quote && character === quote) quote = null;
      else if (!quote && (character === '"' || character === "'")) quote = character;
      else if (!quote && character === "{") braces += 1;
      else if (!quote && character === "}") braces = Math.max(0, braces - 1);
      else if (!quote && braces === 0 && character === ">") {
        end += 1;
        break;
      }
    }
    const opening = source.slice(start, end);
    output += source.slice(cursor, start) + replacement(opening);
    cursor = end;
  }
  return output;
};

const walk = async (directory) => {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(entryPath)));
    else if (/\.mdx?$/.test(entry.name)) files.push(entryPath);
  }
  return files;
};

const transformOutsideFences = (source, transform) => {
  const lines = source.split("\n");
  let inFence = false;
  return lines
    .map((line) => {
      if (/^\s*```/.test(line)) {
        inFence = !inFence;
        return line;
      }
      return inFence ? line : transform(line);
    })
    .join("\n");
};

const transformOutsideInlineCode = (line, transform) => {
  let cursor = 0;
  let output = "";
  while (cursor < line.length) {
    const start = line.indexOf("`", cursor);
    if (start === -1) return output + transform(line.slice(cursor));
    let length = 1;
    while (line[start + length] === "`") length += 1;
    const delimiter = "`".repeat(length);
    const end = line.indexOf(delimiter, start + length);
    if (end === -1) return output + transform(line.slice(cursor));
    output += transform(line.slice(cursor, start)) + line.slice(start, end + length);
    cursor = end + length;
  }
  return output;
};

for (const file of await walk(docsRoot)) {
  let source = await fs.readFile(file, "utf8");

  for (const family of families) {
    source = replaceOpening(source, family, () => `<Tabs dropdown param="${family.toLowerCase()}">`)
      .replace(new RegExp(`</${family}>`, "g"), "</Tabs>")
      .replace(new RegExp(`<${family}\\.(?:Section|Content)(?:\\s+([^>]*?))?\\s*>`, "g"), (full, attributes) => {
        const value =
          attributes?.match(/value=["']([^"']+)["']/)?.[1] || attributes?.match(/name=["']([^"']+)["']/)?.[1];
        return `<Tab title="${labelFor(value)}">`;
      })
      .replace(new RegExp(`</${family}\\.(?:Section|Content)>`, "g"), "</Tab>");
  }

  source = source
    .replace(/<AccountTypeCard\.ManagedContent(?:\s[^>]*)?>/g, '<Tab title="Managed service">')
    .replace(/<\/AccountTypeCard\.ManagedContent>/g, "</Tab>")
    .replace(/<AccountTypeCard\.SelfHostedContent\s+([^>]*?)>/g, (full, attributes) => {
      const value = attributes.match(/value=["']([^"']+)["']/)?.[1];
      return `<Tab title="${labelFor(value || "Self-hosted")}">`;
    })
    .replace(/<\/AccountTypeCard\.SelfHostedContent>/g, "</Tab>")
    .replace(/<NodeFrameworksCard\.HeaderCustomActions>/g, "")
    .replace(/<\/NodeFrameworksCard\.HeaderCustomActions>/g, "")
    .replace(
      /<HTTPRequestCard\.(ShellExample|NodeJSExample|GoExample|PythonExample)(?:\s+[^>]*?)?\s*>/g,
      (full, kind) => {
        const titles = { ShellExample: "cURL", NodeJSExample: "Node.js", GoExample: "Go", PythonExample: "Python" };
        return `<Tab title="${titles[kind]}">`;
      },
    )
    .replace(/<\/HTTPRequestCard\.(ShellExample|NodeJSExample|GoExample|PythonExample)>/g, "</Tab>")
    .replace(/<HTTPRequestCard\.DetailsModal>/g, '<Tab title="Details">')
    .replace(/<\/HTTPRequestCard\.DetailsModal>/g, "</Tab>")
    .replace(/<\/?HTTPRequestCard\.DetailsModal(?:Header|Description|Body)>/g, "")
    .replace(/<CodeSampleCard>/g, "")
    .replace(/<\/CodeSampleCard>/g, "")
    .replace(/<AppInfoForm(?:\s[^>]*)?>/g, "")
    .replace(/<\/AppInfoForm>/g, "")
    .replace(/<UIType\.CustomUIContent(?:\s[^>]*)?>/g, '<VariantContent storageKey="ui-type" value="custom">')
    .replace(/<\/UIType\.CustomUIContent>/g, "</VariantContent>")
    .replace(/<UIType\.PrebuiltUIContent(?:\s[^>]*)?>/g, '<VariantContent storageKey="ui-type" value="prebuilt">')
    .replace(/<\/UIType\.PrebuiltUIContent>/g, "</VariantContent>")
    .replace(/<TokensCallout(?:\s[^>]*)?>/g, ":::info[Access token guidance]")
    .replace(/<\/TokensCallout>/g, ":::")
    .replace(
      /<OAuthVerifyTokensCallout(?:\s[^>]*)?\s*\/>/g,
      ":::warning[OAuth2 token verification]\nVerify OAuth2 access tokens with your OAuth2/OIDC library instead of the SuperTokens Session SDK.\n:::",
    )
    .replace(
      /<OAuthFrontendVerificationCallout(?:\s[^>]*)?\s*\/>/g,
      ":::warning[OAuth2 token verification]\nCheck authentication with your OAuth2/OIDC library when using Unified Login.\n:::",
    )
    .replace(/<Box(?:\s[^>]*)?>/g, "<div>")
    .replace(/<\/Box>/g, "</div>")
    .replace(/<Flex(?:\s[^>]*)?>/g, "<div>")
    .replace(/<\/Flex>/g, "</div>")
    .replace(/<H2>(.*?)<\/H2>/g, "## $1")
    .replace(/<H3>(.*?)<\/H3>/g, "### $1")
    .replace(/<H4>(.*?)<\/H4>/g, "#### $1");

  source = transformOutsideFences(source, (line) => {
    const repaired = line
      .replace(/``(<[A-Z][A-Z0-9_]+>)`/g, "`$1")
      .replace(/`(<[A-Z][A-Z0-9_]+>)``/g, "$1`")
      .replace(/'`(<[A-Z][A-Z0-9_]+>)`'/g, "`'$1'`");
    return transformOutsideInlineCode(repaired, (text) =>
      text
        .replace(/<([A-Z][A-Z0-9_]{1,})>/g, "&lt;$1&gt;")
        .replace(/<(T|P|Action|ValueType|PreloadInfoType|NormalisedConfig|RecipeContext)>/g, "&lt;$1&gt;"),
    );
  });

  await fs.writeFile(file, source);
}

console.log("Converted remaining legacy MDX components");
