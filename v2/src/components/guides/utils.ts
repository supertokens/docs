export type FrontendChoice = "react" | "angular" | "vue" | "vanillajs" | "nextjs" | "remix" | "react-native" | "ios" | "android" | "flutter" | undefined;

export type BackendChoice = "nodejs" | "golang" | "python" | "php" | "c#" | "java" | "nextjs" | "remix" | undefined;

export type BackendFramework = "express" | "flask" | "fastapi" | "drf" | "http"

export type AuthMethods = "emailpassword" | "thirdparty" | "passwordless" | "thirdpartyemailpassword" | "thirdpartypasswordless" | "all-auth" | "mfa" | "multi-tenant";

export const FRAMEWORKS_WITH_ONLY_CUSTOM_UI: FrontendChoice[] = ["vanillajs", "react-native", "ios", "android", "flutter"]

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