import { APIRequest } from "../types";
import { generateExampleFromAPIRequestSchema } from "./generateExampleFromAPIRequestSchema";

export function generateJSONSnippetFromAPIRequestResponse(responses: APIRequest["responses"]) {
  if (!responses) return "{}";
  const successAnswers = Object.keys(responses).filter((key) => key.startsWith("2"));
  const firstSuccessAnswer = successAnswers[0];
  const successAnswer = responses[firstSuccessAnswer];
  if (!successAnswer) return "{}";
  const applicationJsonContent = successAnswer.content?.["application/json"];
  if (!applicationJsonContent) return "{}";

  if (applicationJsonContent.examples) return JSON.stringify(applicationJsonContent.examples, null, 2);
  const schema = Array.isArray(applicationJsonContent.schema)
    ? applicationJsonContent.schema[0]
    : applicationJsonContent.schema;
  return JSON.stringify(generateExampleFromAPIRequestSchema(schema), null, 2);
}
