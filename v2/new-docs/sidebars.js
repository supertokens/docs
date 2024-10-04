module.exports = {
  sidebar: [
    "home",
    {
      type: "category",
      label: "Quickstart",
      customProps: {
        highlightGroup: true,
      },
      collapsed: false,
      items: [
        "quickstart/introduction",
        "quickstart/frontend",
        "quickstart/backend",
        {
          type: "category",
          label: "Next Steps",
          items: [
            "quickstart/next-steps/core-setup",
            "quickstart/next-steps/handling-session-tokens",
            "quickstart/next-steps/securing-routes",
            "quickstart/next-steps/sign-out",
            "quickstart/next-steps/auth-redirection",
            "quickstart/next-steps/customize-ui",
            "quickstart/next-steps/explore-topics",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Authentication Methods",
      collapsed: false,
      items: [
        {
          type: "category",
          label: "Email Password Login",
          items: [
            {
              type: "category",
              label: "Sign In / Up",
              items: [
                {
                  type: "category",
                  label: "Sign Up Form",
                  items: [
                    "authentication-methods/emailpassword/signup-form/adding-fields",
                    "authentication-methods/emailpassword/signup-form/customising-each-form-field",
                    "authentication-methods/emailpassword/signup-form/field-validators",
                  ],
                },
                {
                  type: "category",
                  label: "Sign In Form",
                  items: [
                    "authentication-methods/emailpassword/signin-form/customising-each-form-field",
                    "authentication-methods/emailpassword/signin-form/field-validators",
                  ],
                },
                "authentication-methods/emailpassword/embed-sign-in-up-form",
                "authentication-methods/emailpassword/password-managers",
              ],
            },
            "authentication-methods/emailpassword/change-password",
            "authentication-methods/emailpassword/change-email-post-login",
            {
              type: "category",
              label: "Reset Password",
              items: [
                "authentication-methods/emailpassword/reset-password/about",
                "authentication-methods/emailpassword/reset-password/password-reset-email",
                "authentication-methods/emailpassword/reset-password/embed-in-page",
                "authentication-methods/emailpassword/reset-password/post-reset-password",
                "authentication-methods/emailpassword/reset-password/changing-token-lifetime",
                "authentication-methods/emailpassword/reset-password/generate-link-manually",
              ],
            },
            {
              type: "category",
              label: "Email Verification",
              items: [
                "authentication-methods/emailpassword/email-verification/about",
                "authentication-methods/emailpassword/email-verification/protecting-routes",
                "authentication-methods/emailpassword/email-verification/email-verification-email",
                "authentication-methods/emailpassword/email-verification/embed-in-page",
                "authentication-methods/emailpassword/email-verification/handling-email-verification-success",
                "authentication-methods/emailpassword/email-verification/changing-token-lifetime",
                "authentication-methods/emailpassword/email-verification/changing-style",
                "authentication-methods/emailpassword/email-verification/changing-email-verification-status",
                "authentication-methods/emailpassword/email-verification/generate-link-manually",
              ],
            },
            {
              type: "category",
              label: "Email Delivery",
              items: [
                "authentication-methods/emailpassword/email-delivery/about",
                "authentication-methods/emailpassword/email-delivery/default",
                {
                  type: "category",
                  label: "Method 2) SMTP service",
                  items: [
                    "authentication-methods/emailpassword/email-delivery/smtp/configure-smtp",
                    "authentication-methods/emailpassword/email-delivery/smtp/change-email-content",
                  ],
                },
                "authentication-methods/emailpassword/email-delivery/custom-method",
                "authentication-methods/emailpassword/email-delivery/pre-post-email",
              ],
            },
            {
              type: "category",
              label: "Password hashing",
              items: [
                "authentication-methods/emailpassword/password-hashing/about",
                "authentication-methods/emailpassword/password-hashing/bcrypt",
                "authentication-methods/emailpassword/password-hashing/argon2",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Passwordless",
          items: [
            "authentication-methods/passwordless/sign-in-and-up/default-country",
            "authentication-methods/passwordless/sign-in-and-up/resend-time-gap",
            "authentication-methods/passwordless/sign-in-and-up/change-maximum-retries",
            "authentication-methods/passwordless/sign-in-and-up/change-otp-format",
            "authentication-methods/passwordless/sign-in-and-up/change-email-phone-validation",
            "authentication-methods/passwordless/generating-magic-link-manually",
            "authentication-methods/passwordless/change-magic-link-url",
            "authentication-methods/passwordless/change-code-lifetime",
            "authentication-methods/passwordless/change-email",
            {
              type: "category",
              label: "Email Delivery",
              items: [
                "authentication-methods/passwordless/email-delivery/about",
                "authentication-methods/passwordless/email-delivery/default",
                {
                  type: "category",
                  label: "Method 2) SMTP service",
                  items: [
                    "authentication-methods/passwordless/email-delivery/smtp/configure-smtp",
                    "authentication-methods/passwordless/email-delivery/smtp/change-email-content",
                  ],
                },
                "authentication-methods/passwordless/email-delivery/custom-method",
                "authentication-methods/passwordless/email-delivery/pre-post-email",
              ],
            },
            {
              type: "category",
              label: "SMS Delivery",
              items: [
                "authentication-methods/passwordless/sms-delivery/about",
                "authentication-methods/passwordless/sms-delivery/default",
                {
                  type: "category",
                  label: "Method 2) Twilio service",
                  items: [
                    "authentication-methods/passwordless/sms-delivery/twilio/configure-twilio",
                    "authentication-methods/passwordless/sms-delivery/twilio/change-sms-content",
                  ],
                },
                "authentication-methods/passwordless/sms-delivery/supertokens-sms-service",
                "authentication-methods/passwordless/sms-delivery/custom-method",
                "authentication-methods/passwordless/sms-delivery/pre-post-email",
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Social/Enterprise Login",
          items: [
            {
              type: "category",
              label: "Social login providers",
              items: [
                "authentication-methods/thirdparty/sign-in-and-up/built-in-providers",
                "authentication-methods/thirdparty/sign-in-and-up/custom-providers",
              ],
            },
            "authentication-methods/thirdparty/sign-in-and-up/provider-config",
            "authentication-methods/thirdparty/sign-in-and-up/toc-privacypolicy",
          ],
        },
        {
          type: "category",
          label: "Phone Password Login",
          items: [
            "authentication-methods/phonepassword/introduction",
            "authentication-methods/phonepassword/architecture",
            "authentication-methods/phonepassword/overview",
            {
              type: "category",
              label: "Backend Setup",
              items: [
                "authentication-methods/phonepassword/backend/email-password-customisation",
                "authentication-methods/phonepassword/backend/session-customisation",
                "authentication-methods/phonepassword/backend/passwordless-customisation",
              ],
            },
            "authentication-methods/phonepassword/frontend",
          ],
        },
        {
          type: "category",
          label: "Multi Factor Authentication",
          items: [
            "authentication-methods/multifactor/introduction",
            "authentication-methods/multifactor/important-concepts",
            "authentication-methods/multifactor/backend-setup",
            "authentication-methods/multifactor/frontend-setup",
            {
              type: "category",
              label: "TOTP",
              collapsed: true,
              items: [
                "authentication-methods/multifactor/totp/totp-for-all-users",
                "authentication-methods/multifactor/totp/totp-for-opt-in-users",
                "authentication-methods/multifactor/totp/embed",
              ],
            },
            {
              type: "category",
              label: "Email / SMS OTP",
              collapsed: true,
              items: [
                "authentication-methods/multifactor/email-sms-otp/otp-for-all-users",
                "authentication-methods/multifactor/email-sms-otp/otp-for-opt-in-users",
                "authentication-methods/multifactor/email-sms-otp/embed",
              ],
            },
            "authentication-methods/multifactor/protect-routes",
            "authentication-methods/multifactor/with-email-verification",
            "authentication-methods/multifactor/step-up-auth",
            "authentication-methods/multifactor/backup-codes",
            {
              type: "category",
              label: "Migration",
              collapsed: true,
              items: [
                "authentication-methods/multifactor/migration",
                "authentication-methods/multifactor/legacy-to-new",
                "authentication-methods/multifactor/old-sdk-to-new",
              ],
            },
            "authentication-methods/multifactor/security",
            {
              type: "category",
              label: "Legacy MFA method",
              collapsed: true,
              items: [
                "authentication-methods/multifactor/legacy-method/legacy-vs-new",
                "authentication-methods/multifactor/legacy-method/how-it-works",
                {
                  type: "category",
                  label: "Backend Setup",
                  collapsed: false,
                  items: [
                    "authentication-methods/multifactor/legacy-method/backend/first-factor",
                    "authentication-methods/multifactor/legacy-method/backend/second-factor",
                    "authentication-methods/multifactor/legacy-method/backend/protecting-api",
                  ],
                },
                "authentication-methods/multifactor/legacy-method/frontend-custom",
                {
                  type: "category",
                  label: "Using pre-built UI",
                  items: [
                    "authentication-methods/multifactor/legacy-method/pre-built-ui/init",
                    "authentication-methods/multifactor/legacy-method/pre-built-ui/showing-login-ui",
                    "authentication-methods/multifactor/legacy-method/pre-built-ui/protecting-routes",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Session Management",
      items: [
        "session-management/handling-session-tokens",
        "session-management/securing-routes",
        "session-management/sign-out",
        "session-management/sessions/about",
        {
          type: "category",
          label: "Protecting API routes",
          items: [
            "session-management/sessions/session-verification-in-api/overview",
            "session-management/sessions/session-verification-in-api/verify-session",
            "session-management/sessions/session-verification-in-api/get-session",
            "session-management/sessions/with-jwt/jwt-verification",
          ],
        },
        "session-management/sessions/protecting-frontend-routes",
        "session-management/sessions/with-jwt/read-jwt",
        "session-management/sessions/ssr",
        {
          type: "category",
          label: "Reading / modifying session claims",
          items: [
            "session-management/sessions/claims/access-token-payload",
            "session-management/sessions/claims/claim-validators",
          ],
        },
        "session-management/sessions/revoke-session",
        "session-management/sessions/anonymous-session",
        "session-management/sessions/user-impersonation",
        "session-management/sessions/fetching-tenant-id",
        "session-management/sessions/with-websocket",
        {
          type: "category",
          label: "Session security",
          items: [
            "session-management/sessions/cookies-and-https",
            "session-management/sessions/cookie-consent",
            "session-management/sessions/anti-csrf",
            "session-management/sessions/same-site-cookie",
            "session-management/sessions/jwt-signing-key-rotation",
            "session-management/sessions/change-session-timeout",
            "session-management/sessions/access-token-blacklisting",
          ],
        },
        "session-management/sessions/share-sessions-across-sub-domains",
        "session-management/sessions/token-transfer-method",
        {
          type: "category",
          label: "Other operations",
          items: [
            "session-management/sessions/handling-session-expiry",
            "session-management/sessions/multiple-api-endpoints",
            "session-management/sessions/fetch-sessions-for-user",
            "session-management/sessions/in-iframe",
            "session-management/sessions/error-handling",
            "session-management/sessions/disable-interception",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "User Management",
      items: [
        "user-management/setup/user-management-dashboard/setup",
        "user-management/setup/user-management-dashboard/users-listing-and-details",
        "user-management/setup/user-management-dashboard/managing-user-roles-and-permissions",
        {
          type: "category",
          label: "User Roles",
          items: [
            "user-management/user-roles/initialisation",
            "user-management/user-roles/creating-role",
            "user-management/user-roles/managing-roles-and-users",
            "user-management/user-roles/protecting-routes",
            "user-management/user-roles/managing-roles-and-permissions",
            "user-management/user-roles/get-all-roles",
            "user-management/user-roles/delete-roles",
          ],
        },
        {
          type: "category",
          label: "User Metadata",
          items: [
            "user-management/common-customizations/usermetadata/about",
            "user-management/common-customizations/usermetadata/setup",
            "user-management/common-customizations/usermetadata/store-data",
            "user-management/common-customizations/usermetadata/get-data",
            "user-management/common-customizations/usermetadata/clear-data",
          ],
        },

        "user-management/common-customizations/get-user-info",
        "user-management/common-customizations/user-pagination",
        "user-management/common-customizations/delete-user",
        {
          type: "category",
          label: "Account Linking",
          items: [
            "user-management/common-customizations/account-linking/adding-accounts-to-session",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Customizations",
      items: [
        "customizations/common-customizations/handling-signup-success",
        "customizations/common-customizations/handling-signin-success",
        {
          type: "category",
          label: "Sign In / Up",
          items: [
            {
              type: "category",
              label: "Sign Up Form",
              items: [
                "customizations/common-customizations/signup-form/adding-fields",
                "customizations/common-customizations/signup-form/customising-each-form-field",
                "customizations/common-customizations/signup-form/field-validators",
              ],
            },
            {
              type: "category",
              label: "Sign In Form",
              items: [
                "customizations/common-customizations/signin-form/customising-each-form-field",
                "customizations/common-customizations/signin-form/field-validators",
              ],
            },
            "customizations/common-customizations/signup-form/toc-privacypolicy",
            "customizations/common-customizations/embed-sign-in-up-form",
            "customizations/common-customizations/password-managers",
          ],
        },
        {
          type: "category",
          label: "Styling",
          items: [
            "customizations/common-customizations/styling/changing-colours",
            "customizations/common-customizations/styling/changing-style",
            "customizations/common-customizations/styling/shadow-dom",
          ],
        },
        {
          type: "category",
          label: "Using your own UI / Custom UI",
          customProps: {
            categoryIcon: "pencil",
          },
          items: [
            "customizations/custom-ui/init/frontend",
            "customizations/custom-ui/email-password-login",
            "customizations/custom-ui/handling-session-tokens",
            "customizations/custom-ui/forgot-password",
            "customizations/custom-ui/securing-routes",
            "customizations/custom-ui/sign-out",
            "customizations/custom-ui/enable-email-verification",
            "customizations/custom-ui/multitenant-login",
          ],
        },
        "customizations/common-customizations/translations",
        {
          type: "category",
          label: "Changing base path",
          items: [
            "customizations/common-customizations/changing-base-path/website-base-path",
            "customizations/common-customizations/changing-base-path/api-base-path",
          ],
        },
        "customizations/common-customizations/multiple-clients",
        {
          type: "category",
          label:
            "Backend and frontend overrides (actions, hooks and UI customisation)",
          items: [
            "customizations/advanced-customizations/overview",
            "customizations/advanced-customizations/user-context/custom-request-properties",
            {
              type: "category",
              label: "React component override",
              items: [
                "customizations/advanced-customizations/react-component-override/about",
                "customizations/advanced-customizations/react-component-override/usage",
              ],
            },
            {
              type: "category",
              label: "Frontend functions override",
              items: [
                "customizations/advanced-customizations/frontend-functions-override/about",
                "customizations/advanced-customizations/frontend-functions-override/usage",
              ],
            },
            {
              type: "category",
              label: "Backend functions override",
              items: [
                "customizations/advanced-customizations/backend-functions-override/about",
                "customizations/advanced-customizations/backend-functions-override/usage",
              ],
            },
            {
              type: "category",
              label: "APIs override",
              items: [
                "customizations/advanced-customizations/apis-override/about",
                "customizations/advanced-customizations/apis-override/usage",
                {
                  type: "category",
                  label: "Sending custom response",
                  items: [
                    "customizations/advanced-customizations/apis-override/custom-response/api-override",
                    "customizations/advanced-customizations/apis-override/custom-response/throwing-error",
                    "customizations/advanced-customizations/apis-override/custom-response/general-error",
                  ],
                },
                "customizations/advanced-customizations/apis-override/disabling",
              ],
            },
            {
              type: "category",
              label: "Frontend hooks",
              items: [
                "customizations/advanced-customizations/frontend-hooks/pre-api",
                "customizations/advanced-customizations/frontend-hooks/handle-event",
                "customizations/advanced-customizations/frontend-hooks/redirection-callback",
              ],
            },
            "customizations/advanced-customizations/user-context",
            "customizations/advanced-customizations/backend-sdk-core-interceptor",
          ],
        },
        {
          type: "category",
          label: "SuperTokens core settings",
          items: [
            "customizations/common-customizations/core/api-keys",
            "customizations/common-customizations/core/ip-allow-deny",
            "customizations/common-customizations/core/performance",
            "customizations/common-customizations/core/logging",
            "customizations/common-customizations/core/add-ssl-via-nginx",
            "customizations/common-customizations/core/base-path",
            {
              type: "category",
              label: "CLI",
              items: [
                "customizations/common-customizations/cli/overview",
                "customizations/common-customizations/cli/start",
                "customizations/common-customizations/cli/list",
                "customizations/common-customizations/cli/stop",
                "customizations/common-customizations/cli/uninstall",
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
              label: "Disable sign up / implement invite flow",
              items: [
                "customizations/common-customizations/disable-sign-up/overview",
                "customizations/common-customizations/disable-sign-up/emailpassword-changes",
              ],
            },
            {
              type: "category",
              label: "Implement username and password login",
              items: [
                "customizations/common-customizations/username-password/overview",
                "customizations/common-customizations/username-password/emailpassword-changes",
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Multi Tenancy",
      items: [
        "multi-tenancy/introduction",
        "multi-tenancy/architecture",
        "multi-tenancy/new-tenant",
        "multi-tenancy/new-app",
        "multi-tenancy/list-tenants-and-apps",
        "multi-tenancy/users-and-tenants",
        "multi-tenancy/recipe-selection",
      ],
    },
    {
      type: "category",
      label: "Advanced Topics",
      items: [
        {
          type: "category",
          label: "Integrations",
          items: [
            {
              type: "category",
              label: "Hasura",
              customProps: {
                logoUrl: "/img/logos/hasura-logo.png",
              },
              items: [
                "advanced-topics/integrations/hasura-integration/with-jwt",
              ],
            },
            {
              type: "category",
              label: "GraphQL",
              customProps: {
                logoUrl: "/img/logos/graphql-logo.png",
              },
              items: [
                "advanced-topics/integrations/graphql-integration/backend-setup",
                "advanced-topics/integrations/graphql-integration/making-requests",
              ],
            },
            {
              type: "category",
              label: "RedwoodJS",
              customProps: {
                logoUrl: "/img/logos/redwood-logo.png",
              },
              items: ["advanced-topics/integrations/redwood/about"],
            },
            {
              type: "category",
              label: "Netlify",
              customProps: {
                logoUrl: "/img/logos/netlify.svg",
              },
              items: [
                "advanced-topics/integrations/serverless/with-netlify/about",
                "advanced-topics/integrations/serverless/with-netlify/frontend",
                "advanced-topics/integrations/serverless/with-netlify/backend-config",
                "advanced-topics/integrations/serverless/with-netlify/auth-serverless",
                "advanced-topics/integrations/serverless/with-netlify/session-verification",
                "advanced-topics/integrations/serverless/with-netlify/next-steps",
              ],
            },
            {
              type: "category",
              label: "AWS Lambda",
              customProps: {
                logoUrl: "/img/logos/aws-lambda.svg",
              },
              items: [
                "advanced-topics/integrations/serverless/with-aws-lambda/about",
                "advanced-topics/integrations/serverless/with-aws-lambda/frontend",
                {
                  type: "category",
                  label: "2. Backend config",
                  items: [
                    "advanced-topics/integrations/serverless/with-aws-lambda/setup-lambda-layer",
                    "advanced-topics/integrations/serverless/with-aws-lambda/setup-lambda",
                    "advanced-topics/integrations/serverless/with-aws-lambda/setup-api-gateway",
                  ],
                },
                {
                  type: "category",
                  label: "3. Session Verification",
                  items: [
                    "advanced-topics/integrations/serverless/with-aws-lambda/session-verification",
                    "advanced-topics/integrations/serverless/with-aws-lambda/authorizer",
                    "advanced-topics/integrations/serverless/with-aws-lambda/jwt-authorizer",
                  ],
                },
                "advanced-topics/integrations/serverless/with-aws-lambda/next-steps",
                "advanced-topics/integrations/serverless/with-aws-lambda/appsync-integration",
              ],
            },
            {
              type: "category",
              label: "Supabase",
              customProps: {
                logoUrl: "/img/logos/supabase-logo.jpg",
              },
              items: [
                "advanced-topics/integrations/supabase-intergration/about",
                "advanced-topics/integrations/supabase-intergration/setup",
                "advanced-topics/integrations/supabase-intergration/backend",
                "advanced-topics/integrations/supabase-intergration/supabase-client",
                "advanced-topics/integrations/supabase-intergration/backend-signup-override",
                "advanced-topics/integrations/supabase-intergration/frontend",
                "advanced-topics/integrations/supabase-intergration/policies",
              ],
            },
            {
              type: "category",
              label: "Vercel",
              customProps: {
                logoUrl: "/img/logos/vercel.jpeg",
              },
              items: [
                "advanced-topics/integrations/serverless/with-vercel/about",
              ],
            },
            {
              type: "category",
              label: "Capacitor",
              customProps: {
                logoUrl: "/img/logos/capacitorjs-icon.svg",
              },
              items: [
                "advanced-topics/integrations/capacitor-integration/about",
              ],
            },
            {
              type: "category",
              label: "T4 App",
              customProps: {
                logoUrl: "/img/logos/t4-app.png",
              },
              items: ["advanced-topics/integrations/t4-app/about"],
            },
          ],
        },
        {
          type: "category",
          label: "Self Hosting",
          items: [
            "advanced-topics/setup/core/with-docker",
            "advanced-topics/setup/core/without-docker",
            {
              type: "category",
              label: "Database Setup",
              items: [
                "advanced-topics/setup/database-setup/mysql",
                "advanced-topics/setup/database-setup/postgresql",
                "advanced-topics/setup/database-setup/rename-database-tables",
              ],
            },
          ],
        },
        "advanced-topics/architecture",
        "advanced-topics/other-frameworks",
        "advanced-topics/multitenant-login",
        "advanced-topics/updating-supertokens",
        {
          type: "category",
          label: "Migrating to Supertokens",
          items: [
            "advanced-topics/migration/about",
            {
              type: "category",
              label: "Step 1) Account Creation",
              items: [
                "advanced-topics/migration/account-creation/user-creation",
                "advanced-topics/migration/account-creation/user-id-mapping",
                "advanced-topics/migration/account-creation/email-verification",
                "advanced-topics/migration/account-creation/ep-migration-without-password-hash",
              ],
            },
            "advanced-topics/migration/data-migration",
            "advanced-topics/migration/session-migration",
            "advanced-topics/migration/mfa-migration",
          ],
        },
        {
          type: "category",
          label: "Tenant Management",
          collapsed: true,
          items: [
            "advanced-topics/setup/user-management-dashboard/tenant-management/overview",
            "advanced-topics/setup/user-management-dashboard/tenant-management/details",
          ],
        },
        "advanced-topics/scalability",
        "advanced-topics/rate-limits",
        {
          type: "category",
          label: "Testing & Debugging",
          items: [
            "advanced-topics/testing/testing-with-postman",
            "advanced-topics/troubleshooting/how-to-troubleshoot",
            "advanced-topics/troubleshooting/cors-issues",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "References",
      items: [
        "references/example-app",
        {
          type: "category",
          label: "UI Reference",
          items: [
            "references/prebuilt-ui/email-password-login",
            "references/prebuilt-ui/password-reset",
            "references/prebuilt-ui/email-verification",
          ],
        },
        "references/appinfo",
        "references/user-object",
        "references/sdks",
        "references/apis",
        "references/compatibility-table",
      ],
    },

    // {
    //   type: "category",
    //   label: "Session Management",
    //   items: [
    //     "pre-built-ui/handling-session-tokens",
    //     "pre-built-ui/securing-routes",
    //     "pre-built-ui/sign-out",
    //     "common-customizations/sessions/about",
    //     {
    //       type: "category",
    //       label: "Protecting API routes",
    //       items: [
    //         "common-customizations/sessions/session-verification-in-api/overview",
    //         "common-customizations/sessions/session-verification-in-api/verify-session",
    //         "common-customizations/sessions/session-verification-in-api/get-session",
    //         "common-customizations/sessions/with-jwt/jwt-verification",
    //       ],
    //     },
    //     "common-customizations/sessions/protecting-frontend-routes",
    //     "common-customizations/sessions/with-jwt/read-jwt",
    //     "common-customizations/sessions/ssr",
    //     {
    //       type: "category",
    //       label: "Reading / modifying session claims",
    //       items: [
    //         "common-customizations/sessions/claims/access-token-payload",
    //         "common-customizations/sessions/claims/claim-validators",
    //       ],
    //     },
    //     "common-customizations/sessions/revoke-session",
    //     "common-customizations/sessions/anonymous-session",
    //     "common-customizations/sessions/user-impersonation",
    //     "common-customizations/sessions/fetching-tenant-id",
    //     "common-customizations/sessions/with-websocket",
    //     {
    //       type: "category",
    //       label: "Session security",
    //       items: [
    //         "common-customizations/sessions/cookies-and-https",
    //         "common-customizations/sessions/cookie-consent",
    //         "common-customizations/sessions/anti-csrf",
    //         "common-customizations/sessions/same-site-cookie",
    //         "common-customizations/sessions/jwt-signing-key-rotation",
    //         "common-customizations/sessions/change-session-timeout",
    //         "common-customizations/sessions/access-token-blacklisting",
    //       ],
    //     },
    //     "common-customizations/sessions/share-sessions-across-sub-domains",
    //     "common-customizations/sessions/token-transfer-method",
    //     {
    //       type: "category",
    //       label: "Other operations",
    //       items: [
    //         "common-customizations/sessions/handling-session-expiry",
    //         "common-customizations/sessions/multiple-api-endpoints",
    //         "common-customizations/sessions/fetch-sessions-for-user",
    //         "common-customizations/sessions/in-iframe",
    //         "common-customizations/sessions/error-handling",
    //         "common-customizations/sessions/disable-interception",
    //       ],
    //     },
    //   ],
    // },
    // {
    //   type: "category",
    //   label: "User Management",
    //   items: [
    //     "pre-built-ui/setup/user-management-dashboard/setup",
    //     "pre-built-ui/setup/user-management-dashboard/users-listing-and-details",
    //     "pre-built-ui/setup/user-management-dashboard/managing-user-roles-and-permissions",
    //     "pre-built-ui/enable-email-verification",
    //     {
    //       type: "category",
    //       label: "User Roles",
    //       items: [
    //         "user-roles/initialisation",
    //         "user-roles/creating-role",
    //         "user-roles/managing-roles-and-users",
    //         "user-roles/protecting-routes",
    //         "user-roles/managing-roles-and-permissions",
    //         "user-roles/get-all-roles",
    //         "user-roles/delete-roles",
    //       ],
    //     },
    //     {
    //       type: "category",
    //       label: "User Metadata",
    //       items: [
    //         "common-customizations/usermetadata/about",
    //         "common-customizations/usermetadata/setup",
    //         "common-customizations/usermetadata/store-data",
    //         "common-customizations/usermetadata/get-data",
    //         "common-customizations/usermetadata/clear-data",
    //       ],
    //     },
    //
    //     "common-customizations/get-user-info",
    //     "common-customizations/user-pagination",
    //     "common-customizations/delete-user",
    //     {
    //       type: "category",
    //       label: "Account Linking",
    //       items: [
    //         "common-customizations/account-linking/adding-accounts-to-session",
    //       ],
    //     },
    //   ],
    // },
    // {
    //   type: "category",
    //   label: "Customizations",
    //   collapsed: true,
    //   items: [
    //     "common-customizations/handling-signup-success",
    //     "common-customizations/handling-signin-success",
    //     {
    //       type: "category",
    //       label: "Sign In / Up",
    //       items: [
    //         {
    //           type: "category",
    //           label: "Sign Up Form",
    //           items: [
    //             "common-customizations/signup-form/adding-fields",
    //             "common-customizations/signup-form/customising-each-form-field",
    //             "common-customizations/signup-form/field-validators",
    //           ],
    //         },
    //         {
    //           type: "category",
    //           label: "Sign In Form",
    //           items: [
    //             "common-customizations/signin-form/customising-each-form-field",
    //             "common-customizations/signin-form/field-validators",
    //           ],
    //         },
    //         {
    //           type: "category",
    //           label: "Multi tenancy",
    //           items: [
    //             "common-customizations/multi-tenancy/overview",
    //             "common-customizations/multi-tenancy/new-tenant-config",
    //             {
    //               type: "category",
    //               label: "Common UX flows",
    //               items: [
    //                 "common-customizations/multi-tenancy/common-domain-login",
    //                 "common-customizations/multi-tenancy/sub-domain-login",
    //               ],
    //             },
    //             "common-customizations/multi-tenancy/multi-app",
    //           ],
    //         },
    //         "common-customizations/signup-form/toc-privacypolicy",
    //         "common-customizations/embed-sign-in-up-form",
    //         "common-customizations/password-managers",
    //       ],
    //     },
    //
    //     "pre-built-ui/auth-redirection",
    //     "common-customizations/change-password",
    //     "common-customizations/change-email-post-login",
    //     {
    //       type: "category",
    //       label: "Reset Password",
    //       items: [
    //         "common-customizations/reset-password/about",
    //         "common-customizations/reset-password/password-reset-email",
    //         "common-customizations/reset-password/embed-in-page",
    //         "common-customizations/reset-password/post-reset-password",
    //         "common-customizations/reset-password/changing-token-lifetime",
    //         "common-customizations/reset-password/generate-link-manually",
    //       ],
    //     },
    //     {
    //       type: "category",
    //       label: "Email Verification",
    //       items: [
    //         "common-customizations/email-verification/about",
    //         "common-customizations/email-verification/protecting-routes",
    //         "common-customizations/email-verification/email-verification-email",
    //         "common-customizations/email-verification/embed-in-page",
    //         "common-customizations/email-verification/handling-email-verification-success",
    //         "common-customizations/email-verification/changing-token-lifetime",
    //         "common-customizations/email-verification/changing-style",
    //         "common-customizations/email-verification/changing-email-verification-status",
    //         "common-customizations/email-verification/generate-link-manually",
    //       ],
    //     },
    //     {
    //       type: "category",
    //       label: "Email Delivery",
    //       items: [
    //         "email-delivery/about",
    //         "email-delivery/default",
    //         {
    //           type: "category",
    //           label: "Method 2) SMTP service",
    //           items: [
    //             "email-delivery/smtp/configure-smtp",
    //             "email-delivery/smtp/change-email-content",
    //           ],
    //         },
    //         "email-delivery/custom-method",
    //         "email-delivery/pre-post-email",
    //       ],
    //     },
    //     {
    //       type: "category",
    //       label: "Password hashing",
    //       items: [
    //         "common-customizations/password-hashing/about",
    //         "common-customizations/password-hashing/bcrypt",
    //         "common-customizations/password-hashing/argon2",
    //       ],
    //     },
    //
    //     {
    //       type: "category",
    //       label: "Styling",
    //       items: [
    //         "common-customizations/styling/changing-colours",
    //         "common-customizations/styling/changing-style",
    //         "common-customizations/styling/shadow-dom",
    //       ],
    //     },
    //     {
    //       type: "category",
    //       label: "Using your own UI / Custom UI",
    //       customProps: {
    //         categoryIcon: "pencil",
    //       },
    //       items: [
    //         {
    //           type: "category",
    //           label: "Initialisation",
    //           collapsed: false,
    //           items: [
    //             "custom-ui/init/frontend",
    //             "custom-ui/init/backend",
    //             {
    //               type: "category",
    //               label: "Step 3: Core",
    //               items: [
    //                 {
    //                   type: "category",
    //                   label: "Self hosted",
    //                   items: [
    //                     "custom-ui/init/core/with-docker",
    //                     "custom-ui/init/core/without-docker",
    //                     {
    //                       type: "category",
    //                       label: "Database Setup",
    //                       items: [
    //                         "custom-ui/init/database-setup/mysql",
    //                         "custom-ui/init/database-setup/postgresql",
    //                         "custom-ui/init/database-setup/rename-database-tables",
    //                       ],
    //                     },
    //                   ],
    //                 },
    //                 "custom-ui/init/core/saas-setup",
    //               ],
    //             },
    //             {
    //               type: "category",
    //               label: "Step 4: User management dashboard",
    //               items: [
    //                 "custom-ui/init/user-management-dashboard/setup",
    //                 "custom-ui/init/user-management-dashboard/users-listing-and-details",
    //                 "custom-ui/init/user-management-dashboard/managing-user-roles-and-permissions",
    //                 {
    //                   type: "category",
    //                   label: "Tenant Management",
    //                   collapsed: true,
    //                   items: [
    //                     "custom-ui/init/user-management-dashboard/tenant-management/overview",
    //                     "custom-ui/init/user-management-dashboard/tenant-management/details",
    //                   ],
    //                 },
    //               ],
    //             },
    //           ],
    //         },
    //         "custom-ui/email-password-login",
    //         "custom-ui/handling-session-tokens",
    //         "custom-ui/forgot-password",
    //         "custom-ui/securing-routes",
    //         "custom-ui/sign-out",
    //         "custom-ui/enable-email-verification",
    //         "custom-ui/multitenant-login",
    //       ],
    //     },
    //     "common-customizations/translations",
    //     {
    //       type: "category",
    //       label: "Changing base path",
    //       items: [
    //         "common-customizations/changing-base-path/website-base-path",
    //         "common-customizations/changing-base-path/api-base-path",
    //       ],
    //     },
    //     "common-customizations/multiple-clients",
    //     "common-customizations/userid-format",
    //     {
    //       type: "category",
    //       label:
    //         "Backend and frontend overrides (actions, hooks and UI customisation)",
    //       items: [
    //         "advanced-customizations/overview",
    //         "advanced-customizations/user-context/custom-request-properties",
    //         {
    //           type: "category",
    //           label: "React component override",
    //           items: [
    //             "advanced-customizations/react-component-override/about",
    //             "advanced-customizations/react-component-override/usage",
    //           ],
    //         },
    //         {
    //           type: "category",
    //           label: "Frontend functions override",
    //           items: [
    //             "advanced-customizations/frontend-functions-override/about",
    //             "advanced-customizations/frontend-functions-override/usage",
    //           ],
    //         },
    //         {
    //           type: "category",
    //           label: "Backend functions override",
    //           items: [
    //             "advanced-customizations/backend-functions-override/about",
    //             "advanced-customizations/backend-functions-override/usage",
    //           ],
    //         },
    //         {
    //           type: "category",
    //           label: "APIs override",
    //           items: [
    //             "advanced-customizations/apis-override/about",
    //             "advanced-customizations/apis-override/usage",
    //             {
    //               type: "category",
    //               label: "Sending custom response",
    //               items: [
    //                 "advanced-customizations/apis-override/custom-response/api-override",
    //                 "advanced-customizations/apis-override/custom-response/throwing-error",
    //                 "advanced-customizations/apis-override/custom-response/general-error",
    //               ],
    //             },
    //             "advanced-customizations/apis-override/disabling",
    //           ],
    //         },
    //         {
    //           type: "category",
    //           label: "Frontend hooks",
    //           items: [
    //             "advanced-customizations/frontend-hooks/pre-api",
    //             "advanced-customizations/frontend-hooks/handle-event",
    //             "advanced-customizations/frontend-hooks/redirection-callback",
    //           ],
    //         },
    //         "advanced-customizations/user-context",
    //         "advanced-customizations/backend-sdk-core-interceptor",
    //       ],
    //     },
    //     {
    //       type: "category",
    //       label: "SuperTokens core settings",
    //       items: [
    //         "common-customizations/core/api-keys",
    //         "common-customizations/core/ip-allow-deny",
    //         "common-customizations/core/performance",
    //         "common-customizations/core/logging",
    //         "common-customizations/core/add-ssl-via-nginx",
    //         "common-customizations/core/base-path",
    //         {
    //           type: "category",
    //           label: "CLI",
    //           items: [
    //             "common-customizations/cli/overview",
    //             "common-customizations/cli/start",
    //             "common-customizations/cli/list",
    //             "common-customizations/cli/stop",
    //             "common-customizations/cli/uninstall",
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       type: "category",
    //       label: "Other customizations",
    //       items: [
    //         {
    //           type: "category",
    //           label: "Disable sign up / implement invite flow",
    //           items: [
    //             "common-customizations/disable-sign-up/overview",
    //             "common-customizations/disable-sign-up/emailpassword-changes",
    //           ],
    //         },
    //         {
    //           type: "category",
    //           label: "Implement username and password login",
    //           items: [
    //             "common-customizations/username-password/overview",
    //             "common-customizations/username-password/emailpassword-changes",
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },
    //
    // {
    //   type: "category",
    //   label: "Advanced Topics",
    //   items: [
    //     {
    //       type: "category",
    //       label: "Self Hosting",
    //       items: [
    //         "pre-built-ui/setup/core/with-docker",
    //         "pre-built-ui/setup/core/without-docker",
    //         {
    //           type: "category",
    //           label: "Database Setup",
    //           items: [
    //             "pre-built-ui/setup/database-setup/mysql",
    //             "pre-built-ui/setup/database-setup/postgresql",
    //             "pre-built-ui/setup/database-setup/rename-database-tables",
    //           ],
    //         },
    //       ],
    //     },
    //     "architecture",
    //     "other-frameworks",
    //
    //     "pre-built-ui/multitenant-login",
    //     "updating-supertokens",
    //     {
    //       type: "category",
    //       label: "Migrating to Supertokens",
    //       items: [
    //         "migration/about",
    //         {
    //           type: "category",
    //           label: "Step 1) Account Creation",
    //           items: [
    //             "migration/account-creation/user-creation",
    //             "migration/account-creation/user-id-mapping",
    //             "migration/account-creation/email-verification",
    //             "migration/account-creation/ep-migration-without-password-hash",
    //           ],
    //         },
    //         "migration/data-migration",
    //         "migration/session-migration",
    //         "migration/mfa-migration",
    //       ],
    //     },
    //     {
    //       type: "category",
    //       label: "Tenant Management",
    //       collapsed: true,
    //       items: [
    //         "pre-built-ui/setup/user-management-dashboard/tenant-management/overview",
    //         "pre-built-ui/setup/user-management-dashboard/tenant-management/details",
    //       ],
    //     },
    //     "scalability",
    //     "rate-limits",
    //     {
    //       type: "category",
    //       label: "Testing & Debugging",
    //       items: [
    //         "testing/testing-with-postman",
    //         "troubleshooting/how-to-troubleshoot",
    //         "troubleshooting/cors-issues",
    //       ],
    //     },
    //   ],
    // },
    // {
    //   type: "category",
    //   label: "References",
    //   items: [
    //     "example-app",
    //     {
    //       type: "category",
    //       label: "UI Reference",
    //       items: [
    //         "pre-built-ui/further-reading/email-password-login",
    //         "pre-built-ui/further-reading/password-reset",
    //         "pre-built-ui/further-reading/email-verification",
    //       ],
    //     },
    //     "appinfo",
    //     "user-object",
    //     "sdks",
    //     "apis",
    //     "compatibility-table",
    //   ],
    // },
  ],
};
