import { API_URL, MOCK_ENABLED } from "../../constants";
import { mockDelay } from "../../utils";
import * as httpNetworking from "../../httpNetworking";

const URL = API_URL + "/saas/app";
const VERSION = 1;

let mockResponse: any = {
    exists: false
};

export async function getSaasApp() {
    const options: httpNetworking.GETRequestConfig = {
        timeout: 10000
    };

    if (MOCK_ENABLED) {
        await mockDelay(1000);
        return mockResponse;
    }

    const result = await httpNetworking.simpleGETRequest(URL, options, VERSION);
    return result.data;
}