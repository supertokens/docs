import { createAskContext } from "blume/ai/ask-context.ts";
import { describe, expect, it } from "vitest";

describe("Ask AI grounding", () => {
  it("retrieves the same docs for a conversational question and its meaningful search terms", async () => {
    const ground = createAskContext(
      {
        site: null,
        documents: [
          {
            title: "Magic Link Login Setup",
            description: "Configure passwordless authentication.",
            route: "/passwordless",
            content: "Configure the Passwordless recipe for magic link login.",
          },
          {
            title: "How do I",
            description: "How do I",
            route: "/unrelated",
            content: "How do I change the dashboard theme?",
          },
        ],
      },
      { retrieval: { maxResults: 1 } },
    );

    const conversational = await ground([{ role: "user", content: "how do i setup magic link login?" }]);
    const keywords = await ground([{ role: "user", content: "setup magic link login" }]);

    expect(conversational).toContain("(/passwordless)");
    expect(conversational).not.toContain("(/unrelated)");
    expect(conversational).toBe(keywords);
  });

  it("keeps setup prerequisites alongside a relevant example deep in a long page", async () => {
    const ground = createAskContext({
      site: null,
      documents: [
        {
          title: "Passwordless setup",
          description: "Configure passwordless authentication.",
          route: "/passwordless",
          content: [
            "Initialize Passwordless and Session on both frontend and backend before using the examples.",
            "General documentation. ".repeat(300),
            "Magic link login: consume the link after an explicit user interaction. ".repeat(30),
          ].join("\n\n"),
        },
      ],
    });

    const context = await ground([{ role: "user", content: "magic link login" }]);

    expect(context).toContain("Initialize Passwordless and Session on both frontend and backend");
    expect(context).toContain("consume the link after an explicit user interaction");
    expect(context).not.toContain("General documentation. ".repeat(300));
  });
});
