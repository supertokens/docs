import React, { PropsWithChildren } from "react";
import "./style.css";
import FormItem from './formItem';
import NormalisedURLDomain from "./normalisedURLDomain";
import NormalisedURLPath from "./normalisedURLPath";
import { recursiveMap } from "../utils";

/**
 * The AppInfoForm component is now designed to allow only open the first visible form on the page. 
 * When a user tried to resubmit a second, third or fourth form, then it will not open the selected AppInfoForm. Instead, it will open the first AppInfoFormand scroll to it.
 * We use DOM attribute CONTAINER_ATTRIBUTE_DISPLAY as the way to communicate to the first AppInfoForm. This is done by calling AppInfoForm.resubmitFirstAppInfoForm().
 * When a form is receiving "CONTAINER_ATTRIBUTE_DISPLAY=true", then it will open the form.
 * The form is listening to this attribute's changes by using `AppInfoForm.attributeObserver:MutationObserver` that is utilizing isReceivingFirstFormAttr() and AppInfoForm.onReceiveAttribute().
 * 
 * Beside the above event, we also have a way to recognize which is the first visible form. The form considered to be the first visible form when its height and width are not zero(function isElementVisible()). 
 * Then, we use isFirstAppInfoForm() and getFirstAppInfoForm() to indicate whether a form is a first visible one. The first form will also have attribut CONTAINER_ATTRIBUTE_FIRST_FORM attached in the DOM.
 * 
 * There is also case when user switches between tabs, which will affect the visibility of the form.
 * We expect this will triggers re-updating which one is the first visible form. Therefore, `AppInfoForm.visibilityObserver: IntersectionObserver` is created to listen to any visibility changes on the form.
 * 
 * There is also an edge case where a form is located inside a `details` element. When `details` opens or closes, it will not notify the IntersectionObserver. 
 * So, we add AppInfoForm.recheckCurrentFirstAppInfoForm() to trigger the visibilty status update by sending an event to element that has CONTAINER_ATTRIBUTE_FIRST_FORM attribute.
 */

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
    /** Whether current element is the first visible AppInfoForm */
    firstAppInfoForm?: boolean
    // TODO: Add more fields here
};

type ResubmitParams = {
    event?: Pick<Event, 'preventDefault'>;
    /** Scroll page to current form when its resubmitted */
    scrollToElement?: boolean;
};

/** attribute name that is used to trigger resubmitting the form */
const CONTAINER_ATTRIBUTE_DISPLAY = 'display-form';
/** attribute name that is used to indicate current first form */
const CONTAINER_ATTRIBUTE_FIRST_FORM = 'first-form';
const CONTAINER_CLASSNAME = "app-info-form-outer";
/**
 * Check if the mutations receive the matched attribute name & value
 */
const isReceivingAttr = (mutations: MutationRecord[], attributeName: string, attributeValue?: string) => {
    return mutations.some(mutation => {
        const mutationAttributeName = mutation.attributeName;
        return mutation.type === 'attributes' 
            && mutationAttributeName === attributeName 
            && (attributeValue == null || (mutation.target as HTMLElement).getAttribute(attributeName) === attributeValue);
    });
}
/** Check whether it contains element attributes that triggers resubmitting the form */
const isReceivingDisplayAttr = (mutations: MutationRecord[]) => isReceivingAttr(mutations, CONTAINER_ATTRIBUTE_DISPLAY, 'true')
/** Check whether its contains element attributes that triggers rechecking current first form */
const isReceivingFirstFormAttr = (mutations: MutationRecord[]) => isReceivingAttr(mutations, CONTAINER_ATTRIBUTE_FIRST_FORM)

const isElementVisible = (element?: Element | null): boolean => element != null && element.clientWidth > 0 && element.clientHeight > 0;
const getFirstAppInfoForm = () => {
    return Array.from(document.querySelectorAll(`.${CONTAINER_CLASSNAME}`)).find(isElementVisible);
}
/** 
 * Check first AppInfoForm by element's id 
 * @param id AppInfoForm.elementId 
 * @returns 
 */
