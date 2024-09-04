module.exports = {
  sidebar: [
    {
      id: "new-structure",
      type: "doc",
      label: "Home",
    },
    {
      type: "category",
      label: "Getting Started/Quickstart",
      collapsed: false,
      items: [
        { type: "link", href: "https://supertokens.com", label: "Basics" },
        { type: "link", href: "https://supertokens.com", label: "Frontend" },
        { type: "link", href: "https://supertokens.com", label: "Backend" },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Common Actions",
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
          label: "Email/Password Login",
          items: [
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Overview",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Reset Password",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Email Verification",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Email Delivery",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Password Hashing",
            },
          ],
        },
        {
          type: "category",
          label: "Passwordless Authentication",
          items: [
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Overview",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Generating Magic Links Manually",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Changing the Magic Link URL",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "OTP and Magic Link Expiration",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Email Delivery",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "SMS Delivery",
            },
          ],
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Social/Enterprise SSO",
        },
        {
          type: "category",
          label: "Multi-Factor Authentication",
          items: [
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Overview",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Backend Setup",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Frontend Setup",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "TOTP",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Email/SMS OTP",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Protecting Frontend and Backend Routes",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Email Verification",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Step Up Auth",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Backup/Recovery Codes",
            },
          ],
        },
        {
          type: "category",
          label: "Multi-Tenancy",
          items: [
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Overview",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Architecture",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Creating a new Tenant",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Creating a new App",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Listing All Tenants and Apps",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Users and Tenants",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Settings Up Login for Tenants",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Session Management",
      items: [
        {
          type: "link",
          href: "https://supertokens.com",
          label: "How it works",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Protecting API Routes",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Protecting Frontend Routes",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Session Expiry",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Fetching the JWT and Reading Claims",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Session Verification During SSR",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Working Session Claims",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Revoking a Session",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Anonymous/Guest Sessions",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "User Impersonation",
        },
      ],
    },
    {
      type: "category",
      label: "Users and Roles",
      items: [
        {
          type: "link",
          href: "https://supertokens.com",
          label: "The User Object",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Get User Info",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "User Pagination",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Delete User",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Account Linking",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Custom User IDs",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Allow Users to Change Their Email",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Allow Users to Change Their Passwords",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Initialize Roles and Permissions",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Create a Role",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Protect Frontend and Backend Routes",
        },
      ],
    },
    {
      type: "category",
      label: "Customizations",
      collapsed: false,
      items: [
        {
          type: "link",
          label: "Post Signin/Signup Callbacks",
          href: "https://supertokens.com",
        },
        {
          type: "link",
          label: "Translations",
          href: "https://supertokens.com",
        },
        {
          type: "category",
          label: "Styling",
          items: [
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Changing Colors",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Changing Style via CSS",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Disable Use of Shadow DOM",
            },
          ],
        },

        {
          type: "category",
          label: "Login Flow Adjustments",
          items: [
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Change Redirection Path Post Login",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Email Verification",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Add Extra fields to the sign up form",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Customizing form fields",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Add terms of service and privacy policy links",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Embed Sign In/Up form in a page",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Password Managers",
            },
          ],
        },
        {
          type: "link",
          label: "Build Your Own Custom UI",
          href: "https://supertokens.com",
        },
        {
          type: "category",
          label: "Overrides",
          items: [
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Overview",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Adding and Reading Custom Request Properties",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "React Component Override",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Frontend Functions Override",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Backend Functions Override",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "APIs Override",
            },
          ],
        },
        {
          type: "category",
          label: "Hooks",
          items: [
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Pre API Hook",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Handle Event Hook",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Redirection Callback Hook",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Backend SDK Core Interceptor",
            },
          ],
        },
        {
          type: "category",
          label: "SuperTokens Core Settings",
          items: [
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Adding API Keys",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Allow/Deny requests based on IP address",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Tuning Performance",
            },
            { type: "link", href: "https://supertokens.com", label: "Logging" },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Adding SSL via NGINX",
            },
            {
              type: "link",
              href: "https://supertokens.com",
              label: "Adding a Base Path",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Advanced Topics",
      collapsed: false,
      items: [
        {
          type: "link",
          href: "https://supertokens.com",
          label: "How SuperTokens Works",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Self Hosting",
        },
        { type: "link", href: "https://supertokens.com", label: "Security" },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Custom Architecture",
        },
        { type: "link", href: "https://supertokens.com", label: "Scalability" },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Rate Limit Policy",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Migrating To Supertokens",
        },
      ],
    },
    {
      type: "category",
      label: "Guides",
      collapsed: false,
      items: [
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Implement a Custom Invite Flow",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Setting up multiple frontends for one backend",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Implement username and password login",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Testing with Postman",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Enabling debug logs",
        },
        {
          type: "link",
          href: "https://supertokens.com",
          label: "Troubleshooting CORS Issues",
        },
      ],
    },
    {
      type: "category",
      label: "References",
      collapsed: false,
      items: [
        {
          type: "link",
          href: "https://supertokens.com",
          label: "App Info",
        },
        { type: "link", href: "https://supertokens.com", label: "SDKs" },
        { type: "link", href: "https://supertokens.com", label: "APIs" },
      ],
    },
  ],
};
