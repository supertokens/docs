import { execFile as execFileCallback } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import ts from "typescript";

import { markGeneratedApiFencesInDirectory } from "./mark-generated-api-fences";

const execFile = promisify(execFileCallback);

export interface PluginRelease {
  packageName: `@supertokens-plugins/${string}`;
  version: string;
  sourceRevision?: string;
}

export const pluginReleases = [
  {
    packageName: "@supertokens-plugins/opentelemetry-nodejs",
    version: "0.1.2",
  },
  { packageName: "@supertokens-plugins/captcha-nodejs", version: "0.2.1" },
  { packageName: "@supertokens-plugins/captcha-react", version: "0.3.1" },
  { packageName: "@supertokens-plugins/user-banning-nodejs", version: "0.2.1" },
  { packageName: "@supertokens-plugins/user-banning-react", version: "0.2.1" },
  { packageName: "@supertokens-plugins/profile-base-react", version: "0.1.0" },
  { packageName: "@supertokens-plugins/profile-details-nodejs", version: "0.1.0" },
  { packageName: "@supertokens-plugins/profile-details-react", version: "0.1.0" },
  { packageName: "@supertokens-plugins/progressive-profiling-nodejs", version: "0.3.0" },
  { packageName: "@supertokens-plugins/progressive-profiling-react", version: "0.3.1" },
  { packageName: "@supertokens-plugins/tenant-discovery-nodejs", version: "0.2.1" },
  {
    packageName: "@supertokens-plugins/tenant-discovery-react",
    version: "0.1.0",
    // npm 0.1.0 has no corresponding repository tag. Pin its published gitHead instead.
    sourceRevision: "8cc15ce39767b9c82604ab8ee8979080af3a86c4",
  },
  { packageName: "@supertokens-plugins/tenants-nodejs", version: "0.2.0" },
  { packageName: "@supertokens-plugins/tenants-react", version: "0.2.0" },
] as const satisfies readonly PluginRelease[];

interface PackedPackageJson {
  name: string;
  version: string;
  types: string;
}

export interface PublicExport {
  name: string;
  kind: string;
  rootSyntax: string;
  declaration?: string;
  localName?: string;
}

export interface SignatureType {
  name: string;
  declaration: string;
}

export interface PluginApiAnalysis {
  exports: PublicExport[];
  signatureTypes: SignatureType[];
  privateImports: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parsePackedPackageJson(value: unknown): PackedPackageJson {
  if (!isRecord(value) || typeof value.name !== "string" || typeof value.version !== "string") {
    throw new Error("Packed plugin package.json is missing a string name or version");
  }

  const types =
    typeof value.types === "string" ? value.types : typeof value.typings === "string" ? value.typings : null;
  if (types === null) {
    throw new Error(`${value.name}@${value.version} does not declare a root types entry`);
  }

  return { name: value.name, version: value.version, types };
}

export function releaseSourceUrl(release: PluginRelease): string {
  const packageDirectory = release.packageName.slice("@supertokens-plugins/".length);
  const revision = release.sourceRevision ?? encodeURIComponent(`${release.packageName}@${release.version}`);
  return `https://github.com/supertokens/supertokens-plugins/blob/${revision}/packages/${packageDirectory}/src/index.ts`;
}

function declarationStatement(node: ts.Declaration): ts.DeclarationStatement | ts.VariableStatement {
  if (ts.isVariableDeclaration(node)) {
    const statement = node.parent.parent;
    if (ts.isVariableStatement(statement)) return statement;
    throw new Error("A declaration-file variable must belong to a variable statement");
  }
  if (ts.isDeclarationStatement(node)) return node;
  throw new Error(`Unsupported declaration kind: ${ts.SyntaxKind[node.kind]}`);
}

function symbolKind(symbol: ts.Symbol): string {
  if (symbol.flags & ts.SymbolFlags.TypeAlias) return "Type";
  if (symbol.flags & ts.SymbolFlags.Interface) return "Interface";
  if (symbol.flags & ts.SymbolFlags.Class) return "Class";
  if (symbol.flags & ts.SymbolFlags.Function) return "Function";
  if (symbol.flags & ts.SymbolFlags.Variable) return "Constant";
  return "Export";
}

function exportedNames(checker: ts.TypeChecker, statement: ts.ExportDeclaration): readonly string[] {
  if (statement.exportClause !== undefined) {
    if (ts.isNamespaceExport(statement.exportClause)) return [statement.exportClause.name.text];
    return statement.exportClause.elements.map((element) => element.name.text);
  }
  if (statement.moduleSpecifier === undefined) return [];
  const moduleSymbol = checker.getSymbolAtLocation(statement.moduleSpecifier);
  return moduleSymbol === undefined ? [] : checker.getExportsOfModule(moduleSymbol).map((symbol) => symbol.name);
}

function rootExportStatement(
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
  exportName: string,
  targetDeclarations: readonly ts.Declaration[],
): ts.Statement | undefined {
  for (const statement of sourceFile.statements) {
    if (ts.isExportDeclaration(statement) && exportedNames(checker, statement).includes(exportName)) return statement;
    if (exportName === "default" && ts.isExportAssignment(statement)) return statement;
    if (targetDeclarations.some((declaration) => declarationStatement(declaration) === statement)) {
      const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
      if (modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) return statement;
    }
  }
  return undefined;
}

function isPrivateMember(member: ts.ClassElement): boolean {
  const modifiers = ts.canHaveModifiers(member) ? ts.getModifiers(member) : undefined;
  return (
    modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.PrivateKeyword) === true ||
    (member.name !== undefined && ts.isPrivateIdentifier(member.name))
  );
}

