declare global {
    interface Window {
        stAnalytics: any;
    }
}

export function getAnalytics() {
    return new Promise((res, rej) => {
        let numberOfRetries = 20;
        const analytics = window.stAnalytics;
        if (analytics) {
            res(analytics.getInstance());
            return;
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

export function sendButtonAnalytics(eventName: string, version = "v5", options?: Object) {
    getAnalytics().then((stAnalytics: any) =>
        stAnalytics.sendEvent(
            eventName,
            {
                type: "button_click",
                ...options
            },
            version
        )
    );
}

export function sendDocsPageViewEvents(referrer: string) {
    getAnalytics().then((stAnalytics: any) =>
        stAnalytics.sendDocsPageViewEventsToSegment(referrer)
    );
}

