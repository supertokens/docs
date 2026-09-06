import { describe, expect, it } from "vitest";

import {
  canonicalSelectionUrl,
  decodeCompactSelection,
  DocsSelectionStore,
  encodeCompactSelection,
  ensureQuery,
  getCompactSelectionV1Schema,
  getCurrentSelectionQuerySchema,
  optionsForGroup,
  readCanonicalQuery,
  readContextualQuery,
  readQuery,
  resolveSelection,
  resolveSelectionState,
  selectedGroupValue,
  selectionQueryKey,
  selectionUrl,
  valuesForSelectionQuery,
} from "./docs-selection";

function compactSelection(url: string): ReturnType<typeof decodeCompactSelection> {
  return decodeCompactSelection(new URL(url, "https://example.com").searchParams.get("q"));
}

function memoryStorage(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
    values,
  };
}

function wrapper(options: Array<[value: string, title: string]>, active = true): HTMLElement {
  const panels = options.map(([tabId, title]) => ({ dataset: { tabId, title } }));
  return {
    closest: () => (active ? null : { hidden: true }),
    querySelectorAll: () => panels,
  } as unknown as HTMLElement;
}

function rootWith(...wrappers: HTMLElement[]): ParentNode {
  return { querySelectorAll: () => wrappers } as unknown as ParentNode;
}

describe("resolveSelection", () => {
  const availableValues = ["express", "fastify", "koa"];

  it("uses valid choices in query, migrated, stored, legacy, default, then first order", () => {
    expect(
      resolveSelection({
        availableValues,
        migratedValue: "fastify",
        storedValue: "koa",
        defaultValue: "express",
      }),
    ).toBe("fastify");
    expect(
      resolveSelection({ availableValues, storedValue: "koa", defaultValue: "fastify", legacyValue: "express" }),
    ).toBe("koa");
    expect(
      resolveSelection({ availableValues, storedValue: "invalid", defaultValue: "fastify", legacyValue: "express" }),
    ).toBe("express");
    expect(
      resolveSelection({ availableValues, storedValue: "invalid", defaultValue: "invalid", legacyValue: "express" }),
    ).toBe("express");
    expect(resolveSelection({ availableValues, storedValue: "invalid", defaultValue: "invalid" })).toBe("express");
  });

  it("gives a valid query value precedence and ignores an invalid one", () => {
    expect(resolveSelection({ availableValues, queryValue: "koa", storedValue: "fastify" })).toBe("koa");
    expect(resolveSelection({ availableValues, queryValue: "invalid", storedValue: "fastify" })).toBe("fastify");
  });

  it("keeps a globally valid query authoritative when unavailable locally", () => {
    expect(
      resolveSelection({
        availableValues: ["express"],
        queryAvailableValues: availableValues,
        queryValue: "koa",
        storedValue: "express",
      }),
    ).toBe("koa");
  });

  it("returns undefined when there are no choices", () => {
    expect(resolveSelection({ availableValues: [] })).toBeUndefined();
  });

  it("persists a valid migrated value over an existing stored value", () => {
    expect(
      resolveSelectionState({
        availableValues,
        migratedValue: "fastify",
        storedValue: "koa",
      }),
    ).toEqual({ shouldPersist: true, unavailableStoredValue: false, value: "fastify" });
  });

  it("persists a valid query value over an existing stored value", () => {
    expect(
      resolveSelectionState({
        availableValues,
        queryValue: "fastify",
        storedValue: "koa",
      }),
    ).toEqual({ shouldPersist: true, unavailableStoredValue: false, value: "fastify" });
  });

  it("uses legacy selection without overwriting an unavailable stored value", () => {
    expect(
      resolveSelectionState({
        availableValues,
        legacyValue: "koa",
        storedValue: "invalid",
      }),
    ).toEqual({ shouldPersist: false, unavailableStoredValue: true, value: "koa" });
  });

  it("marks unavailable stored values so passive followers can remain hidden", () => {
    expect(
      resolveSelectionState({
        availableValues: ["express"],
        defaultValue: "express",
        storedValue: "koa",
      }),
    ).toEqual({ shouldPersist: false, unavailableStoredValue: true, value: "express" });
  });
});