function visitPublicDeclaration(node: ts.Node, visitor: (node: ts.Node) => void): void {
  visitor(node);
  if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
    node.members
      .filter((member) => !isPrivateMember(member))
      .forEach((member) => visitPublicDeclaration(member, visitor));
    return;
  }
  node.forEachChild((child) => visitPublicDeclaration(child, visitor));
}

function renderStatement(statement: ts.DeclarationStatement | ts.VariableStatement): string {
  if (!ts.isClassDeclaration(statement)) return statement.getText(statement.getSourceFile());
  const publicClass = ts.factory.updateClassDeclaration(
    statement,
    statement.modifiers,
    statement.name,
    statement.typeParameters,
    statement.heritageClauses,
    statement.members.filter((member) => !isPrivateMember(member)),
  );
  return ts.createPrinter().printNode(ts.EmitHint.Unspecified, publicClass, statement.getSourceFile());
}

function statementName(statement: ts.DeclarationStatement | ts.VariableStatement): string {
  if (ts.isVariableStatement(statement)) {
    return statement.declarationList.declarations.map((declaration) => declaration.name.getText()).join(", ");
  }
  return statement.name?.getText(statement.getSourceFile()) ?? "Supporting declaration";
}

function containingImport(node: ts.Node): ts.ImportDeclaration | undefined {
  let current: ts.Node | undefined = node;
  while (current !== undefined && !ts.isSourceFile(current)) {
    if (ts.isImportDeclaration(current)) return current;
    current = current.parent;
  }
  return undefined;
}

function statementKey(statement: ts.Node): string {
  return `${resolve(statement.getSourceFile().fileName)}:${statement.pos}:${statement.end}`;
}

function isPackageDeclaration(declaration: ts.Declaration, packagePrefix: string): boolean {
  return resolve(declaration.getSourceFile().fileName).startsWith(packagePrefix);
}

