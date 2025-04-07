import { useEffect, useState, lazy } from "react";

import type { OpenAPIV3 } from "@scalar/openapi-types";

// TODO: Cache the schema
export function useLoadOpenApiSchema(
  apiName: "cdi" | "fdi",
  path: string,
  method: string,
): OpenAPIV3.PathItemObject | null {
  const [schema, setSchema] = useState<OpenAPIV3.OperationObject | null>(null);

  useEffect(() => {
    async function loadJsonSchema() {
      let parsedApiPath = path.startsWith("/") ? path.slice(1) : path;
      parsedApiPath = parsedApiPath.replaceAll("/", "_");
      try {
        const response = await import(`@site/static/${apiName}.json`);
        const schema = response.default as OpenAPIV3.Document;
        if (!schema.paths) {
          throw new Error(`Document paths not set`);
        }
        if (!schema.paths[path]) {
          throw new Error(`Document path ${path} not found`);
        }
        setSchema(schema.paths[path][method]);
      } catch (err) {
        console.error("Error loading markdown file:", err);
      }
    }
    loadJsonSchema();
  }, []);

  return schema;
}
