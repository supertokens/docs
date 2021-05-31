# Contributing

We’re glad that you are interested in contributing to SuperTokens 🎉
We welcome contributions of all kinds (discussions, bug fixes, features, design changes, videos, articles) and from anyone 👩‍💻🤚🏿🤚🏽🤚🏻🤚🏼🤚🏾👨‍💻.

## Folder structure

1. The documentation for each recipe and sdk lives in it's own folder e.g `auth-react` for auth-react sdk.
2. Each of these folders is a [docusaurus v1](https://v1.docusaurus.io/l) project containing two important folders: 
    1. `docs` - contains markdown files where we write the content of our documentation
    2. `website` - contains following important files and folders:
        1. `build` - this is where final docs build is stored
        2. `static` - static assets for the docs
        3. `versioned_docs` - contains `.md` files which contain versioned docs
        4. `versioned_sidebars` - configuration file for sidebar in resulting docs build which link to a particular docs version
        5. `createVersion`, `initVersions` - shell scripts for creating versioned docs
        6. `sidebars.json` - here we define the contents of sidebar menu
        7. `siteConfig.js` - config for the docusaurus build
        8. `versions.json` - contains an array of versions being used in that particular docs folder 
3. You can ignore the docker files

## Modifying and seeing your changes

1. Run `./setupProject`. This script installs npm deps for each of the docs folders, for the local dev server and builds the docs pages.
2. run `./buildDocs FOLDER_NAME` from the root of docs repo e.g if you are modifying `auth-react` docs run `./buildDocs auth-react`
3. Run the local server which resides in `docs_dev_server`: `cd docs_dev_server/app` followed by `npm run start`. This will start the server on `http://localhost:9001/`
4. Every time you make changes to a particular docs folder you have to run `./buildDocs FOLDER_NAME` from the root of docs repo and reload the browser page to see your changes.
5. To build docs for all the folders run `./buildAllDocs` from the root of the repo.

- For other cosmetic modifications, bugs etc please [create an issue on github](https://github.com/supertokens/docs/issues)