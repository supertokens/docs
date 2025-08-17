import { ExtractSDKReferences } from "./extract-references";
import { Repository } from "./types";
import { Application, ProjectReflection, DeclarationReflection } from "typedoc";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export class ExtractTypeScriptReferences extends ExtractSDKReferences {
  constructor(repository: Repository) {
    super();
    this.repository = repository;
  }

  async extract(): Promise<void> {
    // await this.cloneRepository(this.repository);

    const app = await Application.bootstrapWithPlugins({
      entryPoints: this.repository.files.map((file) => join("./tmp", this.repository.name, file.path)),
      excludeExternals: false,
      excludePrivate: true,
      excludeProtected: false,
      excludeInternal: false,
      skipErrorChecking: true,
      treatWarningsAsErrors: false,
      includeVersion: true,
      sourceLinkTemplate: "https://github.com/{packageName}/blob/master/{path}#L{line}",
      gitRevision: "master",
    });

    const project = await app.convert();

    if (!project) {
      throw new Error("Failed to convert TypeScript project");
    }

    const jsonOutput = await app.serializer.projectToObject(project, process.cwd());

    // Post-process to enrich reference types with source information
    const enrichedOutput = this.enrichReferencesWithSources(jsonOutput, project);

    const outputDir = "./tmp/sdk-references";
    await mkdir(outputDir, { recursive: true });

    const outputPath = join(outputDir, `${this.repository.name}.json`);
    await writeFile(outputPath, JSON.stringify(enrichedOutput, null, 2));

    console.log(`Generated SDK references for ${this.repository.name} at ${outputPath}`);
  }

  private enrichReferencesWithSources(jsonOutput: any, project: ProjectReflection): any {
    // Create a map of reflection IDs to their source information
    const sourceMap = new Map<number, any>();

    const collectSources = (reflection: any) => {
      if (reflection.sources && reflection.sources.length > 0) {
        sourceMap.set(reflection.id, {
          fileName: reflection.sources[0].fileName,
          line: reflection.sources[0].line,
          character: reflection.sources[0].character,
        });
      }

      if (reflection.children) {
        reflection.children.forEach(collectSources);
      }
    };

    // Collect all source information
    if (jsonOutput.children) {
      jsonOutput.children.forEach(collectSources);
    }

    // Recursively enrich reference types with source information
    const enrichReferences = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(enrichReferences);
      }

      if (obj && typeof obj === "object") {
        // Check if this is a reference type
        if (obj.type === "reference" && obj.target && typeof obj.target === "number") {
          const sourceInfo = sourceMap.get(obj.target);
          if (sourceInfo) {
            return {
              ...obj,
              target: {
                ...obj.target,
                source: {
                  fileName: sourceInfo.fileName.replace(process.cwd() + "/tmp/" + this.repository.name + "/", ""),
                  line: sourceInfo.line,
                  character: sourceInfo.character,
                },
              },
            };
          }
        }

        // Recursively process all properties
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = enrichReferences(value);
        }
        return result;
      }

      return obj;
    };

    return enrichReferences(jsonOutput);
  }
}

(async () => {
  const repository: Repository = {
    url: "https://github.com/supertokens/supertokens-node",
    files: [
      { path: "./lib/ts/index.ts", alias: "SuperTokens" },
      { path: "./lib/ts/recipe/accountlinking/index.ts", alias: "AccountLinking" },
      // { path: "./lib/ts/recipe/dashboard/index.ts", alias: "Dashboard" },
      // { path: "./lib/ts/recipe/emailpassword/index.ts", alias: "EmailPassword" },
      // { path: "./lib/ts/recipe/emailverification/index.ts", alias: "EmailVerification" },
      // { path: "./lib/ts/recipe/jwt/index.ts", alias: "JWT" },
      // { path: "./lib/ts/recipe/multifactorauth/index.ts", alias: "MultiFactorAuth" },
      // { path: "./lib/ts/recipe/multitenancy/index.ts", alias: "MultiTenancy" },
      // { path: "./lib/ts/recipe/oauth/index.ts", alias: "OAuth" },
      // { path: "./lib/ts/recipe/openid/index.ts", alias: "OpenID" },
      // { path: "./lib/ts/recipe/passwordless/index.ts", alias: "Passwordless" },
    ],
    name: "supertokens-node",
    language: "typescript",
  };

  const extractor = new ExtractTypeScriptReferences(repository);
  await extractor.extract();
})();
