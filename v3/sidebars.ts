import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  quickstart: [
    {
      type: "category",
      label: "Tutorial",
      customProps: { isMainCategory: true },
      collapsed: false,
      items: [
        { id: "quickstart/introduction", label: "Introduction", type: "doc" },
        {
          id: "quickstart/frontend-setup",
          label: "Frontend Setup",
          type: "doc",
        },
        { id: "quickstart/backend-setup", label: "Backend Setup", type: "doc" },
        {
          id: "quickstart/backend-setup",
          label: "Additional Configuraton",
          type: "doc",
        },
      ],
    },
    {
      type: "category",
      label: "Example Applications",
      customProps: { isMainCategory: true },
      collapsed: false,
      items: [
        {
          type: "doc",
          id: "quickstart/example-apps/generate-example-app",
          label: "Generate an Example App",
        },
        {
          type: "doc",
          id: "quickstart/example-apps/explore-available-examples",
          label: "Explore Example Repositories",
        },
      ],
    },
    {
      type: "category",
      label: "Integrations",
      collapsed: false,
      customProps: { isMainCategory: true },
      items: [
        {
          type: "doc",
          id: "quickstart/integrations/aws-lambda",
          label: "AWS Lambda",
        },
        {
          type: "doc",
          id: "quickstart/integrations/graphql",
          label: "Graphql",
        },
        { type: "doc", id: "quickstart/integrations/hasura", label: "Hasura" },
        { type: "doc", id: "quickstart/integrations/nestjs", label: "NestJS" },
        {
          type: "doc",
          id: "quickstart/integrations/netlify",
          label: "Netlify",
        },
        { type: "doc", id: "quickstart/integrations/nextjs", label: "NextJS" },
        {
          type: "doc",
          id: "quickstart/integrations/supabase",
          label: "Supabase",
        },
        { type: "doc", id: "quickstart/integrations/vercel", label: "Vercel" },
      ],
    },
  ],
  guides: [
    "guides/introduction",
    {
      type: "category",
      label: "Authentication Methods",
      customProps: { isMainCategory: true },
      collapsed: false,
      items: [
        {
          type: "category",
          label: "Email and Password",
          items: [
            {
              type: "doc",
              id: "guides/authentication-methods/email-password/setup",
              label: "Setup",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/email-password/post-sign-in-up-callbacks",
              label: "Post Sign In Up Callbacks",
            },
            {
              type: "category",
              label: "Password Hashing",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/password-hashing/about",
                  label: "About",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/password-hashing/bcrypt-hashing",
                  label: "Bcrypt Hashing",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/password-hashing/argon2-hashing",
                  label: "Argon2 Hashing",
                },
              ],
            },
            {
              type: "doc",
              id: "guides/authentication-methods/email-password/allow-users-to-change-their-passwords",
              label: "Allow Users To Change Their Passwords",
            },
            {
              type: "category",
              label: "Sign In Form",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/sign-in-form/customize-form-fields",
                  label: "Customize Form Fields",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/sign-in-form/field-validators",
                  label: "Field Validators",
                },
              ],
            },
            {
              type: "category",
              label: "Reset Password",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/reset-password/change-reset-link-lifetime",
                  label: "Change Reset Link Lifetime",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/reset-password/about",
                  label: "About",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/reset-password/manual-link-generation",
                  label: "Manual Link Generation",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/reset-password/embed-in-a-page",
                  label: "Embed In A Page",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/reset-password/post-password-reset",
                  label: "Post Password Reset",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/reset-password/email-design",
                  label: "Email Design",
                },
              ],
            },
            {
              type: "category",
              label: "Sign Up Form",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/sign-up-form/customize-form-fields",
                  label: "Customize Form Fields",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/sign-up-form/field-validators",
                  label: "Field Validators",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/email-password/sign-up-form/add-extra-fields",
                  label: "Add Extra Fields",
                },
              ],
            },
            {
              type: "doc",
              id: "guides/authentication-methods/email-password/password-managers",
              label: "Password Managers",
            },
          ],
        },
        {
          type: "category",
          label: "Passwordless",
          items: [
            {
              type: "doc",
              id: "guides/authentication-methods/passwordless/setup",
              label: "Setup",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/passwordless/change-email-sms-resend-time",
              label: "Change Email Sms Resend Time",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/passwordless/post-sign-in-up-callbacks",
              label: "Post Sign In Up Callbacks",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/passwordless/change-magic-link-url",
              label: "Change Magic Link Url",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/passwordless/set-default-country-for-phone-inputs",
              label: "Set Default Country For Phone Inputs",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/passwordless/change-otp-format",
              label: "Change Otp Format",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/passwordless/generate-magic-links-manually",
              label: "Generate Magic Links Manually",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/passwordless/otp-and-magic-link-expiration",
              label: "Otp And Magic Link Expiration",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/passwordless/limit-otp-retries",
              label: "Limit Otp Retries",
            },
          ],
        },
        {
          type: "category",
          label: "Social",
          items: [
            {
              type: "doc",
              id: "guides/authentication-methods/social/setup",
              label: "Setup",
            },
            {
              type: "category",
              label: "Providers",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/social/providers/built-in-providers",
                  label: "Built In Providers",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/social/providers/custom-providers",
                  label: "Custom Providers",
                },
              ],
            },
            {
              type: "doc",
              id: "guides/authentication-methods/social/post-sign-in-up-callbacks",
              label: "Post Sign In/Up Callbacks",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/social/built-in-provider-config",
              label: "Built In Provider Config",
            },
          ],
        },
        {
          type: "category",
          label: "MFA",
          items: [
            {
              type: "doc",
              id: "guides/authentication-methods/mfa/introduction",
              label: "Introduction",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/mfa/backend-setup",
              label: "Backend Setup",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/mfa/use-mfa-with-email-verification",
              label: "Use Mfa With Email Verification",
            },
            {
              type: "category",
              label: "Email Sms Otp",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/email-sms-otp/embed-our-prebuilt-ui-component",
                  label: "Embed Our Prebuilt Ui Component",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/email-sms-otp/otp-for-specific-users",
                  label: "Otp For Specific Users",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/email-sms-otp/otp-required-for-all-users",
                  label: "Otp Required For All Users",
                },
              ],
            },
            {
              type: "doc",
              id: "guides/authentication-methods/mfa/implement-backup-recovery-codes",
              label: "Implement Backup Recovery Codes",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/mfa/security-considerations",
              label: "Security Considerations",
            },
            {
              type: "category",
              label: "Legacy Method",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/legacy-method/using-the-prebuilt-ui",
                  label: "Using The Prebuilt Ui",
                },
                {
                  type: "category",
                  label: "Backend Setup",
                  items: [
                    {
                      type: "doc",
                      id: "guides/authentication-methods/mfa/legacy-method/backend-setup/protect-api-routes",
                      label: "Protect Api Routes",
                    },
                    {
                      type: "doc",
                      id: "guides/authentication-methods/mfa/legacy-method/backend-setup/setup-second-factor",
                      label: "Setup Second Factor",
                    },
                    {
                      type: "doc",
                      id: "guides/authentication-methods/mfa/legacy-method/backend-setup/setup-first-factor",
                      label: "Setup First Factor",
                    },
                  ],
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/legacy-method/legacy-vs-new-method",
                  label: "Legacy Vs New Method",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/legacy-method/using-a-custom-ui",
                  label: "Using A Custom Ui",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/legacy-method/how-it-works",
                  label: "How It Works",
                },
              ],
            },
            {
              type: "doc",
              id: "guides/authentication-methods/mfa/protect-frontend-and-backend-routes",
              label: "Protect Frontend And Backend Routes",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/mfa/frontend-setup",
              label: "Frontend Setup",
            },
            {
              type: "category",
              label: "Totp",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/totp/embed-our-prebuilt-ui-component",
                  label: "Embed Our Prebuilt Ui Component",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/totp/totp-for-specific-users",
                  label: "Totp For Specific Users",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/totp/totp-required-for-all-users",
                  label: "Totp Required For All Users",
                },
              ],
            },
            {
              type: "doc",
              id: "guides/authentication-methods/mfa/important-concepts",
              label: "Important Concepts",
            },
            {
              type: "category",
              label: "Migration",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/migration/migration-from-another-solution",
                  label: "Migration From Another Solution",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/migration/migrating-from-an-older-sdk-version",
                  label: "Migrating From An Older Sdk Version",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/mfa/migration/migrating-from-legacy-mfa",
                  label: "Migrating From Legacy Mfa",
                },
              ],
            },
            {
              type: "doc",
              id: "guides/authentication-methods/mfa/step-up-auth",
              label: "Step Up Auth",
            },
          ],
        },
        {
          type: "category",
          label: "Enterprise",
          items: [
            {
              type: "doc",
              id: "guides/authentication-methods/enterprise/setup",
              label: "Setup",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/enterprise/overview",
              label: "Overview",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/enterprise/create-and-configure-tenant",
              label: "Create And Configure Tenant",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/enterprise/add-custom-third-party-provider",
              label: "Add Custom Third Party Provider",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/enterprise/subdomain-login",
              label: "Subdomain Login",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/enterprise/run-multiple-apps-with-the-same-supertokens-core",
              label: "Run Multiple Apps With The Same Supertokens Core",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/enterprise/common-login-domain",
              label: "Common Login Domain",
            },
            {
              type: "category",
              label: "Saml",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/enterprise/saml/what-is-saml",
                  label: "What Is Saml",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/enterprise/saml/add-saml-login",
                  label: "Add Saml Login",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/enterprise/saml/with-boxyhq",
                  label: "With Boxyhq",
                },
              ],
            },
          ],
        },
        {
          type: "category",
          label: "Unified Login",
          items: [
            {
              type: "doc",
              id: "guides/authentication-methods/unified-login/introduction",
              label: "introduction",
            },
            {
              type: "category",
              label: "use-cases",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/unified-login/use-cases/multiple-frontends-common-backend",
                  label: "Multiple Frontends with Common Backend",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/unified-login/use-cases/multiple-frontends-single-backend",
                  label: "Multiple Frontends with Single Backend",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/unified-login/use-cases/reuse-website-login",
                  label: "Reuse Website Login",
                },
              ],
            },
            {
              type: "category",
              label: "customizations",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/unified-login/customizations/validate-tokens",
                  label: "Validate Tokens",
                },
              ],
            },
          ],
        },
        {
          type: "category",
          label: "M2M Authentication",
          items: [
            {
              type: "doc",
              id: "guides/authentication-methods/m2m/introduction",
              label: "Introduction",
            },
            {
              type: "doc",
              id: "guides/authentication-methods/m2m/client-credentials-flow",
              label: "Client Credentials Flow",
            },
            {
              type: "category",
              label: "Legacy Flow",
              items: [
                {
                  type: "doc",
                  id: "guides/authentication-methods/m2m/legacy-flow/implementation-guide",
                  label: "Implementation Guide",
                },
                {
                  type: "doc",
                  id: "guides/authentication-methods/m2m/legacy-flow/security-analysis",
                  label: "Security Analysis",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Sessions",
      customProps: { isMainCategory: true },
      items: [
        {
          type: "doc",
          id: "guides/sessions/how-it-works",
          label: "How It Works",
        },
        {
          type: "category",
          label: "Session Verification",
          items: [
            {
              type: "category",
              label: "Protect API Routes",
              items: [
                {
                  type: "doc",
                  id: "guides/sessions/session-verification/protect-api-routes/overview",
                  label: "overview",
                },
                {
                  type: "doc",
                  id: "guides/sessions/session-verification/protect-api-routes/using-verify-sessions",
                  label: "using-verify-sessions",
                },
                {
                  type: "doc",
                  id: "guides/sessions/session-verification/protect-api-routes/using-get-session",
                  label: "using-get-session",
                },
                {
                  type: "doc",
                  id: "guides/sessions/session-verification/protect-api-routes/manual-jwt-verification",
                  label: "manual-jwt-verification",
                },
              ],
            },
            {
              type: "doc",
              id: "guides/sessions/session-verification/protect-frontend-routes",
              label: "protect-frontend-routes",
            },
            {
              type: "doc",
              id: "guides/sessions/session-verification/verification-during-ssr",
              label: "verification-during-ssr",
            },
            {
              type: "doc",
              id: "guides/sessions/session-verification/websockets",
              label: "websockets",
            },
          ],
        },
        {
          type: "category",
          label: "Session Management",
          items: [
            {
              type: "doc",
              id: "guides/sessions/session-management/create-a-new-session",
              label: "Create a new session",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/anonymous-sessions",
              label: "Anonymous/Guest Sessions",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/handling-session-expiry",
              label: "Handling Session Expiry",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/revoke-a-session",
              label: "Revoke a session",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/impersonate-users",
              label: "Impersonate Users",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/get-tenant-id",
              label: "Get Tenant ID",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/session-claims",
              label: "Session Claims",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/fetch-access-token-string",
              label: "Fetch Access Token String",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/customizing-error-handling",
              label: "Customizing Error Handling",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/disabling-frontend-network-interceptors",
              label: "Disabling Frontend Network Interceptors",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/fetching-session-for-a-user",
              label: "Fetching Session for a User",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/share-sessions-across-subdomains",
              label: "Share Sessions Across Subdomains",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/switch-between-cookie-and-header-based-sessions",
              label: "Switch Between Cookie and Header Based Sessions",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/setup-multiple-frontends-for-one-backend",
              label: "Setup Multiple Frontends for One Backend",
            },

            {
              type: "doc",
              id: "guides/sessions/session-management/using-an-iframe",
              label: "Using an Iframe",
            },
            {
              type: "doc",
              id: "guides/sessions/session-management/working-with-multiple-apis",
              label: "Working with Multiple APIs",
            },
          ],
        },
        {
          type: "category",
          label: "Session Security",
          items: [
            {
              type: "doc",
              id: "guides/sessions/security/access-token-blacklist",
              label: "Access Token Blacklist",
            },
            {
              type: "doc",
              id: "guides/sessions/security/access-token-single-key-rotation",
              label: "Access Token Single Key Rotation",
            },
            {
              type: "doc",
              id: "guides/sessions/security/anti-csrf",
              label: "Anti CSRF",
            },
            {
              type: "doc",
              id: "guides/sessions/security/change-session-timeout",
              label: "Change Session Timeout",
            },
            {
              type: "doc",
              id: "guides/sessions/security/cookie-consent",
              label: "Cookie Consent",
            },
            {
              type: "doc",
              id: "guides/sessions/security/cookies-and-https",
              label: "Cookies and HTTPS",
            },
            {
              type: "doc",
              id: "guides/sessions/security/same-site-cookies",
              label: "Same Site Cookies",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Users",
      customProps: { isMainCategory: true },
      items: [
        {
          type: "doc",
          id: "guides/users/overview",
          label: "Overview",
        },
        {
          type: "category",
          label: "User Management",
          items: [
            {
              type: "doc",
              id: "guides/users/user-management/get-user-info",
              label: "Get user info",
            },
            {
              type: "doc",
              id: "guides/users/user-management/delete-user",
              label: "Delete user",
            },
            {
              type: "doc",
              id: "guides/users/user-management/user-pagination",
              label: "User pagination",
            },
            {
              type: "doc",
              id: "guides/users/user-management/account-deduplication",
              label: "Account Deduplication",
            },
            {
              type: "doc",
              id: "guides/users/user-management/allow-users-to-change-their-email",
              label: "Allow users to change their email",
            },
            {
              type: "doc",
              id: "guides/users/user-management/allow-users-to-change-their-password",
              label: "Allow users to change their password",
            },
            {
              type: "doc",
              id: "guides/users/user-management/assign-custom-user-ids",
              label: "Assign custom user ids",
            },
            {
              type: "doc",
              id: "guides/users/user-management/implement-invite-flow",
              label: "Implement an Invite Flow",
            },
            {
              type: "category",
              label: "User Metadata",
              items: [
                {
                  type: "doc",
                  id: "guides/users/user-management/user-metadata/about",
                  label: "About",
                },
                {
                  type: "doc",
                  id: "guides/users/user-management/user-metadata/feature-setup",
                  label: "Feature setup",
                },
                {
                  type: "doc",
                  id: "guides/users/user-management/user-metadata/store-data",
                  label: "Store data",
                },
                {
                  type: "doc",
                  id: "guides/users/user-management/user-metadata/get-stored-data",
                  label: "Get stored data",
                },
                {
                  type: "doc",
                  id: "guides/users/user-management/user-metadata/delete-stored-data",
                  label: "Delete stored data",
                },
              ],
            },
          ],
        },
        {
          type: "category",
          label: "User Roles",
          items: [
            {
              type: "doc",
              id: "guides/users/user-roles/introduction",
              label: "Introduction",
            },
            {
              type: "doc",
              id: "guides/users/user-roles/initialisation",
              label: "Initialisation",
            },
            {
              type: "doc",
              id: "guides/users/user-roles/manage-roles-and-users",
              label: "Manage roles and users",
            },
            {
              type: "doc",
              id: "guides/users/user-roles/protect-api-and-frontend-routes",
              label: "Protect API and frontend routes",
            },
            {
              type: "doc",
              id: "guides/users/user-roles/create-a-new-role",
              label: "Create a new role",
            },
            {
              type: "doc",
              id: "guides/users/user-roles/delete-roles",
              label: "Delete roles",
            },
            {
              type: "doc",
              id: "guides/users/user-roles/list-all-roles",
              label: "List all roles",
            },
            {
              type: "doc",
              id: "guides/users/user-roles/manage-roles-and-permisions",
              label: "Manage roles and permisions",
            },
            ,
          ],
        },
        {
          type: "category",
          label: "Account Linking",
          items: [
            {
              type: "doc",
              id: "guides/users/account-linking/about",
              label: "About",
            },
            {
              type: "doc",
              id: "guides/users/account-linking/automatic-account-linking",
              label: "Automatic Account Linking",
            },
            {
              type: "doc",
              id: "guides/users/account-linking/manual-account-linking",
              label: "Manual Account Linking",
            },
            {
              type: "doc",
              id: "guides/users/account-linking/security-considerations",
              label: "Security Considerations",
            },
            {
              type: "doc",
              id: "guides/users/account-linking/link-social-accounts",
              label: "Link Social Accounts",
            },
            {
              type: "doc",
              id: "guides/users/account-linking/add-password-to-existing-account",
              label: "Add Password to Existing Account",
            },
          ],
        },
        {
          type: "category",
          label: "Email Verification",
          items: [
            {
              type: "doc",
              id: "guides/users/email-verification/enable-email-verification",
              label: "Enable Email Verification",
            },
            {
              type: "doc",
              id: "guides/users/email-verification/protect-api-and-website-routes",
              label: "Protect API and Website Routes",
            },
            {
              type: "doc",
              id: "guides/users/email-verification/email-design",
              label: "Email Design",
            },
            {
              type: "doc",
              id: "guides/users/email-verification/embed-in-a-page",
              label: "Embed in a Page",
            },
            {
              type: "doc",
              id: "guides/users/email-verification/post-email-verification",
              label: "Post Email Verification",
            },
            {
              type: "doc",
              id: "guides/users/email-verification/change-verification-link-lifetime",
              label: "Change Verification Link Lifetime",
            },
            {
              type: "doc",
              id: "guides/users/email-verification/change-styles-via-css",
              label: "Change Styles via CSS",
            },
            {
              type: "doc",
              id: "guides/users/email-verification/manual-change-verification-status",
              label: "Manually Change Verification Status",
            },
            {
              type: "doc",
              id: "guides/users/email-verification/manual-generate-link",
              label: "Manually Generate Link",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Authentication UI",
      customProps: { isMainCategory: true },
      items: [
        {
          type: "category",
          label: "Styling",
          items: [
            {
              type: "doc",
              id: "guides/ui-customization/styling/changing-colors",
              label: "changing-colors",
            },
            {
              type: "doc",
              id: "guides/ui-customization/styling/changing-styles",
              label: "changing-styles",
            },
            {
              type: "doc",
              id: "guides/ui-customization/styling/disable-use-of-shadow-dom",
              label: "disable-use-of-shadow-dom",
            },
          ],
        },
        {
          type: "category",
          label: "Create Your Own UI",
          items: [
            {
              type: "doc",
              id: "guides/ui-customization/custom-ui/overview",
              label: "Overview",
            },
          ],
        },
        {
          type: "doc",
          id: "guides/ui-customization/translations",
          label: "Translations",
        },
        {
          type: "doc",
          id: "guides/ui-customization/terms-of-service-and-privacy-policy",
          label: "Terms of Service and Privacy Policy",
        },
        {
          type: "doc",
          id: "guides/ui-customization/embed-sign-in-up-form-in-a-page",
          label: "Embed Sign In/Up Form in a Page",
        },
      ],
    },
    {
      type: "category",
      label: "Multi Tenancy",
      customProps: { isMainCategory: true },
      items: [
        {
          type: "doc",
          id: "guides/multi-tenancy/intro",
          label: "Introduction",
        },
        {
          type: "doc",
          id: "guides/multi-tenancy/architecture",
          label: "Architecture",
        },
        {
          type: "doc",
          id: "guides/multi-tenancy/creating-a-new-app",
          label: "Creating a new app",
        },
        {
          type: "doc",
          id: "guides/multi-tenancy/creating-a-new-tenant",
          label: "Creating a new tenant",
        },
        {
          type: "doc",
          id: "guides/multi-tenancy/listing-all-tenants-and-apps",
          label: "Listing all tenants and apps",
        },
        {
          type: "doc",
          id: "guides/multi-tenancy/setting-up-login-for-tenants",
          label: "Setting up login for tenants",
        },
        {
          type: "doc",
          id: "guides/multi-tenancy/users-and-tenants",
          label: "Users and tenants",
        },
      ],
    },
    {
      type: "category",
      label: "Migrations",
      customProps: { isMainCategory: true },
      items: [
        { type: "doc", id: "guides/migrations/overview", label: "Overview" },
        {
          type: "doc",
          id: "guides/migrations/account-creation",
          label: "Account Creation",
        },
        {
          type: "doc",
          id: "guides/migrations/user-data-migration",
          label: "User Data Migration",
        },
        {
          type: "doc",
          id: "guides/migrations/session-migration",
          label: "Session Migration",
        },
        {
          type: "doc",
          id: "guides/migrations/mfa-migration",
          label: "MFA Migration",
        },
      ],
    },
    {
      type: "category",
      label: "Security",
      customProps: { isMainCategory: true },
      items: [
        {
          type: "category",
          label: "Attack Protection Suite",
          items: [
            {
              type: "doc",
              id: "guides/security/attack-protection-suite/introduction",
              label: "Introduction",
            },
            {
              type: "doc",
              id: "guides/security/attack-protection-suite/enabling-the-feature",
              label: "Enabling the Feature",
            },
            {
              type: "doc",
              id: "guides/security/attack-protection-suite/backend-setup",
              label: "Backend Setup",
            },
            {
              type: "doc",
              id: "guides/security/attack-protection-suite/frontend-setup",
              label: "Frontend Setup",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Platform Configuration",
      customProps: { isMainCategory: true },
      items: [
        {
          type: "category",
          label: "SuperTokens Core",
          items: [
            {
              type: "doc",
              id: "guides/architecture/supertokens-core/add-api-keys",
              label: "Add API Keys",
            },
            {
              type: "doc",
              id: "guides/architecture/supertokens-core/logging",
              label: "Logging",
            },
            {
              type: "doc",
              id: "guides/architecture/supertokens-core/performance-tuning",
              label: "Performance Tuning",
            },
            {
              type: "doc",
              id: "guides/architecture/supertokens-core/allow-deny-requests",
              label: "Allow/Deny Requests",
            },
            {
              type: "doc",
              id: "guides/architecture/supertokens-core/add-ssl-via-nginx",
              label: "Add SSL via Nginx",
            },
            {
              type: "doc",
              id: "guides/architecture/supertokens-core/add-a-base-path",
              label: "Add a Base Path",
            },
            {
              type: "doc",
              id: "guides/architecture/supertokens-core/cli",
              label: "CLI",
            },
          ],
        },
        {
          type: "category",
          label: "Email Delivery",
          items: [
            {
              type: "doc",
              id: "guides/architecture/email-delivery/email-delivery-services",
              label: "Email Delivery Services",
            },
            {
              type: "doc",
              id: "guides/architecture/email-delivery/default-service",
              label: "Default Service",
            },
            {
              type: "doc",
              id: "guides/architecture/email-delivery/custom-method",
              label: "Custom Method",
            },
            {
              type: "doc",
              id: "guides/architecture/email-delivery/smtp-service",
              label: "SMTP Service",
            },
            {
              type: "doc",
              id: "guides/architecture/email-delivery/hooks-and-overrides",
              label: "Hooks and Overrides",
            },
          ],
        },
        {
          type: "category",
          label: "SMS Delivery",
          items: [
            {
              type: "doc",
              id: "guides/architecture/sms-delivery/sms-delivery-services",
              label: "SMS Delivery Services",
            },
            {
              type: "doc",
              id: "guides/architecture/sms-delivery/default-service",
              label: "Default Service",
            },
            {
              type: "doc",
              id: "guides/architecture/sms-delivery/twilio-service",
              label: "Twilio Service",
            },
            {
              type: "doc",
              id: "guides/architecture/sms-delivery/supertokens-sms-service",
              label: "Supertokens SMS Service",
            },
            {
              type: "doc",
              id: "guides/architecture/sms-delivery/custom-method",
              label: "Custom Method",
            },
            {
              type: "doc",
              id: "guides/architecture/sms-delivery/hooks-and-overrides",
              label: "Hooks and Overrides",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Deployment",
      customProps: { isMainCategory: true },
      items: [
        {
          type: "category",
          label: "Self Hosting",
          items: [
            {
              type: "doc",
              id: "guides/architecture/self-hosting/overview",
              label: "Overview",
            },
          ],
        },
        {
          type: "category",
          label: "Testing and Debugging",
          items: [
            {
              type: "doc",
              id: "guides/architecture/testing-and-debugging/testing-with-postman",
              label: "Testing With Postman",
            },
            {
              type: "doc",
              id: "guides/architecture/testing-and-debugging/cors-issues",
              label: "CORS Issues",
            },
            {
              type: "doc",
              id: "guides/architecture/testing-and-debugging/how-to-enable-debug-logs",
              label: "How to Enable Debug Logs",
            },
            {
              type: "doc",
              id: "guides/architecture/testing-and-debugging/troubleshooting-checklist",
              label: "Troubleshooting Checklist",
            },
          ],
        },
        {
          type: "doc",
          id: "guides/architecture/scalability",
          label: "Scalability",
        },
        {
          type: "doc",
          id: "guides/architecture/rate-limit",
          label: "Rate Limiting",
        },
        {
          type: "doc",
          id: "guides/architecture/update-sdks-and-core",
          label: "Update Guide",
        },
      ],
    },
    {
      type: "category",
      label: "Dashboard",
      customProps: { isMainCategory: true },
      items: [
        {
          type: "doc",
          id: "guides/dashboard/overview",
          label: "Overview",
        },
        {
          type: "category",
          label: "Tenants",
          items: [
            {
              type: "doc",
              id: "guides/dashboard/tenants/overview",
              label: "Overview",
            },
            {
              type: "doc",
              id: "guides/dashboard/tenants/manage-third-party-providers",
              label: "Manage Third Party Providers",
            },
            {
              type: "doc",
              id: "guides/dashboard/tenants/view-tenant-details",
              label: "View Tenant Details",
            },
          ],
        },
        {
          type: "category",
          label: "Users",
          items: [
            {
              type: "doc",
              id: "guides/dashboard/users/manage-roles-and-permissions",
              label: "Manage Roles And Permissions",
            },
            {
              type: "doc",
              id: "guides/dashboard/users/view-users",
              label: "View Users",
            },
          ],
        },
      ],
    },
  ],
  references: [
    {
      type: "doc",
      label: "Introduction",
      id: "references/introduction",
    },
    {
      type: "doc",
      id: "references/how-supertokens-works",
      label: "How SuperTokens Works",
    },
    { type: "doc", id: "references/user-object", label: "User Object" },
    { type: "doc", id: "references/app-info", label: "App Info" },
    {
      type: "category",
      label: "SDKs",
      collapsed: false,
      customProps: { isMainCategory: true },
      items: [
        { type: "doc", id: "references/sdks/overrides", label: "Overrides" },
        { type: "doc", id: "references/sdks/hooks", label: "Hooks" },
        {
          type: "doc",
          id: "references/sdks/sdk-reference",
          label: "SDK Reference",
        },
        {
          type: "doc",
          id: "references/sdks/compatibility-table",
          label: "Compatibility Table",
        },
      ],
    },
    {
      type: "category",
      label: "API",
      collapsed: false,
      customProps: { isMainCategory: true },
      items: [
        { type: "doc", id: "references/api-reference", label: "API Reference" },
      ],
    },
  ],
};

export default sidebars;
