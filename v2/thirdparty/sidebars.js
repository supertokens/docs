module.exports = {
  sidebar: [
    {
      label: "quickstart",
      type: "category",
      customProps: {
        highlightGroup: true,
      },
      collapsed: false,
      items: [
        {
          id: "quickstart/introduction",
          type: "doc",
          label: "Introduction",
        },
        {
          id: "quickstart/frontend-setup",
          type: "doc",
          label: "Frontend Setup",
        },
        {
          id: "quickstart/backend-setup",
          type: "doc",
          label: "Backend Setup",
        },
        {
          id: "quickstart/next-steps",
          type: "doc",
          label: "Next Steps",
        },
      ],
    },
    {
      type: "category",
      label: "Integrations",
      customProps: {
        logoUrl: [
          {
            url: "/img/logos/hasura-logo.png",
            label: "Hasura",
          },
          {
            url: "/img/logos/graphql-logo.png",
            label: "GraphQL",
          },
          {
            url: "/img/logos/next-logo.png",
            label: "NextJS",
          },
          {
            url: "/img/logos/nest-logo.svg",
            label: "NestJS",
          },
          {
            url: "/img/logos/aws-lambda.svg",
            label: "AWS Lambda",
          },
        ],
      },
      items: [
        {
          type: "category",
          label: "Hasura",
          customProps: {
            logoUrl: "/img/logos/hasura-logo.png",
          },
          items: ["hasura-integration/with-jwt"],
        },
        {
          type: "category",
          label: "GraphQL",
          customProps: {
            logoUrl: "/img/logos/graphql-logo.png",
          },
          items: [
            "graphql-integration/backend-setup",
            "graphql-integration/making-requests",
          ],
        },
        {
          type: "category",
          label: "NextJS",
          customProps: {
            logoUrl: "/img/logos/next-logo.png",
          },
          items: [
            {
              type: "category",
              label: "Using the App directory",
              items: [
                "nextjs/app-directory/about",
                "nextjs/app-directory/init",
                "nextjs/app-directory/setting-up-frontend",
                "nextjs/app-directory/setting-up-backend",
                "nextjs/app-directory/protecting-route",
                {
                  type: "category",
                  label: "5. Checking for sessions in API routes",
                  items: [
                    "nextjs/app-directory/session-verification-session-guard",
                    "nextjs/app-directory/session-verification-middleware",
                  ],
                },
                "nextjs/app-directory/server-components-requests",
                "nextjs/app-directory/next-steps",
              ],
            },
            {
              type: "category",
              label: "Using the Pages directory",
              items: [
                "nextjs/about",
                "nextjs/init",
                "nextjs/setting-up-frontend",
                "nextjs/setting-up-backend",
                "nextjs/protecting-route",
                {
                  type: "category",
                  label: "5. Session verification",
                  items: [
                    "nextjs/session-verification/in-api",
                    "nextjs/session-verification/in-ssr",
                  ],
                },
                "nextjs/next-steps",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "NestJS",
          customProps: {
            logoUrl: "/img/logos/nest-logo.svg",
          },
          items: ["nestjs/guide"],
        },
        {
          type: "category",
          label: "RedwoodJS",
          customProps: {
            logoUrl: "/img/logos/redwood-logo.png",
          },
          items: ["redwood/about"],
        },
        {
          type: "category",
          label: "Netlify",
          customProps: {
            logoUrl: "/img/logos/netlify.svg",
          },
          items: [
            "serverless/with-netlify/about",
            "serverless/with-netlify/frontend",
            "serverless/with-netlify/backend-config",
            "serverless/with-netlify/auth-serverless",
            "serverless/with-netlify/session-verification",
            "serverless/with-netlify/next-steps",
          ],
        },
        {
          type: "category",
          label: "AWS Lambda",
          customProps: {
            logoUrl: "/img/logos/aws-lambda.svg",
          },
          items: [
            "serverless/with-aws-lambda/about",
            "serverless/with-aws-lambda/frontend",
            {
              type: "category",
              label: "2. Backend config",
              items: [
                "serverless/with-aws-lambda/setup-lambda-layer",
                "serverless/with-aws-lambda/setup-lambda",
                "serverless/with-aws-lambda/setup-api-gateway",
              ],
            },
            {
              type: "category",
              label: "3. Session Verification",
              items: [
                "serverless/with-aws-lambda/session-verification",
                "serverless/with-aws-lambda/authorizer",
                "serverless/with-aws-lambda/jwt-authorizer",
              ],
            },
            "serverless/with-aws-lambda/next-steps",
            "serverless/with-aws-lambda/appsync-integration",
          ],
        },
        {
          type: "category",
          label: "Supabase",
          customProps: {
            logoUrl: "/img/logos/supabase-logo.jpg",
          },
          items: [
            "supabase-intergration/about",
            "supabase-intergration/setup",
            "supabase-intergration/backend",
            "supabase-intergration/supabase-client",
            "supabase-intergration/backend-signup-override",
            "supabase-intergration/frontend",
            "supabase-intergration/policies",
          ],
        },
        {
          type: "category",
          label: "Vercel",
          customProps: {
            logoUrl: "/img/logos/vercel.jpeg",
          },
          items: ["serverless/with-vercel/about"],
        },
        {
          type: "category",
          label: "Capacitor",
          customProps: {
            logoUrl: "/img/logos/capacitorjs-icon.svg",
          },
          items: ["capacitor-integration/about"],
        },
        {
          type: "category",
          label: "T4 App",
          customProps: {
            logoUrl: "/img/logos/t4-app.png",
          },
          items: ["t4-app/about"],
        },
      ],
    },
    {
      type: "category",
      label: "Session Management",
      items: [
        "common-customizations/sessions/about",
        {
          type: "category",
          label: "Protecting API routes",
          items: [
            "common-customizations/sessions/session-verification-in-api/overview",
            "common-customizations/sessions/session-verification-in-api/verify-session",
            "common-customizations/sessions/session-verification-in-api/get-session",
            "common-customizations/sessions/with-jwt/jwt-verification",
          ],
        },
        "common-customizations/sessions/protecting-frontend-routes",
        "common-customizations/sessions/with-jwt/read-jwt",
        "common-customizations/sessions/ssr",
        {
          id: "pre-built-ui/handling-session-tokens",
          type: "doc",
          label: "Access Session Tokens",
        },
        {
          type: "category",
          label: "Reading / modifying session claims",
          items: [
            "common-customizations/sessions/claims/access-token-payload",
            "common-customizations/sessions/claims/claim-validators",
          ],
        },
        { id: "pre-built-ui/sign-out", type: "doc", label: "Add Sign Out" },
        {
          id: "pre-built-ui/auth-redirection",
          type: "doc",
          label: "Add Redirect Actions",
        },
        "common-customizations/sessions/revoke-session",
        "common-customizations/sessions/anonymous-session",
        "common-customizations/sessions/user-impersonation",
        "common-customizations/sessions/fetching-tenant-id",
        "common-customizations/sessions/with-websocket",
        {
          type: "category",
          label: "Session security",
          items: [
            "common-customizations/sessions/cookies-and-https",
            "common-customizations/sessions/cookie-consent",
            "common-customizations/sessions/anti-csrf",
            "common-customizations/sessions/same-site-cookie",
            "common-customizations/sessions/jwt-signing-key-rotation",
            "common-customizations/sessions/change-session-timeout",
            "common-customizations/sessions/access-token-blacklisting",
          ],
        },
        "common-customizations/sessions/share-sessions-across-sub-domains",
        "common-customizations/sessions/token-transfer-method",
        {
          type: "category",
          label: "Other operations",
          items: [
            "common-customizations/sessions/handling-session-expiry",
            "common-customizations/sessions/multiple-api-endpoints",
            "common-customizations/sessions/fetch-sessions-for-user",
            "common-customizations/sessions/in-iframe",
            "common-customizations/sessions/error-handling",
            "common-customizations/sessions/disable-interception",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Auth flow customizations",
      collapsed: true,
      items: [
        "common-customizations/handling-signinup-success",
        {
          type: "category",
          label: "Sign in / up",
          items: [
            {
              type: "category",
              label: "Social login providers",
              items: [
                "common-customizations/sign-in-and-up/built-in-providers",
                "common-customizations/sign-in-and-up/custom-providers",
              ],
            },
            {
              type: "category",
              label: "Multi tenancy and Enterprise SSO",
              items: [
                "common-customizations/multi-tenancy/overview",
                "common-customizations/multi-tenancy/new-tenant-config",
                {
                  type: "category",
                  label: "Common UX flows",
                  items: [
                    "common-customizations/multi-tenancy/common-domain-login",
                    "common-customizations/multi-tenancy/sub-domain-login",
                  ],
                },
                {
                  type: "category",
                  label: "SAML Login",
                  items: [
                    "common-customizations/saml/what-is-saml",
                    "common-customizations/saml/saml-login",
                    {
                      type: "category",
                      label: "With BoxyHQ",
                      customProps: {
                        logoUrl: "/img/logos/boxyhq.png",
                      },
                      items: [
                        "common-customizations/saml/with-boxyhq/what-is-boxyhq",
                        "common-customizations/saml/with-boxyhq/flow-diagram",
                        "common-customizations/saml/with-boxyhq/integration-steps",
                      ],
                    },
                  ],
                },
                "common-customizations/multi-tenancy/custom-provider",
                "common-customizations/multi-tenancy/multi-app",
              ],
            },
            "common-customizations/sign-in-and-up/provider-config",
            "common-customizations/sign-in-and-up/toc-privacypolicy",
            "common-customizations/embed-sign-in-up-form",
          ],
        },
        "add-multiple-clients-for-the-same-provider",
        "common-customizations/get-user-info",
        "common-customizations/user-pagination",
        "common-customizations/delete-user",
        {
          type: "category",
          label: "Account Linking",
          items: [
            "common-customizations/account-linking/overview",
            "common-customizations/account-linking/automatic-account-linking",
            "common-customizations/account-linking/manual-account-linking",
            "common-customizations/account-linking/security-considerations",
            "common-customizations/account-linking/adding-accounts-to-session",
          ],
        },
        {
          type: "category",
          label: "Email Verification",
          items: [
            "common-customizations/email-verification/about",
            "common-customizations/email-verification/protecting-routes",
            "common-customizations/email-verification/email-verification-email",
            "common-customizations/email-verification/embed-in-page",
            "common-customizations/email-verification/handling-email-verification-success",
            "common-customizations/email-verification/changing-token-lifetime",
            "common-customizations/email-verification/changing-style",
            "common-customizations/email-verification/changing-email-verification-status",
            "common-customizations/email-verification/generate-link-manually",
          ],
        },
        {
          type: "category",
          label: "Email Delivery",
          items: [
            "email-delivery/about",
            "email-delivery/default",
            {
              type: "category",
              label: "Method 2) SMTP service",
              items: [
                "email-delivery/smtp/configure-smtp",
                "email-delivery/smtp/change-email-content",
              ],
            },
            "email-delivery/custom-method",
            "email-delivery/pre-post-email",
          ],
        },
        {
          type: "category",
          label: "User Metadata",
          items: [
            "common-customizations/usermetadata/about",
            "common-customizations/usermetadata/setup",
            "common-customizations/usermetadata/store-data",
            "common-customizations/usermetadata/get-data",
            "common-customizations/usermetadata/clear-data",
          ],
        },
        {
          type: "category",
          label: "Styling",
          items: [
            "common-customizations/styling/changing-colours",
            "common-customizations/styling/changing-style",
            "common-customizations/styling/shadow-dom",
          ],
        },
        "common-customizations/translations",
        {
          type: "category",
          label: "Changing base path",
          items: [
            "common-customizations/changing-base-path/website-base-path",
            "common-customizations/changing-base-path/api-base-path",
          ],
        },
        "common-customizations/multiple-clients",
        "common-customizations/userid-format",
        {
          id: "pre-built-ui/setup/core/saas-setup",
          label: "Connecting to the SuperTokens Core Managed Service",
          type: "doc",
        },
        {
          type: "category",
          label: "Self Hosting SuperTokens Core",
          items: [
            "pre-built-ui/setup/core/with-docker",
            "pre-built-ui/setup/core/without-docker",
            {
              type: "category",
              label: "Database Setup",
              items: [
                "pre-built-ui/setup/database-setup/mysql",
                "pre-built-ui/setup/database-setup/postgresql",
                "pre-built-ui/setup/database-setup/rename-database-tables",
              ],
            },
          ],
        },
        {
          type: "category",
          label:
            "Backend and frontend overrides (actions, hooks and UI customisation)",
          items: [
            "advanced-customizations/overview",
            "advanced-customizations/user-context/custom-request-properties",
            {
              type: "category",
              label: "React component override",
              items: [
                "advanced-customizations/react-component-override/about",
                "advanced-customizations/react-component-override/usage",
              ],
            },
            {
              type: "category",
              label: "Frontend functions override",
              items: [
                "advanced-customizations/frontend-functions-override/about",
                "advanced-customizations/frontend-functions-override/usage",
              ],
            },
            {
              type: "category",
              label: "Backend functions override",
              items: [
                "advanced-customizations/backend-functions-override/about",
                "advanced-customizations/backend-functions-override/usage",
              ],
            },
            {
              type: "category",
              label: "APIs override",
              items: [
                "advanced-customizations/apis-override/about",
                "advanced-customizations/apis-override/usage",
                {
                  type: "category",
                  label: "Sending custom response",
                  items: [
                    "advanced-customizations/apis-override/custom-response/api-override",
                    "advanced-customizations/apis-override/custom-response/throwing-error",
                    "advanced-customizations/apis-override/custom-response/general-error",
                  ],
                },
                "advanced-customizations/apis-override/disabling",
              ],
            },
            {
              type: "category",
              label: "Frontend hooks",
              items: [
                "advanced-customizations/frontend-hooks/pre-api",
                "advanced-customizations/frontend-hooks/handle-event",
                "advanced-customizations/frontend-hooks/redirection-callback",
              ],
            },
            "advanced-customizations/user-context",
            "advanced-customizations/backend-sdk-core-interceptor",
          ],
        },
        {
          type: "category",
          label: "SuperTokens core settings",
          items: [
            "common-customizations/core/api-keys",
            "common-customizations/core/ip-allow-deny",
            "common-customizations/core/performance",
            "common-customizations/core/logging",
            "common-customizations/core/add-ssl-via-nginx",
            "common-customizations/core/base-path",
            {
              type: "category",
              label: "CLI",
              items: [
                "common-customizations/cli/overview",
                "common-customizations/cli/start",
                "common-customizations/cli/list",
                "common-customizations/cli/stop",
                "common-customizations/cli/uninstall",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Other customizations",
          items: [
            {
              type: "category",
              label: "Account deduplication",
              items: [
                "common-customizations/deduplication/overview",
                "common-customizations/deduplication/implementing-deduplication",
              ],
            },
            {
              type: "category",
              label: "Disable sign up / implement invite flow",
              items: [
                "common-customizations/disable-sign-up/overview",
                "common-customizations/disable-sign-up/thirdparty-changes",
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Additional Features",
      items: [
        {
          type: "category",
          label: "User Roles",
          items: [
            "user-roles/initialisation",
            "user-roles/creating-role",
            "user-roles/managing-roles-and-users",
            "user-roles/protecting-routes",
            "user-roles/managing-roles-and-permissions",
            "user-roles/get-all-roles",
            "user-roles/delete-roles",
          ],
        },
        "mfa",
        "multi-tenant",
        "attack-protection-suite",
        {
          type: "category",
          label: "User Management dashboard",
          items: [
            "pre-built-ui/setup/user-management-dashboard/setup",
            "pre-built-ui/setup/user-management-dashboard/users-listing-and-details",
            "pre-built-ui/setup/user-management-dashboard/managing-user-roles-and-permissions",
            {
              type: "category",
              label: "Tenant Management",
              collapsed: true,
              items: [
                "pre-built-ui/setup/user-management-dashboard/tenant-management/overview",
                "pre-built-ui/setup/user-management-dashboard/tenant-management/details",
              ],
            },
          ],
        },
      ],
    },
    "scalability",
    "rate-limits",
    {
      type: "category",
      label: "Testing & Debugging",
      items: [
        "testing/testing-with-postman",
        "troubleshooting/how-to-troubleshoot",
        "troubleshooting/cors-issues",
        "troubleshooting/checklist",
      ],
    },
    {
      type: "category",
      label: "Migrating to Supertokens",
      items: [
        "migration/about",
        {
          type: "category",
          label: "Step 1) Account Creation",
          items: [
            "migration/account-creation/user-creation",
            "migration/account-creation/user-id-mapping",
            "migration/account-creation/email-verification",
          ],
        },
        "migration/data-migration",
        "migration/session-migration",
        "migration/mfa-migration",
      ],
    },
    "updating-supertokens",
    {
      type: "category",
      label: "References",
      items: [
        "architecture",
        "user-object",
        "other-frameworks",
        "appinfo",
        "sdks",
        "apis",
        "compatibility-table",
        {
          type: "category",
          label: "Prebuilt UI Components",
          items: [
            "pre-built-ui/further-reading/thirdparty-login",
            "pre-built-ui/further-reading/email-verification",
          ],
        },
      ],
    },
  ],
};
