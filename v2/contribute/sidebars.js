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
      label: 'SDK & Core code architecture',
      items: [
        {
          type: 'category',
          label: 'Frontend',
          items: [
            "module-architecture/frontend/overview",
            "module-architecture/frontend/recipe-structure",
            "module-architecture/frontend/recipe-base-class",
            "module-architecture/frontend/session-interception",
            "module-architecture/frontend/super-recipe",
          ],
        },
        {
          type: 'category',
          label: 'Backend',
          items: [
            "module-architecture/backend/overview",
            "module-architecture/backend/recipe-structure",
            "module-architecture/backend/super-recipe",
            "module-architecture/backend/session-verification",
            "module-architecture/backend/setting-header-cookies",
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
        "recipe-design/api-design",
      ],
    },
  ],
};
