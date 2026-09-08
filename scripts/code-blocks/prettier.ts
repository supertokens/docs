import path from "node:path";

import { format, resolveConfig, type Options } from "prettier";

const prettierParsers: Partial<Record<string, string>> = {
  ts: "typescript",
  tsx: "typescript",
  typescript: "typescript",
  js: "babel",
  javascript: "babel",
  json: "json",
  yaml: "yaml",
  html: "html",
};

const prettierConfigCache = new Map<string, Promise<Options>>();

export function getCodeBlockPrettierParser(language: string): string | undefined {
  return prettierParsers[language];
}

export async function formatCodeBlockWithPrettier(
  value: string,
  language: string,
  sourcePath: string,
): Promise<string | undefined> {
  const parser = getCodeBlockPrettierParser(language);
  if (!parser) return undefined;

  const config = await resolvePrettierConfig(sourcePath);
  return (await format(value, { ...config, parser })).replace(/\r\n?/g, "\n").replace(/\n$/, "");
}

async function resolvePrettierConfig(sourcePath: string): Promise<Options> {
  const key = path.resolve(sourcePath);
  let config = prettierConfigCache.get(key);
  if (!config) {
    config = resolveConfig(key, { editorconfig: true }).then((resolved) => resolved ?? {});
    prettierConfigCache.set(key, config);
  }
  return config;
}