describe("DocsSelectionStore", () => {
  it("provides stable defaults without browser initialization", () => {
    const store = new DocsSelectionStore();

    expect(store.get("backend-language")).toBe("nodejs");
    expect(store.get("node-frameworks")).toBe("express");
    expect(store.get("ui-type")).toBe("prebuilt");
    expect(store.getServerSnapshot()).toBe(store.getSnapshot());
  });

  it("hydrates query values before storage and ignores invalid external values", () => {
    const store = new DocsSelectionStore();
    store.init(
      memoryStorage({
        "supertokens-docs:selection:backend-language": "python",
        "supertokens-docs:selection:go-frameworks": "chi",
        "supertokens-docs:ui-type": "invalid",
      }),
    );

    store.hydrate(new URLSearchParams("backend=go&backend-framework=gin"));

    expect(store.get("backend-language")).toBe("go");
    expect(store.get("go-frameworks")).toBe("gin");
    expect(store.get("ui-type")).toBe("prebuilt");
  });

  it("commits a transaction before notifying and replaces the URL once", () => {
    const store = new DocsSelectionStore();
    const storage = memoryStorage();
    const urls: string[] = [];
    store.init(storage, {
      dispatch: () => undefined,
      href: () => "https://example.com/docs?campaign=qa#setup",
      replace: (url) => urls.push(url),
    });
    const snapshots: Array<[string, string]> = [];
    store.subscribe("backend-language", () => {
      snapshots.push([store.get("backend-language"), store.get("go-frameworks")]);
    });

    store.transaction([
      { key: "backend-language", value: "go" },
      { key: "go-frameworks", value: "gin" },
    ]);

    expect(snapshots).toEqual([["go", "gin"]]);
    expect(urls).toHaveLength(1);
    expect(new URL(urls[0], "https://example.com").searchParams.getAll("q")).toHaveLength(1);
    expect(compactSelection(urls[0])).toEqual({ backend: "go", "backend-framework": "gin" });
    expect(urls[0]).toMatch(/^\/docs\?campaign=qa&q=[A-Za-z0-9_-]+#setup$/u);
    expect(storage.values.get("supertokens-docs:selection:backend-language")).toBe("go");
    expect(storage.values.get("supertokens-docs:selection:go-frameworks")).toBe("gin");
  });

  it("rejects an invalid transaction without side effects", () => {
    const store = new DocsSelectionStore();
    const storage = memoryStorage();
    const urls: string[] = [];
    store.init(storage, {
      dispatch: () => undefined,
      href: () => "https://example.com/docs",
      replace: (url) => urls.push(url),
    });

    expect(() =>
      store.transaction([
        { key: "backend-language", value: "go" },
        { key: "go-frameworks", value: "express" } as never,
      ]),
    ).toThrow('Invalid value "express" for selection "go-frameworks".');
    expect(store.get("backend-language")).toBe("nodejs");
    expect(storage.values.size).toBe(0);
    expect(urls).toEqual([]);
  });

  it("rejects transactions with competing values for one query parameter", () => {
    const store = new DocsSelectionStore();

    expect(() =>
      store.transaction([
        { key: "node-frameworks", value: "express" },
        { key: "go-frameworks", value: "gin" },
      ]),
    ).toThrow('Selection transaction contains multiple values for query parameter "backend-framework".');
  });

  it("notifies remaining subscribers when one subscriber throws", () => {
    const store = new DocsSelectionStore();
    const errors: unknown[] = [];
    const previousReportError = (globalThis as { reportError?: (error: unknown) => void }).reportError;
    (globalThis as { reportError?: (error: unknown) => void }).reportError = (error) => errors.push(error);
    let notified = false;
    store.subscribe("backend-language", () => {
      throw new Error("subscriber failed");
    });
    store.subscribe("backend-language", () => {
      notified = true;
    });

    try {
      store.set("backend-language", "go");
      expect(notified).toBe(true);
      expect(errors).toHaveLength(1);
    } finally {
      if (previousReportError) {
        (globalThis as { reportError?: (error: unknown) => void }).reportError = previousReportError;
      } else {
        Reflect.deleteProperty(globalThis, "reportError");
      }
    }
  });

  it("treats cross-tab storage changes as authoritative without writing them back", () => {
    const store = new DocsSelectionStore();
    const storage = memoryStorage({ "supertokens-docs:selection:node-frameworks": "express" });
    const urls: string[] = [];
    store.init(storage, {
      dispatch: () => undefined,
      href: () => "https://example.com/docs?backend=nodejs&backend-framework=express",
      replace: (url) => urls.push(url),
    });
    store.hydrate(new URLSearchParams("backend=nodejs&backend-framework=express"));

    store.synchronizeStorage("supertokens-docs:selection:node-frameworks", "fastify");

    expect(store.get("node-frameworks")).toBe("fastify");
    expect(compactSelection(urls[0])).toEqual({ backend: "nodejs", "backend-framework": "fastify" });
    expect(storage.values.get("supertokens-docs:selection:node-frameworks")).toBe("express");
  });

  it("synchronizes a cross-tab backend language with its remembered framework", () => {
    const store = new DocsSelectionStore();
    const urls: string[] = [];
    store.init(memoryStorage({ "supertokens-docs:selection:go-frameworks": "chi" }), {
      dispatch: () => undefined,
      href: () => "https://example.com/docs?backend=nodejs&backend-framework=express",
      replace: (url) => urls.push(url),
    });
    store.hydrate(new URLSearchParams());

    store.synchronizeStorage("supertokens-docs:selection:backend-language", "go");

    expect(store.get("backend-language")).toBe("go");
    expect(store.get("go-frameworks")).toBe("chi");
    expect(compactSelection(urls[0])).toEqual({ backend: "go", "backend-framework": "chi" });
  });

  it("changes backend language and its remembered framework atomically", () => {
    const store = new DocsSelectionStore();
    const urls: string[] = [];
    store.init(memoryStorage({ "supertokens-docs:selection:go-frameworks": "chi" }), {
      dispatch: () => undefined,
      href: () => "https://example.com/docs?backend=nodejs&backend-framework=fastify",
      replace: (url) => urls.push(url),
    });
    store.hydrate(new URLSearchParams());

    store.updateBackendLanguage("go");

    expect(store.get("backend-language")).toBe("go");
    expect(store.get("go-frameworks")).toBe("chi");
    expect(compactSelection(urls[0])).toEqual({ backend: "go", "backend-framework": "chi" });
    expect(() => store.updateBackendFramework("express")).toThrow('Backend framework "express" is not valid for go.');
  });
});

describe("selectionUrl", () => {
  it("updates one selection while preserving other params and the hash", () => {
    const result = selectionUrl("https://example.com/docs?a=1&backend=go#setup", "backend-language", "nodejs");
    const url = new URL(result, "https://example.com");

    expect(url.searchParams.get("a")).toBe("1");
    expect(url.searchParams.has("backend")).toBe(false);
    expect(url.hash).toBe("#setup");
    expect(compactSelection(result)).toEqual({ backend: "nodejs" });
  });

  it("adds a resolved selection without replacing an existing selection", () => {
    const result = canonicalSelectionUrl("https://example.com/docs?campaign=qa#setup", "backend-language", "go");
    expect(new URL(result, "https://example.com").searchParams.get("campaign")).toBe("qa");
    expect(new URL(result, "https://example.com").hash).toBe("#setup");
    expect(compactSelection(result)).toEqual({ backend: "go" });
    expect(canonicalSelectionUrl("https://example.com/docs?backend=python", "backend-language", "go")).toBe(
      "/docs?backend=python",
    );
  });

  it("uses compact URL selections instead of conflicting storage", () => {
    const conflictingStorage = memoryStorage({
      "supertokens-docs:selection:backend-language": "nodejs",
      "supertokens-docs:selection:frontend-custom-ui": "web",
      "supertokens-docs:ui-type": "prebuilt",
    });
    const store = new DocsSelectionStore();
    store.init(conflictingStorage);
    store.hydrate(new URLSearchParams("q=BBJchGkoAC"));

    expect(store.get("ui-type")).toBe("custom");
    expect(store.get("frontend-custom-ui")).toBe("mobile");
    expect(store.get("mobile-frameworks")).toBe("ios");
    expect(store.get("backend-language")).toBe("python");
    expect(store.get("python-frameworks")).toBe("django");
    expect(store.get("package-managers")).toBe("pnpm");
  });
});

describe("selectionQueryKey", () => {
  it("maps internal groups to public query keys", () => {
    expect(selectionQueryKey("ui-type")).toBe("ui");
    expect(selectionQueryKey("frontend-custom-ui")).toBe("frontend");
    expect(selectionQueryKey("mobile-frameworks")).toBe("frontend-framework");
    expect(selectionQueryKey("backend-language")).toBe("backend");
    expect(selectionQueryKey("python-frameworks")).toBe("backend-framework");
    expect(selectionQueryKey("package-managers")).toBe("package-manager");
  });

  it("validates shared keys against the union of mapped group values", () => {
    expect(valuesForSelectionQuery("frontend-custom-ui")).toEqual(
      expect.arrayContaining(["web", "mobile", "reactjs", "angular", "reactnative"]),
    );
    expect(valuesForSelectionQuery("go-frameworks")).toEqual(expect.arrayContaining(["express", "gin", "fastapi"]));
  });

  it("replaces a shared alias value that belongs to another active group", () => {
    let replacedUrl: string | URL | null = null;
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        history: {
          replaceState: (_state: unknown, _unused: string, url: string | URL | null) => {
            replacedUrl = url;
          },
          state: null,
        },
        location: { href: "https://example.com/docs?frontend=reactjs&campaign=qa#setup" },
      },
    });

    try {
      expect(
        readContextualQuery("frontend-custom-ui", ["web", "mobile"], ["reactjs", "web", "mobile"], true, "web"),
      ).toBe("web");
      expect(new URL(replacedUrl!, "https://example.com").searchParams.get("campaign")).toBe("qa");
      expect(compactSelection(String(replacedUrl))).toEqual({ frontend: "web" });
    } finally {
      Reflect.deleteProperty(globalThis, "window");
    }
  });
});

