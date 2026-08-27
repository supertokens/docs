export interface CompilableLanguage {
  kind: "compilable";
  folder: string;
  extension: string;
}

export interface RenderOnlyLanguage {
  kind: "render-only";
}

export type LanguageDefinition = CompilableLanguage | RenderOnlyLanguage;

export const languageRegistry = {
  ts: { kind: "compilable", folder: "javascript", extension: "ts" },
  tsx: { kind: "compilable", folder: "javascript", extension: "tsx" },
  typescript: { kind: "compilable", folder: "javascript", extension: "ts" },
  js: { kind: "compilable", folder: "javascript", extension: "js" },
  javascript: { kind: "compilable", folder: "javascript", extension: "js" },
  go: { kind: "compilable", folder: "go", extension: "go" },
  py: { kind: "compilable", folder: "python", extension: "py" },
  python: { kind: "compilable", folder: "python", extension: "py" },
  kotlin: { kind: "compilable", folder: "kotlin", extension: "kt" },
  swift: { kind: "compilable", folder: "swift", extension: "swift" },
  dart: { kind: "compilable", folder: "dart", extension: "dart" },
  php: { kind: "compilable", folder: "php", extension: "php" },
  java: { kind: "compilable", folder: "java", extension: "java" },
  csharp: { kind: "compilable", folder: "csharp", extension: "cs" },
  text: { kind: "render-only" },
  json: { kind: "render-only" },
  bash: { kind: "render-only" },
  html: { kind: "render-only" },
  yaml: { kind: "render-only" },
  sql: { kind: "render-only" },
  batch: { kind: "render-only" },
  xml: { kind: "render-only" },
  gradle: { kind: "render-only" },
  objc: { kind: "render-only" },
} as const satisfies Record<string, LanguageDefinition>;

export type RegisteredLanguage = keyof typeof languageRegistry;

export function getLanguageDefinition(language: unknown, sourcePath: string, sourceLine: number): LanguageDefinition {
  if (typeof language !== "string" || language.length === 0) {
    throw new Error(`${sourcePath}:${sourceLine}: code fence language must be a non-empty string`);
  }

  const definition = (languageRegistry as Record<string, LanguageDefinition>)[language];
  if (!definition) {
    throw new Error(`${sourcePath}:${sourceLine}: unknown code fence language '${language}'`);
  }

  return definition;
}

export const compilableLanguageFolders = [
  ...new Set(
    Object.values(languageRegistry).flatMap((definition) =>
      definition.kind === "compilable" ? [definition.folder] : [],
    ),
  ),
].sort();
