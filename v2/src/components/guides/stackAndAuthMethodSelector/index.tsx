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

// TODO:
// - Fix edge cases. Right now the input works from top to bottom
// if people first select the auth method it will break
// - Improve the look an feel of the UI
// - Add a status indicator of the selection state
// - Add icons for each list item
// - Remove the right sidebar to make sure that each list item does not overflow
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

  const goToGuidePageIfReady = (selection: Selection) => {
    if (
      !selection.frontend ||
      !selection.backend ||
      !selection.selectedAuthMethod
    ) {
      return;
    }

    const prefix = !selection.applicationServer
      ? "with-example-app"
      : "without-example-app";
    const backend = selection.applicationServer || selection.backend;
    const frameworkSuffix = selection.backendFramework
      ? `-${selection.backendFramework}`
      : "";
    const url = `/docs/guides/${prefix}/${frontendChoice}-${backend}${frameworkSuffix}?authMethod=${selection.selectedAuthMethod}`;
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

    goToGuidePageIfReady(selection);
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
            Next.js API
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
    </div>
  );
}

function StartGuide(props: Selection) {
  return (
    <button
      onClick={() => {
        let queryValue = encodeURIComponent(JSON.stringify(props));
        const url = `/docs/guides/selection-tutorial?selection=${queryValue}`;
        window.open(url, "_blank");
      }}
      style={{
        backgroundColor: "#FF9800",
        color: "white",
        padding: "0.8rem 1.5rem",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "1px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#F57C00";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#FF9800";
      }}
    >
      Start Guide
    </button>
  );
}

// function AddNewTenantUI(props: {
//     addNewTenant: (tenantId: string, firstFactors: FirstFactors, secondFactors: SecondFactors) => void
// }) {
//     const [isAddingTenant, setIsAddingTenant] = React.useState<boolean>(false);
//     const [tenantId, setTenantId] = React.useState<string>("");

//     if (!isAddingTenant) {
//         return (
//             <button
//                 onClick={() => setIsAddingTenant(true)}
//                 style={{
//                     backgroundColor: '#FF9800',
//                     color: 'white',
//                     padding: '0.8rem 1.5rem',
//                     border: 'none',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                     fontSize: '1rem',
//                     fontWeight: 'bold',
//                     textTransform: 'uppercase',
//                     letterSpacing: '1px',
//                     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                     transition: 'background-color 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F57C00'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
//             >
//                 Add New Tenant / Org
//             </button>
//         );
//     } else {
//         return (
//             <div style={{ border: '2px solid #FF9800', padding: '1.5rem', borderRadius: '10px', marginTop: '1.5rem' }}>
//                 <div style={{ color: '#FF9800', fontWeight: 'bold', fontSize: '1.2rem' }}>Tenant / Org name:</div>
//                 <input
//                     type="text"
//                     value={tenantId}
//                     onChange={(e) => setTenantId(e.target.value)}
//                     style={{
//                         backgroundColor: '#424242',
//                         color: 'white',
//                         padding: '0.8rem',
//                         border: 'none',
//                         borderRadius: '5px',
//                         outline: 'none',
//                         width: '100%',
//                         fontSize: '1rem',
//                         marginTop: '0.5rem',
//                     }}
//                 />

//                 <FirstAndSecondFactorChoice
//                     setFactors={(f, s) => {
//                         props.addNewTenant(tenantId, f, s);
//                         setIsAddingTenant(false);
//                         setTenantId("");
//                     }}
//                 />
//             </div>
//         )
//     }
// }

// function FirstAndSecondFactorChoice(props: {
//     setFactors: (firstFactors: FirstFactors, secondFactors: SecondFactors) => void,
// }) {
//     const [firstFactors, setFirstFactors] = React.useState<FirstFactors>([]);
//     const [firstFactorSelectionCompleted, setFirstFactorSelectionCompleted] = React.useState<boolean>(false);
//     const [secondFactors, setSecondFactors] = React.useState<SecondFactors>([]);
//     const [secondFactorSelectionCompleted, setSecondFactorSelectionCompleted] = React.useState<boolean>(false);

//     const handleFirstFactorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const value = event.target.value as FirstFactors[number];
//         setFirstFactors(prev =>
//             event.target.checked
//                 ? [...prev, value]
//                 : prev.filter(method => method !== value)
//         );
//     };

//     const handleSecondFactorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const value = event.target.value as SecondFactors[number];
//         setSecondFactors(prev =>
//             event.target.checked
//                 ? [...prev, value]
//                 : prev.filter(method => method !== value)
//         );
//     };

