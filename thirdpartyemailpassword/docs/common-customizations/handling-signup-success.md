---
id: handling-signup-success
title: Post sign up callbacks
hide_title: true
---

# Post sign up callbacks

There are three customizations that can be done post sign up:
1) Redirecting the user to a specific URL
2) Handling the sign up event on the frontend (for example for analytics)
3) Handling the sign up event on the backend (for example for storing extra user info)

## 1)  Redirecting the user to a specific URL

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
__HIGHLIGHT__           getRedirectionURL: (context) {
                if (context.action === "SUCCESS") {
                    return context.redirectToPath === undefined ? "/dashboard" : context.redirectToPath;
                }
            } __END_HIGHLIGHT__
        }),
        Session.init()
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

The user will be redirected to the provided URL on:
- Successful sign up
- Successful sign in
- Successful email verification.
- If the user is already logged in.


Please refer to the <a href="/docs/auth-react/emailpassword/callbacks#getredirectionurl" target="_blank">auth-react reference API</a> for more information on `getRedirectionURL` hook.

## 2) Handling sign up event on the frontend

This method allows you to fire events immediately after a successful sign up. For example to send analytics events post sign up.

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
__HIGHLIGHT__            onHandleEvent: async (context) => {
                if (context.action === "SESSION_ALREADY_EXISTS") {
                    // TODO:
                } else {
                    let {id, email} = context.user;
                    if (context.action === "SUCCESS") {
                        if (context.isNewUser) {
                            // TODO: Sign up
                        } else {
                            // TODO: Sign in
                        }
                    }
                }
            } __END_HIGHLIGHT__
        }),
        Session.init()
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

Please refer to the <a href="/docs/auth-react/emailpassword/callbacks#onhandleevent" target="_blank">auth-react reference API</a> for more information on `onHandleEvent` hook.



## 3) Handling sign up event on the backend

For this, you'll have to override signInUpPOST api of the ThirdPartyEmailPassword recipe.

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->
```js
// backend
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
            __HIGHLIGHT__            override: {
                apis: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        signInUpPOST: async (input) => {
                            let response = await originalImplementation.signInUpPOST(input);
                            if (response.status === "OK") {
                                let { id, email } = response.user;
                                let context = response.type;
                                // The value of context depends on which login type (emailpassword/thirdparty) the user used to sign-up
                                let newUser = response.createdNewUser;
                                // newUser is a boolean value, if true, then the user has signed up, else they have signed in.
                                let thirdPartyAuthCodeResponse = response.authCodeResponse;
                                // if context is thirdparty, thirdPartyAuthCodeResponse here will be the response from the provider POST /token API, else undefined
                                // TODO: post sign in up logic
                            }
                            return response;
                        }
                    }
                }
            } __END_HIGHLIGHT__
        }),
        Session.init({...})
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->