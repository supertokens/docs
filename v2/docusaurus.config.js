/** @type {import('@docusaurus/types').DocusaurusConfig} */

/**
 * Remark plugins intercept markdown content before they are parsed into HTML
 * Read more here: https://github.com/remarkjs/remark/blob/main/doc/plugins.md
 */
let remarkPlugins = [
  require("./src/plugins/markdownVariables"),
  require("./src/plugins/tocHeaderProcessor/postHeaderFixer"),
];

/**
 * These are remark plugins that run specifically before the default ones docusaurus adds
 */
let beforeDefaultRemarkPlugins = [require("./src/plugins/tocHeaderProcessor")];

let rehypePlugins = [require("./src/plugins/addNofollowToExternalLinks")];

module.exports = {
  title: "SuperTokens Docs",
  url: "https://supertokens.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  favicon: "img/favicon.ico",
  trailingSlash: false,
  stylesheets: [
    "https://fonts.googleapis.com/css?family=Rubik|Roboto:300,400,500,700&amp;display=swap",
  ],
  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
    },
    navbar: {
      logo: {
        src: "img/logoWithNameLight.svg",
        href: "/",
        target: "_blank",
      },
      items: [
        {
          type: "docsVersionDropdown",
          //// Optional
          position: "left",
          // Add additional dropdown items at the beginning/end of the dropdown.
          dropdownItemsBefore: [],
          // Do not add the link active class when browsing docs.
          dropdownActiveClassDisabled: true,
          docsPluginId: "default",
        },
        {
          type: "docsVersionDropdown",
          //// Optional
          position: "left",
          // Add additional dropdown items at the beginning/end of the dropdown.
          dropdownItemsBefore: [],
          // Do not add the link active class when browsing docs.
          dropdownActiveClassDisabled: true,
          docsPluginId: "nodejs",
        },
        {
          type: "docsVersionDropdown",
          //// Optional
          position: "left",
          // Add additional dropdown items at the beginning/end of the dropdown.
          dropdownItemsBefore: [],
          // Do not add the link active class when browsing docs.
          dropdownActiveClassDisabled: true,
          docsPluginId: "auth-react",
        },
        {
          type: "docsVersionDropdown",
          //// Optional
          position: "left",
          // Add additional dropdown items at the beginning/end of the dropdown.
          dropdownItemsBefore: [],
          // Do not add the link active class when browsing docs.
          dropdownActiveClassDisabled: true,
          docsPluginId: "website",
        },
        {
          type: "docsVersionDropdown",
          //// Optional
          position: "left",
          // Add additional dropdown items at the beginning/end of the dropdown.
          dropdownItemsBefore: [],
          // Do not add the link active class when browsing docs.
          dropdownActiveClassDisabled: true,
          docsPluginId: "change_me",
        },
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
          href: "https://github.com/supertokens/supertokens-to_replace",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    prism: {
      theme: require("prism-react-renderer/themes/vsDark"),
      additionalLanguages: ["kotlin", "java", "swift", "dart"],
    },
    algolia: {
      apiKey: "ce04a158637d345fc094ebbfa9a5156a",
      indexName: "supertokens",
      appId: "SBR5UR2Z16",
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "community",
          routeBasePath: "docs/community",
          sidebarPath: require.resolve("./community/sidebars.js"),
          showLastUpdateTime: true,
          editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
          remarkPlugins: remarkPlugins,
          rehypePlugins: rehypePlugins,
          beforeDefaultRemarkPlugins,
        },
        theme: {
          // this is applied to all docs.. not just the community one.
          customCss: require.resolve("./src/css/custom.css"),
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
      },
    ],
    [
      "./src/plugins/transformOpenSearchLink",
      //used to transform the opensearch.xml location in the metatags.
      {
        id: "transform-opensearch-link",
      },
    ],
    [
      "./src/plugins/copyDocsAndCodeTypeChecking",
      {
        // used for copying docs content via the <-COPY DOCS-> directive
        // used for do code type checking as well AFTER running cop docs
        id: "copy-docs-and-code-type-checking",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "search",
        path: "search",
        routeBasePath: "docs/search",
        sidebarPath: false,
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "emailpassword",
        path: "emailpassword",
        routeBasePath: "docs/emailpassword",
        sidebarPath: require.resolve("./emailpassword/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "passwordless",
        path: "passwordless",
        routeBasePath: "docs/passwordless",
        sidebarPath: require.resolve("./passwordless/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "guides",
        path: "guides",
        routeBasePath: "docs/guides",
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        // We use a custom sidebarItemsGenerator because if a doc page id is not present in the sidebar items
        // the sidebar will not be rendered in that page. So we have to dynamically include all the guides in this sidebar.
        // The annoying stuff is not finished yet.
        // Given how our flow works it's quite redundant to show all the other guides in the sidebar while navigating a
        // specific guide, for your tech stack.
        // Well, good luck hiding sidebar items. There's no inbuilt api for that and the hacky way (using a custom class name and hiding the element)
        // does not work. Maybe it's an issue with our docusaurus version.
        // So we end up using an even hackier way to hide it. We wrap the page in a custom css class name and target the
        // last item in the sidebar list.
        sidebarItemsGenerator: async ({ docs }) => {
          const guidesItems = docs
            .filter((doc) => doc.id.startsWith("with-example-app"))
            .map((doc) => ({
              id: doc.id,
              className: "hide-sidebar-item",
              type: "doc",
            }));

          return [
            { type: "doc", id: "intro" },
            { type: "doc", id: "build-a-guide" },
            {
              type: "category",
              label: "Authentication Methods",
              collapsed: false,
              items: [
                {
                  type: "link",
                  label: "Email/Password Login",
                  href: "/docs/emailpassword/introduction",
                },
                {
                  type: "link",
                  label: "Passwordless",
                  href: "/docs/passwordless/introduction",
                },
                {
                  type: "link",
                  label: "Social/Enterprise Login",
                  href: "/docs/thirdparty/introduction",
                },
                {
                  type: "link",
                  label: "Social/Enterprise Login with Email/Password",
                  href: "/docs/thirdpartyemailpassword/introduction",
                },
                {
                  type: "link",
                  label: "Social/Enterprise Login with Passwordless",
                  href: "/docs/thirdpartypasswordless/introduction",
                },
                {
                  type: "link",
                  label: "Phone Password Login",
                  href: "/docs/phonepassword/introduction",
                },
              ],
            },
            {
              type: "category",
              label: "Add-ons",
              collapsed: false,
              items: [
                {
                  type: "link",
                  label: "User Roles",
                  href: "/docs/userroles/introduction",
                },
                {
                  type: "link",
                  label: "Multi Factor Authentication",
                  href: "/docs/mfa/introduction",
                },
                {
                  type: "link",
                  label: "Microserviecs Authentication",
                  href: "/docs/microservice_auth/introduction",
                },
                {
                  type: "link",
                  label: "Session Management",
                  href: "/docs/session/introduction",
                },
                {
                  type: "link",
                  label: "User Management Dashboard",
                  href: "/docs/userdashboard/about",
                },
                {
                  type: "link",
                  label: "Multi Tenancy/Organizations",
                  href: "/docs/multitenancy/introduction",
                },
              ],
            },
            {
              type: "category",
              label: "Reference Docs",
              collapsed: true,
              items: [
                {
                  type: "link",
                  label: "HTTP API Reference",
                  href: "/docs/community/apis",
                },
                {
                  type: "link",
                  label: "SDK Reference",
                  href: "/docs/community/sdks",
                },
              ],
            },
            {
              type: "category",
              label: "Guides",
              collapsed: true,
              className: "hide-sidebar-item",
              items: guidesItems,
            },
          ];
        },
        // This doesn't work althought that's the way to exclude paths based on the docs
        // exclude: ["**/blocks/**"],
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "thirdparty",
        path: "thirdparty",
        routeBasePath: "docs/thirdparty",
        sidebarPath: require.resolve("./thirdparty/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "thirdpartyemailpassword",
        path: "thirdpartyemailpassword",
        routeBasePath: "docs/thirdpartyemailpassword",
        sidebarPath: require.resolve("./thirdpartyemailpassword/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "thirdpartypasswordless",
        path: "thirdpartypasswordless",
        routeBasePath: "docs/thirdpartypasswordless",
        sidebarPath: require.resolve("./thirdpartypasswordless/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "session",
        path: "session",
        routeBasePath: "docs/session",
        sidebarPath: require.resolve("./session/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "nodejs",
        path: "nodejs",
        routeBasePath: "docs/nodejs",
        sidebarPath: require.resolve("./nodejs/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "auth-react",
        path: "auth-react",
        routeBasePath: "docs/auth-react",
        sidebarPath: require.resolve("./auth-react/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "website",
        path: "website",
        routeBasePath: "docs/website",
        sidebarPath: require.resolve("./website/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "contribute",
        path: "contribute",
        routeBasePath: "docs/contribute",
        sidebarPath: require.resolve("./contribute/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "phonepassword",
        path: "phonepassword",
        routeBasePath: "docs/phonepassword",
        sidebarPath: require.resolve("./phonepassword/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "mfa",
        path: "mfa",
        routeBasePath: "docs/mfa",
        sidebarPath: require.resolve("./mfa/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "userroles",
        path: "userroles",
        routeBasePath: "docs/userroles",
        sidebarPath: require.resolve("./userroles/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "microservice_auth",
        path: "microservice_auth",
        routeBasePath: "docs/microservice_auth",
        sidebarPath: require.resolve("./microservice_auth/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "userdashboard",
        path: "userdashboard",
        routeBasePath: "docs/userdashboard",
        sidebarPath: require.resolve("./userdashboard/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "multitenancy",
        path: "multitenancy",
        routeBasePath: "docs/multitenancy",
        sidebarPath: require.resolve("./multitenancy/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "change_me",
        path: "change_me",
        routeBasePath: "docs/change_me",
        sidebarPath: require.resolve("./change_me/sidebars.js"),
        showLastUpdateTime: true,
        editUrl: "https://github.com/supertokens/docs/tree/master/v2/",
        remarkPlugins: remarkPlugins,
        rehypePlugins: rehypePlugins,
        beforeDefaultRemarkPlugins,
      },
    ],
  ],
  clientModules: [
    //used to intercept client side navigation and fire analytics events.
    require.resolve("./src/plugins/locationInterceptor"),
  ],
};
