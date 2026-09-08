import { openApiRedirects } from "./openapi-redirects.mjs";

export const configuredRedirects = [
  {
    from: "/references/backend-sdks/supertokens-nodejs/package",
    to: "https://sdk-references.supertokens.com/nodejs/latest/modules.html",
  },
  {
    from: "/references/frontend-sdks/supertokens-auth-react/package",
    to: "https://sdk-references.supertokens.com/auth-react/latest/modules.html",
  },
  {
    from: "/references/frontend-sdks/supertokens-web-js",
    to: "https://sdk-references.supertokens.com/web-js/latest/modules.html",
  },
  {
    from: "/references/frontend-sdks/supertokens-web-js/package",
    to: "https://sdk-references.supertokens.com/web-js/latest/modules.html",
  },
  {
    from: "/references/backend-sdks/supertokens-nodejs",
    to: "https://sdk-references.supertokens.com/nodejs/latest/modules.html",
  },
  {
    from: "/references/backend-sdks/supertokens-nodejs/index",
    to: "https://sdk-references.supertokens.com/nodejs/latest/modules.html",
  },
  {
    from: "/references/frontend-sdks/supertokens-auth-react",
    to: "https://sdk-references.supertokens.com/auth-react/latest/modules.html",
  },
  {
    from: "/references/frontend-sdks/supertokens-auth-react/index",
    to: "https://sdk-references.supertokens.com/auth-react/latest/modules.html",
  },
  {
    from: "/references/frontend-sdks/supertokens-web-js/index",
    to: "https://sdk-references.supertokens.com/web-js/latest/modules.html",
  },
  { from: "/migration/rownd/overview", to: "/migration/rownd/migration-steps" },
  { from: "/migration/rownd/backend-setup", to: "/migration/rownd/sdk-integration-guide" },
  { from: "/migration/rownd/frontend-setup", to: "/migration/rownd/sdk-integration-guide" },
  { from: "/quickstart/introduction", to: "/quickstart" },
  { from: "/quickstart/example-applications", to: "/quickstart" },
  { from: "/quickstart/frontend-setup", to: "/quickstart#1-integrate-the-frontend-sdk" },
  { from: "/quickstart/backend-setup", to: "/quickstart#2-integrate-the-backend-sdk" },
  { from: "/quickstart/next-steps", to: "/quickstart#3-configure-the-core-service" },
  { from: "/quickstart/build-with-ai-tools", to: "/integrate-with-ai" },
  { from: "/references/compatibility-table", to: "/references/updating-supertokens#sdk-compatibility-table" },
  { from: "/references/how-supertokens-works", to: "/#how-supertokens-works" },
  { from: "/quickstart/integrations", to: "/integrations/overview" },
  { from: "/quickstart/integrations/overview", to: "/integrations/overview" },
  { from: "/quickstart/integrations/graphql", to: "/integrations/graphql" },
  { from: "/quickstart/integrations/hasura", to: "/integrations/hasura" },
  { from: "/quickstart/integrations/nestjs", to: "/integrations/nestjs" },
  { from: "/quickstart/integrations/netlify", to: "/integrations/netlify" },
  { from: "/quickstart/integrations/supabase", to: "/integrations/supabase" },
  { from: "/quickstart/integrations/supabase/backend", to: "/integrations/supabase" },
  { from: "/quickstart/integrations/supabase/frontend", to: "/integrations/supabase" },
  { from: "/quickstart/integrations/supabase/setup", to: "/integrations/supabase" },
  { from: "/quickstart/integrations/vercel", to: "/integrations/vercel" },
  { from: "/references/index", to: "/references" },
  { from: "/authentication/enterprise/saml/what-is-saml", to: "/authentication/enterprise/saml" },
  { from: "/authentication/enterprise/saml/boxy-hq-guide", to: "/authentication/enterprise/legacy-saml" },
  {
    from: "/post-authentication/account-linking/initial-setup",
    to: "/post-authentication/account-linking/manual-account-linking",
  },
  {
    from: "/post-authentication/session-management/advanced-workflows/security",
    to: "/post-authentication/session-management/advanced-workflows/in-iframe",
  },
  {
    from: "/post-authentication/session-management/advanced-workflows/error-handling",
    to: "/post-authentication/session-management/advanced-workflows/customize-error-handling",
  },
  {
    from: "/post-authentication/session-management/advanced-workflows/share-sessions-across-sub-domains",
    to: "/post-authentication/session-management/share-session-across-sub-domains",
  },
  {
    from: "/post-authentication/session-management/session-invalidation/sign-out",
    to: "/post-authentication/session-management/session-invalidation#user-sign-out",
  },
  {
    from: "/additional-verification/mfa/email-sms-otp/embed",
    to: "/additional-verification/mfa/embed-the-prebuilt-ui",
  },
  {
    from: "/additional-verification/mfa/totp/embed",
    to: "/additional-verification/mfa/embed-the-prebuilt-ui",
  },
  {
    from: "/additional-verification/mfa/with-email-verification",
    to: "/additional-verification/mfa/initial-setup#usage-with-email-verification",
  },
  { from: "/discord", to: "https://supertokens.com/discord" },
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
  ...openApiRedirects,
];
