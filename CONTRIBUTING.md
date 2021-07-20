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
### Code tabs
- Depending on the options you want to show in the tabs / sub tab, please use the correct `groupId` so that tab selections are synced. Some `groupIds`:
   - For backend language: `backendsdk`
   - For nodeJS framework: `nodejs-framework`
   - For frontend languages: `frontendsdk`
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
- Docusaurus has several adornments that can help with this. You can find this list in v2 > change_me > introduction.mdx

### Building custom react components:
- These should go in v2 > src > components > <some-folder>

### Linking to other parts of supertokens.io site:
- For non docs links, you need to use `https://supertokens.io/*`. Otherwise the build process will fail (cause of broken link). This also adds a limitation that those links can be seen / tested only in production.

### Creating a new docs:
- Please see v2 > HOW_TO_NEW_DOCS.md

## Building for deployment
- This only works if have access to the `supertokens-backend-website` and `main-website` repo.
- Make sure that the `main-website` repo contains the `docs` repo and the `supertokens-backend-website` repo.
- To build all docs, run the `./buildAllDocs` command.
- To only build `v2` docs, go into `v2` and run `npm run build`. If this throws an error and you still want to finish building it, then run `npm run build-ignore-errors`.
- To build non `v2` docs, run `./buildDocs <folder name>` command.