import { describe, expect, it } from "vitest";

import { tabGroupControl } from "../../components/tab-groups";
import { annotateTabGroups } from "./annotate-tab-groups.mjs";

describe("annotateTabGroups", () => {
  it("annotates backend languages and nested frameworks with stable values", () => {
    const source = `<Tabs>
  <Tab title="Node.js">
    <Tabs>
      <Tab title="Express">Node</Tab>
      <Tab title="Fastify">Fastify</Tab>
    </Tabs>
  </Tab>
  <Tab title="Go">Go</Tab>
  <Tab title="Python">Python</Tab>
</Tabs>`;

    expect(annotateTabGroups(source)).toBe(`<Tabs group="backend-language">
  <Tab title="Node.js" value="nodejs">
    <Tabs group="node-frameworks">
      <Tab title="Express" value="express">Node</Tab>
      <Tab title="Fastify" value="fastify">Fastify</Tab>
    </Tabs>
  </Tab>
  <Tab title="Go" value="go">Go</Tab>
  <Tab title="Python" value="python">Python</Tab>
</Tabs>`);
  });

  it("leaves ordinary content tabs local", () => {
    const source = `<Tabs>
  <Tab title="Yes">Yes</Tab>
  <Tab title="No">No</Tab>
</Tabs>`;

    expect(annotateTabGroups(source)).toBe(source);
  });

  it("ignores tab tags in line comments", () => {
    const source = `<Tabs>
  <Tab title="Express">Express</Tab>
  <Tab title="Fastify">Fastify</Tab>
  // <Tab title="Unknown">
  // </Tab>
</Tabs>`;

    expect(annotateTabGroups(source)).toBe(`<Tabs group="node-frameworks">
  <Tab title="Express" value="express">Express</Tab>
  <Tab title="Fastify" value="fastify">Fastify</Tab>
  // <Tab title="Unknown">
  // </Tab>
</Tabs>`);
  });

  it("annotates mixed frontend platforms", () => {
    const source = `<Tabs>
  <Tab title="React">React</Tab>
  <Tab title="Webjs">Web</Tab>
  <Tab title="Android">Android</Tab>
  <Tab title="React Native">React Native</Tab>
</Tabs>`;

    expect(annotateTabGroups(source)).toBe(`<Tabs group="frontend-platforms">
  <Tab title="React" value="reactjs">React</Tab>
  <Tab title="Webjs" value="webjs">Web</Tab>
  <Tab title="Android" value="android">Android</Tab>
  <Tab title="React Native" value="reactnative">React Native</Tab>
</Tabs>`);
  });

  it("is idempotent", () => {
    const source = `<Tabs group="frontend-custom-ui">
  <Tab title="Web" value="web">Web</Tab>
  <Tab title="Mobile" value="mobile">Mobile</Tab>
</Tabs>`;

    expect(annotateTabGroups(source)).toBe(source);
  });

  it("uses selects only for secondary framework choices", () => {
    expect(tabGroupControl("backend-language")).toBe("tabs");
    expect(tabGroupControl("frontend-custom-ui")).toBe("tabs");
    expect(tabGroupControl("node-frameworks")).toBe("select");
    expect(tabGroupControl("go-frameworks")).toBe("select");
    expect(tabGroupControl("python-frameworks")).toBe("select");
    expect(tabGroupControl("mobile-frameworks")).toBe("select");
  });
});
