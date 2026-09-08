import type { McpData } from "../../node_modules/blume/src/ai/mcp/data.ts";
import { createMcpFetchHandler } from "../../node_modules/blume/src/ai/mcp/server.ts";

const data: McpData = {
  base: "",
  documents: [],
  name: "Test docs",
  navigation: { featured: [], selectors: [], sidebar: [], tabs: [] },
  pages: {},
  routes: [],
  site: "https://docs.example.com",
  version: "1.5.3",
};

const handler = createMcpFetchHandler(data);

describe("patched Blume MCP Origin validation", () => {
  it("allows non-browser preflight requests without adding an allow-origin header", async () => {
    const response = await handler(new Request("https://docs.example.com/docs/mcp", { method: "OPTIONS" }));

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
    expect(response.headers.get("Vary")).toBeNull();
    expect(response.headers.get("Access-Control-Allow-Headers")).toContain("Mcp-Protocol-Version");
  });

  it("returns exact-origin CORS headers for a same-origin preflight", async () => {
    const response = await handler(
      new Request("https://docs.example.com/docs/mcp", {
        headers: { Origin: "https://docs.example.com" },
        method: "OPTIONS",
      }),
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("https://docs.example.com");
    expect(response.headers.get("Vary")).toBe("Origin");
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe("GET, POST, OPTIONS");
  });

  it("rejects cross-origin preflight and POST requests before MCP handling", async () => {
    for (const method of ["OPTIONS", "POST"]) {
      const response = await handler(
        new Request("https://docs.example.com/docs/mcp", {
          headers: { Origin: "https://attacker.example" },
          method,
        }),
      );

      expect(response.status).toBe(403);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
      expect(response.headers.get("Vary")).toBe("Origin");
    }
  });

  it("preserves MCP POST responses and protocol headers for a valid origin", async () => {
    const response = await handler(
      new Request("https://docs.example.com/docs/mcp", {
        body: JSON.stringify({
          id: 1,
          jsonrpc: "2.0",
          method: "initialize",
          params: {
            capabilities: {},
            clientInfo: { name: "test-client", version: "1.0.0" },
            protocolVersion: "2025-03-26",
          },
        }),
        headers: {
          Accept: "application/json, text/event-stream",
          "Content-Type": "application/json",
          Origin: "https://docs.example.com",
        },
        method: "POST",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("application/json");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("https://docs.example.com");
    expect(response.headers.get("Access-Control-Expose-Headers")).toBe("Mcp-Session-Id");
    expect(await response.json()).toMatchObject({ id: 1, jsonrpc: "2.0" });
  });

  it("preserves MCP POST behavior for non-browser clients without Origin", async () => {
    const response = await handler(
      new Request("https://docs.example.com/docs/mcp", {
        body: JSON.stringify({
          id: 2,
          jsonrpc: "2.0",
          method: "initialize",
          params: {
            capabilities: {},
            clientInfo: { name: "test-client", version: "1.0.0" },
            protocolVersion: "2025-03-26",
          },
        }),
        headers: {
          Accept: "application/json, text/event-stream",
          "Content-Type": "application/json",
        },
        method: "POST",
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
    expect(response.headers.get("Vary")).toBeNull();
    expect(await response.json()).toMatchObject({ id: 2, jsonrpc: "2.0" });
  });
});
