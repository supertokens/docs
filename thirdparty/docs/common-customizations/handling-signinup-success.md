---
id: handling-signinup-success
title: Post signin / signup callbacks
hide_title: true
---

# Post signin / signup callbacks

There are three customizations that can be done post sign in:
1) Redirecting the user to a specific URL
2) Handling the sign in / up event on the frontend
3) Handling the sign in / up event on the backend

## 1)  Redirecting the user to a specific URL

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS--> 
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdParty.init({
__HIGHLIGHT__           getRedirectionURL: async (context) => {
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
- Successful sign up / sign in
- Successful email verification.
- If the user is already logged in.


Please refer to the <a href="/docs/auth-react/thirdparty/callbacks#getredirectionurl" target="_blank">auth-react reference API</a> for more information on `getRedirectionURL` hook.


## 2) Handling sign in event on the frontend

This method allows you to fire events immediately after a successful sign in / up. For example to send analytics events post sign in / up.

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS--> 
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdParty.init({
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

Please refer to the <a href="/docs/auth-react/thirdparty/callbacks#onhandleevent" target="_blank">auth-react reference API</a> for more information on `onHandleEvent` hook.

## 3) Handling sign in event on the backend

### `handlePostSignUpIn`

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS--> 
```js
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        ThirdParty.init({
            signInAndUpFeature: {
__HIGHLIGHT__                handlePostSignUpIn: async (user, thirdPartyAuthCodeResponse, newUser) => {
                    let {id, email} = user;
                    // thirdPartyAuthCodeResponse is the response from the provider POST /token API.
                    // newUser is a boolean value, if true, then the user has signed up, else they have signed in.
                } __END_HIGHLIGHT__
            } 
        }),
        Session.init({...})
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

