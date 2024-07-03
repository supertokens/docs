import axios from "axios";
import { getAnalytics, sendSDKLogsToBackend } from "./utils";

export enum HTTP_REQUEST_ERROR {
    SESSION_EXPIRED,
    UNKNOWN,
    CANCELLED,
    MALFORMED_RESPONSE,
    ERROR_FROM_SERVER,
    BAD_REQUEST
}

export type GETRequestConfig = {
    headers?: any;
    params?: any;
    paramsSerializer?: (params: any) => string;
    timeout?: number;
    onDownloadProgress?: (progressEvent: any) => void;
    responseType?: string;
    withCredentials?: boolean;
};

export type DELETERequestConfig = {
    headers?: any;
    params?: any;
    data?: any;
    paramsSerializer?: (params: any) => string;
    timeout?: number;
    onDownloadProgress?: (progressEvent: any) => void;
    withCredentials?: boolean;
};

export type POSTRequestConfig = {
    headers?: any;
    transformRequest?: (data: any) => any;
    timeout?: number;
    onDownloadProgress?: (progressEvent: any) => void;
    withCredentials?: boolean;
};

export type PATCHRequestConfig = {
    headers?: any;
    transformRequest?: (data: any) => any;
    timeout?: number;
    onDownloadProgress?: (progressEvent: any) => void;
    withCredentials?: boolean;
};

export type PUTRequestConfig = {
    headers?: any;
    transformRequest?: (data: any) => any;
    timeout?: number;
    onDownloadProgress?: (progressEvent: any) => void;
    withCredentials?: boolean;
};

const defaultGetRequestConfig = {
    timeout: 20000,
    maxRedirects: 20,
    withCredentials: true,
    xsrfCookieName: "",
    xsrfHeaderName: ""
};

const defaultDeleteRequestConfig = {
    timeout: 20000,
    maxRedirects: 20,
    withCredentials: true,
    xsrfCookieName: "",
    xsrfHeaderName: ""
};

const defaultPostRequestConfig = {
    timeout: 20000,
    maxRedirects: 20,
    withCredentials: true,
    xsrfCookieName: "",
    xsrfHeaderName: ""
};

const defaultPutRequestConfig = {
    timeout: 20000,
    maxRedirects: 20,
    withCredentials: true,
    xsrfCookieName: "",
    xsrfHeaderName: ""
};

export async function simpleGETRequest(url: string, userConfig: any = {}, version: number) {
    userConfig = {
        ...userConfig,
        params: {
            ...userConfig.params
        }
    };
    userConfig = {
        ...defaultGetRequestConfig,
        ...userConfig,
        headers: {
            ...userConfig.headers,
            "api-version": version + ""
        }
    };
    let frontTokenExists = cookieExists("sFrontToken");
    let response = await axios.get(url, userConfig);
    let data = await response.data;
    let headers = response.headers;
    await sendAnalyticsIfFrontTokenRemoved(url, frontTokenExists, headers);
    return { data, headers };
}

export async function simplePOSTRequest(url: string, data: any, userConfig: POSTRequestConfig = {}, version: number) {
    data = {
        ...data
    };
    userConfig = {
        ...defaultPostRequestConfig,
        ...userConfig,
        headers: {
            ...userConfig.headers,
            "api-version": version + ""
        }
    };
    let frontTokenExists = cookieExists("sFrontToken");
    let response = await axios.post(url, data, userConfig);
    let responseData = response.data;
    let headers = response.headers;
    await sendAnalyticsIfFrontTokenRemoved(url, frontTokenExists, headers);
    return { data: responseData, headers, status: response.status, statusText: response.statusText };
}

export async function simplePATCHRequest(url: string, data: any, userConfig: PATCHRequestConfig = {}, version: number) {
    data = {
        ...data
    };
    userConfig = {
        ...defaultPostRequestConfig,
        ...userConfig,
        headers: {
            ...userConfig.headers,
            "api-version": version + ""
        }
    };
    let frontTokenExists = cookieExists("sFrontToken");
    let response = await axios.patch(url, data, userConfig);
    let responseData = response.data;
    let headers = response.headers;
    await sendAnalyticsIfFrontTokenRemoved(url, frontTokenExists, headers);
    return { data: responseData, headers };
}

export async function simplePUTRequest(url: string, data: any, userConfig: POSTRequestConfig = {}, version: number) {
    data = {
        ...data
    };
    userConfig = {
        ...defaultPutRequestConfig,
        ...userConfig,
        headers: {
            ...userConfig.headers,
            "api-version": version + ""
        }
    };
    let frontTokenExists = cookieExists("sFrontToken");
    let response = await axios.put(url, data, userConfig);
    let responseData = response.data;
    let headers = response.headers;
    await sendAnalyticsIfFrontTokenRemoved(url, frontTokenExists, headers);
    return { data: responseData, headers };
}

export async function simpleDELETERequest(url: string, userConfig: DELETERequestConfig = {}, version: number) {
    userConfig = {
        ...userConfig,
        data: {
            ...userConfig.params
        }
    };
    userConfig = {
        ...defaultDeleteRequestConfig,
        ...userConfig,
        headers: {
            ...userConfig.headers,
            "api-version": version + ""
        }
    };
    let frontTokenExists = cookieExists("sFrontToken");
    delete userConfig.params;
    let response = await axios.delete(url, userConfig);
    let data = await response.data;
    let headers = response.headers;
    await sendAnalyticsIfFrontTokenRemoved(url, frontTokenExists, headers);
    return { data, headers };
}

async function sendAnalyticsIfFrontTokenRemoved(url: string, frontTokenExists: boolean, headers: any) {
    if (!frontTokenExists) {
        return;
    }
    let updatedFrontTokenExists = cookieExists("sFrontToken");
    if (!updatedFrontTokenExists) {
        // this means it was removed between the api call!
        // send analytics
        sendAuthAnalytics("front_token_removed", {
            url,
            headers
        });
        await sendSDKLogsToBackend()
    }
}

export function cookieExists(name: string) {
    const cookies = document.cookie;
    const regex = new RegExp("(^|; )" + encodeURIComponent(name) + "=");
    return regex.test(cookies);
}

const sendAuthAnalytics = (eventName: string, payload: Record<string, unknown>, version = "v1") => {
    getAnalytics().then((stAnalytics: any) => {
        if (stAnalytics === undefined) {
            console.log("mocked event send:", eventName, version, payload);
            return;
        }
        stAnalytics.sendEvent(
            eventName,
            {
                type: "auth",
                ...payload
            },
            version
        );
    });
};