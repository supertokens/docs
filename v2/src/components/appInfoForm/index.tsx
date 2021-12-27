import React, { PropsWithChildren } from "react";
import "./style.css";
import FormItem from './formItem';
import NormalisedURLDomain from "./normalisedURLDomain";
import { recursiveMap } from "../utils";

type Props = {
    askForAppName: boolean,
    askForAPIDomain: boolean,
    askForWebsiteDomain: boolean
    askForAPIBasePath: boolean,
    askForWebsiteBasePath: boolean,
    showNextJSAPIRouteCheckbox: boolean
    // TODO: Add more fields here
};

type State = {
    formSubmitted: boolean,
    appName: string,
    apiDomain: string,
    websiteDomain: string,
    apiBasePath: string,
    websiteBasePath: string,
    fieldErrors: {
        [key: string]: string
    },
    nextJSApiRouteUsed: boolean
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
            apiBasePath: props.showNextJSAPIRouteCheckbox ? "/api/auth" : "/auth",
            websiteBasePath: "/auth",
            fieldErrors: {},
            nextJSApiRouteUsed: true
        }

        if (typeof window !== 'undefined') {
            let jsonState = window.localStorage.getItem("form_appInfo")
            if (jsonState !== null && jsonState !== undefined) {
                this.state = {
                    ...this.state,
                    ...JSON.parse(jsonState)
                }
            }
            
            window.addEventListener("appInfoFormFilled", this.anotherFormFilled);
        }
    }

    componentDidMount() {
        this.setState(oldState => ({
            ...oldState,
            formSubmitted: this.canContinue(true)   // we reset this value because maybe the form is partially completed cause of another form completion which could have taken a subset of the info for this form.
        }))
    }

    anotherFormFilled = () => {
        if (typeof window !== 'undefined') {
            const jsonState = window.localStorage.getItem("form_appInfo")
            if (jsonState !== null && jsonState !== undefined) {
                const state = JSON.parse(jsonState)
                this.setState(oldState => ({
                    ...oldState,
                    ...state,
                    formSubmitted: oldState.formSubmitted,
                }), () => {
                    if (!this.state.formSubmitted) {
                        if (this.canContinue()) {
                            this.handleContinueClicked(false);
                        }
                    } else {
                        if (!this.canContinue()) {
                            this.setState(oldState => ({
                                ...oldState,
                                formSubmitted: false
                            }))
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
        this.setState(oldState => ({
            ...oldState,
            formSubmitted: false
        }))
    }

    updateFieldStateAndRemoveError = (fieldName, value) => {
        this.setState(oldState => ({
            ...oldState,
            [fieldName]: value
        }), () => {
            const errors = {...this.state.fieldErrors};
            delete errors[fieldName];
            this.setState(oldState => ({
                ...oldState,
                fieldErrors: errors
            }))
        })
    }

    render() {
        if (this.state.formSubmitted) {
            return (
                <div>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            borderRadius: "6px",
                            background: "#292929",
                            padding: "16px",
                            marginBottom: "20px",
                            color: "#ffffff",
                        }}>
                        <div
                            style={{
                                width: "17px",
                                marginRight: "10px"
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
                            if (this.props.askForAPIBasePath) {
                                c = c.split("^{form_apiBasePath}").join(this.state.apiBasePath);
                            }
                            if (this.props.askForWebsiteBasePath) {
                                c = c.split("^{form_websiteBasePath}").join(this.state.websiteBasePath);
                            }
                        }
                        return c;
                    })}
                </div>)
        } else {
            const canContinue = Object.keys(this.state.fieldErrors).length === 0;

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
                            fontWeight: 600,
                            textTransform: "uppercase"
                        }}>
                        Please fill the form below to see the code snippet <span
                            style={{
                                color: "#ff6161"
                            }}>(* = Required)</span>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        To learn more about what these properties mean read <a href="/docs/thirdpartyemailpassword/appinfo">here</a>.
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
                            required
                            index={0}
                            title="Your app's name"
                            placeholder="e.g. My awesome App"
                            onChange={(value) => this.updateFieldStateAndRemoveError("appName", value)}
                            explanation="This is the name of your application"
                            value={this.state.appName}
                            error={this.state.fieldErrors.appName}
                        />}
                        {/* show apiDomain field if it is not a NextJS form */}
                        {/* show apiDomain field if it is a nextJS form and the `nextJS api route used` checkbox is not checked */}
                        {this.props.askForAPIDomain
                            && (!this.props.showNextJSAPIRouteCheckbox || (this.props.showNextJSAPIRouteCheckbox && !this.state.nextJSApiRouteUsed))
                            && <FormItem
                            required
                            index={1}
                            title="API Domain"
                            placeholder="e.g. http://localhost:8080"
                            onChange={(value) => this.updateFieldStateAndRemoveError("apiDomain", value)}
                            explanation="This is the URL of your app's API domain."
                            value={this.state.apiDomain}
                            error={this.state.fieldErrors.apiDomain}
                        />}
                        {this.props.askForAPIBasePath && <FormItem
                            index={3}
                            title="API Base Path"
                            placeholder="e.g. /auth"
                            onChange={(value) => this.updateFieldStateAndRemoveError("apiBasePath", value)}
                            explanation="SuperTokens will expose it's APIs scoped by this base API path."
                            value={this.state.apiBasePath}
                            error={this.state.fieldErrors.apiBasePath}
                            />}
                        {this.props.askForWebsiteDomain && <FormItem
                            required
                            index={2}
                            title="Website Domain"
                            placeholder="e.g. http://localhost:3000"
                            onChange={(value) => this.updateFieldStateAndRemoveError("websiteDomain", value)}
                            explanation="This is the URL of your website."
                            value={this.state.websiteDomain}
                            error={this.state.fieldErrors.websiteDomain}
                        />}
                        {this.props.askForWebsiteBasePath && <FormItem
                            index={4}
                            title="Website Base Path"
                            placeholder="e.g. /auth"
                            onChange={(value) => this.updateFieldStateAndRemoveError("websiteBasePath", value)}
                            explanation="SuperTokens UI will be shown on this website route."
                            value={this.state.websiteBasePath}
                            error={this.state.fieldErrors.websiteBasePath}
                        />}

                        {this.props.showNextJSAPIRouteCheckbox && (
                            <label style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                width: "fit-content"
                            }}>
                                <input
                                    name="nextjs-api-route"
                                    type="checkbox"
                                    checked={this.state.nextJSApiRouteUsed}
                                    onChange={() => {
                                        this.setState(oldState => {
                                            const toggledNextJSApiRouteUsed = !oldState.nextJSApiRouteUsed;

                                            let defaultApiBasePath = oldState.apiBasePath;

                                            // nextjs api route used checkbox is toggled true
                                            if (toggledNextJSApiRouteUsed && defaultApiBasePath === "/auth") {
                                                defaultApiBasePath = "/api/auth";
                                            } else if (!toggledNextJSApiRouteUsed && defaultApiBasePath === "/api/auth") {
                                                defaultApiBasePath = "/auth";
                                            }

                                            return {
                                                ...oldState,
                                                nextJSApiRouteUsed: toggledNextJSApiRouteUsed,
                                                apiBasePath: defaultApiBasePath
                                            }
                                        })
                                    }}
                                    style={{
                                        marginRight: "10px"
                                    }}
                                />
                                <span>
                                    I am using NextJS' <a target="_blank" href="https://nextjs.org/docs/api-routes/introduction">API route</a>
                                </span>
                            </label>
                        )}

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

    getDomainOriginOrEmptyString = (domain: string) => {
        try {
            return new URL(new NormalisedURLDomain(domain.trim()).getAsStringDangerous()).origin;
        } catch {
            return "";
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
                apiDomain: this.props.askForAPIDomain ? this.getDomainOriginOrEmptyString(this.state.apiDomain) : oldState.apiDomain,
                websiteDomain: this.props.askForWebsiteDomain ? this.getDomainOriginOrEmptyString(this.state.websiteDomain) : oldState.websiteDomain,
                appName: this.props.askForAppName ? this.state.appName.trim() : oldState.appName,
                apiBasePath: this.props.askForAPIBasePath ? this.state.apiBasePath.trim() : oldState.apiBasePath,
                websiteBasePath: this.props.askForWebsiteBasePath ? this.state.websiteBasePath.trim() : oldState.websiteBasePath,
                formSubmitted: true
            }
        }, () => {
            if (typeof window !== 'undefined' && fromUser) {
                const currentState = {...this.state};

                // do not save fieldErrors in localStorage
                delete currentState.fieldErrors;

                window.localStorage.setItem("form_appInfo", JSON.stringify(currentState));
                window.dispatchEvent(new Event('appInfoFormFilled'));
            }
        })
    }

    // returns empty string if the domain is valid
    // returns an error if the domain is not valid
    validateDomain = (domain: string, fieldName: string, pathErrorAlternateFieldName: string) => {
        try {
            const normalisedURLDomain = new NormalisedURLDomain(domain);

            const domainAsURL = new URL(normalisedURLDomain.getAsStringDangerous());

            // check if it does not have any path value
            if (domainAsURL.pathname !== "/") return `${fieldName} should not contain any path, use ${pathErrorAlternateFieldName} instead.`;

            return ""
        } catch {
            return "Please enter a valid domain.";
        }
    }

    canContinue = (preventErrorUpdateInState?: boolean) => {
        // TODO: Add more fields here.
        const appName = this.state.appName.trim();
        const apiDomain = this.state.apiDomain.trim();
        const websiteDomain = this.state.websiteDomain.trim();
        const apiBasePath = this.state.apiBasePath.trim();
        const websiteBasePath = this.state.websiteBasePath.trim();

        // empty map for validation errors
        // maps the field's name to it's error
        const validationErrors: {
            [key: string]: string
        } = {}

        // regex for path
        const pathRegex = /^\/$|^(\/\w+)+$/

        // validate appName field
        if (this.props.askForAppName && appName.length === 0) {
            validationErrors.appName = "appName cannot be empty.";
        }

        // validate apiDomain field
        if (this.props.askForAPIDomain && (!this.props.showNextJSAPIRouteCheckbox || (this.props.showNextJSAPIRouteCheckbox && !this.state.nextJSApiRouteUsed))) {
            if (apiDomain.length > 0) {
                const error = this.validateDomain(apiDomain, "apiDomain", "apiBasePath");
                if (error.length > 0) validationErrors.apiDomain = error
            } else {
                validationErrors.apiDomain = "apiDomain cannot be empty.";
            }
        }
        
        // validate websiteDomain field
        if (this.props.askForWebsiteDomain) {
            if (websiteDomain.length > 0) {
                const error = this.validateDomain(websiteDomain, "websiteDomain", "websiteBasePath");
                if (error.length > 0) validationErrors.websiteDomain = error
            } else {
                validationErrors.websiteDomain = "websiteDomain cannot be empty.";
            }
        }

        if (this.props.askForAPIBasePath) {
            if (apiBasePath.length > 0) {
                if (pathRegex.test(apiBasePath)) {
                    // if nextJS api route checkbox is set to true
                    // the api base path can be `/api` or `/api/some/path`
                    if (this.props.showNextJSAPIRouteCheckbox && this.state.nextJSApiRouteUsed && !(apiBasePath === "/api" || apiBasePath.startsWith("/api/"))) {
                        validationErrors.apiBasePath = "Please enter a valid path."
                    }
                } else {
                    validationErrors.apiBasePath = "Please enter a valid path."
                }
            }
        }

        if (this.props.askForWebsiteBasePath) {
            if (websiteBasePath.length > 0 && !pathRegex.test(websiteBasePath)) {
                validationErrors.websiteBasePath = "Please enter a valid path."
            }
        }

        if (!preventErrorUpdateInState) {
            this.setState(oldState => ({
                ...oldState,
                fieldErrors: validationErrors
            }))
        } else if (validationErrors.apiBasePath !== undefined) {
            this.setState(oldState => ({
                ...oldState,
                fieldErrors: {
                    apiBasePath: validationErrors.apiBasePath
                }
            }))
        }

        return Object.keys(validationErrors).length === 0;
    }
}