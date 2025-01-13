import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import addNofollowToExternalLinks from "./src/plugins/addNofollowToExternalLinks";

import remarkDocItemContextValues from "./src/plugins/remarkDocItemContextValues";
import remarkRemoveCodeTypeCheckingCommentsAndRows from "./src/plugins/remarkRemoveCodeTypeCheckingCommentsAndRows";
import remarkRemoveWebJsScriptImports from "./src/plugins/remarkRemoveWebJsScriptImports";

const config: Config = {
	title: "SuperTokens Docs",
	tagline: "Open Source User Authentication",
	url: "https://supertokens.com",
	baseUrl: "/",
	favicon: "img/favicon.ico",
	trailingSlash: false,
	onBrokenLinks: process.env.NODE_ENV === "production" ? "throw" : "warn",
	onBrokenMarkdownLinks:
		process.env.NODE_ENV === "production" ? "throw" : "warn",
	future: {
		// Use rspack only during the build phase for faster CI times
		// In dev mode it crashes often while hot reloading
		experimental_faster: process.env.NODE_ENV === "production" ? true : false,
	},
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
					exclude: ["**/_*", "**/_*/**"],
					breadcrumbs: false,
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
					beforeDefaultRemarkPlugins: [
						remarkDocItemContextValues,
						remarkRemoveCodeTypeCheckingCommentsAndRows,
						remarkRemoveWebJsScriptImports,
					],
					rehypePlugins: [addNofollowToExternalLinks],
					async sidebarItemsGenerator({
						defaultSidebarItemsGenerator,
						...args
					}) {
						const sidebarItems = await defaultSidebarItemsGenerator(args);
						return sidebarItems;
					},
				},
				blog: false,
				pages: false,
				theme: {
					customCss: ["./src/css/custom.scss", "./src/css/radix.css"],
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
				href: "/",
				target: "_blank",
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
			theme: prismThemes.vsDark,
			additionalLanguages: [
				"kotlin",
				"java",
				"swift",
				"dart",
				"csharp",
				"php",
				"bash",
			],
		},
	} satisfies Preset.ThemeConfig,
	plugins: [
		"docusaurus-plugin-sass",
		process.env.NODE_ENV === "production" && "@docusaurus/plugin-debug",
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
		// [
		// 	"./src/plugins/codeTypeChecking",
		// 	{
		// 		id: "code-type-checking",
		// 	},
		// ],
	].filter(Boolean),
};

// As far as I can tell docusaurus doesn't export this type
type NormalizedSidebarItems = Awaited<
	ReturnType<Exclude<Preset.Options["docs"], false>["sidebarItemsGenerator"]>
>[number];

// Reorders the default sidebar items based on the "childrenOrder" property specified in _category_.json, in customProps
//
// There are several ways to order navigation items in docusaurus
// We are using the file based approach in our docs because
// we rely on the folder/file tree as the source of truth when it comes to routing.
// It's easier to change things and to handle a large number of pages when
// things are composable and you do not have to edit a big JSON file.
// That being said, there's an issue with how Docusaurus extracts those pages and organizes them into sidebar items.
// Let's say you have a folder called "quickstart".
// - In that folder you have a _category_.json file where you specify the name of the sidebar category
// - Each mdx file in turn has a frontmatter property called "sidebar_position" which specifies the order of the page inside the sidebar category
// - If you add an additional page, that should between the existing pages, you need to also go to each of the other pages that are reodered
// and update their "sidebar_position" property to reflect the new order
// That can be quite cumborsome for categories with a lot of pages.
//
// TODO: This is blocked ATM because docusaurus does not include the file name in the category sidebar item
// function reorderSidebarItems(normalizedSidebarItem: NormalizedSidebarItems) {
//   if (normalizedSidebarItem.type === "category") {
//     const childrenOrder = normalizedSidebarItem.customProps.childrenOrder as string[] | undefined;
//     if(childrenOrder) {
//       normalizedSidebarItem.items = childrenOrder.map((childName) => {
//         const child = normalizedSidebarItem.items.find((item) => {
//             // @ts-expect-error
//             const labelOrValue = 'label' in item ? item.label : item.value;
//             return labelOrValue === childName;
//         });
//         if(!child) {
//           console.error(`Could not find child with label or value ${childName} in ${normalizedSidebarItem.label}`);
//         }
//       });
//     }
//   }
//   return normalizedSidebarItem;
// }

export default config;