const isFirstAppInfoForm = (id: string) => {
    let firstAppInfoForm = getFirstAppInfoForm();

    if (firstAppInfoForm === undefined) {
        return false;
    }

    return firstAppInfoForm.id === id
}

export default class AppInfoForm extends React.PureComponent<PropsWithChildren<Props>, State> {
    private readonly elementId = (new Date()).getTime()
    private readonly containerRef: React.RefObject<HTMLDivElement>
    private attributeObserver?: MutationObserver;
    private visibilityObserver?: IntersectionObserver;  

    constructor(props: PropsWithChildren<Props>) {
        super(props);
        // TODO: Add more fields here
        this.containerRef = React.createRef<HTMLDivElement>();
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
            showWebsiteBasePath: true,
            showAPIBasePath: true
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

        // listen to DOM changes 
        this.attributeObserver = new MutationObserver(this.onReceiveAttribute.bind(this));
        this.visibilityObserver = new IntersectionObserver(() => this.setState({ 
            firstAppInfoForm: this.isFirstVisibleAppInfoForm()
        }))
        this.attributeObserver.observe(this.containerRef.current!, { attributes: true });
        this.visibilityObserver.observe(this.containerRef.current!);

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
        
        if (this.attributeObserver !== undefined) {
            this.attributeObserver.disconnect()
        }

        if (this.visibilityObserver !== undefined) {
            this.visibilityObserver.disconnect()
        }
    }

    readonly resubmitFirstAppInfoForm = (event?: ResubmitParams['event']) => {
        if (event !== undefined) {
            event.preventDefault()
        }

        this.recheckCurrentFirstAppInfoForm();

        let firstInfoForm = getFirstAppInfoForm();

        if (firstInfoForm !== undefined) {
            firstInfoForm.setAttribute(CONTAINER_ATTRIBUTE_DISPLAY, 'true')
        }
    }

    resubmitInfoClicked = ({event, scrollToElement} : ResubmitParams) => {
        if (event !== undefined) {
            event.preventDefault();
        }

        this.setState(oldState => ({
            ...oldState,
            formSubmitted: false
        }))
        if (scrollToElement) { this.scrollToElement() }
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
        const customAttributes: Record<string, string | undefined> = {}        
        if (this.state.firstAppInfoForm) { customAttributes[CONTAINER_ATTRIBUTE_FIRST_FORM] = undefined }

        return <div id={this.elementId.toString()} className={CONTAINER_CLASSNAME} ref={this.containerRef}> 
            {(!this.state.formSubmitted && this.state.firstAppInfoForm) && this.renderForm()}
            {this.renderResubmitAndChildren()}
        </div>;        
    }

    renderResubmitButton() {
        return <div className="app-info-form-question-container">
            <div
                style={{
                    width: "17px"
                }}>
                <img
                    style={{
                        width: "17px",
                    }}
                    src="/img/form-submitted-tick.png"
                    alt="Form submitted"
                />
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
                    Your provided information is displayed in the code below. <a href="" onClick={this.resubmitFirstAppInfoForm}>Resubmit info?</a>
                </div>
            </div>
        </div>;
    }

