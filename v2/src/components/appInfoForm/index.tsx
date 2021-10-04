import React, { PropsWithChildren } from "react";
import "./style.css";
import FormItem from './formItem';
import NormalisedURLDomain from "./normalisedURLDomain";

type Props = {
    askForAppName: boolean,
    askForAPIDomain: boolean,
    askForWebsiteDomain: boolean
};

type State = {
    formSubmitted: boolean,
    appName: string,
    apiDomain: string,
    websiteDomain: string,
};

export default class AppInfoForm extends React.PureComponent<PropsWithChildren<Props>, State> {

    constructor(props: PropsWithChildren<Props>) {
        super(props);
        if (!props.askForAPIDomain && !props.askForAppName &&
            !props.askForWebsiteDomain) {
            throw new Error("You must ask for at least one item in the form")
        }
        this.state = {
            formSubmitted: false,
            appName: "",
            apiDomain: "",
            websiteDomain: "",
        }

        if (typeof window !== 'undefined') {
            let jsonState = window.localStorage.getItem("form_appInfo")
            if (jsonState !== null && jsonState !== undefined) {
                this.state = JSON.parse(jsonState)
            }
        }
    }

    render() {
        if (this.state.formSubmitted) {
            return recursiveMap(this.props.children, (c) => {
                if (typeof c === "string") {
                    c = c.split("^{form_appName}").join(this.state.appName);
                    c = c.split("^{form_apiDomain}").join(this.state.apiDomain);
                    c = c.split("^{form_websiteDomain}").join(this.state.websiteDomain);
                }
                return c;
            })
        } else {
            return (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "6px",
                        background: "#292929",
                        padding: "16px",
                        marginBottom: "10px",
                        color: "#ffffff",
                    }}>
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: 600
                        }}>
                        PLEASE PROVIDE YOUR CONFIGURATION VALUES
                    </div>
                    <div style={{ height: "25px" }} />
                    <div
                        style={{
                            paddingLeft: "2%",
                            paddingRight: "11%",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                        {this.props.askForAppName && <FormItem
                            title="appName"
                            placeholder="e.g. My awesome App"
                            onChange={(val) => {
                                this.setState(oldState => {
                                    return {
                                        ...oldState,
                                        appName: val
                                    };
                                })
                            }}
                            explanation="This is the name of your application"
                            value={this.state.appName} />}
                        {this.props.askForAPIDomain && <FormItem
                            title="apiDomain"
                            placeholder="e.g. http://localhost:8080"
                            onChange={(val) => {
                                this.setState(oldState => {
                                    return {
                                        ...oldState,
                                        apiDomain: val
                                    };
                                })
                            }}
                            explanation="This the the URL of your API domain, without any path."
                            value={this.state.apiDomain} />}
                        {this.props.askForWebsiteDomain && <FormItem
                            title="websiteDomain"
                            placeholder="e.g. http://localhost:3000"
                            onChange={(val) => {
                                this.setState(oldState => {
                                    return {
                                        ...oldState,
                                        websiteDomain: val
                                    };
                                })
                            }}
                            explanation="This the the URL of your website, without any path."
                            value={this.state.websiteDomain} />}
                        {this.canContinue() ? <><div style={{ height: "30px" }} />
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}>
                                <div style={{
                                    flex: 1
                                }} />
                                <div
                                    onClick={this.handleContinueClicked}
                                    className="button">
                                    Continue
                                </div>
                            </div></> : null}
                    </div>
                </div>
            );
        }
    }

    handleContinueClicked = () => {
        if (!this.canContinue()) {
            return;
        }

        this.setState(oldState => {
            return {
                ...oldState,
                apiDomain: new NormalisedURLDomain(this.state.apiDomain).getAsStringDangerous(),
                websiteDomain: new NormalisedURLDomain(this.state.websiteDomain).getAsStringDangerous(),
                formSubmitted: true
            }
        }, () => {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem("form_appInfo", JSON.stringify(this.state))
            }
        })
    }

    canContinue = () => {
        let appNameFine = !this.props.askForAppName;
        let apiDomainFine = !this.props.askForAPIDomain;
        let websiteDomainFine = !this.props.askForWebsiteDomain;

        const appName = this.state.appName.trim();
        const apiDomain = this.state.apiDomain.trim();
        const websiteDomain = this.state.websiteDomain.trim();

        if (appName.length > 0) {
            appNameFine = true;
        }

        if (apiDomain.length > 0) {
            try {
                new NormalisedURLDomain(apiDomain);
                apiDomainFine = true;
            } catch (ignored) { }
        }

        if (websiteDomain.length > 0) {
            try {
                new NormalisedURLDomain(websiteDomain);
                websiteDomainFine = true;
            } catch (ignored) { }
        }

        return appNameFine && apiDomainFine && websiteDomainFine;
    }
}

function recursiveMap(children: any, fn: any) {
    let result = React.Children.map(children, (child: any) => {
        if (!React.isValidElement(child) as any) {
            return fn(child);
        }
        if (child.props.children) {
            child = React.cloneElement(child, {
                children: recursiveMap(child.props.children, fn)
            });
        }
        return child;
    });
    if (children.props !== undefined && children.props.children !== undefined &&
        !Array.isArray(children.props.children)) {
        return result[0];
    }
    return result;
}