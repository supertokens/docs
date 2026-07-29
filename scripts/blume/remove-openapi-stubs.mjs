import { promises as fs } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const manifest = JSON.parse(await fs.readFile(path.join(root, "scripts/blume/route-manifest.json"), "utf8"));
let removed = 0;

for (const operation of manifest.openapi) {
  const file = path.join(root, "docs", `${operation.from}.mdx`);
  try {
    const source = await fs.readFile(file, "utf8");
    if (!source.includes("<APIRequestPage")) {
      throw new Error(`Refusing to remove non-generated API page: ${path.relative(root, file)}`);
    }
    await fs.unlink(file);
    removed += 1;
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

console.log(`Removed ${removed} generated OpenAPI stubs`);
