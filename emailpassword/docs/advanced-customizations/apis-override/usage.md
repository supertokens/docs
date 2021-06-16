---
id: usage
title: How to use
hide_title: true
---

# How to use

## Use the override config: [API Reference](/docs/nodejs/emailpassword/override/apis)

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
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
                            // TODO: some custom logic

                            // or call the default behaviour as show below
                            return await originalImplementation.signUpPOST(input);
                        },
                        // ...
                        // TODO: override more apis
                    }
                },
                emailVerificationFeature: {
                    apis: (originalImplementationEmailVerification) => {
                        return {
                            ...originalImplementationEmailVerification,
                            verifyEmailPOST: async (input) => {
                                // TODO: some custom logic

                                // or call the default behaviour as show below
                                return await originalImplementationEmailVerification.verifyEmailPOST(input);
                            },
                            // ...
                            // TODO: override more apis
                        }
                    }
                }
            } __END_HIGHLIGHT__
        })
    ]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

- `originalImplementation` and `originalImplementationEmailVerification` are objects that contains apis that have the original implementation for this and the email verification recipe. They can be used in your custom apis as a way to use the SuperTokens' default behaviour.
- In the above code snippet, we override the `signUpPOST` api of this recipe. This api will be called when the user clicks the sign up button on the frontend.
- Likewise, we override the `verifyEmailPOST` api from the email verification recipe.