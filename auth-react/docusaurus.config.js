/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'SuperTokens',
  tagline: 'Open Source User Auth',
  url: 'https://supertokens.io',
  baseUrl: '/docs/auth-react/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico', // TODO: get a favicon for the site
  organizationName: 'supertokens', // Usually your GitHub org/user name.
  projectName: 'supertokens-auth-react', // Usually your repo name.
  themeConfig: {
    navbar: {
      logo: {
        alt: 'SuperTokens logo',
        src: 'img/logotemp.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'init',
          position: 'right',
          label: 'Docs',
        },
        {to: 'https://supertokens.io/blog', label: 'Blog', position: 'right'},
        {
          href: 'https://github.com/supertokens/docs',
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
              to: '/',
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
              label: 'Blog',
              to: 'https://supertokens.io/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SuperTokens.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // https://docusaurus.io/docs/docs-introduction#docs-only-mode, https://docusaurus.io/docs/presets
          // Please change this to your repo.
          editUrl:
            'https://github.com/supertokens/docs/tree/master/auth-react/docs',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
