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
    {
      type: 'category',
      label: 'Recipe Design',
      items: [
        "recipe-design/about",
        "recipe-design/frontend",
        "recipe-design/backend",
        {
          type: 'category',
          label: 'Core',
          items: [
            "recipe-design/core/table",
            "recipe-design/core/core-logic",
          ],
        },
      ],
    },
  ],
};
