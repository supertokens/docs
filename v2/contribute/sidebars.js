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
            "module-architecture/backend/user-deletion",
          ],
        },
        {
          type: 'category',
          label: 'Core',
          items: [
            "module-architecture/core/overview",
            "module-architecture/core/transactions",
            "module-architecture/core/plugin-interface",
            "module-architecture/core/db-plugins",
            "module-architecture/core/testing",
            "module-architecture/core/cli-and-installer",
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
        "recipe-design/overrides",
      ],
    },
    {
      type: 'category',
      label: 'Development workflow',
      items: [
        "dev-workflow/setting-up-dev-env",
        "dev-workflow/project-management",
        "dev-workflow/git-organised",
        "dev-workflow/github-action"
      ],
    },
    {
      type: 'category',
      label: 'Code style',
      items: [
        "code-style/general",
        "code-style/type-thinking",
        "code-style/typescript",
        "code-style/react",
        "code-style/java",
        "code-style/go"
      ],
    },
    {
      type: 'category',
      label: 'Checklists',
      items: [
        "checklists/new-backend-sdk",
        "checklists/new-frontend-sdk",
        "checklists/new-github-sdk",
        "checklists/new-super-recipe",
        {
          type: 'category',
          label: 'SaaS',
          items: [
            "checklists/saas/add-new-region",
            "checklists/saas/scaling-prod-instances",
            "checklists/saas/upgrading-users-core-version",
            "checklists/saas/issues-removing-app",
            "checklists/saas/mysql-rds",
            "checklists/saas/adding-new-ec2-instance-for-node-api",
            "checklists/saas/db-restore"
          ],
        },
        {
          type: 'category',
          label: 'Website Dev',
          items: [
            "checklists/website/webflow"
          ],
        },
        "checklists/pricing-change-checklist",
        "checklists/new-tech-stack-launch"
      ],
    },
  ],
};
