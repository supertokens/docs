import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { markGeneratedApiFences, markGeneratedApiFencesInDirectory } from "./mark-generated-api-fences";

const markedFence = '```ts check=false reason="Generated API signature"';

describe("markGeneratedApiFences", () => {
  it("marks direct API symbols regardless of their names", () => {
    const source = `## Functions

### Example()

\`\`\`ts
function Example(): void;
\`\`\`

### Examples()

\`\`\`ts
function Examples(): void;
\`\`\`

## Type Aliases

### Input

\`\`\`ts
type Input = object;
\`\`\`

## Variables

### VERSION

\`\`\`ts
const VERSION: string;
\`\`\`
`;

    const marked = markGeneratedApiFences(source);

    expect(marked.match(/reason="Generated API signature"/gu)).toHaveLength(4);
    expect(marked).toContain(`${markedFence}\nfunction Example`);
    expect(marked).toContain(`${markedFence}\nfunction Examples`);
  });

  it("marks separate symbols that have the same generated heading", () => {
    const source = `## Variables

### default

\`\`\`ts
const first: string;
\`\`\`

### default

\`\`\`ts
const second: string;
\`\`\`
`;

    expect(markGeneratedApiFences(source).match(/reason="Generated API signature"/gu)).toHaveLength(2);
  });

  it("marks class and interface member signatures", () => {
    const source = `## Classes

### Client

#### Constructors

##### Constructor

\`\`\`ts
new Client(): Client;
\`\`\`

#### Methods

##### Example()

\`\`\`ts
Example(): void;
\`\`\`

## Interfaces

### Handler

#### Call Signature

\`\`\`ts
(input: string): void;
\`\`\`

### Dictionary

#### Indexable

\`\`\`ts
[key: string]: string
\`\`\`

### Service

#### Methods

##### run()

\`\`\`ts
run(): void;
\`\`\`
`;

    expect(markGeneratedApiFences(source).match(/reason="Generated API signature"/gu)).toHaveLength(5);
  });

  it("marks every overload in an explicit signature section", () => {
    const source = `## Classes

### Client

#### Methods

##### signIn()

###### Call Signature

\`\`\`ts
static signIn(email: string): void;
\`\`\`

###### Call Signature

\`\`\`ts
static signIn(email: string, tenantId: string): void;
\`\`\`
`;

    expect(markGeneratedApiFences(source).match(/reason="Generated API signature"/gu)).toHaveLength(2);
  });

  it.each(["Implementation of", "Overrides"])("marks generated member type references under %s", (section) => {
    const source = `## Classes

### Client

#### Methods

##### run()

###### ${section}

\`\`\`ts
BaseClient<T>.run
\`\`\`
`;

    expect(markGeneratedApiFences(source)).toContain(`${markedFence}\nBaseClient<T>.run`);
  });

  it.each(["Summary", "Remarks", "Usage", "Example", "Examples", "Example: Basic setup"])(
    "keeps runnable fences in %s sections checked",
    (section) => {
      const source = `## Functions

### createSession()

\`\`\`ts
function createSession(): void;
\`\`\`

#### ${section}

\`\`\`ts check=false reason="Generated API signature"
createSession();
\`\`\`
`;

      const marked = markGeneratedApiFences(source);
      expect(marked).toContain(`${markedFence}\nfunction createSession`);
      expect(marked).toContain("```ts\ncreateSession();");
    },
  );

  it("keeps runnable summary fences after a direct symbol signature checked", () => {
    const source = `## Functions

### createSession()

\`\`\`ts
function createSession(): void;
\`\`\`

Call the function after initialization:

\`\`\`ts check=false reason="Generated API signature"
createSession();
\`\`\`
`;

    const marked = markGeneratedApiFences(source);
    expect(marked.match(/reason="Generated API signature"/gu)).toHaveLength(1);
    expect(marked).toContain("```ts\ncreateSession();");
  });

  it("does not modify hand-authored reference pages", () => {
    const source = `## Example

\`\`\`ts
SuperTokens.init({});
\`\`\`
`;

    expect(markGeneratedApiFences(source)).toBe(source);
  });

  it("reports changed files once and is idempotent on a directory", async () => {
    const tempRoot = await mkdtemp(path.join(os.tmpdir(), "generated-api-fences-"));
    const nestedRoot = path.join(tempRoot, "nested");
    const generatedPath = path.join(nestedRoot, "generated.mdx");
    await mkdir(nestedRoot);
    await writeFile(generatedPath, "## Functions\n\n### run()\n\n```ts\nfunction run(): void;\n```\n");
    await writeFile(path.join(tempRoot, "hand-authored.mdx"), "## Example\n\n```ts\nrun();\n```\n");

    await expect(markGeneratedApiFencesInDirectory(tempRoot)).resolves.toBe(1);
    const once = await readFile(generatedPath, "utf8");
    await expect(markGeneratedApiFencesInDirectory(tempRoot)).resolves.toBe(0);
    expect(await readFile(generatedPath, "utf8")).toBe(once);
  });
});
