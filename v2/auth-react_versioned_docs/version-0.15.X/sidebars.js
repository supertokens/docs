module.exports = {
  sidebar: [
    "installation",
    "init",
    {
      type: 'category',
      label: 'EmailPassword',
      items: [
        "emailpassword/init",
        {
          type: 'category',
          label: 'Config',
          items: [
            "emailpassword/config/sign-up",
            "emailpassword/config/sign-in",
            "emailpassword/config/reset-password",
            "emailpassword/config/email-verification"
          ],
        },
        {
          type: 'category',
          label: 'Override',
          items: [
            "emailpassword/override/functions",
            "emailpassword/override/components"
          ],
        },
        "emailpassword/sign-out",
        "emailpassword/email-password-auth",
        "emailpassword/redirect-to-auth"
      ],
    },
    {
      type: 'category',
      label: 'ThirdParty',
      items: [
        "thirdparty/init",
        {
          type: 'category',
          label: 'Config',
          items: [
            "thirdparty/config/sign-in-and-up",
            "thirdparty/config/email-verification"
          ],
        },
        {
          type: 'category',
          label: 'Override',
          items: [
            "thirdparty/override/functions",
            "thirdparty/override/components"
          ],
        },
        "thirdparty/sign-out",
        "thirdparty/third-party-auth",
        "thirdparty/redirect-to-auth"
      ],
    },
    {
      type: 'category',
      label: 'ThirdPartyEmailPassword',
      items: [
        "thirdpartyemailpassword/init",
        {
          type: 'category',
          label: 'Config',
          items: [
            "thirdpartyemailpassword/config/sign-in-and-up",
            "thirdpartyemailpassword/config/sign-up",
            "thirdpartyemailpassword/config/sign-in",
            "thirdpartyemailpassword/config/reset-password",
            "thirdpartyemailpassword/config/email-verification"
          ],
        },
        {
          type: 'category',
          label: 'Override',
          items: [
            "thirdpartyemailpassword/override/functions",
            "thirdpartyemailpassword/override/components"
          ],
        },
        "thirdpartyemailpassword/sign-out",
        "thirdpartyemailpassword/third-party-email-password-auth",
        "thirdpartyemailpassword/redirect-to-auth"
      ],
    },
    {
      type: 'category',
      label: 'Email verification',
      items: [
        {
          type: 'category',
          label: 'Override',
          items: [
            "emailverification/override/functions",
            "emailverification/override/components"
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Session',
      items: [
        "session/init",
        "session/sign-out",
        "session/session-auth",
        {
          type: 'category',
          label: 'Override',
          items: [
            "session/override/functions"
          ],
        },
      ],
    },
  ]
};
