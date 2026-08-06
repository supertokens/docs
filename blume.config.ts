import { defineConfig } from "blume";

import { ASK_AI_MODEL } from "./lib/ask-ai-config";
import { openApiRedirects } from "./scripts/blume/openapi-redirects";

const publicOrigin = process.env.DOCS_PUBLIC_ORIGIN;
const posthogToken = process.env.PUBLIC_POSTHOG_PROJECT_TOKEN ?? process.env.POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.PUBLIC_POSTHOG_HOST ?? process.env.POSTHOG_HOST;
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
const quickstartRedirects = [
  { from: "/quickstart/introduction", to: "/" },
  { from: "/quickstart/frontend-setup", to: "/quickstart#1-integrate-the-frontend-sdk" },
  { from: "/quickstart/backend-setup", to: "/quickstart#2-integrate-the-backend-sdk" },
  { from: "/quickstart/next-steps", to: "/quickstart#3-configure-the-core-service" },
  { from: "/quickstart/build-with-ai-tools", to: "/integrate-with-ai" },
] as const;
const integrationRedirects = [
  { from: "/quickstart/integrations", to: "/integrations/overview" },
  { from: "/quickstart/integrations/overview", to: "/integrations/overview" },
  { from: "/quickstart/integrations/graphql", to: "/integrations/graphql" },
  { from: "/quickstart/integrations/hasura", to: "/integrations/hasura" },
  { from: "/quickstart/integrations/nestjs", to: "/integrations/nestjs" },
  { from: "/quickstart/integrations/netlify", to: "/integrations/netlify" },
  { from: "/quickstart/integrations/supabase", to: "/integrations/supabase" },
  { from: "/quickstart/integrations/vercel", to: "/integrations/vercel" },
  {
    from: "/quickstart/integrations/aws-lambda/appsync-integration",
    to: "/integrations/aws-lambda/appsync-integration",
  },
  {
    from: "/quickstart/integrations/aws-lambda/quickstart-guide",
    to: "/integrations/aws-lambda/quickstart-guide",
  },
  {
    from: "/quickstart/integrations/aws-lambda/session-verification",
    to: "/integrations/aws-lambda/session-verification",
  },
  {
    from: "/quickstart/integrations/nextjs/app-directory/about",
    to: "/integrations/nextjs/app-directory/about",
  },
  {
    from: "/quickstart/integrations/nextjs/app-directory/init",
    to: "/integrations/nextjs/app-directory/init",
  },
  {
    from: "/quickstart/integrations/nextjs/app-directory/next-steps",
    to: "/integrations/nextjs/app-directory/next-steps",
  },
  {
    from: "/quickstart/integrations/nextjs/app-directory/protecting-route",
    to: "/integrations/nextjs/app-directory/protecting-route",
  },
  {
    from: "/quickstart/integrations/nextjs/app-directory/server-components-requests",
    to: "/integrations/nextjs/app-directory/server-components-requests",
  },
  {
    from: "/quickstart/integrations/nextjs/app-directory/setting-up-backend",
    to: "/integrations/nextjs/app-directory/setting-up-backend",
  },
  {
    from: "/quickstart/integrations/nextjs/app-directory/setting-up-frontend",
    to: "/integrations/nextjs/app-directory/setting-up-frontend",
  },
  {
    from: "/quickstart/integrations/nextjs/app-directory/protecting-backend/session-verification-middleware",
    to: "/integrations/nextjs/app-directory/protecting-backend/session-verification-middleware",
  },
  {
    from: "/quickstart/integrations/nextjs/app-directory/protecting-backend/session-verification-session-guard",
    to: "/integrations/nextjs/app-directory/protecting-backend/session-verification-session-guard",
  },
  {
    from: "/quickstart/integrations/nextjs/pages-directory/about",
    to: "/integrations/nextjs/pages-directory/about",
  },
  {
    from: "/quickstart/integrations/nextjs/pages-directory/init",
    to: "/integrations/nextjs/pages-directory/init",
  },
  {
    from: "/quickstart/integrations/nextjs/pages-directory/next-steps",
    to: "/integrations/nextjs/pages-directory/next-steps",
  },
  {
    from: "/quickstart/integrations/nextjs/pages-directory/protecting-route",
    to: "/integrations/nextjs/pages-directory/protecting-route",
  },
  {
    from: "/quickstart/integrations/nextjs/pages-directory/setting-up-backend",
    to: "/integrations/nextjs/pages-directory/setting-up-backend",
  },
  {
    from: "/quickstart/integrations/nextjs/pages-directory/setting-up-frontend",
    to: "/integrations/nextjs/pages-directory/setting-up-frontend",
  },
  {
    from: "/quickstart/integrations/nextjs/pages-directory/protecting-backend/in-api",
    to: "/integrations/nextjs/pages-directory/protecting-backend/in-api",
  },
  {
    from: "/quickstart/integrations/nextjs/pages-directory/protecting-backend/in-ssr",
    to: "/integrations/nextjs/pages-directory/protecting-backend/in-ssr",
  },
] as const;

export default defineConfig({
  title: "SuperTokens Docs",
  description: "Open Source User Authentication",
  basePath: "/docs",
  logo: {
    image: {
      light: "/img/logos/supertokens-dark.svg",
      dark: "/img/logos/supertokens-dark.svg",
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
      model: ASK_AI_MODEL,
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
  redirects: [
    ...sdkReferenceRedirects,
    ...rowndRedirects,
    ...quickstartRedirects,
    ...integrationRedirects,
    ...openApiRedirects,
  ],
  deployment: {
    output: "server",
    adapter: "vercel",
    ...(publicOrigin ? { site: publicOrigin } : {}),
  },
  seo: {
    agentReadability: true,
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
