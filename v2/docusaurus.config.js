
/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'SuperTokens Docs',
  url: 'https://supertokens.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  themeConfig: {
    colorMode: {
      disableSwitch: true,
    },
    navbar: {
      logo: {
        src: 'img/logoWithNameLight.svg',
        href: "https://supertokens.io"
      },
      items: [
        {
          type: 'docsVersionDropdown',
          //// Optional
          position: 'left',
          // Add additional dropdown items at the beginning/end of the dropdown.
          dropdownItemsBefore: [],
          // Do not add the link active class when browsing docs.
          dropdownActiveClassDisabled: true,
          docsPluginId: 'default',
        },
        {
          type: 'docsVersionDropdown',
          //// Optional
          position: 'left',
          // Add additional dropdown items at the beginning/end of the dropdown.
          dropdownItemsBefore: [],
          // Do not add the link active class when browsing docs.
          dropdownActiveClassDisabled: true,
          docsPluginId: 'change_me',
        },
        {
          href: 'https://supertokens.io/blog',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://supertokens.io/discord',
          label: 'Ask Questions',
          position: 'right',
        },
        {
          href: 'https://github.com/supertokens/supertokens-to_replace',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: require('prism-react-renderer/themes/dracula'),
    },
    algolia: {
      apiKey: '0eeffc534667153c420f239cc6c7f4fb',
      indexName: 'supertokens',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'community',
          routeBasePath: 'docs/community',
          sidebarPath: require.resolve('./community/sidebars.js'),
          showLastUpdateTime: true,
          editUrl: 'https://github.com/supertokens/docs/community/',
        },
        theme: {
          // this is applied to all docs.. not just the community one.
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'change_me',
        path: 'change_me',
        routeBasePath: 'docs/change_me',
        sidebarPath: require.resolve('./change_me/sidebars.js'),
        showLastUpdateTime: true,
        editUrl: 'https://github.com/supertokens/docs/change_me/',
      },
    ],
  ],
};
