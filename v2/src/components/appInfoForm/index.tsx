import React, { PropsWithChildren } from "react";
import "./style.css";
import FormItem from './formItem';
import NormalisedURLDomain from "./normalisedURLDomain";
import NormalisedURLPath from "./normalisedURLPath";
import { recursiveMap } from "../utils";

type Props = {
    askForAppName: boolean,
    askForAPIDomain: boolean,
    askForWebsiteDomain: boolean,
    askForAPIBasePath: boolean,
    hideWebsiteBasePathField: boolean,
    showNextJSAPIRouteCheckbox: boolean,
    showNetlifyAPIRouteCheckbox: boolean,
    addNetlifyPathExplanation: boolean,
    askForWebsiteBasePath: boolean,
    addVisitWebsiteBasePathText: boolean
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
    nextJSApiRouteUsed: boolean,
    netlifyApiRouteUsed: boolean,
    showWebsiteBasePath: boolean,
    showAPIBasePath: boolean
    // TODO: Add more fields here
};

export default class AppInfoForm extends React.PureComponent<PropsWithChildren<Props>, State> {

    constructor(props: PropsWithChildren<Props>) {
        super(props);
        // TODO: Add more fields here
        if (!props.askForAPIDomain && !props.askForAppName &&
            !props.askForWebsiteDomain && !props.askForWebsiteBasePath && !props.askForAPIBasePath) {
            throw new Error("You must ask for at least one item in the form")
        }
        this.state = {
            formSubmitted: false,
            appName: "",
            apiDomain: "",
            websiteDomain: "",
            apiBasePath: "/auth",
            websiteBasePath: "/auth",
            fieldErrors: {},
            nextJSApiRouteUsed: true,
            netlifyApiRouteUsed: true,
            showWebsiteBasePath: (props.askForWebsiteDomain || props.askForWebsiteBasePath) && !props.hideWebsiteBasePathField,
            showAPIBasePath: (props.askForAPIDomain || props.askForAPIBasePath)
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
        // we reset this value because maybe the form is partially completed cause of another form completion
        // which could have taken a subset of the info for this form.
        const canContinue = this.canContinue(true)

        this.setState(oldState => ({
            ...oldState,
            formSubmitted: canContinue
        }), () => {
            this.setDefaultApiBasePathBasedOnToggles()
        })
    }

    replacePathPrefixWithNewPrefix = (path: string, oldPrefix: string, newPrefix: string) => {
        if (path.startsWith(oldPrefix)) {
            const pathWithoutPrefix = path.substring(oldPrefix.length);
            return `${newPrefix}${pathWithoutPrefix}`;
        } else {
            return `${newPrefix}${path}`;
        }
    }

    setDefaultApiBasePathBasedOnToggles = () => {
        let defaultApiBasePath = this.state.apiBasePath;

        if (defaultApiBasePath === "/auth") {
            if (this.props.showNextJSAPIRouteCheckbox && this.state.nextJSApiRouteUsed) {
                defaultApiBasePath = "/api/auth";
            } else if (this.props.showNetlifyAPIRouteCheckbox && this.state.netlifyApiRouteUsed) {
                defaultApiBasePath = "/.netlify/functions/auth";
            }
        } else {
            const nextJSPrefix = "/api";
            const netlifyPrefix = "/.netlify/functions";

            if (this.props.showNextJSAPIRouteCheckbox && this.state.nextJSApiRouteUsed && !defaultApiBasePath.startsWith(nextJSPrefix)) {
                defaultApiBasePath = this.replacePathPrefixWithNewPrefix(defaultApiBasePath, "/.netlify/functions", "/api");
            } else if (this.props.showNetlifyAPIRouteCheckbox && this.state.netlifyApiRouteUsed && !defaultApiBasePath.startsWith(netlifyPrefix)) {
                defaultApiBasePath = this.replacePathPrefixWithNewPrefix(defaultApiBasePath, "/api", "/.netlify/functions");
            }
        }

        this.setState({
            apiBasePath: defaultApiBasePath
        })
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
                        if (this.canContinue(true)) {
                            this.handleContinueClicked(false);
                        }
                    } else {
                        if (!this.canContinue(true)) {
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

    resubmitInfoClicked = (event: any) => {
        event.preventDefault();
        this.setState(oldState => ({
            ...oldState,
            formSubmitted: false
        }))
    }

    updateFieldStateAndRemoveError = (fieldName: string, value: string) => {
        let newValue = value;
        // if the value for apiBasePath or websiteBasePath is an empty string
        // we save a "/" instead
        if ((fieldName === "apiBasePath" || fieldName === "websiteBasePath") && value.trim() === "") {
            newValue = "/";
        }

        this.setState(oldState => ({
            ...oldState,
            [fieldName]: newValue
        }), () => {
            const errors = {...this.state.fieldErrors};
            delete errors[fieldName];
            this.setState(oldState => ({
                ...oldState,
                fieldErrors: errors
            }))
        })
    }

    handleNextNetlifyRouteToggle = (fieldName: "nextJSApiRouteUsed" | "netlifyApiRouteUsed", pathPrefix: string) => {
        this.setState(oldState => {
            const toggledRouteCheckboxValue = !oldState[fieldName];

            let oldApiBasePath = oldState.apiBasePath;
            if (!oldApiBasePath.startsWith("/")) {
                oldApiBasePath = `/${oldApiBasePath}`;
            }

            // we check if the old apiBasePath starts with the path prefix or not
            const apiBasePathWithPrefix = oldApiBasePath.startsWith(pathPrefix)

            const isApiBasePathEmpty = oldApiBasePath === undefined || oldApiBasePath === "" || oldApiBasePath === "/";

            // if the checkbox is toggled true
            if (toggledRouteCheckboxValue && !apiBasePathWithPrefix) {
                if (isApiBasePathEmpty) {
                    oldApiBasePath = `${pathPrefix}/auth`;
                } else {
                    oldApiBasePath = `${pathPrefix}${oldApiBasePath}`;
                }
            } else if (!toggledRouteCheckboxValue && apiBasePathWithPrefix) {
                // if the checkbox is toggled to false

                // get the path without the prefix
                oldApiBasePath = oldApiBasePath.substring(pathPrefix.length);
            } else if (!toggledRouteCheckboxValue && !apiBasePathWithPrefix && isApiBasePathEmpty) {
                // if the checkbox is set to false and the apiBasePath is empty or '/'
                oldApiBasePath = "/auth"
            }

            return {
                ...oldState,
                [fieldName]: toggledRouteCheckboxValue,
                apiBasePath: oldApiBasePath
            }
        })
    }

    getNetlifyPathExplanationString = () => {
        if (!this.state.netlifyApiRouteUsed) return <></>;

        const netlifyPrefix = "/.netlify/functions";
        return (
            <>
                The value of <code>apiBasePath</code> should be <code>"{this.state.apiBasePath}"</code>. This is because Netlify exposes the serverless functions via <code>{netlifyPrefix}/*</code> and we further scope the auth related APIs by adding a <code>{this.state.apiBasePath.substring(netlifyPrefix.length)}</code>, resulting in the above full path.
            </>
        );
    }

    getVisitWebsiteBasePathText = () => (
        <span>
            You can view the login UI by visiting <code>{this.state.websiteBasePath || "/"}</code>.
        </span>
    )

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
                            }}
                            className="app-info-form-submitted-container"
                        >
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
                    {recursiveMap(this.props.children, (c: any) => {
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
                            if (this.state.showAPIBasePath) {
                                c = c.split("^{form_apiBasePath}").join(this.state.apiBasePath);
                            }
                            if (this.state.showAPIBasePath) {
                                c = c.split("^{form_apiBasePathForCallbacks}").join(this.state.apiBasePath !== "/" ? this.state.apiBasePath : "");
                            }
                            if (this.state.showWebsiteBasePath) {
                                c = c.split("^{form_websiteBasePath}").join(this.state.websiteBasePath);
                            }
                            if (this.state.showWebsiteBasePath) {
                                c = c.split("^{form_websiteBasePathForCallbacks}").join(this.state.websiteBasePath !== "/" ? this.state.websiteBasePath : "");
                            }
                            if (this.props.addNetlifyPathExplanation && c === "^{form_netlifyPathExplanation}") {
                                c = this.getNetlifyPathExplanationString();
                            }
                            if (this.props.addVisitWebsiteBasePathText && c === "^{form_addVisitWebsiteBasePathText}") {
                                c = this.getVisitWebsiteBasePathText()
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
                        padding: "16px",
                        color: "#ffffff",
                    }}
                    className="app-info-form-container"
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
                    <div
                        className="app-info-form-container-link"
                        style={{ marginTop: "10px" }}
                    >
                        To learn more about what these properties mean read <a href="/docs/thirdpartyemailpassword/appinfo">here</a>.
                    </div>
                    <div style={{ height: "25px" }} />
                    <div
                        style={{
                            paddingLeft: "1.5rem",
                            paddingRight: "1.5rem",
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
                            explanation="This is the URL of your app's API server."
                            value={this.state.apiDomain}
                            error={this.state.fieldErrors.apiDomain}
                        />}
                        {(this.state.showAPIBasePath) && <FormItem
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
                        {this.state.showWebsiteBasePath && <FormItem
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
                                    onChange={() => this.handleNextNetlifyRouteToggle("nextJSApiRouteUsed", "/api")}
                                    style={{
                                        marginRight: "10px"
                                    }}
                                />
                                <span>
                                    I am using NextJS' <a target="_blank" href="https://nextjs.org/docs/api-routes/introduction">API route</a>
                                </span>
                            </label>
                        )}

                        {this.props.showNetlifyAPIRouteCheckbox && (
                            <label style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                width: "fit-content"
                            }}>
                                <input
                                    name="nextjs-api-route"
                                    type="checkbox"
                                    checked={this.state.netlifyApiRouteUsed}
                                    onChange={() => this.handleNextNetlifyRouteToggle("netlifyApiRouteUsed", "/.netlify/functions")}
                                    style={{
                                        marginRight: "10px"
                                    }}
                                />
                                <span>
                                    I am using Netlify Serverless Functions
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
            return new URL(new NormalisedURLDomain(domain.toLowerCase().trim()).getAsStringDangerous()).origin;
        } catch {
            return "";
        }
    }

    getNormalisedBasePath = (path: string) => {
        try {
            const containsDomain = this.getDomainOriginOrEmptyString(path).length > 0;
            if (containsDomain) {
                return "";
            }

            let pathWithoutDomain = path;
            if (path.indexOf(".") !== -1 && !path.startsWith("/")) {
                pathWithoutDomain = `/${path}`;
            }

            const normalisedPath = new NormalisedURLPath(pathWithoutDomain).getAsStringDangerous();

            // if the path is "" or "/", NormalisedURLPath returns an empty string
            // in that case, return "/", else return the normalisedPath
            return normalisedPath.length > 0 ? normalisedPath : "/";
        } catch {
            return "";
        }
    }

    handleContinueClicked = (fromUser: boolean) => {
        if (!this.canContinue()) {
            return;
        }

        this.setState(oldState => {
            const websiteDomain = this.state.showWebsiteBasePath ? this.getDomainOriginOrEmptyString(this.state.websiteDomain) : oldState.websiteDomain;
            let apiDomain = oldState.apiDomain;

            // if the nextjs route is set to true
            // then we set apiDomain to the same value as website domain
            if (this.props.askForAPIDomain && this.props.showNextJSAPIRouteCheckbox && oldState.nextJSApiRouteUsed) {
                apiDomain = websiteDomain;
            } else if (this.props.askForAPIDomain) {
                apiDomain = this.getDomainOriginOrEmptyString(this.state.apiDomain);
            }

            let apiBasePath = this.state.showAPIBasePath ? this.getNormalisedBasePath(this.state.apiBasePath.trim()) : oldState.apiBasePath;

            // if the websiteBasePath is an empty string, we set it to the default value '/auth'
            let websiteBasePath = this.state.showWebsiteBasePath ? this.getNormalisedBasePath(this.state.websiteBasePath.trim()) : oldState.websiteBasePath;

            return {
                // TODO: Add more fields here.
                ...oldState,
                apiDomain,
                websiteDomain,
                apiBasePath,
                websiteBasePath,
                appName: this.props.askForAppName ? this.state.appName.trim() : oldState.appName,
                formSubmitted: true
            }
        }, () => {
            if (typeof window !== 'undefined' && fromUser) {
                // get the current form values stored in the localstorage
                const currentLocalStorageFormData = localStorage.getItem("form_appInfo");
                let currentLocalStorageParsedFormData: any = {};
                if (currentLocalStorageFormData) {
                    currentLocalStorageParsedFormData = JSON.parse(currentLocalStorageFormData);
                }

                const newLocalStorageFormData = {
                    appName: this.props.askForAppName ? this.state.appName : currentLocalStorageParsedFormData.appName,
                    apiDomain: this.props.askForAPIDomain ? this.state.apiDomain : currentLocalStorageParsedFormData.apiDomain,
                    websiteDomain: this.props.askForWebsiteDomain ? this.state.websiteDomain : currentLocalStorageParsedFormData.websiteDomain,
                    websiteBasePath: this.state.showWebsiteBasePath ? this.state.websiteBasePath : currentLocalStorageParsedFormData.websiteBasePath,
                    apiBasePath: this.state.showAPIBasePath ? this.state.apiBasePath : currentLocalStorageParsedFormData.apiBasePath,
                    nextJSApiRouteUsed: this.state.nextJSApiRouteUsed,
                    netlifyApiRouteUsed: this.state.netlifyApiRouteUsed,
                    formSubmitted: this.state.formSubmitted
                }

                window.localStorage.setItem("form_appInfo", JSON.stringify(newLocalStorageFormData));
                window.dispatchEvent(new Event('appInfoFormFilled'));
            }
        })
    }

    // returns empty string if the domain is valid
    // returns an error if the domain is not valid
    validateDomain = (domain: string, fieldName: string, pathErrorAlternateFieldName: string) => {
        try {
            const normalisedURLDomain = new NormalisedURLDomain(domain.toLowerCase().trim());

            const domainAsURL = new URL(normalisedURLDomain.getAsStringDangerous());

            // check if it does not have any path value
            if (domainAsURL.pathname !== "/") {
                return `${fieldName} should not contain any path, use ${pathErrorAlternateFieldName} instead.`;
            }

            return ""
        } catch {
            return "Please enter a valid domain.";
        }
    }

    // validates the basepaths using the node sdk path normalisation code
    isBasePathValid = (path: string) => {
        try {
            const doesNotContainDomain = this.getDomainOriginOrEmptyString(path).length === 0;

            if (!doesNotContainDomain) {
                return false;
            }

            new NormalisedURLPath(path);
            return true;
        } catch (error) {
            return false;
        }
    }

    canContinue = (preventErrorUpdateInState?: boolean) => {
        // TODO: Add more fields here.
        const appName = this.state.appName.trim();
        const apiDomain = this.state.apiDomain.trim();
        const websiteDomain = this.state.websiteDomain.trim();
        let apiBasePath = this.state.apiBasePath.trim();
        let websiteBasePath = this.state.websiteBasePath.trim();

        // empty map for validation errors
        // maps the field's name to it's error
        const validationErrors: {
            [key: string]: string
        } = {};

        // parse the form data stored in localstorage
        let localFormDataParsed: any = {};
        if (preventErrorUpdateInState) {
            const localFormData = window.localStorage.getItem("form_appInfo");
            if (localFormData) {
                localFormDataParsed = JSON.parse(localFormData);
            }
        }

        // validate appName field
        if (this.props.askForAppName && appName.length === 0) {
            validationErrors.appName = "appName cannot be empty.";
        }

        // validate apiDomain field
        if (this.props.askForAPIDomain && (!this.props.showNextJSAPIRouteCheckbox || (this.props.showNextJSAPIRouteCheckbox && !this.state.nextJSApiRouteUsed))) {
            if (apiDomain.length > 0) {
                const error = this.validateDomain(apiDomain, "apiDomain", "apiBasePath");
                if (error.length > 0) {
                    validationErrors.apiDomain = error;
                }
            } else {
                validationErrors.apiDomain = "apiDomain cannot be empty.";
            }
        }

        // validate websiteDomain field
        if (this.props.askForWebsiteDomain) {
            if (websiteDomain.length > 0) {
                const error = this.validateDomain(websiteDomain, "websiteDomain", "websiteBasePath");
                if (error.length > 0) {
                    validationErrors.websiteDomain = error;
                }
            } else {
                validationErrors.websiteDomain = "websiteDomain cannot be empty.";
            }
        }

        if (this.state.showAPIBasePath) {
            const netlifyApiRouteUsed = this.props.showNetlifyAPIRouteCheckbox && this.state.netlifyApiRouteUsed;
            const nextJSApiRouteUsed = this.props.showNextJSAPIRouteCheckbox && this.state.nextJSApiRouteUsed;

            if (preventErrorUpdateInState && (!localFormDataParsed || localFormDataParsed.apiBasePath === undefined)) {
                // we do this check in case the user has not submitted the form
                // in which case the base path fields will have the default '/auth'
                validationErrors.apiBasePath = "Please enter a valid path.";
            } else {
                if (this.isBasePathValid(apiBasePath)) {
                    const validApiBasePath = this.getNormalisedBasePath(apiBasePath);

                    // if nextJS api route checkbox is set to true
                    // the api base path can only be of the form `/api` or `/api/some/path/...`
                    if (
                        nextJSApiRouteUsed
                        && !(validApiBasePath === "/api" || validApiBasePath.startsWith("/api/"))
                    ) {
                        validationErrors.apiBasePath = "apiBasePath should begin with '/api' when using NextJS' API Route."
                    } else if (
                        netlifyApiRouteUsed
                        && !validApiBasePath.startsWith("/.netlify/functions/")
                    ) {
                        // if the netlify api route checkbox is set to true
                        // the api base path can only start with `/.netlify/functions`
                        validationErrors.apiBasePath = "apiBasePath must be prefixed by `/.netlify/functions/` and should contain a path after that. For example to use `/auth` set the apiBasePath to `/.netlify/functions/auth`. However using just `/.netlify/functions/` is considered invalid by Netlify.";
                    }
                } else {
                    validationErrors.apiBasePath = "Please enter a valid path."
                }
            }
        }

        if (this.state.showWebsiteBasePath) {
            if (preventErrorUpdateInState && (!localFormDataParsed || localFormDataParsed.websiteBasePath === undefined)) {
                // we do this check in case the user has not submitted the form
                // in which case the base path fields will have the default '/auth'
                validationErrors.websiteBasePath = "Please enter a valid path.";
            } else if (!this.isBasePathValid(websiteBasePath)) {
                validationErrors.websiteBasePath = "Please enter a valid path."
            }
        }

        if (this.state.showAPIBasePath && this.state.showWebsiteBasePath && !validationErrors.apiBasePath && !validationErrors.websiteBasePath) {
            const normalisedApiDomain = this.getDomainOriginOrEmptyString(apiDomain);
            const normalisedWebsiteDomain = this.getDomainOriginOrEmptyString(websiteDomain);
            const normalisedApiBasePath = this.getNormalisedBasePath(apiBasePath);
            const normalisedWebsiteBasePath = this.getNormalisedBasePath(websiteBasePath);

            const nextJSApiRouteUsed = this.props.showNextJSAPIRouteCheckbox && this.state.nextJSApiRouteUsed;
            const areNormalisedDomainsEqual = normalisedApiDomain === normalisedWebsiteDomain


            if (nextJSApiRouteUsed || areNormalisedDomainsEqual) {
                if (normalisedApiBasePath === normalisedWebsiteBasePath) {
                    validationErrors.apiBasePath = "apiBasePath and websiteBasePath cannot be equal.";
                } else if (normalisedApiBasePath.startsWith(normalisedWebsiteBasePath)) {
                    validationErrors.websiteBasePath = "websiteBasePath cannot be a prefix of apiBasePath.";
                } else if (normalisedWebsiteBasePath.startsWith(normalisedApiBasePath)) {
                    validationErrors.apiBasePath = "apiBasePath cannot be a prefix of websiteBasePath.";
                }
            }
        }

        if (!preventErrorUpdateInState) {
            this.setState(oldState => ({
                ...oldState,
                fieldErrors: validationErrors
            }))
        }

        return Object.keys(validationErrors).length === 0;
    }
}