describe("compact selection codec", () => {
  it("has a deterministic v1 fixture", () => {
    expect(encodeCompactSelection({ backend: "go", "backend-framework": "gin" })).toBe("Bp5PqxVAA");
  });

  it("keeps the complete ordered v1 schema stable", () => {
    expect(getCompactSelectionV1Schema()).toEqual([
      { key: "backend", values: ["nodejs", "go", "python", "curl", "dashboard", "java", "csharp", "php"] },
      {
        key: "frontend",
        values: ["reactjs", "angular", "vue", "web", "mobile", "webjs", "android", "ios", "flutter", "reactnative"],
      },
      { key: "frontend-framework", values: ["reactnative", "android", "ios", "flutter"] },
      {
        key: "backend-framework",
        values: [
          "express",
          "hapi",
          "fastify",
          "koa",
          "loopback",
          "serverless",
          "aws-lambda",
          "nextjs",
          "nestjs",
          "http",
          "gin",
          "chi",
          "mux",
          "fastapi",
          "flask",
          "django",
        ],
      },
      { key: "package-manager", values: ["npm", "yarn", "pnpm", "bun"] },
      { key: "install-method", values: ["npm", "script-tag"] },
      { key: "react-router", values: ["yes", "no"] },
      { key: "uses-try-supertokens", values: ["yes", "no"] },
      { key: "python-io-style", values: ["asyncio", "syncio"] },
      { key: "python-package-manager", values: ["pip", "uv"] },
      { key: "version", values: ["v6", "v5"] },
      { key: "docker", values: ["with-docker", "without-docker"] },
      { key: "comparison", values: ["greater", "lesser"] },
      { key: "database", values: ["mysql", "postgresql"] },
      { key: "operating-system", values: ["linux", "mac", "windows"] },
      { key: "import-column-order", values: ["without-order", "with-order"] },
      { key: "core-deployment", values: ["with-docker", "without-docker", "saas"] },
      { key: "core-hosting", values: ["managed", "self-hosted-docker", "self-hosted-binary"] },
      { key: "password-hashing-algorithm", values: ["argon2", "bcrypt"] },
      { key: "package-manager-scripts", values: ["npm", "yarn", "pnpm"] },
      { key: "nextjs-router-type", values: ["app-router", "pages-router"] },
      { key: "passwordless-contact-method", values: ["EMAIL", "PHONE", "EMAIL_OR_PHONE"] },
      {
        key: "passwordless-flow-type",
        values: ["MAGIC_LINK", "USER_INPUT_CODE", "USER_INPUT_CODE_AND_MAGIC_LINK"],
      },
      { key: "tenant-type", values: ["single", "multi"] },
      { key: "ui", values: ["prebuilt", "custom"] },
    ]);
  });

  it("roundtrips selections and preserves absent fields", () => {
    const selection = { backend: "python", frontend: "reactjs", ui: "custom", "tenant-type": "multi" };
    const token = encodeCompactSelection(selection);

    expect(decodeCompactSelection(token)).toEqual(selection);
    expect(decodeCompactSelection(encodeCompactSelection({ backend: "go" }))).toEqual({ backend: "go" });
    expect(decodeCompactSelection(encodeCompactSelection({}))).toEqual({});
  });

  it("rejects invalid tokens without throwing", () => {
    for (const token of [null, "", "CBA", "B!", "BAA", `B${"_".repeat(40)}`]) {
      expect(() => decodeCompactSelection(token)).not.toThrow();
      expect(decodeCompactSelection(token)).toBeNull();
    }
  });

  it("accepts the maximum v1 value and rejects oversized input before parsing", () => {
    const maximum = Object.fromEntries(getCompactSelectionV1Schema().map((field) => [field.key, field.values.at(-1)!]));
    const boundaryToken = encodeCompactSelection(maximum);

    expect(decodeCompactSelection(boundaryToken)).toEqual(maximum);
    expect(decodeCompactSelection(`B${"A".repeat(boundaryToken.length)}`)).toBeNull();
    expect(decodeCompactSelection(`B${"_".repeat(100_000)}`)).toBeNull();
  });

  it("covers every current canonical tab group and registered variant value", () => {
    const current = new Map(getCurrentSelectionQuerySchema().map((field) => [field.key, new Set(field.values)]));
    const v1 = new Map(getCompactSelectionV1Schema().map((field) => [field.key, new Set(field.values)]));

    expect(v1).toEqual(current);
  });

  it("gives explicit readable values precedence over q during hydration", () => {
    const store = new DocsSelectionStore();
    const q = encodeCompactSelection({ backend: "python", frontend: "angular" });

    store.hydrate(new URLSearchParams(`q=${q}&backend=go&frontend=vue`));

    expect(store.get("backend-language")).toBe("go");
    expect(store.get("frontend-prebuilt-ui")).toBe("vue");
  });

  it("ignores and cleans up a malformed readable override without suppressing q", () => {
    const q = encodeCompactSelection({ backend: "python" });
    const store = new DocsSelectionStore();
    store.hydrate(new URLSearchParams(`q=${q}&backend=invalid`));
    expect(store.get("backend-language")).toBe("python");

    let replacedUrl: string | URL | null = null;
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        history: {
          replaceState: (_state: unknown, _unused: string, url: string | URL | null) => {
            replacedUrl = url;
          },
          state: null,
        },
        location: { href: `https://example.com/docs?q=${q}&backend=invalid&campaign=qa#setup` },
      },
    });

    try {
      expect(readCanonicalQuery("backend-language", ["nodejs", "go", "python"])).toBe("python");
      const cleaned = new URL(replacedUrl!, "https://example.com");
      expect(cleaned.searchParams.get("backend")).toBeNull();
      expect(cleaned.searchParams.get("q")).toBe(q);
      expect(cleaned.searchParams.get("campaign")).toBe("qa");
      expect(cleaned.hash).toBe("#setup");
    } finally {
      Reflect.deleteProperty(globalThis, "window");
    }
  });

  it("ignores a malformed readable value in readQuery when q is valid", () => {
    const q = encodeCompactSelection({ backend: "python" });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { location: { href: `https://example.com/docs?q=${q}&backend=invalid` } },
    });

    try {
      expect(readQuery("backend-language")).toBe("python");
    } finally {
      Reflect.deleteProperty(globalThis, "window");
    }
  });

  it("makes ensureQuery remove a malformed readable value while preserving q", () => {
    const q = encodeCompactSelection({ backend: "python" });
    const replacedUrls: Array<string | URL | null> = [];
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        history: {
          replaceState: (_state: unknown, _unused: string, url: string | URL | null) => replacedUrls.push(url),
          state: null,
        },
        location: { href: `https://example.com/docs?q=${q}&backend=invalid&campaign=qa#setup` },
      },
    });

    try {
      ensureQuery("backend-language", "go");

      expect(replacedUrls).toHaveLength(1);
      const canonical = new URL(replacedUrls[0]!, "https://example.com");
      expect(canonical.searchParams.get("backend")).toBeNull();
      expect(decodeCompactSelection(canonical.searchParams.get("q"))).toEqual({ backend: "python" });
      expect(canonical.searchParams.get("campaign")).toBe("qa");
      expect(canonical.hash).toBe("#setup");
    } finally {
      Reflect.deleteProperty(globalThis, "window");
    }
  });
});

describe("optionsForGroup", () => {
  it("returns a stable first-seen union from active wrappers", () => {
    const root = rootWith(
      wrapper([
        ["reactjs", "Reactjs"],
        ["angular", "Angular"],
      ]),
      wrapper([
        ["vue", "Vue"],
        ["reactjs", "Different React label"],
      ]),
      wrapper([["svelte", "Svelte"]], false),
      wrapper([
        ["angular", "Angular"],
        ["solid", "Solid"],
      ]),
    );

    expect(optionsForGroup("frontend-prebuilt-ui", root)).toEqual([
      { value: "reactjs", label: "React" },
      { value: "angular", label: "Angular" },
      { value: "vue", label: "Vue" },
      { value: "solid", label: "Solid" },
    ]);
  });

  it("does not report a local fallback for a globally valid unavailable query", () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        history: { replaceState: () => undefined, state: null },
        location: { href: "https://example.com/docs?backend-framework=koa" },
      },
    });

    try {
      expect(
        selectedGroupValue(
          "node-frameworks",
          [{ value: "express", label: "Express" }],
          rootWith(wrapper([["express", "Express"]])),
        ),
      ).toBeUndefined();
    } finally {
      Reflect.deleteProperty(globalThis, "window");
    }
  });
});
