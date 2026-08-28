import { describe, expect, it, vi } from "vitest";

import { migrateCodeSelection } from "./migrate-code-selection";

describe("migrateCodeSelection", () => {
  it("keeps prose-only choices selectable through an empty owning tab", () => {
    const source = `<Tabs group="backend-language">
<Tab title="Dashboard" value="dashboard">

Dashboard instructions.

</Tab>
<Tab title="Node.js" value="nodejs">

\`\`\`ts
console.log("node");
\`\`\`
</Tab>
</Tabs>`;

    const migrated = migrateCodeSelection(source).source;

    expect(migrated).toContain('<ContentOption title="Dashboard" value="dashboard">');
    expect(migrated).toContain('<Tab title="Dashboard" value="dashboard">\n\n</Tab>');
    expect(migrated).toContain('<Tab title="Node.js" value="nodejs">');
  });

  it.each([
    ["Steps", '<Steps><Step title="One">\n\n```ts\ncode();\n```\n</Step></Steps>'],
    ["list", "\n\n- Run this:\n\n  ```ts\n  code();\n  ```\n\n"],
  ])("skips grouped %s content instead of fragmenting its structure", (_kind, body) => {
    const source = `<Tabs group="backend-language">
<Tab title="Node.js" value="nodejs">${body}</Tab>
<Tab title="Go" value="go">Not applicable.</Tab>
</Tabs>`;
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    expect(migrateCodeSelection(source).source).toBe(source);
    expect(warning).toHaveBeenCalledWith(expect.stringContaining("requires a manual semantics-preserving migration"));
    warning.mockRestore();
  });

  it("uses a fence longer than backtick runs in code", () => {
    const source = `<Tabs group="backend-language">
<Tab title="Node.js" value="nodejs">

\`\`\`\`md
\`\`\`ts
code();
\`\`\`
\`\`\`\`
</Tab>
</Tabs>`;

    expect(migrateCodeSelection(source).source).toContain("````md\n```ts\ncode();\n```\n````");
  });

  it("does not borrow selector ownership across variants", () => {
    const source = `<VariantContent storageKey="mode" value="a">
<DependentContent passive group="backend-language">
<ContentOption title="Dashboard" value="dashboard">Dashboard instructions.</ContentOption>
</DependentContent>
</VariantContent>
<VariantContent storageKey="mode" value="b">
<CodeGroup group="backend-language">
<Tab title="Node.js" value="nodejs">
\`\`\`ts
code();
\`\`\`
</Tab>
</CodeGroup>
</VariantContent>`;

    expect(migrateCodeSelection(source).source).not.toContain('<Tab title="Dashboard" value="dashboard">');
  });

  it("keeps a standalone prose-only selector interactive", () => {
    const source = `<Tabs group="install-method">
<Tab title="npm" value="npm">Install from npm.</Tab>
<Tab title="Script tag" value="script-tag">Load the script.</Tab>
</Tabs>`;

    const migrated = migrateCodeSelection(source).source;
    expect(migrated).toContain('<DependentContent group="install-method">');
    expect(migrated).not.toContain("<DependentContent passive");
  });

  it("activates a secondary selector first introduced by a passive code stage", () => {
    const source = `<Tabs group="frontend-prebuilt-ui">
<Tab title="Reactjs" value="reactjs">
\`\`\`ts
initialize();
\`\`\`
<DependentContent group="react-router" label="Do you use react-router-dom?">
<ContentOption title="Yes" value="yes">
\`\`\`tsx
withRouter();
\`\`\`
</ContentOption>
<ContentOption title="No" value="no">
\`\`\`tsx
withoutRouter();
\`\`\`
</ContentOption>
</DependentContent>
</Tab>
</Tabs>`;

    const migrated = migrateCodeSelection(source).source;
    expect(migrated).toContain('<CodeGroup passive secondaryControls="react-router"');
  });
});
