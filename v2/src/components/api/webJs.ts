import { API_URL } from "../constants";
import * as httpNetworking from "../httpNetworking";

const URL = API_URL + "/frontend/web-js";
const VERSION = 0;

export default async function getURI(): Promise<{
  uri: {
    dateprovider: string;
    emailpassword: string;
    emailverification: string;
    multifactorauth: string;
    multitenancy: string;
    passwordless: string;
    session: string;
    supertokens: string;
    thirdparty: string;
    totp: string;
    userroles: string;
    website: string;
  };
}> {
  let options: httpNetworking.GETRequestConfig = {
    timeout: 50000,
  };

  let response = (await httpNetworking.simpleGETRequest(URL, options, VERSION))
    .data;
  return response;
}
