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
ThirdPartyEmailPassword.init({
    preAPIHook: async (context) => {
        let url = context.url;
        
        // is the fetch config object that contains the header, body etc..
        let requestInit = context.requestInit;

        let action = context.action;
        if (action === "EMAIL_EXISTS") {

        } else if (action === "GET_AUTHORISATION_URL") {

        } else if (action === "IS_EMAIL_VERIFIED") {

        } else if (action === "SEND_RESET_PASSWORD_EMAIL") {

        } else if (action === "SEND_VERIFY_EMAIL") {

        } else if (action === "EMAIL_PASSWORD_SIGN_IN") {

        } else if (action === "EMAIL_PASSWORD_SIGN_UP") {

        } else if (action === "THIRD_PARTY_SIGN_IN_UP") {
            // Note: this could either be sign in or sign up.
            // we don't know that at the time of the API call
            // since all we have is the authorisation code from
            // the social provider

        } else if (action === "SUBMIT_NEW_PASSWORD") {

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