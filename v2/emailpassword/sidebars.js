module.exports = {
  sidebar: [
    "introduction",
    {
      type: 'category',
      label: 'Quick setup',
      items: [
        "quick-setup/overview",
        "quick-setup/frontend",
        "quick-setup/backend",
        {
          type: 'category',
          label: 'Core',
          items: [
            "quick-setup/core/with-docker",
            "quick-setup/core/without-docker",
            "quick-setup/core/saas-setup"
          ],
        },
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
    "appinfo",
    {
      type: 'category',
      collapsed: false,
      label: 'Common customizations',
      items: [
        "common-customizations/redirect-to-auth",
        "common-customizations/sign-out",
        {
          type: 'category',
          label: 'Sign Up Form',
          items: [
            "common-customizations/signup-form/adding-fields",
            "common-customizations/signup-form/field-validators",
            "common-customizations/signup-form/toc-privacypolicy",
            "common-customizations/signup-form/default-to-sign-up"
          ],
        },
        {
          type: "category",
          label: "Sign In Form",
          items: [
            "common-customizations/signin-form/field-validators",
          ]
        },
        "common-customizations/password-managers",
        "common-customizations/embed-sign-in-up-form",
        "common-customizations/handling-signup-success",
        "common-customizations/handling-signin-success",
        {
          type: "category",
          label: "User Roles",
          items: [
            "common-customizations/user-roles/assigning-users-roles",
            "common-customizations/user-roles/assigning-session-roles",
            "common-customizations/user-roles/reading-role-in-api",
            "common-customizations/user-roles/reading-role-in-frontend",
            "common-customizations/user-roles/updating-session-roles"
          ]
        },
        {
          type: "category",
          label: "Reset Password",
          items: [
            "common-customizations/reset-password/about",
            "common-customizations/reset-password/password-reset-email",
            "common-customizations/reset-password/embed-in-page",
            "common-customizations/reset-password/post-reset-password"

          ]
        },
        {
          type: "category",
          label: "Email Verification",
          items: [
            "common-customizations/email-verification/about",
            "common-customizations/email-verification/email-verification-email",
            "common-customizations/email-verification/embed-in-page",
            "common-customizations/email-verification/handling-email-verification-success"
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
            "common-customizations/sessions/user-information-front-end",
            "common-customizations/sessions/handling-session-expiry",
            "common-customizations/sessions/securing-component",
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
          label: "Multi Tenancy",
          items: [
            "common-customizations/multi-tenancy/about",
            "common-customizations/multi-tenancy/one-login-many-sub-domains",
            "common-customizations/multi-tenancy/one-login-per-sub-domain"
          ]
        },
        "common-customizations/user-pagination",
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
      label: 'Advanced customizations',
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
      label: 'Serverless Deployment',
      items: [
        {
          type: 'category',
          label: 'With Netlify',
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
          items: [
            "serverless/with-aws-lambda/about",
            "serverless/with-aws-lambda/frontend",
            "serverless/with-aws-lambda/backend-config",
            "serverless/with-aws-lambda/auth-serverless",
            "serverless/with-aws-lambda/api-gateway-config",
            "serverless/with-aws-lambda/session-verification",
            "serverless/with-aws-lambda/next-steps"
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
    "sdks",
    "apis"
  ]
};
