module.exports = {
  sidebar: [
    "introduction",
    "important-concepts",
    "backend-setup",
    "frontend-setup",
    {
      type: 'category',
      label: 'TOTP',
      collapsed: true,
      items: [
        "totp/totp-for-all-users",
        "totp/totp-for-opt-in-users",
        "totp/embed",
      ],
    },
    {
      type: 'category',
      label: 'Email / SMS OTP',
      collapsed: true,
      items: [
        "email-sms-otp/otp-for-all-users",
        "email-sms-otp/otp-for-opt-in-users",
        "email-sms-otp/embed"
      ],
    },
    "protect-routes",
    "with-email-verification",
    "step-up-auth",
    {
      type: 'category',
      label: 'Migration',
      collapsed: true,
      items: [
        "migration",
        "legacy-to-new",
        "old-sdk-to-new"
      ],
    },
    {
      type: 'category',
      label: 'Legacy MFA method',
      collapsed: true,
      items: [
        "legacy-method/legacy-vs-new",
        "legacy-method/how-it-works",
        {
          type: 'category',
          label: 'Backend Setup',
          collapsed: false,
          items: [
            "legacy-method/backend/first-factor",
            "legacy-method/backend/second-factor",
            "legacy-method/backend/protecting-api",
          ],
        },
        "legacy-method/frontend-custom",
        {
          type: 'category',
          label: 'Using pre-built UI',
          items: [
            "legacy-method/pre-built-ui/init",
            "legacy-method/pre-built-ui/showing-login-ui",
            "legacy-method/pre-built-ui/protecting-routes"
          ],
        },
      ],
    },
  ]
};