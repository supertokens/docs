import * as fs from "fs";
import * as path from "path";

function findUniqueImports(directoryPath: string): string[] {
  const allImports: string[] = [];

  function traverseDirectory(currentPath: string) {
    const files = fs.readdirSync(currentPath);

    files.forEach((file) => {
      const fullPath = path.join(currentPath, file);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (path.extname(file) === ".ts" || path.extname(file) === ".tsx") {
        const fileContent = fs.readFileSync(fullPath, "utf-8");

        const importRegex = /import\s+(?:(?:\*\s+as\s+\w+)|(?:{[^}]+})|(?:\w+))\s+from\s+['"]([^'"]+)['"]/g;

        let match;

        while ((match = importRegex.exec(fileContent)) !== null) {
          const importPath = match[1];

          if (!importPath.startsWith(".") && !allImports.includes(importPath)) {
            allImports.push(importPath);
          }
        }
      }
    });
  }

  traverseDirectory(directoryPath);

  return allImports.sort();
}

function main() {
  const directoryToScan = process.argv[2] || "./src";

  try {
    const uniqueImportedPackages = findUniqueImports(directoryToScan);

    console.log("Unique Imported Packages:");
    uniqueImportedPackages.forEach((pkg) => console.log(pkg));

    console.log(`\nTotal unique packages: ${uniqueImportedPackages.length}`);
  } catch (error) {
    console.error("Error scanning directory:", error);
  }
}

main();
