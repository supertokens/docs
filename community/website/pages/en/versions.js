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
                    href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${props.language ? props.language + "/" : ""
                      }getting-started/installation`}>
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
                  version !== latestVersion && !version.startsWith("0.") &&
                  !version.startsWith("1.") && !version.startsWith("2.") && (
                    <tr>
                      <th>{version}</th>
                      <td>
                        <a
                          href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${props.language ? props.language + "/" : ""
                            }${version}/getting-started/installation`}>
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
