import 'url-search-params-polyfill'; // this is there to polyfill URLSearchParams for SSR otherwise production build fails.

export type FrontendChoice = "react" | "angular" | "vue" | "vanillajs" | "nextjs" | "remix" | "react-native" | "ios" | "android" | "flutter" | undefined;

export type BackendChoice = "nodejs" | "golang" | "python" | "php" | "c#" | "java" | "nextjs" | "remix" | undefined;

export type FirstFactors = ("emailpassword" | "passwordless" | "thirdparty")[]

export type SecondFactors = ("totp" | "otp-phone" | "otp-email")[]

export function getSelection(): {
    frontend: FrontendChoice,
    backend: BackendChoice,
    tenants: ({
        tenantId: string,
        firstFactors: FirstFactors,
        secondFactors: SecondFactors
    })[]
} | undefined {
    let queryParams = new URLSearchParams(window.location.search);
    let selectionStr = queryParams.get("selection");
    if (selectionStr === null) {
        return undefined;
    }
    return JSON.parse(decodeURIComponent(selectionStr));
}

export function isMFAEnabled(): boolean {
    const selection = getSelection();
    if (selection === undefined) {
        return false;
    }
    for (let tenant of selection.tenants) {
        if (tenant.secondFactors.length > 0) {
            return true;
        }
    }
    return false;
}