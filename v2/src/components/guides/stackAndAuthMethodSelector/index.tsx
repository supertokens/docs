import * as React from "react";
import { FrontendChoice, BackendChoice, FirstFactors, SecondFactors } from "../utils"

export default function StackAndAuthMethodSelector() {
    return (
        <div style={{
            paddingBottom: "40px",
        }}><StackAndAuthMethodSelectorHelper /></div>
    )
}

export function StackAndAuthMethodSelectorHelper() {

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
            <div style={{ backgroundColor: '#2A2A2A', color: 'white', fontFamily: 'monospace', padding: '1rem' }}>
                <label htmlFor="frontendChoice" style={{ color: '#ff9933', fontWeight: 'bold' }}>
                    1) Please select which frontend you use:
                </label>
                <div style={{ margin: '0.5rem 0' }} />
                <select
                    id="frontendChoice"
                    value={frontendChoice === undefined ? "" : frontendChoice}
                    onChange={handleFrontendChange}
                    style={{
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '0.5rem',
                        border: '1px solid #ff9933',
                        outline: 'none',
                    }}
                >
                    <option value="">--Select an option--</option>
                    <option value="react">React</option>
                    <option value="angular">Angular</option>
                    <option value="vue">Vue</option>
                    <option value="vanillajs">Vanilla JS</option>
                    <option value="nextjs">Next.js</option>
                    <option value="remix">Remix</option>
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
            <div style={{ backgroundColor: '#2A2A2A', color: 'white', fontFamily: 'monospace', padding: '1rem' }}>
                <label htmlFor="backendChoice" style={{ color: '#ff9933', fontWeight: 'bold' }}>2) Please select which backend you use:</label>
                <div style={{ margin: '0.5rem 0' }} />
                <select id="backendChoice" value={backendChoice === undefined ? "" : backendChoice} onChange={handleBackendChange} style={{
                    backgroundColor: '#333',
                    color: 'white',
                    padding: '0.5rem',
                    border: '1px solid #ff9933',
                    outline: 'none',
                }}>
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

    if (isMultiTenantSetup === undefined) {
        return (
            <div style={{ backgroundColor: '#2A2A2A', color: 'white', fontFamily: 'monospace', padding: '1rem' }}>
                <label htmlFor="multiTenantSetup" style={{ color: '#ff9933', fontWeight: 'bold' }}>
                    3) Is this a multi-tenant setup?
                </label>
                <div style={{ margin: '0.5rem 0' }} />
                <button
                    onClick={() => handleMultiTenantChange(true)}
                    style={{
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '0.5rem',
                    }}
                >
                    Yes
                </button>
                <button
                    onClick={() => handleMultiTenantChange(false)}
                    style={{
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    No
                </button>
            </div>
        );
    }

    if (isMultiTenantSetup === false) {
        if (tenants.length === 0) {
            return (
                <FirstAndSecondFactorChoice
                    setFactors={(f, s) => {
                        setTenants([
                            {
                                tenantId: 'public',
                                firstFactors: f,
                                secondFactors: s,
                            },
                        ]);
                    }}
                />
            );
        } else {
            return (
                <div>
                    <div style={{ color: '#ff9933', fontWeight: 'bold' }}>Public tenant config:</div>
                    <div>First factors: {tenants[0].firstFactors.join(', ')}</div>
                    <div>Second factors: {tenants[0].secondFactors.join(', ')}</div>
                    <div style={{ height: '10px' }} />
                    <StartGuide
                        frontend={frontendChoice}
                        backend={backendChoice}
                        tenants={tenants}
                    />
                </div>
            );
        }
    } else {
        return (
            <div>
                {tenants.map((tenant) => (
                    <div key={tenant.tenantId}>
                        <div style={{ color: '#ff9933', fontWeight: 'bold' }}>
                            -------Tenant Id: {tenant.tenantId}-------
                        </div>
                        <div>First factors: {tenant.firstFactors.join(', ')}</div>
                        <div>Second factors: {tenant.secondFactors.join(', ')}</div>
                        <div style={{ height: '10px' }} />
                    </div>
                ))}

                <AddNewTenantUI
                    addNewTenant={(t, f, s) => {
                        // if tenants does not contain t, add it
                        if (!tenants.find((tenant) => tenant.tenantId === t)) {
                            setTenants([
                                ...tenants,
                                {
                                    tenantId: t,
                                    firstFactors: f,
                                    secondFactors: s,
                                },
                            ]);
                        }
                    }}
                />
                <div style={{ height: '10px' }} />
                <StartGuide frontend={frontendChoice} backend={backendChoice} tenants={tenants} />
            </div>
        );
    }
}

