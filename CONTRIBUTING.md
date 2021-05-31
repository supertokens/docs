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
        3. `versioned_docs` - contains `.md` files which contain versioned info (more on this in **versioning** section)
        4. `versioned_sidebars` - configuration file for sidebar in resulting docs build which link to a particular docs version
        5. `createVersion`, `initVersions` - shell scripts for creating versioned docs (more on this in **versioning** section)
        6. `sidebars.json` - here we define the contents of sidebar menu
        7. `siteConfig.js` - config for the docusaurus build
        8. `versions.json` - contains an array of versions being used in that particular docs folder 
3. You can ignore the docker files

## Modifying and seeing your changes

1. Install the npm deps in the folder you are going to work e.g for **auth-react**: `cd auth-react/website && npm i -d`
2. run `./buildDocs FOLDER_NAME` from the root of docs repo.
3. Run the local server which resides in `docs_dev_server`: `cd docs_dev_server/app` followed by `npm run build-dev`. This will start the server on `http://localhost:9001/`
4. Every time you make changes to a particular docs folder you have to run `./buildDocs FOLDER_NAME` from the root of docs repo and reload the browser page to see your changes.
5. To build the docs for all folders, first install npm deps for each and then run `./buildAllDocs` from the root of the repo

## Versioning

Each documentation folder contains these two scripts inside it's website folder which are used to create versioned docs:

- `initVersions`: initializes docusaurus versioning in the documentation project, remember to replace the contents of versions.js with the following code:

```js
/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary");

const Container = CompLibrary.Container;

const CWD = process.cwd();

const versions = require(`${CWD}/versions.json`);

function Versions(props) {
  const { config: siteConfig } = props;
  const latestVersion = versions[0];
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer versionsContainer">
        <div className="post">
          <header className="postHeader">
            <h1>{siteConfig.title} Versions</h1>
          </header>
          <h3 id="latest">Current version (Stable)</h3>
          <table className="versions">
            <tbody>
              <tr>
                <th>{latestVersion}</th>
                <td>
                  <a
                    href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                      props.language ? props.language + "/" : ""
                      }installation`}>
                    Documentation
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          {versions.length > 1 && <h3 id="archive">Past Versions</h3>}
          <table className="versions">
            <tbody>
              {versions.map(
                version =>
                  version !== latestVersion && (
                    <tr>
                      <th>{version}</th>
                      <td>
                        <a
                          href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${
                            props.language ? props.language + "/" : ""
                            }${version}/installation`}>
                          Documentation
                        </a>
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}

module.exports = Versions;
```

- `createVersion`: creates a new version in the documentation project. Note that any changes after you create a version will not be reflected in that version. The script has additional information
## Code snippets

- For other cosmetic modifications, bugs etc please [create an issue on github](https://github.com/supertokens/docs/issues)