import { algoliasearch } from "algoliasearch";

const client = algoliasearch("SBR5UR2Z16", "6cf5abcaa6e1b9c17fd0072cba2424ed").initIngestion({ region: "us" });

const objects = [
  {
    method: "GET",
    path: "/api/v1/user/me",
    summary: "Get user information",
    api: "CDI",
    objectID: "o",
  },
];

(async () => {
  const response = await client.push({
    indexName: "supertokens_api_reference",
    pushTaskPayload: {
      action: "addObject",
      records: objects,
    },
  });
  console.log(response);
})();
