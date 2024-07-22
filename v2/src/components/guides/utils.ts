export type FrontendChoice = "react" | "angular" | "vue" | "vanillajs" | "nextjs" | "remix" | "react-native" | "ios" | "android" | "flutter" | "capacitor" | undefined;

export type BackendChoice = "nodejs" | "golang" | "python" | "php" | "c#" | "java" | "nextjs" | "remix" | undefined;

export type AuthMethods = "emailpassword" | "thirdparty" | "passwordless" | "thirdpartyemailpassword" | "thirdpartypasswordless" | "all-auth" | "mfa" | "multi-tenant";

// export type FirstFactors = ("emailpassword" | "passwordless" | "thirdparty")[]

// export type SecondFactors = ("totp" | "otp-phone" | "otp-email")[]

export function getSelection(): {
    frontend: FrontendChoice,
    backend: BackendChoice,
    selectedAuthMethod: AuthMethods
} | undefined {
    if (typeof window !== "undefined") {
        let queryParams = new URLSearchParams(window.location.search);
        let selectionStr = queryParams.get("selection");
        if (selectionStr === null) {
            return undefined;
        }
        return JSON.parse(decodeURIComponent(selectionStr));
    } else {
        return undefined;
    }
}

export function isMFAEnabled(): boolean {
    const selection = getSelection();
    if (selection === undefined) {
        return false;
    }
    return selection.selectedAuthMethod === "mfa"
}