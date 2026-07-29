import { promises as fs } from "node:fs";
import path from "node:path";

const docsRoot = path.resolve(import.meta.dirname, "../../docs");

const walk = async (directory) => {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(entryPath)));
    } else if (/\.mdx?$/.test(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
};

let rewritten = 0;

for (const file of await walk(docsRoot)) {
  const source = await fs.readFile(file, "utf8");
  const output = source
    .replace(/(\bsrc\s*=\s*["'])\/img\//g, (match, prefix) => {
      rewritten += 1;
      return `${prefix}/docs/img/`;
    })
    .replace(/(!\[[^\]]*\]\()\/img\//g, (match, prefix) => {
      rewritten += 1;
      return `${prefix}/docs/img/`;
    })
    .replaceAll(
      "/docs/img/dashboard/tenant-management/custom-tenant-configuration.png",
      "/docs/img/dashboard/tenant-management/custom-tenant-config.png",
    )
    .replaceAll(
      "/docs/img/dashboard/tenant-management/openid-configuration.png",
      "/docs/img/dashboard/tenant-management/openid-config.png",
    );

  if (output !== source) {
    await fs.writeFile(file, output);
  }
}

console.log(`Prefixed ${rewritten} content asset reference(s).`);
