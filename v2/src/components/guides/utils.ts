/**
 * 
 * If you are modifying the above to add or remove anything, be sure to modify:
 * - Selection type in this file
 * - ShowIfHasExampleApp.tsx
 * - IsMobileFrontend.tsx
 * - IsWebFrontend.tsx
 * - RenderAPIDomain.tsx
 * - RenderBackendConfigPath.tsx
 * - RenderDashboardRoute.tsx
 * - RenderWebsiteDomain.tsx
 */

export type FrontendChoice = "react" | "angular" | "vue" | "vanillajs" | "nextjs" | "remix" | "react-native" | "ios" | "android" | "flutter" | undefined;

export type BackendChoice = "nodejs" | "golang" | "python" | "nextjs" | "remix" | undefined;

export type BackendFramework = "express" | "nestjs" | "nodejs-other" | "flask" | "fastapi" | "drf" | "http" | "NA" | undefined

export type ApplicationServer = "golang" | "python" | "php" | "c#" | "java" | undefined;

export type AuthMethods = "emailpassword" | "thirdparty" | "passwordless" | "thirdpartyemailpassword" | "thirdpartypasswordless" | "all-auth" | "mfa" | "multi-tenant";

export const FRAMEWORKS_WITH_ONLY_CUSTOM_UI: FrontendChoice[] = ["vanillajs", "react-native", "ios", "android", "flutter"]

export type Selection = {
    frontend: FrontendChoice,
    backend: BackendChoice,
    selectedAuthMethod: AuthMethods,
    isCustomUI: boolean,
    backendFramework: BackendFramework
    applicationServer: ApplicationServer
}

export function getSelection(): Selection | undefined {
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