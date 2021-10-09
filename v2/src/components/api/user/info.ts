import { API_URL } from "../../constants";
import * as httpNetworking from "../../httpNetworking";

const URL = API_URL + "/user/info";
const VERSION = 0;

export type UserInfoResponse = {
    email: string;
    name: string;
    country: string;
    company: string;
};

export async function getUserInformation(): Promise<UserInfoResponse> {
    let options: httpNetworking.GETRequestConfig = {
        timeout: 50000
    };

    let result = (await httpNetworking.simpleGETRequest(URL, options, VERSION)).data;
    return result;
}
