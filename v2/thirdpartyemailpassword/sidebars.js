module.exports = {
  sidebar: [
    {
      type: 'category',
      label: 'Start Here',
      customProps: {
        highlightGroup: true,
      },
      collapsed: false,
      items: [
        "introduction",
        {
          type: 'category',
          label: 'Quick setup with Pre built UI',
          customProps: {
            categoryIcon: "lightning",
          },
          items: [
            {
              type: 'category',
              label: 'Setup',
              collapsed: false,
              items: [
                "pre-built-ui/setup/frontend",
                "pre-built-ui/setup/backend",
                {
                  type: 'category',
                  label: 'Step 3: Core',
                  items: [
                    {
                      type: 'category',
                      label: 'Self hosted',
                      items: [
                        "pre-built-ui/setup/core/with-docker",
                        "pre-built-ui/setup/core/without-docker",
                        {
                          type: 'category',
                          label: 'Database Setup',
                          items: [
                            "pre-built-ui/setup/database-setup/mysql",
                            "pre-built-ui/setup/database-setup/postgresql",
                            "pre-built-ui/setup/database-setup/rename-database-tables"
                          ],
                        }
                      ],
                    },
                    "pre-built-ui/setup/core/saas-setup"
                  ],
                },
                "pre-built-ui/setup/dashboard",
              ]
            },
            "pre-built-ui/handling-session-tokens",
            "pre-built-ui/securing-routes",
            "pre-built-ui/sign-out",
            "pre-built-ui/auth-redirection",
            "pre-built-ui/enable-email-verification",
            {
              type: 'category',
              label: 'Further Reading',
              items: [
                "pre-built-ui/further-reading/email-password-login",
                "pre-built-ui/further-reading/thirdparty-login",
                "pre-built-ui/further-reading/password-reset",
                "pre-built-ui/further-reading/email-verification"
              ]
            },
          ],
        },
        {
          type: 'category',
          label: 'Using your own UI',
          customProps: {
            categoryIcon: "pencil",
          },
          items: [
            {
              type: 'category',
              label: 'Initialisation',
              collapsed: false,
              items: [
                "custom-ui/init/frontend",
                "custom-ui/init/backend",
                {
                  type: 'category',
                  label: 'Step 3: Core',
                  items: [
                    {
                      type: 'category',
                      label: 'Self hosted',
                      items: [
                        "custom-ui/init/core/with-docker",
                        "custom-ui/init/core/without-docker",
                        {
                          type: 'category',
                          label: 'Database Setup',
                          items: [
                            "custom-ui/init/database-setup/mysql",
                            "custom-ui/init/database-setup/postgresql",
                            "custom-ui/init/database-setup/rename-database-tables"
                          ],
                        }
                      ],
                    },
                    "custom-ui/init/core/saas-setup"
                  ],
                },
                "custom-ui/init/dashboard",
              ]
            },
            "custom-ui/email-password-login",
            "custom-ui/thirdparty-login",
            "custom-ui/handling-session-tokens",
            "custom-ui/forgot-password",
            "custom-ui/securing-routes",
            "custom-ui/sign-out",
            "custom-ui/enable-email-verification",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Integrations",
      customProps: {
        logoUrl: [
          {
            url: '/img/logos/hasura-logo.png',
            label: 'Hasura',
          },
          {
            url: '/img/logos/graphql-logo.png',
            label: 'GraphQL',
          },
          {
            url: '/img/logos/next-logo.png',
            label: 'NextJS',
          },
          {
            url: '/img/logos/nest-logo.svg',
            label: 'NestJS',
          },
          {
            url: '/img/logos/aws-lambda.svg',
            label: 'AWS Lambda',
          },
        ],
        hideCategoryIcon: true,
      },
      items: [
        {
          type: 'category',
          label: 'Hasura',
          customProps: {
            logoUrl: '/img/logos/hasura-logo.png'
          },
          items: [
            "hasura-integration/with-jwt",
            "hasura-integration/without-jwt",
          ],
        },
        {
          type: 'category',
          label: 'GraphQL',
          customProps: {
            logoUrl: '/img/logos/graphql-logo.png'
          },
          items: [
            "graphql-integration/backend-setup",
            "graphql-integration/making-requests",
            "graphql-integration/access-session-info",
          ],
        },
        {
          type: 'category',
          label: 'NextJS',
          customProps: {
            logoUrl: '/img/logos/next-logo.png'
          },
          items: [
            "nextjs/about",
            "nextjs/init",
            "nextjs/setting-up-frontend",
            "nextjs/setting-up-backend",
            "nextjs/protecting-route",
            {
              type: 'category',
              label: '5. Session verification',
              items: [
                "nextjs/session-verification/in-api",
                "nextjs/session-verification/in-ssr"
              ],
            },
            "nextjs/next-steps"
          ],
        },
        {
          type: 'category',
          label: 'NestJS',
          customProps: {
            logoUrl: '/img/logos/nest-logo.svg'
          },
          items: [
            "nestjs/guide",
          ],
        },
        {
          type: 'category',
          label: 'RedwoodJS',
          customProps: {
            logoUrl: '/img/logos/redwood-logo.png',
          },
          items: [
            "redwood/about"
          ],
        },
        {
          type: 'category',
          label: 'Netlify',
          customProps: {
            logoUrl: '/img/logos/netlify.svg'
          },
          items: [
            "serverless/with-netlify/about",
            "serverless/with-netlify/frontend",
            "serverless/with-netlify/backend-config",
            "serverless/with-netlify/auth-serverless",
            "serverless/with-netlify/session-verification",
            "serverless/with-netlify/next-steps"
          ],
        },
        {
          type: 'category',
          label: 'AWS Lambda',
          customProps: {
            logoUrl: '/img/logos/aws-lambda.svg'
          },
          items: [
            "serverless/with-aws-lambda/about",
            "serverless/with-aws-lambda/frontend",
            "serverless/with-aws-lambda/backend-config",
            "serverless/with-aws-lambda/auth-serverless",
            "serverless/with-aws-lambda/api-gateway-config",
            {
              type: 'category',
              label: '5. Session Verification',
              items: [
                "serverless/with-aws-lambda/session-verification",
                "serverless/with-aws-lambda/authorizer",
                "serverless/with-aws-lambda/jwt-authorizer",
              ],
            },
            "serverless/with-aws-lambda/next-steps",
            "serverless/with-aws-lambda/appsync-integration"
          ],
        },
        {
          type: 'category',
          label: 'Supabase',
          customProps: {
            logoUrl: '/img/logos/supabase-logo.jpg'
          },
          items: [
            "supabase-intergration/about",
            "supabase-intergration/setup",
            "supabase-intergration/backend",
            "supabase-intergration/supabase-client",
            "supabase-intergration/backend-signup-override",
            "supabase-intergration/frontend",
            "supabase-intergration/policies"
          ],
        },
        {
          type: 'category',
          label: 'Vercel',
          customProps: {
            logoUrl: '/img/logos/vercel.jpeg'
          },
          items: [
            "serverless/with-vercel/about"
          ],
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
            "common-customizations/sessions/session-verification-in-api/verify-session",
            "common-customizations/sessions/session-verification-in-api/get-session"
          ]
        },
        "common-customizations/sessions/protecting-frontend-routes",
        "common-customizations/sessions/ssr",
        {
          type: "category",
          label: "Using sessions with JWTs",
          items: [
            "common-customizations/sessions/with-jwt/enabling-jwts",
            "common-customizations/sessions/with-jwt/custom-claims",
            "common-customizations/sessions/with-jwt/read-jwt",
            "common-customizations/sessions/with-jwt/jwt-verification"
          ]
        },
        {
          type: "category",
          label: "Reading / modifying session claims",
          items: [
            "common-customizations/sessions/claims/access-token-payload",
            "common-customizations/sessions/claims/claim-validators"
          ]
        },
        "common-customizations/sessions/revoke-session",
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
            "common-customizations/sessions/access-token-blacklisting"
          ]
        },
        "common-customizations/sessions/share-sessions-across-sub-domains",
        {
          type: "category",
          label: "Other operations",
          items: [
            "common-customizations/sessions/handling-session-expiry",
            "common-customizations/sessions/multiple-api-endpoints",
            "common-customizations/sessions/fetch-sessions-for-user",
            "common-customizations/sessions/in-iframe",
            "common-customizations/sessions/error-handling",

          ]
        },
      ]
    },
    {
      type: 'category',
      label: 'Auth flow customizations',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: 'Third Party Providers',
          items: [
            "common-customizations/signup-form/built-in-providers",
            "common-customizations/signup-form/changing-oauth-scopes",
            "common-customizations/signup-form/custom-providers",
            "common-customizations/getting-provider-access-token"
          ],
        },
        {
          type: 'category',
          label: 'Sign Up Form',
          items: [
            "common-customizations/signup-form/adding-fields",
            "common-customizations/signup-form/changing-field-labels",
            "common-customizations/signup-form/field-validators",
            "common-customizations/signup-form/toc-privacypolicy"
          ],
        },
        {
          type: "category",
          label: "Sign In Form",
          items: [
            "common-customizations/signin-form/changing-field-labels",
            "common-customizations/signin-form/field-validators",
            "common-customizations/signin-form/built-in-providers",
            "common-customizations/signin-form/custom-providers",
          ]
        },
        "common-customizations/get-user-info",
        "common-customizations/handling-signinup-success",
        "post-login/getting-provider-access-token",
        "common-customizations/password-managers",
        "common-customizations/user-pagination",
        "common-customizations/delete-user",
        "common-customizations/embed-sign-in-up-form",
        "common-customizations/account-linking",
        "common-customizations/change-password",
        {
          type: "category",
          label: "Reset Password",
          items: [
            "common-customizations/reset-password/about",
            "common-customizations/reset-password/password-reset-email",
            "common-customizations/reset-password/embed-in-page",
            "common-customizations/reset-password/post-reset-password",
            "common-customizations/reset-password/changing-token-lifetime",
            "common-customizations/reset-password/generate-link-manually"
          ]
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
            "common-customizations/email-verification/generate-link-manually"
          ]
        },
        {
          type: 'category',
          label: 'Email Delivery',
          items: [
            "email-delivery/about",
            "email-delivery/default",
            {
              type: 'category',
              label: 'Method 2) SMTP service',
              items: [
                "email-delivery/smtp/configure-smtp",
                "email-delivery/smtp/change-email-content"
              ]
            },
            "email-delivery/custom-method",
            "email-delivery/pre-post-email"
          ]
        },
        {
          type: "category",
          label: "Password hashing",
          items: [
            "common-customizations/password-hashing/about",
            "common-customizations/password-hashing/bcrypt",
            "common-customizations/password-hashing/argon2"
          ]
        },
        {
          type: 'category',
          label: 'User Metadata',
          items: [
            "common-customizations/usermetadata/about",
            "common-customizations/usermetadata/setup",
            "common-customizations/usermetadata/store-data",
            "common-customizations/usermetadata/get-data",
            "common-customizations/usermetadata/clear-data"
          ],
        },
        {
          type: "category",
          label: "Styling",
          items: [
            "common-customizations/styling/changing-colours",
            "common-customizations/styling/changing-style",
            "common-customizations/styling/shadow-dom"
          ]
        },
        "common-customizations/translations",
        {
          type: "category",
          label: "Changing base path",
          items: [
            "common-customizations/changing-base-path/website-base-path",
            "common-customizations/changing-base-path/api-base-path"
          ]
        },
        "common-customizations/userid-format",
        {
          type: 'category',
          label: 'Actions, Hooks and Custom API responses',
          items: [
            "advanced-customizations/overview",
            {
              type: 'category',
              label: 'React component override',
              items: [
                "advanced-customizations/react-component-override/about",
                "advanced-customizations/react-component-override/usage"
              ],
            },
            {
              type: 'category',
              label: 'Frontend functions override',
              items: [
                "advanced-customizations/frontend-functions-override/about",
                "advanced-customizations/frontend-functions-override/usage"
              ],
            },
            {
              type: 'category',
              label: 'Backend functions override',
              items: [
                "advanced-customizations/backend-functions-override/about",
                "advanced-customizations/backend-functions-override/usage"
              ],
            },
            {
              type: 'category',
              label: 'APIs override',
              items: [
                "advanced-customizations/apis-override/about",
                "advanced-customizations/apis-override/usage",
                {
                  type: 'category',
                  label: 'Sending custom response',
                  items: [
                    "advanced-customizations/apis-override/custom-response/api-override",
                    "advanced-customizations/apis-override/custom-response/throwing-error",
                    "advanced-customizations/apis-override/custom-response/general-error"
                  ],
                },
                "advanced-customizations/apis-override/disabling"
              ],
            },
            {
              type: 'category',
              label: 'Frontend hooks',
              items: [
                "advanced-customizations/frontend-hooks/pre-api",
                "advanced-customizations/frontend-hooks/handle-event",
                "advanced-customizations/frontend-hooks/redirection-callback"
              ],
            },
            "advanced-customizations/user-context",
            {
              type: 'category',
              label: 'Examples',
              items: [
                {
                  type: 'category',
                  label: 'Using localstorage instead of cookies',
                  items: [
                    "advanced-customizations/examples/localstorage/about",
                    "advanced-customizations/examples/localstorage/guide"
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "category",
          label: "SuperTokens Core customizations",
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
                "common-customizations/cli/uninstall"
              ]
            },
          ]
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
                "common-customizations/deduplication/implementing-deduplication"
              ]
            },
            {
              type: "category",
              label: "Disable sign up / implement invite flow",
              items: [
                "common-customizations/disable-sign-up/overview"
              ]
            },
          ]
        },
      ],
    },
    {
      type: 'category',
      label: 'Additional Features',
      items: [
        {
          type: 'category',
          label: 'User Roles',
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
        {
          type: 'category',
          label: 'SAML',
          items: [
            "common-customizations/saml/what-is-saml",
            "common-customizations/saml/saml-login",
            {
              type: 'category',
              label: 'With BoxyHQ',
              customProps: {
                logoUrl: '/img/logos/boxyhq.png'
              },
              items: [
                "common-customizations/saml/with-boxyhq/what-is-boxyhq",
                "common-customizations/saml/with-boxyhq/flow-diagram",
                "common-customizations/saml/with-boxyhq/integration-steps",
                "common-customizations/saml/with-boxyhq/multi-tenant"
              ],
            },
          ],
        },
      ]
    },
    {
      type: 'category',
      label: 'Testing & Debugging',
      items: [
        "testing/testing-with-postman",
        "troubleshooting/how-to-troubleshoot",
        "troubleshooting/cors-issues"
      ],
    },
    {
      type: 'category',
      label: 'Migration',
      items: [
        "migration/about",
        {
          type: 'category',
          label: 'Step 1) Account Creation',
          items: [
            "migration/account-creation/user-creation",
            "migration/account-creation/user-id-mapping",
            "migration/account-creation/email-verification",
          ],
        },
        "migration/data-migration",
        "migration/session-migration"
      ],
    },
    {
      type: "category",
      label: "References",
      items: [
        "architecture",
        "appinfo",
        "sdks",
        "apis",
        "compatibility-table"
      ],
    },
  ]
};