function declarationContext(
  checker: ts.TypeChecker,
  statement: ts.Node,
): { imports: ts.ImportDeclaration[]; dependencies: Array<ts.DeclarationStatement | ts.VariableStatement> } {
  const imports = new Map<string, ts.ImportDeclaration>();
  const dependencies = new Map<string, ts.DeclarationStatement | ts.VariableStatement>();
  visitPublicDeclaration(statement, (node) => {
    if (!ts.isIdentifier(node)) return;
    const symbol = ts.isExportSpecifier(node.parent)
      ? (checker.getExportSpecifierLocalTargetSymbol(node.parent) ?? checker.getSymbolAtLocation(node))
      : checker.getSymbolAtLocation(node);
    if (symbol === undefined) return;
    for (const declaration of symbol.declarations ?? []) {
      const importDeclaration = containingImport(declaration);
      if (importDeclaration !== undefined) imports.set(statementKey(importDeclaration), importDeclaration);
    }
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    for (const declaration of target.declarations ?? []) {
      try {
        const dependency = declarationStatement(declaration);
        if (dependency !== statement) dependencies.set(statementKey(dependency), dependency);
      } catch {
        // Import/export specifiers provide context but are not declarations to render.
      }
    }
  });
  return { imports: [...imports.values()], dependencies: [...dependencies.values()] };
}

function renderWithContext(checker: ts.TypeChecker, statement: ts.DeclarationStatement | ts.VariableStatement): string {
  const { imports } = declarationContext(checker, statement);
  return [...imports.map((item) => item.getText(item.getSourceFile())), renderStatement(statement)].join("\n");
}

function renderRootSyntax(checker: ts.TypeChecker, statement: ts.Statement): string {
  if (ts.isDeclarationStatement(statement) || ts.isVariableStatement(statement)) {
    return renderWithContext(checker, statement);
  }
  const { imports } = declarationContext(checker, statement);
  return [
    ...imports.map((item) => item.getText(item.getSourceFile())),
    statement.getText(statement.getSourceFile()),
  ].join("\n");
}

function moduleSpecifiers(sourceFile: ts.SourceFile): string[] {
  const modules = new Set<string>();
  const visit = (node: ts.Node): void => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier !== undefined &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      modules.add(node.moduleSpecifier.text);
    }
    if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) {
      modules.add(node.argument.literal.text);
    }
    node.forEachChild(visit);
  };
  visit(sourceFile);
  return [...modules];
}

function isPrivateModule(moduleName: string): boolean {
  return moduleName.startsWith("@shared/") || /^@supertokens-plugins\/.+-shared(?:\/|$)/.test(moduleName);
}

function diagnosticModule(diagnostic: ts.Diagnostic): string | undefined {
  if (diagnostic.code !== 2307) return undefined;
  return ts
    .flattenDiagnosticMessageText(diagnostic.messageText, "\n")
    .match(/Cannot find module ['"]([^'"]+)['"]/)?.[1];
}

