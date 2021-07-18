module.exports = function (context, opts) {

    return {
        name: 'copy-docs',

        async loadContent() {
            console.log("load content");
            // The loadContent hook is executed after siteConfig and env has been loaded.
            // You can return a JavaScript object that will be passed to contentLoaded hook.
        },

        async contentLoaded({ content, actions }) {
            console.log("content loaded");
            // The contentLoaded hook is done after loadContent hook is done.
            // `actions` are set of functional API provided by Docusaurus (e.g. addRoute)
        }
    };
};