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
        EmailPassword.init({
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

## 2) Handling sign up event on the frontend

This method allows you to fire events immediately after a successful sign up. For example to send analytics events post sign up.

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->

```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        EmailPassword.init({
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

### `handlePostSignUp`

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->

```js
// backend
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        EmailPassword.init({
            signUpFeature: {
__HIGHLIGHT__                handlePostSignUp: async (user, formFields) => {
                    let {id, email} = user;
                    // TODO: Sanitize form fields and store in your DB.
                } __END_HIGHLIGHT__
            } 
        }),
        Session.init({...})
    ]
});
```

<!--END_DOCUSAURUS_CODE_TABS-->