    renderResubmitAndChildren() {
        return (
            <div>
                {this.state.formSubmitted && this.state.firstAppInfoForm && this.renderResubmitButton()}
                {recursiveMap(this.props.children, (c: any) => {
                    if (typeof c === "string") {
                        // TODO: Add more fields here.
                        if (this.props.askForAppName) {
                            c = c.split("^{form_appName}").join(this.state.appName || '<YOUR_APP_NAME>');
                        }
                        if (this.props.askForAPIDomain) {
                            c = c.split("^{form_apiDomain}").join(this.state.apiDomain || `<YOUR_API_DOMAIN>`);
                        }
                        if (this.props.askForWebsiteDomain) {
                            c = c.split("^{form_websiteDomain}").join(this.state.websiteDomain|| `<YOUR_WEBSITE_DOMAIN>`);
                        }
                        if (this.state.showAPIBasePath) {
                            c = c.split("^{form_apiBasePath}").join(this.state.apiBasePath);
                        }
                        if (this.state.showAPIBasePath) {
                            c = c.split("^{form_apiBasePathForCallbacks}").join(this.state.apiBasePath !== "/" ? this.state.apiBasePath : "");
                        }
                        if (this.state.showWebsiteBasePath) {
                            c = c.split("^{form_websiteBasePath}").join(this.state.websiteBasePath);

                            c = c.split("^{form_websiteBasePath_withoutForwardSlash}").join(this.state.websiteBasePath.substring(1,this.state.websiteBasePath.length));
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
    }   

    renderForm() {
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
                    className="app-info-form-container-link"
                    style={{
                        fontSize: "14px",
                        fontWeight: 600,
                    }}
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
                    <FormItem
                        required
                        index={0}
                        title="Your app's name"
                        placeholder="e.g. My awesome App"
                        onChange={(value) => this.updateFieldStateAndRemoveError("appName", value)}
                        explanation="This is the name of your application"
                        value={this.state.appName}
                        error={this.state.fieldErrors.appName}
                    />
                    {/* show apiDomain field if it is not a NextJS form */}
                    {/* show apiDomain field if it is a nextJS form and the `nextJS api route used` checkbox is not checked */}
                    {(!this.props.showNextJSAPIRouteCheckbox || (this.props.showNextJSAPIRouteCheckbox && !this.state.nextJSApiRouteUsed))
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
                    <FormItem
                        index={3}
                        title="API Base Path"
                        placeholder="e.g. /auth"
                        onChange={(value) => this.updateFieldStateAndRemoveError("apiBasePath", value)}
                        explanation="SuperTokens will expose it's APIs scoped by this base API path."
                        value={this.state.apiBasePath}
                        error={this.state.fieldErrors.apiBasePath}
                    />
                    <FormItem
                        required
                        index={2}
                        title="Website Domain"
                        placeholder="e.g. http://localhost:3000"
                        onChange={(value) => this.updateFieldStateAndRemoveError("websiteDomain", value)}
                        explanation="This is the URL of your website."
                        value={this.state.websiteDomain}
                        error={this.state.fieldErrors.websiteDomain}
                    />
                    <FormItem
                        index={4}
                        title="Website Base Path"
                        placeholder="e.g. /auth"
                        onChange={(value) => this.updateFieldStateAndRemoveError("websiteBasePath", value)}
                        explanation="The path where the login UI will be rendered"
                        value={this.state.websiteBasePath}
                        error={this.state.fieldErrors.websiteBasePath}
                    />

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
                                I am using NextJS' <a target="_blank" rel="nofollow noopener noreferrer" href="https://nextjs.org/docs/api-routes/introduction">API route</a>
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
            const websiteDomain = this.getDomainOriginOrEmptyString(this.state.websiteDomain);
            let apiDomain = oldState.apiDomain;

            // if the nextjs route is set to true
            // then we set apiDomain to the same value as website domain
            if (this.props.showNextJSAPIRouteCheckbox && oldState.nextJSApiRouteUsed) {
                apiDomain = websiteDomain;
            } else {
                apiDomain = this.getDomainOriginOrEmptyString(this.state.apiDomain);
            }

            let apiBasePath = this.getNormalisedBasePath(this.state.apiBasePath.trim());

            // if the websiteBasePath is an empty string, we set it to the default value '/auth'
            let websiteBasePath = this.getNormalisedBasePath(this.state.websiteBasePath.trim());

            return {
                // TODO: Add more fields here.
                ...oldState,
                apiDomain,
                websiteDomain,
                apiBasePath,
                websiteBasePath,
                appName: this.state.appName.trim(),
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
                    appName: this.state.appName,
                    apiDomain: this.state.apiDomain,
                    websiteDomain: this.state.websiteDomain,
                    websiteBasePath: this.state.websiteBasePath,
                    apiBasePath: this.state.apiBasePath,
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
        if (appName.length === 0) {
            validationErrors.appName = "appName cannot be empty.";
        }

        // validate apiDomain field
        if ((!this.props.showNextJSAPIRouteCheckbox || (this.props.showNextJSAPIRouteCheckbox && !this.state.nextJSApiRouteUsed))) {
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
        if (websiteDomain.length > 0) {
            const error = this.validateDomain(websiteDomain, "websiteDomain", "websiteBasePath");
            if (error.length > 0) {
                validationErrors.websiteDomain = error;
            }
        } else {
            validationErrors.websiteDomain = "websiteDomain cannot be empty.";
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
    
        if (preventErrorUpdateInState && (!localFormDataParsed || localFormDataParsed.websiteBasePath === undefined)) {
            // we do this check in case the user has not submitted the form
            // in which case the base path fields will have the default '/auth'
            validationErrors.websiteBasePath = "Please enter a valid path.";
        } else if (!this.isBasePathValid(websiteBasePath)) {
            validationErrors.websiteBasePath = "Please enter a valid path."
        }

        if (this.state.showAPIBasePath && this.state.showWebsiteBasePath && !validationErrors.apiBasePath && !validationErrors.websiteBasePath) {
            const normalisedApiDomain = this.getDomainOriginOrEmptyString(apiDomain);
            const normalisedWebsiteDomain = this.getDomainOriginOrEmptyString(websiteDomain);
            const normalisedApiBasePath = this.getNormalisedBasePath(apiBasePath);
            const normalisedWebsiteBasePath = this.getNormalisedBasePath(websiteBasePath);

            const nextJSApiRouteUsed = this.props.showNextJSAPIRouteCheckbox && this.state.nextJSApiRouteUsed;
            const areNormalisedDomainsEqual = normalisedApiDomain === normalisedWebsiteDomain;

            const doNormalisedDomainsExist = normalisedApiDomain.length > 0 && normalisedWebsiteDomain.length > 0;

            if (doNormalisedDomainsExist && (nextJSApiRouteUsed || areNormalisedDomainsEqual)) {
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

    scrollToElement() {
        if (Boolean(this.containerRef.current)) {     
            let top = 0;

            if (this.containerRef.current !== undefined && this.containerRef.current !== null) {
                top = this.containerRef.current.getBoundingClientRect().top;
            }

            let navbarHeight = 0;
            let navbar = document.querySelector('nav.navbar');

            if (navbar !== undefined && navbar !== null) {
                navbarHeight = navbar.clientHeight;
            }
            
            const topPositionAfterNavbar = window.scrollY + top - navbarHeight;
            window.scrollTo({
                top: topPositionAfterNavbar,
                behavior: 'smooth'
            });
        }
    }

    private onReceiveAttribute(mutations: MutationRecord[]) {
        // listen event triggered by recheckCurrentFirstAppInfoForm()
        if (isReceivingFirstFormAttr(mutations)) {
            this.setState({ firstAppInfoForm: this.isFirstVisibleAppInfoForm() })
        }
        // listen event triggered by resubmitFirstAppInfoForm()
        if (isReceivingDisplayAttr(mutations)) {
            this.resubmitInfoClicked({scrollToElement: true});
        }
    }

    private isFirstVisibleAppInfoForm(): boolean {
        return Boolean(isElementVisible(this.containerRef.current) && isFirstAppInfoForm(`${this.elementId}`));
    }

    /**
     * Trigger rechecking on current first app info form
     ** This is to solve when there is form is inside a details element, 
     and then there is another form that share same parent with the details 
     */
    private recheckCurrentFirstAppInfoForm() {
        document.querySelectorAll(`.${CONTAINER_CLASSNAME}[${CONTAINER_ATTRIBUTE_FIRST_FORM}]`).forEach(element => {
            element.setAttribute(CONTAINER_ATTRIBUTE_FIRST_FORM, '');
        });
    }
}