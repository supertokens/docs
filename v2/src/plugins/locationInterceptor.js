import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export default (function() {

    if(!ExecutionEnvironment.canUseDOM){
        return null;
    }

    return {
        onRouteUpdate() {
            if (window.stAnalytics) {
                window.stAnalytics.getInstance().sendPageViewEvents();
            }
        }
    };
})();
