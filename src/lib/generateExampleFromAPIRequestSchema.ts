import { APIRequestSchema } from "../types";

export function generateExampleFromAPIRequestSchema(schema: APIRequestSchema) {
  if (schema.example) return schema.example;
  if (schema.enum) return schema.enum[0];
  if (schema.type === "array") {
    const example = generateExampleFromAPIRequestSchema(schema.items);
    return [example];
  }

  if (schema.type === "object" && schema.properties) {
    const example: Record<string, any> = {};
    for (const key in schema.properties) {
      example[key] = generateExampleFromAPIRequestSchema(schema.properties[key]);
    }

    return example;
  }

  return {};
}
