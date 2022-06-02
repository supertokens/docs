module.exports = {
  sidebar: [
    "introduction",
    "architecture",
    {
      type: 'category',
      label: 'Quick setup',
      collapsed: false,
      items: [
        "quick-setup/video-tutorial",
        "quick-setup/frontend",
        "quick-setup/backend",
        {
          type: 'category',
          label: 'Core',
          items: [
            {
              type: 'category',
              label: 'Self hosted',
              items: [
                "quick-setup/core/with-docker",
                "quick-setup/core/without-docker",
                {
                  type: 'category',
                  label: 'Database Setup',
                  items: [
                    "quick-setup/database-setup/mysql",
                    "quick-setup/database-setup/postgresql",
                    "quick-setup/database-setup/rename-database-tables"
                  ],
                }
              ],
            },
            "quick-setup/core/saas-setup"
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Post login operations',
      items: [
        "common-customizations/sessions/securing-component",
        "common-customizations/verify-session",
        "common-customizations/sign-out",
        "common-customizations/redirecting-post-login",
        "common-customizations/get-user-info",
        "common-customizations/handling-signinup-success",
        "post-login/getting-provider-access-token"
      ],
    },
    {
      type: 'category',
      label: 'Common customizations',
      items: [
        "common-customizations/redirect-to-auth",
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
            "common-customizations/signup-form/toc-privacypolicy",
            "common-customizations/signup-form/default-to-sign-up"
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
        "common-customizations/password-managers",
        "common-customizations/user-pagination",
        "common-customizations/delete-user",
        "common-customizations/embed-sign-in-up-form",
        "common-customizations/account-linking",
        "common-customizations/change-password",
        {
          type: "category",
          label: "User Roles",
          items: [
            "common-customizations/user-roles/assigning-users-roles",
            "common-customizations/user-roles/assigning-session-roles",
            "common-customizations/user-roles/reading-role-in-api",
            "common-customizations/user-roles/reading-role-in-frontend",
            "common-customizations/user-roles/updating-session-roles",
          ]
        },
        {
          type: "category",
          label: "Reset Password",
          items: [
            "common-customizations/reset-password/about",
            "common-customizations/reset-password/password-reset-email",
            "common-customizations/reset-password/embed-in-page",
            "common-customizations/reset-password/post-reset-password",
            "common-customizations/reset-password/changing-token-lifetime"
          ]
        },
        {
          type: "category",
          label: "Email Verification",
          items: [
            "common-customizations/email-verification/about",
            "common-customizations/email-verification/email-verification-email",
            "common-customizations/email-verification/embed-in-page",
            "common-customizations/email-verification/handling-email-verification-success",
            "common-customizations/email-verification/changing-token-lifetime"
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
        "common-customizations/session-with-jwt",
        {
          type: "category",
          label: "Sessions",
          items: [
            "common-customizations/sessions/about",
            {
              type: "category",
              label: "Using sessions with JWTs",
              items: [
                "common-customizations/sessions/with-jwt/about",
                "common-customizations/sessions/with-jwt/enabling-jwts",
                "common-customizations/sessions/with-jwt/custom-claims",
                "common-customizations/sessions/with-jwt/read-jwt",
                "common-customizations/sessions/with-jwt/read-claims",
                "common-customizations/sessions/with-jwt/update-jwt",
                "common-customizations/sessions/with-jwt/get-jwks-and-issuer",
                "common-customizations/sessions/with-jwt/get-public-key",
                "common-customizations/sessions/with-jwt/jwt-verification"
              ]
            },
            "common-customizations/sessions/new-session",
            {
              type: "category",
              label: "Session Verification in API",
              items: [
                "common-customizations/sessions/session-verification-in-api/verify-session",
                "common-customizations/sessions/session-verification-in-api/get-session"
              ]
            },
            "common-customizations/sessions/revoke-session",
            "common-customizations/sessions/change-session-timeout",
            "common-customizations/sessions/checking-session-front-end",
            "common-customizations/sessions/handling-session-expiry",
            "common-customizations/sessions/fetch-sessions-for-user",
            "common-customizations/sessions/update-jwt-payload",
            "common-customizations/sessions/update-session-data",
            "common-customizations/sessions/multiple-api-endpoints",
            "common-customizations/sessions/cookies-and-https",
            "common-customizations/sessions/cookie-consent",
            "common-customizations/sessions/share-sessions-across-sub-domains",
            "common-customizations/sessions/anti-csrf",
            "common-customizations/sessions/same-site-cookie",
            "common-customizations/sessions/jwt-signing-key-rotation",
            "common-customizations/sessions/in-iframe",
            "common-customizations/sessions/error-handling"
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
        {
          type: "category",
          label: "Core",
          items: [
            "common-customizations/core/api-keys",
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

      ],
    },
    {
      type: 'category',
      label: 'Advanced customizations / Overrides',
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
                "advanced-customizations/apis-override/custom-response/throwing-error"
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
    {
      type: 'category',
      label: 'Testing',
      items: [
        "testing/testing-with-postman"
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting / Debug logs',
      items: [
        "troubleshooting/how-to-troubleshoot"
      ],
    },
    {
      type: 'category',
      label: 'Migration',
      items: [
        {
          type: 'category',
          label: 'From Auth0',
          items: [
            "migration/from-auth0/about",
            {
              type: 'category',
              label: 'Step 1) Account Migration',
              items: [
                "migration/from-auth0/account-migration/modifications-to-login",
                "migration/from-auth0/account-migration/userid-mapping",
              ],
            },
            "migration/from-auth0/session-migration"
          ],
        }
      ],
    },
    "appinfo",
    "sdks",
    "apis",
    "compatibility-table"
  ]
};
