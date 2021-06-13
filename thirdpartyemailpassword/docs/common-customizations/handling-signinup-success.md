---
id: handling-signinup-success
title: Post signin / signup callbacks
hide_title: true
---

# Post signin / signup callbacks

There are three customizations that can be done post sign in:
1) Redirecting the user to a specific URL
2) Handling the sign in / up event on the frontend (for example for analytics)
3) Handling the sign in / up event on the backend (for example for analytics)

## 1)  Redirecting the user to a specific URL

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        ThirdPartyEmailPassword.init({
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
- Successful sign up
- Successful sign in
- Successful email verification.
- If the user is already logged in.

Please refer to the <a href="/docs/auth-react/emailpassword/callbacks#getredirectionurl" target="_blank">auth-react reference API</a> for more information on `getRedirectionURL` hook.

## 2) Handling signin / signup event on the frontend

This method allows you to fire events immediately after a successful sign in / up. For example to send analytics events post sign in / up.

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


## 3) Handling signin / signup event on the backend

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

                                if (response.type === "thirdparty") {
                                    // this is the response from the OAuth 2 provider that contains their tokens or user info.
                                    let thirdPartyAuthCodeResponse = response.authCodeResponse;
                                }
                                if (input.type === "emailpassword") {
                                    // these are the input form fields values that the user used while signing up / in
                                    let formFields = input.formFields;
                                }

                                if (response.createdNewUser) {
                                    // TODO: post sign up logic
                                } else {
                                    // TODO: post sign in logic
                                }
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