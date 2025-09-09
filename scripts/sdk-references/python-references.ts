import { $ } from "bun";
import { join } from "node:path";

export type PythonRepository = {
  url: string;
  version: string;
  modules: {
    path: string;
    title: string;
    sidebarPosition: number;
    packageName: string;
    generatedFilePath: string;
    subModules?: string[];
  }[];
  outputDir: string;
  name: string;
  language: "python";
  categoryJSON: { label: string; position: number };
  packageName: string;
};

(async () => {
  const pythonScriptPath = join(import.meta.dir, "python-references.py");
  console.log("Running Python documentation generation script...");

  try {
    await $`python3 ${pythonScriptPath}`;
    console.log("Python documentation generation completed successfully!");
  } catch (error) {
    console.error("Failed to run Python documentation generation:", error);
    process.exit(1);
  }
})();
