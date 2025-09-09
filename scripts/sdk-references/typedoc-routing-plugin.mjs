import { readdirSync, unlinkSync, renameSync } from "fs";
import { join } from "path";
import { RendererEvent } from "typedoc";

export function load(app) {
  app.renderer.on(RendererEvent.END, (input) => {
    const outDir = app.options.getValue("out");
    const files = readdirSync(outDir);
    for (const file of files) {
      if (file.toLowerCase().startsWith("readme") || file.toLowerCase().startsWith("modules")) {
        unlinkSync(join(outDir, file));
      }

      if (file.toLowerCase().startsWith("index")) {
        renameSync(join(outDir, file), join(outDir, "package.mdx"));
      }
    }
  });
}
