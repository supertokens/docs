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
    accent: "#ff9933",
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
    featured: [
      { label: "Dashboard", href: "https://supertokens.com/dashboard", icon: "layout-dashboard" },
      { label: "GitHub", href: "https://github.com/supertokens/supertokens-core", icon: "github" },
    ],
  },
  markdown: {
    codeBlocks: {
      theme: {
        light: "one-dark-pro",
        dark: "one-dark-pro",
      },
    },
  },
  search: {
    provider: "orama",
  },
  ai: {
    llmsTxt: true,
  },
  openapi: {
    enabled: true,
    sources: [
      { label: "Core Driver Interface", route: "/references/cdi", spec: "./openapi/cdi.yml" },
      { label: "Frontend Driver Interface", route: "/references/fdi", spec: "./openapi/fdi.yml" },
    ],
  },
  redirects: [...sdkReferenceRedirects, ...openApiRedirects],
  deployment: {
    base: "/docs",
    output: "static",
    ...(publicOrigin ? { site: publicOrigin } : {}),
  },
});
