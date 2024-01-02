import "./style.css";

import React, { useEffect, useState } from "react";

import getSupportedFrontends from "../api/frontends";
import getSupportedDrivers from "../api/drivers";
import { GetCompatibilityResponse, getCompatibility } from "../api/compatibility";

type SdkType = {
    id: string;
    displayName: string;
};

enum LocalStorageKeys {
    SELECTED_FRONTEND = "selected_frontend_sdk",
    SELECTED_BACKEND = "selected_backend_sdk"
}

export default function CompatibilityMatrix() {
    const { cachedSelectedBackendSDK, cachedSelectedFrontendSDK } = useCachedSdkSelection();

    const [supportedFrontendSdks, setSupportedFrontendSdks] = useState<SdkType[] | undefined>(undefined);
    const [supportedBackendSdks, setSupportedBackedSdks] = useState<SdkType[] | undefined>(undefined);

    const [selectedFrontendSdk, setSelectedFrontendSdk] = useState<SdkType | undefined>(cachedSelectedFrontendSDK);
    const [selectedBackendSdk, setSelectedBackendnSdk] = useState<SdkType | undefined>(cachedSelectedBackendSDK);

    const [selectedCoreVersion, setSelectedCoreVersion] = useState<SdkType | undefined>(undefined);
    const [selectedBackendSdkVersion, setSelectedBackendSdkVersion] = useState<SdkType | undefined>(undefined);

    const [compatibilityMatrix, setCompatibilityMatrix] = useState<GetCompatibilityResponse | undefined>(undefined);

    let selectableCoreVersions: SdkType[] = [];
    let selectableBackendSdkVersions: SdkType[] = [];
    let selectableFrontendSdkVersions: string[] = [];

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
        const _selectedBackendSdkVersion =
            selectedBackendSdkVersion === undefined ? selectableBackendSdkVersions[0] : selectedBackendSdkVersion;

        if (_selectedBackendSdkVersion !== undefined) {
            const indexKey = _selectedBackendSdkVersion.id
                .split(".")
                .slice(0, -1)
                .join(".");
            selectableFrontendSdkVersions = compatibilityMatrix.driverToFrontend[indexKey];
        }
    }

    function cacheSdkSelection(frontendSdk: SdkType | undefined, backendSdk: SdkType | undefined) {
        localStorage.setItem(LocalStorageKeys.SELECTED_FRONTEND, JSON.stringify(frontendSdk));
        localStorage.setItem(LocalStorageKeys.SELECTED_BACKEND, JSON.stringify(backendSdk));
    }

    useEffect(() => {
        async function getSupportedSdks() {
            try {
                const supportedFrotendsResponse = await getSupportedFrontends();
                const supportedBackendsResponse = await getSupportedDrivers();
                setSupportedFrontendSdks(supportedFrotendsResponse.frontends);
                setSupportedBackedSdks(supportedBackendsResponse.drivers);
            } catch (_) {
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
                } catch (_) {
                    alert("Something went wrong, Please try again!");
                }
            }
        }
        getCompatibilityMatrix();
        cacheSdkSelection(selectedFrontendSdk, selectedBackendSdk);
    }, [selectedBackendSdk, selectedFrontendSdk]);

    return (
        <section>
            <div className="compatibility_matrix_box">
                <div className="compatibility_matrix_box_header border-radius-top-11">
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
                    <div className="compatibility_matrix_box">
                        <div className="compatibility_matrix_box_header border-radius-top-11">
                            <span className="compatibility_matrix_title_two">supertokens-core</span>
                        </div>
                        <div className="compatibility_matrix_box_body sdk_version_select_container">
                            {compatibilityMatrix !== undefined ? (
                                <Select
                                    onOptionSelect={setSelectedCoreVersion}
                                    options={selectableCoreVersions}
                                    selectedOption={
                                        selectedCoreVersion === undefined
                                            ? selectableCoreVersions[0]
                                            : selectedCoreVersion
                                    }
                                />
                            ) : (
                                <div className="shimmer" style={{ height: "30px", minWidth: "140px" }}></div>
                            )}
                        </div>
                        <div className="compatibility_matrix_box_header">
                            <span className="compatibility_matrix_title_two">{selectedBackendSdk.displayName}</span>
                        </div>
                        <div className="version-pills-container">
                            {selectableBackendSdkVersions.map(({ id }) => {
                                return <span className="version-pill">{id}</span>;
                            })}
                        </div>
                    </div>
                    <div className="compatibility_matrix_box">
                        <div className="compatibility_matrix_box_header border-radius-top-11">
                            <span className="compatibility_matrix_title_two">{selectedBackendSdk.displayName}</span>
                        </div>
                        <div className="compatibility_matrix_box_body sdk_version_select_container">
                            {compatibilityMatrix !== undefined ? (
                                <Select
                                    onOptionSelect={setSelectedBackendSdkVersion}
                                    options={selectableBackendSdkVersions}
                                    selectedOption={
                                        selectedBackendSdkVersion === undefined
                                            ? selectableBackendSdkVersions[0]
                                            : selectedBackendSdkVersion
                                    }
                                />
                            ) : (
                                <div className="shimmer" style={{ height: "30px", minWidth: "140px" }}></div>
                            )}
                        </div>
                        <div className="compatibility_matrix_box_header">
                            <span className="compatibility_matrix_title_two">{selectedFrontendSdk.displayName}</span>
                        </div>
                        <div className="version-pills-container">
                            {selectableFrontendSdkVersions.map(version => {
                                return <span className="version-pill">{version}</span>;
                            })}
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}

function useCachedSdkSelection() {
    const cachedSelectedFrontendSDK = localStorage.getItem(LocalStorageKeys.SELECTED_FRONTEND);
    const cachedSelectedBackendSDK = localStorage.getItem(LocalStorageKeys.SELECTED_BACKEND);

    return {
        cachedSelectedFrontendSDK:
            cachedSelectedFrontendSDK !== "undefined" && cachedSelectedFrontendSDK !== null
                ? (JSON.parse(cachedSelectedFrontendSDK) as SdkType)
                : undefined,
        cachedSelectedBackendSDK:
            cachedSelectedBackendSDK !== "undefined" && cachedSelectedBackendSDK !== null
                ? (JSON.parse(cachedSelectedBackendSDK) as SdkType)
                : undefined
    };
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
