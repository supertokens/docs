import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

export default (function() {
    if (!ExecutionEnvironment.canUseDOM) {
        return null;
    }

    return {
        onRouteUpdate() {
            if (window.stAnalytics) {
                const analytics = window.stAnalytics.getInstance();
                analytics.sendPageViewEvents();
                analytics.sendPageViewEventToSegment();
            }
        }
    };
})();
