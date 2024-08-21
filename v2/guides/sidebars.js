module.exports = {
  sidebar: [
    "build-a-guide",
    {
      type: "category",
      label: "Authentication Methods",
      items: [
        {
          type: "link",
          label: "Email/Password Login",
          href: "/docs/emailpassword/introduction",
        },
        {
          type: "link",
          label: "Passwordless",
          href: "/docs/passwordless/introduction",
        },
        {
          type: "link",
          label: "Social/Enterprise Login",
          href: "/docs/thirdparty/introduction",
        },
        {
          type: "link",
          label: "Social/Enterprise Login with Email/Password",
          href: "/docs/thirdpartyemailpassword/introduction",
        },
        {
          type: "link",
          label: "Social/Enterprise Login with Passwordless",
          href: "/docs/thirdpartypasswordless/introduction",
        },
        {
          type: "link",
          label: "Phone Password Login",
          href: "/docs/phonepassword/introduction",
        },
      ],
    },
    {
      type: "category",
      label: "Add-ons",
      items: [
        {
          type: "link",
          label: "User Roles",
          href: "/docs/userroles/introduction",
        },
        {
          type: "link",
          label: "Multi Factor Authentication",
          href: "/docs/mfa/introduction",
        },
        {
          type: "link",
          label: "Microserviecs Authentication",
          href: "/docs/microservice_auth/introduction",
        },
        {
          type: "link",
          label: "Session Management",
          href: "/docs/session/introduction",
        },
        {
          type: "link",
          label: "User Management Dashboard",
          href: "/docs/userdashboard/about",
        },
        {
          type: "link",
          label: "Multi Tenancy/Organizations",
          href: "/docs/multitenancy/introduction",
        },
      ],
    },
    {
      type: "category",
      label: "Reference Docs",
      items: [
        {
          type: "link",
          label: "HTTP API Reference",
          href: "/docs/community/apis",
        },
        {
          type: "link",
          label: "SDK Reference",
          href: "/docs/community/sdks",
        },
      ],
    },
  ],
};
