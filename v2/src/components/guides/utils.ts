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
    for (let tenant of selection.tenants) {
        if (tenant.secondFactors.length > 0) {
            return true;
        }
    }
    return false;
}