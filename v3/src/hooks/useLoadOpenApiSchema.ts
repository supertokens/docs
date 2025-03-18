import { useEffect, useState, lazy } from "react";
import { APIRequest } from "../types";

export function useLoadOpenApiSchema(apiName: "cdi" | "fdi", path: string, method: string): APIRequest | null {
  const [schema, setSchema] = useState<APIRequest | null>(null);

  useEffect(() => {
    async function loadJsonSchema() {
      let parsedApiPath = path.startsWith("/") ? path.slice(1) : path;
      parsedApiPath = parsedApiPath.replaceAll("/", "_");
      try {
        const response = await import(`@site/static/openapi/${apiName}/${method}-${parsedApiPath}.json`);
        setSchema(response.default as APIRequest);
      } catch (err) {
        console.error("Error loading markdown file:", err);
      }
    }
    loadJsonSchema();
  }, []);

  return schema;
}
