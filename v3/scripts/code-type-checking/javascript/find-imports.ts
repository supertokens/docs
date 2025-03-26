import * as fs from "fs";
import * as path from "path";

function findUniqueImports(directoryPath: string): string[] {
  const allImports: string[] = [];

  function traverseDirectory(currentPath: string) {
    // Read all files and directories in the current path
    const files = fs.readdirSync(currentPath);

    files.forEach((file) => {
      const fullPath = path.join(currentPath, file);
      const stats = fs.statSync(fullPath);

      // If it's a directory, recursively traverse
      if (stats.isDirectory()) {
        traverseDirectory(fullPath);
      }
      // If it's a TypeScript file
      else if (path.extname(file) === ".ts" || path.extname(file) === ".tsx") {
        const fileContent = fs.readFileSync(fullPath, "utf-8");

        // Regular expression to match import statements
        const importRegex = /import\s+(?:(?:\*\s+as\s+\w+)|(?:{[^}]+})|(?:\w+))\s+from\s+['"]([^'"]+)['"]/g;

        let match;

        while ((match = importRegex.exec(fileContent)) !== null) {
          const importPath = match[1];

          // Exclude relative imports and add only unique packages
          if (!importPath.startsWith(".") && !allImports.includes(importPath)) {
            allImports.push(importPath);
          }
        }
      }
    });
  }

  // Start traversing from the given directory
  traverseDirectory(directoryPath);

  // Sort imports alphabetically for consistent output
  return allImports.sort();
}

// Usage example
function main() {
  const directoryToScan = process.argv[2] || "./src"; // Default to ./src if no path provided

  try {
    const uniqueImportedPackages = findUniqueImports(directoryToScan);

    console.log("Unique Imported Packages:");
    uniqueImportedPackages.forEach((pkg) => console.log(pkg));

    // Optional: Print total number of unique packages
    console.log(`\nTotal unique packages: ${uniqueImportedPackages.length}`);
  } catch (error) {
    console.error("Error scanning directory:", error);
  }
}

// Run the main function
main();
