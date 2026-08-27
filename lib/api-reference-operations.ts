export const apiReferenceOperationIds = [
  "importOneUserWithBulkImport",
  "addBulkImportUsers",
  "countBulkImportUsers",
  "getBulkImportUsers",
] as const;

export type ApiReferenceOperationId = (typeof apiReferenceOperationIds)[number];
