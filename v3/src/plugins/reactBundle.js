// loads the react JS bundle for supertokens.com for footer and analytics etc..

module.exports = function myPlugin(context, options) {
    return {
        name: 'react-bundle',
        injectHtmlTags() {
            if (process.env.MODE !== "production") {
                return {};
            }
            console.log("ADDING supertokens.com REACT BUNDLE");
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
                ],
                headTags: [
                    {
                        tagName: "script",
                        innerHTML: 'window.intercomSettings = {api_base: "https://api-iam.intercom.io",app_id: "fx5npc7c"};'
                    },
                    {
                        tagName: "script",
                        innerHTML: `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/fx5npc7c';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`
                    }
                ],
            };
        }
    };
};