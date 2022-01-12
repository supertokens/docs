module.exports = {
  sidebar: [
    "introduction",
    {
      type: 'category',
      label: 'Quick setup',
      collapsed: false,
      items: [
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
      ],
    },
    {
      type: 'category',
      label: 'Common customizations',
      items: [
        "common-customizations/redirect-to-auth",
        "common-customizations/user-pagination",
        {
          type: "category",
          label: "Sign In / Up",
          items: [
            "common-customizations/sign-in-up/default-country",
            "common-customizations/sign-in-up/guess-phonenumber",
            "common-customizations/sign-in-up/resend-time-gap",
            "common-customizations/sign-in-up/toc-privacypolicy",
          ],
        },
        "common-customizations/change-code-lifetime",
        "common-customizations/change-magic-link-url",
        "common-customizations/change-maximum-retries",
        "common-customizations/embed-sign-in-up-form",
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
          label: "Sessions",
          items: [
            "common-customizations/sessions/about",
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
          type: "category",
          label: "Styling",
          items: [
            "common-customizations/styling/changing-colours",
            "common-customizations/styling/changing-style",
            "common-customizations/styling/shadow-dom"
          ]
        },
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
    "flow_diagram",
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
      label: 'Serverless Deployment',
      items: [
        {
          type: 'category',
          label: 'With Netlify',
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
          label: 'With AWS Lambda',
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
      label: 'Migration',
      items: [
        {
          type: 'category',
          label: 'From Auth0',
          items: [
            "migration/from-auth0/about"
          ],
        }
      ],
    },
    "appinfo",
    "sdks",
    "apis"
  ]
};
