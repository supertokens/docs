import { API_URL } from "../constants";
import * as httpNetworking from "../httpNetworking";

const URL = API_URL + "/frontend/auth-react";
const VERSION = 0;

export default async function getURI(): Promise<{ uri: string }> {
    let options: httpNetworking.GETRequestConfig = {
        timeout: 50000,
    };

    let response = (await httpNetworking.simpleGETRequest(URL, options, VERSION)).data;
    return response;
}
