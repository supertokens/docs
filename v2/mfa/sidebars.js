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
      ],
    },
    {
      type: 'category',
      label: 'Email / SMS OTP',
      collapsed: true,
      items: [
        "email-sms-otp/otp-for-all-users",
        "email-sms-otp/otp-for-opt-in-users",
      ],
    },
    "protect-routes",
    "how-it-works",
    {
      type: 'category',
      label: 'Backend Setup',
      collapsed: false,
      items: [
        "backend/first-factor",
        "backend/second-factor",
        "backend/protecting-api",
      ],
    },
    "frontend-custom",
    {
      type: 'category',
      label: 'Using pre-built UI',
      items: [
        "pre-built-ui/init",
        "pre-built-ui/showing-login-ui",
        "pre-built-ui/protecting-routes"
      ],
    },
  ]
};