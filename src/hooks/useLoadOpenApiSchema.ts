import { useEffect, useState, lazy } from "react";

import type { OpenAPIV3 } from "@scalar/openapi-types";

// TODO: Cache the schema
export function useLoadOpenApiDocument(apiName: "cdi" | "fdi"): OpenAPIV3.PathItemObject | null {
  const [document, setDocument] = useState<OpenAPIV3.Document | null>(null);

  useEffect(() => {
    async function loadDocument() {
      try {
        const response = await import(`@site/static/${apiName}.json`);
        const document = response.default as OpenAPIV3.Document;
        if (!document.paths) {
          throw new Error(`Document paths not set`);
        }
        setDocument(document);
      } catch (err) {
        console.error("Error loading markdown file:", err);
      }
    }
    loadDocument();
  }, []);

  return document;
}
