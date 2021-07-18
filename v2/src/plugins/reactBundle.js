// loads the react JS bundle for supertokens.io for footer and analytics etc..

module.exports = function myPlugin(context, options) {
    return {
        name: 'react-bundle',
        injectHtmlTags() {
            if (process.env.MODE !== "production") {
                return {};
            }
            console.log("ADDING supertokens.io REACT BUNDLE");
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
                            src: "/static/bundle.js",
                            type: "text/javascript"
                        }
                    },
                    {
                        tagName: "script",
                        attributes: {
                            src: "/static/antcs.js",
                            type: "text/javascript"
                        }
                    },
                    {
                        tagName: "script",
                        attributes: {
                            src: "/static/drift.js",
                            type: "text/javascript"
                        }
                    }
                ]
            };
        }
    };
};