export function analyzePublicApi(rootDeclarationPath: string, packageDirectory: string): PluginApiAnalysis {
  const program = ts.createProgram([rootDeclarationPath], {
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    strict: true,
    skipLibCheck: false,
  });
  const sourceFile = program.getSourceFile(rootDeclarationPath);
  if (sourceFile === undefined) throw new Error(`Could not load root declaration ${rootDeclarationPath}`);

  const checker = program.getTypeChecker();
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  if (moduleSymbol === undefined) throw new Error(`${rootDeclarationPath} is not an external module`);

  const packagePrefix = `${resolve(packageDirectory)}${sep}`;
  const rootStatements = new Set<string>();
  const targetStatements = new Set<string>();
  const dependencyStatements = new Map<string, ts.DeclarationStatement | ts.VariableStatement>();
  const exports = checker
    .getExportsOfModule(moduleSymbol)
    .map((exportedSymbol): PublicExport => {
      const target =
        exportedSymbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exportedSymbol) : exportedSymbol;
      const packageDeclarations = (target.declarations ?? []).filter((declaration) =>
        isPackageDeclaration(declaration, packagePrefix),
      );
      const statements = packageDeclarations.map(declarationStatement);
      statements.forEach((statement) => targetStatements.add(statementKey(statement)));
      const rootStatement = rootExportStatement(checker, sourceFile, exportedSymbol.name, packageDeclarations);
      if (rootStatement === undefined) {
        throw new Error(`Could not locate the emitted declaration for root export ${exportedSymbol.name}`);
      }
      rootStatements.add(statementKey(rootStatement));

      for (const statement of statements) {
        const pending = [statement];
        const visited = new Set<string>();
        while (pending.length > 0) {
          const current = pending.pop();
          if (current === undefined || visited.has(statementKey(current))) continue;
          visited.add(statementKey(current));
          for (const dependency of declarationContext(checker, current).dependencies) {
            if (!resolve(dependency.getSourceFile().fileName).startsWith(packagePrefix)) continue;
            dependencyStatements.set(statementKey(dependency), dependency);
            pending.push(dependency);
          }
        }
      }

      const rootContext = renderRootSyntax(checker, rootStatement);
      const declarations = statements.map((statement) => renderWithContext(checker, statement));

      return {
        name: exportedSymbol.name,
        kind: symbolKind(target),
        rootSyntax: rootContext,
        declaration: declarations.length === 0 ? undefined : [...new Set(declarations)].join("\n"),
        localName: target.name === exportedSymbol.name ? undefined : target.name,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));

  const signatureTypes = [...dependencyStatements.entries()]
    .filter(([key]) => !targetStatements.has(key) && !rootStatements.has(key))
    .map(([, statement]) => ({
      name: statementName(statement),
      declaration: renderWithContext(checker, statement),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
  const graphPrivateImports = program
    .getSourceFiles()
    .filter((file) => file.isDeclarationFile && resolve(file.fileName).startsWith(packagePrefix))
    .flatMap(moduleSpecifiers)
    .filter(isPrivateModule);
  const diagnosticPrivateImports = ts
    .getPreEmitDiagnostics(program)
    .map(diagnosticModule)
    .filter((moduleName): moduleName is string => moduleName !== undefined && isPrivateModule(moduleName));

  return {
    exports,
    signatureTypes,
    privateImports: [...new Set([...graphPrivateImports, ...diagnosticPrivateImports])].sort(),
  };
}

export function collectPublicRootExports(rootDeclarationPath: string, packageDirectory: string): PublicExport[] {
  return analyzePublicApi(rootDeclarationPath, packageDirectory).exports;
}

function protocolVersion(exports: readonly PublicExport[]): string | undefined {
  const declaration = exports.find((item) => item.name === "PLUGIN_VERSION")?.declaration;
  return declaration?.match(/PLUGIN_VERSION\s*=\s*(["'][^"']+["'])/)?.[1];
}

export function renderPluginReference(
  release: PluginRelease,
  rootDeclaration: string,
  analysis: PluginApiAnalysis,
): string {
  const sourceUrl = releaseSourceUrl(release);
  const { exports, signatureTypes, privateImports } = analysis;
  const versionConstant = protocolVersion(exports);
  const exportRows = exports.map(({ name, kind }) => `| \`${name}\` | ${kind} |`).join("\n");
  const sections = exports
    .map(({ name, rootSyntax, declaration, localName }) => {
      const alias = localName === undefined ? "" : `\n\nPublished from the emitted \`${localName}\` declaration.`;
      const resolved =
        declaration === undefined || declaration === rootSyntax
          ? ""
          : `\n\nResolved declaration:\n\n\`\`\`ts check=false reason="Generated API signature"\n${declaration}\n\`\`\``;
      return `## \`${name}\`${alias}\n\nRoot export:\n\n\`\`\`ts check=false reason="Generated API signature"\n${rootSyntax}\n\`\`\`${resolved}`;
    })
    .join("\n\n");
  const supportingDeclarations =
    signatureTypes.length === 0
      ? ""
      : `\n\n## Required signature types\n\nThese declarations are not additional package-root exports. They are included because the public signatures above depend on them.\n\n${signatureTypes
          .map(
            ({ name, declaration }) =>
              `### \`${name}\`\n\n\`\`\`ts check=false reason="Generated API signature"\n${declaration}\n\`\`\``,
          )
          .join("\n\n")}`;
  const blocker =
    privateImports.length === 0
      ? ""
      : `\n:::caution\nThis release's declaration graph imports unpublished workspace modules (${privateImports.map((item) => `\`${item}\``).join(", ")}). The generator detected these imports from the packed declaration graph and strict compiler diagnostics. This upstream packaging defect cannot be fixed by the reference generator; do not enable \`skipLibCheck\` to hide it.\n:::\n`;
  const protocol =
    versionConstant === undefined
      ? ""
      : `\n**Plugin protocol version (\`PLUGIN_VERSION\`):** \`${versionConstant.slice(1, -1)}\`\n\nThe protocol version is an internal plugin compatibility constant. It is not the npm package version.\n`;

  return `---
title: "${release.packageName}"
description: "Public root exports for ${release.packageName} ${release.version}."
---

**Package version:** \`${release.version}\`
${protocol}
Generated from the packed release's root declaration, \`${rootDeclaration}\`. Only exports reachable from that root are
listed. See the [immutable release source](${sourceUrl}).
${blocker}
## Public root exports

| Export | Kind |
| --- | --- |
${exportRows}

${sections}${supportingDeclarations}
`;
}

async function packRelease(release: PluginRelease, workDirectory: string): Promise<string> {
  const packageSpec = `${release.packageName}@${release.version}`;
  const { stdout } = await execFile("npm", ["pack", packageSpec, "--pack-destination", workDirectory, "--silent"]);
  const archiveName = stdout.trim().split("\n").at(-1);
  if (!archiveName) throw new Error(`npm pack did not return an archive for ${packageSpec}`);

  const extractDirectory = join(workDirectory, release.packageName.split("/").at(-1) ?? release.packageName);
  await mkdir(extractDirectory, { recursive: true });
  await execFile("tar", ["-xzf", join(workDirectory, archiveName), "-C", extractDirectory]);
  return join(extractDirectory, "package");
}

async function generateRelease(release: PluginRelease, workDirectory: string, outputDirectory: string): Promise<void> {
  const packageDirectory = await packRelease(release, workDirectory);
  const packageJsonPath = join(packageDirectory, "package.json");
  const packageJson = parsePackedPackageJson(JSON.parse(await readFile(packageJsonPath, "utf8")) as unknown);
  if (packageJson.name !== release.packageName || packageJson.version !== release.version) {
    throw new Error(
      `Packed ${packageJson.name}@${packageJson.version}; expected ${release.packageName}@${release.version}`,
    );
  }

  const rootDeclarationPath = resolve(packageDirectory, packageJson.types);
  const relativeRoot = relative(packageDirectory, rootDeclarationPath);
  if (relativeRoot.startsWith("..") || relativeRoot === "") {
    throw new Error(`${release.packageName} has an invalid root declaration path: ${packageJson.types}`);
  }

  const analysis = analyzePublicApi(rootDeclarationPath, packageDirectory);
  const outputName = `${basename(release.packageName)}.mdx`;
  await writeFile(
    join(outputDirectory, outputName),
    renderPluginReference(release, packageJson.types, analysis),
    "utf8",
  );
}

export async function generatePluginReferences(outputDirectory = "docs/references/plugins"): Promise<void> {
  const workDirectory = await mkdtemp(join(tmpdir(), "supertokens-plugin-references-"));
  try {
    await mkdir(outputDirectory, { recursive: true });
    await Promise.all(pluginReleases.map((release) => generateRelease(release, workDirectory, outputDirectory)));
    await Promise.all(
      ["profile-details-shared.mdx", "progressive-profiling-shared.mdx"].map((file) =>
        rm(join(outputDirectory, file), { force: true }),
      ),
    );
    await markGeneratedApiFencesInDirectory(outputDirectory);
  } finally {
    await rm(workDirectory, { recursive: true, force: true });
  }
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  await generatePluginReferences();
}
