import { API_URL, MOCK_ENABLED } from "../../constants";
import { mockDelay } from "../../utils";
import * as httpNetworking from "../../httpNetworking";

const URL = API_URL + "/saas/apps";
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
        value: string;
        description: string;
    }[];
    supertokensInstance: {
        status: "active" | "restarting";
        /** unique ID across all instances */
        containerName: string;
    }[];
};

export type SassAppProductionData = SassAppDevData & {
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

export type SaasAppListItem = {
    appName: string;
    appId: string;
    region: string;
    isTemporarilyRemoved: boolean;
    devDeployment: SassAppDevData;
    prodDeployment: SassAppProductionData;
};

let mockResponse: any = {
    exists: false
};

export async function getSaasApp(): Promise<SaasAppListItem[]> {
    const options: httpNetworking.GETRequestConfig = {
        timeout: 10000
    };

    if (MOCK_ENABLED) {
        await mockDelay(1000);
        return mockResponse;
    }

    const result = await httpNetworking.simpleGETRequest(URL, options, VERSION);
    return result.data as SaasAppListItem[];
}