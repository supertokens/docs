
/** @type {import('@docusaurus/types').DocusaurusConfig} */

/**
 * Remark plugins intercept markdown content before they are parsed into HTML
 * Read more here: https://github.com/remarkjs/remark/blob/main/doc/plugins.md
 */
 let remarkPlugins = [
  require("./src/plugins/markdownVariables")
];

let rehypePlugins = [
  require('./src/plugins/addNofollowToExternalLinks')
];

module.exports = {
  title: 'SuperTokens Docs',
  url: 'https://supertokens.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  trailingSlash: false,
  stylesheets: [
    "https://fonts.googleapis.com/css?family=Rubik:300,400,500,700&amp;display=swap"
  ],
  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
    },
    navbar: {
      logo: {
        src: 'img/logoWithNameLight.svg',
        href: "/",
        target: "_blank"
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
          docsPluginId: 'nodejs',
        },
        {
          type: 'docsVersionDropdown',
          //// Optional
          position: 'left',
          // Add additional dropdown items at the beginning/end of the dropdown.
          dropdownItemsBefore: [],
          // Do not add the link active class when browsing docs.
          dropdownActiveClassDisabled: true,
          docsPluginId: 'auth-react',
        },
        {
          type: 'docsVersionDropdown',
          //// Optional
          position: 'left',
          // Add additional dropdown items at the beginning/end of the dropdown.
          dropdownItemsBefore: [],
          // Do not add the link active class when browsing docs.
          dropdownActiveClassDisabled: true,
          docsPluginId: 'website',
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
          target: "_blank"
        },
        {
          href: 'https://supertokens.com/discord',
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
      theme: require('prism-react-renderer/themes/vsDark'),
    },
    algolia: {
      apiKey: 'ce04a158637d345fc094ebbfa9a5156a',
      indexName: 'supertokens',
      appId: "SBR5UR2Z16"
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
          editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
          remarkPlugins: remarkPlugins,
          rehypePlugins: rehypePlugins
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
      // loads the supertokens.com react bundle for footer and analytics etc..
      "./src/plugins/reactBundle",
      {
        id: "react-bundle",
      }
    ],
    [
      "./src/plugins/copyDocsAndCodeTypeChecking",
      {
        // used for copying docs content via the <-COPY DOCS-> directive
        // used for do code type checking as well AFTER running cop docs
        id: "copy-docs-and-code-type-checking",
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'emailpassword',
        path: 'emailpassword',
        routeBasePath: 'docs/emailpassword',
        sidebarPath: require.resolve('./emailpassword/sidebars.js'),
        showLastUpdateTime: true,
        editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'passwordless',
        path: 'passwordless',
        routeBasePath: 'docs/passwordless',
        sidebarPath: require.resolve('./passwordless/sidebars.js'),
        showLastUpdateTime: true,
        editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'guides',
        path: 'guides',
        routeBasePath: 'docs/guides',
        editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'thirdparty',
        path: 'thirdparty',
        routeBasePath: 'docs/thirdparty',
        sidebarPath: require.resolve('./thirdparty/sidebars.js'),
        showLastUpdateTime: true,
        editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'thirdpartyemailpassword',
        path: 'thirdpartyemailpassword',
        routeBasePath: 'docs/thirdpartyemailpassword',
        sidebarPath: require.resolve('./thirdpartyemailpassword/sidebars.js'),
        showLastUpdateTime: true,
        editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'thirdpartypasswordless',
        path: 'thirdpartypasswordless',
        routeBasePath: 'docs/thirdpartypasswordless',
        sidebarPath: require.resolve('./thirdpartypasswordless/sidebars.js'),
        showLastUpdateTime: true,
        editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'session',
        path: 'session',
        routeBasePath: 'docs/session',
        sidebarPath: require.resolve('./session/sidebars.js'),
        showLastUpdateTime: true,
        editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'nodejs',
        path: 'nodejs',
        routeBasePath: 'docs/nodejs',
        sidebarPath: require.resolve('./nodejs/sidebars.js'),
        showLastUpdateTime: true,
        editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'auth-react',
        path: 'auth-react',
        routeBasePath: 'docs/auth-react',
        sidebarPath: require.resolve('./auth-react/sidebars.js'),
        showLastUpdateTime: true,
        editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'website',
        path: 'website',
        routeBasePath: 'docs/website',
        sidebarPath: require.resolve('./website/sidebars.js'),
        showLastUpdateTime: true,
        editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'contribute',
        path: 'contribute',
        routeBasePath: 'docs/contribute',
        sidebarPath: require.resolve('./contribute/sidebars.js'),
        showLastUpdateTime: true,
        editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'change_me',
        path: 'change_me',
        routeBasePath: 'docs/change_me',
        sidebarPath: require.resolve('./change_me/sidebars.js'),
        showLastUpdateTime: true,
        editUrl: 'https://github.com/supertokens/docs/tree/master/v2/',
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins
      },
    ]
  ],
};
