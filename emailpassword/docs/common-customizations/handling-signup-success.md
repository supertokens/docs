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
                if (context.action === "SUCCESS" && context.isNewUser) {
                    if (context.redirectToPath !== undefined) {
                        // we are navigating back to where the user was before they authenticated
                        return context.redirectToPath;
                    }
                    return "/dashboard";
                }
                return undefined;
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

Please refer to [this page](../advanced-customizations/frontend-hooks/redirection-callback) for more information on `getRedirectionURL` hook.

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

## 3) Handling sign up event on the backend

For this, you'll have to override signUpPOST api of the EmailPassword recipe.

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->

```js
// backend
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        EmailPassword.init({
__HIGHLIGHT__            override: {
                apis: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        signUpPOST: async (input) => {
                            let response = await originalImplementation.signUpPOST(input);
                            if (response.status === "OK") {
                                let { id, email } = response.user;
                                let formFields = input.formFields;
                                // TODO: post sign up logic
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