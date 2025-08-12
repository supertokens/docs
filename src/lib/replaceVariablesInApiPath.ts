import { normalizePath } from "./normalizePath";

export function replaceVariablesInApiPath(path: string, variables: Record<string, string>) {
  let parsedPath = path;
  for (const key in variables) {
    parsedPath = parsedPath.replace(`{${key}}`, variables[key]);
  }
  return normalizePath(parsedPath);
}
