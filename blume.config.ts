import { defineConfig } from "blume";

import { openApiRedirects } from "./scripts/blume/openapi-redirects";

const publicOrigin = process.env.DOCS_PUBLIC_ORIGIN;
const sdkReferenceRedirects = [
  {
    from: "/references/backend-sdks/supertokens-nodejs",
    to: "/references/backend-sdks/supertokens-nodejs/package",
  },
  {
    from: "/references/frontend-sdks/supertokens-auth-react",
    to: "/references/frontend-sdks/supertokens-auth-react/package",
  },
] as const;
const rowndRedirects = [
  { from: "/migration/rownd/overview", to: "/migration/rownd/migration-steps" },
  { from: "/migration/rownd/backend-setup", to: "/migration/rownd/sdk-integration-guide" },
  { from: "/migration/rownd/frontend-setup", to: "/migration/rownd/sdk-integration-guide" },
] as const;

export default defineConfig({
  title: "SuperTokens Docs",
  description: "Open Source User Authentication",
  logo: {
    image: {
      light: "/img/logos/supertokens-dark.svg",
      dark: "/img/logos/supertokens-light.svg",
      alt: "SuperTokens",
    },
    text: "",
    href: "https://supertokens.com",
  },
  github: {
    owner: "supertokens",
    repo: "docs",
    branch: "master",
  },
  theme: {
    accent: {
      light: "#a84f00",
      dark: "#ffad4d",
    },
    mode: "system",
    fonts: {
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
      model: "openai/gpt-4.1-mini",
      suggestions: [
        { label: "How do I add SuperTokens to my app?", icon: "rocket" },
        { label: "Which authentication recipe should I use?", icon: "key-round" },
        { label: "How does session management work?", icon: "shield-check" },
        { label: "How do I self-host SuperTokens?", icon: "server" },
      ],
    },
    mcp: {
      enabled: true,
      route: "/mcp",
      name: "SuperTokens Documentation",
      instructions: "Use these tools to answer questions about integrating and operating SuperTokens.",
    },
  },
  openapi: {
    enabled: true,
    sources: [
      { label: "Core Driver Interface", route: "/references/cdi", spec: "./openapi/cdi.yml" },
      { label: "Frontend Driver Interface", route: "/references/fdi", spec: "./openapi/fdi.yml" },
    ],
  },
  redirects: [...sdkReferenceRedirects, ...rowndRedirects, ...openApiRedirects],
  deployment: {
    base: "/docs",
    output: "server",
    adapter: "vercel",
    ...(publicOrigin ? { site: publicOrigin } : {}),
  },
  seo: {
    agentReadability: true,
  },
});
