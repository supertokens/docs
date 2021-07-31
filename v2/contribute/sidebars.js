module.exports = {
  sidebar: [
    "introduction",
    {
      type: 'category',
      label: 'Architecture',
      items: [
        "architecture/overview",
        "architecture/recipes",
        {
          type: 'category',
          label: 'Modules',
          items: [
            "architecture/modules/frontend",
            "architecture/modules/backend",
            "architecture/modules/core",
            "architecture/modules/db-plugin",
          ],
        },
        {
          type: 'category',
          label: 'Interfaces',
          items: [
            "architecture/interfaces/fdi",
            "architecture/interfaces/cdi",
            "architecture/interfaces/plugin-interface",
          ],
        },
      ],
    },
  ],
};
