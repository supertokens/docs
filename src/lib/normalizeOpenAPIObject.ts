import type { OpenAPIV3 } from "@scalar/openapi-types";

export function normalizeOpenAPIObject(schema: OpenAPIV3.SchemaObject) {
  if (!schema.allOf) return schema;

  const acc: OpenAPIV3.SchemaObject = {
    type: "object",
    name: schema.name,
    properties: {},
  };

  for (const item of schema.allOf) {
    acc.properties = { ...acc.properties, ...item.properties };
  }

  if (schema.oneOf) {
    acc.oneOf = schema.oneOf.map((item) => {
      return { type: "object", properties: { ...item.properties, ...acc.properties } };
    });
    delete acc.properties;
  }

  return acc;
}
