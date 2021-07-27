# Contributing

We’re glad that you are interested in contributing to SuperTokens 🎉
We welcome contributions of all kinds (discussions, bug fixes, features, design changes, videos, articles) and from anyone 👩‍💻🤚🏿🤚🏽🤚🏻🤚🏼🤚🏾👨‍💻.

## Folder structure

1. You will most likely want edit only the `./v2` folder, as it contains all the latest docs. The other folders are for backwards compatibility with older SDKs and docs.

2. Inside `./v2`, is a standard [Docusaurus](https://docusaurus.io/docs) project. We have set it up to be a [multi instance project](https://docusaurus.io/docs/docs-multi-instance).

## Modifying and seeing your changes

1. Go into the `v2` folder
2. Run `npm i -d`
3. Run `npm run start`. This should open `http://localhost:3000` on your browser.
4. Makes changes to the `.md` or `.mdx` files, and see the changes on your browser instantly.
5. Issue a PR to our repo.
6. **NOTE**: If you are working on a docs that has versioning, you will need to suffix the docs name in url with `/next/` to see your changes. For example, if you are working on `community` docs and made changes to the `introduction` page, then you will need to visit: `http://localhost:3000/docs/community/next/introduction` instead of `http://localhost:3000/docs/community/introduction` to see your changes.

## Changing SEO meta tags
1. This is normally done via google sheets.
2. But for docusaurus v2, you need to go to v2 > src > themes > Layout > index.js and add the custom meta tags there.

## Writing guide
### Code snippets
- Always use ` ```tsx ` or ` ```jsx` instead of ` ```ts ` or ` ```js` so that HTML is rendered nicely as well.
- All code should be copy pasted from a working "playground" for that SDK. For example, in `supertokens-node`, we have `/test/with-typescript/index.ts` file which can be used to write any code using the SDK and whenever writing code in docs for nodeJS, you should first write it in the playground, make sure it's correct, and the copy / paste that in the docs.

### Code tabs
- Depending on the options you want to show in the tabs / sub tab, please use the correct `groupId` so that tab selections are synced. Some `groupIds`:
   - For backend language: `backendsdk`
   - For nodeJS framework: `nodejs-framework`
   - For frontend languages: `frontendsdk`
   - For `.ts` vs `.js`, use `ts-or-js`
- If there are custom wrapper components made for a type of code tab, please use that. You can find them in v2 > src > components > tabs folder:
   - For backend: `import BackendSDKTabs from "/src/components/tabs/BackendSDKTabs"`
   - For nodejs framework: `import NodeJSFrameworkSubTabs from "/src/components/tabs/NodeJSFrameworkSubTabs"`
   - For frontend: `import FrontendSDKTabs from "/src/components/tabs/FrontendSDKTabs"`
- In recipe docs, we must always use code tabs that display all options. In case there is a missing child, we will show a not supported message under that.
- Sometimes the context of the code being displayed is specific for a framework. For example, in the auth-react SDK, we will only want to show ReactJS code. In this case, you do not want to use code tabs, and instead, want to use code title.

### Heading guide
- The main title of the page (if present) should be the only element in H1.
- The other parts of the page should be divided such that users can see their sections in the correct heirarchy to the right of the page.
- In some pages (in the sdk level docs), the page starts with a code snippet (for function signature). Those should start with H2

### Showing an important / caution / danger / note message:
- Docusaurus has several admonitions that can help with this. You can find this list in v2 > change_me > introduction.mdx

### Building custom react components:
- These should go in v2 > src > components > <some-folder>

### Linking to other parts of supertokens.io site:
- For non docs links, you need to use `https://supertokens.io/*`. Otherwise the build process will fail (cause of broken link). This also adds a limitation that those links can be seen / tested only in production.

### Creating a new docs:
- Please see v2 > HOW_TO_NEW_DOCS.md

### Using Copy docs plugin
- This is a custom plugin in which one `.mdx` file's content can be copied into another by providing the location of one in another.
- A file that uses `<!-- COPY DOCS -->` is utilising this plugin.
- This should be used across recipe docs, when the content of the page is exactly the same across docs.
- An example of this can be found `v2 > community > database-setup > mysql.mdx`.

## Swizzling components:
- Docusaurus allows "swizzling" of their components so that they can be modified as per our needs. Once a component is swizzled, it's placed in the v2 > src > theme folder, and can be edited freely.
- To swizzle a component:
   - Open `docusaurus.config.js` and comment out all the custom plugins like: `"./src/plugins/reactBundle"` and `"./src/plugins/copyDocs"`.
   - Run the swizzle command: `npx docusaurus swizzle --danger "@docusaurus/theme-classic" "TODO: COMPONENT_NAME"`
   - Uncomment the two plugins that have been commented.
- To know a list of components that can be swizzled, run `npx docusaurus swizzle --danger "@docusaurus/theme-classic" "App"`

## Building for deployment
- This only works if have access to the `supertokens-backend-website` and `main-website` repo.
- Make sure that the `main-website` repo contains the `docs` repo and the `supertokens-backend-website` repo.
- To build all docs, run the `./buildAllDocs` command.
- To only build `v2` docs, go into `v2` and run `npm run build`. If this throws an error and you still want to finish building it, then run `npm run build-ignore-errors`.
- To build non `v2` docs, run `./buildDocs <folder name>` command.

### Fixing broken links
While building, we may get broken links errors. There are different types:
- External links: Make sure to give the full path to these links
- Links to `supertokens.io`, but non docs pages: These links should be `https://supertokens.io/...`
- Internal docs links: These need to be fixed since it's most likely due to a writing error.
- `COPY DOCS` related links: Sometimes the source doc's structure may not match the destination doc. For example, the core docs in v2 > community folder are being shown in the recipes, but not in the community docs, and the pages it links to exist in the recipe docs, but not in the community docs. To fix this, we create dummy pages in the community docs like found here: `v2 > community > common-customizations > core > api-keys.mdx`