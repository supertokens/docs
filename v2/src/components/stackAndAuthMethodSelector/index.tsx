import * as React from "react";

type FrontendChoice = "react" | "angular" | "vue" | "vanillajs" | "nextjs" | "remix" | undefined;

type BackendChoice = "nodejs" | "golang" | "python" | "php" | "c#" | "java" | "ruby" | undefined;

type FirstFactors = ("emailpassword" | "passwordless" | "thirdparty")[]

type SecondFactors = ("totp" | "otp-phone" | "otp-email")[]

export default function StackAndAuthMethodSelector() {

    const [frontendChoice, setFrontendChoice] = React.useState<FrontendChoice>(undefined);

    const [backendChoice, setBackendChoice] = React.useState<BackendChoice>(undefined);

    const [isMultiTenantSetup, setIsMultiTenantSetup] = React.useState<boolean | undefined>(undefined);

    const [tenants, setTenants] = React.useState<({
        tenantId: string,
        firstFactors: FirstFactors,
        secondFactors: SecondFactors
    })[]>([]);

    const handleFrontendChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFrontendChoice(event.target.value as FrontendChoice);
    };

    const handleBackendChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBackendChoice(event.target.value as BackendChoice);
    };

    const handleMultiTenantChange = (choice: boolean) => {
        setIsMultiTenantSetup(choice);
    };

    if (frontendChoice === undefined) {
        return (
            <div>
                <label htmlFor="frontendChoice">Please select which frontend you use:</label>
                <div />
                <select id="frontendChoice" value={frontendChoice === undefined ? "" : frontendChoice} onChange={handleFrontendChange}>
                    <option value="">--Select an option--</option>
                    <option value="react">React</option>
                    <option value="angular">Angular</option>
                    <option value="vue">Vue</option>
                    <option value="vanillajs">Vanilla JS</option>
                    <option value="nextjs">Next.js</option>
                    <option value="remix">Remix</option>
                </select>
            </div>
        );
    }

    if (backendChoice === undefined) {
        return (
            <div>
                <label htmlFor="backendChoice">Please select which backend you use:</label>
                <div />
                <select id="backendChoice" value={backendChoice === undefined ? "" : backendChoice} onChange={handleBackendChange}>
                    <option value="">--Select an option--</option>
                    <option value="nodejs">Node.js</option>
                    <option value="golang">Go</option>
                    <option value="python">Python</option>
                    <option value="php">PHP</option>
                    <option value="c#">C#</option>
                    <option value="java">Java</option>
                    <option value="ruby">Ruby</option>
                </select>
            </div>
        );
    }

    if (isMultiTenantSetup === undefined) {
        return (
            <div>
                <label htmlFor="multiTenantSetup">Is this a multi-tenant setup?</label>
                <div />
                <button
                    onClick={() => handleMultiTenantChange(true)}
                >Yes</button>
                <button
                    onClick={() => handleMultiTenantChange(false)}
                >No</button>
            </div>
        );
    }

    if (isMultiTenantSetup === false) {
        if (tenants.length === 0) {
            return <FirstAndSecondFactorChoice
                setFactors={(f, s) => {
                    setTenants([{
                        tenantId: "public",
                        firstFactors: f,
                        secondFactors: s
                    }])
                }}
            />
        } else {
            return (
                <div>
                    <div>Public tenant config:</div>
                    <div>First factors: {tenants[0].firstFactors.join(", ")}</div>
                    <div>Second factors: {tenants[0].secondFactors.join(", ")}</div>
                </div>
            );
        }
    } else {
        return (
            <div>
                {tenants.map(tenant => (
                    <div key={tenant.tenantId}>
                        <div>-------Tenant Id: {tenant.tenantId}-------</div>
                        <div>First factors: {tenant.firstFactors.join(", ")}</div>
                        <div>Second factors: {tenant.secondFactors.join(", ")}</div>
                        <div style={{
                            height: "10px",
                        }} />
                    </div>
                ))}

                <AddNewTenantUI
                    addNewTenant={(t, f, s) => {
                        // if tenants does not contain t, add it
                        if (!tenants.find(tenant => tenant.tenantId === t)) {
                            setTenants([...tenants, {
                                tenantId: t,
                                firstFactors: f,
                                secondFactors: s
                            }])
                        }
                    }} />
            </div>
        );
    }
}

