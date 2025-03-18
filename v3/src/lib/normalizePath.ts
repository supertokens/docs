export function normalizePath(path: string): string {
  return !path.startsWith("/") ? `/${path}` : path;
}
