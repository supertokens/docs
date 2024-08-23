import React, { useMemo } from "react";
import { useLocation, Redirect } from "@docusaurus/router";

export type GuideFrontendChoice =
  | "react"
  | "angular"
  | "vue"
  | "nextjs"
  | "vanillajs"
  | "react-native"
  | "ios"
  | "android"
  | "flutter";
export type GuideBackendChoice =
  | "nodejs"
  | "golang"
  | "python"
  | "nextjs"
  | "php"
  | "csharp"
  | "java";
export type GuideBackendFrameworkChoice =
  | "express"
  | "nestjs"
  | "nodejs-other"
  | "flask"
  | "fastapi"
  | "django"
  | "http";
export type GuideAuthMethodChoice =
  | "emailpassword"
  | "thirdparty"
  | "passwordless"
  | "thirdpartypasswordless"
  | "thirdpartyemailpassword"
  | "all-auth"
  | "mfa"
  | "multi-tenant";

export interface Guide {
  frontend: GuideFrontendChoice;
  backend: GuideBackendChoice;
  backendFramework: GuideBackendFrameworkChoice | null;
  authMethod: GuideAuthMethodChoice;
  withCustomUI: boolean;
}

export type GuidePageContextType = {
  guide: Guide;
  hasExampleApp: boolean;
};

export const GuidePageContext = React.createContext<GuidePageContextType>(
  {} as GuidePageContextType,
);

export const WithExampleAppPathString = "with-example-app";
export const WithoutExampleAppPathString = "without-example-app";

export const GuidePageContextProvider: React.FC = ({ children }) => {
  const location = useLocation();

  const guide = useMemo<Guide | null>(() => {
    const splitPathname = location.pathname.split("/");
    const withExampleAppString = splitPathname[3];
    const techStackString = splitPathname[4];

    if (location.pathname.startsWith("/docs/guides/blocks")) return null;
    if (!techStackString || !withExampleAppString) return null;
    if (withExampleAppString !== WithExampleAppPathString) return null;

    let [frontend, backend, backendFramework]: [
      GuideFrontendChoice,
      GuideBackendChoice,
      GuideBackendFrameworkChoice,
    ] = techStackString.split("-");

    if (techStackString === "nextjs") {
      frontend = "nextjs";
      backend = "nextjs";
    }

    if (
      !frontend ||
      !backend ||
      !isGuideFrontendChoice(frontend) ||
      !isBackendChoice(backend)
    )
      return null;

    let authMethod;
    if (URLSearchParams) {
      const searchParam = new URLSearchParams(location.search);
      authMethod = searchParam.get("authMethod") as GuideAuthMethodChoice;
    }

    if (!authMethod || !isAuthMethodChoice(authMethod))
      authMethod = "emailpassword";

    return {
      frontend,
      backend,
      backendFramework: backendFramework || null,
      authMethod,
      withCustomUI: searchParam.get("customUI") === "true",
    };
  }, [location]);
  const hasExampleApp = useMemo(() => {
    if (!guide) return false;
    return checkIfGuideHasExampleApp(guide);
  }, [guide]);

  if (!guide) {
    // throw new Error("Invalid guide path");
    return <Redirect to="/404" />;
  }

  return (
    <GuidePageContext.Provider value={{ guide, hasExampleApp }}>
      {children}
    </GuidePageContext.Provider>
  );
};

export function isGuideFrontendChoice(
  value: string,
): value is GuideFrontendChoice {
  const validChoices: GuideFrontendChoice[] = [
    "react",
    "angular",
    "vue",
    "nextjs",
    "vanillajs",
    "react-native",
    "ios",
    "android",
    "flutter",
  ];

  return validChoices.includes(value as GuideFrontendChoice);
}

export function isBackendChoice(value: string): value is GuideBackendChoice {
  const validChoices: GuideBackendChoice[] = [
    "nodejs",
    "golang",
    "python",
    "nextjs",
    "php",
    "csharp",
    "java",
  ];

  return validChoices.includes(value as GuideBackendChoice);
}

export function isAuthMethodChoice(
  value: string,
): value is GuideAuthMethodChoice {
  const validChoices: GuideAuthMethodChoice[] = [
    "emailpassword",
    "thirdparty",
    "passwordless",
    "thirdpartypasswordless",
    "thirdpartyemailpassword",
    "all-auth",
    "mfa",
    "multi-tenant",
  ];

  return validChoices.includes(value as GuideAuthMethodChoice);
}

const FrontedChoicesWithExampleApp: GuideFrontendChoice[] = [
  "react",
  "angular",
  "vue",
  "nextjs",
];
export const FrontendChoiceWithOnlyCustomUI: GuideFrontendChoice[] = [
  "vanillajs",
  "react-native",
  "ios",
  "android",
  "flutter",
];
export const MobileFrontendChoices: GuideFrontendChoice[] = [
  "react-native",
  "ios",
  "android",
  "flutter",
];
const BackendChoicesWithExampleApp: GuideBackendChoice[] = [
  "nodejs",
  "golang",
  "python",
  "nextjs",
];
const BackendFrameworkChoicesWithExampleApp: GuideBackendFrameworkChoice[] = [
  "express",
  "nestjs",
  "flask",
  "fastapi",
  "django",
  "http",
];
const BackendChoiceWithoutSupportForMtaOrMfa: GuideBackendChoice[] = [
  "golang",
  "python",
];

export function checkIfGuideHasExampleApp(guide: Guide) {
  if (
    !FrontedChoicesWithExampleApp.includes(guide.frontend) ||
    !BackendChoicesWithExampleApp.includes(guide.backend) ||
    (guide.backendFramework !== null &&
      !BackendFrameworkChoicesWithExampleApp.includes(guide.backendFramework))
  ) {
    return false;
  }

  const isMtaOrMfa =
    guide.authMethod === "mfa" || guide.authMethod === "multi-tenant";

  return !(
    isMtaOrMfa && BackendChoiceWithoutSupportForMtaOrMfa.includes(guide.backend)
  );
}
