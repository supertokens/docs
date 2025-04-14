import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function getAllMdxFiles(dir: string, skipFiles: string[]) {
  const allFiles: { title: string; content: string; path: string; description: string }[] = [];
  if (dir.includes("_blocks")) return [];

  let orderedItems = [];

  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (fullPath.includes("_blocks")) {
      continue;
    }
    if (skipFiles.some((pathToSkip) => fullPath.includes(pathToSkip))) {
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
      const mdxFiles = await getAllMdxFiles(item.path, skipFiles);
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