function StartGuide(props: {
    frontend: FrontendChoice,
    backend: BackendChoice,
    tenants: {
        tenantId: string,
        firstFactors: FirstFactors,
        secondFactors: SecondFactors
    }[]
}) {
    return (
        <button
            disabled={props.tenants.length === 0}
            onClick={() => {
                // open new window with link
                let queryValue = encodeURIComponent(JSON.stringify(props));
                const url = `/docs/guides/selection-tutorial?selection=${queryValue}`;
                window.open(url, "_blank");
            }}
            style={{
                backgroundColor: props.tenants.length === 0 ? '#ccc' : '#ff9933',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
            }}
        >
            Start Guide
        </button>
    );
}

function AddNewTenantUI(props: {
    addNewTenant: (tenantId: string, firstFactors: FirstFactors, secondFactors: SecondFactors) => void
}) {
    const [isAddingTenant, setIsAddingTenant] = React.useState<boolean>(false);
    const [tenantId, setTenantId] = React.useState<string>("");

    if (!isAddingTenant) {
        return (
            <button
                onClick={() => setIsAddingTenant(true)}
                style={{
                    backgroundColor: '#ff9933',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                }}
            >
                Add New Tenant
            </button>
        );
    } else {
        return (
            <div style={{ border: '1px solid #ff9933', padding: '1rem', borderRadius: '4px' }}>
                <div style={{ color: '#ff9933', fontWeight: 'bold' }}>Tenant name:</div>
                <input
                    type="text"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    style={{
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '0.5rem',
                        border: '1px solid #ff9933',
                        borderRadius: '4px',
                        outline: 'none',
                    }}
                />

                <FirstAndSecondFactorChoice
                    setFactors={(f, s) => {
                        props.addNewTenant(tenantId, f, s);
                        setIsAddingTenant(false);
                        setTenantId("");
                    }}
                />
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
            <div style={{ border: '1px solid #ff9933', padding: '1rem', borderRadius: '4px' }}>
                <label style={{ color: '#ff9933', fontWeight: 'bold' }}>Please select your first factor auth methods:</label>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="emailpassword"
                            value="emailpassword"
                            checked={firstFactors.includes("emailpassword")}
                            onChange={handleFirstFactorChange}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <label htmlFor="emailpassword" style={{ color: 'white' }}>Email & Password</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="passwordless"
                            value="passwordless"
                            checked={firstFactors.includes("passwordless")}
                            onChange={handleFirstFactorChange}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <label htmlFor="passwordless" style={{ color: 'white' }}>Passwordless</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            id="thirdparty"
                            value="thirdparty"
                            checked={firstFactors.includes("thirdparty")}
                            onChange={handleFirstFactorChange}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <label htmlFor="thirdparty" style={{ color: 'white' }}>Third-party</label>
                    </div>
                </div>
                <button
                    disabled={firstFactors.length === 0}
                    onClick={() => {
                        setFirstFactorSelectionCompleted(true)
                    }}
                    style={{
                        backgroundColor: firstFactors.length === 0 ? '#ccc' : '#ff9933',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginTop: '1rem',
                    }}
                >
                    Next
                </button>
            </div>
        );
    }

    if (!secondFactorSelectionCompleted) {
        return (
            <div style={{ border: '1px solid #ff9933', padding: '1rem', borderRadius: '4px' }}>
                <label style={{ color: '#ff9933', fontWeight: 'bold' }}>Please select your second factor auth methods:</label>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="totp"
                            value="totp"
                            checked={secondFactors.includes("totp")}
                            onChange={handleSecondFactorChange}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <label htmlFor="totp" style={{ color: 'white' }}>TOTP</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="otp-phone"
                            value="otp-phone"
                            checked={secondFactors.includes("otp-phone")}
                            onChange={handleSecondFactorChange}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <label htmlFor="otp-phone" style={{ color: 'white' }}>SMS OTP</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            id="otp-email"
                            value="otp-email"
                            checked={secondFactors.includes("otp-email")}
                            onChange={handleSecondFactorChange}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <label htmlFor="otp-email" style={{ color: 'white' }}>Email OTP</label>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setSecondFactorSelectionCompleted(true)
                        props.setFactors(firstFactors, secondFactors);
                    }}
                    style={{
                        backgroundColor: secondFactors.length === 0 ? '#ccc' : '#ff9933',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginTop: '1rem',
                    }}
                >
                    {secondFactors.length === 0 ? "Skip" : "Next"}
                </button>
            </div>
        );
    }

    return null;
}