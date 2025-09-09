// @ts-check
import { MarkdownPageEvent } from "typedoc-plugin-markdown";

export function load(app) {
  app.renderer.on(MarkdownPageEvent.END, (page) => {
    if (page.frontmatter && page.frontmatter.page_title) {
      // Find the end of frontmatter (after the closing ---)
      const frontmatterEnd = page.contents.indexOf("---", 3) + 3;
      if (frontmatterEnd > 2) {
        const frontmatter = page.contents.substring(0, frontmatterEnd);
        const content = page.contents.substring(frontmatterEnd);
        page.contents = frontmatter + "\n\n# " + page.frontmatter.page_title + "\n" + content;
      } else {
        // Fallback if no frontmatter found
        page.contents = "# " + page.frontmatter.page_title + "\n\n" + page.contents;
      }
    }
  });
}
