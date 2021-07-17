
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
        src: 'img/logoWithNameLight.svg'
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
          href: '/blog',
          label: 'Blog',
          position: 'right',
        },
        {
          href: '/discord',
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
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/community/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SuperTokens, Inc.`,
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
