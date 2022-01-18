import { API_URL } from "../constants";
import * as httpNetworking from "../httpNetworking";

const URL = API_URL + "/drivers";
const VERSION = 0;

export type GetSupportedDriversResponse_Driver = {
    id: string;
    displayName: string;
};

export type GetSupportedDriversResponse = {
    drivers: GetSupportedDriversResponse_Driver[];
};

/**
 * Fetches a list of supported drivers in format {id: string, displayName: string}
 * @param planType free or commercial
 */
export default async function getSupportedDrivers(planType: any): Promise<GetSupportedDriversResponse> {
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
