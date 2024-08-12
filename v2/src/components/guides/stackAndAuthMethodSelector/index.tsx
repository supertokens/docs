import * as React from "react";

import { useHistory } from "@docusaurus/router";
import {
  FrontendChoice,
  BackendChoice,
  AuthMethods,
  FRAMEWORKS_WITH_ONLY_CUSTOM_UI,
  BackendFramework,
  ApplicationServer,
  Selection,
} from "../utils";

import "./index.css";
// select frontend
// select backend
// select framework (if applicable)
// select auth method
// select custom UI (if applicable)

export default function StackAndAuthMethodSelector() {
  return (
    <div
      style={{
        paddingBottom: "40px",
      }}
    >
      <StackAndAuthMethodSelectorHelper />
    </div>
  );
}

// Outline
// Renamed wit-sdk to with-example-app
// We will not create tons of files. dynamic build time page creation
// How the no example app docs should work? we need code snippets
// We need a global context that holds context specific info (name of the sessionVerification method)
// TODO:
// - Fix edge cases. Right now the input works from top to bottom
// if people first select the auth method it will break
// - Add a status indicator of the selection state
// - Add a "View Guide" button on the sidebar
// - Remove combined auth methods and allow users to select multiple auth methods
// - Add icons for each list item
// - Remove bottom "next" button
// - Remove the left sidebar
export function StackAndAuthMethodSelectorHelper() {
  const history = useHistory();
  const [frontendChoice, setFrontendChoice] =
    React.useState<FrontendChoice>(undefined);

  const [backendChoice, setBackendChoice] =
    React.useState<BackendChoice>(undefined);

  const [backendFramework, setBackendFramework] = React.useState<
    BackendFramework | undefined
  >(undefined);

  const [selectedAuthMethod, setSelectedAuthMethod] = React.useState<
    AuthMethods | undefined
  >(undefined);

  const [applicationServer, setApplicationServer] = React.useState<
    ApplicationServer | undefined
  >(undefined);

  const [isCustomUI, setIsCustomUI] = React.useState<boolean | undefined>(
    undefined,
  );

  const handleFrontendChange = (frontend: FrontendChoice) => {
    setFrontendChoice(frontend);
    if (FRAMEWORKS_WITH_ONLY_CUSTOM_UI.includes(frontend)) {
      setIsCustomUI(true);
    }
  };

  const goToGuidePage = () => {
    if (!frontendChoice || !backendChoice || !selectedAuthMethod) {
      return;
    }

    const prefix = !applicationServer
      ? "with-example-app"
      : "without-example-app";
    const backend = applicationServer || backendChoice;
    const frameworkSuffix = backendFramework ? `-${backendFramework}` : "";
    const url = `/docs/guides/${prefix}/${frontendChoice}-${backend}${frameworkSuffix}?authMethod=${selectedAuthMethod}`;
    history.push(url);
  };

  const handleBackendChange = (
    backend: BackendChoice,
    backendFramework?: BackendFramework | undefined,
    applicationServer?: ApplicationServer | undefined,
  ) => {
    setBackendChoice(backend);
    setBackendFramework(backendFramework);
    setApplicationServer(applicationServer);
  };

  const handleAuthMethodChange = (authMethod: AuthMethods) => {
    // TODO: Check if this condition is correct
    const isUnsupportedMTAorMFA =
      (authMethod === "mfa" || authMethod === "multi-tenant") &&
      (backendChoice === "golang" || backendChoice === "python");

    const selection: Selection = {
      frontend: frontendChoice,
      backend: isUnsupportedMTAorMFA ? "nodejs" : backendChoice,
      backendFramework: isUnsupportedMTAorMFA ? "express" : backendFramework,
      selectedAuthMethod: authMethod,
      isCustomUI: false,
      applicationServer: isUnsupportedMTAorMFA
        ? backendChoice
        : applicationServer,
    };
    setSelectedAuthMethod(authMethod);
    setBackendChoice(selection.backend);
    setBackendFramework(selection.backendFramework);
    setApplicationServer(selection.applicationServer);
  };

  return (
    <div>
      <div>
        <p>
          For a set-by-step guide on how to integrate <b>SuperTokens</b> in your
          project, please select the the options based on your tech stack{" "}
        </p>
      </div>
      <div>
        <h3>Frontend Framework</h3>
        <ul className="toggle-grid-list">
          <li
            className="toggle-grid-list__item"
            onClick={() => handleFrontendChange("react")}
            data-selected={frontendChoice === "react"}
          >
            React
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleFrontendChange("angular")}
            data-selected={frontendChoice === "angular"}
          >
            Angular
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleFrontendChange("vue")}
            data-selected={frontendChoice === "vue"}
          >
            Vue
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleFrontendChange("vanillajs")}
            data-selected={frontendChoice === "vanillajs"}
          >
            Vanilla JS
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleFrontendChange("nextjs")}
            data-selected={frontendChoice === "nextjs"}
          >
            Next.js
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleFrontendChange("react-native")}
            data-selected={frontendChoice === "react-native"}
          >
            React Native
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleFrontendChange("ios")}
            data-selected={frontendChoice === "ios"}
          >
            iOS
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleFrontendChange("android")}
            data-selected={frontendChoice === "android"}
          >
            Android
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleFrontendChange("flutter")}
            data-selected={frontendChoice === "flutter"}
          >
            Flutter
          </li>
        </ul>
      </div>

      <div>
        <h3>Backend Technology</h3>
        <ul className="toggle-grid-list">
          <li
            className="toggle-grid-list__item"
            onClick={() => handleBackendChange("nodejs", "express")}
            data-selected={
              backendChoice === "nodejs" && backendFramework === "express"
            }
          >
            Node.js with Express
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleBackendChange("nodejs", "nestjs")}
            data-selected={
              backendChoice === "nodejs" && backendFramework === "nestjs"
            }
          >
            Node.js with NestJS
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleBackendChange("nodejs", "nodejs-other")}
            data-selected={
              backendChoice === "nodejs" && backendFramework === "nodejs-other"
            }
          >
            Node.js with Other Frameworks
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleBackendChange("nextjs")}
            data-selected={backendChoice === "nextjs"}
          >
            Next.js
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleBackendChange("golang", "http")}
            data-selected={
              backendChoice === "golang" && backendFramework === "http"
            }
          >
            Go
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleBackendChange("python", "flask")}
            data-selected={
              backendChoice === "python" && backendFramework === "flask"
            }
          >
            Python with Flask
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleBackendChange("python", "fastapi")}
            data-selected={
              backendChoice === "python" && backendFramework === "fastapi"
            }
          >
            Python with FastAPI
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleBackendChange("python", "drf")}
            data-selected={
              backendChoice === "python" && backendFramework === "drf"
            }
          >
            Python with Django
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleBackendChange("nodejs", undefined, "php")}
            data-selected={applicationServer === "php"}
          >
            PHP
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleBackendChange("nodejs", undefined, "c#")}
            data-selected={applicationServer === "c#"}
          >
            C#
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleBackendChange("nodejs", undefined, "java")}
            data-selected={applicationServer === "java"}
          >
            Java
          </li>
        </ul>
      </div>

      <div>
        <h3>Authentication Methods</h3>
        <ul className="toggle-grid-list">
          <li
            className="toggle-grid-list__item"
            onClick={() => handleAuthMethodChange("emailpassword")}
            data-selected={selectedAuthMethod === "emailpassword"}
          >
            Email/Password
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleAuthMethodChange("thirdparty")}
            data-selected={selectedAuthMethod === "thirdparty"}
          >
            Social/Enterprise
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleAuthMethodChange("passwordless")}
            data-selected={selectedAuthMethod === "passwordless"}
          >
            Passwordless (OTP/Magic link)
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleAuthMethodChange("thirdpartyemailpassword")}
            data-selected={selectedAuthMethod === "thirdpartyemailpassword"}
          >
            Email/Password and Social/Enterprise
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleAuthMethodChange("thirdpartypasswordless")}
            data-selected={selectedAuthMethod === "thirdpartypasswordless"}
          >
            Social/Enterpise and Passwordless
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleAuthMethodChange("all-auth")}
            data-selected={selectedAuthMethod === "all-auth"}
          >
            Email/Password, Social/Enterpise and Passwordless
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleAuthMethodChange("mfa")}
            data-selected={selectedAuthMethod === "mfa"}
          >
            Multi-Factor Authentication
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={() => handleAuthMethodChange("multi-tenant")}
            data-selected={selectedAuthMethod === "multi-tenant"}
          >
            Multi-Tenant Authentication
          </li>
        </ul>
      </div>
      <div className="submit-button-container">
        <button
          className="submit-button"
          onClick={goToGuidePage}
          disabled={!frontendChoice || !backendChoice || !selectedAuthMethod}
        >
          Open Guide
        </button>
      </div>
    </div>
  );
}
