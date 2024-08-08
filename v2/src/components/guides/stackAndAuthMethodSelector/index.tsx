import * as React from "react";
import {
  FrontendChoice,
  BackendChoice,
  AuthMethods,
  FRAMEWORKS_WITH_ONLY_CUSTOM_UI,
  BackendFramework,
  ApplicationServer,
  Selection,
} from "../utils";

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

export function StackAndAuthMethodSelectorHelper() {
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

  // const [tenants, setTenants] = React.useState<({
  //     tenantId: string,
  //     firstFactors: FirstFactors,
  //     secondFactors: SecondFactors
  // })[]>([]);

  const handleFrontendChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    let frontend = event.target.value as FrontendChoice;
    setFrontendChoice(frontend);
    if (FRAMEWORKS_WITH_ONLY_CUSTOM_UI.includes(frontend)) {
      setIsCustomUI(true);
    }
  };

  const handleBackendChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const backend = event.target.value;
    if (backend === "nodejs") {
      setBackendChoice(backend);
      setBackendFramework(undefined);
    } else if (backend === "golang") {
      setBackendChoice(backend);
      setBackendFramework("http");
    } else if (backend === "python") {
      setBackendChoice(backend);
      setBackendFramework(undefined);
    } else if (backend === "nextjs" || backend === "remix") {
      setBackendChoice(backend);
      setBackendFramework("NA");
    } else {
      setBackendChoice("nodejs");
      setBackendFramework("express");
      setApplicationServer(backend as ApplicationServer);
    }
  };

  const handleBackendFrameworkChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setBackendFramework(event.target.value as BackendFramework);
  };

  const handleAuthMethodChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    let authMethod = event.target.value as AuthMethods;
    if (
      (authMethod === "mfa" && backendChoice === "golang") ||
      backendChoice === "python"
    ) {
      setApplicationServer(backendChoice);
      setBackendChoice("nodejs");
      setBackendFramework("express");
    }
    setSelectedAuthMethod(authMethod);
  };

  if (frontendChoice === undefined) {
    return (
      <div
        style={{
          backgroundColor: "#1E1E1E",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <label
          htmlFor="frontendChoice"
          style={{ color: "#FF9800", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          1) Please select which frontend you use:
        </label>
        <div style={{ margin: "1rem 0" }} />
        <select
          id="frontendChoice"
          value={frontendChoice === undefined ? "" : frontendChoice}
          onChange={handleFrontendChange}
          style={{
            backgroundColor: "#424242",
            color: "white",
            padding: "0.8rem",
            border: "none",
            borderRadius: "5px",
            outline: "none",
            width: "100%",
            fontSize: "1rem",
          }}
        >
          <option value="">--Select an option--</option>
          <option value="react">React</option>
          <option value="angular">Angular</option>
          <option value="vue">Vue</option>
          <option value="vanillajs">Vanilla JS</option>
          <option value="nextjs">Next.js</option>
          <option value="react-native">React Native</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
          <option value="flutter">Flutter</option>
        </select>
      </div>
    );
  }

  if (backendChoice === undefined) {
    return (
      <div
        style={{
          backgroundColor: "#1E1E1E",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <label
          htmlFor="backendChoice"
          style={{ color: "#FF9800", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          2) Please select which backend you use:
        </label>
        <div style={{ margin: "1rem 0" }} />
        <select
          id="backendChoice"
          value={backendChoice === undefined ? "" : backendChoice}
          onChange={handleBackendChange}
          style={{
            backgroundColor: "#424242",
            color: "white",
            padding: "0.8rem",
            border: "none",
            borderRadius: "5px",
            outline: "none",
            width: "100%",
            fontSize: "1rem",
          }}
        >
          <option value="">--Select an option--</option>
          <option value="nodejs">Node.js</option>
          <option value="nextjs">Next.js API</option>
          <option value="remix">Remix API</option>
          <option value="golang">Go</option>
          <option value="python">Python</option>
          <option value="php">PHP</option>
          <option value="c#">C#</option>
          <option value="java">Java</option>
        </select>
      </div>
    );
  }

  if (backendChoice === "python" && backendFramework === undefined) {
    return (
      <div
        style={{
          backgroundColor: "#1E1E1E",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <label
          htmlFor="backendFramework"
          style={{ color: "#FF9800", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          3) Which backend framework do you use?
        </label>
        <div style={{ margin: "1rem 0" }} />
        <select
          id="backendFramework"
          value={backendFramework === undefined ? "" : backendFramework}
          onChange={handleBackendFrameworkChange}
          style={{
            backgroundColor: "#424242",
            color: "white",
            padding: "0.8rem",
            border: "none",
            borderRadius: "5px",
            outline: "none",
            width: "100%",
            fontSize: "1rem",
          }}
        >
          <option value="">--Select an option--</option>
          <option value="flask">Flask</option>
          <option value="fastapi">FastAPI</option>
          <option value="drf">Django Rest Framework</option>
        </select>
      </div>
    );
  }

  if (backendChoice === "nodejs" && backendFramework === undefined) {
    return (
      <div
        style={{
          backgroundColor: "#1E1E1E",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <label
          htmlFor="backendFramework"
          style={{ color: "#FF9800", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          3) Which backend framework do you use?
        </label>
        <div style={{ margin: "1rem 0" }} />
        <select
          id="backendFramework"
          value={backendFramework === undefined ? "" : backendFramework}
          onChange={handleBackendFrameworkChange}
          style={{
            backgroundColor: "#424242",
            color: "white",
            padding: "0.8rem",
            border: "none",
            borderRadius: "5px",
            outline: "none",
            width: "100%",
            fontSize: "1rem",
          }}
        >
          <option value="">--Select an option--</option>
          <option value="express">Express</option>
          <option value="nestjs">Nest.JS</option>
          <option value="nodejs-other">Other</option>
        </select>
      </div>
    );
  }

  if (selectedAuthMethod === undefined) {
    return (
      <div
        style={{
          backgroundColor: "#1E1E1E",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <label
          htmlFor="authMethod"
          style={{ color: "#FF9800", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          {backendChoice === "python" || backendChoice === "nodejs" ? "4" : "3"}
          ) Please select auth method:
        </label>
        <div style={{ margin: "1rem 0" }} />
        <select
          id="authMethod"
          value={selectedAuthMethod === undefined ? "" : selectedAuthMethod}
          onChange={handleAuthMethodChange}
          style={{
            backgroundColor: "#424242",
            color: "white",
            padding: "0.8rem",
            border: "none",
            borderRadius: "5px",
            outline: "none",
            width: "100%",
            fontSize: "1rem",
          }}
        >
          <option value="">--Select an option--</option>
          <option value="emailpassword">Email password login</option>
          <option value="thirdparty">Social / Enterprise login</option>
          <option value="passwordless">
            Passwordless (OTP / Magic link) login
          </option>
          <option value="thirdpartyemailpassword">
            Social / Enterprise + Email password login
          </option>
          <option value="thirdpartypasswordless">
            Social / Enterprise + Passwordless (OTP / Magic link) login
          </option>
          <option value="all-auth">
            Social / Enterprise + Passwordless (OTP / Magic link) + Email
            Password login
          </option>
          <option value="mfa">Multi factor login</option>
          <option value="multi-tenant">Multi tenancy login</option>
        </select>
      </div>
    );
  }

  if (isCustomUI === undefined) {
    return (
      <div
        style={{
          backgroundColor: "#1E1E1E",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <label
          style={{ color: "#FF9800", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          {backendChoice === "python" || backendChoice === "nodejs" ? "5" : "4"}
          ) Do you want to use a custom UI?
        </label>
        <div style={{ margin: "1rem 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => setIsCustomUI(true)}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "0.8rem 2rem",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => setIsCustomUI(false)}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              padding: "0.8rem 2rem",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#1E1E1E",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <StartGuide
        frontend={frontendChoice}
        backend={backendChoice}
        backendFramework={backendFramework}
        selectedAuthMethod={selectedAuthMethod}
        isCustomUI={isCustomUI}
        applicationServer={applicationServer}
      />
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

