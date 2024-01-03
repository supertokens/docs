import { API_URL } from "../constants";
import * as httpNetworking from "../httpNetworking";

const URL = API_URL + "/frontends";
const VERSION = 0;

export type GetSupportedFrontendsResponse_Frontend = {
    id: string;
    displayName: string;
};

export type GetSupportedFrontendsResponse = {
    frontends: GetSupportedFrontendsResponse_Frontend[];
};

export default async function getSupportedFrontends(): Promise<GetSupportedFrontendsResponse> {
    let options: httpNetworking.GETRequestConfig = {
        timeout: 50000,
        params: {
            mode: "PRODUCTION"
        }
    };

    let response = (await httpNetworking.simpleGETRequest(URL, options, VERSION)).data;
    return response;
}
