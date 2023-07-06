import { API_URL, MOCK_ENABLED } from "../../constants";
import { mockDelay } from "../../utils";
import * as httpNetworking from "../../httpNetworking";

const OLDER_URL = API_URL + "/saas/apps";
const URL = API_URL + "/saas/multi-tenancy/connection-uri-domain/list";
const VERSION = 1;

export type SassAppDevData = {
    id: string;
    /** Version in format X.Y */
    supertokensVersion?: string;
    connectionInfo?: {
        host: string;
        apiKeys: string[];
    };
    config: {
        keyName: string;
        value: string | number | boolean;
        description: string;
    }[];
    supertokensInstance: {
        status: "active" | "restarting";
        /** unique ID across all instances */
        containerName: string;
    }[];
};

type SassAppProductionData = SassAppDevData & {
    userHadCreated: boolean;
    connectionInfo?: SassAppDevData["connectionInfo"] & {
        serviceApiKey: string;
    };
    pricing?: {
        basePrice: number;
        pricePerInstance: number;
        numberOfInstancesToPayFor: number;
        nextDueDate?: number;
    };
};

type SaasAppListItem = {
    appName: string;
    appId: string;
    region: string;
    isTemporarilyRemoved: boolean;
    devDeployment: SassAppDevData;
    prodDeployment: SassAppProductionData;
};

let oldAPIMockResponse: SaasAppDeploymentConnectionInfo = {
    "host": "https://dev-0017ccc11bbe11ee8d6491038b6bd2c7-us-east-1.aws.supertokens.io:3568",
    "apiKeys": [
        "YaMSxpCr2Ff7qRHMnrvwa10EuP12qA"
    ]
}

let newAPIMockResponse: SaasConnectionUrlDomain[] = [
    {
        "deploymentId": "56a112ceb9e659c2fa0d19b63d76ead284bac7523f3b705bee90a38bd68ed424",
        "region": "us-east-1",
        "deploymentName": "My App 1",
        "isTemporarilyRemoved": false,
        "apps": [
            {
                "appId": "public",
                "deployments": [
                    {
                        "deploymentType": "development",
                        "coreVersion": "6.0",
                        "connectionInfo": {
                            "host": "https://st-dev-47fa5b70-1bbe-11ee-8d64-91038b6bd2c7.aws.supertokens.io",
                            "apiKeys": [
                                "7b9N8m8U3jgtx=ZeNWn21fBsvg"
                            ]
                        },
                        "config": [
                            {
                                "keyName": "access_token_validity",
                                "value": "3600",
                                "description": "Type: integer\nTime in seconds for how long an access token is valid for."
                            },
                            {
                                "keyName": "access_token_blacklisting",
                                "value": "false",
                                "description": "Type: boolean\nDeprecated, please see changelog. Only used in CDI<=2.18\nIf true, allows for immediate revocation of any access token. Keep in mind that setting this to true will resultin a db query for each API call that requires authentication."
                            },
                            {
                                "keyName": "access_token_signing_key_dynamic",
                                "value": "true",
                                "description": "Type: boolean\nDeprecated, please see changelog.\nIf this is set to true, the access tokens created using CDI<=2.18 will be signed using a static signing key."
                            },
                            {
                                "keyName": "access_token_dynamic_signing_key_update_interval",
                                "value": "168",
                                "description": "Type: integer\nTime in hours for how frequently the dynamic signing key will change."
                            },
                            {
                                "keyName": "refresh_token_validity",
                                "value": "144000",
                                "description": "Type: double\nTime in mins for how long a refresh token is valid for."
                            },
                            {
                                "keyName": "password_reset_token_lifetime",
                                "value": "3600000",
                                "description": "Type: long\nTime in milliseconds for how long a password reset token / link is valid for."
                            },
                            {
                                "keyName": "email_verification_token_lifetime",
                                "value": "86400000",
                                "description": "Type: long\nTime in milliseconds for how long an email verification token / link is valid for."
                            },
                            {
                                "keyName": "passwordless_max_code_input_attempts",
                                "value": "5",
                                "description": "Type: integer\nThe maximum number of code input attempts per login before the user needs to restart."
                            },
                            {
                                "keyName": "passwordless_code_lifetime",
                                "value": "900000",
                                "description": "Type: long\nTime in milliseconds for how long a passwordless code is valid for."
                            },
                            {
                                "keyName": "totp_max_attempts",
                                "value": "5",
                                "description": "Type: integer\nThe maximum number of invalid TOTP attempts that will trigger rate limiting."
                            },
                            {
                                "keyName": "totp_rate_limit_cooldown_sec",
                                "value": "900",
                                "description": "Type: integer\nThe time in seconds for which the user will be rate limited once totp_max_attempts is crossed."
                            },
                            {
                                "keyName": "password_hashing_alg",
                                "value": "BCRYPT",
                                "description": "Type: \"ARGON2\" | \"BCRYPT\"\nThe password hashing algorithm to use. Values are \"ARGON2\" | \"BCRYPT\""
                            }
                        ],
                        "status": "active"
                    }
                ]
            }
        ]
    }
]

