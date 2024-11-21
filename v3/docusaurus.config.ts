import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

import remarkDocItemContextValues from "./src/plugins/remarkDocItemContextValues";

const config: Config = {
  title: "SuperTokens Docs",
  tagline: "Open Source User Authentication",
  url: "https://supertokens.com",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  trailingSlash: false,
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/docs",
          sidebarPath: "./sidebars.ts",
          // exclude: ["**/*"]
          breadcrumbs: false,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          beforeDefaultRemarkPlugins: [remarkDocItemContextValues],
        },
        blog: false,
        pages: false,
        theme: {
          customCss: "./src/css/custom.scss",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
    },
    image: "https://supertokens.com/static/assets/home-meta.png",
    navbar: {
      title: "SuperTokens",
      logo: {
        alt: "SuperTokens Logo",
        src: "img/logoWithNameLight.svg",
      },
      items: [
        {
          href: "/blog",
          label: "Blog",
          position: "right",
          target: "_blank",
        },
        {
          href: "https://supertokens.com/discord",
          label: "Ask Questions",
          position: "right",
          className: "navbar__item_discord",
        },
        {
          href: "https://github.com/supertokens/supertokens-core",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    algolia: {
      apiKey: "ce04a158637d345fc094ebbfa9a5156a",
      indexName: "supertokens",
      appId: "SBR5UR2Z16",
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [{ from: "/docs", to: "/docs/quickstart/introduction" }],
      },
    ],
    "docusaurus-plugin-sass",
    process.env.NODE_ENV === "production" && "@docusaurus/plugin-debug",
  ].filter(Boolean),
};

export default config;
