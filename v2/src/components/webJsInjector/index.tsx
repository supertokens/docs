import React, { PropsWithChildren } from "react";
import { recursiveMap } from "../utils";
import getURI from "../api/webJs";
import { MOCK_ENABLED } from "../constants";

type Uri = Record<string, string>;

type State = {
  uri: Uri | undefined;
};

function matchAll(pattern: RegExp, haystack: string) {
  const regex = new RegExp(pattern, "g");
  const matches: any[] = [];

  const match_result = haystack.match(regex);

  for (const index in match_result) {
    const item = match_result[index as unknown as number];
    matches[index as unknown as number] = item.match(new RegExp(pattern));
  }

  return matches;
}

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

    // get all the keys from the mentions
    const keys = matchAll(/\^\{jsdeliver_webjs_([^}]+)\}/, value).map(
      (match) => {
        return match[1];
      }
    );

    // replace all the mentions with the corresponding uri
    keys.forEach((key) => {
      value = value.replace(
        new RegExp(`\\^\\{jsdeliver_webjs_${key}\\}`, "g"),
        this.state.uri?.[key] || ""
      );
    });

    return value;
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
      if (MOCK_ENABLED || window.location.hostname === "test.supertokens.com") {
        if (this.isUnmounting) {
          return;
        }

        const proxy = new Proxy(
          {},
          {
            get(target, name, receiver) {
              return `https://cdn.jsdelivr.net/gh/supertokens/supertokens-web-js@vX.Y.Z/bundle/${String(
                name
              )}.test.js`;
            },
          }
        );

        this.setState((oldState) => {
          return {
            ...oldState,
            uri: proxy,
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
