---
id: pre-api
title: Pre API Hook
hide_title: true
---

# Pre API Hook

This function is called before any API call is being made to your backend from our frontend SDK. You can use this to change the request body / url / header or any other request property.

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
ThirdParty.init({
    preAPIHook: async (context) => {
        let url = context.url;
        
        // is the fetch config object that contains the header, body etc..
        let requestInit = context.requestInit;

        let action = context.action;
        if (action === "GET_AUTHORISATION_URL") {

        } else if (action === "IS_EMAIL_VERIFIED") {

        } else if (action === "SEND_VERIFY_EMAIL") {

        } else if (action === "SIGN_IN") {
            // Note: this could either be sign in or sign up.
            // we don't know that at the time of the API call
            // since all we have is the authorisation code from
            // the social provider

        } else if (action === "VERIFY_EMAIL") {

        }
        return {
            requestInit, url
        };
    }
})
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Also checkout the [session recipe pre API hook](/docs/session/advanced-customizations/frontend-hooks/pre-api).