import React from "react";
import axios from "axios";

declare global {
    interface Window {
        stAnalytics: any;
    }
}

export function getAnalytics() {
    return new Promise((res, rej) => {
        let numberOfRetries = 20;
        const analytics = window.stAnalytics;
        if (window.location.host === "localhost:3000") {
            return res(undefined);
        }
        if (analytics) {
            return res(analytics.getInstance());
        }

        let interval = setInterval(() => {
            const stAnalytics = window.stAnalytics;
            numberOfRetries--;
            if (stAnalytics) {
                clearInterval(interval);
                res(stAnalytics.getInstance());
                return;
            }
            if (numberOfRetries < 0) {
                clearInterval(interval);
                rej("Already waited for 2 seconds");
            }
        }, 100);
    });
}

export const sendButtonAnalytics = (eventName: string, version = "v5", options?: Object) => {
    getAnalytics().then((stAnalytics: any) => {
        if (stAnalytics === undefined) {
            console.log("mocked event send:", eventName, version, options);
            return;
        }
        stAnalytics.sendEvent(
            eventName,
            {
                type: "button_click",
                ...options
            },
            version
        )
    });
}

export function recursiveMap(children: any, fn: any, filterDescendants?: (comp: any) => boolean) {
    let result = React.Children.map(children, (child: any) => {
        if (!React.isValidElement(child) as any) {
            return fn(child);
        }
        if (filterDescendants && !filterDescendants(child)) {
            // We will later filter out the undefined entries from the array.
            return undefined;
        }
        if (child.props.children) {
            child = React.cloneElement(child, {
                children: recursiveMap(child.props.children, fn, filterDescendants)
            });
        }
        return child;
    }).filter((child: any) => child !== undefined);
    // We need to remove undefineds here, because they are not valid nodes and represents entries not matching the filter

    if (result.length === 1) {
        if (children.props === undefined || children.props.children === undefined ||
            !Array.isArray(children.props.children)) {
            return result[0];
        }
    }
    return result;
}

export const recursiveMapAllChildren = (
    children: any,
    fn: (child: React.ReactElement) => React.ReactElement
  ): any => {
    let result = React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return child;
      }
  
      if ((child as React.ReactElement).props.children) {
        const props = {
          children: recursiveMapAllChildren((child as React.ReactElement).props.children, fn)
        }
        child = React.cloneElement(child, props);
      }
  
      return fn(child);
    });
    if (result.length === 1) {
        if (children.props === undefined || children.props.children === undefined ||
            !Array.isArray(children.props.children)) {
            return result[0];
        }
    }
    return result
  }

export function mockDelay(timeout = 2000) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export function isDev() {
    return window.location.host.startsWith("localhost");
}


const isSuperTokensSDKLog = (data: any) => {
    return typeof data === "string" && data.includes("supertokens-website-ver:");
};

type ConsoleLog = typeof globalThis.console.log;

export const overrideConsoleImplementation = (customImplementation: ConsoleLog) => {
    const oldConsoleLogImplementation = globalThis.console.log;
    globalThis.console.log = (data) => {
        customImplementation(data, oldConsoleLogImplementation);
    };
};

export const SDK_LOGS_STORAGE_KEY = "Supertokens-sdk-logs";

export const saveSDKLogsConsoleOverride = (data: any, oldConsoleImplementation: ConsoleLog) => {
    if (isSuperTokensSDKLog(data)) {
        const logArrayStr = localStorage.getItem(SDK_LOGS_STORAGE_KEY) || "[]";
        const logArray = JSON.parse(logArrayStr) as string[];

        if (logArray.length === 1000) {
            logArray.shift();
        }
        logArray.push(data);

        localStorage.setItem(SDK_LOGS_STORAGE_KEY, JSON.stringify(logArray));
    } else {
        oldConsoleImplementation(data);
    }
};

export async function sendSDKLogsToBackend() {
    const sdkLogs = localStorage.getItem(SDK_LOGS_STORAGE_KEY) || "[]";
    const parsedSDKLogs = JSON.parse(sdkLogs);

    if (isDev()) {
        console.log(parsedSDKLogs, "auth_error_sdk_logs");
        localStorage.removeItem(SDK_LOGS_STORAGE_KEY);
    } else {
        await axios
            .post(
                "https://api.supertokens.com/0/antcs/ents",
                {
                    eventName: "auth_error_sdk_logs",
                    data: {
                        version: "1",
                        userId: "1",
                        timestamp: Date.now(),
                        page: "",
                        type: "auth_error_sdk_logs",
                        logs: parsedSDKLogs,
                    },
                },
                {}
            )
            .then(() => {
                localStorage.removeItem(SDK_LOGS_STORAGE_KEY);
            });
    }
}