//     if (!firstFactorSelectionCompleted) {
//         return (
//             <div style={{ border: '2px solid #FF9800', padding: '1.5rem', borderRadius: '10px', marginTop: '1.5rem' }}>
//                 <label style={{ color: '#FF9800', fontWeight: 'bold', fontSize: '1.2rem' }}>Please select your first factor auth methods:</label>
//                 <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
//                     <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem', fontSize: '1rem', color: 'white' }}>
//                         <input
//                             type="checkbox"
//                             value="emailpassword"
//                             checked={firstFactors.includes("emailpassword")}
//                             onChange={handleFirstFactorChange}
//                             style={{ marginRight: '0.8rem' }}
//                         />
//                         Email & Password
//                     </label>
//                     <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem', fontSize: '1rem', color: 'white' }}>
//                         <input
//                             type="checkbox"
//                             value="passwordless"
//                             checked={firstFactors.includes("passwordless")}
//                             onChange={handleFirstFactorChange}
//                             style={{ marginRight: '0.8rem' }}
//                         />
//                         Passwordless
//                     </label>
//                     <label style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', color: 'white' }}>
//                         <input
//                             type="checkbox"
//                             value="thirdparty"
//                             checked={firstFactors.includes("thirdparty")}
//                             onChange={handleFirstFactorChange}
//                             style={{ marginRight: '0.8rem' }}
//                         />
//                         Third-party
//                     </label>
//                 </div>
//                 <button
//                     disabled={firstFactors.length === 0}
//                     onClick={() => {
//                         setFirstFactorSelectionCompleted(true)
//                     }}
//                     style={{
//                         backgroundColor: firstFactors.length === 0 ? '#9E9E9E' : '#FF9800',
//                         color: 'white',
//                         padding: '0.8rem 1.5rem',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: firstFactors.length === 0 ? 'not-allowed' : 'pointer',
//                         fontSize: '1rem',
//                         fontWeight: 'bold',
//                         textTransform: 'uppercase',
//                         letterSpacing: '1px',
//                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                         transition: 'background-color 0.3s ease',
//                         marginTop: '1.5rem',
//                     }}
//                     onMouseEnter={(e) => {
//                         if (firstFactors.length > 0) {
//                             e.currentTarget.style.backgroundColor = '#F57C00';
//                         }
//                     }}
//                     onMouseLeave={(e) => {
//                         if (firstFactors.length > 0) {
//                             e.currentTarget.style.backgroundColor = '#FF9800';
//                         }
//                     }}
//                 >
//                     Next
//                 </button>
//             </div>
//         );
//     }

//     if (!secondFactorSelectionCompleted) {
//         return (
//             <div style={{ border: '2px solid #FF9800', padding: '1.5rem', borderRadius: '10px', marginTop: '1.5rem' }}>
//                 <label style={{ color: '#FF9800', fontWeight: 'bold', fontSize: '1.2rem' }}>Please select your second factor auth methods:</label>
//                 <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
//                     <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem', fontSize: '1rem', color: 'white' }}>
//                         <input
//                             type="checkbox"
//                             value="totp"
//                             checked={secondFactors.includes("totp")}
//                             onChange={handleSecondFactorChange}
//                             style={{ marginRight: '0.8rem' }}
//                         />
//                         TOTP
//                     </label>
//                     <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem', fontSize: '1rem', color: 'white' }}>
//                         <input
//                             type="checkbox"
//                             value="otp-phone"
//                             checked={secondFactors.includes("otp-phone")}
//                             onChange={handleSecondFactorChange}
//                             style={{ marginRight: '0.8rem' }}
//                         />
//                         SMS OTP
//                     </label>
//                     <label style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', color: 'white' }}>
//                         <input
//                             type="checkbox"
//                             value="otp-email"
//                             checked={secondFactors.includes("otp-email")}
//                             onChange={handleSecondFactorChange}
//                             style={{ marginRight: '0.8rem' }}
//                         />
//                         Email OTP
//                     </label>
//                 </div>
//                 <button
//                     onClick={() => {
//                         setSecondFactorSelectionCompleted(true)
//                         props.setFactors(firstFactors, secondFactors);
//                     }}
//                     style={{
//                         backgroundColor: '#FF9800',
//                         color: 'white',
//                         padding: '0.8rem 1.5rem',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: 'pointer',
//                         fontSize: '1rem',
//                         fontWeight: 'bold',
//                         textTransform: 'uppercase',
//                         letterSpacing: '1px',
//                         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//                         transition: 'background-color 0.3s ease',
//                         marginTop: '1.5rem',
//                     }}
//                     onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F57C00'}
//                     onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9800'}
//                 >
//                     {secondFactors.length === 0 ? "Skip" : "Next"}
//                 </button>
//             </div>
//         );
//     }

//     return null;
// }
