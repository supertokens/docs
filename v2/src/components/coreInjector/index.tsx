import React, { PropsWithChildren } from "react";
import supertokens from "supertokens-website";
import { recursiveMap } from "../utils";
import { getSaasApp } from "../api/saas/apps";
import { MOCK_ENABLED } from "../constants";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;

type Props = {
    defaultValue?: string
    showTenantId?: boolean,
    showAppId?: boolean
};

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
        let singleTenant;
        let multiTenant;
        let tenantString = "/appid-<APP_ID>/<TENANT_ID>";
        if (this.props.showTenantId === false) {
            tenantString = "/appid-<APP_ID>"
        }
        if (this.state.sessionState === "UNKNOWN") {
            singleTenant = recursiveMap(this.props.children, (c: any) => {
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
                    c = c.split("^{coreInjector_api_key_without_quotes}").join('')
                    c = c.split("^{coreInjector_api_key_commented}").join('')
                    c = c.split("^{coreInjector_api_key_commented_with_hash}").join('')
                    c = c.split("^{coreInjector_uri_without_quotes}").join('')
                }
                return c;
            });
            multiTenant = recursiveMap(this.props.children, (c: any) => {
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
                    c = c.split("^{coreInjector_api_key_without_quotes}").join('')
                    c = c.split("^{coreInjector_api_key_commented}").join('')
                    c = c.split("^{coreInjector_api_key_commented_with_hash}").join('')
                    c = c.split("^{coreInjector_uri_without_quotes}").join('')
                }
                return c;
            });
        } else if (this.state.sessionState === "EXISTS") {
            let uri = this.state.uri;
            let key = this.state.key;
            singleTenant = recursiveMap(this.props.children, (c: any) => {
                if (typeof c === "string") {
                    c = c.split("^{coreInjector_connection_uri_comment}").join('// These are the connection details of the app you created on supertokens.com')
                    c = c.split("^{coreInjector_connection_uri_comment_with_hash}").join('# These are the connection details of the app you created on supertokens.com')
                    c = c.split("^{coreInjector_uri}").join(`"${uri}",`);
                    c = c.split("^{coreInjector_api_key}").join(`"${key}"`)
                    c = c.split("^{coreInjector_api_key_without_quotes}").join(`${key}`)
                    c = c.split("^{coreInjector_api_key_commented}").join('')
                    c = c.split("^{coreInjector_api_key_commented_with_hash}").join('')
                    c = c.split("^{coreInjector_uri_without_quotes}").join(`${uri}`)
                }
                return c;
            });
            multiTenant = recursiveMap(this.props.children, (c: any) => {
                if (typeof c === "string") {
                    c = c.split("^{coreInjector_connection_uri_comment}").join('// These are the connection details of the app you created on supertokens.com')
                    c = c.split("^{coreInjector_connection_uri_comment_with_hash}").join('# These are the connection details of the app you created on supertokens.com')
                    c = c.split("^{coreInjector_uri}").join(`"${uri}${tenantString}",`);
                    c = c.split("^{coreInjector_api_key}").join(`"${key}"`)
                    c = c.split("^{coreInjector_api_key_without_quotes}").join(`${key}`)
                    c = c.split("^{coreInjector_api_key_commented}").join('')
                    c = c.split("^{coreInjector_api_key_commented_with_hash}").join('')
                    c = c.split("^{coreInjector_uri_without_quotes}").join(`${uri}${tenantString}`)
                }
                return c;
            });
        } else {
            singleTenant = recursiveMap(this.props.children, (c: any) => {
                let defaultValue = this.props.defaultValue || "https://try.supertokens.com";
                if (typeof c === "string") {
                    c = c.split("^{coreInjector_connection_uri_comment}").join('// ' + defaultValue + ' is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.')
                    c = c.split("^{coreInjector_connection_uri_comment_with_hash}").join('# ' + defaultValue + ' is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.')
                    c = c.split("^{coreInjector_uri}").join('"' + defaultValue + '",');
                    c = c.split("^{coreInjector_api_key}").join('<API_KEY(if configured)>')
                    c = c.split("^{coreInjector_api_key_without_quotes}").join('<API_KEY(if configured)>')
                    c = c.split("^{coreInjector_api_key_commented}").join('// ')
                    c = c.split("^{coreInjector_api_key_commented_with_hash}").join('# ')
                    c = c.split("^{coreInjector_uri_without_quotes}").join(defaultValue)
                }
                return c;
            });
            multiTenant = recursiveMap(this.props.children, (c: any) => {
                let defaultValue = this.props.defaultValue || "https://try.supertokens.com";
                if (typeof c === "string") {
                    c = c.split("^{coreInjector_connection_uri_comment}").join('// ' + defaultValue + ' is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.')
                    c = c.split("^{coreInjector_connection_uri_comment_with_hash}").join('# ' + defaultValue + ' is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.')
                    c = c.split("^{coreInjector_uri}").join('"' + defaultValue + tenantString + '",');
                    c = c.split("^{coreInjector_api_key}").join('<API_KEY(if configured)>')
                    c = c.split("^{coreInjector_api_key_without_quotes}").join('<API_KEY(if configured)>')
                    c = c.split("^{coreInjector_api_key_commented}").join('// ')
                    c = c.split("^{coreInjector_api_key_commented_with_hash}").join('# ')
                    c = c.split("^{coreInjector_uri_without_quotes}").join(defaultValue + tenantString)
                }
                return c;
            });
        }

        if (this.props.showAppId === false) {
            return singleTenant;
        }

        return <Tabs
            isSubTab={true}
            groupId="curl-single-tenant"
            defaultValue={"single-tenant"}
            values={[
                { label: this.props.showTenantId !== false ? 'Single tenant / app setup' : 'Single app setup', value: 'single-tenant' },
                { label: this.props.showTenantId !== false ? 'Multi tenant / app setup' : 'Multi app setup', value: 'multi-tenant' },
            ]}>
            <TabItem value="single-tenant" mdxType="TabItem">
                {singleTenant}
            </TabItem>
            <TabItem value="multi-tenant" mdxType="TabItem">
                {multiTenant}
            </TabItem>
        </Tabs>
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
        if (app.length > 0 && app[0].devDeployment.connectionInfo !== undefined) {
            return {
                uri: app[0].devDeployment.connectionInfo.host,
                key: app[0].devDeployment.connectionInfo.apiKeys[0],
            }
        }
        return undefined;
    }
}