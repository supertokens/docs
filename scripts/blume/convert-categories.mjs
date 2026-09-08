import { promises as fs } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const docsRoot = path.join(root, "docs");

const icons = {
  References: "book-open",
  Quickstart: "zap",
  Authentication: "key-round",
  "Additional Verification": "shield-check",
  "Post Authentication": "users",
  Migration: "arrow-right",
  "Platform Configuration": "settings",
  Deployment: "server",
  "Email Password": "rectangle-ellipsis",
  Passwordless: "wand-sparkles",
  "Social Login": "circle-user-round",
  "Enterprise Login": "building-2",
  "Unified Login": "share-2",
  "Machine to Machine": "bot",
  Passkeys: "fingerprint",
  Integrations: "puzzle",
  "Frontend SDKs": "monitor",
  "Backend SDKs": "server",
  "User Interface": "palette",
  "Frontend Driver Interface": "file-code-2",
  "Core Driver Interface": "file-terminal",
  "Testing and Debugging": "bug",
  "SuperTokens Core": "cpu",
  Plugins: "plug",
  "Email/Password": "rectangle-ellipsis",
  ThirdParty: "share-2",
  WebAuthn: "fingerprint",
  "Passkeys/WebAuthn": "fingerprint",
  OAuth: "key-round",
  MFA: "shield-check",
  Session: "clock-3",
  TOTP: "hash",
  OTP: "smartphone",
  SAML: "key-round",
  "Email Verification": "mail-check",
  "Account Linking": "file-user",
  "Bulk Import": "user-plus",
  Core: "cpu",
  Dashboard: "layout-dashboard",
  "User Metadata": "braces",
  "User Roles": "shield-user",
  Multitenancy: "house-plus",
  "Quickstart Guides": "zap",
  "Advanced Workflows": "workflow",
  "Legacy Method": "history",
  "Legacy method": "history",
  "Using prebuilt UI": "palette",
  "Step 1: Account Creation": "user-check",
  "5. Checking Sessions in API Routes": "shield-check",
  "Checking Sessions in API Routes": "shield-check",
  "Session Verification": "badge-check",
  "Attack Protection Suite": "shield-plus",
  "Multi Factor Authentication": "monitor-smartphone",
  "User Management": "user-search",
  "Session Management": "id-card",
  "React SDK Reference": "/img/logos/react.svg",
  "Javascript SDK Reference": "/img/logos/js.svg",
  "Node.js SDK Reference": "/img/logos/nodejs-small.svg",
};

const walk = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(entryPath)));
    } else if (entry.name === "_category_.json") {
      files.push(entryPath);
    }
  }

  return files;
};

const files = await walk(docsRoot);

for (const file of files) {
  const category = JSON.parse(await fs.readFile(file, "utf8"));
  const meta = {
    title: category.label,
    ...(icons[category.label] ? { icon: icons[category.label] } : {}),
    ...(typeof category.position === "number" ? { order: category.position } : {}),
    ...(typeof category.collapsed === "boolean" ? { collapsed: category.collapsed } : {}),
  };
  const source = `import { defineMeta } from "blume";\n\nexport default defineMeta(${JSON.stringify(meta, null, 2)});\n`;

  await fs.writeFile(path.join(path.dirname(file), "meta.ts"), source);
  await fs.unlink(file);
}

console.log(`Converted ${files.length} Docusaurus category files to meta.ts`);
