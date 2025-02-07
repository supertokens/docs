module.exports = {
  sidebar: [
    "introduction",
    {
      type: "category",
      label: "Use Cases",
      collapsed: false,
      items: [
        "multiple-frontends-with-separate-backends",
        "multiple-frontends-with-a-single-backend",
        "reuse-website-login",
      ],
    },
    {
      type: "category",
      label: "Customizations",
      collapsed: false,
      items: [
        "customizations/working-with-scopes",
        "customizations/add-custom-claims-in-tokens",
        "customizations/verify-tokens",
        "customizations/custom-ui",
        "customizations/multi-tenancy",
      ],
    },
  ],
};
