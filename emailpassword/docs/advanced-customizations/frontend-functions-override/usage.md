---
id: usage
title: How to use
hide_title: true
---

# How to use

## Use the override config: [API Reference](/docs/auth-react/emailpassword/override/functions)

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    recipeList: [
        EmailPassword.init({
__HIGHLIGHT__            override: {
                functions: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        signIn: async (input) => {
                            // TODO: some custom logic

                            // or call the default behaviour as show below
                            return originalImplementation.signIn(input);
                        },
                        // ...
                        // TODO: override thirdpartyemailpassword functions here
                    }
                },
                emailVerification: {
                    functions: (originalImplementationEmailVerification) => {
                        return {
                            ...originalImplementationEmailVerification,
                            isEmailVerified: async (input) => {
                                // TODO: some custom logic

                                // or call the default behaviour as show below
                                return originalImplementationEmailVerification.isEmailVerified(input);
                            },
                            // ...
                            // TODO: override emailverification functions here
                        }
                    }
                }
            } __END_HIGHLIGHT__
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

- `originalImplementation` and `originalImplementationEmailVerification` are objects that contains functions that have the original implementation for this and the email verification recipe. They can be used in your functions as a way to use the SuperTokens' default behaviour.
- In the above code snippet, we override the `signIn` function of this recipe. This means that when the user clicks the sign in button in the UI, your function will be called with the relevant `input` object.
- Likewise, we override the `isEmailVerified` function for the email verification recipe. This means that when a user signs in / up, and if email verification is in `"REQUIRED"` mode, then your function will be called to check if that user's email is verified or not.