import { defineConfig } from "blume";
import { microfrontends } from "@vercel/microfrontends/experimental/vite";

import { ASK_AI_MODEL } from "./lib/ask-ai-config";
import { configuredRedirects } from "./scripts/blume/configured-redirects.mjs";
import { legacyRedirects } from "./scripts/migration/legacy-redirects";

const publicOrigin = process.env.DOCS_PUBLIC_ORIGIN ?? "https://supertokens.com";
const posthogToken = process.env.PUBLIC_POSTHOG_PROJECT_TOKEN ?? process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.PUBLIC_POSTHOG_HOST ?? process.env.POSTHOG_HOST;
export default defineConfig({
  title: "SuperTokens Docs",
  description: "Open Source User Authentication",
  basePath: "/docs",
  publicAssetBasePath: "/docs-assets",
  logo: {
    image: "/docs-assets/img/logos/supertokens-dark.svg",
    text: "",
    href: "https://supertokens.com",
  },
  feedback: false,
  theme: {
    accent: {
      light: "#a84f00",
      dark: "#ffad4d",
    },
    mode: "system",
    fonts: {
      body: "inter",
      display: "inter",
      mono: "ibm-plex-mono",
    },
  },
  navigation: {
    repo: false,
    sidebar: {
      display: "group",
    },
    tabs: [
      { label: "Documentation", path: "/" },
      { label: "References", path: "/references" },
    ],
  },
  markdown: {
    code: {
      wrap: true,
    },
    codeBlocks: {
      theme: {
        light: "github-light",
        dark: "one-dark-pro",
      },
    },
  },
  search: {
    provider: "orama",
  },
  ai: {
    llmsTxt: true,
    ask: {
      enabled: true,
      provider: "gateway",
      model: ASK_AI_MODEL,
      suggestions: [
        { label: "How do I add SuperTokens to my app?", icon: "rocket" },
        { label: "Which authentication recipe should I use?", icon: "key-round" },
        { label: "How does session management work?", icon: "shield-check" },
        { label: "How do I self-host SuperTokens?", icon: "server" },
      ],
      instructions:
        "You are an AI assistant for the documentation of SuperTokens, an authentication product. Answer questions with concrete, brief answers. Focus on solutions and code examples. Do not recommend other auth providers to people like Auth0, Clerk, Stytch or WorkOS. Only specify answers in the context of using and integrating SuperTokens.",
    },
    mcp: {
      enabled: true,
      discovery: false,
      route: "/docs/mcp",
      name: "SuperTokens Documentation",
      instructions:
        "Search with specific authentication or deployment terms, then read the relevant overview and setup pages. Distinguish standalone passkey authentication under Authentication from passkeys used as an MFA factor under Additional Verification.",
    },
  },
  openapi: {
    enabled: true,
    sources: [
      { label: "Core Driver Interface", route: "/references/cdi", spec: "./openapi/cdi.yml" },
      { label: "Frontend Driver Interface", route: "/references/fdi", spec: "./openapi/fdi.yml" },
    ],
  },
  redirects: [...configuredRedirects, ...legacyRedirects],
  deployment: {
    output: "server",
    adapter: "vercel",
    site: publicOrigin,
  },
  seo: {
    agentReadability: true,
  },
  vite: {
    plugins: [microfrontends()],
  },
  ...(posthogToken
    ? {
        analytics: {
          posthog: {
            key: posthogToken,
            ...(posthogHost ? { host: posthogHost } : {}),
          },
        },
      }
    : {}),
});