type SaasConnectionUrlDomainCommonInfo = {
    deploymentId: string;
    deploymentName: string;
    region: string;
};

type SaasConnectionUrlDomain = SaasConnectionUrlDomainCommonInfo &
    (
        | {
            isTemporarilyRemoved: false;
            apps: SaasConnectionUriDomainApp[];
        }
        | {
            isTemporarilyRemoved: true;
            isRecreating: boolean;
        });

type SaasConnectionUriDomainApp = {
    appId: string;
    deployments: SaasAppDeployment[];
};

type SaasAppDeploymentCommonInfo = {
    coreVersion: string;
    config: SaasAppDeploymentConfig[];
    status: "active" | "restarting";
};

type SaasAppDeploymentConfig = {
    keyName: string;
    value: string;
    description: string | number | boolean;
};

type SaasAppDevDeployment = SaasAppDeploymentCommonInfo & {
    deploymentType: "development";
    connectionInfo: SaasAppDeploymentConnectionInfo;
};

type SaasAppProdDeployment = SaasAppDeploymentCommonInfo & {
    deploymentType: "production";
    connectionInfo?: SaasAppDeploymentConnectionInfo & {
        serviceApiKey: string;
    };
    pricing?: {
        basePrice: number;
        pricePerInstance: number;
        numberOfInstancesToPayFor: number;
        nextDueDate?: number;
    };
};

type SaasAppDeployment = SaasAppDevDeployment | SaasAppProdDeployment;

type SaasAppDeploymentConnectionInfo = {
    host: string;
    apiKeys: string[];
};

export async function getSaasApp(): Promise<SaasAppDeploymentConnectionInfo | undefined> {
    const options: httpNetworking.GETRequestConfig = {
        timeout: 10000
    };

    if (MOCK_ENABLED) {
        await mockDelay(1000);
        // return oldAPIMockResponse;
    } else {
        const result = await httpNetworking.simpleGETRequest(OLDER_URL, options, VERSION);
        let olderResult = result.data as SaasAppListItem[];
        if (olderResult.length > 0) {
            return olderResult[0].devDeployment.connectionInfo!;
        }
    }

    let typedResult: SaasConnectionUrlDomain[] = [];
    if (MOCK_ENABLED) {
        typedResult = newAPIMockResponse;
    } else {
        // now we try and query the newer API
        const result = await httpNetworking.simpleGETRequest(URL, options, VERSION);
        typedResult = result.data;
    }

    for (let i = 0; i < typedResult.length; i++) {
        let curr = typedResult[i];
        if (!curr.isTemporarilyRemoved) {
            for (let y = 0; y < curr.apps.length; y++) {
                let currApp = curr.apps[y];
                if (currApp.appId === "public") {
                    let devDeployment = currApp.deployments[0]
                    if (currApp.deployments.length > 1 && currApp.deployments[1].deploymentType === "development") {
                        devDeployment = currApp.deployments[1]
                    }
                    return devDeployment.connectionInfo!
                }
            }
        }
    }
}