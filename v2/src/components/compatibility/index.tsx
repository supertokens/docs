import "./style.css";

import React, { useEffect, useState } from "react";

import getSupportedFrontends from "../api/frontends";
import getSupportedDrivers from "../api/drivers";
import { GetCompatibilityResponse, getCompatibility } from "../api/compatibility";

type SdkType = {
    id: string;
    displayName: string;
};

export default function CompatibilityMatrix() {
    const [supportedFrontendSdks, setSupportedFrontendSdks] = useState<SdkType[] | undefined>(undefined);
    const [supportedBackendSdks, setSupportedBackedSdks] = useState<SdkType[] | undefined>(undefined);

    const [selectedFrontendSdk, setSelectedFrontendSdk] = useState<SdkType | undefined>({
        id: "auth-react",
        displayName: "auth-react"
    });
    const [selectedBackendSdk, setSelectedBackendnSdk] = useState<SdkType | undefined>({
        id: "node",
        displayName: "node"
    });
    const [selectedCoreVersion, setSelectedCoreVersion] = useState<SdkType | undefined>(undefined);
    const [selectedBackendSdkVersion, setSelectedBackendSdkVersion] = useState<SdkType | undefined>(undefined);

    const [compatibilityMatrix, setCompatibilityMatrix] = useState<GetCompatibilityResponse | undefined>(undefined);

    let selectableCoreVersions: SdkType[] = [];
    let selectableBackendSdkVersions: SdkType[] = [];

    if (compatibilityMatrix !== undefined) {
        selectableCoreVersions = compatibilityMatrix.cores.map(version => {
            return {
                id: version,
                displayName: version
            };
        });

        if (selectedCoreVersion !== undefined) {
            selectableBackendSdkVersions = compatibilityMatrix.coreToDriver[selectedCoreVersion.id].map(version => {
                return {
                    id: version,
                    displayName: version
                };
            });
        } else {
            const latestCoreVersion = Object.keys(compatibilityMatrix.coreToDriver)[0];
            selectableBackendSdkVersions = compatibilityMatrix.coreToDriver[latestCoreVersion].map(version => {
                return {
                    id: version,
                    displayName: version
                };
            });
        }
    }

    useEffect(() => {
        async function getSupportedSdks() {
            try {
                const supportedFrotendsResponse = await getSupportedFrontends();
                const supportedBackendsResponse = await getSupportedDrivers();
                setSupportedFrontendSdks(supportedFrotendsResponse.frontends);
                setSupportedBackedSdks(supportedBackendsResponse.drivers);
            } catch (error) {
                alert("Something went wrong, Please try again!");
            }
        }
        getSupportedSdks();
    }, []);

    useEffect(() => {
        async function getCompatibilityMatrix() {
            if (selectedBackendSdk !== undefined && selectedFrontendSdk !== undefined) {
                try {
                    const response = await getCompatibility(selectedBackendSdk.id, selectedFrontendSdk.id);
                    setCompatibilityMatrix(response);
                } catch (error) {
                    console.log({ error });
                    alert("Something went wrong, Please try again!");
                }
            }
        }
        getCompatibilityMatrix();
    }, [selectedBackendSdk, selectedFrontendSdk]);

    return (
        <section>
            <div className="compatibility_matrix_box">
                <div className="compatibility_matrix_box_header">
                    <span className="compatibility_matrix_title_one">Select SDK</span>
                </div>
                <div className="compatibility_matrix_box_body">
                    <div className="sdk-selection-container">
                        <div>
                            <span className="compatibility_matrix_text_one">Backend SDK</span>
                            {supportedBackendSdks !== undefined ? (
                                <Select
                                    onOptionSelect={setSelectedBackendnSdk}
                                    options={supportedBackendSdks}
                                    selectedOption={selectedBackendSdk}
                                />
                            ) : (
                                <div className="shimmer" style={{ height: "30px", minWidth: "140px" }}></div>
                            )}
                        </div>
                        <div>
                            <span className="compatibility_matrix_text_one">Frontend SDK</span>
                            {supportedFrontendSdks !== undefined ? (
                                <Select
                                    onOptionSelect={setSelectedFrontendSdk}
                                    options={supportedFrontendSdks}
                                    selectedOption={selectedFrontendSdk}
                                />
                            ) : (
                                <div className="shimmer" style={{ height: "30px", minWidth: "140px" }}></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {selectedBackendSdk !== undefined && selectedFrontendSdk !== undefined ? (
                <div className="sdk-selection-container-bottom">
                    <div className="compatibility_matrix_box w-half">
                        <div className="compatibility_matrix_box_header">
                            <span className="compatibility_matrix_title_two">supertokens-core</span>
                        </div>
                        <div className="compatibility_matrix_box_body  border-radius-0">
                            {compatibilityMatrix !== undefined ? (
                                <Select
                                    onOptionSelect={setSelectedCoreVersion}
                                    options={selectableCoreVersions}
                                    selectedOption={selectedCoreVersion}
                                />
                            ) : (
                                <div className="shimmer" style={{ height: "30px", minWidth: "140px" }}></div>
                            )}
                        </div>
                        <div className="version-pills-container">
                            {selectableBackendSdkVersions.map(({ id }) => {
                                return <span className="version-pill">{id}</span>;
                            })}
                        </div>
                    </div>
                    <div className="compatibility_matrix_box w-half">
                        <div className="compatibility_matrix_box_header">
                            <span className="compatibility_matrix_title_two">{selectedBackendSdk.displayName}</span>
                        </div>
                        <div className="compatibility_matrix_box_body border-radius-0">
                            {compatibilityMatrix !== undefined ? (
                                <Select
                                    onOptionSelect={setSelectedBackendSdkVersion}
                                    options={selectableBackendSdkVersions}
                                    selectedOption={selectedBackendSdkVersion}
                                />
                            ) : (
                                <div className="shimmer" style={{ height: "30px", minWidth: "140px" }}></div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}

type SelectProps = {
    options: SdkType[];
    selectedOption: SdkType | undefined;
    onOptionSelect: (value: SdkType) => void;
};

function Select({ onOptionSelect, options, selectedOption }: SelectProps) {
    const [showOptions, setShowOptions] = useState(false);
    return (
        <div
            className="select-container"
            onMouseLeave={() => setShowOptions(false)}
            onMouseEnter={() => setShowOptions(true)}
            //	this code make sure that the select options show up in the mobile view
            //	since there will be no onMouseEnter event there.
            onClick={() => setShowOptions(true)}
        >
            <div className="select-action">
                {selectedOption !== undefined ? selectedOption.id : "Please select"}{" "}
                <svg
                    style={{ rotate: showOptions ? "180deg" : undefined }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <path
                        d="M14 8L10 12L6 8"
                        stroke="#AAAAAA"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            {showOptions ? (
                <div className="select-dropdown-wrapper">
                    <div className="select-dropdown">
                        {options.map(option => {
                            return (
                                <div
                                    className="select-item"
                                    key={option.id}
                                    onClick={e => {
                                        e.stopPropagation();
                                        onOptionSelect(option);
                                        setShowOptions(false);
                                    }}
                                >
                                    {option.id}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
