import * as yaml from "js-yaml";
import * as fs from "fs";

import { parseOpenApiRequest } from "../src/lib/parseOpenApiRequest";
import { APIRequestMethod } from "../src/types";

const API_NAME = "fdi";

function parseOpenApiSchema() {
  const schemaPath = `./static/openapi/${API_NAME}/schema.yml`;
  const yamlContent = fs.readFileSync(schemaPath, "utf8");
  const openApiSpec = yaml.load(yamlContent);

  for (const path in openApiSpec.paths) {
    for (const method in openApiSpec.paths[path]) {
      const request = parseOpenApiRequest(openApiSpec, path, method as APIRequestMethod);
      let parsedRequestPath = path.startsWith("/") ? path.substring(1) : path;
      parsedRequestPath = parsedRequestPath.replaceAll("/", "_");

      fs.writeFileSync(
        `./static/openapi/${API_NAME}/${method.toLowerCase()}-${parsedRequestPath}.json`,
        JSON.stringify(request, null, 2),
      );
    }
  }
}

parseOpenApiSchema();
