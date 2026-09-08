import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";
import { format, resolveConfig } from "prettier";

import { configuredRedirects } from "../blume/configured-redirects.mjs";

const repositoryRoot = path.resolve(import.meta.dirname, "../..");
const defaultInput = path.resolve(repositoryRoot, "../supertokens-backend-website/app/src/routeRedirects.ts");
const defaultOutput = path.join(repositoryRoot, "scripts/migration/legacy-redirects.ts");
const routeManifestPath = path.join(repositoryRoot, "scripts/blume/route-manifest.json");

const stringProperty = (object, name) => {
  const property = object.properties.find(
    (candidate) => ts.isPropertyAssignment(candidate) && candidate.name.getText().replaceAll(/["']/g, "") === name,
  );
  return property && ts.isStringLiteralLike(property.initializer) ? property.initializer.text : undefined;
};

export const parseRedirects = (source) => {
  const file = ts.createSourceFile("routeRedirects.ts", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let redirects;

  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText() === "RouteRedirects" &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      redirects = node.initializer.elements.flatMap((element) => {
        if (!ts.isObjectLiteralExpression(element)) return [];
        const from = stringProperty(element, "from");
        const to = stringProperty(element, "to");
        const position = file.getLineAndCharacterOfPosition(element.getStart(file));
        return from && to
          ? [{ from, sourcePosition: { column: position.character + 1, line: position.line + 1 }, to }]
          : [];
      });
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(file);

  if (!redirects) throw new Error("Could not find the RouteRedirects array");
  return redirects;
};

const withoutDocsPrefix = (value) => {
  if (value === "/docs") return "/";
  return value.startsWith("/docs/") ? value.slice(5) : value;
};

const pathname = (value) => value.split(/[?#]/, 1)[0].replace(/\/$/, "") || "/";

const parseUrl = (value) => new URL(value, "https://docs.supertokens.invalid");

const mergeUrlSuffix = (target, incoming) => {
  const targetUrl = parseUrl(target);
  const incomingUrl = parseUrl(incoming);
  if (incomingUrl.search) targetUrl.search = incomingUrl.search;
  if (incomingUrl.hash) targetUrl.hash = incomingUrl.hash;
  return /^https?:\/\//.test(target)
    ? targetUrl.toString()
    : `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
};

export const applicableRedirects = (redirects, currentRoutes, aliases = configuredRedirects) => {
  const firstBySource = new Map();
  const duplicates = [];
  const crossSetDuplicates = [];
  const ignored = [];
  for (const redirect of redirects) {
    if (firstBySource.has(redirect.from)) {
      duplicates.push(redirect.from);
      ignored.push({
        from: redirect.from,
        reason: "duplicate-source",
        sourcePosition: redirect.sourcePosition,
        target: redirect.to,
      });
      continue;
    }
    firstBySource.set(redirect.from, redirect);
  }

  const aliasSources = new Set(aliases.map(({ from }) => withoutDocsPrefix(pathname(from))));
  const redirectsBySource = new Map();
  for (const redirect of firstBySource.values()) {
    redirectsBySource.set(withoutDocsPrefix(pathname(redirect.from)), redirect);
  }
  for (const alias of aliases) {
    redirectsBySource.set(withoutDocsPrefix(pathname(alias.from)), alias);
  }
  const resolveTarget = (initial) => {
    let target = initial;
    const seen = new Set();
    while (!/^https?:\/\//.test(target)) {
      const targetPathname = pathname(target);
      const source = withoutDocsPrefix(targetPathname);
      if (currentRoutes.has(source)) return { target };
      if (seen.has(source)) return { cycle: [...seen, source], target };
      const next = redirectsBySource.get(source);
      if (!next) return { target };
      seen.add(source);
      target = mergeUrlSuffix(next.to, target);
    }
    return { target };
  };

  const migrated = [];
  const retained = [];
  for (const [from, redirect] of firstBySource) {
    const migratedFrom = withoutDocsPrefix(from);
    if (aliasSources.has(pathname(migratedFrom))) {
      crossSetDuplicates.push(from);
      ignored.push({
        from,
        reason: "configured-alias-source",
        sourcePosition: redirect.sourcePosition,
        target: redirect.to,
      });
      continue;
    }
    const resolution = resolveTarget(redirect.to);
    const { target } = resolution;
    if (resolution.cycle) {
      ignored.push({
        cycle: resolution.cycle,
        from,
        reason: "redirect-cycle",
        sourcePosition: redirect.sourcePosition,
        target,
      });
      continue;
    }
    const targetPath = withoutDocsPrefix(pathname(target));
    if (!/^https?:\/\//.test(target) && !currentRoutes.has(targetPath)) {
      ignored.push({
        from,
        reason: "missing-target",
        sourcePosition: redirect.sourcePosition,
        target,
      });
      continue;
    }

    if (currentRoutes.has(pathname(migratedFrom))) {
      ignored.push({
        from,
        reason: "authored-source",
        sourcePosition: redirect.sourcePosition,
        target,
      });
      continue;
    }
    const migratedTarget = withoutDocsPrefix(target);
    migrated.push({ from: migratedFrom, to: migratedTarget });
    retained.push({
      from,
      sourcePosition: redirect.sourcePosition,
      target: migratedTarget,
    });
  }

  return { crossSetDuplicates, diagnostics: { ignored, retained }, duplicates, redirects: migrated };
};

export const renderGeneratedRedirects = async (result) => {
  const prettierConfig = (await resolveConfig(defaultOutput)) ?? {};
  return format(
    `// Generated by scripts/migration/generate-legacy-redirects.mjs. Do not edit.
// Duplicate sources intentionally preserve the first backend-website match.
export const legacyRedirects = ${JSON.stringify(result.redirects, null, 2)};
export const legacyRedirectDiagnostics = ${JSON.stringify(result.diagnostics, null, 2)} as const;
export const ignoredDuplicateLegacySources = ${JSON.stringify([...new Set(result.duplicates)], null, 2)} as const;
export const configuredAliasLegacySources = ${JSON.stringify([...new Set(result.crossSetDuplicates)], null, 2)} as const;
`,
    { ...prettierConfig, parser: "typescript" },
  );
};

export const generate = async ({ input = defaultInput, output = defaultOutput } = {}) => {
  const [source, manifestSource] = await Promise.all([
    fs.readFile(input, "utf8"),
    fs.readFile(routeManifestPath, "utf8"),
  ]);
  const manifest = JSON.parse(manifestSource);
  const currentRoutes = new Set(manifest.pages.map(({ route }) => route));
  const result = applicableRedirects(parseRedirects(source), currentRoutes);
  const generated = await renderGeneratedRedirects(result);
  await fs.writeFile(output, generated);
  return result;
};

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const result = await generate({ input: process.argv[2] });
  console.log(
    `Wrote ${result.redirects.length} redirects; recorded ${result.diagnostics.ignored.length} ignored entries`,
  );
}
