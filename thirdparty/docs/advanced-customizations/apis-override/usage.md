---
id: usage
title: How to use
hide_title: true
---

# How to use

## Use the override config: [API Reference](/docs/nodejs/thirdparty/override/apis)

<!--DOCUSAURUS_CODE_TABS-->
<!--ReactJS-->
```js
SuperTokens.init({
    appInfo: {...},
    supertokens: {...},
    recipeList: [
        ThirdParty.init({
__HIGHLIGHT__            override: {
                apis: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        signInUpPOST: async (input) => {
                            // TODO: some custom logic

                            // or call the default behaviour as show below
                            return await originalImplementation.signInUpPOST(input);
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
- In the above code snippet, we override the `signInUpPOST` api of this recipe. This api will be used to handle the signInUp API route when a user either signs up or signs in.
- Likewise, we override the `verifyEmailPOST` api from the email verification recipe.