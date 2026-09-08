import { describe, expect, it } from "vitest";

import { migrateNestedTabs, validateTabStructure } from "./migrate-nested-tabs";

function migrate(source: string, filePath = "guides/example.mdx"): string {
  return migrateNestedTabs(source, filePath).source;
}

describe("migrateNestedTabs", () => {
  it("migrates a second-level semantic group without changing its body", () => {
    const source = `<Tabs>
  <Tab title="Node.js">
    Intro
    <Tabs>
      <Tab title="Express">const value = 1;</Tab>
      <Tab title="Fastify">

        **Keep this spacing.**
      </Tab>
    </Tabs>
  </Tab>
  <Tab title="Go">Go</Tab>
</Tabs>`;

    expect(migrate(source)).toBe(`<Tabs>
  <Tab title="Node.js">
    Intro
    <DependentContent group="node-frameworks" label="Node.js framework">
      <ContentOption title="Express" value="express">const value = 1;</ContentOption>
      <ContentOption title="Fastify" value="fastify">

        **Keep this spacing.**
      </ContentOption>
    </DependentContent>
  </Tab>
  <Tab title="Go">Go</Tab>
</Tabs>`);
  });

  it("migrates all nested groups through depth three", () => {
    const source = `<Tabs>
  <Tab title="Node.js">
    <Tabs>
      <Tab title="Express">
        <Tabs><Tab title="Axios">A</Tab><Tab title="Fetch">F</Tab></Tabs>
      </Tab>
      <Tab title="Fastify">Fastify</Tab>
    </Tabs>
  </Tab>
</Tabs>`;
    const output = migrate(source);

    expect(output).toContain('<DependentContent group="node-frameworks" label="Node.js framework">');
    expect(output).toContain('<ContentOption title="Express" value="express">');
    expect(output).toContain('<DependentContent group="javascript-http-client" label="HTTP client">');
    expect(output).toContain('<ContentOption title="Axios" value="axios">A</ContentOption>');
    expect(output.match(/<DependentContent/g)).toHaveLength(2);
  });

  it("ignores fenced and inline code plus JSX and HTML comments", () => {
    const source = `<Tabs><Tab title="Outer">

\`\`\`mdx
<Tabs><Tab title="Yes">Y</Tab><Tab title="No">N</Tab></Tabs>
\`\`\`
{/* <Tabs><Tab title="Yes">Y</Tab><Tab title="No">N</Tab></Tabs> */}
<!-- <Tabs><Tab title="Yes">Y</Tab><Tab title="No">N</Tab></Tabs> -->
Inline: \`<Tabs><Tab title="Yes">Y</Tab><Tab title="No">N</Tab></Tabs>\`
Multi: \`\`<Tabs><Tab title="Yes">\`Y\`</Tab><Tab title="No">N</Tab></Tabs>\`\`

<Tabs><Tab title="V6">six</Tab><Tab title="V5">five</Tab></Tabs>
</Tab></Tabs>`;
    const output = migrate(source);

    expect(output.match(/<DependentContent/g)).toHaveLength(1);
    expect(output).toContain('<DependentContent group="version" label="Version">');
    expect(output).toContain('```mdx\n<Tabs><Tab title="Yes">');
    expect(output).toContain('{/* <Tabs><Tab title="Yes">');
    expect(output).toContain('<!-- <Tabs><Tab title="Yes">');
    expect(output).toContain('Inline: `<Tabs><Tab title="Yes">');
    expect(output).toContain('Multi: ``<Tabs><Tab title="Yes">`Y`');
  });

  it("does not treat URL slashes as a line comment", () => {
    const source = `<Tabs><Tab title="Outer">https://example.com <Tabs><Tab title="Yes">Y</Tab><Tab title="No">N</Tab></Tabs></Tab></Tabs>`;
    const output = migrate(source);

    expect(output).toContain("https://example.com <DependentContent");
    expect(validateTabStructure(output)).toEqual({ nestedTabs: 0, unbalanced: [] });
  });

  it("does not treat leading slashes as an MDX comment", () => {
    const source = `<Tabs><Tab title="Outer">
// <Tabs><Tab title="Yes">Y</Tab><Tab title="No">N</Tab></Tabs>
</Tab></Tabs>`;
    const output = migrate(source);

    expect(output).toContain("// <DependentContent");
    expect(validateTabStructure(output)).toEqual({ nestedTabs: 0, unbalanced: [] });
  });

  it("ignores arbitrarily indented fences and honors the outer fence length", () => {
    const source = `<Tabs><Tab title="Outer">
        \`\`\`\`\`mdx
        <Tabs><Tab title="Yes">Y</Tab><Tab title="No">N</Tab></Tabs>
        \`\`\`
        <Tabs><Tab title="V6">six</Tab><Tab title="V5">five</Tab></Tabs>
        \`\`\`\`\`
            ~~~mdx
            <Tabs><Tab title="Pip">P</Tab><Tab title="Uv">U</Tab></Tabs>
            ~~~
<Tabs><Tab title="Axios">A</Tab><Tab title="Fetch">F</Tab></Tabs>
</Tab></Tabs>`;
    const output = migrate(source);

    expect(output.match(/<DependentContent/g)).toHaveLength(1);
    expect(output).toContain('        <Tabs><Tab title="V6">six</Tab>');
    expect(output).toContain('            <Tabs><Tab title="Pip">P</Tab>');
    expect(output).toContain('<DependentContent group="javascript-http-client" label="HTTP client">');
  });

  it("repairs partially migrated names and converts remaining nested Tabs", () => {
    const source = `<Tabs group="frontend-custom-ui">
  <ContentOption title="Web" value="web">
    <DependentContent group="package-managers" label="Package manager">
      <Tab title="npm">keep npm body</Tab>
      <ContentOption title="Yarn" value="yarn">keep yarn body</ContentOption>
    </Tabs>
    <Tabs><ContentOption title="V6">six</ContentOption><Tab title="V5">five</Tab></Tabs>
  </ContentOption>
</Tabs>`;
    const output = migrate(source);

    expect(output).toContain('<Tab title="Web" value="web">');
    expect(output).toContain('<ContentOption title="npm" value="npm">keep npm body</ContentOption>');
    expect(output).toContain('<ContentOption title="Yarn" value="yarn">keep yarn body</ContentOption>');
    expect(output).toContain("</DependentContent>");
    expect(output).toContain('<DependentContent group="version" label="Version">');
    expect(output).toContain('<ContentOption title="V6" value="v6">six</ContentOption>');
    expect(validateTabStructure(output)).toEqual({ nestedTabs: 0, unbalanced: [] });
    expect(migrate(output)).toBe(output);
  });

  it("fails on structurally unbalanced control tags", () => {
    const source = `<Tabs><Tab title="Outer">body</Tabs></Tab>`;

    expect(() => migrate(source, "broken.mdx")).toThrow(/Unbalanced tab structure in broken\.mdx/);
    expect(validateTabStructure(source).unbalanced.length).toBeGreaterThan(0);
  });

  it("rejects nested Web and Mobile tabs instead of demoting them to a select", () => {
    const source = `<Tabs><Tab title="Magic Link"><Tabs group="frontend-custom-ui"><Tab title="Web">W</Tab><Tab title="Mobile">M</Tab></Tabs></Tab></Tabs>`;

    expect(() => migrate(source, "passwordless.mdx")).toThrow(
      /Cannot migrate nested Web\/Mobile tabs.*convert the outer choice to sections first/,
    );
  });

  it("is idempotent", () => {
    const source = `<Tabs><Tab title="Outer"><Tabs><Tab title="Pip">P</Tab><Tab title="Uv">U</Tab></Tabs></Tab></Tabs>`;
    const once = migrate(source);

    expect(migrate(once)).toBe(once);
  });

  it("reuses explicit group, label, and values", () => {
    const source = `<Tabs><Tab title="Outer">
  <Tabs group="custom-client" label="Client choice">
    <Tab title="One" value="first">one</Tab>
    <Tab title="Two" value="second">two</Tab>
  </Tabs>
</Tab></Tabs>`;

    expect(migrate(source)).toContain(`<DependentContent group="custom-client" label="Client choice">
    <ContentOption title="One" value="first">one</ContentOption>
    <ContentOption title="Two" value="second">two</ContentOption>
  </DependentContent>`);
  });

  it("requires a label for an unknown nested choice", () => {
    const source = `<Tabs><Tab title="Outer"><Tabs><Tab title="Red">R</Tab><Tab title="Blue">B</Tab></Tabs></Tab></Tabs>`;

    expect(() => migrate(source, "unknown.mdx")).toThrow(/add an explicit label for this choice/);
  });

  it("gives generic groups stable file-scoped occurrence keys", () => {
    const question = '<Tabs><Tab title="Yes">Y</Tab><Tab title="No">N</Tab></Tabs>';
    const source = `<Tabs><Tab title="Outer">${question}${question}</Tab></Tabs>`;
    const output = migrate(source, "faq/session.mdx");
    const groups = [...output.matchAll(/group="(yes-no-[^"]+)"/g)].map((match) => match[1]);

    expect(groups).toHaveLength(2);
    expect(groups[0]).not.toBe(groups[1]);
    expect(groups[0]).toMatch(/^yes-no-[a-z0-9]+-1$/);
    expect(groups[1]).toMatch(/^yes-no-[a-z0-9]+-2$/);
    expect(migrate(output, "faq/session.mdx")).toBe(output);
    expect(migrate(source, "faq/other.mdx")).not.toContain(`group="${groups[0]}"`);
  });
});
