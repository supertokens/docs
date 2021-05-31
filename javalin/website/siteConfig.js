/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: "SuperTokens", // Title for your website.
  tagline: "A website for testing",
  url: "https://supertokens.io", // Your website URL
  baseUrl: "/docs/javalin/", // when creating new documentation, replace initialDocs with folder name
  // Used for publishing and more, irrelevant for us
  projectName: "test-site",
  organizationName: "facebook",
  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: "installation", label: "Docs" }, // main is the id for the default document
    { href: "/discord", label: "Discord" },
    { href: "/blog", label: "Blog" }
  ],

  /* path to images for header/footer */
  headerIcon: "img/logoWithNameLight.png",
  favicon: "img/logo.png",

  /* Colors for website */
  colors: {
    primaryColor: "#141414",
    secondaryColor: "#01516c",
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // irrelevant for us
  copyright: `Copyright © ${new Date().getFullYear()} Your Name or Your Company Name`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    themeUrl: "/docs/static/style/customCode.css"
  },

  // Add custom scripts here that would be placed in <script> tags,
  // NOTE: when adding a new documentation, change initialDocs with the folder name
  scripts: [
    "https://buttons.github.io/buttons.js",
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    "/docs/javalin/scripts/builder.js",
  ],

  stylesheets: [
    "https://fonts.googleapis.com/css?family=Rubik:300,400,500,700&display=swap"
  ],

  // On page navigation for the current documentation page, this shows an additional nav bar on the right of the page
  //   onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  // ogImage: "static/assets/favicon.ico",
  // twitterImage: "static/assets/favicon.ico",

  // For sites with a sizable amount of content, set collapsible to true.
  // Expand/collapse the links and subcategories under categories.
  docsSideNavCollapsible: true,
};

module.exports = siteConfig;
