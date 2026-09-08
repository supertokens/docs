import { expect, test } from "@playwright/test";

const redirects = [
  ["/docs/guides", "/docs"],
  ["/docs/attackprotectionsuite/introduction", "/docs/additional-verification/attack-protection-suite/introduction"],
  ["/docs/emailpassword/advanced-customizations/apis-override/about", "/docs/references"],
  ["/docs/passwordless/advanced-customizations/apis-override/about", "/docs/references"],
  [
    "/docs/thirdparty/add-multiple-clients-for-the-same-provider",
    "/docs/authentication/social/add-multiple-clients-for-the-same-provider",
  ],
  ["/docs/session/advanced-customizations/apis-override/about", "/docs/references"],
  ["/docs/mfa/backend-setup", "/docs/additional-verification/mfa/initial-setup"],
  ["/docs/quickstart/integrations/vercel/about", "/docs/integrations/vercel"],
  ["/docs/emailpassword/quickstart/frontend-setup", "/docs/quickstart#1-integrate-the-frontend-sdk"],
] as const;

test("legacy namespaces redirect directly to canonical pages", async ({ request }) => {
  for (const [from, to] of redirects) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBeGreaterThanOrEqual(300);
    expect(response.status(), from).toBeLessThan(400);
    expect(response.headers().location, from).toBe(to);
  }
});

test("incoming redirect queries precede target queries and stay before fragments", async ({ request }) => {
  const response = await request.get("/docs/emailpassword/quickstart/frontend-setup?source=e2e", {
    maxRedirects: 0,
  });

  expect(response.headers().location).toBe("/docs/quickstart?source=e2e#1-integrate-the-frontend-sdk");
});
