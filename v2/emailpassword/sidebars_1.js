module.exports = {
  sidebar: [
    {
      type: "category",
      label: "Quickstart",
      customProps: {
        highlightGroup: true,
      },
      collapsed: false,
      items: [
        "introduction",
        "pre-built-ui/setup/core/saas-setup",
        "pre-built-ui/setup/frontend",
        "pre-built-ui/setup/backend",
        "next-steps",
      ],
    },
    {
      type: "category",
      label: "Session Management",
      items: [
        "pre-built-ui/handling-session-tokens",
        "pre-built-ui/securing-routes",
        "pre-built-ui/sign-out",
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
          type: "category",
          label: "Reading / modifying session claims",
          items: [
            "common-customizations/sessions/claims/access-token-payload",
            "common-customizations/sessions/claims/claim-validators",
          ],
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
      label: "User Management",
      items: [
        "pre-built-ui/setup/user-management-dashboard/setup",
        "pre-built-ui/setup/user-management-dashboard/users-listing-and-details",
        "pre-built-ui/setup/user-management-dashboard/managing-user-roles-and-permissions",
        "pre-built-ui/enable-email-verification",
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

        "common-customizations/get-user-info",
        "common-customizations/user-pagination",
        "common-customizations/delete-user",
        {
          type: "category",
          label: "Account Linking",
          items: [
            "common-customizations/account-linking/adding-accounts-to-session",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Customizations",
      collapsed: true,
      items: [
        "common-customizations/handling-signup-success",
        "common-customizations/handling-signin-success",
        {
          type: "category",
          label: "Sign In / Up",
          items: [
            {
              type: "category",
              label: "Sign Up Form",
              items: [
                "common-customizations/signup-form/adding-fields",
                "common-customizations/signup-form/customising-each-form-field",
                "common-customizations/signup-form/field-validators",
              ],
            },
            {
              type: "category",
              label: "Sign In Form",
              items: [
                "common-customizations/signin-form/customising-each-form-field",
                "common-customizations/signin-form/field-validators",
              ],
            },
            {
              type: "category",
              label: "Multi tenancy",
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
                "common-customizations/multi-tenancy/multi-app",
              ],
            },
            "common-customizations/signup-form/toc-privacypolicy",
            "common-customizations/embed-sign-in-up-form",
            "common-customizations/password-managers",
          ],
        },

        "pre-built-ui/auth-redirection",
        "common-customizations/change-password",
        "common-customizations/change-email-post-login",
        {
          type: "category",
          label: "Reset Password",
          items: [
            "common-customizations/reset-password/about",
            "common-customizations/reset-password/password-reset-email",
            "common-customizations/reset-password/embed-in-page",
            "common-customizations/reset-password/post-reset-password",
            "common-customizations/reset-password/changing-token-lifetime",
            "common-customizations/reset-password/generate-link-manually",
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
          label: "Password hashing",
          items: [
            "common-customizations/password-hashing/about",
            "common-customizations/password-hashing/bcrypt",
            "common-customizations/password-hashing/argon2",
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
        {
          type: "category",
          label: "Using your own UI / Custom UI",
          customProps: {
            categoryIcon: "pencil",
          },
          items: [
            {
              type: "category",
              label: "Initialisation",
              collapsed: false,
              items: [
                "custom-ui/init/frontend",
                "custom-ui/init/backend",
                {
                  type: "category",
                  label: "Step 3: Core",
                  items: [
                    {
                      type: "category",
                      label: "Self hosted",
                      items: [
                        "custom-ui/init/core/with-docker",
                        "custom-ui/init/core/without-docker",
                        {
                          type: "category",
                          label: "Database Setup",
                          items: [
                            "custom-ui/init/database-setup/mysql",
                            "custom-ui/init/database-setup/postgresql",
                            "custom-ui/init/database-setup/rename-database-tables",
                          ],
                        },
                      ],
                    },
                    "custom-ui/init/core/saas-setup",
                  ],
                },
                {
                  type: "category",
                  label: "Step 4: User management dashboard",
                  items: [
                    "custom-ui/init/user-management-dashboard/setup",
                    "custom-ui/init/user-management-dashboard/users-listing-and-details",
                    "custom-ui/init/user-management-dashboard/managing-user-roles-and-permissions",
                    {
                      type: "category",
                      label: "Tenant Management",
                      collapsed: true,
                      items: [
                        "custom-ui/init/user-management-dashboard/tenant-management/overview",
                        "custom-ui/init/user-management-dashboard/tenant-management/details",
                      ],
                    },
                  ],
                },
              ],
            },
            "custom-ui/email-password-login",
            "custom-ui/handling-session-tokens",
            "custom-ui/forgot-password",
            "custom-ui/securing-routes",
            "custom-ui/sign-out",
            "custom-ui/enable-email-verification",
            "custom-ui/multitenant-login",
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
              label: "Disable sign up / implement invite flow",
              items: [
                "common-customizations/disable-sign-up/overview",
                "common-customizations/disable-sign-up/emailpassword-changes",
              ],
            },
            {
              type: "category",
              label: "Implement username and password login",
              items: [
                "common-customizations/username-password/overview",
                "common-customizations/username-password/emailpassword-changes",
              ],
            },
          ],
        },
      ],
    },

    {
      type: "category",
      label: "Advanced Topics",
      items: [
        {
          type: "category",
          label: "Self Hosting",
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
        "architecture",
        "other-frameworks",

        "pre-built-ui/multitenant-login",
        "updating-supertokens",
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
                "migration/account-creation/ep-migration-without-password-hash",
              ],
            },
            "migration/data-migration",
            "migration/session-migration",
            "migration/mfa-migration",
          ],
        },
        {
          type: "category",
          label: "Tenant Management",
          collapsed: true,
          items: [
            "pre-built-ui/setup/user-management-dashboard/tenant-management/overview",
            "pre-built-ui/setup/user-management-dashboard/tenant-management/details",
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
          ],
        },
      ],
    },
    {
      type: "category",
      label: "References",
      items: [
        "example-app",
        {
          type: "category",
          label: "UI Reference",
          items: [
            "pre-built-ui/further-reading/email-password-login",
            "pre-built-ui/further-reading/password-reset",
            "pre-built-ui/further-reading/email-verification",
          ],
        },
        "appinfo",
        "user-object",
        "sdks",
        "apis",
        "compatibility-table",
      ],
    },
  ],
};