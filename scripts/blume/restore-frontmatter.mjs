import { execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

import yaml from "js-yaml";

const root = path.resolve(import.meta.dirname, "../..");
const docsRoot = path.join(root, "docs");
const migrationBase = execFileSync("git", ["merge-base", "HEAD", "master"], {
  cwd: root,
  encoding: "utf8",
}).trim();

const split = (source) => {
  if (!source.startsWith("---\n")) return { data: {}, body: source };
  const end = source.indexOf("\n---", 4);
  return {
    data: yaml.load(source.slice(4, end)) || {},
    body: source.slice(end + 4).replace(/^\n/, ""),
  };
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

const routeForFile = (file) => {
  const segments = path
    .relative(docsRoot, file)
    .replace(/\.mdx?$/, "")
    .split(path.sep);
  if (segments.at(-1) === "index") segments.pop();
  return `/${segments.join("/")}`.replace(/\/$/, "") || "/";
};

const legacyDataFor = (file) => {
  let relative = path.relative(root, file);
  if (relative.endsWith("authentication/social/built-in-providers-config.mdx")) {
    relative = relative.replace("built-in-providers-config.mdx", "built-in-providers.mdx");
  } else if (relative.endsWith("additional-verification/mfa/webauthn-setup.mdx")) {
    relative = relative.replace("webauthn-setup.mdx", "webauthn-secondary-factor-setup.mdx");
  }
  try {
    return split(execFileSync("git", ["show", `${migrationBase}:${relative}`], { cwd: root, encoding: "utf8" })).data;
  } catch {
    return {};
  }
};

for (const file of await walk(docsRoot)) {
  const source = await fs.readFile(file, "utf8");
  const { data, body } = split(source);
  const legacy = legacyDataFor(file);
  const route = routeForFile(file);
  const sidebar = { ...(data.sidebar || {}) };

  if (!sidebar.label && legacy.sidebar_label) sidebar.label = legacy.sidebar_label;
  if (sidebar.order === undefined && typeof legacy.sidebar_position === "number")
    sidebar.order = legacy.sidebar_position;
  if (legacy.unlisted === true || route === "/legacy/core/v10/self-host-supertokens") sidebar.hidden = true;

  const next = {
    ...data,
    ...(Object.keys(sidebar).length > 0 ? { sidebar } : {}),
  };
  const frontmatter = yaml.dump(next, { lineWidth: 120, noRefs: true, sortKeys: false }).trim();
  await fs.writeFile(file, `---\n${frontmatter}\n---\n\n${body.trim()}\n`);
}

console.log("Restored legacy sidebar metadata on migrated pages");
