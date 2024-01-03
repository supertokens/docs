import "./style.css";

import React, { useEffect, useState } from "react";

import getSupportedFrontends from "../api/frontends";
import getSupportedDrivers from "../api/drivers";
import { GetCompatibilityResponse, getCompatibility } from "../api/compatibility";
import { CompatibilitySelectOptionType } from "./CompatibilitySelect";
import Select from "./CompatibilitySelect";

enum LocalStorageKeys {
    SELECTED_FRONTEND = "selected_frontend_sdk",
    SELECTED_BACKEND = "selected_backend_sdk"
}

export default function CompatibilityMatrix() {
    const { cachedSelectedBackendSDK, cachedSelectedFrontendSDK } = useCachedSdkSelection();

    const [supportedFrontendSdks, setSupportedFrontendSdks] = useState<CompatibilitySelectOptionType[] | undefined>(
        undefined
    );
    const [supportedBackendSdks, setSupportedBackedSdks] = useState<CompatibilitySelectOptionType[] | undefined>(
        undefined
    );

    const [selectedFrontendSdk, setSelectedFrontendSdk] = useState<CompatibilitySelectOptionType | undefined>(
        cachedSelectedFrontendSDK
    );
    const [selectedBackendSdk, setSelectedBackendnSdk] = useState<CompatibilitySelectOptionType | undefined>(
        cachedSelectedBackendSDK
    );

    const [selectedCoreVersion, setSelectedCoreVersion] = useState<CompatibilitySelectOptionType | undefined>(
        undefined
    );
    const [selectedBackendSdkVersion, setSelectedBackendSdkVersion] = useState<
        CompatibilitySelectOptionType | undefined
    >(undefined);

    const [compatibilityMatrix, setCompatibilityMatrix] = useState<GetCompatibilityResponse | undefined>(undefined);

    const [isFailedFetchSupportedSdks, setIsFailedFetchSupportedSdks] = useState(false);
    const [isFailedFetchCompatibilityMatrix, setIsFailedFetchCompatibilityMatrix] = useState(false);

    let selectableCoreVersions: CompatibilitySelectOptionType[] = [];
    let selectableBackendSdkVersions: CompatibilitySelectOptionType[] = [];

    let compatableFrontendSdkVersions: string[] = [];
    let compatableBackendSdkVersions: string[] = [];

    if (compatibilityMatrix !== undefined) {
        selectableCoreVersions = Object.keys(compatibilityMatrix.coreToDriver).map(version => {
            return {
                id: version,
                displayName: `${version}.X`
            };
        });

        selectableBackendSdkVersions = Object.keys(compatibilityMatrix.driverToFrontend).map(version => {
            return {
                id: version,
                displayName: `${version}.X`
            };
        });

        const _selectedCoreVersion =
            selectedCoreVersion === undefined ? selectableCoreVersions[0] : selectedCoreVersion;

        const _selectedBackendSdkVersion =
            selectedBackendSdkVersion === undefined ? selectableBackendSdkVersions[0] : selectedBackendSdkVersion;

        if (_selectedCoreVersion !== undefined) {
            compatableBackendSdkVersions = compatibilityMatrix.coreToDriver[_selectedCoreVersion.id];
        }

        if (_selectedBackendSdkVersion !== undefined) {
            compatableFrontendSdkVersions = compatibilityMatrix.driverToFrontend[_selectedBackendSdkVersion.id];
        }
    }

    function cacheSdkSelection(
        frontendSdk: CompatibilitySelectOptionType | undefined,
        backendSdk: CompatibilitySelectOptionType | undefined
    ) {
        localStorage.setItem(LocalStorageKeys.SELECTED_FRONTEND, JSON.stringify(frontendSdk));
        localStorage.setItem(LocalStorageKeys.SELECTED_BACKEND, JSON.stringify(backendSdk));
    }

    async function getSupportedSdks() {
        setIsFailedFetchSupportedSdks(false);
        setSupportedFrontendSdks(undefined);
        setSupportedBackedSdks(undefined);
        try {
            const supportedFrontendsResponse = await getSupportedFrontends();
            const supportedBackendsResponse = await getSupportedDrivers();
            setSupportedFrontendSdks(supportedFrontendsResponse.frontends);
            setSupportedBackedSdks(supportedBackendsResponse.drivers);
        } catch (_) {
            setIsFailedFetchSupportedSdks(true);
        }
    }

    async function getCompatibilityMatrix() {
        setIsFailedFetchCompatibilityMatrix(false);
        setCompatibilityMatrix(undefined);
        if (selectedBackendSdk !== undefined && selectedFrontendSdk !== undefined) {
            try {
                const response = await getCompatibility(selectedBackendSdk.id, selectedFrontendSdk.id);
                setCompatibilityMatrix(response);
            } catch (_) {
                setIsFailedFetchCompatibilityMatrix(true);
            }
        }
    }

    function renderErrorMessage() {
        function handleRetry() {
            if (isFailedFetchSupportedSdks === true) {
                getSupportedSdks();
            }

            if (isFailedFetchCompatibilityMatrix === true) {
                getCompatibilityMatrix();
            }
        }

        if (isFailedFetchCompatibilityMatrix === true || isFailedFetchSupportedSdks === true) {
            return (
                <div className="error-message">
                    <AlertIcon />
                    <p>
                        Something went wrong! please <span onClick={handleRetry}>Try again.</span>
                    </p>
                </div>
            );
        }

        return null;
    }

    useEffect(() => {
        getSupportedSdks();
    }, []);

    useEffect(() => {
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
                            ) : isFailedFetchSupportedSdks === true ? (
                                <Select
                                    disabled
                                    onOptionSelect={setSelectedBackendnSdk}
                                    options={[]}
                                    selectedOption={undefined}
                                />
                            ) : (
                                <div className="shimmer"></div>
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
                            ) : isFailedFetchSupportedSdks === true ? (
                                <Select
                                    disabled
                                    onOptionSelect={setSelectedFrontendSdk}
                                    options={[]}
                                    selectedOption={undefined}
                                />
                            ) : (
                                <div className="shimmer"></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {renderErrorMessage()}
            {selectedBackendSdk !== undefined &&
            selectedFrontendSdk !== undefined &&
            isFailedFetchCompatibilityMatrix === false &&
            isFailedFetchSupportedSdks === false ? (
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
                                <div className="shimmer"></div>
                            )}
                        </div>
                        <div className="compatibility_matrix_box_header">
                            <span className="compatibility_matrix_title_two">{selectedBackendSdk.displayName}</span>
                        </div>
                        <div className="version-pills-container">
                            {compatableBackendSdkVersions.map(version => {
                                return (
                                    <span key={version} className="version-pill">
                                        {version}
                                    </span>
                                );
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
                                <div className="shimmer"></div>
                            )}
                        </div>
                        <div className="compatibility_matrix_box_header">
                            <span className="compatibility_matrix_title_two">{selectedFrontendSdk.displayName}</span>
                        </div>
                        <div className="version-pills-container">
                            {compatableFrontendSdkVersions.map(version => {
                                return (
                                    <span key={version} className="version-pill">
                                        {version}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}

function useCachedSdkSelection() {
    if (typeof window !== "undefined") {
        const cachedSelectedFrontendSDK = localStorage.getItem(LocalStorageKeys.SELECTED_FRONTEND);
        const cachedSelectedBackendSDK = localStorage.getItem(LocalStorageKeys.SELECTED_BACKEND);

        return {
            cachedSelectedFrontendSDK:
                cachedSelectedFrontendSDK !== "undefined" && cachedSelectedFrontendSDK !== null
                    ? (JSON.parse(cachedSelectedFrontendSDK) as CompatibilitySelectOptionType)
                    : undefined,
            cachedSelectedBackendSDK:
                cachedSelectedBackendSDK !== "undefined" && cachedSelectedBackendSDK !== null
                    ? (JSON.parse(cachedSelectedBackendSDK) as CompatibilitySelectOptionType)
                    : undefined
        };
    }
    return {
        cachedSelectedFrontendSDK: undefined,
        cachedSelectedBackendSDK: undefined
    };
}

function AlertIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 15 13" fill="none">
            <path
                d="M12.1384 12.7207H2.00263C1.37291 12.7207 0.807657 12.3958 0.490607 11.8517C0.173557 11.3077 0.169627 10.6558 0.480087 10.1079L5.54796 1.16457C5.86277 0.609024 6.43195 0.277344 7.0705 0.277344C7.70905 0.277344 8.27822 0.609024 8.59303 1.16457L13.6609 10.1079C13.9714 10.6558 13.9674 11.3077 13.6504 11.8517C13.3333 12.3958 12.7681 12.7207 12.1384 12.7207Z"
                fill="#ED344E"
            />
            <path
                d="M7.07081 0.527341C6.52348 0.527341 6.03561 0.811631 5.76577 1.28783L0.697899 10.2311C0.431789 10.7007 0.435169 11.2595 0.706929 11.7259C0.978679 12.1922 1.46317 12.4707 2.00293 12.4707H12.1387C12.6784 12.4707 13.1629 12.1922 13.4347 11.7259C13.7064 11.2595 13.7098 10.7007 13.4437 10.2311L8.37584 1.28783C8.106 0.811631 7.61814 0.527341 7.07081 0.527341ZM7.07081 0.0273438C7.7493 0.0273438 8.42779 0.365335 8.81085 1.04132L13.8787 9.98462C14.6342 11.3179 13.6711 12.9707 12.1387 12.9707H2.00293C0.470478 12.9707 -0.492632 11.3179 0.262888 9.98462L5.33076 1.04132C5.71382 0.365335 6.39231 0.0273438 7.07081 0.0273438Z"
                fill="#DE233D"
            />
            <path
                d="M7.92898 4.70916L7.81818 8.78303H6.77841L6.66477 4.70916H7.92898ZM7.2983 10.6012C7.1108 10.6012 6.94981 10.5349 6.81534 10.4023C6.68087 10.2679 6.61458 10.1069 6.61648 9.91939C6.61458 9.73378 6.68087 9.57469 6.81534 9.44212C6.94981 9.30954 7.1108 9.24325 7.2983 9.24325C7.47822 9.24325 7.63636 9.30954 7.77273 9.44212C7.90909 9.57469 7.97822 9.73378 7.98011 9.91939C7.97822 10.0444 7.94508 10.159 7.88068 10.2631C7.81818 10.3654 7.7358 10.4478 7.63352 10.5103C7.53125 10.5709 7.41951 10.6012 7.2983 10.6012Z"
                fill="white"
            />
        </svg>
    );
}
