import React from "react";

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

export function mockDelay(timeout = 2000) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}