import type { OpenAPIV3 } from "@scalar/openapi-types";
import { replaceVariablesInApiPath } from "./replaceVariablesInApiPath";

export function replaceVariablesForScalar(
  apiDocument: OpenAPIV3.Document,
  apiName: "fdi" | "cdi",
  variables: Record<string, string>,
) {
  let parsedDocument = { ...apiDocument };
  const serverUrl = apiName === "fdi" ? variables.apiDomain : variables.coreDomain;
  parsedDocument.servers = [{ url: serverUrl }];

  const pathParams = {
    apiBasePath: variables.apiBasePath,
    tenantId: variables.tenantId,
    appId: variables.appId,
  };

  const pathsToRemove: string[] = [];

  // If the request parameters sepecifies an "examaple" value
  // it will get rendered wrong by the API client (it makes you choose from a floating menu)
  // We use "default" instead to force the element to be a simple text input
  for (const path in parsedDocument.paths) {
    for (const method in parsedDocument.paths[path]) {
      const operation = parsedDocument.paths[path][method];
      if (!operation.parameters) continue;
      operation.parameters = operation.parameters
        .map((param: any) => {
          let defaultValue: string = "";
          if (!param.schema) return param;
          if (param.example) {
            defaultValue = param.example;
            delete param.example;
          }
          if (param.schema && param.schema.example) {
            defaultValue = param.schema.example;
            delete param.schema.example;
          }
          param.schema.default = pathParams[param.name] || defaultValue;
          return param;
        })
        .filter((param) => {
          // Scalar doesn't play well witht our custom paths
          // We build a custom path based on the config values and omit those in the API client
          if (pathParams[param.name]) return false;
          return true;
        });

      parsedDocument.paths[replaceVariablesInApiPath(path, pathParams)] = parsedDocument.paths[path];
      pathsToRemove.push(path);
    }
  }

  return parsedDocument;
}
