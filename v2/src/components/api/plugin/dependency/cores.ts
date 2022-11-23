import { API_URL } from "../../../constants";
import * as httpNetworking from "../../../httpNetworking";

const URL = API_URL + "/plugin/dependency/cores";
const VERSION = 0;

type Response = {
    cores: string[],
}

export async function getCoreVersionForPlugin(plugin: string): Promise<Response> {
    const options: httpNetworking.GETRequestConfig = {
        timeout: 10000,
        params: {
            planType: "FREE",
            mode: "PRODUCTION",
            name: plugin,
        }
    };

    const result = await httpNetworking.simpleGETRequest(URL, options, VERSION);
    return result.data;
}