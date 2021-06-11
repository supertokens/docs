// const DEFAULT_OPTIONS = { // Some defaults.  };

// A JavaScript function that returns an object.
// `context` is provided by Docusaurus. Example: siteConfig can be accessed from context.
// `opts` is the user-defined options.
module.exports = function(context, opts) {
    // Merge defaults with user-defined options.
    //   const options = {...DEFAULT_OPTIONS, ...options};

    return {
        // A compulsory field used as the namespace for directories to cache
        // the intermediate data for each plugin.
        // If you're writing your own local plugin, you will want it to
        // be unique in order not to potentially conflict with imported plugins.
        // A good way will be to add your own project name within.
        name: "supertokens-docs-plugin",

        // async loadContent() {
        //   // The loadContent hook is executed after siteConfig and env has been loaded.
        //   // You can return a JavaScript object that will be passed to contentLoaded hook.
        // },

        // async contentLoaded({content, actions}) {
        //   // The contentLoaded hook is done after loadContent hook is done.
        //   // `actions` are set of functional API provided by Docusaurus (e.g. addRoute)
        // },

        // async postBuild(props) {
        //   // After docusaurus <build> finish.
        // },

        // // TODO
        // async postStart(props) {
        //   // docusaurus <start> finish
        // },

        // // TODO
        // afterDevServer(app, server) {
        //   // https://webpack.js.org/configuration/dev-server/#devserverbefore
        // },

        // // TODO
        // beforeDevServer(app, server) {
        //   // https://webpack.js.org/configuration/dev-server/#devserverafter
        // },

        // configureWebpack(config, isServer) {
        //   // Modify internal webpack config. If returned value is an Object, it
        //   // will be merged into the final config using webpack-merge;
        //   // If the returned value is a function, it will receive the config as the 1st argument and an isServer flag as the 2nd argument.
        // },

        // getPathsToWatch() {
        //   // Paths to watch.
        // },

        // getThemePath() {
        //   // Returns the path to the directory where the theme components can
        //   // be found.
        // },

        // getClientModules() {
        //   // Return an array of paths to the modules that are to be imported
        //   // in the client bundle. These modules are imported globally before
        //   // React even renders the initial UI.
        // },

        // extendCli(cli) {
        //   // Register an extra command to enhance the CLI of Docusaurus
        // },

        injectHtmlTags() {
            console.log(
                process.env
            );
            return {
                postBodyTags: [
                    {
                        tagName: "div",
                        attributes: {
                            id: "supertokens-root"
                        }
                    },
                    {
                        tagName: "script",
                        attributes: {
                            src: "http://localhost:9001/static/bundle.js", // only for supertokens team when changing bundle code
                            // src: "/static/bundle.js",
                            type: "text/javascript"
                        }
                    },
                    {
                        tagName: "script",
                        attributes: {
                            src: "http://localhost:9001/static/bundle.js", // only for supertokens team when changing antcs code
                            // src: "/static/antcs.js",
                            type: "text/javascript"
                        }
                    }
                ]
            };
        }

        // async getTranslationFiles() {
        //   // Return translation files
        // },

        // translateContent({content, translationFiles}) {
        //   // translate the plugin content here
        // },

        // translateThemeConfig({themeConfig, translationFiles}) {
        //   // translate the site themeConfig here
        // },

        // async getDefaultCodeTranslationMessages() {
        //   // return default theme translations here
        // },
    };
};
