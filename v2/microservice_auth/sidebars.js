module.exports = {
  sidebar: [
    "introduction",
    {
      type: "category",
      label: "Implementation",
      collapsed: false,
      items: [
        "jwt-creation",
        {
          type: "category",
          label: "JWT Verification",
          items: [
            "jwt-verification/index",
            "jwt-verification/get-public-key"
          ]
        },
      ]
    },
    "security-analysis"
  ]
};
