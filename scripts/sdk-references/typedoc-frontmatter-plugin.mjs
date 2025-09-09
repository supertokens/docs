// @ts-check
import { ReflectionKind } from "typedoc";
import { MarkdownPageEvent } from "typedoc-plugin-markdown";
import { join } from "node:path";

/**
 * @param {import('typedoc-plugin-markdown').MarkdownApplication} app
 */
export function load(app) {
  app.renderer.on(
    MarkdownPageEvent.BEGIN,
    /** @param {import('typedoc-plugin-markdown').MarkdownPageEvent} page */
    (page) => {
      const repositoryFiles = page.frontmatter?.repositoryFiles;
      if (!repositoryFiles) {
        throw new Error("repositoryFiles not found in frontmatterGlobals");
      }

      const outDir = app.options.getValue("out");
      const repositoryFile = repositoryFiles.find((file) => join(outDir, file.generatedFilePath) === page.filename);
      if (!repositoryFile) {
        console.warn("Could not find repositoryFile for page", page.filename);
        page.frontmatter = {};
        return;
      }

      page.frontmatter = {
        title: repositoryFile.packageName,
        page_title: repositoryFile.title,
        sidebar_position: repositoryFile.sidebarPosition,
        description: `References documentation for the ${repositoryFile.packageName} package`,
        hide_title: true,
        page_type: "sdk-reference",
        package_name: "supertokens-node",
        category: "references",
      };
    },
  );
}
