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

## Building for deployment
- This only works if have access to the `supertokens-backend-website` and `main-website` repo.
- Make sure that the `main-website` repo contains the `docs` repo and the `supertokens-backend-website` repo.
- To build all docs, run the `./buildAllDocs` command.
- To only build `v2` docs, go into `v2` and run `npm run build`. If this throws an error and you still want to finish building it, then run `npm run build-ignore-errors`.
- To build non `v2` docs, run `./buildDocs <folder name>` command.