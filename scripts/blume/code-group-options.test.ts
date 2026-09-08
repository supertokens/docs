import { describe, expect, it } from "vitest";

import { codeTitleTransformer } from "blume/markdown";

import { tabValue } from "../../components/tab-groups";
import { parseCodeOption, resolveSecondarySelection } from "../../lib/code-group-options";

describe("CodeGroup fence metadata", () => {
  it("preserves secondary options on the highlighted pre", () => {
    const transformer = codeTitleTransformer();
    const node = { properties: {} };

    transformer.pre.call({ options: { meta: { __raw: 'title="Node.js" option="node-frameworks:fastify"' } } }, node);

    expect(node.properties).toEqual({
      dataCodeOption: "node-frameworks:fastify",
      dataTitle: "Node.js",
    });
  });

  it("leaves a flat fence without secondary metadata", () => {
    const transformer = codeTitleTransformer();
    const node = { properties: {} };

    transformer.pre.call({ options: { meta: { __raw: 'title="Go"' } } }, node);

    expect(node.properties).toEqual({ dataTitle: "Go" });
  });

  it("rejects malformed and conflicting secondary metadata without selecting a cell", () => {
    expect(parseCodeOption("node-frameworks")).toBeUndefined();
    expect(parseCodeOption("unknown:express")).toBeUndefined();
    expect(parseCodeOption("node-frameworks:expres")).toBeUndefined();
    expect(resolveSecondarySelection(["node-frameworks:express", "go-frameworks:gin"])).toMatchObject({
      invalid: true,
    });
    expect(resolveSecondarySelection(["node-frameworks:express", undefined])).toMatchObject({ invalid: true });
  });

  it("uses a local fallback without replacing an unavailable stored secondary value", () => {
    expect(resolveSecondarySelection(["node-frameworks:express", "node-frameworks:fastify"], "nextjs")).toEqual({
      group: "node-frameworks",
      invalid: false,
      value: "express",
    });
  });

  it("maps primary title aliases to the same canonical tab value", () => {
    expect(tabValue("frontend-prebuilt-ui", "Reactjs")).toBe("reactjs");
    expect(tabValue("frontend-prebuilt-ui", "React")).toBe("reactjs");
    expect(tabValue("node-frameworks", "Nestjs")).toBe("nestjs");
    expect(tabValue("node-frameworks", "NestJS")).toBe("nestjs");
  });
});
