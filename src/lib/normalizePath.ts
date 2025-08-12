export function normalizePath(path: string): string {
  if (!path || typeof path !== "string") {
    return "/";
  }

  const normalizedPath = path.startsWith("/") ? path : "/" + path;
  const segments = normalizedPath.split("/").filter((segment) => segment.length > 0);
  const normalizedSegments: string[] = [];

  for (const segment of segments) {
    if (segment === ".") {
      continue;
    } else if (segment === "..") {
      if (normalizedSegments.length > 0) {
        normalizedSegments.pop();
      }
    } else {
      normalizedSegments.push(segment);
    }
  }

  const result = "/" + normalizedSegments.join("/");

  if (path.endsWith("/") && result !== "/" && !path.endsWith("./") && !path.endsWith("../")) {
    return result + "/";
  }

  return result;
}
