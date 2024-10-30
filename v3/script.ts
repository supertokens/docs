import * as fs from "fs";
import * as path from "path";

interface Doc {
  type: "doc";
  id: string;
  label: string;
}

interface Category {
  type: "category";
  label: string;
  items: Array<Doc | Category>;
}

function kebabToTitleCase(kebab: string): string {
  return kebab
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function parseDirectory(dirPath: string, prefix: string = ""): Category {
  const items: Array<Doc | Category> = [];

  // Read the contents of the directory
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // If it's a directory, recursively parse it
      const category: Category = {
        type: "category",
        label: kebabToTitleCase(file),
        items: parseDirectory(fullPath, prefix).items,
      };

      items.push(category);
    } else {
      // If it's a file, format it as a Doc
      const fileNameWithoutExt = path.parse(file).name;
      let filePathWithoutExt = path
        .join(prefix, path.relative("", fullPath))
        .replace(/\.[^/.]+$/, "");

      // Remove the initial '/' from the relative path and apply the prefix
      filePathWithoutExt = path
        .join(prefix, filePathWithoutExt)
        .replace(/^[/\\]/, "");

      const doc: Doc = {
        type: "doc",
        id: filePathWithoutExt,
        label: kebabToTitleCase(fileNameWithoutExt),
      };

      items.push(doc);
    }
  });

  // Return the category object for the current directory
  return {
    type: "category",
    label: path.basename(dirPath),
    items: items,
  };
}
const directoryToParse = "guides/dashboard"; // Replace with your directory path
process.chdir("./docs");
const prefix = "/"; // Replace with your desired prefix
const parsedStructure = parseDirectory(directoryToParse, prefix);

console.log(JSON.stringify(parsedStructure, null, 2));
