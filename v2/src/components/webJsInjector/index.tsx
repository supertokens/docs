import React, { PropsWithChildren } from "react";
import { recursiveMap } from "../utils";
import getURI from "../api/webJs";
import { MOCK_ENABLED } from "../constants";

type Uri = {
  dateprovider: string;
  emailpassword: string;
  emailverification: string;
  multifactorauth: string;
  multitenancy: string;
  passwordless: string;
  session: string;
  supertokens: string;
  thirdparty: string;
  totp: string;
  userroles: string;
  website: string;
};

type State = {
  uri: Uri | undefined;
};
export default class WebJsInjector extends React.PureComponent<
  PropsWithChildren<{}>,
  State
> {
  isUnmounting = false;

  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = {
      uri: undefined,
    };
  }

  replaceUrisByKeys(value: string) {
    if (!this.state.uri) {
      // replace all webjs mentions with empty string;
      return value.replace(/\^\{jsdeliver_webjs_[^}]+\}/g, "");
    }

    const uri = this.state.uri;
    return Object.keys(uri).reduce((acc, key) => {
      acc = acc.replace(
        new RegExp(`\\^\\{jsdeliver_webjs_${key}\\}`, "g"),
        uri[key as keyof State["uri"]]
      );
      return acc;
    }, value);
  }

  render() {
    let result = recursiveMap(this.props.children, (c: any) => {
      if (typeof c === "string") {
        c = this.replaceUrisByKeys(c);
      }
      return c;
    });

    return result;
  }

  async componentDidMount() {
    if (typeof window != "undefined") {
      if (MOCK_ENABLED) {
        if (this.isUnmounting) {
          return;
        }
        this.setState((oldState) => {
          return {
            ...oldState,
            uri: {
              dateprovider:
                "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/dateprovider.test.js",
              emailpassword:
                "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/emailpassword.test.js",
              emailverification:
                "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/emailverification.test.js",
              multifactorauth:
                "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/multifactorauth.test.js",
              multitenancy:
                "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/multitenancy.test.js",
              passwordless:
                "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/passwordless.test.js",
              session:
                "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/session.test.js",
              supertokens:
                "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/supertokens.test.js",
              thirdparty:
                "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/thirdparty.test.js",
              totp: "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/totp.test.js",
              userroles:
                "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/userroles.test.js",
              website:
                "https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/website.test.js",
            },
          };
        });
      } else {
        try {
          let uri = await getURI();
          if (this.isUnmounting) {
            return;
          }
          this.setState((oldState) => {
            return {
              ...oldState,
              uri: uri.uri,
            };
          });
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  componentWillUnmount() {
    this.isUnmounting = true;
  }
}
