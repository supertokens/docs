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