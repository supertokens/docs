import React, { PropsWithChildren } from "react";
import "./style.css";
import FormItem from './formItem';
import NormalisedURLDomain from "./normalisedURLDomain";
import { recursiveMap } from "../utils";

type Props = {
    askForAppName: boolean,
    askForAPIDomain: boolean,
    askForWebsiteDomain: boolean
    // TODO: Add more fields here
};

type State = {
    formSubmitted: boolean,
    appName: string,
    apiDomain: string,
    websiteDomain: string,
    // TODO: Add more fields here
};

export default class AppInfoForm extends React.PureComponent<PropsWithChildren<Props>, State> {

    constructor(props: PropsWithChildren<Props>) {
        super(props);
        // TODO: Add more fields here
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
            this.state = {
                ...this.state,
                formSubmitted: this.canContinue()   // we reset this value because maybe the form is partially completed cause of another form completion which could have taken a subset of the info for this form.
            }
            window.addEventListener("appInfoFormFilled", this.anotherFormFilled);
        }
    }

    anotherFormFilled = () => {
        if (typeof window !== 'undefined') {
            let jsonState = window.localStorage.getItem("form_appInfo")
            if (jsonState !== null && jsonState !== undefined) {
                let state = JSON.parse(jsonState)
                this.setState(oldState => {
                    return {
                        ...oldState,
                        ...state,
                        formSubmitted: oldState.formSubmitted,
                    }
                }, () => {
                    if (!this.state.formSubmitted) {
                        if (this.canContinue()) {
                            this.handleContinueClicked(false);
                        }
                    } else {
                        if (!this.canContinue()) {
                            this.setState(oldState => {
                                return {
                                    ...oldState,
                                    formSubmitted: false
                                }
                            })
                        }
                    }
                });
            }
        }
    }

    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener("appInfoFormFilled", this.anotherFormFilled);
        }
    }

    resubmitInfoClicked = (event) => {
        event.preventDefault();
        this.setState(oldState => {
            return {
                ...oldState,
                formSubmitted: false
            }
        })
    }

    render() {
        if (this.state.formSubmitted) {
            return (
                <div>
                    <div className="app-info-form-question-container">
                        <div
                            style={{
                                width: "17px"
                            }}>
                            <img
                                style={{
                                    width: "17px",
                                }}
                                src="/img/form-submitted-tick.png" />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                                marginTop: "-2px"
                            }}>
                            <div
                                style={{
                                    fontSize: "14px",
                                    fontWeight: 600
                                }}>
                                YOUR CONFIGURATION VALUES
                            </div>
                            <div style={{ height: "10px" }} />
                            <div
                                style={{
                                    fontSize: "16px",
                                }}>
                                Your provided information is displayed in the code below. <a href="" onClick={this.resubmitInfoClicked}>Resubmit info?</a>
                            </div>
                        </div>
                    </div>
                    {recursiveMap(this.props.children, (c) => {
                        if (typeof c === "string") {
                            // TODO: Add more fields here.
                            if (this.props.askForAppName) {
                                c = c.split("^{form_appName}").join(this.state.appName);
                            }
                            if (this.props.askForAPIDomain) {
                                c = c.split("^{form_apiDomain}").join(this.state.apiDomain);
                            }
                            if (this.props.askForWebsiteDomain) {
                                c = c.split("^{form_websiteDomain}").join(this.state.websiteDomain);
                            }
                        }
                        return c;
                    })}
                </div>)
        } else {

            const canContinue = this.canContinue();

            return (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "6px",
                        background: "rgb(42, 47, 68)",
                        border: "1px solid rgb(42, 47, 68)",
                        padding: "16px",
                        marginBottom: "10px",
                        color: "#ffffff",
                    }}
                >
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            textTransform: "uppercase"
                        }}>
                        Please fill the form below to see the code snippet <span
                            style={{
                                color: "#ff6161"
                            }}>(* = Required)</span>
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
                            index={0}
                            title="Your app's name"
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
                            index={1}
                            title="API Domain"
                            placeholder="e.g. http://localhost:8080"
                            onChange={(val) => {
                                this.setState(oldState => {
                                    return {
                                        ...oldState,
                                        apiDomain: val
                                    };
                                })
                            }}
                            explanation="This is the URL of your app's API domain, without any path."
                            value={this.state.apiDomain} />}
                        {this.props.askForWebsiteDomain && <FormItem
                            index={2}
                            title="Website Domain"
                            placeholder="e.g. http://localhost:3000"
                            onChange={(val) => {
                                this.setState(oldState => {
                                    return {
                                        ...oldState,
                                        websiteDomain: val
                                    };
                                })
                            }}
                            explanation="This is the URL of your website, without any path."
                            value={this.state.websiteDomain} />}
                        {/* TODO: Add more fields here */}
                        <div style={{ height: "16px" }} />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                            }}>
                            <div style={{
                                flex: 1
                            }} />
                            <div
                                onClick={() => this.handleContinueClicked(true)}
                                className="button" style={canContinue ? {} : {
                                    cursor: "not-allowed"
                                }}>
                                {canContinue ? "Submit form" : "Fill form to submit"}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    handleContinueClicked = (fromUser: boolean) => {
        if (!this.canContinue()) {
            return;
        }

        this.setState(oldState => {
            return {
                // TODO: Add more fields here.
                ...oldState,
                apiDomain: this.props.askForAPIDomain ? new NormalisedURLDomain(this.state.apiDomain).getAsStringDangerous() : oldState.apiDomain,
                websiteDomain: this.props.askForWebsiteDomain ? new NormalisedURLDomain(this.state.websiteDomain).getAsStringDangerous() : oldState.websiteDomain,
                appName: this.props.askForAppName ? this.state.appName.trim() : oldState.appName,
                formSubmitted: true
            }
        }, () => {
            if (typeof window !== 'undefined' && fromUser) {
                window.localStorage.setItem("form_appInfo", JSON.stringify(this.state));
                window.dispatchEvent(new Event('appInfoFormFilled'));
            }
        })
    }

    canContinue = () => {
        // TODO: Add more fields here.
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