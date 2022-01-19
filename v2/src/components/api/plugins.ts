import { API_URL } from "../constants";
import * as httpNetworking from "../httpNetworking";

const URL = API_URL + "/plugins";
const VERSION = 0;

export type GetSupportedPluginsResponse_Plugin = {
    id: string;
    displayName: string;
};

export type GetSupportedPluginsResponse = {
    plugins: GetSupportedPluginsResponse_Plugin[];
};

/**
 * Fetches a list of supported plugins in format {id: string, displayName: string}
 * @param planType free or commercial
 */
export default async function getSupportedPlugins(planType: any): Promise<GetSupportedPluginsResponse> {
    let options: httpNetworking.GETRequestConfig = {
        timeout: 50000,
        params: {
            planType: planType === "COMMERCIAL_TRIAL" ? "COMMERCIAL" : planType,
            mode: "PRODUCTION"
        }
    };

    let response = (await httpNetworking.simpleGETRequest(URL, options, VERSION)).data;
    return response;
}
