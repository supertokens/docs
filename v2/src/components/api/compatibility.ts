import { API_URL } from "../constants";
import * as httpNetworking from "../httpNetworking";

const URL = API_URL + "/compatibility";
const VERSION = 0;

export type GetCompatibilityResponse = {
    cores: string[];
    coreToDriver: { [key: string]: string[] };
    coreToPlugin: { [key: string]: string[] };
    driverToFrontend: { [key: string]: string[] };
};

export async function getCompatibility(driver: string, frontend: string): Promise<GetCompatibilityResponse> {
    let options: httpNetworking.GETRequestConfig = {
        timeout: 50000,
        params: {
            planType: "FREE",
            plugin: "postgresql",
            driver,
            frontend
        }
    };

    let result = (await httpNetworking.simpleGETRequest(URL, options, VERSION)).data;
    return result;
}
