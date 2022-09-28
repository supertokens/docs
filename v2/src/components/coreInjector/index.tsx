import React, { PropsWithChildren } from "react";
import supertokens from "supertokens-website";
import { recursiveMap } from "../utils";
import { getSaasApp } from "../api/saas/app";
import { MOCK_ENABLED } from "../constants";

type Props = {};

type State = {
    sessionState: "NOT_EXISTS" | "UNKNOWN"
} | {
    sessionState: "EXISTS",
    uri: string, key: string
};

export default class CoreInjector extends React.PureComponent<PropsWithChildren<Props>, State> {

    isUnmounting = false;

    constructor(props: PropsWithChildren<Props>) {
        super(props);
        this.state = {
            sessionState: "UNKNOWN"
        };
    }

    render() {
        if (this.state.sessionState === "UNKNOWN") {
            return recursiveMap(this.props.children, (c: any) => {
                if (typeof c === "string") {
                    while (c.includes(" ^{coreInjector_connection_uri_comment}")) {
                        c = c.split(" ^{coreInjector_connection_uri_comment}").join('^{coreInjector_connection_uri_comment}')
                    }
                    c = c.split("\n^{coreInjector_connection_uri_comment}").join('')
                    while (c.includes(" ^{coreInjector_connection_uri_comment_with_hash}")) {
                        c = c.split(" ^{coreInjector_connection_uri_comment_with_hash}").join('^{coreInjector_connection_uri_comment_with_hash}')
                    }
                    c = c.split("\n^{coreInjector_connection_uri_comment_with_hash}").join('')
                    c = c.split("^{coreInjector_uri}").join('"",');
                    c = c.split("^{coreInjector_api_key}").join('""')
                    c = c.split("^{coreInjector_api_key_commented}").join('')
                    c = c.split("^{coreInjector_api_key_commented_with_hash}").join('')
                    c = c.split("^{coreInjector_uri_without_quotes}").join('')
                }
                return c;
            });
        } else if (this.state.sessionState === "EXISTS") {
            let uri = this.state.uri;
            let key = this.state.key;
            return recursiveMap(this.props.children, (c: any) => {
                if (typeof c === "string") {
                    c = c.split("^{coreInjector_connection_uri_comment}").join('// These are the connection details of the app you created on supertokens.com')
                    c = c.split("^{coreInjector_connection_uri_comment_with_hash}").join('# These are the connection details of the app you created on supertokens.com')
                    c = c.split("^{coreInjector_uri}").join(`"${uri}",`);
                    c = c.split("^{coreInjector_api_key}").join(`"${key}"`)
                    c = c.split("^{coreInjector_api_key_commented}").join('')
                    c = c.split("^{coreInjector_api_key_commented_with_hash}").join('')
                    c = c.split("^{coreInjector_uri_without_quotes}").join(`${uri}`)
                }
                return c;
            });
        }
        return recursiveMap(this.props.children, (c: any) => {
            if (typeof c === "string") {
                c = c.split("^{coreInjector_connection_uri_comment}").join('// try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.')
                c = c.split("^{coreInjector_connection_uri_comment_with_hash}").join('# try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.')
                c = c.split("^{coreInjector_uri}").join('"https://try.supertokens.com",');
                c = c.split("^{coreInjector_api_key}").join('"IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE"')
                c = c.split("^{coreInjector_api_key_commented}").join('// ')
                c = c.split("^{coreInjector_api_key_commented_with_hash}").join('# ')
                c = c.split("^{coreInjector_uri_without_quotes}").join(`http://localhost:3567`)
            }
            return c;
        });
    }

    async componentDidMount() {
        if (typeof window != 'undefined') {
            if (!((await supertokens.doesSessionExist()) || MOCK_ENABLED)) {
                if (this.isUnmounting) {
                    return;
                }
                this.setState(oldState => {
                    return {
                        ...oldState,
                        sessionState: "NOT_EXISTS"
                    };
                })
            } else {
                let coreDetails = await this.fetchCoreDetails();
                if (this.isUnmounting) {
                    return;
                }
                if (coreDetails === undefined) {
                    this.setState(oldState => {
                        return {
                            ...oldState,
                            sessionState: "NOT_EXISTS"
                        };
                    })
                } else {
                    this.setState(oldState => {
                        return {
                            ...oldState,
                            sessionState: "EXISTS",
                            ...coreDetails,
                        }
                    })
                }
            }
        }
    }

    componentWillUnmount() {
        this.isUnmounting = true;
    }

    fetchCoreDetails = async (): Promise<{
        uri: string, key: string
    } | undefined> => {
        let app = await getSaasApp();
        if (this.isUnmounting) {
            return undefined;
        }
        if (app.exists && app.devDeployment.connectionInfo !== undefined) {
            return {
                uri: app.devDeployment.connectionInfo.host,
                key: app.devDeployment.connectionInfo.apiKey,
            }
        }
        return undefined;
    }
}