module.exports = {
  sidebar: [
    "installation",
    {
      type: 'category',
      collapsed: false,
      label: 'Usage',
      items: [
        "usage/init",
        "usage/sending-requests-with-fetch",
        "usage/sending-requests-with-axios",
        "usage/checking-for-active-session",
        "usage/reading-userid",
        "usage/reading-jwt-payload",
        "usage/sign-out",
        {
          type: 'category',
          label: 'Override',
          items: [
            "usage/override/functions"
          ],
        },
      ],
    },
    "api-reference"
  ]
};