function AddNewTenantUI(props: {
    addNewTenant: (tenantId: string, firstFactors: FirstFactors, secondFactors: SecondFactors) => void
}) {
    const [isAddingTenant, setIsAddingTenant] = React.useState<boolean>(false);

    const [tenantId, setTenantId] = React.useState<string>("");

    if (!isAddingTenant) {
        return <button onClick={() => setIsAddingTenant(true)}>Add New Tenant</button>;
    } else {
        return (
            <div>
                <div>Tenant name:</div>
                <input
                    type="text"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                />

                <FirstAndSecondFactorChoice setFactors={(f, s) => {
                    props.addNewTenant(tenantId, f, s);
                    setIsAddingTenant(false);
                    setTenantId("");
                }} />
            </div>
        )
    }
}

function FirstAndSecondFactorChoice(props: {
    setFactors: (firstFactors: FirstFactors, secondFactors: SecondFactors) => void,
}) {

    const [firstFactors, setFirstFactors] = React.useState<FirstFactors>([]);

    const [firstFactorSelectionCompleted, setFirstFactorSelectionCompleted] = React.useState<boolean>(false);

    const [secondFactors, setSecondFactors] = React.useState<SecondFactors>([]);

    const [secondFactorSelectionCompleted, setSecondFactorSelectionCompleted] = React.useState<boolean>(false);

    const handleFirstFactorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as FirstFactors[number];
        setFirstFactors(prev =>
            event.target.checked
                ? [...prev, value]
                : prev.filter(method => method !== value)
        );
    };

    const handleSecondFactorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as SecondFactors[number];
        setSecondFactors(prev =>
            event.target.checked
                ? [...prev, value]
                : prev.filter(method => method !== value)
        );
    };

    if (!firstFactorSelectionCompleted) {
        return (
            <div>
                <label>Please select your first factor auth methods:</label>
                <div>
                    <input
                        type="checkbox"
                        id="emailpassword"
                        value="emailpassword"
                        checked={firstFactors.includes("emailpassword")}
                        onChange={handleFirstFactorChange}
                    />
                    <label htmlFor="emailpassword">Email & Password</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="passwordless"
                        value="passwordless"
                        checked={firstFactors.includes("passwordless")}
                        onChange={handleFirstFactorChange}
                    />
                    <label htmlFor="passwordless">Passwordless</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="thirdparty"
                        value="thirdparty"
                        checked={firstFactors.includes("thirdparty")}
                        onChange={handleFirstFactorChange}
                    />
                    <label htmlFor="thirdparty">Third-party</label>
                </div>
                <button
                    disabled={firstFactors.length === 0}
                    onClick={() => {
                        setFirstFactorSelectionCompleted(true)
                    }}
                >Next</button>
            </div>
        );
    }
    if (!secondFactorSelectionCompleted) {
        return (
            <div>
                <label>Please select your second factor auth methods:</label>
                <div>
                    <input
                        type="checkbox"
                        id="totp"
                        value="totp"
                        checked={secondFactors.includes("totp")}
                        onChange={handleSecondFactorChange}
                    />
                    <label htmlFor="emailpassword">TOTP</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="otp-phone"
                        value="otp-phone"
                        checked={secondFactors.includes("otp-phone")}
                        onChange={handleSecondFactorChange}
                    />
                    <label htmlFor="passwordless">SMS OTP</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="otp-email"
                        value="otp-email"
                        checked={secondFactors.includes("otp-email")}
                        onChange={handleSecondFactorChange}
                    />
                    <label htmlFor="thirdparty">Email OTP</label>
                </div>
                <button
                    onClick={() => {
                        setSecondFactorSelectionCompleted(true)
                        props.setFactors(firstFactors, secondFactors);
                    }}
                >{secondFactors.length === 0 ? "Skip" : "Next"}</button>
            </div>
        );
    }

    return null;
}