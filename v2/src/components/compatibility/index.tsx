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


    const [selectedFrontendSdk, setSelectedFrontendSdk] = useState<string | undefined>(undefined);
    const [selectedBackendSdk, setSelectedBackendnSdk] = useState<string | undefined>(undefined);

    const [compatibilityMatrix, setCompatibilityMatrix] = useState<GetCompatibilityResponse | undefined>(undefined)


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
                    const response = await getCompatibility(selectedBackendSdk, selectedFrontendSdk)
                    setCompatibilityMatrix(response)
                } catch (error) {
                    alert("Something went wrong, Please try again!")
                }
            }
        }
        getCompatibilityMatrix()
    }, [selectedBackendSdk, selectedFrontendSdk])

    console.log({ compatibilityMatrix })
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
                            <select name="backend" id="backend-sdk" onChange={(e) => setSelectedBackendnSdk(e.currentTarget.value)}>
                                {supportedBackendSdks?.map(sdk => {
                                    return <option value={sdk.id}>{sdk.displayName}</option>
                                })}
                            </select>
                        </div>
                        <div>
                            <span className="compatibility_matrix_text_one" >Frontend SDK</span>
                            <select name="frontend" id="frotend-sdk" onChange={(e) => setSelectedFrontendSdk(e.currentTarget.value)}>
                                {supportedFrontendSdks?.map(sdk => {
                                    return <option value={sdk.id}>{sdk.displayName}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sdk-selection-container-bottom">
                <div className="compatibility_matrix_box">
                    <div className="compatibility_matrix_box_header">
                        <span className="compatibility_matrix_title_two">supertokens-core</span>
                    </div>
                    <div className="compatibility_matrix_box_body  border-radius-0">
                        <select name="backend" id="backend-sdk" onChange={(e) => setSelectedBackendnSdk(e.currentTarget.value)}>
                            {supportedBackendSdks?.map(sdk => {
                                return <option value={sdk.id}>{sdk.displayName}</option>
                            })}
                        </select>
                    </div>

                </div>
                <div className="compatibility_matrix_box">
                    <div className="compatibility_matrix_box_header">
                        <span className="compatibility_matrix_title_two">supertokens-node</span>
                    </div>
                    <div className="compatibility_matrix_box_body border-radius-0">
                        <select name="backend" id="backend-sdk" onChange={(e) => setSelectedBackendnSdk(e.currentTarget.value)}>
                            {supportedBackendSdks?.map(sdk => {
                                return <option value={sdk.id}>{sdk.displayName}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>
        </section>
    );
}
