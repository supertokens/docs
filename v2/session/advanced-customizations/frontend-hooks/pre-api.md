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
Session.init({
    preAPIHook: async (context) => {
        let url = context.url;
        
        // is the fetch config object that contains the header, body etc..
        let requestInit = context.requestInit;

        let action = context.action;
        if (action === "SIGN_OUT") {

        } else if (action === "REFRESH_SESSION") {

        }
        return {
            requestInit, url
        };
    }
})
```
<!--END_DOCUSAURUS_CODE_TABS-->

- Also checkout the [session recipe pre API hook](/docs/session/advanced-customizations/frontend-hooks/pre-api).