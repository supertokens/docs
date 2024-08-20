import React, { useCallback, useReducer, useState } from "react";

import { useHistory } from "@docusaurus/router";
import {
  Guide,
  GuideFrontendChoice,
  GuideBackendChoice,
  GuideBackendFrameworkChoice,
  GuideAuthMethodChoice,
  FrontendChoiceWithOnlyCustomUI,
  checkIfGuideHasExampleApp,
  WithoutExampleAppPathString,
  WithExampleAppPathString,
} from "./GuidePageContext";

import "./GuideForm.css";

// TODO:
// - Update sidebar items
export function GuideForm() {
  const history = useHistory();

  const [frontendChoice, setFrontendChoice] =
    useState<GuideFrontendChoice | null>(null);
  const [backendChoice, setBackendChoice] = useState<GuideBackendChoice | null>(
    null,
  );
  const [backendFrameworkChoice, setBackendFrameworkChoice] =
    useState<GuideBackendFrameworkChoice | null>(null);
  const [authMethodChoice, setAuthMethodChoice] =
    useState<GuideAuthMethodChoice | null>(null);
  const [withCustomUI, setWithCustomUI] = useState<boolean>(false);

  const onClickFrontendOption = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const frontend = e.currentTarget.dataset
        .frontendChoice as GuideFrontendChoice;
      if (!frontend) return;
      setFrontendChoice(frontend);
      if (FrontendChoiceWithOnlyCustomUI.includes(frontend))
        setWithCustomUI(true);
    },
    [],
  );
  const onClickBackendOption = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const backend = e.currentTarget.dataset
        .backendChoice as GuideBackendChoice;
      const backendFramework = e.currentTarget.dataset
        .backendFrameworkChoice as GuideBackendFrameworkChoice;
      if (!backend) return;
      setBackendChoice(backend);
      setBackendFrameworkChoice(backendFramework || null);
    },
    [],
  );
  const onClickAuthMethodOption = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const authMethod = e.currentTarget.dataset
        .authMethodChoice as GuideAuthMethodChoice;
      if (!authMethod) return;
      setAuthMethodChoice(authMethod);
    },
    [],
  );
  const onClickGoToGuidePage = useCallback(
    (e) => {
      e.preventDefault();
      if (!frontendChoice || !backendChoice || !authMethodChoice) {
        return;
      }
      const guide: Guide = {
        frontend: frontendChoice,
        backend: backendChoice,
        backendFramework: backendFrameworkChoice,
        authMethod: authMethodChoice,
        withCustomUI,
      };

      const prefix = !checkIfGuideHasExampleApp(guide)
        ? WithoutExampleAppPathString
        : WithExampleAppPathString;
      const frameworkSuffix = backendFrameworkChoice
        ? `-${backendFrameworkChoice}`
        : "";
      const url = `/docs/guides/${prefix}/${frontendChoice}-${backendChoice}${frameworkSuffix}?authMethod=${authMethodChoice}`;
      history.push(url);
    },
    [frontendChoice, backendChoice, backendFrameworkChoice, authMethodChoice],
  );

  return (
    <form onSubmit={onClickGoToGuidePage}>
      <div>
        <h3>Frontend Framework</h3>
        <ul className="toggle-grid-list">
          <li
            className="toggle-grid-list__item"
            onClick={onClickFrontendOption}
            data-frontend-choice="react"
            data-selected={frontendChoice === "react"}
          >
            <img src="/img/logos/react.svg" alt="React logo" width="30px" />
            React
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickFrontendOption}
            data-frontend-choice="angular"
            data-selected={frontendChoice === "angular"}
          >
            <img src="/img/logos/angular.svg" alt="Angular logo" width="30px" />
            Angular
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickFrontendOption}
            data-frontend-choice="vue"
            data-selected={frontendChoice === "vue"}
          >
            <img src="/img/logos/vue.svg" alt="Vue logo" width="30px" />
            Vue
          </li>
          {/* <li */}
          {/*   className="toggle-grid-list__item" */}
          {/*   onClick={onClickFrontendOption} */}
          {/*   data-frontend-choice="vanillajs" */}
          {/*   data-selected={frontendChoice === "vanillajs"} */}
          {/* > */}
          {/*   <img */}
          {/*     src="/img/logos/vanillajs.svg" */}
          {/*     alt="Vanilla JS logo" */}
          {/*     width="30px" */}
          {/*   /> */}
          {/*   Vanilla JS */}
          {/* </li> */}
          <li
            className="toggle-grid-list__item"
            onClick={onClickFrontendOption}
            data-frontend-choice="nextjs"
            data-selected={frontendChoice === "nextjs"}
          >
            <img
              src="/img/logos/next-logo.png"
              alt="Next.js logo"
              width="30px"
            />
            Next.js
          </li>
          {/* <li */}
          {/*   className="toggle-grid-list__item" */}
          {/*   onClick={onClickFrontendOption} */}
          {/*   data-frontend-choice="react-native" */}
          {/*   data-selected={frontendChoice === "react-native"} */}
          {/* > */}
          {/*   <img */}
          {/*     src="/img/logos/react-native.svg" */}
          {/*     alt="React Native logo" */}
          {/*     width="30px" */}
          {/*   /> */}
          {/*   React Native */}
          {/* </li> */}
          {/* <li */}
          {/*   className="toggle-grid-list__item" */}
          {/*   onClick={onClickFrontendOption} */}
          {/*   data-frontend-choice="ios" */}
          {/*   data-selected={frontendChoice === "ios"} */}
          {/* > */}
          {/*   <img src="/img/logos/ios.svg" alt="iOS logo" width="30px" /> */}
          {/*   iOS */}
          {/* </li> */}
          {/* <li */}
          {/*   className="toggle-grid-list__item" */}
          {/*   onClick={onClickFrontendOption} */}
          {/*   data-frontend-choice="android" */}
          {/*   data-selected={frontendChoice === "android"} */}
          {/* > */}
          {/*   <img src="/img/logos/android.svg" alt="Android logo" width="30px" /> */}
          {/*   Android */}
          {/* </li> */}
          {/* <li */}
          {/*   className="toggle-grid-list__item" */}
          {/*   onClick={onClickFrontendOption} */}
          {/*   data-frontend-choice="flutter" */}
          {/*   data-selected={frontendChoice === "flutter"} */}
          {/* > */}
          {/*   <img src="/img/logos/flutter.svg" alt="Flutter logo" width="30px" /> */}
          {/*   Flutter */}
          {/* </li> */}
        </ul>
      </div>

      <div>
        <h3>Backend Technology</h3>
        <ul className="toggle-grid-list">
          <li
            className="toggle-grid-list__item"
            onClick={onClickBackendOption}
            data-backend-framework-choice="express"
            data-backend-choice="nodejs"
            data-selected={
              backendChoice === "nodejs" && backendFrameworkChoice === "express"
            }
          >
            <img src="/img/logos/node.svg" alt="Nodejs logo" width="30px" />
            Node.js with Express
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickBackendOption}
            data-backend-framework-choice="nestjs"
            data-backend-choice="nodejs"
            data-selected={
              backendChoice === "nodejs" && backendFrameworkChoice === "nestjs"
            }
          >
            <img
              src="/img/logos/nest-logo.svg"
              alt="Nestjs logo"
              width="30px"
            />
            Node.js with NestJS
          </li>
          {/* <li */}
          {/*   className="toggle-grid-list__item" */}
          {/*   onClick={onClickBackendOption} */}
          {/*   data-backend-framework-choice="nodejs-other" */}
          {/*   data-backend-choice="nodejs" */}
          {/*   data-selected={ */}
          {/*     backendChoice === "nodejs" && */}
          {/*     backendFrameworkChoice === "nodejs-other" */}
          {/*   } */}
          {/* > */}
          {/*   <img src="/img/logos/node.svg" alt="Nodejs logo" width="30px" /> */}
          {/*   Node.js with Other Frameworks */}
          {/* </li> */}
          <li
            className="toggle-grid-list__item"
            onClick={onClickBackendOption}
            data-backend-choice="nextjs"
            data-selected={backendChoice === "nextjs"}
          >
            <img
              src="/img/logos/next-logo.png"
              alt="Nextjs logo"
              width="30px"
            />
            Next.js
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickBackendOption}
            data-backend-framework-choice="http"
            data-backend-choice="golang"
            data-selected={
              backendChoice === "golang" && backendFrameworkChoice === "http"
            }
          >
            <img src="/img/logos/go.svg" alt="Golang logo" width="30px" />
            Go
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickBackendOption}
            data-backend-framework-choice="flask"
            data-backend-choice="python"
            data-selected={
              backendChoice === "python" && backendFrameworkChoice === "flask"
            }
          >
            <img src="/img/logos/python.svg" alt="Flask logo" width="30px" />
            Python with Flask
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickBackendOption}
            data-backend-framework-choice="fastapi"
            data-backend-choice="python"
            data-selected={
              backendChoice === "python" && backendFrameworkChoice === "fastapi"
            }
          >
            <img src="/img/logos/python.svg" alt="Python logo" width="30px" />
            Python with FastAPI
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickBackendOption}
            data-backend-framework-choice="django"
            data-backend-choice="python"
            data-selected={
              backendChoice === "python" && backendFrameworkChoice === "django"
            }
          >
            <img src="/img/logos/python.svg" alt="Django logo" width="30px" />
            Python with Django
          </li>
          {/* <li */}
          {/*   className="toggle-grid-list__item" */}
          {/*   onClick={onClickBackendOption} */}
          {/*   data-backend-choice="php" */}
          {/*   data-selected={backendChoice === "php"} */}
          {/* > */}
          {/*   <img src="/img/logos/php.svg" alt="PHP logo" width="30px" /> */}
          {/*   PHP */}
          {/* </li> */}
          {/* <li */}
          {/*   className="toggle-grid-list__item" */}
          {/*   onClick={onClickBackendOption} */}
          {/*   data-backend-choice="c#" */}
          {/*   data-selected={backendChoice === "csharp"} */}
          {/* > */}
          {/*   <img src="/img/logos/csharp.svg" alt="C# logo" width="30px" /> */}
          {/*   C# */}
          {/* </li> */}
          {/* <li */}
          {/*   className="toggle-grid-list__item" */}
          {/*   onClick={onClickBackendOption} */}
          {/*   data-backend-choice="java" */}
          {/*   data-selected={backendChoice === "java"} */}
          {/* > */}
          {/*   <img src="/img/logos/java.svg" alt="Java logo" width="30px" /> */}
          {/*   Java */}
          {/* </li> */}
        </ul>
      </div>

      <div>
        <h3>Authentication Methods</h3>
        <ul className="toggle-grid-list">
          <li
            className="toggle-grid-list__item"
            onClick={onClickAuthMethodOption}
            data-auth-method-choice="emailpassword"
            data-selected={authMethodChoice === "emailpassword"}
          >
            <img
              src="/img/guides/emailPass.svg"
              alt="Recipe logo"
              width="30px"
            />
            Email/Password
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickAuthMethodOption}
            data-auth-method-choice="thirdparty"
            data-selected={authMethodChoice === "thirdparty"}
          >
            <img src="/img/guides/social.svg" alt="Recipe logo" width="30px" />
            Social/Enterprise
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickAuthMethodOption}
            data-auth-method-choice="passwordless"
            data-selected={authMethodChoice === "passwordless"}
          >
            <img
              src="/img/guides/passwordless.svg"
              alt="Passwordless logo"
              width="30px"
            />
            Passwordless (OTP/Magic link)
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickAuthMethodOption}
            data-auth-method-choice="thirdpartyemailpassword"
            data-selected={authMethodChoice === "thirdpartyemailpassword"}
          >
            <img
              src="/img/guides/emailPassPlusSocial.svg"
              alt="EmailPassPlusSocial logo"
              width="30px"
            />
            Email/Password and Social/Enterprise
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickAuthMethodOption}
            data-auth-method-choice="thirdpartypasswordless"
            data-selected={authMethodChoice === "thirdpartypasswordless"}
          >
            <img
              src="/img/guides/passLessSocial.svg"
              alt="Recipe logo"
              width="30px"
            />
            Social/Enterpise and Passwordless
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickAuthMethodOption}
            data-auth-method-choice="all-auth"
            data-selected={authMethodChoice === "all-auth"}
          >
            {/* <img src="/img/guides/node.svg" alt="Nodejs logo" width="30px" /> */}
            Email/Password, Social/Enterpise and Passwordless
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickAuthMethodOption}
            data-auth-method-choice="mfa"
            data-selected={authMethodChoice === "mfa"}
          >
            <img src="/img/guides/MFA.svg" alt="MFA logo" width="30px" />
            Multi-Factor Authentication
          </li>
          <li
            className="toggle-grid-list__item"
            onClick={onClickAuthMethodOption}
            data-auth-method-choice="multi-tenant"
            data-selected={authMethodChoice === "multi-tenant"}
          >
            <img
              src="/img/guides/multitenancy.svg"
              alt="Multitenancy logo"
              width="30px"
            />
            Multi-Tenant Authentication
          </li>
        </ul>
      </div>
      <div className="submit-button-container">
        <button
          className="submit-button"
          type="submit"
          disabled={!frontendChoice || !backendChoice || !authMethodChoice}
        >
          View Guide
        </button>
      </div>
    </form>
  );
}
