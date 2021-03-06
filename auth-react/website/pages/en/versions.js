/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary");

const Container = CompLibrary.Container;

const versions = {
  "v2": [
    "0.15.X"
  ],
  "v1": [
    "0.14.X",
    "0.13.X",
    "0.12.X",
    "0.11.X",
    "0.10.X",
    "0.9.X",
    "0.8.X",
    "0.7.X",
    "0.6.X",
    "0.5.X",
    "0.4.X",
    "0.3.X",
    "0.2.X",
    "0.1.X"
  ]
};

function Versions (props) {
  const { config: siteConfig } = props;
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer versionsContainer">
        <div className="post">
          <header className="postHeader">
            <h1>{siteConfig.title} Versions</h1>
          </header>
          <table className="versions">
            <tbody id="sdk-autogenerated-docs-version-list">
              {/* versions for autogenerated docs are loaded in this element by main-website */}
            </tbody>
            <tbody>
              {[...versions.v2, ...versions.v1].map(
                version => (
                  <tr>
                    <th>{version}</th>
                    <td>
                      <a
                        href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${props.language ? props.language + "/" : ""
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
